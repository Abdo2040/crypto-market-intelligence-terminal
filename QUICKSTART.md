# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Start the Terminal
```bash
npm run dev
```

This starts both the backend server and frontend client.

### 3. Open Your Browser
Navigate to: **http://localhost:3000**

You should see the Crypto Market Intelligence Terminal with real-time data!

---

## What You'll See

### 📊 Six Main Panels:

1. **Real-Time Market Data** (Top 10 Cryptos)
   - Live prices
   - 24h price changes
   - Market cap rankings

2. **Fear & Greed Index** (0-100)
   - Current market sentiment
   - Visual indicator with emoji
   - Color-coded bar chart

3. **Market Signals**
   - Volume anomalies
   - Price divergences
   - Momentum shifts
   - Support/resistance alerts

4. **Whale Activity**
   - Large transactions (>$1M)
   - Accumulation/distribution patterns
   - Recent whale movements

5. **Chain Activity (TVL)**
   - Top blockchain networks
   - Total Value Locked changes
   - Protocol counts

6. **News Feed**
   - Latest crypto news
   - Sentiment analysis
   - Multiple sources

---

## Live Features

- ✅ **Auto-refresh** every 30 seconds
- ✅ **Real-time WebSocket** connection
- ✅ **Status indicator** (LIVE/OFFLINE)
- ✅ **Last update timestamp**
- ✅ **Responsive grid layout**

---

## Terminal Theme

The interface features a **Matrix-style** green-on-black terminal aesthetic:
- Green primary color (#00ff00)
- Dark background (#0a0e27)
- Glowing effects
- Monospace font

---

## Keyboard Shortcuts

- **Ctrl+C** - Stop the server
- **Ctrl+R** - Refresh browser page

---

## Troubleshooting

### Server won't start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill the process if needed
kill -9 <PID>
```

### Frontend won't load
```bash
# Check if port 3000 is in use
lsof -i :3000

# Clear browser cache and hard reload
# Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### No data showing
- Check your internet connection
- Wait a few seconds for initial data load
- Check browser console for errors (F12)
- Verify backend is running (should see "🚀 Crypto Intelligence Terminal running on port 3001")

---

## Production Build

To create a production build:

```bash
npm run build
npm start
```

Then open: **http://localhost:3001**

---

## Next Steps

1. Customize the refresh interval in `src/server/index.ts`
2. Add your favorite cryptocurrencies to track
3. Modify the terminal colors in `src/client/styles.css`
4. Add more data sources or features
5. Deploy to a cloud platform (Vercel, Heroku, etc.)

---

## Support

- Check `README.md` for detailed documentation
- Review `package.json` for available scripts
- Inspect browser console for errors
- Check terminal output for server logs

**Happy Trading! 🚀📈**
