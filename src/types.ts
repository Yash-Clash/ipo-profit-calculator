export type InputMode = 'total' | 'per_share';

export interface TierInfo {
  id: number;
  label: string;
  minGain: number; // inclusive lower bound (or exclusive depending on rule)
  maxGain: number | null; // inclusive upper bound, null for infinity
  profitCutPercent: number; // e.g. 0, 10, 15, 20, 25
  description: string;
  badgeColor: string;
}

export interface CalculationResult {
  // Core financial values
  allottedAmount: number;
  sellingValue: number;
  grossProfit: number;
  returnPercent: number; // x%

  // Tier info
  activeTier: TierInfo;
  tierPercent: number; // e.g. 10%, 15%, etc.

  // Calculated profit cut / share (strictly % of gross profit)
  profitCutAmount: number;
  investorRemainingAmount: number; // sellingValue - profitCutAmount
  netProfitRemaining: number; // grossProfit - profitCutAmount

  // Marginal calculation for reference
  marginalCutAmount: number; // progressive slab calculation for comparison

  // Next tier milestone
  nextTier: TierInfo | null;
  gainNeededForNextTier: number | null;
  priceNeededForNextTier: number | null;
}

export interface Investor {
  id: string;
  name: string;
  amount: number;
}

export interface InvestorPayout {
  id: string;
  name: string;
  contributedAmount: number;
  sharePercent: number; // percentage of total capital
  profitShare: number; // net profit share after demat cut
  totalPayout: number; // capital returned + net profit
  roiPercent: number; // return on investor's capital
}

