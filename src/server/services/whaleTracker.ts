export interface WhaleTransaction {
  blockchain: string;
  symbol: string;
  amount: number;
  amountUsd: number;
  from: string;
  to: string;
  timestamp: number;
  hash: string;
  type: 'accumulation' | 'distribution' | 'transfer';
}

export class WhaleTrackerService {
  private cache: { data: WhaleTransaction[]; timestamp: number } = {
    data: [],
    timestamp: 0
  };
  private readonly cacheDuration = 60000; // 1 minute
  private readonly whaleThreshold = 1_000_000; // $1M USD

  async getRecentWhaleTransactions(): Promise<WhaleTransaction[]> {
    const now = Date.now();

    if (this.cache.data.length > 0 && now - this.cache.timestamp < this.cacheDuration) {
      return this.cache.data;
    }

    try {
      // Simulate whale transactions for demo (free APIs have limitations)
      const mockTransactions = this.generateMockWhaleTransactions();

      this.cache = {
        data: mockTransactions,
        timestamp: now
      };

      return mockTransactions;
    } catch (error) {
      console.error('Error fetching whale transactions:', error);
      return this.cache.data;
    }
  }

  private generateMockWhaleTransactions(): WhaleTransaction[] {
    const blockchains = ['Ethereum', 'BSC', 'Bitcoin'];
    const symbols = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB'];
    const types: ('accumulation' | 'distribution' | 'transfer')[] = ['accumulation', 'distribution', 'transfer'];

    const transactions: WhaleTransaction[] = [];
    const now = Date.now();

    for (let i = 0; i < 15; i++) {
      const blockchain = blockchains[Math.floor(Math.random() * blockchains.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const amountUsd = Math.random() * 50_000_000 + this.whaleThreshold;

      transactions.push({
        blockchain,
        symbol,
        amount: amountUsd / (Math.random() * 50000 + 1000), // Mock amount
        amountUsd,
        from: this.generateAddress(),
        to: this.generateAddress(),
        timestamp: now - Math.floor(Math.random() * 3600000), // Last hour
        hash: this.generateHash(),
        type
      });
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  private generateAddress(): string {
    return '0x' + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private generateHash(): string {
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  async getWhaleAccumulationPattern(): Promise<{
    accumulation: number;
    distribution: number;
    netFlow: number;
  }> {
    const transactions = await this.getRecentWhaleTransactions();

    const accumulation = transactions
      .filter(t => t.type === 'accumulation')
      .reduce((sum, t) => sum + t.amountUsd, 0);

    const distribution = transactions
      .filter(t => t.type === 'distribution')
      .reduce((sum, t) => sum + t.amountUsd, 0);

    return {
      accumulation,
      distribution,
      netFlow: accumulation - distribution
    };
  }
}
