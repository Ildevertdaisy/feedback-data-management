import { create } from "zustand";

type NewRentreeState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewRentree = create<NewRentreeState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
