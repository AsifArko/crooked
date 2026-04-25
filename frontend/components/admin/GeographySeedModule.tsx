"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Database,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SeedRun = {
  _id: string;
  startedAt?: string;
  finishedAt?: string;
  status?: string;
  mode?: string;
  citiesCreated?: number;
  citiesUpdated?: number;
  citiesErrors?: number;
  countriesCreated?: number;
  countriesUpdated?: number;
  remainingCountries?: string[];
  processedCountries?: Array<{
    countryCode: string;
    created: number;
    updated: number;
    errors: number;
  }>;
  log?: string[];
};

type CountryOption = { _id: string; name: string; countryCode: string };

export function GeographySeedModule({
  countryOptions,
  onComplete,
}: {
  countryOptions: CountryOption[];
  onComplete?: () => void;
}) {
  const [seedMode, setSeedMode] = useState<"countries" | "cities" | "cities_all">("countries");
  const [seedCountryCode, setSeedCountryCode] = useState("");
  const [minPopulation, setMinPopulation] = useState(0);
  const [batchSize, setBatchSize] = useState(10);
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [runs, setRuns] = useState<SeedRun[]>([]);
  const [resumableRun, setResumableRun] = useState<SeedRun | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const fetchRuns = useCallback(() => {
    return fetch("/api/admin/geography/seed-runs?limit=15")
      .then((res) => res.json())
      .then((d: { items: SeedRun[] }) => setRuns(d.items || []));
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  useEffect(() => {
    const r = runs.find(
      (x) =>
        (x.status === "running" || x.status === "partial") &&
        x.remainingCountries?.length
    );
    setResumableRun(r ?? null);
  }, [runs]);

  useEffect(() => {
    if (!seeding || !currentRunId) return;
    const interval = setInterval(fetchRuns, 3000);
    return () => clearInterval(interval);
  }, [seeding, currentRunId, fetchRuns]);

  const runSeed = useCallback(async () => {
    setSeeding(true);
    setProgress(null);
    setSeedResult(null);
    try {
      const body: Record<string, unknown> = {
        mode: seedMode,
        minPopulation,
        batchSize,
      };
      if (seedMode === "cities") body.countryCode = seedCountryCode;

      const doRequest = async (b: Record<string, unknown>) => {
        const res = await fetch("/api/admin/geography/seed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(b),
        });
        return res.json();
      };

      let json = await doRequest(body);
      if (!json.ok) throw new Error(json.error || "Seed failed");

      if (seedMode === "countries") {
        const r = json.results?.countries;
        setSeedResult(
          r
            ? `${r.created} created, ${r.updated} updated, ${r.skipped} skipped`
            : "Done"
        );
        onComplete?.();
        return;
      }

      if (seedMode === "cities" && seedCountryCode) {
        const r = json.results?.cities?.[seedCountryCode.toUpperCase()];
        setSeedResult(
          r
            ? `${r.created} created, ${r.updated} updated, ${r.errors} errors`
            : "Done"
        );
        onComplete?.();
        return;
      }

      // cities_all: batch loop
      setCurrentRunId(json.runId);
      setSelectedRunId(json.runId);
      let totalProcessed = json.processed ?? 0;
      let remaining = json.remaining ?? 0;

      while (json.runId && remaining > 0 && json.ok) {
        setCurrentRunId(json.runId);
        setProgress(
          `Processed ${totalProcessed} countries, ${remaining} remaining...`
        );
        fetchRuns();
        json = await doRequest({
          mode: "resume",
          resumeFromRunId: json.runId,
          batchSize,
        });
        if (!json.ok) throw new Error(json.error || "Resume failed");
        totalProcessed += json.processed ?? 0;
        remaining = json.remaining ?? 0;
      }

      setProgress(null);
      setCurrentRunId(null);
      setSeedResult(
        json.done
          ? `Completed. ${totalProcessed} countries processed.`
          : `Paused. ${totalProcessed} done, ${remaining} remaining. Click Resume to continue.`
      );
      fetchRuns();
      onComplete?.();
    } catch (e) {
      setProgress(null);
      setCurrentRunId(null);
      setSeedResult(`Error: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  }, [
    seedMode,
    seedCountryCode,
    minPopulation,
    batchSize,
    onComplete,
    fetchRuns,
  ]);

  const resumeSeed = useCallback(async () => {
    if (!resumableRun) return;
    setSeeding(true);
    setProgress(null);
    setSeedResult(null);
    setSelectedRunId(resumableRun._id);
    try {
      let json = await fetch("/api/admin/geography/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "resume",
          resumeFromRunId: resumableRun._id,
          batchSize,
        }),
      }).then((r) => r.json());

      if (!json.ok) throw new Error(json.error || "Resume failed");

      let totalProcessed = json.processed ?? 0;
      let remaining = json.remaining ?? 0;

      while (json.runId && remaining > 0 && json.ok) {
        setProgress(
          `Resuming... ${totalProcessed} processed, ${remaining} remaining`
        );
        json = await fetch("/api/admin/geography/seed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "resume",
            resumeFromRunId: json.runId,
            batchSize,
          }),
        }).then((r) => r.json());
        if (!json.ok) throw new Error(json.error || "Resume failed");
        totalProcessed += json.processed ?? 0;
        remaining = json.remaining ?? 0;
      }

      setProgress(null);
      setSeedResult(
        json.done
          ? `Resume complete. ${totalProcessed} countries processed.`
          : `Paused. ${totalProcessed} done, ${remaining} remaining.`
      );
      fetchRuns();
      onComplete?.();
    } catch (e) {
      setProgress(null);
      setSeedResult(`Error: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  }, [resumableRun, batchSize, onComplete, fetchRuns]);

  const formatDate = (iso: string | undefined) =>
    iso ? new Date(iso).toLocaleString() : "—";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4 text-zinc-600" />
          <span className="text-sm font-semibold text-zinc-800">
            Seed from OpenStreetMap
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 mb-4">
          Countries: ISO 3166. Cities: Overpass API (geolocation, population).
          Existing data is skipped. Interrupted runs can be resumed.
        </p>

        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Label className="text-xs font-medium text-zinc-600">Mode</Label>
            <select
              value={seedMode}
              onChange={(e) =>
                setSeedMode(e.target.value as "countries" | "cities" | "cities_all")
              }
              className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white"
            >
              <option value="countries">Seed countries only</option>
              <option value="cities">Seed cities (one country)</option>
              <option value="cities_all">Seed cities (all countries)</option>
            </select>
            {seedMode === "cities" && (
              <select
                value={seedCountryCode}
                onChange={(e) => setSeedCountryCode(e.target.value)}
                className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white min-w-[200px]"
              >
                <option value="">— Select country —</option>
                {countryOptions.map((c) => (
                  <option key={c._id} value={c.countryCode}>
                    {c.name} ({c.countryCode})
                  </option>
                ))}
              </select>
            )}
          </div>

          {seedMode !== "countries" && (
            <div className="flex flex-wrap items-center gap-4 text-[12px]">
              <div className="flex items-center gap-2">
                <Label className="text-zinc-500">Min population</Label>
                <Input
                  type="number"
                  min={0}
                  value={minPopulation}
                  onChange={(e) => setMinPopulation(parseInt(e.target.value, 10) || 0)}
                  className="h-8 w-20 text-xs"
                />
              </div>
              {seedMode === "cities_all" && (
                <div className="flex items-center gap-2">
                  <Label className="text-zinc-500">Batch size</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseInt(e.target.value, 10) || 10)}
                    className="h-8 w-16 text-xs"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {resumableRun && (
              <Button
                onClick={resumeSeed}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                disabled={seeding}
              >
                {seeding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                Resume ({resumableRun.remainingCountries?.length} left)
              </Button>
            )}
            <Button
              onClick={runSeed}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={
                seeding ||
                (seedMode === "cities" && !seedCountryCode)
              }
            >
              {seeding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {seeding ? "Running..." : "Run seed"}
            </Button>
            {progress && (
              <span className="text-[11px] text-zinc-600">{progress}</span>
            )}
            {seedResult && !progress && (
              <span
                className={cn(
                  "text-[11px]",
                  seedResult.startsWith("Error")
                    ? "text-red-600"
                    : "text-zinc-600"
                )}
              >
                {seedResult}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
          <History className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-800">Seed history</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 ml-auto text-xs"
            onClick={fetchRuns}
          >
            Refresh
          </Button>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {runs.length === 0 ? (
            <div className="py-6 text-center text-[11px] text-zinc-500">
              No seed runs yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Date
                  </th>
                  <th className="text-left py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Mode
                  </th>
                  <th className="text-left py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Status
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Cities
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr
                    key={r._id}
                    onClick={() => setSelectedRunId(selectedRunId === r._id ? null : r._id)}
                    className={cn(
                      "border-b border-zinc-100 last:border-0 cursor-pointer transition-colors",
                      selectedRunId === r._id ? "bg-blue-50/80" : "hover:bg-zinc-50/50"
                    )}
                  >
                    <td className="py-2 px-4 text-[11px] text-zinc-600">
                      {formatDate(r.startedAt)}
                    </td>
                    <td className="py-2 px-4 text-[11px] text-zinc-600 capitalize">
                      {r.mode?.replace("_", " ") ?? "—"}
                    </td>
                    <td className="py-2 px-4">
                      {r.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
                          <CheckCircle className="h-3 w-3" />
                          Done
                        </span>
                      ) : r.status === "running" || r.status === "partial" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                          <AlertCircle className="h-3 w-3" />
                          {r.remainingCountries?.length ? "Resumable" : "Running"}
                        </span>
                      ) : r.status === "failed" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-700">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500">{r.status}</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right text-[11px] font-mono text-zinc-600">
                      +{r.citiesCreated ?? 0} / ~{r.citiesUpdated ?? 0}
                    </td>
                    <td className="py-2 px-4 text-right text-[11px] font-mono text-zinc-500">
                      {r.remainingCountries?.length ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedRunId && (() => {
          const run = runs.find((r) => r._id === selectedRunId);
          if (!run?.log?.length) return null;
          return (
            <div className="border-t border-zinc-200 bg-zinc-50/50 p-4">
              <div className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider mb-2">
                Log — {run.mode ?? "—"} ({formatDate(run.startedAt)})
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[10px] text-zinc-600 max-h-40 overflow-y-auto bg-white rounded border border-zinc-200 p-3">
                {run.log.join("\n")}
              </pre>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
