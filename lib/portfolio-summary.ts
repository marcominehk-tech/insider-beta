export type PortfolioSummary = {
  totalPositions: number;
  marketValue: string;
  unrealizedPnL: string;
  unrealizedPnLLabel: string;
  positionsNote: string;
  marketValueNote: string;
  pnlNote: string;
};

export function getMockPortfolioSummary(): PortfolioSummary {
  return {
    totalPositions: 3,
    marketValue: "$12,450",
    unrealizedPnL: "+$1,284",
    unrealizedPnLLabel: "Unrealized P&L",
    positionsNote: "Starter view for the next MVP milestone.",
    marketValueNote: "Illustrative value using placeholder holdings.",
    pnlNote: "Simple performance layer before live position sync.",
  };
}
