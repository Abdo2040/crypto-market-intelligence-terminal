# 🚀 Crypto Market Intelligence Terminal

A real-time terminal that answers: **"What's actually moving the market RIGHT NOW and WHY?"**

![Terminal Preview](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## Features

- 🔴 **Real-time Market Data** - Live prices for BTC, ETH, and top 100 cryptocurrencies
- 😱 **Fear & Greed Index** - Current market sentiment indicator (0-100)
- 🐋 **Whale Activity Tracking** - Monitor large transactions and accumulation/distribution patterns
- ⛓️ **Chain Activity** - Track TVL changes across major blockchain networks (DeFiLlama)
- 📈 **Market Movers** - Top gainers and losers with >$100M market cap
- 📰 **News Feed** - Latest crypto news aggregated from multiple sources
- 🎯 **Market Signals** - Intelligent detection of:
  - Price-momentum divergences
  - Volume anomalies
  - Whale patterns
  - Support/resistance levels
  - Momentum shifts

## Tech Stack

### Backend
- **Node.js + TypeScript** - Server runtime
- **Express** - HTTP server
- **WebSocket (ws)** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Custom CSS** - Matrix-style terminal theme

### Data Sources (Free APIs)
- **CoinGecko API** - Market data and prices
- **Alternative.me** - Fear & Greed Index
- **DeFiLlama API** - Chain TVL data
- **CryptoPanic API** - Crypto news aggregation

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd kaitoai-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:3000`
- WebSocket server at `ws://localhost:3001/ws`

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
kaitoai-clone/
├── src/
│   ├── server/              # Backend code
│   │   ├── index.ts         # Express + WebSocket server
│   │   └── services/        # Data fetching services
│   │       ├── marketData.ts       # CoinGecko API
│   │       ├── fearGreed.ts        # Fear & Greed Index
│   │       ├── whaleTracker.ts     # Whale transactions
│   │       ├── chainActivity.ts    # DeFiLlama TVL data
│   │       ├── news.ts             # CryptoPanic news
│   │       └── marketSignals.ts    # Signal detection
│   └── client/              # Frontend code
│       ├── App.tsx          # Main app component
│       ├── components/      # React components
│       │   ├── MarketDataPanel.tsx
│       │   ├── FearGreedPanel.tsx
│       │   ├── WhalePanel.tsx
│       │   ├── ChainActivityPanel.tsx
│       │   ├── NewsPanel.tsx
│       │   └── SignalsPanel.tsx
│       └── styles.css       # Terminal styling
├── package.json
├── tsconfig.json
├── tsconfig.server.json
└── vite.config.ts
```

## How It Works

### Real-time Updates
The terminal uses WebSocket connections to provide live updates:
- **Initial Load**: Fetches all data when you first connect
- **Auto-refresh**: Updates market data every 30 seconds
- **Event-driven**: Instantly pushes new signals and whale transactions

### Data Flow
1. Backend services fetch data from various APIs
2. Data is processed and cached to avoid rate limits
3. WebSocket server broadcasts updates to all connected clients
4. React frontend updates the UI in real-time

### Market Signals Detection
The terminal analyzes market data to detect:
- **Divergences**: When 24h and 7d price trends conflict
- **Volume Anomalies**: Unusual volume spikes (>50% change)
- **Momentum Shifts**: Strong movements in major cryptocurrencies
- **Support/Resistance**: Proximity to ATH or significant drops

## API Rate Limits

All data sources use free tiers with the following limits:
- **CoinGecko**: 10-50 calls/minute (varies)
- **Alternative.me**: No official limit
- **DeFiLlama**: No rate limit
- **CryptoPanic**: Limited to public posts

The application implements caching to minimize API calls and stay within limits.

## Development

### Run Backend Only
```bash
npm run server:dev
```

### Run Frontend Only
```bash
npm run client:dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Customization

### Update Refresh Interval
Edit `src/server/index.ts`:
```typescript
// Change from 30000 (30s) to desired interval
setInterval(async () => {
  // ...
}, 30000);
```

### Add More Cryptocurrencies
Edit `src/server/services/marketData.ts`:
```typescript
async getTopCryptos(limit: number = 100) {
  // Change limit to fetch more coins
}
```

### Customize Terminal Colors
Edit `src/client/styles.css`:
```css
body {
  background: #0a0e27;  /* Change background */
  color: #00ff00;       /* Change text color */
}
```

## Troubleshooting

### WebSocket connection fails
- Ensure backend is running on port 3001
- Check firewall settings
- Verify WebSocket URL in `App.tsx`

### API rate limit errors
- Increase cache duration in service files
- Add API keys for higher rate limits
- Implement request queuing

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear dist folder: `rm -rf dist`
- Check Node.js version: `node --version` (should be 18+)

## Future Enhancements

- [ ] Add more blockchain networks
- [ ] Implement technical indicators (RSI, MACD, etc.)
- [ ] Add portfolio tracking
- [ ] Create alert system for specific conditions
- [ ] Add historical data charts
- [ ] Implement AI-powered sentiment analysis
- [ ] Add Twitter/X integration for social sentiment

## License

MIT License - feel free to use this for your own projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- CoinGecko for market data
- Alternative.me for Fear & Greed Index
- DeFiLlama for TVL data
- CryptoPanic for news aggregation
