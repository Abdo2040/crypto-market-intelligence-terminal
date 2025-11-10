import { MarketDataService, CryptoData } from './marketData';

export interface MarketSignal {
  type: 'divergence' | 'volume_anomaly' | 'whale_pattern' | 'momentum' | 'support_resistance';
  severity: 'low' | 'medium' | 'high';
  symbol: string;
  message: string;
  timestamp: number;
  data?: any;
}

export class MarketSignalsService {
  constructor(private marketDataService: MarketDataService) {}

  async detectSignals(): Promise<MarketSignal[]> {
    const signals: MarketSignal[] = [];

    try {
      const cryptos = await this.marketDataService.getTopCryptos(100);
      const volumeData = await this.marketDataService.getVolumeData();

      // Detect volume anomalies
      signals.push(...this.detectVolumeAnomalies(volumeData));

      // Detect divergences
      signals.push(...this.detectDivergences(cryptos));

      // Detect momentum shifts
      signals.push(...this.detectMomentumShifts(cryptos));

      // Detect support/resistance levels
      signals.push(...this.detectSupportResistance(cryptos));

      return signals.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
    } catch (error) {
      console.error('Error detecting market signals:', error);
      return [];
    }
  }

  private detectVolumeAnomalies(volumeData: any[]): MarketSignal[] {
    const signals: MarketSignal[] = [];

    volumeData.forEach(coin => {
      // Detect unusual volume spikes (>50% change)
      if (Math.abs(coin.volumeChange) > 50) {
        signals.push({
          type: 'volume_anomaly',
          severity: Math.abs(coin.volumeChange) > 100 ? 'high' : 'medium',
          symbol: coin.symbol,
          message: `Unusual volume spike detected: ${coin.volumeChange > 0 ? '+' : ''}${coin.volumeChange.toFixed(2)}%`,
          timestamp: Date.now(),
          data: { volume: coin.volume, change: coin.volumeChange }
        });
      }
    });

    return signals;
  }

  private detectDivergences(cryptos: CryptoData[]): MarketSignal[] {
    const signals: MarketSignal[] = [];

    cryptos.forEach(crypto => {
      // Detect price-momentum divergence
      if (crypto.price_change_percentage_24h > 10 && crypto.price_change_percentage_7d < 0) {
        signals.push({
          type: 'divergence',
          severity: 'medium',
          symbol: crypto.symbol.toUpperCase(),
          message: `Bullish divergence: Strong 24h gain (+${crypto.price_change_percentage_24h.toFixed(2)}%) but 7d trend is negative`,
          timestamp: Date.now(),
          data: { price24h: crypto.price_change_percentage_24h, price7d: crypto.price_change_percentage_7d }
        });
      } else if (crypto.price_change_percentage_24h < -10 && crypto.price_change_percentage_7d > 0) {
        signals.push({
          type: 'divergence',
          severity: 'medium',
          symbol: crypto.symbol.toUpperCase(),
          message: `Bearish divergence: Sharp 24h drop (${crypto.price_change_percentage_24h.toFixed(2)}%) but 7d trend is positive`,
          timestamp: Date.now(),
          data: { price24h: crypto.price_change_percentage_24h, price7d: crypto.price_change_percentage_7d }
        });
      }
    });

    return signals;
  }

  private detectMomentumShifts(cryptos: CryptoData[]): MarketSignal[] {
    const signals: MarketSignal[] = [];

    // Filter coins with >$1B market cap
    const majorCoins = cryptos.filter(c => c.market_cap > 1_000_000_000);

    majorCoins.forEach(crypto => {
      // Strong momentum (>15% in 24h)
      if (Math.abs(crypto.price_change_percentage_24h) > 15) {
        signals.push({
          type: 'momentum',
          severity: 'high',
          symbol: crypto.symbol.toUpperCase(),
          message: `Strong ${crypto.price_change_percentage_24h > 0 ? 'upward' : 'downward'} momentum: ${crypto.price_change_percentage_24h > 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}% in 24h`,
          timestamp: Date.now(),
          data: { change24h: crypto.price_change_percentage_24h, marketCap: crypto.market_cap }
        });
      }
    });

    return signals;
  }

  private detectSupportResistance(cryptos: CryptoData[]): MarketSignal[] {
    const signals: MarketSignal[] = [];

    cryptos.forEach(crypto => {
      // Detect when price is near ATH (within 5%)
      if (crypto.ath_change_percentage > -5) {
        signals.push({
          type: 'support_resistance',
          severity: 'high',
          symbol: crypto.symbol.toUpperCase(),
          message: `Approaching ATH: Only ${Math.abs(crypto.ath_change_percentage).toFixed(2)}% away from all-time high`,
          timestamp: Date.now(),
          data: { currentPrice: crypto.current_price, ath: crypto.ath, distance: crypto.ath_change_percentage }
        });
      }

      // Detect significant drops from ATH (>50%)
      if (crypto.ath_change_percentage < -50) {
        signals.push({
          type: 'support_resistance',
          severity: 'medium',
          symbol: crypto.symbol.toUpperCase(),
          message: `Deep correction: ${Math.abs(crypto.ath_change_percentage).toFixed(2)}% below ATH`,
          timestamp: Date.now(),
          data: { currentPrice: crypto.current_price, ath: crypto.ath, distance: crypto.ath_change_percentage }
        });
      }
    });

    return signals;
  }
}
