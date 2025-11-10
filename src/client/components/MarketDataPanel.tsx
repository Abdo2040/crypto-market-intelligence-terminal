interface MarketDataPanelProps {
  data?: any[];
}

function MarketDataPanel({ data }: MarketDataPanelProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const top10 = data.slice(0, 10);

  return (
    <div className="terminal-panel">
      <div className="panel-header">
        🔴 REAL-TIME MARKET DATA
      </div>
      <div className="panel-content">
        {top10.map((crypto) => (
          <div key={crypto.id} className="price-item">
            <div>
              <span className="crypto-symbol">
                #{crypto.market_cap_rank} {crypto.symbol.toUpperCase()}
              </span>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                {formatMarketCap(crypto.market_cap)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>{formatPrice(crypto.current_price)}</div>
              <div
                className={
                  crypto.price_change_percentage_24h > 0
                    ? 'price-positive'
                    : 'price-negative'
                }
                style={{ fontSize: '12px' }}
              >
                {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketDataPanel;
