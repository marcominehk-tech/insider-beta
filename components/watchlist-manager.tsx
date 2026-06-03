"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type WatchlistItem = {
  id: string;
  entityType: "POLITICIAN" | "TICKER";
  symbol: string | null;
  label: string;
  subtitle: string | null;
  notes: string | null;
};

type Props = {
  items: WatchlistItem[];
};

export default function WatchlistManager({ items }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [entityType, setEntityType] = useState<"TICKER" | "POLITICIAN">("TICKER");
  const [symbol, setSymbol] = useState("");
  const [label, setLabel] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const grouped = useMemo(() => {
    return {
      tickers: items.filter((item) => item.entityType === "TICKER"),
      politicians: items.filter((item) => item.entityType === "POLITICIAN"),
    };
  }, [items]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      entityType,
      symbol: entityType === "TICKER" ? symbol : "",
      label,
      subtitle,
      notes,
    };

    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data?.ok) {
      setError(data?.error ?? "Failed to add watchlist item");
      return;
    }

    setSymbol("");
    setLabel("");
    setSubtitle("");
    setNotes("");
    setSuccess("Watchlist item added.");

    startTransition(() => {
      router.refresh();
    });
  }

  async function handleDelete(id: string) {
    setError("");
    setSuccess("");

    const response = await fetch(`/api/watchlist/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok || !data?.ok) {
      setError(data?.error ?? "Failed to delete watchlist item");
      return;
    }

    setSuccess("Watchlist item removed.");

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">Manage watchlist</p>
          <p className="mt-1 text-sm text-white/45">
            Add and remove tickers or politicians from the database-backed watchlist.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/65">
          CRUD
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/70">
            Entity type
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as "TICKER" | "POLITICIAN")}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="TICKER">Ticker</option>
              <option value="POLITICIAN">Politician</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-white/70">
            Symbol
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder={entityType === "TICKER" ? "NVDA" : "Optional"}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/70">
            Label
            <input
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={entityType === "TICKER" ? "NVIDIA" : "Nancy Pelosi"}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
            />
          </label>

          <label className="grid gap-2 text-sm text-white/70">
            Subtitle
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Company or chamber / state / party"
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-white/70">
          Notes
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="BUY bias / Risk / Trend"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Add to watchlist"}
          </button>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {!error && success ? <p className="text-sm text-emerald-300">{success}</p> : null}
        </div>
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/30">Ticker items</p>
          <div className="mt-3 space-y-3">
            {grouped.tickers.length ? (
              grouped.tickers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{item.label}</p>
                    <p className="mt-1 truncate text-xs text-white/45">
                      {[item.symbol, item.subtitle, item.notes].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="ml-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/15"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/50">
                No ticker items yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/30">Politician items</p>
          <div className="mt-3 space-y-3">
            {grouped.politicians.length ? (
              grouped.politicians.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{item.label}</p>
                    <p className="mt-1 truncate text-xs text-white/45">
                      {[item.subtitle, item.notes].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="ml-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/15"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/50">
                No politician items yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
