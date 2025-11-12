import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { FRUIT_CONVERSION_STATUS_LABELS } from "@/features/fruits/constants";
import type { FruitConversionStatus, RentreeDashboard } from "@/lib/types";

const DEFAULT_CONVERSION_COUNTS: Record<FruitConversionStatus, number> = {
  TAGUI: 0,
  BB: 0,
  CENTRE: 0,
  DROP: 0,
};

type BackendDashboard = {
  chatgui_count?: number;
  chatguiCount?: number;
  conversions?: Partial<Record<string, number>>;
  conversion_counts?: Partial<Record<string, number>>;
  fruits_by_status?: Partial<Record<string, number>>;
  statuses?: Partial<Record<string, number>>;
};

const extractChatguiCount = (data: BackendDashboard | null | undefined) => {
  if (!data) {
    return 0;
  }

  if (typeof data.chatguiCount === "number") {
    return data.chatguiCount;
  }

  if (typeof data.chatgui_count === "number") {
    return data.chatgui_count;
  }

  const statuses = data.fruits_by_status ?? data.statuses ?? {};
  const chatguiFromStatuses = statuses.CHATGUI ?? statuses.chatgui;

  if (typeof chatguiFromStatuses === "number") {
    return chatguiFromStatuses;
  }

  return 0;
};

const extractConversions = (data: BackendDashboard | null | undefined) => {
  const conversions =
    data?.conversions ?? data?.conversion_counts ?? data?.fruits_by_status ?? {};

  return FRUIT_CONVERSION_STATUS_LABELS.reduce<Record<FruitConversionStatus, number>>(
    (acc, label) => {
      const value =
        conversions[label] ??
        conversions[label.toLowerCase()] ??
        (typeof data?.statuses === "object"
          ? data?.statuses[label] ?? data?.statuses[label.toLowerCase()]
          : undefined);

      acc[label] = typeof value === "number" ? value : 0;
      return acc;
    },
    { ...DEFAULT_CONVERSION_COUNTS },
  );
};

const buildFruitsByStatus = (
  conversionCounts: Record<FruitConversionStatus, number>,
) => {
  return FRUIT_CONVERSION_STATUS_LABELS.map((label) => ({
    label,
    value: conversionCounts[label],
  }));
};

export const useGetRentreeDashboard = (rentreeId?: number | null) => {
  return useQuery<RentreeDashboard | null>({
    queryKey: ["rentree-dashboard", rentreeId ?? null],
    enabled: typeof rentreeId === "number",
    queryFn: async () => {
      if (typeof rentreeId !== "number") {
        return null;
      }

      const data = await apiFetch<BackendDashboard>(
        `/rentrees/${rentreeId}/dashboard`,
      );

      const conversionCounts = extractConversions(data);

      return {
        rentreeId,
        chatguiCount: extractChatguiCount(data),
        conversionCounts,
        fruitsByStatus: buildFruitsByStatus(conversionCounts),
      } satisfies RentreeDashboard;
    },
    placeholderData: (previousData) => previousData ?? null,
  });
};
