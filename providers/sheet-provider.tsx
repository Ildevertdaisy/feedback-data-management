"use client";

import { useMountedState } from "react-use";

import { NewFruitSheet } from "@/features/fruits/components/new-fruit-sheet";
import { EditFruitSheet } from "@/features/fruits/components/edit-fruit-sheet";

import { NewStudentSheet } from "@/features/students/components/new-student-sheet";
import { EditStudentSheet } from "@/features/students/components/edit-student-sheet";

import { NewEventSheet } from "@/features/events/components/new-event-sheet";
import { EditEventSheet } from "@/features/events/components/edit-event-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewFruitSheet />
      <EditFruitSheet />

      <NewStudentSheet />
      <EditStudentSheet />

      <NewEventSheet />
      <EditEventSheet />
    </>
  );
};
