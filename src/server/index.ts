import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { MarketDataService } from './services/marketData';
import { FearGreedService } from './services/fearGreed';
import { WhaleTrackerService } from './services/whaleTracker';
import { ChainActivityService } from './services/chainActivity';
import { NewsService } from './services/news';
import { MarketSignalsService } from './services/marketSignals';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize services
const marketDataService = new MarketDataService();
const fearGreedService = new FearGreedService();
const whaleTrackerService = new WhaleTrackerService();
const chainActivityService = new ChainActivityService();
const newsService = new NewsService();
const marketSignalsService = new MarketSignalsService(marketDataService);

// Store connected clients
const clients = new Set<any>();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  // Send initial data
  sendInitialData(ws);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      await handleCommand(ws, data);
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', data: 'Invalid command' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

async function sendInitialData(ws: any) {
  try {
    const [marketData, fearGreed, whales, chainActivity, news] = await Promise.all([
      marketDataService.getTopCryptos(),
      fearGreedService.getFearGreedIndex(),
      whaleTrackerService.getRecentWhaleTransactions(),
      chainActivityService.getChainActivity(),
      newsService.getLatestNews(),
    ]);

    ws.send(JSON.stringify({ type: 'initial', data: {
      marketData,
      fearGreed,
      whales,
      chainActivity,
      news,
      signals: await marketSignalsService.detectSignals()
    }}));
  } catch (error) {
    console.error('Error sending initial data:', error);
  }
}

async function handleCommand(ws: any, { command, args }: any) {
  try {
    switch (command) {
      case 'refresh':
        await sendInitialData(ws);
        break;
      case 'details':
        if (args?.symbol) {
          const details = await marketDataService.getCryptoDetails(args.symbol);
          ws.send(JSON.stringify({ type: 'details', data: details }));
        }
        break;
      case 'whales':
        const whales = await whaleTrackerService.getRecentWhaleTransactions();
        ws.send(JSON.stringify({ type: 'whales', data: whales }));
        break;
      case 'signals':
        const signals = await marketSignalsService.detectSignals();
        ws.send(JSON.stringify({ type: 'signals', data: signals }));
        break;
      case 'help':
        ws.send(JSON.stringify({
          type: 'help',
          data: {
            commands: [
              'refresh - Refresh all data',
              'details <symbol> - Get detailed info for a crypto',
              'whales - Show recent whale transactions',
              'signals - Show current market signals',
              'clear - Clear terminal',
              'help - Show this help message'
            ]
          }
        }));
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', data: `Unknown command: ${command}` }));
    }
  } catch (error) {
    ws.send(JSON.stringify({ type: 'error', data: 'Error executing command' }));
  }
}

// Broadcast updates to all clients every 30 seconds
setInterval(async () => {
  if (clients.size === 0) return;

  try {
    const [marketData, fearGreed, signals] = await Promise.all([
      marketDataService.getTopCryptos(),
      fearGreedService.getFearGreedIndex(),
      marketSignalsService.detectSignals(),
    ]);

    const update = {
      type: 'update',
      data: { marketData, fearGreed, signals, timestamp: Date.now() }
    };

    clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(update));
      }
    });
  } catch (error) {
    console.error('Error broadcasting update:', error);
  }
}, 30000);

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Crypto Intelligence Terminal running on port ${PORT}`);
  console.log(`📊 WebSocket server ready at ws://localhost:${PORT}/ws`);
});
