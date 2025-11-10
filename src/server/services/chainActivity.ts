import axios from 'axios';

export interface ChainData {
  name: string;
  tvl: number;
  tvlChange24h: number;
  protocols: number;
  dominance: number;
}

export class ChainActivityService {
  private readonly defiLlamaUrl = 'https://api.llama.fi';
  private cache: { data: ChainData[]; timestamp: number } = {
    data: [],
    timestamp: 0
  };
  private readonly cacheDuration = 300000; // 5 minutes

  async getChainActivity(): Promise<ChainData[]> {
    const now = Date.now();

    if (this.cache.data.length > 0 && now - this.cache.timestamp < this.cacheDuration) {
      return this.cache.data;
    }

    try {
      const response = await axios.get(`${this.defiLlamaUrl}/v2/chains`);
      const chains = response.data;

      // Calculate total TVL for dominance
      const totalTvl = chains.reduce((sum: number, chain: any) =>
        sum + (chain.tvl || 0), 0
      );

      // Process and filter top chains
      const processedChains: ChainData[] = chains
        .filter((chain: any) => chain.tvl && chain.tvl > 100_000_000) // > $100M TVL
        .map((chain: any) => ({
          name: chain.name,
          tvl: chain.tvl,
          tvlChange24h: chain.change_1d || 0,
          protocols: chain.protocols || 0,
          dominance: (chain.tvl / totalTvl) * 100
        }))
        .sort((a: ChainData, b: ChainData) => b.tvl - a.tvl)
        .slice(0, 15);

      this.cache = {
        data: processedChains,
        timestamp: now
      };

      return processedChains;
    } catch (error) {
      console.error('Error fetching chain activity:', error);

      // Return cached data if available
      if (this.cache.data.length > 0) {
        return this.cache.data;
      }

      // Return mock data as fallback
      return this.getMockChainData();
    }
  }

  private getMockChainData(): ChainData[] {
    return [
      { name: 'Ethereum', tvl: 45_000_000_000, tvlChange24h: 2.5, protocols: 450, dominance: 55 },
      { name: 'BSC', tvl: 8_500_000_000, tvlChange24h: -1.2, protocols: 380, dominance: 10.5 },
      { name: 'Tron', tvl: 7_200_000_000, tvlChange24h: 0.8, protocols: 45, dominance: 8.9 },
      { name: 'Arbitrum', tvl: 3_800_000_000, tvlChange24h: 5.2, protocols: 220, dominance: 4.7 },
      { name: 'Polygon', tvl: 2_900_000_000, tvlChange24h: -0.5, protocols: 310, dominance: 3.6 },
      { name: 'Optimism', tvl: 2_100_000_000, tvlChange24h: 3.1, protocols: 150, dominance: 2.6 },
      { name: 'Avalanche', tvl: 1_800_000_000, tvlChange24h: -2.3, protocols: 180, dominance: 2.2 },
      { name: 'Base', tvl: 1_500_000_000, tvlChange24h: 8.7, protocols: 95, dominance: 1.9 }
    ];
  }

  async getTVLTrend(): Promise<{ increasing: number; decreasing: number }> {
    const chains = await this.getChainActivity();

    const increasing = chains.filter(c => c.tvlChange24h > 0).length;
    const decreasing = chains.filter(c => c.tvlChange24h < 0).length;

    return { increasing, decreasing };
  }
}
