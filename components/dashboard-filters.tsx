"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const currentDirection = searchParams.get("direction") ?? "all";
  const important = searchParams.get("important") === "1";
  const late = searchParams.get("late") === "1";

  const appliedCount = useMemo(() => {
    let count = 0;
    if (currentDirection !== "all") count += 1;
    if (important) count += 1;
    if (late) count += 1;
    if (searchParams.get("q")) count += 1;
    return count;
  }, [currentDirection, important, late, searchParams]);

  function updateParam(key: string, value?: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const next = params.toString();
    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname);
    });
  }

  function toggleFlag(key: "important" | "late") {
    const params = new URLSearchParams(searchParams.toString());
    const isOn = params.get(key) === "1";

    if (isOn) {
      params.delete(key);
    } else {
      params.set(key, "1");
    }

    const next = params.toString();
    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname);
    });
  }

  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    const next = params.toString();
    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname);
    });
  }

  function resetAll() {
    setQuery("");
    startTransition(() => {
      router.replace(pathname);
    });
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">Filters</p>
          <p className="mt-1 text-sm text-white/45">
            Narrow the feed by direction, flags, or a quick keyword search.
          </p>
        </div>

        <div className="text-sm text-white/45">
          Applied filters: <span className="font-medium text-white">{appliedCount}</span>
          {isPending ? <span className="ml-2 text-emerald-300">Updating…</span> : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <form onSubmit={submitSearch} className="flex flex-col gap-3 md:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search politician, ticker, or asset..."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-400/30"
          />
          <button
            type="submit"
            className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          {[
            { label: "All", value: "all" },
            { label: "BUY", value: "buy" },
            { label: "SELL", value: "sell" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => updateParam("direction", item.value)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                currentDirection === item.value
                  ? "bg-emerald-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.06]"
              )}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => toggleFlag("important")}
            className={cx(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              important
                ? "bg-amber-400 text-slate-950"
                : "border border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.06]"
            )}
          >
            Important only
          </button>

          <button
            type="button"
            onClick={() => toggleFlag("late")}
            className={cx(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              late
                ? "bg-white text-slate-950"
                : "border border-white/10 bg-white/[0.03] text-white/75 hover:bg-white/[0.06]"
            )}
          >
            Late only
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/[0.06]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
