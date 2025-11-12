"use client";

import { useMountedState } from "react-use";

import { NewFruitSheet } from "@/features/fruits/components/new-fruit-sheet";
import { EditFruitSheet } from "@/features/fruits/components/edit-fruit-sheet";

import { NewStudentSheet } from "@/features/students/components/new-student-sheet";
import { EditStudentSheet } from "@/features/students/components/edit-student-sheet";

import { NewRentreeSheet } from "@/features/rentrees/components/new-rentree-sheet";
import { EditRentreeSheet } from "@/features/rentrees/components/edit-rentree-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewFruitSheet />
      <EditFruitSheet />

      <NewStudentSheet />
      <EditStudentSheet />

      <NewRentreeSheet />
      <EditRentreeSheet />
    </>
  );
};
