import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import {
  seedCountries,
  seedCitiesForCountry,
  getSeedableCountryCodes,
} from "@/lib/geography/seed";
import countriesData from "@/lib/countries-data.json";

type CountryRow = { name: string; "alpha-2": string };
const COUNTRIES = countriesData as CountryRow[];

function getCountryName(code: string): string {
  const row = COUNTRIES.find((r) => r["alpha-2"]?.toUpperCase() === code.toUpperCase());
  return row?.name ?? code;
}

export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 min per batch

type SeedRunDoc = {
  _id: string;
  startedAt?: string;
  status?: string;
  remainingCountries?: string[];
  processedCountries?: Array<{ countryCode: string; created: number; updated: number; errors: number }>;
  citiesCreated?: number;
  citiesUpdated?: number;
  citiesErrors?: number;
  log?: string[];
};

/**
 * POST /api/admin/geography/seed
 *
 * Modes:
 * - countries: Seed all countries from ISO 3166
 * - cities: Seed cities for one country (countryCode required)
 * - cities_all: Seed cities for all countries in batches (batch processing)
 * - cities_batch: Seed cities for specific countries (countryCodes array)
 * - resume: Resume interrupted run (resumeFromRunId required)
 *
 * Failsafe: Skips existing data. Resume picks up from last processed country.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const mode = body?.mode ?? "countries";
    const countryCode = body?.countryCode?.trim();
    const countryCodes = Array.isArray(body?.countryCodes)
      ? body.countryCodes.map((c: string) => String(c).trim().toUpperCase()).filter(Boolean)
      : undefined;
    const resumeFromRunId = body?.resumeFromRunId?.trim();
    const minPopulation = typeof body?.minPopulation === "number" ? body.minPopulation : 0;
    const limit = typeof body?.limit === "number" && body.limit > 0 ? body.limit : undefined;
    const batchSize = Math.min(15, Math.max(1, parseInt(body?.batchSize, 10) || 10));

    // Validate
    if (mode === "cities" && !countryCode) {
      return NextResponse.json(
        { error: "countryCode is required when mode is 'cities'" },
        { status: 400 }
      );
    }
    if (mode === "resume" && !resumeFromRunId) {
      return NextResponse.json(
        { error: "resumeFromRunId is required when mode is 'resume'" },
        { status: 400 }
      );
    }

    const results: Record<string, unknown> = {};
    let runId: string | undefined;

    // --- COUNTRIES ---
    if (mode === "countries") {
      console.log("[Geography Seed] Starting countries seed...");
      const r = await seedCountries(writeClient);
      console.log(
        `[Geography Seed] Countries done: ${r.created} created, ${r.updated} updated, ${r.skipped} skipped`
      );
      results.countries = r;
      return NextResponse.json({ ok: true, results });
    }

    // --- CITIES: single country ---
    if (mode === "cities" && countryCode) {
      const code = countryCode.toUpperCase();
      console.log(`[Geography Seed] Starting cities seed for ${code}...`);
      const r = await seedCitiesForCountry(writeClient, code, {
        minPopulation,
        limit,
      });
      console.log(
        `[Geography Seed] ${code} done: ${r.created} created, ${r.updated} updated, ${r.errors} errors`
      );
      results.cities = { [code]: r };
      return NextResponse.json({ ok: true, results });
    }

    // --- CITIES: batch or all or resume ---
    let codesToProcess: string[];

    if (mode === "resume" && resumeFromRunId) {
      const run = await client.fetch<SeedRunDoc | null>(
        `*[_type == "geographySeedRun" && _id == $id][0]`,
        { id: resumeFromRunId }
      );
      if (!run || !run.remainingCountries?.length) {
        return NextResponse.json(
          { error: "No run found or no remaining countries to process" },
          { status: 400 }
        );
      }
      codesToProcess = run.remainingCountries.slice(0, batchSize);
      runId = resumeFromRunId;
      const resumeLog = [
        `[${new Date().toISOString()}] Resuming geography seed...`,
        `  Processing batch: ${codesToProcess.map((c) => `${c} (${getCountryName(c)})`).join(", ")}`,
        `  ${run.remainingCountries?.length ?? 0} countries remaining after this batch`,
      ];
      const existingLog = run.log ?? [];
      await writeClient.patch(runId).set({ log: [...existingLog, ...resumeLog] }).commit();
    } else if (mode === "cities_batch" && countryCodes?.length) {
      const existing = await client.fetch<string[]>(
        `*[_type == "country"].countryCode`
      );
      const valid = new Set(existing.map((c: string) => c?.toUpperCase()).filter(Boolean));
      codesToProcess = countryCodes.filter((c: string) => valid.has(c));
    } else if (mode === "cities_all") {
      const existing = await client.fetch<string[]>(
        `*[_type == "country"].countryCode`
      );
      const valid = new Set(existing.map((c: string) => c?.toUpperCase()).filter(Boolean));
      const seedable = getSeedableCountryCodes().filter((c: string) => valid.has(c));
      codesToProcess = seedable.slice(0, batchSize);
      // Create new run for tracking
      const run = await writeClient.create({
        _type: "geographySeedRun",
        startedAt: new Date().toISOString(),
        status: "running",
        mode: "cities_all",
        params: { minPopulation, limit, batchSize },
        processedCountries: [],
        remainingCountries: seedable.slice(batchSize),
        citiesCreated: 0,
        citiesUpdated: 0,
        citiesErrors: 0,
      });
      runId = run._id;
      const initLog = [
        `[${new Date().toISOString()}] Geography seed started: cities_all mode`,
        `  Batch size: ${batchSize}, minPopulation: ${minPopulation}`,
        `  Total countries to process: ${seedable.length}`,
        `  Upcoming batch: ${codesToProcess.map((c) => `${c} (${getCountryName(c)})`).join(", ")}`,
      ];
      await writeClient.patch(runId).set({ log: initLog }).commit();
    } else {
      return NextResponse.json(
        { error: "Invalid mode or missing params" },
        { status: 400 }
      );
    }

    if (codesToProcess.length === 0) {
      return NextResponse.json({
        ok: true,
        results: { cities: {}, message: "No countries to process" },
        runId,
        done: true,
      });
    }

    const cityResults: Record<string, { created: number; updated: number; errors: number }> = {};
    let totalCreated = 0;
    let totalUpdated = 0;
    let totalErrors = 0;
    const processed: Array<{ countryCode: string; created: number; updated: number; errors: number }> = [];

    for (let i = 0; i < codesToProcess.length; i++) {
      const code = codesToProcess[i];
      const countryName = getCountryName(code);
      const progress = `[${i + 1}/${codesToProcess.length}]`;
      console.log(`[Geography Seed] ${progress} Crawling ${code} (${countryName})...`);
      try {
        const r = await seedCitiesForCountry(writeClient, code, {
          minPopulation,
          limit,
        });
        cityResults[code] = r;
        processed.push({ countryCode: code, ...r });
        totalCreated += r.created;
        totalUpdated += r.updated;
        totalErrors += r.errors;
        console.log(
          `[Geography Seed] ${progress} ${code} done: +${r.created} created, ~${r.updated} updated, ${r.errors} errors`
        );
      } catch (e) {
        cityResults[code] = { created: 0, updated: 0, errors: 1 };
        processed.push({ countryCode: code, created: 0, updated: 0, errors: 1 });
        totalErrors += 1;
        console.error(`[Geography Seed] ${progress} ${code} failed:`, e);
      }
    }

    results.cities = cityResults;

    let remainingCount = 0;

    // Update run document
    if (runId) {
      const run = await client.fetch<SeedRunDoc | null>(
        `*[_type == "geographySeedRun" && _id == $id][0]`,
        { id: runId }
      );
      if (run) {
        const existingProcessed = run.processedCountries ?? [];
        const allProcessed = [...existingProcessed, ...processed];
        // Resume: we consumed first batchSize from remainingCountries
        const remaining =
          mode === "resume"
            ? (run.remainingCountries ?? []).slice(batchSize)
            : (run.remainingCountries ?? []);
        remainingCount = remaining.length;
        const isDone = remainingCount === 0;

        const batchLogEntries = processed.flatMap((p) => [
          `  ${p.countryCode} (${getCountryName(p.countryCode)}): +${p.created} created, ~${p.updated} updated, ${p.errors} errors`,
        ]);
        const summaryLog = [
          `[${new Date().toISOString()}] Batch complete: ${codesToProcess.length} countries processed`,
          ...batchLogEntries,
          `  Total so far: ${(run.citiesCreated ?? 0) + totalCreated} created, ${(run.citiesUpdated ?? 0) + totalUpdated} updated`,
          isDone
            ? `[${new Date().toISOString()}] Geography seed completed. ${allProcessed.length} countries done.`
            : `  Remaining: ${remainingCount} countries (${remaining.slice(0, 5).join(", ")}${remaining.length > 5 ? "..." : ""})`,
        ];
        const existingLog = run.log ?? [];
        const newLog = [...existingLog, ...summaryLog];

        await writeClient
          .patch(runId)
          .set({
            processedCountries: allProcessed,
            remainingCountries: remaining,
            lastProcessedCountry: codesToProcess[codesToProcess.length - 1],
            citiesCreated: (run.citiesCreated ?? 0) + totalCreated,
            citiesUpdated: (run.citiesUpdated ?? 0) + totalUpdated,
            citiesErrors: (run.citiesErrors ?? 0) + totalErrors,
            status: isDone ? "completed" : "running",
            finishedAt: isDone ? new Date().toISOString() : undefined,
            durationMs: isDone
              ? Date.now() - new Date(run.startedAt || Date.now()).getTime()
              : undefined,
            log: newLog,
          })
          .commit();
      }
    }

    return NextResponse.json({
      ok: true,
      results,
      runId,
      processed: codesToProcess.length,
      remaining: remainingCount,
      done: !runId || remainingCount === 0,
    });
  } catch (error) {
    console.error("Geography seed error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
