interface WhalePanelProps {
  data?: any[];
}

function WhalePanel({ data }: WhalePanelProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    return `$${amount.toLocaleString()}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'accumulation':
        return '📈';
      case 'distribution':
        return '📉';
      default:
        return '↔️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'accumulation':
        return '#00ff00';
      case 'distribution':
        return '#ff4444';
      default:
        return '#ffbb44';
    }
  };

  const recentWhales = data.slice(0, 8);

  return (
    <div className="terminal-panel">
      <div className="panel-header">
        🐋 WHALE ACTIVITY
      </div>
      <div className="panel-content">
        {recentWhales.map((whale, index) => (
          <div key={index} className="whale-transaction">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: getTypeColor(whale.type) }}>
                {getTypeEmoji(whale.type)} {whale.type.toUpperCase()}
              </span>
              <span className="whale-amount">
                {formatAmount(whale.amountUsd)}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#888' }}>
              {whale.symbol} on {whale.blockchain}
            </div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>
              {formatAddress(whale.from)} → {formatAddress(whale.to)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhalePanel;
