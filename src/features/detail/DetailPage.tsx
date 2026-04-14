import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuote } from '@/hooks/useMarketData';
import { useRecentlyViewedStore } from '@/store/recently-viewed-store';
import { QuoteHeader } from './QuoteHeader';
import { FavoriteButton } from './FavoriteButton';
import { TimeframeSwitcher } from './TimeframeSwitcher';
import { DetailChart } from './DetailChart';
import type { Timeframe } from './timeframes';

export function DetailPage() {
  const { symbol = '' } = useParams<{ symbol: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const nameFromState =
    (location.state as { name?: string } | null | undefined)?.name ?? undefined;

  const { data: quote, isLoading, isError } = useQuote(symbol);
  const touch = useRecentlyViewedStore((s) => s.touch);

  const [timeframe, setTimeframe] = useState<Timeframe>('6M');

  useEffect(() => {
    if (symbol) touch({ symbol, name: nameFromState });
  }, [symbol, nameFromState, touch]);

  if (!symbol) {
    return (
      <div className="card p-6 text-sm text-slate-400">No symbol specified.</div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <FavoriteButton symbol={symbol} />
      </div>

      <QuoteHeader
        symbol={symbol}
        name={nameFromState}
        quote={quote}
        isLoading={isLoading}
        isError={isError}
      />

      <div className="space-y-3">
        <TimeframeSwitcher value={timeframe} onChange={setTimeframe} />
        <DetailChart symbol={symbol} timeframe={timeframe} />
      </div>
    </section>
  );
}
