import { FinnhubProvider } from './finnhub';
import type { MarketDataProvider } from './types';

export type { Candle, MarketDataProvider, Quote, Resolution, SymbolSearchResult } from './types';
export { AuthError, NoDataError, NotImplementedError, RateLimitError } from './errors';

let instance: MarketDataProvider | null = null;

/**
 * Returns the singleton market-data provider. The concrete adapter is
 * selected here — swap this out to change providers globally.
 */
export function getMarketData(): MarketDataProvider {
  if (instance) return instance;

  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY ?? '';
  if (!apiKey && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      '[market-data] VITE_FINNHUB_API_KEY is not set. ' +
        'Copy .env.example to .env.local and add your key.',
    );
  }

  instance = new FinnhubProvider(apiKey);
  return instance;
}
