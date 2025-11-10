interface ChainActivityPanelProps {
  data?: any[];
}

function ChainActivityPanel({ data }: ChainActivityPanelProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
    return `$${tvl.toLocaleString()}`;
  };

  const top8Chains = data.slice(0, 8);

  return (
    <div className="terminal-panel">
      <div className="panel-header">
        ⛓️ CHAIN ACTIVITY (TVL)
      </div>
      <div className="panel-content">
        {top8Chains.map((chain, index) => (
          <div key={index} className="chain-item">
            <div>
              <div className="chain-name">{chain.name}</div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                {chain.protocols} protocols
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="chain-tvl">{formatTVL(chain.tvl)}</div>
              <div
                className={
                  chain.tvlChange24h > 0 ? 'price-positive' : 'price-negative'
                }
                style={{ fontSize: '11px' }}
              >
                {chain.tvlChange24h > 0 ? '+' : ''}
                {chain.tvlChange24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChainActivityPanel;
