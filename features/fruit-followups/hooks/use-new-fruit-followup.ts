import { create } from "zustand";

type NewFruitFollowupState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewFruitFollowup = create<NewFruitFollowupState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
