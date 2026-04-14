import { useEffect, useRef, useState } from 'react';
import {
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import type { Candle } from '@/services/market-data';
import { hasCandleProvider } from '@/services/market-data';
import { useCandles } from '@/hooks/useMarketData';
import { timeframeToRange, type Timeframe } from './timeframes';

interface Props {
  symbol: string;
  timeframe: Timeframe;
  height?: number;
}

type Status = 'loading' | 'live' | 'fallback' | 'empty';

export function DetailChart({ symbol, timeframe, height = 480 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const { resolution, from, to } = timeframeToRange(timeframe);
  const { data: candles, isLoading, isError } = useCandles(
    symbol,
    resolution,
    from,
    to,
  );
  const hasProvider = hasCandleProvider();

  // Create the chart once (re-create when height changes).
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0b0f17' },
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      rightPriceScale: { borderColor: '#1f2937' },
      timeScale: { borderColor: '#1f2937', timeVisible: true, secondsVisible: false },
      width: containerRef.current.clientWidth,
      height,
    });

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      borderVisible: false,
    });

    const onResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', onResize);

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [height]);

  // Feed data into the series whenever the query resolves.
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;

    if (isLoading) {
      setStatus('loading');
      return;
    }

    if (candles && candles.length > 0) {
      seriesRef.current.setData(toChartData(candles));
      chartRef.current.timeScale().fitContent();
      setStatus('live');
      return;
    }

    if (!hasProvider) {
      seriesRef.current.setData(toChartData(generateDemoCandles(symbol, 180)));
      chartRef.current.timeScale().fitContent();
      setStatus('fallback');
      return;
    }

    if (isError) {
      seriesRef.current.setData([]);
      setStatus('empty');
    }
  }, [candles, isError, isLoading, hasProvider, symbol, timeframe]);

  return (
    <div className="card overflow-hidden">
      <div ref={containerRef} className="w-full" style={{ height }} />
      <div className="border-t border-slate-800 px-4 py-2">
        <StatusLine status={status} timeframe={timeframe} />
      </div>
    </div>
  );
}

function StatusLine({ status, timeframe }: { status: Status; timeframe: Timeframe }) {
  if (status === 'loading') {
    return <p className="text-xs text-slate-500">Loading candles…</p>;
  }
  if (status === 'fallback') {
    return (
      <p className="text-xs text-amber-400/80">
        Historical candles unavailable — set{' '}
        <code className="font-mono">VITE_TWELVE_DATA_API_KEY</code> for real
        data. Showing deterministic demo series.
      </p>
    );
  }
  if (status === 'empty') {
    return (
      <p className="text-xs text-slate-500">
        No data for this symbol on the selected timeframe.
      </p>
    );
  }
  return (
    <p className="text-xs text-slate-500">
      {timeframe} · Twelve Data
    </p>
  );
}

function toChartData(candles: Candle[]) {
  return candles.map((c) => ({
    time: c.time as UTCTimestamp,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }));
}

function generateDemoCandles(symbol: string, days: number): Candle[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) | 0;
  const rand = mulberry32(Math.abs(seed));

  const data: Candle[] = [];
  let price = 100 + rand() * 200;
  const start = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
  for (let i = 0; i < days; i++) {
    const open = price;
    const change = (rand() - 0.5) * 4;
    const close = Math.max(1, open + change);
    const high = Math.max(open, close) + rand() * 1.5;
    const low = Math.min(open, close) - rand() * 1.5;
    data.push({
      time: start + i * 24 * 60 * 60,
      open,
      high,
      low,
      close,
    });
    price = close;
  }
  return data;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
