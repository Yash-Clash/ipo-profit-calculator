// Standalone test script for calculator logic
function getTier(x) {
  const eps = 1e-7;
  if (x <= 15 + eps) return 0;
  if (x <= 20 + eps) return 10;
  if (x <= 25 + eps) return 15;
  if (x <= 30 + eps) return 20;
  return 25;
}

const testCases = [
  { x: -5, expected: 0, desc: 'Loss (-5%)' },
  { x: 0, expected: 0, desc: 'Break-even (0%)' },
  { x: 10, expected: 0, desc: 'Below 15% (10%)' },
  { x: 15.0, expected: 0, desc: 'Exact threshold (15.0%)' },
  { x: 15.01, expected: 10, desc: 'Just above 15% (15.01%)' },
  { x: 18.5, expected: 10, desc: 'Between 15% and 20% (18.5%)' },
  { x: 20.0, expected: 10, desc: 'Exact threshold (20.0%)' },
  { x: 20.01, expected: 15, desc: 'Just above 20% (20.01%)' },
  { x: 23.0, expected: 15, desc: 'Between 20% and 25% (23.0%)' },
  { x: 25.0, expected: 15, desc: 'Exact threshold (25.0%)' },
  { x: 25.01, expected: 20, desc: 'Just above 25% (25.01%)' },
  { x: 28.0, expected: 20, desc: 'Between 25% and 30% (28.0%)' },
  { x: 30.0, expected: 20, desc: 'Exact threshold (30.0%)' },
  { x: 30.01, expected: 25, desc: 'Just above 30% (30.01%)' },
  { x: 50.0, expected: 25, desc: 'Well above 30% (50.0%)' },
  { x: 120.0, expected: 25, desc: 'Mega listing (120.0%)' },
];

let failed = 0;
for (const tc of testCases) {
  const result = getTier(tc.x);
  if (result !== tc.expected) {
    console.error(`❌ FAILED: ${tc.desc}: got ${result}%, expected ${tc.expected}%`);
    failed++;
  } else {
    console.log(`✅ PASSED: ${tc.desc} -> ${result}%`);
  }
}

// Check financial math for ₹15,000 retail IPO
const bid = 15000;
const sell = 18600; // profit = 3600, return = 24.0% -> Tier 15%
const profit = sell - bid;
const returnPct = (profit / bid) * 100;
const tier = getTier(returnPct);
const cut = (profit * tier) / 100;
const remaining = sell - cut;

console.log('\n--- Real Example Test ---');
console.log(`Allotted: ₹${bid}`);
console.log(`Selling: ₹${sell}`);
console.log(`Gross Profit: ₹${profit} (${returnPct.toFixed(2)}%)`);
console.log(`Tier: ${tier}%`);
console.log(`Profit Cut / Share: ₹${cut}`);
console.log(`Remaining to Investor: ₹${remaining}`);

if (tier !== 15 || cut !== 540) {
  console.error('❌ Example calculation error!');
  failed++;
} else {
  console.log('✅ Real example calculation verified: ₹540 cut on ₹3600 profit.');
}

// User-requested scenario: 2 investors pooling ₹15,000 (₹7,000 + ₹8,000)
console.log('\n--- Multi-Investor Test (₹7,000 + ₹8,000) ---');
const netProfitRemaining = profit - cut; // 3600 - 540 = 3060
const investors = [
  { name: 'Investor A', amount: 7000 },
  { name: 'Investor B', amount: 8000 }
];
const totalCap = investors.reduce((sum, i) => sum + i.amount, 0); // 15000

const payouts = investors.map(inv => {
  const sharePct = (inv.amount / totalCap) * 100;
  const profitShare = (sharePct / 100) * netProfitRemaining;
  const totalPayout = inv.amount + profitShare;
  return { ...inv, sharePct, profitShare, totalPayout };
});

console.log(`Net Profit for Investors (after Demat cut): ₹${netProfitRemaining}`);
payouts.forEach(p => {
  console.log(`- ${p.name}: Contributed ₹${p.amount} (${p.sharePct.toFixed(2)}%), Profit Share: ₹${p.profitShare.toFixed(2)}, Total Payout: ₹${p.totalPayout.toFixed(2)}`);
});

const totalInvestorPayout = payouts.reduce((sum, p) => sum + p.totalPayout, 0);
console.log(`Sum of Payouts: ₹${totalInvestorPayout.toFixed(2)} vs Expected: ₹${remaining.toFixed(2)}`);

if (Math.abs(totalInvestorPayout - remaining) > 0.01 || Math.abs(payouts[0].totalPayout - 8428) > 0.01 || Math.abs(payouts[1].totalPayout - 9632) > 0.01) {
  console.error('❌ Multi-investor payout test failed!');
  failed++;
} else {
  console.log('✅ Multi-investor payout verified: ₹8428 + ₹9632 = ₹18060.');
}


if (failed === 0) {
  console.log('\n🎉 ALL CALCULATOR TESTS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error(`\n❌ ${failed} TESTS FAILED\n`);
  process.exit(1);
}
