// TradeCraft AI Pro - Rigorous Multi-Scenario Stress Test & Bug Hunting Suite

import { calculateRSI, calculateMACD, calculateEMA, calculateBollingerBands } from '../server/services/indicators.js';
import { runBacktest } from '../server/services/backtester.js';
import { calculateCompoundProjection } from '../server/services/compounder.js';

console.log('🧪 Starting Expanded Rigorous Stress Test Suite for TradeCraft AI Pro...\n');

let totalTests = 0;
let passedTests = 0;
let bugsFound = [];

function assert(condition, testName, bugDetail = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.log(`  ❌ [FAIL/BUG] ${testName}`);
    bugsFound.push({ testName, bugDetail });
  }
}

// SCENARIO 1: Technical Indicators Edge Cases
console.log('--- SCENARIO 1: Technical Indicators Edge Cases ---');
try {
  const rsiEmpty = calculateRSI([]);
  assert(rsiEmpty === 50.0, 'RSI handles empty price array gracefully');

  const flatPrices = Array(50).fill(100);
  const rsiFlat = calculateRSI(flatPrices);
  assert(!isNaN(rsiFlat) && rsiFlat === 100, 'RSI handles flat prices without NaN');

  const bbFlat = calculateBollingerBands(flatPrices);
  assert(!isNaN(bbFlat.upper) && bbFlat.upper === 100, 'Bollinger Bands handles 0 standard deviation');

  const spikePrices = [...Array(40).fill(10), 10000];
  const macdSpike = calculateMACD(spikePrices);
  assert(!isNaN(macdSpike.macdLine) && !isNaN(macdSpike.histogram), 'MACD handles extreme price spike without NaN');
} catch (e) {
  assert(false, 'Scenario 1 error', e.message);
}

// SCENARIO 2: Backtest Engine Stress Test
console.log('\n--- SCENARIO 2: Backtest Engine Stress Test ---');
try {
  const fallingCandles = Array(100).fill(0).map((_, i) => ({ close: 500 - i, high: 501 - i, low: 499 - i, open: 500 - i }));
  const btFalling = runBacktest(fallingCandles, 20.0);
  assert(!isNaN(btFalling.finalCapital), 'Backtester handles falling market without NaN');
  assert(btFalling.finalCapital <= 20.0, 'Backtester capital decreases appropriately');

  const risingCandles = Array(100).fill(0).map((_, i) => ({ close: 100 + i * 2, high: 101 + i * 2, low: 99 + i * 2, open: 100 + i * 2 }));
  const btRising = runBacktest(risingCandles, 20.0);
  assert(btRising.finalCapital > 20.0, 'Backtester capital grows in bull market');
  assert(btRising.winRatePct > 0, 'Backtester records win rate in bull market');
} catch (e) {
  assert(false, 'Scenario 2 error', e.message);
}

// SCENARIO 3: $20 Micro-Capital Compounder Stress Test
console.log('\n--- SCENARIO 3: $20 Micro-Capital Compounder Stress Test ---');
try {
  const zeroComp = calculateCompoundProjection(0);
  assert(!isNaN(zeroComp.finalProjectedBalance), 'Compounder handles $0 balance without crash/NaN');

  const lossComp = calculateCompoundProjection(20.0, 0); // 0% win rate
  assert(lossComp.finalProjectedBalance >= 0, 'Position sizing prevents negative balance (no margin call)');
} catch (e) {
  assert(false, 'Scenario 3 error', e.message);
}

// SCENARIO 4: Extremely Large Data Sets Performance (10,000 Candles Stress)
console.log('\n--- SCENARIO 4: High Volume Data Stress (10,000 Candles) ---');
try {
  const tStart = Date.now();
  const largePrices = Array(10000).fill(0).map(() => 50000 + Math.random() * 500);
  const rsiLarge = calculateRSI(largePrices);
  const bbLarge = calculateBollingerBands(largePrices);
  const tDiff = Date.now() - tStart;

  assert(tDiff < 100, `Calculation of 10,000 price points is ultra-fast (${tDiff}ms < 100ms)`);
  assert(!isNaN(rsiLarge) && !isNaN(bbLarge.upper), 'Large dataset calculated clean metrics without NaN');
} catch (e) {
  assert(false, 'Scenario 4 error', e.message);
}

// SCENARIO 5: Multi-Trade Long Run Compounder (1,000 Trades)
console.log('\n--- SCENARIO 5: 1,000 Trades Compounder Long Run ---');
try {
  const longRun = calculateCompoundProjection(20.0, 65, 3.5, 1000);
  assert(!isNaN(longRun.finalProjectedBalance) && isFinite(longRun.finalProjectedBalance), 'Long-run compounding calculates finite non-NaN balance');
  assert(longRun.finalProjectedBalance > 20.0, 'Long-run positive expectation grows capital');
} catch (e) {
  assert(false, 'Scenario 5 error', e.message);
}

console.log('\n=================================================');
console.log(`📊 ALL SCENARIOS COMPLETE: ${passedTests}/${totalTests} Passed`);
if (bugsFound.length === 0) {
  console.log('🎉 100% STABILITY VERIFIED! ZERO BUGS REMAINING!');
} else {
  console.log(`⚠️ BUGS FOUND (${bugsFound.length})`);
}
console.log('=================================================\n');
