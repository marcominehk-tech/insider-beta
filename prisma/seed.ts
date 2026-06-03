import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, WatchlistType } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.trade.deleteMany();
  await prisma.topPerformance.deleteMany();
  await prisma.topActivity.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.issuer.deleteMany();
  await prisma.politician.deleteMany();

  const nancy = await prisma.politician.create({
    data: {
      slug: "nancy-pelosi",
      fullName: "Nancy Pelosi",
      displayName: "Nancy Pelosi",
      chamber: "House",
      state: "CA",
      party: "Democratic",
    },
  });

  const ro = await prisma.politician.create({
    data: {
      slug: "ro-khanna",
      fullName: "Ro Khanna",
      displayName: "Ro Khanna",
      chamber: "House",
      state: "CA",
      party: "Democratic",
    },
  });

  const crenshaw = await prisma.politician.create({
    data: {
      slug: "dan-crenshaw",
      fullName: "Dan Crenshaw",
      displayName: "Dan Crenshaw",
      chamber: "House",
      state: "TX",
      party: "Republican",
    },
  });

  const greene = await prisma.politician.create({
    data: {
      slug: "marjorie-taylor-greene",
      fullName: "Marjorie Taylor Greene",
      displayName: "Marjorie Taylor Greene",
      chamber: "House",
      state: "GA",
      party: "Republican",
    },
  });

  const nvdaIssuer = await prisma.issuer.create({
    data: {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      sector: "Semiconductors",
    },
  });

  const aaplIssuer = await prisma.issuer.create({
    data: {
      ticker: "AAPL",
      name: "Apple Inc.",
      sector: "Consumer Electronics",
    },
  });

  const pltrIssuer = await prisma.issuer.create({
    data: {
      ticker: "PLTR",
      name: "Palantir Technologies",
      sector: "Software",
    },
  });

  const msftIssuer = await prisma.issuer.create({
    data: {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      sector: "Software",
    },
  });

  const nvdaAsset = await prisma.asset.create({
    data: {
      symbol: "NVDA",
      name: "NVIDIA",
    },
  });

  const aaplAsset = await prisma.asset.create({
    data: {
      symbol: "AAPL",
      name: "Apple",
    },
  });

  const pltrAsset = await prisma.asset.create({
    data: {
      symbol: "PLTR",
      name: "Palantir",
    },
  });

  const msftAsset = await prisma.asset.create({
    data: {
      symbol: "MSFT",
      name: "Microsoft",
    },
  });

  await prisma.trade.createMany({
    data: [
      {
        source: "CONGRESS",
        entityType: "POLITICIAN",
        direction: "SELL",
        politicianId: nancy.id,
        issuerId: nvdaIssuer.id,
        assetId: nvdaAsset.id,
        rawFilingId: "raw-1",
        externalTradeId: "trade-1",
        tradeDate: new Date("2026-06-02T11:30:22.964Z"),
        disclosedDate: new Date("2026-06-04T11:30:22.964Z"),
        filedAt: new Date("2026-06-04T11:30:22.964Z"),
        quantity: "100",
        price: "100",
        amountMin: "15000",
        amountMax: "50000",
        estimatedAmount: "32500",
        ownershipType: "direct",
        postTradeShares: "1000",
        transactionCode: "S",
        assetDescription: "NVDA",
        notes: "Cluster buy candidate",
        isLate: true,
        isImportant: true,
      },
      {
        source: "CONGRESS",
        entityType: "POLITICIAN",
        direction: "BUY",
        politicianId: ro.id,
        issuerId: aaplIssuer.id,
        assetId: aaplAsset.id,
        rawFilingId: "raw-2",
        externalTradeId: "trade-2",
        tradeDate: new Date("2026-05-30T10:00:00.000Z"),
        disclosedDate: new Date("2026-06-02T10:00:00.000Z"),
        filedAt: new Date("2026-06-02T10:00:00.000Z"),
        quantity: "75",
        price: "190",
        amountMin: "10000",
        amountMax: "25000",
        estimatedAmount: "17500",
        ownershipType: "direct",
        postTradeShares: "500",
        transactionCode: "P",
        assetDescription: "AAPL",
        notes: "Momentum accumulation",
        isLate: false,
        isImportant: true,
      },
      {
        source: "CONGRESS",
        entityType: "POLITICIAN",
        direction: "SELL",
        politicianId: crenshaw.id,
        issuerId: pltrIssuer.id,
        assetId: pltrAsset.id,
        rawFilingId: "raw-3",
        externalTradeId: "trade-3",
        tradeDate: new Date("2026-05-28T09:30:00.000Z"),
        disclosedDate: new Date("2026-06-01T09:30:00.000Z"),
        filedAt: new Date("2026-06-01T09:30:00.000Z"),
        quantity: "120",
        price: "24",
        amountMin: "1000",
        amountMax: "5000",
        estimatedAmount: "3000",
        ownershipType: "direct",
        postTradeShares: "900",
        transactionCode: "S",
        assetDescription: "PLTR",
        notes: "Trimmed exposure",
        isLate: false,
        isImportant: false,
      },
      {
        source: "CONGRESS",
        entityType: "POLITICIAN",
        direction: "BUY",
        politicianId: greene.id,
        issuerId: msftIssuer.id,
        assetId: msftAsset.id,
        rawFilingId: "raw-4",
        externalTradeId: "trade-4",
        tradeDate: new Date("2026-05-25T14:00:00.000Z"),
        disclosedDate: new Date("2026-05-29T14:00:00.000Z"),
        filedAt: new Date("2026-05-29T14:00:00.000Z"),
        quantity: "40",
        price: "420",
        amountMin: "15000",
        amountMax: "50000",
        estimatedAmount: "16800",
        ownershipType: "direct",
        postTradeShares: "250",
        transactionCode: "P",
        assetDescription: "MSFT",
        notes: "Large-cap tech exposure",
        isLate: true,
        isImportant: true,
      },
    ],
  });

  await prisma.topPerformance.createMany({
    data: [
      { politicianId: nancy.id, score: "84.5", periodLabel: "12M avg return" },
      { politicianId: ro.id, score: "79.2", periodLabel: "12M avg return" },
      { politicianId: crenshaw.id, score: "72.1", periodLabel: "12M avg return" },
    ],
  });

  await prisma.topActivity.createMany({
    data: [
      { politicianId: nancy.id, activityScore: "28", periodLabel: "3M activity" },
      { politicianId: greene.id, activityScore: "24", periodLabel: "3M activity" },
      { politicianId: ro.id, activityScore: "21", periodLabel: "3M activity" },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        quote: "The product makes political trading disclosures understandable in seconds.",
        authorName: "Alex Chan",
        authorTitle: "Retail trader",
      },
      {
        quote: "I can scan notable trades quickly without opening ten different tabs.",
        authorName: "Chris Wong",
        authorTitle: "Macro-focused investor",
      },
    ],
  });

  await prisma.watchlist.createMany({
    data: [
      {
        type: WatchlistType.TICKER,
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        note: "AI leader, repeated political attention",
        signalLabel: "BUY bias",
      },
      {
        type: WatchlistType.TICKER,
        symbol: "AAPL",
        name: "Apple Inc.",
        note: "Large-cap benchmark",
        signalLabel: "Mixed",
      },
      {
        type: WatchlistType.TICKER,
        symbol: "PLTR",
        name: "Palantir Technologies",
        note: "High-volatility narrative name",
        signalLabel: "SELL risk",
      },
      {
        type: WatchlistType.TICKER,
        symbol: "MSFT",
        name: "Microsoft Corporation",
        note: "Mega-cap platform exposure",
        signalLabel: "BUY bias",
      },
      {
        type: WatchlistType.POLITICIAN,
        name: "Nancy Pelosi",
        note: "House · CA · Democratic",
        signalLabel: "Hot",
      },
      {
        type: WatchlistType.POLITICIAN,
        name: "Dan Crenshaw",
        note: "House · TX · Republican",
        signalLabel: "Watch",
      },
      {
        type: WatchlistType.POLITICIAN,
        name: "Ro Khanna",
        note: "House · CA · Democratic",
        signalLabel: "Trend",
      },
      {
        type: WatchlistType.POLITICIAN,
        name: "Marjorie Taylor Greene",
        note: "House · GA · Republican",
        signalLabel: "Risk",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
