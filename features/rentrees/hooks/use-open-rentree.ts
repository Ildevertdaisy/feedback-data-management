import { create } from "zustand";

type OpenRentreeState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenRentree = create<OpenRentreeState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: number) => set({ id, isOpen: true }),
  onClose: () => set({ id: undefined, isOpen: false }),
}));
