import { create } from 'zustand';

interface ChartTarget {
  symbol: string;
  name?: string;
}

interface ChartModalState {
  target: ChartTarget | null;
  open: (target: ChartTarget) => void;
  close: () => void;
}

export const useChartModalStore = create<ChartModalState>((set) => ({
  target: null,
  open: (target) => set({ target }),
  close: () => set({ target: null }),
}));
