import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type {
  Event,
  Fruit,
  FruitConversionStatus,
  FruitStatusLabel,
} from "@/lib/types";
import {
  FRUIT_CONVERSION_STATUS_LABELS,
  formatFruitStatusLabel,
  getFruitStatusLabel,
} from "@/features/fruits/constants";

type StatusCounts = Partial<Record<FruitStatusLabel, number>>;

type ConversionCounts = Record<FruitConversionStatus, number>;

type SummaryData = {
  chatguiCount: number;
  conversionCounts: ConversionCounts;
  upcomingEventsCount: number;
  upcomingEvents: Event[];
  fruitsByStatus: { label: string; value: number }[];
};

const countFruitsByStatus = (fruits: Fruit[]): StatusCounts => {
  return fruits.reduce<StatusCounts>((acc, fruit) => {
    const label = fruit.statusLabel ?? getFruitStatusLabel(fruit.status);

    if (!label) {
      return acc;
    }

    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
};

const buildConversionCounts = (counts: StatusCounts): ConversionCounts => {
  return FRUIT_CONVERSION_STATUS_LABELS.reduce<ConversionCounts>(
    (acc, label) => {
      acc[label] = counts[label] ?? 0;
      return acc;
    },
    {} as ConversionCounts,
  );
};

const buildFruitsByStatus = (conversionCounts: ConversionCounts) => {
  return FRUIT_CONVERSION_STATUS_LABELS.map((label) => ({
    label: formatFruitStatusLabel(label),
    value: conversionCounts[label],
  })).filter(({ value }) => value > 0);
};

const ensureArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : [];
};

export const useGetSummary = () => {
  return useQuery<SummaryData>({
    queryKey: ["summary"],
    queryFn: async () => {
      const [fruitsRaw, upcomingRaw] = await Promise.all([
        apiFetch<unknown>("/fruits"),
        apiFetch<unknown>("/upcoming-events"),
      ]);

      const fruits = ensureArray<Fruit>(fruitsRaw);
      const upcoming = ensureArray<Event>(upcomingRaw);
      const statusCounts = countFruitsByStatus(fruits);
      const conversionCounts = buildConversionCounts(statusCounts);

      return {
        chatguiCount: statusCounts.CHATGUI ?? 0,
        conversionCounts,
        upcomingEventsCount: upcoming.length,
        upcomingEvents: upcoming.slice(0, 5),
        fruitsByStatus: buildFruitsByStatus(conversionCounts),
      };
    },
  });
};
