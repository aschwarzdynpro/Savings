import { useEffect, useRef } from 'react';
import { createChart, ColorType, type IChartApi, type UTCTimestamp } from 'lightweight-charts';

interface Props {
  symbol: string;
  height?: number;
}

/**
 * Sprint 0: renders a demo candlestick series generated deterministically
 * from the symbol. Sprint 1 will replace `generateDemoData` with real candles
 * fetched via `useCandles(symbol)`.
 */
export function LightweightChart({ symbol, height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

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
      timeScale: { borderColor: '#1f2937', timeVisible: true },
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

    series.setData(generateDemoData(symbol));
    chart.timeScale().fitContent();

    const onResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', onResize);
    chartRef.current = chart;

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [symbol, height]);

  return <div ref={containerRef} className="w-full" style={{ height }} />;
}

function generateDemoData(symbol: string) {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) | 0;
  const rand = mulberry32(Math.abs(seed));

  const data: {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
  }[] = [];

  let price = 100 + rand() * 200;
  const start = Math.floor(Date.now() / 1000) - 120 * 24 * 60 * 60;
  for (let i = 0; i < 120; i++) {
    const open = price;
    const change = (rand() - 0.5) * 4;
    const close = Math.max(1, open + change);
    const high = Math.max(open, close) + rand() * 1.5;
    const low = Math.min(open, close) - rand() * 1.5;
    data.push({
      time: (start + i * 24 * 60 * 60) as UTCTimestamp,
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
