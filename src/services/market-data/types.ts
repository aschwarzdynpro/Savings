/**
 * Provider-agnostic market data interface.
 *
 * Adapters (Finnhub, Twelve Data, …) implement this contract so that UI
 * features never import a specific provider directly.
 */

export interface Quote {
  symbol: string;
  /** Current price. */
  price: number;
  /** Absolute change vs. previous close. */
  change: number;
  /** Percent change vs. previous close. */
  changePct: number;
  /** Day high. */
  high: number;
  /** Day low. */
  low: number;
  /** Day open. */
  open: number;
  /** Previous close. */
  previousClose: number;
  /** Unix seconds timestamp of last trade. */
  timestamp: number;
}

export interface Candle {
  /** Unix seconds. */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type Resolution = '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

export interface SymbolSearchResult {
  symbol: string;
  description: string;
  displaySymbol?: string;
  type?: string;
}

export interface MarketDataProvider {
  readonly name: string;

  getQuote(symbol: string): Promise<Quote>;

  getCandles(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
  ): Promise<Candle[]>;

  searchSymbols(query: string): Promise<SymbolSearchResult[]>;
}
