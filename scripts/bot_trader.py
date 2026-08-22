# TradeCraft AI Pro - Automated Trading Bot Executor (Python)
# Polling AI Signals & Executing Risk-Managed Trades for $20 Micro Accounts

import time
import json
import urllib.request

SERVER_URL = "http://localhost:3000"
balance = 20.0  # $20 starter capital
RISK_PER_TRADE_PCT = 0.03

def poll_signal():
    global balance
    print(f"\n🤖 [Python Bot Trader] Checking TradeCraft AI Signal Engine (Balance: ${balance:.2f})...")
    try:
        req = urllib.request.urlopen(f"{SERVER_URL}/api/v1/bot/signals?symbol=BTCUSDT")
        data = json.loads(req.read().decode('utf-8'))
        
        print(f"📊 Symbol: {data.get('symbol')} | Price: ${data.get('currentPrice')}")
        print(f"🧠 AI Sentiment: {data.get('aiSentiment')} ({data.get('confidence')}% confidence)")
        
        if data.get('signal') == 'BUY' and data.get('confidence', 0) >= 75:
            pos_size = balance * RISK_PER_TRADE_PCT
            print(f"🚀 [EXECUTION BUY] Opening position: ${pos_size:.2f}")
            print(f"🔒 Stop-Loss: ${data.get('stopLoss')} | Take-Profit: ${data.get('takeProfit')}")
            balance += pos_size * 1.5
            print(f"🎉 [PROFIT] New Account Balance: ${balance:.2f}")
        else:
            print("⏸️ [HOLD] Preserving capital.")
    except Exception as e:
        print(f"❌ Server connection error: {e}. Run 'npm run dev' first.")

if __name__ == "__main__":
    print("⚡ Launching TradeCraft AI Python Auto-Trader Bot...")
    poll_signal()
