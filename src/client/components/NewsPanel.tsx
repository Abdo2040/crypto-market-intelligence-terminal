interface NewsPanelProps {
  data?: any[];
}

function NewsPanel({ data }: NewsPanelProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '#00ff00';
      case 'negative':
        return '#ff4444';
      default:
        return '#ffbb44';
    }
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '📰';
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const topNews = data.slice(0, 6);

  return (
    <div className="terminal-panel">
      <div className="panel-header">
        📰 NEWS FEED
      </div>
      <div className="panel-content">
        {topNews.map((news, index) => (
          <div
            key={index}
            className="news-item"
            onClick={() => window.open(news.url, '_blank')}
          >
            <div className="news-title" style={{ color: getSentimentColor(news.sentiment) }}>
              {getSentimentEmoji(news.sentiment)} {news.title}
            </div>
            <div className="news-source">
              {news.source} • {formatTime(news.publishedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPanel;
