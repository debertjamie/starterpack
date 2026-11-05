"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Status =
  | { state: "loading" }
  | { state: "connected"; ms: number }
  | { state: "error"; message: string };

// Errors that still prove the database answered: the probe table just doesn't exist.
const TABLE_MISSING_CODES = new Set(["PGRST205", "42P01"]);

async function checkConnection(): Promise<Status> {
  const start = performance.now();
  try {
    const { error } = await supabase
      .from("_connection_check")
      .select("*", { head: true })
      .limit(1);
    if (error && !TABLE_MISSING_CODES.has(error.code)) {
      return { state: "error", message: error.message || "Unknown error" };
    }
    return { state: "connected", ms: Math.round(performance.now() - start) };
  } catch (err) {
    return {
      state: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

export default function Home() {
  const [status, setStatus] = useState<Status>({ state: "loading" });

  const run = useCallback(() => {
    setStatus({ state: "loading" });
    checkConnection().then(setStatus);
  }, []);

  useEffect(() => {
    checkConnection().then(setStatus);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="w-full max-w-md rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Supabase starter
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Database connection status
        </p>

        <div className="mt-6 flex items-start gap-3" aria-live="polite">
          {status.state === "loading" && (
            <>
              <span className="mt-1 size-3 shrink-0 animate-pulse rounded-full bg-zinc-400" />
              <p className="text-zinc-700 dark:text-zinc-300">Connecting…</p>
            </>
          )}
          {status.state === "connected" && (
            <>
              <span className="mt-1 size-3 shrink-0 rounded-full bg-green-500" />
              <p className="text-zinc-700 dark:text-zinc-300">
                Connected to Supabase ({status.ms} ms)
              </p>
            </>
          )}
          {status.state === "error" && (
            <>
              <span className="mt-1 size-3 shrink-0 rounded-full bg-red-500" />
              <div>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Could not connect
                </p>
                <p className="mt-1 break-words font-mono text-sm text-red-600 dark:text-red-400">
                  {status.message}
                </p>
              </div>
            </>
          )}
        </div>

        <button
          onClick={run}
          disabled={status.state === "loading"}
          className="mt-6 h-10 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity disabled:opacity-50"
        >
          Retry
        </button>
      </main>
    </div>
  );
}
