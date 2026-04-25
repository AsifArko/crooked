"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STUDIO_PATH =
  typeof process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH === "string" &&
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH.trim() !== ""
    ? `/${process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH.trim()}`
    : "/studio";

function StudioLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || STUDIO_PATH;
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/studio-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, redirect }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid password");
        return;
      }
      router.push(data.redirect ?? redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        Studio access
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Enter the access password to continue.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            required
            autoFocus
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        }
      >
        <StudioLoginForm />
      </Suspense>
    </div>
  );
}
