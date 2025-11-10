import { useState, useEffect, useRef } from 'react';
import MarketDataPanel from './components/MarketDataPanel';
import FearGreedPanel from './components/FearGreedPanel';
import WhalePanel from './components/WhalePanel';
import ChainActivityPanel from './components/ChainActivityPanel';
import NewsPanel from './components/NewsPanel';
import SignalsPanel from './components/SignalsPanel';

interface TerminalData {
  marketData?: any[];
  fearGreed?: any;
  whales?: any[];
  chainActivity?: any[];
  news?: any[];
  signals?: any[];
}

function App() {
  const [data, setData] = useState<TerminalData>({});
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = import.meta.env.DEV
      ? 'ws://localhost:3001/ws'
      : `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);

      // Reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;
  };

  const handleMessage = (message: any) => {
    setLastUpdate(new Date());

    switch (message.type) {
      case 'initial':
        setData(message.data);
        break;
      case 'update':
        setData(prev => ({ ...prev, ...message.data }));
        break;
      case 'details':
      case 'whales':
      case 'signals':
        setData(prev => ({ ...prev, [message.type]: message.data }));
        break;
      default:
        console.log('Received:', message);
    }
  };

  const sendCommand = (command: string, args?: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command, args }));
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">
          🚀 CRYPTO MARKET INTELLIGENCE TERMINAL
        </div>
        <div className="terminal-status">
          <div className={`status-dot ${connected ? '' : 'offline'}`}></div>
          <span>{connected ? 'LIVE' : 'OFFLINE'}</span>
          <span>|</span>
          <span>Last Update: {formatTime(lastUpdate)}</span>
        </div>
      </div>

      <div className="terminal-content">
        {!data.marketData ? (
          <div className="loading">
            Initializing market intelligence systems...
          </div>
        ) : (
          <>
            <MarketDataPanel data={data.marketData} />
            <FearGreedPanel data={data.fearGreed} />
            <SignalsPanel data={data.signals} />
            <WhalePanel data={data.whales} />
            <ChainActivityPanel data={data.chainActivity} />
            <NewsPanel data={data.news} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
