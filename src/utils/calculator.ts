import { CalculationResult, Investor, InvestorPayout, TierInfo } from '../types';

export const TIERS: TierInfo[] = [
  {
    id: 1,
    label: 'x ≤ 15%',
    minGain: -Infinity,
    maxGain: 15,
    profitCutPercent: 0,
    description: '0% Profit Cut (Capital & Base Return Protected)',
    badgeColor: 'bg-slate-800/80 text-slate-300 border-slate-700',
    glowColor: 'shadow-slate-900/50',
  },
  {
    id: 2,
    label: '15% < x ≤ 20%',
    minGain: 15,
    maxGain: 20,
    profitCutPercent: 10,
    description: '10% Demat Commission Slab',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glowColor: 'shadow-emerald-950/60',
  },
  {
    id: 3,
    label: '20% < x ≤ 25%',
    minGain: 20,
    maxGain: 25,
    profitCutPercent: 15,
    description: '15% Demat Commission Slab',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glowColor: 'shadow-cyan-950/60',
  },
  {
    id: 4,
    label: '25% < x ≤ 30%',
    minGain: 25,
    maxGain: 30,
    profitCutPercent: 20,
    description: '20% Demat Commission Slab',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    glowColor: 'shadow-purple-950/60',
  },
  {
    id: 5,
    label: 'x > 30%',
    minGain: 30,
    maxGain: null,
    profitCutPercent: 25,
    description: '25% Demat Commission Slab (Super Gain Tier)',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glowColor: 'shadow-amber-950/60',
  },
];

export const INVESTOR_PALETTE = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
];

export function getTierForReturn(x: number): { tier: TierInfo; nextTier: TierInfo | null } {
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

export function calculateMarginalCut(allottedAmount: number, returnPercent: number): number {
  if (allottedAmount <= 0 || returnPercent <= 15) {
    return 0;
  }

  let totalCut = 0;
  const x = returnPercent;

  if (x > 15) {
    const gainInBracket = Math.min(x, 20) - 15;
    const profitPortion = allottedAmount * (gainInBracket / 100);
    totalCut += profitPortion * 0.10;
  }
  if (x > 20) {
    const gainInBracket = Math.min(x, 25) - 20;
    const profitPortion = allottedAmount * (gainInBracket / 100);
    totalCut += profitPortion * 0.15;
  }
  if (x > 25) {
    const gainInBracket = Math.min(x, 30) - 25;
    const profitPortion = allottedAmount * (gainInBracket / 100);
    totalCut += profitPortion * 0.20;
  }
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

  const marginalCutAmount = calculateMarginalCut(allottedAmount, returnPercent);

  let gainNeededForNextTier: number | null = null;
  let priceNeededForNextTier: number | null = null;

  if (nextTier) {
    const targetGain = nextTier.minGain;
    gainNeededForNextTier = Math.max(0, targetGain - returnPercent);
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

export function calculateInvestorPayouts(
  investors: Investor[],
  allottedAmount: number,
  netProfitRemaining: number
): InvestorPayout[] {
  const totalContributed = investors.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const baseAmount = totalContributed > 0 ? totalContributed : allottedAmount;

  return investors.map((inv, idx) => {
    const amount = Number(inv.amount) || 0;
    const sharePercent = baseAmount > 0 ? (amount / baseAmount) * 100 : 0;
    const profitShare = (sharePercent / 100) * netProfitRemaining;
    const totalPayout = amount + profitShare;
    const roiPercent = amount > 0 ? (profitShare / amount) * 100 : 0;
    const color = inv.color || INVESTOR_PALETTE[idx % INVESTOR_PALETTE.length];

    return {
      id: inv.id,
      name: inv.name.trim() || `Investor ${idx + 1}`,
      contributedAmount: amount,
      sharePercent,
      profitShare,
      totalPayout,
      roiPercent,
      color,
    };
  });
}
