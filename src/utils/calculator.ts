import { CalculationResult, Investor, InvestorPayout, TierInfo } from '../types';

export const TIERS: TierInfo[] = [
  {
    id: 1,
    label: 'x ≤ 15%',
    minGain: -Infinity,
    maxGain: 15,
    profitCutPercent: 0,
    description: '0% Profit Share (Baseline/Protected)',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-700',
  },
  {
    id: 2,
    label: '15% < x ≤ 20%',
    minGain: 15,
    maxGain: 20,
    profitCutPercent: 10,
    description: '10% Profit Share',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-700',
  },
  {
    id: 3,
    label: '20% < x ≤ 25%',
    minGain: 20,
    maxGain: 25,
    profitCutPercent: 15,
    description: '15% Profit Share',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-700',
  },
  {
    id: 4,
    label: '25% < x ≤ 30%',
    minGain: 25,
    maxGain: 30,
    profitCutPercent: 20,
    description: '20% Profit Share',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-700',
  },
  {
    id: 5,
    label: 'x > 30%',
    minGain: 30,
    maxGain: null,
    profitCutPercent: 25,
    description: '25% Profit Share (Maximum)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-700',
  },
];

/**
 * Determines which tier matches a given return percentage x.
 * Rule:
 * (x <= 15)      => 0%
 * (15 < x <= 20) => 10%
 * (20 < x <= 25) => 15%
 * (25 < x <= 30) => 20%
 * (x > 30)       => 25%
 */
export function getTierForReturn(x: number): { tier: TierInfo; nextTier: TierInfo | null } {
  // Use a small epsilon for floating point comparison accuracy
  const eps = 1e-7;

  let activeIndex = 0;
  if (x <= 15 + eps) {
    activeIndex = 0;
  } else if (x <= 20 + eps) {
    activeIndex = 1;
  } else if (x <= 25 + eps) {
    activeIndex = 2;
  } else if (x <= 30 + eps) {
    activeIndex = 3;
  } else {
    activeIndex = 4;
  }

  const activeTier = TIERS[activeIndex];
  const nextTier = activeIndex < TIERS.length - 1 ? TIERS[activeIndex + 1] : null;

  return { tier: activeTier, nextTier };
}

/**
 * Calculates progressive / marginal profit share if applicable:
 * 0% on gain up to 15%
 * 10% on gain between 15% and 20%
 * 15% on gain between 20% and 25%
 * 20% on gain between 25% and 30%
 * 25% on gain above 30%
 */
export function calculateMarginalCut(allottedAmount: number, returnPercent: number): number {
  if (allottedAmount <= 0 || returnPercent <= 15) {
    return 0;
  }

  let totalCut = 0;
  const x = returnPercent;

  // Bracket 15% to 20% (max 5% gain) at 10%
  if (x > 15) {
    const gainInBracket = Math.min(x, 20) - 15;
    const profitPortion = allottedAmount * (gainInBracket / 100);
    totalCut += profitPortion * 0.10;
  }

  // Bracket 20% to 25% (max 5% gain) at 15%
  if (x > 20) {
    const gainInBracket = Math.min(x, 25) - 20;
    const profitPortion = allottedAmount * (gainInBracket / 100);
    totalCut += profitPortion * 0.15;
  }

  // Bracket 25% to 30% (max 5% gain) at 20%
  if (x > 25) {
    const gainInBracket = Math.min(x, 30) - 25;
    const profitPortion = allottedAmount * (gainInBracket / 100);
    totalCut += profitPortion * 0.20;
  }

  // Bracket > 30% at 25%
  if (x > 30) {
    const gainInBracket = x - 30;
    const profitPortion = allottedAmount * (gainInBracket / 100);
    totalCut += profitPortion * 0.25;
  }

  return totalCut;
}

export function calculateIpoProfit(
  allottedAmount: number,
  sellingValue: number
): CalculationResult {
  if (allottedAmount <= 0) {
    const defaultTier = TIERS[0];
    return {
      allottedAmount: 0,
      sellingValue: 0,
      grossProfit: 0,
      returnPercent: 0,
      activeTier: defaultTier,
      tierPercent: 0,
      profitCutAmount: 0,
      investorRemainingAmount: 0,
      netProfitRemaining: 0,
      marginalCutAmount: 0,
      nextTier: TIERS[1],
      gainNeededForNextTier: 15.01,
      priceNeededForNextTier: 0,
    };
  }

  const grossProfit = sellingValue - allottedAmount;
  const returnPercent = (grossProfit / allottedAmount) * 100;

  const { tier: activeTier, nextTier } = getTierForReturn(returnPercent);
  const tierPercent = activeTier.profitCutPercent;

  // Cut calculated strictly as % of gross profit (0 if loss)
  const profitCutAmount = grossProfit > 0 ? (grossProfit * tierPercent) / 100 : 0;

  const netProfitRemaining = grossProfit - profitCutAmount;
  const investorRemainingAmount = sellingValue - profitCutAmount;

  // Marginal calculation for reference
  const marginalCutAmount = calculateMarginalCut(allottedAmount, returnPercent);

  // Next tier threshold calculations
  let gainNeededForNextTier: number | null = null;
  let priceNeededForNextTier: number | null = null;

  if (nextTier) {
    const targetGain = nextTier.minGain;
    gainNeededForNextTier = Math.max(0, targetGain - returnPercent);
    // selling price required: allotted * (1 + targetGain / 100)
    priceNeededForNextTier = allottedAmount * (1 + targetGain / 100);
  }

  return {
    allottedAmount,
    sellingValue,
    grossProfit,
    returnPercent,
    activeTier,
    tierPercent,
    profitCutAmount,
    investorRemainingAmount,
    netProfitRemaining,
    marginalCutAmount,
    nextTier,
    gainNeededForNextTier,
    priceNeededForNextTier,
  };
}

/**
 * Calculates individual investor payouts based on their capital contribution.
 * After deducting the demat account holder's profit cut percentage according to the slabs,
 * the remaining net profit is distributed pro-rata according to each investor's contribution.
 */
export function calculateInvestorPayouts(
  investors: Investor[],
  allottedAmount: number,
  netProfitRemaining: number
): InvestorPayout[] {
  const totalContributed = investors.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const baseAmount = totalContributed > 0 ? totalContributed : allottedAmount;

  return investors.map((inv) => {
    const amount = Number(inv.amount) || 0;
    const sharePercent = baseAmount > 0 ? (amount / baseAmount) * 100 : 0;
    const profitShare = (sharePercent / 100) * netProfitRemaining;
    const totalPayout = amount + profitShare;
    const roiPercent = amount > 0 ? (profitShare / amount) * 100 : 0;

    return {
      id: inv.id,
      name: inv.name.trim() || 'Unnamed Investor',
      contributedAmount: amount,
      sharePercent,
      profitShare,
      totalPayout,
      roiPercent,
    };
  });
}
