import { FinnhubProvider } from './finnhub';
import { TwelveDataProvider } from './twelvedata';
import { CompositeProvider } from './composite';

export type { Candle, MarketDataProvider, Quote, Resolution, SymbolSearchResult } from './types';
export { AuthError, NoDataError, NotImplementedError, RateLimitError } from './errors';

let instance: CompositeProvider | null = null;

/**
 * Returns the singleton composite market-data provider.
 *
 *   - Finnhub handles live quotes and symbol search.
 *   - Twelve Data handles historical candles (optional — if no key is set,
 *     historical features gracefully fall back to demo data).
 */
export function getMarketData(): CompositeProvider {
  if (instance) return instance;

  const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY ?? '';
  const twelveKey = import.meta.env.VITE_TWELVE_DATA_API_KEY ?? '';

  if (!finnhubKey && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      '[market-data] VITE_FINNHUB_API_KEY is not set. ' +
        'Copy .env.example to .env.local and add your key.',
    );
  }

  const finnhub = new FinnhubProvider(finnhubKey);
  const twelvedata = twelveKey ? new TwelveDataProvider(twelveKey) : null;

  instance = new CompositeProvider(finnhub, twelvedata);
  return instance;
}

/**
 * Whether the composite provider has a dedicated historical candles
 * provider (i.e. Twelve Data is configured). Used by the UI to decide
 * whether to show sparklines at all.
 */
export function hasCandleProvider(): boolean {
  return getMarketData().hasCandleProvider();
}
