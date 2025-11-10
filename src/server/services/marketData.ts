import axios from 'axios';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  circulating_supply: number;
  ath: number;
  ath_change_percentage: number;
  image?: string;
}

export interface MarketMovers {
  gainers: CryptoData[];
  losers: CryptoData[];
}

export class MarketDataService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheDuration = 30000; // 30 seconds

  private async fetchWithCache(key: string, fetcher: () => Promise<any>): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn(`Using stale cache for ${key} due to error:`, error);
        return cached.data;
      }
      throw error;
    }
  }

  async getTopCryptos(limit: number = 100): Promise<CryptoData[]> {
    return this.fetchWithCache(`top-${limit}`, async () => {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h,7d'
        }
      });
      return response.data;
    });
  }

  async getCryptoDetails(symbol: string): Promise<CryptoData | null> {
    try {
      const allCoins = await this.getTopCryptos(250);
      const crypto = allCoins.find(c => c.symbol.toLowerCase() === symbol.toLowerCase());

      if (!crypto) {
        return null;
      }

      return crypto;
    } catch (error) {
      console.error('Error fetching crypto details:', error);
      return null;
    }
  }

  async getMarketMovers(): Promise<MarketMovers> {
    const cryptos = await this.getTopCryptos(100);

    // Filter cryptos with market cap > $100M
    const filtered = cryptos.filter(c => c.market_cap > 100_000_000);

    // Sort by 24h change
    const sorted = [...filtered].sort((a, b) =>
      b.price_change_percentage_24h - a.price_change_percentage_24h
    );

    return {
      gainers: sorted.slice(0, 10),
      losers: sorted.slice(-10).reverse()
    };
  }

  async getBitcoinDominance(): Promise<number> {
    return this.fetchWithCache('btc-dominance', async () => {
      const response = await axios.get(`${this.baseUrl}/global`);
      return response.data.data.market_cap_percentage.btc;
    });
  }

  async getTotalMarketCap(): Promise<number> {
    return this.fetchWithCache('total-market-cap', async () => {
      const response = await axios.get(`${this.baseUrl}/global`);
      return response.data.data.total_market_cap.usd;
    });
  }

  async getVolumeData(): Promise<{ symbol: string; volume: number; volumeChange: number }[]> {
    const cryptos = await this.getTopCryptos(50);

    return cryptos.map(c => ({
      symbol: c.symbol.toUpperCase(),
      volume: c.total_volume,
      volumeChange: c.price_change_percentage_24h // Using price change as proxy for volume change
    })).sort((a, b) => b.volume - a.volume).slice(0, 20);
  }
}
