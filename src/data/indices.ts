import type { SymbolSeed } from './types';

/**
 * Curated list of major world indices.
 *
 * NOTE: Finnhub's free tier does not cover every raw index symbol.
 * In Sprint 1 we may need to swap some of these for ETF proxies
 * (e.g. `SPY` for the S&P 500). Keep the `symbol` column in sync
 * with what the provider actually returns.
 */
export const INDICES: SymbolSeed[] = [
  { symbol: '^GSPC', name: 'S&P 500', exchange: 'US' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', exchange: 'US' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', exchange: 'US' },
  { symbol: '^RUT', name: 'Russell 2000', exchange: 'US' },
  { symbol: '^VIX', name: 'CBOE Volatility Index', exchange: 'US' },
  { symbol: '^GDAXI', name: 'DAX 40', exchange: 'DE' },
  { symbol: '^FTSE', name: 'FTSE 100', exchange: 'UK' },
  { symbol: '^FCHI', name: 'CAC 40', exchange: 'FR' },
  { symbol: '^STOXX50E', name: 'Euro Stoxx 50', exchange: 'EU' },
  { symbol: '^N225', name: 'Nikkei 225', exchange: 'JP' },
  { symbol: '^HSI', name: 'Hang Seng', exchange: 'HK' },
  { symbol: '000001.SS', name: 'Shanghai Composite', exchange: 'CN' },
  { symbol: '^AXJO', name: 'S&P/ASX 200', exchange: 'AU' },
  { symbol: '^BSESN', name: 'BSE Sensex', exchange: 'IN' },
  { symbol: '^BVSP', name: 'Bovespa', exchange: 'BR' },
  { symbol: '^GSPTSE', name: 'S&P/TSX Composite', exchange: 'CA' },
];
