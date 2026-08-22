import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { symbol = 'BTCUSDT', price = 64850, rsi = 45, macd = 'BULLISH', customApiKey } = req.body;
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'Gemini API key missing. Set GEMINI_API_KEY in .env or provide custom API key in terminal.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are TradeCraft AI Pro, a Quantitative Finance Specialist & Market Sentiment Analyst.
Analyze the following market condition and output an institutional strategy report:

Asset: ${symbol}
Current Price: $${price}
RSI (14): ${rsi}
MACD Status: ${macd}

Output Format:
1. Market Sentiment Summary (Bullish / Bearish / Neutral score out of 100)
2. Support & Resistance Target Price Zones
3. Recommended Risk-to-Reward Ratio & Position Sizing Strategy for a $20 Account
4. Key Actionable Recommendation`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      report: response.text || 'Analysis complete.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to generate AI analysis' });
  }
});

export default router;
