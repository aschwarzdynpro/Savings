import type {
  Candle,
  MarketDataProvider,
  Quote,
  Resolution,
  SymbolSearchResult,
} from './types';

/**
 * Finnhub adapter.
 *
 * Sprint 0: All methods throw `NotImplementedError`. Sprint 1 wires the
 * real HTTP calls. We ship the stub so the rest of the app can already
 * depend on a typed provider instance.
 *
 * Docs: https://finnhub.io/docs/api
 */
export class FinnhubProvider implements MarketDataProvider {
  readonly name = 'finnhub';

  private readonly baseUrl = 'https://finnhub.io/api/v1';

  constructor(private readonly apiKey: string) {}

  async getQuote(_symbol: string): Promise<Quote> {
    // TODO(sprint-1): GET /quote?symbol=…&token=…
    // Map { c, d, dp, h, l, o, pc, t } into our Quote shape.
    throw new NotImplementedError('FinnhubProvider.getQuote');
  }

  async getCandles(
    _symbol: string,
    _resolution: Resolution,
    _from: number,
    _to: number,
  ): Promise<Candle[]> {
    // TODO(sprint-1): GET /stock/candle?symbol=…&resolution=…&from=…&to=…&token=…
    // Finnhub returns column-oriented arrays (c/h/l/o/t/v) — zip them.
    throw new NotImplementedError('FinnhubProvider.getCandles');
  }

  async searchSymbols(_query: string): Promise<SymbolSearchResult[]> {
    // TODO(sprint-3): GET /search?q=…&token=…
    throw new NotImplementedError('FinnhubProvider.searchSymbols');
  }

  /**
   * Build a fully-qualified Finnhub URL including the token query param.
   * Used by Sprint 1 methods; kept on the class so the adapter is coherent.
   */
  protected buildUrl(path: string, params: Record<string, string | number>): string {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
    url.searchParams.set('token', this.apiKey);
    return url.toString();
  }
}

export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method} is not implemented yet (Sprint 0 stub).`);
    this.name = 'NotImplementedError';
  }
}
