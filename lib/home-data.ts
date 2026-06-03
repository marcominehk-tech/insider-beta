import { prisma } from "./prisma";

function toPlainNumber(value: unknown) {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

export async function getHomeData() {
  const [latestTrades, topPerformance, topActivity, testimonials] = await Promise.all([
    prisma.tradeEvent.findMany({
      orderBy: { tradeDate: "desc" },
      take: 20,
      include: {
        Politician: true,
        Issuer: true,
        Asset: true,
      },
    }),
    prisma.performanceSnapshot.findMany({
      orderBy: [{ snapshotDate: "desc" }, { score: "desc" }],
      take: 5,
      include: {
        Politician: true,
      },
    }),
    prisma.activitySnapshot.findMany({
      orderBy: [{ snapshotDate: "desc" }, { activityScore: "desc" }],
      take: 5,
      include: {
        Politician: true,
      },
    }),
    prisma.testimonial.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
  ]);

  return {
    latestTrades: latestTrades.map((trade) => ({
      id: trade.id,
      source: trade.source,
      entityType: trade.entityType,
      direction: trade.direction,
      tradeDate: trade.tradeDate,
      disclosedDate: trade.disclosedDate,
      filedAt: trade.filedAt,
      quantity: trade.quantity?.toString() ?? null,
      price: trade.price?.toString() ?? null,
      amountMin: trade.amountMin?.toString() ?? null,
      amountMax: trade.amountMax?.toString() ?? null,
      estimatedAmount: trade.estimatedAmount?.toString() ?? null,
      ownershipType: trade.ownershipType,
      postTradeShares: trade.postTradeShares?.toString() ?? null,
      transactionCode: trade.transactionCode,
      assetDescription: trade.assetDescription,
      notes: trade.notes,
      isLate: trade.isLate,
      isImportant: trade.isImportant,
      politician: trade.Politician
        ? {
            id: trade.Politician.id,
            slug: trade.Politician.slug,
            fullName: trade.Politician.fullName,
            displayName: trade.Politician.displayName,
            chamber: trade.Politician.chamber,
            state: trade.Politician.state,
            party: trade.Politician.party,
          }
        : null,
      issuer: trade.Issuer
        ? {
            id: trade.Issuer.id,
            ticker: trade.Issuer.ticker,
            name: trade.Issuer.name,
            sector: trade.Issuer.sector,
            industry: trade.Issuer.industry,
            exchange: trade.Issuer.exchange,
          }
        : null,
      asset: trade.Asset
        ? {
            id: trade.Asset.id,
            symbol: trade.Asset.symbol,
            name: trade.Asset.name,
          }
        : null,
    })),
    topPerformance: topPerformance.map((item) => ({
      id: item.id,
      snapshotDate: item.snapshotDate,
      lookbackDays: item.lookbackDays,
      avgReturn30d: toPlainNumber(item.avgReturn30d),
      avgReturn60d: toPlainNumber(item.avgReturn60d),
      winRate: toPlainNumber(item.winRate),
      tradeCount: item.tradeCount,
      score: toPlainNumber(item.score),
      politician: item.Politician
        ? {
            id: item.Politician.id,
            slug: item.Politician.slug,
            fullName: item.Politician.fullName,
            displayName: item.Politician.displayName,
            chamber: item.Politician.chamber,
            state: item.Politician.state,
            party: item.Politician.party,
          }
        : null,
    })),
    topActivity: topActivity.map((item) => ({
      id: item.id,
      snapshotDate: item.snapshotDate,
      windowDays: item.windowDays,
      tradeCount: item.tradeCount,
      buyCount: item.buyCount,
      sellCount: item.sellCount,
      activityScore: toPlainNumber(item.activityScore),
      politician: item.Politician
        ? {
            id: item.Politician.id,
            slug: item.Politician.slug,
            fullName: item.Politician.fullName,
            displayName: item.Politician.displayName,
            chamber: item.Politician.chamber,
            state: item.Politician.state,
            party: item.Politician.party,
          }
        : null,
    })),
    testimonials: testimonials.map((item) => ({
      id: item.id,
      quote: item.quote,
      authorName: item.name,
      authorTitle: item.roleLabel,
      companyLabel: item.companyLabel,
      locale: item.locale,
    })),
  };
}
