interface FearGreedPanelProps {
  data?: {
    value: number;
    classification: string;
    timestamp: number;
  };
}

function FearGreedPanel({ data }: FearGreedPanelProps) {
  if (!data) {
    return null;
  }

  const getColor = (value: number) => {
    if (value <= 20) return '#ff4444';
    if (value <= 40) return '#ff8844';
    if (value <= 60) return '#ffbb44';
    if (value <= 80) return '#88ff44';
    return '#44ff44';
  };

  const getEmoji = (value: number) => {
    if (value <= 20) return '😱';
    if (value <= 40) return '😰';
    if (value <= 60) return '😐';
    if (value <= 80) return '🤑';
    return '🚀';
  };

  const color = getColor(data.value);

  return (
    <div className="terminal-panel">
      <div className="panel-header">
        😱 FEAR & GREED INDEX
      </div>
      <div className="panel-content">
        <div className="fear-greed-display">
          <div style={{ fontSize: '64px' }}>
            {getEmoji(data.value)}
          </div>
          <div className="fear-greed-value" style={{ color }}>
            {data.value}
          </div>
          <div className="fear-greed-label" style={{ color }}>
            {data.classification.toUpperCase()}
          </div>
          <div className="fear-greed-bar">
            <div
              className="fear-greed-fill"
              style={{
                width: `${data.value}%`,
                background: color,
                color: color
              }}
            />
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>
            Market sentiment indicator (0-100)
          </div>
        </div>
      </div>
    </div>
  );
}

export default FearGreedPanel;
