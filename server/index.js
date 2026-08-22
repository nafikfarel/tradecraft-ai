import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import marketRoutes from './routes/market.js';
import botRoutes from './routes/bot.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/market', marketRoutes);
app.use('/api/v1/bot', botRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TradeCraft AI Pro Server', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`📈 TradeCraft AI Pro Terminal listening on http://localhost:${PORT}`);
});
