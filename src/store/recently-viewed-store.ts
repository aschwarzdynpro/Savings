import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RecentlyViewedItem {
  symbol: string;
  name?: string;
  viewedAt: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  touch: (item: { symbol: string; name?: string }) => void;
  clear: () => void;
}

const MAX_ITEMS = 20;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      touch: ({ symbol, name }) =>
        set((s) => {
          const filtered = s.items.filter((i) => i.symbol !== symbol);
          return {
            items: [
              { symbol, name, viewedAt: Date.now() },
              ...filtered,
            ].slice(0, MAX_ITEMS),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'trading-dashboard:recently-viewed',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
