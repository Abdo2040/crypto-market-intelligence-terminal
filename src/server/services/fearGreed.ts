import axios from 'axios';

export interface FearGreedData {
  value: number;
  classification: string;
  timestamp: number;
  lastUpdate: string;
}

export class FearGreedService {
  private readonly apiUrl = 'https://api.alternative.me/fng/';
  private cache: { data: FearGreedData | null; timestamp: number } = {
    data: null,
    timestamp: 0
  };
  private readonly cacheDuration = 300000; // 5 minutes

  async getFearGreedIndex(): Promise<FearGreedData> {
    const now = Date.now();

    // Return cached data if still valid
    if (this.cache.data && now - this.cache.timestamp < this.cacheDuration) {
      return this.cache.data;
    }

    try {
      const response = await axios.get(this.apiUrl);
      const data = response.data.data[0];

      const fearGreedData: FearGreedData = {
        value: parseInt(data.value),
        classification: data.value_classification,
        timestamp: parseInt(data.timestamp) * 1000,
        lastUpdate: data.time_until_update || 'N/A'
      };

      // Update cache
      this.cache = {
        data: fearGreedData,
        timestamp: now
      };

      return fearGreedData;
    } catch (error) {
      console.error('Error fetching Fear & Greed Index:', error);

      // Return cached data if available
      if (this.cache.data) {
        return this.cache.data;
      }

      // Return default neutral value if no cache
      return {
        value: 50,
        classification: 'Neutral',
        timestamp: now,
        lastUpdate: 'Error fetching data'
      };
    }
  }

  getEmoji(value: number): string {
    if (value <= 20) return '😱';
    if (value <= 40) return '😰';
    if (value <= 60) return '😐';
    if (value <= 80) return '🤑';
    return '🚀';
  }

  getColor(value: number): string {
    if (value <= 20) return '#ff4444';
    if (value <= 40) return '#ff8844';
    if (value <= 60) return '#ffbb44';
    if (value <= 80) return '#88ff44';
    return '#44ff44';
  }
}
