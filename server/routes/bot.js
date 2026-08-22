import express from 'express';
import { calculateCompoundProjection } from '../services/compounder.js';

const router = express.Router();

router.get('/signals', (req, res) => {
  const symbol = req.query.symbol || 'BTCUSDT';
  const mockPrice = 64850.0;

  res.json({
    symbol,
    currentPrice: mockPrice,
    signal: 'BUY',
    confidence: 88,
    aiSentiment: 'Strong Bullish Trend Detected',
    stopLoss: parseFloat((mockPrice * 0.985).toFixed(2)),
    takeProfit: parseFloat((mockPrice * 1.04).toFixed(2)),
    riskRewardRatio: '1:2.6',
    recommendedPositionSizeUSD: 0.6, // 3% of $20 account
    indicators: {
      rsi: 42.5,
      macdSignal: 'BULLISH_CROSSOVER',
      emaTrend: 'ABOVE_EMA20',
    },
    timestamp: new Date().toISOString(),
  });
});

router.get('/compounder', (req, res) => {
  const rawStarter = typeof req.query.starter === 'string' ? parseFloat(req.query.starter) : 20.0;
  const starter = !isNaN(rawStarter) && rawStarter > 0 ? rawStarter : 20.0;
  res.json(calculateCompoundProjection(starter));
});

export default router;
