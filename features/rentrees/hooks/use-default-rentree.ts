"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DefaultRentreeState = {
  defaultRentreeId: number | null;
  setDefaultRentreeId: (rentreeId: number | null) => void;
};

export const useDefaultRentree = create(
  persist<DefaultRentreeState>(
    (set) => ({
      defaultRentreeId: null,
      setDefaultRentreeId: (rentreeId) => set({ defaultRentreeId: rentreeId }),
    }),
    {
      name: "feedback-default-rentree",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        defaultRentreeId: state.defaultRentreeId,
      }),
    },
  ),
);
