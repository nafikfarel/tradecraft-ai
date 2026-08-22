// Interactive HTML5 Canvas Candlestick & Indicator Chart Engine

export function drawCandlestickChart(canvasId, candles) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !candles || candles.length === 0) return;

  const ctx = canvas.getContext('2d');
  const width = (canvas.width = canvas.parentElement.clientWidth || 700);
  const height = (canvas.height = 320);

  ctx.clearRect(0, 0, width, height);

  const prices = candles.map((c) => c.close);
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const minPrice = Math.min(...candles.map((c) => c.low));
  const priceRange = maxPrice - minPrice || 1;

  const barWidth = (width - 40) / candles.length;

  // Grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    const y = (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw Candlesticks
  candles.forEach((c, idx) => {
    const x = idx * barWidth + 20;
    const isBull = c.close >= c.open;

    const openY = height - ((c.open - minPrice) / priceRange) * (height - 40) - 20;
    const closeY = height - ((c.close - minPrice) / priceRange) * (height - 40) - 20;
    const highY = height - ((c.high - minPrice) / priceRange) * (height - 40) - 20;
    const lowY = height - ((c.low - minPrice) / priceRange) * (height - 40) - 20;

    ctx.strokeStyle = isBull ? '#10b981' : '#ef4444';
    ctx.fillStyle = isBull ? '#10b981' : '#ef4444';

    // High/Low Wick
    ctx.beginPath();
    ctx.moveTo(x + barWidth / 2, highY);
    ctx.lineTo(x + barWidth / 2, lowY);
    ctx.stroke();

    // Body
    const bodyY = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
    ctx.fillRect(x + 1, bodyY, barWidth - 2, bodyHeight);
  });
}
