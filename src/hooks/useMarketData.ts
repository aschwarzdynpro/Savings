import { useQueries, useQuery } from '@tanstack/react-query';
import { getMarketData } from '@/services/market-data';
import type { Resolution } from '@/services/market-data';

/** Default poll interval for live quote hooks (ms). */
export const QUOTE_POLL_MS = 15_000;

/** Poll interval used by tabs with many symbols (e.g. Top 50). */
export const SLOW_POLL_MS = 60_000;

/** Sparklines / historical candles refresh at most once per hour. */
export const CANDLE_STALE_MS = 60 * 60_000;

interface QuoteOptions {
  /** Override the default poll interval (ms). */
  pollInterval?: number;
}

export function useQuote(symbol: string | null | undefined, opts: QuoteOptions = {}) {
  const pollInterval = opts.pollInterval ?? QUOTE_POLL_MS;
  return useQuery({
    queryKey: ['quote', symbol],
    queryFn: () => getMarketData().getQuote(symbol!),
    enabled: !!symbol,
    refetchInterval: pollInterval,
    refetchIntervalInBackground: false,
    staleTime: pollInterval / 2,
    retry: 1,
  });
}

/**
 * Parallel quotes for many symbols. Result preserves order.
 */
export function useQuotes(symbols: string[], opts: QuoteOptions = {}) {
  const pollInterval = opts.pollInterval ?? QUOTE_POLL_MS;
  return useQueries({
    queries: symbols.map((s) => ({
      queryKey: ['quote', s],
      queryFn: () => getMarketData().getQuote(s),
      refetchInterval: pollInterval,
      refetchIntervalInBackground: false,
      staleTime: pollInterval / 2,
      retry: 1,
    })),
  });
}

export function useCandles(
  symbol: string | null | undefined,
  resolution: Resolution,
  from: number,
  to: number,
) {
  return useQuery({
    queryKey: ['candles', symbol, resolution, from, to],
    queryFn: () => getMarketData().getCandles(symbol!, resolution, from, to),
    enabled: !!symbol,
    staleTime: CANDLE_STALE_MS,
    gcTime: CANDLE_STALE_MS * 2,
    retry: 0,
  });
}

/**
 * Convenience hook for sparkline-style usage: `days` of daily closes.
 * Cached aggressively so 50 parallel rows don't burn through the
 * Twelve Data free-tier budget.
 */
export function useSparkline(symbol: string, days = 7) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - (days + 3) * 24 * 60 * 60; // +3 day buffer for weekends
  const query = useCandles(symbol, 'D', from, to);
  return {
    closes: query.data?.slice(-days).map((c) => c.close),
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Symbol search — debounce the `query` at the call site via `useDebounced`.
 * Runs only when `query` has at least one non-whitespace character.
 */
export function useSymbolSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['search', trimmed],
    queryFn: () => getMarketData().searchSymbols(trimmed),
    enabled: trimmed.length >= 1,
    staleTime: 5 * 60_000,
    retry: 0,
  });
}
