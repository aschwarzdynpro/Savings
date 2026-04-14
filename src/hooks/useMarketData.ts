import { useQueries, useQuery } from '@tanstack/react-query';
import { getMarketData } from '@/services/market-data';
import type { Resolution } from '@/services/market-data';

/** Poll interval for live quotes (ms). */
export const QUOTE_POLL_MS = 10_000;

export function useQuote(symbol: string | null | undefined) {
  return useQuery({
    queryKey: ['quote', symbol],
    queryFn: () => getMarketData().getQuote(symbol!),
    enabled: !!symbol,
    refetchInterval: QUOTE_POLL_MS,
    refetchIntervalInBackground: false,
    staleTime: QUOTE_POLL_MS / 2,
    retry: 1,
  });
}

/**
 * Parallel quotes for many symbols. Result preserves order.
 */
export function useQuotes(symbols: string[]) {
  return useQueries({
    queries: symbols.map((s) => ({
      queryKey: ['quote', s],
      queryFn: () => getMarketData().getQuote(s),
      refetchInterval: QUOTE_POLL_MS,
      refetchIntervalInBackground: false,
      staleTime: QUOTE_POLL_MS / 2,
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
    staleTime: 5 * 60_000,
    retry: 0, // historical candles require premium — don't hammer the API
  });
}
