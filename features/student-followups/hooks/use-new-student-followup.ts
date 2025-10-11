import { create } from "zustand";

type NewStudentFollowupState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewStudentFollowup = create<NewStudentFollowupState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
