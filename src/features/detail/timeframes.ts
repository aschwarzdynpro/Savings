import type { Resolution } from '@/services/market-data';

export const TIMEFRAMES = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'All'] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export interface TimeframeRange {
  resolution: Resolution;
  from: number;
  to: number;
}

/**
 * Map a timeframe to a (resolution, from, to) triple consumable by
 * `useCandles`. Note: 1D / 5D intraday resolutions depend on the Twelve
 * Data free tier which supports down to 1-minute bars.
 */
export function timeframeToRange(tf: Timeframe): TimeframeRange {
  const to = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;
  switch (tf) {
    case '1D':
      return { resolution: '5', from: to - 2 * day, to };
    case '5D':
      return { resolution: '30', from: to - 7 * day, to };
    case '1M':
      return { resolution: '60', from: to - 35 * day, to };
    case '6M':
      return { resolution: 'D', from: to - 190 * day, to };
    case '1Y':
      return { resolution: 'D', from: to - 380 * day, to };
    case '5Y':
      return { resolution: 'W', from: to - 5 * 365 * day, to };
    case 'All':
      return { resolution: 'M', from: to - 25 * 365 * day, to };
  }
}
