import { create } from "zustand";

type OpenEventState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenEvent = create<OpenEventState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: number) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
