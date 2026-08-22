// Micro-Account ($20 Starter) Auto-Compounder Calculator

export function calculateCompoundProjection(starterBalance = 20.0, winRatePct = 65, avgWinPct = 3.5, totalTrades = 30) {
  let currentBalance = starterBalance;
  const projection = [];

  for (let i = 1; i <= totalTrades; i++) {
    const riskAmount = currentBalance * 0.03; // 3% risk allocation per trade ($0.60 for $20 balance)
    const isWin = Math.random() * 100 <= winRatePct;

    if (isWin) {
      currentBalance += riskAmount * (avgWinPct / 2);
    } else {
      currentBalance -= riskAmount;
    }

    projection.push({
      tradeNumber: i,
      balance: parseFloat(currentBalance.toFixed(2)),
      riskPerTrade: parseFloat(riskAmount.toFixed(2)),
    });
  }

  return {
    starterBalance,
    finalProjectedBalance: parseFloat(currentBalance.toFixed(2)),
    totalProfitPct: parseFloat((((currentBalance - starterBalance) / starterBalance) * 100).toFixed(1)),
    maxRiskPerTradeUSD: parseFloat((starterBalance * 0.03).toFixed(2)),
    projection: projection.filter((_, idx) => idx % 5 === 0 || idx === totalTrades - 1),
  };
}
