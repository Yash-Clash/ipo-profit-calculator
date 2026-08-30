import { CalculationResult, InvestorPayout, IpoMetadata } from '../types';

export function formatCurrency(amount: number, currency: string = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generateTelegramSummary(
  result: CalculationResult,
  investorPayouts: InvestorPayout[],
  metadata: IpoMetadata,
  currency: string
): string {
  const isProfit = result.grossProfit >= 0;
  const ipoHeader = metadata.ipoName ? `📌 *Script:* ${metadata.ipoName}\n` : '';
  const dematHeader = metadata.dematAccount ? `🏦 *Demat Account:* ${metadata.dematAccount}\n` : '';

  let investorLines = '';
  if (investorPayouts.length > 1) {
    investorLines =
      `\n👥 *Individual Investor Settlements:*\n` +
      investorPayouts
        .map(
          (p) =>
            `• *${p.name}* (${p.sharePercent.toFixed(1)}%)\n` +
            `  Cap: ${formatCurrency(p.contributedAmount, currency)} | Profit: +${formatCurrency(p.profitShare, currency)}\n` +
            `  *Total Payout: ${formatCurrency(p.totalPayout, currency)}* (ROI: ${p.roiPercent >= 0 ? '+' : ''}${p.roiPercent.toFixed(1)}%)`
        )
        .join('\n\n') +
      '\n';
  } else if (investorPayouts.length === 1) {
    const single = investorPayouts[0];
    investorLines =
      `\n👤 *Investor Payout (${single.name}):*\n` +
      `  *Total: ${formatCurrency(single.totalPayout, currency)}* (Capital: ${formatCurrency(single.contributedAmount, currency)} + Net Gain: +${formatCurrency(single.profitShare, currency)})\n`;
  }

  return `📊 *IPO LISTING SETTLEMENT SUMMARY*
----------------------------------------
${ipoHeader}${dematHeader}🆔 *Settlement ID:* ${metadata.settlementId}
📅 *Date:* ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

💰 *Allotted Capital:* ${formatCurrency(result.allottedAmount, currency)}
📈 *Selling Value:* ${formatCurrency(result.sellingValue, currency)}
🔥 *Gross Profit:* ${isProfit ? '+' : ''}${formatCurrency(result.grossProfit, currency)} (${result.returnPercent.toFixed(2)}%)

🏷️ *Tier Applied:* ${result.activeTier.label} (${result.tierPercent}% Cut)
✂️ *Demat Holder Cut:* ${formatCurrency(result.profitCutAmount, currency)}
🛡️ *Net Profit for Investors:* ${formatCurrency(result.netProfitRemaining, currency)}
💵 *Total Investor Pool:* ${formatCurrency(result.investorRemainingAmount, currency)}
----------------------------------------${investorLines}----------------------------------------
_Settled via IPO Profit Calculator • Dev by Yash Sharma_`;
}

export function downloadSettlementCsv(
  result: CalculationResult,
  investorPayouts: InvestorPayout[],
  metadata: IpoMetadata,
  currency: string
) {
  const dateStr = new Date().toISOString().split('T')[0];
  const rows: string[][] = [
    ['IPO SETTLEMENT AUDIT REPORT'],
    ['Generated On', new Date().toLocaleString('en-IN')],
    ['Settlement ID', metadata.settlementId],
    ['Script / IPO Name', metadata.ipoName || 'N/A'],
    ['Demat Account', metadata.dematAccount || 'Default Account'],
    [],
    ['CORE FINANCIALS', 'AMOUNT (' + currency + ')'],
    ['Allotted Capital', result.allottedAmount.toFixed(2)],
    ['Total Realized Selling Value', result.sellingValue.toFixed(2)],
    ['Gross IPO Profit', result.grossProfit.toFixed(2)],
    ['Return Percentage (x%)', result.returnPercent.toFixed(2) + '%'],
    ['Active Tier Slab', result.activeTier.label],
    ['Demat Holder Commission %', result.tierPercent + '%'],
    ['Demat Holder Commission Amount', result.profitCutAmount.toFixed(2)],
    ['Net Profit Remaining for Investors', result.netProfitRemaining.toFixed(2)],
    ['Total Remaining Investor Pool', result.investorRemainingAmount.toFixed(2)],
    [],
    ['INVESTOR BREAKDOWN'],
    ['Investor Name', 'Capital Contributed (' + currency + ')', 'Share %', 'Net Profit Share (' + currency + ')', 'Total Payout (' + currency + ')', 'Net ROI %'],
  ];

  investorPayouts.forEach((inv) => {
    rows.push([
      inv.name,
      inv.contributedAmount.toFixed(2),
      inv.sharePercent.toFixed(2) + '%',
      inv.profitShare.toFixed(2),
      inv.totalPayout.toFixed(2),
      inv.roiPercent.toFixed(2) + '%',
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `IPO_Settlement_${metadata.ipoName.replace(/[^a-zA-Z0-9]/g, '_') || 'Report'}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
