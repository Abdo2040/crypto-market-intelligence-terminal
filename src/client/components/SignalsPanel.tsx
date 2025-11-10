interface SignalsPanelProps {
  data?: any[];
}

function SignalsPanel({ data }: SignalsPanelProps) {
  if (!data || data.length === 0) {
    return (
      <div className="terminal-panel">
        <div className="panel-header">
          🎯 MARKET SIGNALS
        </div>
        <div className="panel-content" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No significant signals detected
        </div>
      </div>
    );
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'divergence':
        return '⚡';
      case 'volume_anomaly':
        return '📊';
      case 'whale_pattern':
        return '🐋';
      case 'momentum':
        return '🚀';
      case 'support_resistance':
        return '🎯';
      default:
        return '📍';
    }
  };

  const topSignals = data.slice(0, 8);

  return (
    <div className="terminal-panel">
      <div className="panel-header">
        🎯 MARKET SIGNALS
      </div>
      <div className="panel-content">
        {topSignals.map((signal, index) => (
          <div
            key={index}
            className={`signal-item signal-${signal.severity}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="signal-type">
                {getTypeEmoji(signal.type)} {signal.type.replace('_', ' ')}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#00ccff' }}>
                {signal.symbol}
              </span>
            </div>
            <div className="signal-message">
              {signal.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SignalsPanel;
