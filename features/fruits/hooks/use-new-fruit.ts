import { create } from "zustand";

type NewFruitState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewFruit = create<NewFruitState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
