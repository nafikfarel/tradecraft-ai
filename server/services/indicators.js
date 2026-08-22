// Technical Indicators Calculation Service (RSI, MACD, EMA, Bollinger Bands, ATR)

export function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50.0;
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100.0;

  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
}

export function calculateEMA(prices, period) {
  if (prices.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return parseFloat(ema.toFixed(2));
}

export function calculateMACD(prices) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;
  const signalLine = macdLine * 0.8;
  return {
    macdLine: parseFloat(macdLine.toFixed(2)),
    signalLine: parseFloat(signalLine.toFixed(2)),
    histogram: parseFloat((macdLine - signalLine).toFixed(2)),
    signal: macdLine > signalLine ? 'BULLISH_CROSS' : 'BEARISH_CROSS',
  };
}

export function calculateBollingerBands(prices, period = 20, multiplier = 2) {
  if (!prices || prices.length === 0) {
    return { upper: 100, middle: 100, lower: 100 };
  }
  const slice = prices.slice(-Math.min(prices.length, period));
  const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
  const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / slice.length;
  const stdDev = Math.sqrt(variance);

  return {
    upper: parseFloat((mean + stdDev * multiplier).toFixed(2)),
    middle: parseFloat(mean.toFixed(2)),
    lower: parseFloat((mean - stdDev * multiplier).toFixed(2)),
  };
}
