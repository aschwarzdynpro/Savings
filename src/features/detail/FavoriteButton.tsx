import clsx from 'clsx';
import { Star } from 'lucide-react';
import { useFavoritesStore, useIsFavorite } from '@/store/favorites-store';

interface Props {
  symbol: string;
}

export function FavoriteButton({ symbol }: Props) {
  const isFav = useIsFavorite(symbol);
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <button
      type="button"
      className={clsx(
        'btn-ghost border border-slate-700',
        isFav && 'text-amber-300 border-amber-600/60',
      )}
      onClick={() => toggle(symbol)}
      aria-pressed={isFav}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={clsx('h-4 w-4', isFav && 'fill-amber-300 text-amber-300')}
      />
      {isFav ? 'Favorited' : 'Favorite'}
    </button>
  );
}
