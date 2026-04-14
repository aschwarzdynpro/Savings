export interface SymbolSeed {
  /** Primary symbol as used by the market-data provider. */
  symbol: string;
  /** Human-readable name. */
  name: string;
  /** Optional market cap (USD) — used by Top 50. */
  marketCap?: number;
  /** Optional: ISO country code / exchange hint. */
  exchange?: string;
}
