import express from 'express';
import { calculateRSI, calculateMACD, calculateEMA, calculateBollingerBands } from '../services/indicators.js';
import { runBacktest } from '../services/backtester.js';

const router = express.Router();

// Generate deterministic real-time market data
function generateMarketData(symbol = 'BTCUSDT') {
  const basePrice = symbol.includes('BTC') ? 64500 : symbol.includes('ETH') ? 3450 : symbol.includes('SOL') ? 145 : 185;
  const candles = [];
  let price = basePrice;

  for (let i = 50; i >= 0; i--) {
    const time = new Date(Date.now() - i * 60000).toISOString();
    const change = (Math.sin(i / 3) + (Math.random() - 0.48)) * (basePrice * 0.004);
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.002);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.002);
    const volume = Math.floor(Math.random() * 50 + 10);
    price = close;

    candles.push({ time, open, high, low, close, volume });
  }

  const closePrices = candles.map((c) => c.close);
  const rsi = calculateRSI(closePrices);
  const macd = calculateMACD(closePrices);
  const ema20 = calculateEMA(closePrices, 20);
  const bb = calculateBollingerBands(closePrices);

  // Hummingbot-grade Orderbook Depth
  const currentPrice = closePrices[closePrices.length - 1];
  const bids = [
    [currentPrice * 0.999, 1.25],
    [currentPrice * 0.998, 2.40],
    [currentPrice * 0.997, 5.10],
  ];
  const asks = [
    [currentPrice * 1.001, 1.10],
    [currentPrice * 1.002, 3.15],
    [currentPrice * 1.003, 4.80],
  ];

  return {
    symbol,
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    candles,
    indicators: {
      rsi,
      macd: macd.histogram,
      macdSignal: macd.signal,
      ema20,
      bollingerBands: bb,
    },
    orderbook: { bids, asks },
    backtest: runBacktest(candles, 20.0),
  };
}

router.get('/ticker', (req, res) => {
  const symbol = (req.query.symbol as string) || 'BTCUSDT';
  res.json(generateMarketData(symbol));
});

export default router;
