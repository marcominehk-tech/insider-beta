export const revalidate = 300;
import Link from "next/link";
import { getHomeData } from "../lib/home-data";

type HomeTrade = {
  id: string;
  direction: "BUY" | "SELL";
  tradeDate: string;
  estimatedAmount: string | null;
  amountMin: string | null;
  amountMax: string | null;
  assetDescription: string | null;
  isImportant: boolean;
  isLate: boolean;
  politician?: {
    displayName: string | null;
    party: string | null;
    state: string | null;
    chamber: string | null;
  } | null;
  issuer?: {
    ticker: string | null;
    name: string | null;
    sector: string | null;
  } | null;
  asset?: {
    symbol: string | null;
    name: string | null;
  } | null;
};

type PerformanceItem = {
  id: string;
  score?: string | number | null;
  politician?: {
    displayName: string | null;
    party: string | null;
    state: string | null;
    chamber: string | null;
  } | null;
};

type ActivityItem = {
  id: string;
  activityScore?: string | number | null;
  politician?: {
    displayName: string | null;
    party: string | null;
    state: string | null;
    chamber: string | null;
  } | null;
};

type TestimonialItem = {
  id: string;
  quote?: string | null;
  authorName?: string | null;
  authorTitle?: string | null;
};

function formatCurrency(value: string | null) {
  if (!value) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatCompactNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getPartyColor(party: string | null | undefined) {
  if (!party) return "text-white/45";
  if (party.toLowerCase().startsWith("dem")) return "text-blue-300";
  if (party.toLowerCase().startsWith("rep")) return "text-red-300";
  return "text-white/45";
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-white/45">{hint}</p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-2">
      <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      <p className="text-sm leading-6 text-white/60 md:text-base">{description}</p>
    </div>
  );
}

