import Link from "next/link";
import DashboardFilters from "../../components/dashboard-filters";
import { getHomeData } from "../../lib/home-data";

type HomeTrade = {
  id: string;
  direction: "BUY" | "SELL" | string;
  tradeDate: string | Date;
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
    sector?: string | null;
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

function formatDate(value: string | Date) {
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

function SidebarLink({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-emerald-400/12 text-emerald-300"
          : "text-white/65 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-white/45">{hint}</p>
    </div>
  );
}

function WatchRow({
  title,
  subtitle,
  value,
  tone = "neutral",
}: {
  title: string;
  subtitle: string;
  value: string;
  tone?: "neutral" | "buy" | "sell";
}) {
  const toneClass =
    tone === "buy"
      ? "text-emerald-300"
      : tone === "sell"
      ? "text-red-300"
      : "text-white";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-white">{title}</p>
        <p className="mt-1 truncate text-xs text-white/45">{subtitle}</p>
      </div>
      <div className={`ml-4 text-sm font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}

const watchedTickers = [
  {
    title: "NVDA",
    subtitle: "NVIDIA Corporation",
    value: "BUY bias",
    tone: "buy" as const,
  },
  {
    title: "AAPL",
    subtitle: "Apple Inc.",
    value: "Mixed",
    tone: "neutral" as const,
  },
  {
    title: "PLTR",
    subtitle: "Palantir Technologies",
    value: "SELL risk",
    tone: "sell" as const,
  },
  {
    title: "MSFT",
    subtitle: "Microsoft Corporation",
    value: "BUY bias",
    tone: "buy" as const,
  },
];

const watchedPoliticians = [
  {
    title: "Nancy Pelosi",
    subtitle: "House · CA · Democratic",
    value: "Hot",
    tone: "buy" as const,
  },
  {
    title: "Ro Khanna",
    subtitle: "House · CA · Democratic",
    value: "Trend",
    tone: "buy" as const,
  },
  {
    title: "Dan Crenshaw",
    subtitle: "House · TX · Republican",
    value: "Watch",
    tone: "neutral" as const,
  },
  {
    title: "Marjorie Taylor Greene",
    subtitle: "House · GA · Republican",
    value: "Risk",
    tone: "sell" as const,
  },
];

type DashboardPageProps = {
  searchParams: Promise<{
    direction?: string;
    important?: string;
    late?: string;
    q?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const data = await getHomeData();
  const params = await searchParams;

  const direction = (params.direction ?? "all").toLowerCase();
  const importantOnly = params.important === "1";
  const lateOnly = params.late === "1";
  const query = (params.q ?? "").trim().toLowerCase();

  const baseTrades: HomeTrade[] = data.latestTrades ?? [];
  const topPerformance: PerformanceItem[] = (data.topPerformance as PerformanceItem[]) ?? [];
  const topActivity: ActivityItem[] = (data.topActivity as ActivityItem[]) ?? [];

  const latestTrades = baseTrades.filter((trade) => {
    if (direction === "buy" && String(trade.direction).toUpperCase() !== "BUY") return false;
    if (direction === "sell" && String(trade.direction).toUpperCase() !== "SELL") return false;
    if (importantOnly && !trade.isImportant) return false;
    if (lateOnly && !trade.isLate) return false;

    if (query) {
      const haystack = [
        trade.politician?.displayName,
        trade.politician?.state,
        trade.politician?.chamber,
        trade.politician?.party,
        trade.issuer?.ticker,
        trade.issuer?.name,
        trade.asset?.symbol,
        trade.asset?.name,
        trade.assetDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  const importantTrades = latestTrades.filter((trade) => trade.isImportant).length;
  const lateTrades = latestTrades.filter((trade) => trade.isLate).length;
  const buyCount = latestTrades.filter((trade) => String(trade.direction).toUpperCase() === "BUY").length;
  const sellCount = latestTrades.filter((trade) => String(trade.direction).toUpperCase() === "SELL").length;
  const politicianCount = new Set(
    latestTrades.map((trade) => trade.politician?.displayName).filter(Boolean)
  ).size;

  const latestSignal = latestTrades[0];
  const topPerformer = topPerformance[0];
  const topActive = topActivity[0];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-black/20 lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-semibold text-emerald-300">
                IB
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-white">
                  INSIDER BETA
                </p>
                <p className="text-xs text-white/40">Trading intelligence terminal</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 flex-col gap-8 px-4 py-6">
            <div className="space-y-2">
              <p className="px-4 text-xs uppercase tracking-[0.18em] text-white/30">Overview</p>
              <SidebarLink href="/dashboard" label="Dashboard" active />
              <SidebarLink href="/" label="Marketing home" />
              <SidebarLink href="/pricing" label="Pricing" />
            </div>

            <div className="space-y-2">
              <p className="px-4 text-xs uppercase tracking-[0.18em] text-white/30">Monitoring</p>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-medium text-white/80">Coverage status</p>
                <div className="mt-4 space-y-3 text-sm text-white/60">
                  <div className="flex items-center justify-between">
                    <span>Visible rows</span>
                    <span className="font-medium text-white">{latestTrades.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Important</span>
                    <span className="font-medium text-amber-300">{importantTrades}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Late filings</span>
                    <span className="font-medium text-white">{lateTrades}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-4">
              <p className="text-sm font-medium text-emerald-300">Safe mode</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Dashboard is now aligned to your real database schema. Watchlist is temporarily using fallback data.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/85">
                  Dashboard
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Political trading terminal
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  Querying TradeEvent, PerformanceSnapshot, ActivitySnapshot, and Testimonial from your existing database.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                  Mode: <span className="font-medium text-white">Schema-aligned</span>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-6 px-5 py-6 md:px-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="Visible trades" value={latestTrades.length} hint="Rows after current filters." />
              <MetricCard label="Important" value={importantTrades} hint="Filtered high-signal trades." />
              <MetricCard label="BUY rows" value={buyCount} hint="Buy-side rows in view." />
              <MetricCard label="SELL rows" value={sellCount} hint="Sell-side rows in view." />
              <MetricCard label="Politicians" value={politicianCount} hint="Distinct visible names." />
            </section>

            <DashboardFilters />

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03]">
                <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Latest trades</p>
                    <p className="mt-1 text-sm text-white/45">Searchable and filterable disclosure feed.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {query ? (
                      <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                        Query: {query}
                      </div>
                    ) : null}
                    {direction !== "all" ? (
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/65">
                        Direction: {direction.toUpperCase()}
                      </div>
                    ) : null}
                    {importantOnly ? (
                      <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-300">
                        Important only
                      </div>
                    ) : null}
                    {lateOnly ? (
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/65">
                        Late only
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[900px]">
                    <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
                      <div className="col-span-3">Politician</div>
                      <div className="col-span-2">Ticker</div>
                      <div className="col-span-2">Direction</div>
                      <div className="col-span-2 text-right">Amount</div>
                      <div className="col-span-3">Trade date</div>
                    </div>

                    <div className="divide-y divide-white/10">
                      {latestTrades.length > 0 ? (
                        latestTrades.map((trade) => (
                          <div key={trade.id} className="grid grid-cols-12 gap-3 px-5 py-4 text-sm text-white/85">
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
                                    String(trade.direction).toUpperCase() === "BUY"
                                      ? "bg-emerald-500/15 text-emerald-300"
                                      : "bg-red-500/15 text-red-300"
                                  }`}
                                >
                                  {String(trade.direction).toUpperCase()}
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

                            <div className="col-span-2 text-right font-medium text-white tabular-nums">
                              {formatCurrency(trade.estimatedAmount)}
                            </div>

                            <div className="col-span-3 text-white/60">{formatDate(trade.tradeDate)}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-5 py-10 text-sm text-white/50">
                          No trades match the current filters.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/80">Watchlist</p>
                      <p className="mt-1 text-sm text-white/45">Fallback list while we keep your existing database untouched.</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/65">
                      Fallback
                    </div>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">Watched tickers</p>
                      <div className="mt-3 space-y-3">
                        {watchedTickers.map((item) => (
                          <WatchRow
                            key={item.title}
                            title={item.title}
                            subtitle={item.subtitle}
                            value={item.value}
                            tone={item.tone}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">Watched politicians</p>
                      <div className="mt-3 space-y-3">
                        {watchedPoliticians.map((item) => (
                          <WatchRow
                            key={item.title}
                            title={item.title}
                            subtitle={item.subtitle}
                            value={item.value}
                            tone={item.tone}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-medium text-white/80">Top performer</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {topPerformer?.politician?.displayName ?? "No data"}
                  </h3>
                  <p className="mt-2 text-sm text-white/50">
                    {topPerformer?.politician?.chamber ?? "—"} · {topPerformer?.politician?.state ?? "—"}
                  </p>
                  <p className="mt-4 text-3xl font-semibold text-emerald-300">
                    {formatCompactNumber(topPerformer?.score)}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-medium text-white/80">Most active</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {topActive?.politician?.displayName ?? "No data"}
                  </h3>
                  <p className="mt-2 text-sm text-white/50">
                    {topActive?.politician?.chamber ?? "—"} · {topActive?.politician?.state ?? "—"}
                  </p>
                  <p className="mt-4 text-3xl font-semibold text-white">
                    {formatCompactNumber(topActive?.activityScore)}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
