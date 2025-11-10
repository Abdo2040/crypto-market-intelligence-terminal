import axios from 'axios';

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export class NewsService {
  private cache: { data: NewsItem[]; timestamp: number } = {
    data: [],
    timestamp: 0
  };
  private readonly cacheDuration = 300000; // 5 minutes

  async getLatestNews(): Promise<NewsItem[]> {
    const now = Date.now();

    if (this.cache.data.length > 0 && now - this.cache.timestamp < this.cacheDuration) {
      return this.cache.data;
    }

    try {
      // Using CryptoPanic free API (no key required for basic access)
      const response = await axios.get('https://cryptopanic.com/api/free/v1/posts/', {
        params: {
          auth_token: 'free',
          public: true,
          kind: 'news'
        }
      });

      const news: NewsItem[] = response.data.results.slice(0, 20).map((item: any) => ({
        title: item.title,
        description: item.title, // CryptoPanic doesn't provide description in free tier
        url: item.url,
        source: item.source?.title || 'Unknown',
        publishedAt: new Date(item.published_at).getTime(),
        sentiment: this.analyzeSentiment(item.title)
      }));

      this.cache = {
        data: news,
        timestamp: now
      };

      return news;
    } catch (error) {
      console.error('Error fetching news:', error);

      // Return cached or mock data
      if (this.cache.data.length > 0) {
        return this.cache.data;
      }

      return this.getMockNews();
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['surge', 'rally', 'gain', 'bullish', 'breakthrough', 'soar', 'pump'];
    const negativeWords = ['crash', 'plunge', 'drop', 'bearish', 'dump', 'fall', 'decline'];

    const textLower = text.toLowerCase();

    const hasPositive = positiveWords.some(word => textLower.includes(word));
    const hasNegative = negativeWords.some(word => textLower.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  private getMockNews(): NewsItem[] {
    const now = Date.now();
    return [
      {
        title: 'Bitcoin reaches new all-time high amid institutional adoption',
        description: 'Major institutions continue to increase their Bitcoin holdings',
        url: 'https://example.com/news1',
        source: 'CryptoNews',
        publishedAt: now - 1800000,
        sentiment: 'positive'
      },
      {
        title: 'Ethereum upgrade improves network scalability',
        description: 'Latest Ethereum upgrade shows promising results',
        url: 'https://example.com/news2',
        source: 'CoinTelegraph',
        publishedAt: now - 3600000,
        sentiment: 'positive'
      },
      {
        title: 'Regulatory concerns impact crypto market sentiment',
        description: 'New regulations being discussed in major markets',
        url: 'https://example.com/news3',
        source: 'BlockNews',
        publishedAt: now - 5400000,
        sentiment: 'negative'
      }
    ];
  }
}
