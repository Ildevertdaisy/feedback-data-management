import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Event, Fruit, Student } from "@/lib/types";

type SummaryData = {
  studentCount: number;
  fruitCount: number;
  upcomingEventsCount: number;
  upcomingEvents: Event[];
  fruitsByLocation: { label: string; value: number }[];
  studentsByGender: { label: string; value: number }[];
};

const buildFruitsByLocation = (fruits: Fruit[]) => {
  const counts = fruits.reduce<Record<string, number>>((acc, fruit) => {
    const key = fruit.location ?? "Inconnu";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

const buildStudentsByGender = (students: Student[]) => {
  const counts = students.reduce<Record<string, number>>((acc, student) => {
    const key = student.gender ?? "Non renseigné";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

const ensureArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : [];
};

export const useGetSummary = () => {
  return useQuery<SummaryData>({
    queryKey: ["summary"],
    queryFn: async () => {
      const [studentsRaw, fruitsRaw, eventsRaw, upcomingRaw] = await Promise.all([
        apiFetch<unknown>("/students"),
        apiFetch<unknown>("/fruits"),
        apiFetch<unknown>("/events"),
        apiFetch<unknown>("/events/upcoming"),
      ]);

      const students = ensureArray<Student>(studentsRaw);
      const fruits = ensureArray<Fruit>(fruitsRaw);
      const events = ensureArray<Event>(eventsRaw);
      const upcoming = ensureArray<Event>(upcomingRaw);

      const upcomingEvents = upcoming.length
        ? upcoming
        : events.filter((event) => {
            if (!event.date) return false;
            return new Date(event.date) >= new Date();
          });

      return {
        studentCount: students.length,
        fruitCount: fruits.length,
        upcomingEventsCount: upcomingEvents.length,
        upcomingEvents: upcomingEvents.slice(0, 5),
        fruitsByLocation: buildFruitsByLocation(fruits).slice(0, 5),
        studentsByGender: buildStudentsByGender(students),
      };
    },
  });
};
