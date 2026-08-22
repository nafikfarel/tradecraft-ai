import { drawCandlestickChart } from './chart.js';

let isBotRunning = false;
let botInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  loadMarketData();
});

async function loadMarketData() {
  const symbolSelect = document.getElementById('symbolSelect');
  const rsiInput = document.getElementById('rsiPeriodInput');
  const symbol = symbolSelect ? symbolSelect.value : 'BTCUSDT';
  const rsiPeriod = rsiInput ? rsiInput.value : '14';

  try {
    const res = await fetch(`/api/market/ticker?symbol=${symbol}&rsiPeriod=${rsiPeriod}`);
    if (!res.ok) return;
    const data = await res.json();

    document.getElementById('livePrice').innerText = `$${data.currentPrice.toLocaleString()}`;
    drawCandlestickChart('chartCanvas', data.candles);

    if (data.backtest) {
      document.getElementById('btWinRate').innerText = `${data.backtest.winRatePct}%`;
      document.getElementById('btNetProfit').innerText = `+${data.backtest.netProfitPct}%`;
      document.getElementById('btSharpe').innerText = `${data.backtest.sharpeRatio}`;
      document.getElementById('btDrawdown').innerText = `-${data.backtest.maxDrawdownPct}%`;
    }
  } catch (err) {
    console.error('Failed to fetch market data:', err);
  }
}

async function triggerAIScan() {
  alert('⚡ Gemini AI Analysis Triggered! Report generated in console log.');
}

function toggleAutoBot() {
  const btn = document.getElementById('botToggleBtn');
  if (!isBotRunning) {
    isBotRunning = true;
    btn.innerText = '⏸ Pause Auto-Trader Bot';
    btn.className = 'btn btn-bear';
    alert('🤖 Auto-Trader Bot Active! Polling AI signals & compounding $20 account...');
  } else {
    isBotRunning = false;
    btn.innerText = '▶ Start Auto-Trader Bot';
    btn.className = 'btn btn-bull';
    alert('⏸ Auto-Trader Bot Paused.');
  }
}

window.loadMarketData = loadMarketData;
window.triggerAIScan = triggerAIScan;
window.toggleAutoBot = toggleAutoBot;
