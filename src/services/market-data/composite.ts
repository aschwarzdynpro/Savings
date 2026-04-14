import type {
  Candle,
  MarketDataProvider,
  Quote,
  Resolution,
  SymbolSearchResult,
} from './types';
import type { FinnhubProvider } from './finnhub';
import type { TwelveDataProvider } from './twelvedata';

/**
 * Routes calls to the best-fit adapter:
 *   - live quotes & symbol search → Finnhub (fast, wide coverage)
 *   - historical candles         → Twelve Data if configured, else Finnhub
 *     (which will 403 on the free tier → UI shows a demo fallback)
 */
export class CompositeProvider implements MarketDataProvider {
  readonly name = 'composite';

  constructor(
    private readonly finnhub: FinnhubProvider,
    private readonly twelvedata: TwelveDataProvider | null,
  ) {}

  getQuote(symbol: string): Promise<Quote> {
    return this.finnhub.getQuote(symbol);
  }

  searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    return this.finnhub.searchSymbols(query);
  }

  getCandles(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
  ): Promise<Candle[]> {
    if (this.twelvedata) {
      return this.twelvedata.getCandles(symbol, resolution, from, to);
    }
    return this.finnhub.getCandles(symbol, resolution, from, to);
  }

  /** Whether a real historical-candles provider is available. */
  hasCandleProvider(): boolean {
    return this.twelvedata !== null;
  }
}