function TradeMobileCard({ trade }: { trade: HomeTrade }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">
            {trade.politician?.displayName ?? "Unknown"}
          </p>
          <p className="mt-1 text-xs text-white/45">
            {trade.politician?.chamber ?? "—"} · {trade.politician?.state ?? "—"} ·{" "}
            <span className={getPartyColor(trade.politician?.party)}>
              {trade.politician?.party ?? "Unknown"}
            </span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-white">
            {trade.issuer?.ticker ?? trade.asset?.symbol ?? "—"}
          </p>
          <p className="mt-1 text-xs text-white/45">{formatDate(trade.tradeDate)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            trade.direction === "BUY"
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-red-500/15 text-red-300"
          }`}
        >
          {trade.direction}
        </span>

        {trade.isImportant ? (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300">
            Important
          </span>
        ) : null}

        {trade.isLate ? (
          <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-medium text-white/65">
            Late
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-white/40">Amount</p>
          <p className="mt-1 font-medium text-white">
            {formatCurrency(trade.estimatedAmount)}
          </p>
        </div>
        <div>
          <p className="text-white/40">Asset</p>
          <p className="mt-1 font-medium text-white">
            {trade.issuer?.name ?? trade.assetDescription ?? "Unknown asset"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const data = await getHomeData();

  const latestTrades: HomeTrade[] = data.latestTrades ?? [];
  const topPerformance: PerformanceItem[] = (data.topPerformance as PerformanceItem[]) ?? [];
  const topActivity: ActivityItem[] = (data.topActivity as ActivityItem[]) ?? [];
  const testimonials: TestimonialItem[] = (data.testimonials as TestimonialItem[]) ?? [];

  const importantTrades = latestTrades.filter((trade) => trade.isImportant).length;
  const lateTrades = latestTrades.filter((trade) => trade.isLate).length;
  const politicianCount = new Set(
    latestTrades.map((trade) => trade.politician?.displayName).filter(Boolean)
  ).size;

  const latestSignal = latestTrades[0];
  const latestBuyCount = latestTrades.filter((trade) => trade.direction === "BUY").length;
  const latestSellCount = latestTrades.filter((trade) => trade.direction === "SELL").length;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-semibold text-emerald-300">
              IB
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-white">
                INSIDER BETA
              </p>
              <p className="text-xs text-white/40">Political trading intelligence</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <a href="#latest-trades" className="transition hover:text-white">
              Feed
            </a>
            <a href="#rankings" className="transition hover:text-white">
              Rankings
            </a>
            <a href="#testimonials" className="transition hover:text-white">
              Proof
            </a>
            <Link
              href="/pricing"
              className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 font-medium text-white/85 transition hover:bg-white/[0.08]"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_right_top,rgba(59,130,246,0.12),transparent_28%),#050816]">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:px-8 md:py-18">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300">
                Live political trading intelligence
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.02]">
                  Follow the trades that matter before the crowd catches up.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/68 md:text-lg">
                  Insider Beta converts congressional and insider disclosures into a clean,
                  ranked monitoring surface, making notable buys, sells, repeat behavior,
                  and high-attention names obvious in seconds.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  View pricing
                </Link>
                <a
                  href="#latest-trades"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
                >
                  Explore live feed
                </a>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <StatCard
                  label="Latest trades loaded"
                  value={latestTrades.length}
                  hint="Pulled directly from your seeded database."
                />
                <StatCard
                  label="Important trades"
                  value={importantTrades}
                  hint="Rows flagged as higher-signal opportunities."
                />
                <StatCard
                  label="Late disclosures"
                  value={lateTrades}
                  hint="Filings reported after the trade window."
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-medium text-white/80">Live signal panel</p>
                  <p className="mt-1 text-sm text-white/45">
                    Current database snapshot, formatted for monitoring.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Live
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Newest visible trade
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {latestSignal?.politician?.displayName ?? "No active trade"}
                      </p>
                      <p className="mt-1 text-sm text-white/45">
                        {latestSignal?.issuer?.ticker ??
                          latestSignal?.asset?.symbol ??
                          "—"}{" "}
                        · {latestSignal ? formatDate(latestSignal.tradeDate) : "—"}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        latestSignal?.direction === "BUY"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-red-500/15 text-red-300"
                      }`}
                    >
                      {latestSignal?.direction ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">BUY rows</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{latestBuyCount}</p>
                    <p className="mt-2 text-sm text-white/45">Current buy-side count in feed.</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">SELL rows</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{latestSellCount}</p>
                    <p className="mt-2 text-sm text-white/45">Current sell-side count in feed.</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                      Politicians represented
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{politicianCount}</p>
                    <p className="mt-2 text-sm text-white/45">
                      Distinct names across current rows.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                      Feed freshness
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {latestTrades[0] ? formatDate(latestTrades[0].tradeDate) : "—"}
                    </p>
                    <p className="mt-2 text-sm text-white/45">
                      Latest visible trade date in the dataset.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Product direction
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    This homepage now behaves like an intelligence surface: key stats on top,
                    actionable feed in the middle, rankings below, and enough product framing
                    to feel demo-ready instead of internal-only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-emerald-400/20 bg-emerald-400/[0.06] p-5 shadow-[0_20px_80px_rgba(16,185,129,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">
                  Mock portfolio summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  First portfolio view
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                  A small MVP step beyond watchlist CRUD: show a compact portfolio snapshot before wiring in live positions.
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Mock data
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">Total positions</p>
                <p className="mt-2 text-2xl font-semibold text-white">3</p>
                <p className="mt-2 text-sm text-white/45">Starter view for the next MVP milestone.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">Market value</p>
                <p className="mt-2 text-2xl font-semibold text-white">$12,450</p>
                <p className="mt-2 text-sm text-white/45">Illustrative value using placeholder holdings.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">Unrealized P&amp;L</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">+$420</p>
                <p className="mt-2 text-sm text-white/45">Simple mock profit and loss summary.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 md:px-8 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/45">Signal-first feed</p>
            <p className="mt-3 text-lg font-semibold text-white">
              Important trades and repeat behavior surface quickly.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/45">Readable by default</p>
            <p className="mt-3 text-lg font-semibold text-white">
              No noisy spreadsheets, no filing chaos, just useful rows.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/45">Built for monitoring</p>
            <p className="mt-3 text-lg font-semibold text-white">
              A solid base for alerts, watchlists, and ranking logic.
            </p>
          </div>
        </div>

        <section id="latest-trades" className="space-y-5">
          <SectionHeader
            eyebrow="Live feed"
            title="Latest trades"
            description="Recent disclosure rows from your seeded database, tuned for quick scanning on desktop and easier reading on mobile."
          />

          <div className="grid gap-4 md:hidden">
            {latestTrades.length > 0 ? (
              latestTrades.slice(0, 8).map((trade) => (
                <TradeMobileCard key={trade.id} trade={trade} />
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">
                No latest trades are available yet.
              </div>
            )}
          </div>

          <div className="hidden overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] md:block">
            <div className="overflow-x-auto">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-12 gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-white/40">
                  <div className="col-span-3">Politician</div>
                  <div className="col-span-2">Ticker</div>
                  <div className="col-span-2">Direction</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-3">Trade date</div>
                </div>

                <div className="divide-y divide-white/10">
                  {latestTrades.length > 0 ? (
                    latestTrades.map((trade) => (
                      <div
                        key={trade.id}
                        className="grid grid-cols-12 gap-3 px-4 py-4 text-sm text-white/85"
                      >
                        <div className="col-span-3">
                          <div className="font-medium text-white">
                            {trade.politician?.displayName ?? "Unknown"}
                          </div>
                          <div className="mt-1 text-xs text-white/45">
                            {trade.politician?.chamber ?? "—"} · {trade.politician?.state ?? "—"} ·{" "}
                            <span className={getPartyColor(trade.politician?.party)}>
                              {trade.politician?.party ?? "Independent"}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="font-medium text-white">
                            {trade.issuer?.ticker ?? trade.asset?.symbol ?? "—"}
                          </div>
                          <div className="mt-1 text-xs text-white/45">
                            {trade.issuer?.name ?? trade.assetDescription ?? "Unknown asset"}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                trade.direction === "BUY"
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-red-500/15 text-red-300"
                              }`}
                            >
                              {trade.direction}
                            </span>

                            {trade.isImportant ? (
                              <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300">
                                Important
                              </span>
                            ) : null}

                            {trade.isLate ? (
                              <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-medium text-white/65">
                                Late
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="col-span-2 font-medium text-white">
                          {formatCurrency(trade.estimatedAmount)}
                        </div>

                        <div className="col-span-3 text-white/60">
                          {formatDate(trade.tradeDate)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-10 text-sm text-white/50">
                      No latest trades are available yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="rankings" className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <SectionHeader
              eyebrow="Rankings"
              title="Top performers"
              description="A leaderboard view that can later expand into historical performance, filters, and deeper benchmarking."
            />

            <div className="grid gap-4">
              {topPerformance.length > 0 ? (
                topPerformance.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                          Rank #{index + 1}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-white">
                          {item.politician?.displayName ?? "Unknown politician"}
                        </h3>
                        <p className="mt-1 text-sm text-white/50">
                          {item.politician?.chamber ?? "—"} · {item.politician?.state ?? "—"} ·{" "}
                          <span className={getPartyColor(item.politician?.party)}>
                            {item.politician?.party ?? "Unknown party"}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">
                          Score
                        </p>
                        <p className="mt-1 text-xl font-semibold text-emerald-300">
                          {formatCompactNumber(item.score)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">
                  No performance snapshots are available yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeader
              eyebrow="Activity"
              title="Most active politicians"
              description="A fast view of the names with the strongest disclosure activity in the current observation window."
            />

            <div className="grid gap-4">
              {topActivity.length > 0 ? (
                topActivity.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                          Activity rank #{index + 1}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-white">
                          {item.politician?.displayName ?? "Unknown politician"}
                        </h3>
                        <p className="mt-1 text-sm text-white/50">
                          {item.politician?.chamber ?? "—"} · {item.politician?.state ?? "—"} ·{" "}
                          <span className={getPartyColor(item.politician?.party)}>
                            {item.politician?.party ?? "Unknown party"}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                          Activity
                        </p>
                        <p className="mt-1 text-xl font-semibold text-white">
                          {formatCompactNumber(item.activityScore)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">
                  No activity snapshots are available yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="testimonials" className="space-y-5">
          <SectionHeader
            eyebrow="Social proof"
            title="What early users say"
            description="Testimonials make the product page feel market-facing instead of only internal."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.length > 0 ? (
              testimonials.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <p className="text-sm leading-6 text-white/70">
                    “{item.quote ?? "This product makes disclosure monitoring much easier."}”
                  </p>
                  <div className="mt-6">
                    <p className="font-medium text-white">
                      {item.authorName ?? "Anonymous user"}
                    </p>
                    <p className="mt-1 text-sm text-white/45">
                      {item.authorTitle ?? "Investor"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50 md:col-span-2 xl:col-span-4">
                No published testimonials are available yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.04))] px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/85">
                Built for faster monitoring
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Turn raw disclosures into a product people can actually navigate.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/65 md:text-base">
                You already have working data, rankings, and a live feed. The next logical
                layer is watchlists, filters, alerts, and a workflow that makes signal
                discovery genuinely sticky.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                See plans
              </Link>
              <a
                href="#latest-trades"
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
              >
                Review data feed
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
