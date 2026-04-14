import type {
  Candle,
  MarketDataProvider,
  Quote,
  Resolution,
  SymbolSearchResult,
} from './types';
import { AuthError, NoDataError, RateLimitError } from './errors';
import { SlidingWindowLimiter } from './throttle';

interface FinnhubQuote {
  c: number; // current price
  d: number | null; // change
  dp: number | null; // change percent
  h: number; // day high
  l: number; // day low
  o: number; // day open
  pc: number; // previous close
  t: number; // timestamp (unix seconds)
}

interface FinnhubCandles {
  s: 'ok' | 'no_data';
  c?: number[];
  h?: number[];
  l?: number[];
  o?: number[];
  t?: number[];
  v?: number[];
}

interface FinnhubSearchResult {
  result: Array<{
    symbol: string;
    description: string;
    displaySymbol?: string;
    type?: string;
  }>;
}

/**
 * Finnhub adapter — https://finnhub.io/docs/api
 *
 * Free-tier notes (verified 2026-Q2):
 *   - `/quote`         ✅ US stocks & ETFs (use ETF proxies for indices)
 *   - `/search`        ✅
 *   - `/stock/candle`  ❌ premium — will throw `AuthError`; callers should
 *                       fall back to a demo series or a different provider.
 */
export class FinnhubProvider implements MarketDataProvider {
  readonly name = 'finnhub';

  private readonly baseUrl = 'https://finnhub.io/api/v1';

  /**
   * Finnhub free tier allows 60 req/min. We leave a small safety buffer
   * so bursts from page loads and concurrent React Query polls don't
   * push us over the edge.
   */
  private readonly limiter = new SlidingWindowLimiter(55, 60_000);

  constructor(private readonly apiKey: string) {}

  async getQuote(symbol: string): Promise<Quote> {
    const data = await this.fetchJson<FinnhubQuote>('/quote', { symbol });

    // Finnhub returns zeros when the symbol is unknown / unsupported.
    if (data.c === 0 && data.pc === 0 && data.h === 0 && data.l === 0) {
      throw new NoDataError(`No quote data for ${symbol}`);
    }

    return {
      symbol,
      price: data.c,
      change: data.d ?? 0,
      changePct: data.dp ?? 0,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t,
    };
  }

  async getCandles(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
  ): Promise<Candle[]> {
    const data = await this.fetchJson<FinnhubCandles>('/stock/candle', {
      symbol,
      resolution,
      from,
      to,
    });

    if (data.s !== 'ok' || !data.t || !data.c) {
      throw new NoDataError(`No candles for ${symbol}`);
    }

    const candles: Candle[] = [];
    for (let i = 0; i < data.t.length; i++) {
      candles.push({
        time: data.t[i],
        open: data.o![i],
        high: data.h![i],
        low: data.l![i],
        close: data.c[i],
        volume: data.v?.[i],
      });
    }
    return candles;
  }

  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    const data = await this.fetchJson<FinnhubSearchResult>('/search', { q: query });
    return (data.result ?? []).map((r) => ({
      symbol: r.symbol,
      description: r.description,
      displaySymbol: r.displaySymbol,
      type: r.type,
    }));
  }

  // ──────────────────────────── internals ───────────────────────────────

  private async fetchJson<T>(
    path: string,
    params: Record<string, string | number>,
  ): Promise<T> {
    if (!this.apiKey) {
      throw new AuthError('Missing VITE_FINNHUB_API_KEY');
    }

    await this.limiter.acquire();

    const url = this.buildUrl(path, params);
    const res = await fetch(url);

    if (res.status === 429) {
      throw new RateLimitError();
    }
    if (res.status === 401 || res.status === 403) {
      throw new AuthError(
        `Finnhub ${res.status} on ${path} — endpoint may require a paid plan.`,
      );
    }
    if (!res.ok) {
      throw new Error(`Finnhub ${res.status} on ${path}`);
    }
    return (await res.json()) as T;
  }

  private buildUrl(path: string, params: Record<string, string | number>): string {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
    url.searchParams.set('token', this.apiKey);
    return url.toString();
  }
}
