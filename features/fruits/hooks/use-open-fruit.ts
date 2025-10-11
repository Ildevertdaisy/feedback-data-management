import { create } from "zustand";

type OpenFruitState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenFruit = create<OpenFruitState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: number) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
