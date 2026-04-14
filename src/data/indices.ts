import type { SymbolSeed } from './types';

/**
 * Major world indices tracked via US-listed ETF proxies.
 *
 * Finnhub's free tier does not reliably serve raw index symbols
 * (`^GSPC`, `^GDAXI`, …) — `/quote` often returns an empty payload for
 * them. The ETF proxies below trade in USD on NYSE/NASDAQ and are covered
 * by the free tier. The `proxyFor` field preserves the index the ETF
 * tracks, for display purposes.
 */
export const INDICES: SymbolSeed[] = [
  { symbol: 'SPY', name: 'S&P 500', proxyFor: '^GSPC', exchange: 'US' },
  { symbol: 'DIA', name: 'Dow Jones Industrial', proxyFor: '^DJI', exchange: 'US' },
  { symbol: 'QQQ', name: 'NASDAQ 100', proxyFor: '^NDX', exchange: 'US' },
  { symbol: 'IWM', name: 'Russell 2000', proxyFor: '^RUT', exchange: 'US' },
  { symbol: 'VXX', name: 'VIX Short-Term (VXX)', proxyFor: '^VIX', exchange: 'US' },
  { symbol: 'EWG', name: 'Germany (DAX proxy)', proxyFor: '^GDAXI', exchange: 'DE' },
  { symbol: 'EWU', name: 'United Kingdom (FTSE proxy)', proxyFor: '^FTSE', exchange: 'UK' },
  { symbol: 'EWQ', name: 'France (CAC proxy)', proxyFor: '^FCHI', exchange: 'FR' },
  { symbol: 'FEZ', name: 'Euro Stoxx 50', proxyFor: '^STOXX50E', exchange: 'EU' },
  { symbol: 'EWJ', name: 'Japan (Nikkei proxy)', proxyFor: '^N225', exchange: 'JP' },
  { symbol: 'EWH', name: 'Hong Kong (Hang Seng proxy)', proxyFor: '^HSI', exchange: 'HK' },
  { symbol: 'MCHI', name: 'China (CSI 300 proxy)', proxyFor: '000300.SS', exchange: 'CN' },
  { symbol: 'EWA', name: 'Australia (ASX proxy)', proxyFor: '^AXJO', exchange: 'AU' },
  { symbol: 'INDA', name: 'India (Nifty proxy)', proxyFor: '^NSEI', exchange: 'IN' },
  { symbol: 'EWZ', name: 'Brazil (Bovespa proxy)', proxyFor: '^BVSP', exchange: 'BR' },
  { symbol: 'EWC', name: 'Canada (TSX proxy)', proxyFor: '^GSPTSE', exchange: 'CA' },
];
