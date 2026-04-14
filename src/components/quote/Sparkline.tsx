import { useSparkline } from '@/hooks/useMarketData';
import { hasCandleProvider } from '@/services/market-data';

interface SparklineProps {
  symbol: string;
  width?: number;
  height?: number;
  days?: number;
}

/**
 * Tiny line chart. Fetches daily closes via `useSparkline` (Twelve Data
 * behind the scenes) and renders them as an SVG polyline.
 *
 * Renders an empty cell if no historical-candles provider is configured
 * so we don't flood the console with 403s from Finnhub's premium-gated
 * `/stock/candle`.
 */
export function Sparkline({ symbol, width = 80, height = 24, days = 7 }: SparklineProps) {
  if (!hasCandleProvider()) {
    return <span className="text-xs text-slate-600">—</span>;
  }
  return <SparklineInner symbol={symbol} width={width} height={height} days={days} />;
}

function SparklineInner({
  symbol,
  width,
  height,
  days,
}: Required<Omit<SparklineProps, never>>) {
  const { closes, isLoading, isError } = useSparkline(symbol, days);

  if (isLoading) {
    return (
      <div
        className="animate-pulse rounded bg-slate-700/40"
        style={{ width, height }}
      />
    );
  }
  if (isError || !closes || closes.length < 2) {
    return <span className="text-xs text-slate-600">—</span>;
  }

  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const step = width / (closes.length - 1);

  const points = closes
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const up = closes[closes.length - 1] >= closes[0];
  const stroke = up ? '#22c55e' : '#ef4444';
  const fill = up ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';

  // Close the polygon at the bottom so we can fill it.
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="block">
      <polygon points={areaPoints} fill={fill} stroke="none" />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
