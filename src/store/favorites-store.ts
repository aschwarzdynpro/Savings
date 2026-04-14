import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  toggle: (symbol: string) => void;
  add: (symbol: string) => void;
  remove: (symbol: string) => void;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      toggle: (symbol) =>
        set((s) => ({
          favorites: s.favorites.includes(symbol)
            ? s.favorites.filter((f) => f !== symbol)
            : [...s.favorites, symbol],
        })),
      add: (symbol) =>
        set((s) =>
          s.favorites.includes(symbol) ? s : { favorites: [...s.favorites, symbol] },
        ),
      remove: (symbol) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f !== symbol) })),
      clear: () => set({ favorites: [] }),
    }),
    {
      name: 'trading-dashboard:favorites',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

/** Stable selector to avoid re-rendering the whole list. */
export function useIsFavorite(symbol: string): boolean {
  return useFavoritesStore((s) => s.favorites.includes(symbol));
}
