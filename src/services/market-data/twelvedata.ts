import type { Candle, Resolution } from './types';
import { AuthError, NoDataError, RateLimitError } from './errors';
import { SlidingWindowLimiter } from './throttle';

interface TDTimeSeries {
  status: 'ok' | 'error';
  message?: string;
  meta?: { symbol: string; interval: string };
  values?: Array<{
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume?: string;
  }>;
}

/**
 * Twelve Data adapter — https://twelvedata.com/docs
 *
 * Used as the historical-candles provider because Finnhub's free tier
 * blocks `/stock/candle`. Free-tier limits:
 *   - 8 API credits/minute
 *   - 800 API credits/day
 *
 * This adapter intentionally implements only `getCandles`. Live quotes
 * keep running through Finnhub for lower latency & larger symbol coverage.
 */
export class TwelveDataProvider {
  readonly name = 'twelvedata';

  private readonly baseUrl = 'https://api.twelvedata.com';

  /** 7/min leaves headroom below the 8/min free-tier cap. */
  private readonly limiter = new SlidingWindowLimiter(7, 60_000);

  constructor(private readonly apiKey: string) {}

  async getCandles(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
  ): Promise<Candle[]> {
    if (!this.apiKey) {
      throw new AuthError('Missing VITE_TWELVE_DATA_API_KEY');
    }

    await this.limiter.acquire();

    const url = new URL(`${this.baseUrl}/time_series`);
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', mapInterval(resolution));
    url.searchParams.set('start_date', toDate(from));
    url.searchParams.set('end_date', toDate(to));
    url.searchParams.set('format', 'JSON');
    url.searchParams.set('apikey', this.apiKey);

    const res = await fetch(url.toString());
    if (res.status === 429) throw new RateLimitError();
    if (res.status === 401 || res.status === 403) {
      throw new AuthError(`Twelve Data ${res.status}`);
    }
    if (!res.ok) {
      throw new Error(`Twelve Data ${res.status}`);
    }

    const data = (await res.json()) as TDTimeSeries;
    if (data.status === 'error') {
      throw new NoDataError(data.message ?? `No data for ${symbol}`);
    }
    if (!data.values || data.values.length === 0) {
      throw new NoDataError(`No candles for ${symbol}`);
    }

    // Twelve Data returns newest first — reverse for chart libs.
    return data.values
      .slice()
      .reverse()
      .map((v) => ({
        time: Math.floor(new Date(v.datetime).getTime() / 1000),
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: v.volume ? parseInt(v.volume, 10) : undefined,
      }));
  }
}

function mapInterval(resolution: Resolution): string {
  switch (resolution) {
    case '1':
      return '1min';
    case '5':
      return '5min';
    case '15':
      return '15min';
    case '30':
      return '30min';
    case '60':
      return '1h';
    case 'D':
      return '1day';
    case 'W':
      return '1week';
    case 'M':
      return '1month';
  }
}

function toDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}
