import express from 'express';

const router = express.Router();

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TradeCraft AI Pro REST API Spec',
    version: '1.0.0',
    description: 'OpenAPI 3.0 Specification for Quantitative Trading Bots & Data Integrations',
  },
  paths: {
    '/api/market/ticker': {
      get: {
        summary: 'Get real-time market candlestick data, orderbook depth, and technical indicators',
        parameters: [
          { name: 'symbol', in: 'query', schema: { type: 'string', default: 'BTCUSDT' } },
          { name: 'rsiPeriod', in: 'query', schema: { type: 'integer', default: 14 } },
        ],
        responses: {
          200: { description: 'Candlestick data and indicator metrics' },
        },
      },
    },
    '/api/v1/bot/signals': {
      get: {
        summary: 'Get AI Sentiment Signal & Risk-to-Reward parameters for automated bot trading',
        responses: {
          200: { description: 'Signal JSON payload' },
        },
      },
    },
  },
};

router.get('/openapi.json', (req, res) => {
  res.json(openApiSpec);
});

export default router;
