import { create } from "zustand";

type OpenStudentFollowupState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenStudentFollowup = create<OpenStudentFollowupState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: number) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
