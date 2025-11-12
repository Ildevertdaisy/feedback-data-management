import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { FRUIT_CONVERSION_STATUS_LABELS } from "@/features/fruits/constants";
import type {
  FruitConversionStatus,
  Rentree,
  RentreeDashboardOverview,
} from "@/lib/types";

type BackendDashboard = {
  rentree?: Rentree | null;
  rentree_id?: number;
  chatgui_count?: number;
  chatguiCount?: number;
  conversions?: Partial<Record<string, number>>;
  conversion_counts?: Partial<Record<string, number>>;
  fruits_by_status?: Partial<Record<string, number>>;
  statuses?: Partial<Record<string, number>>;
};

const DEFAULT_CONVERSION_COUNTS: Record<FruitConversionStatus, number> = {
  TAGUI: 0,
  BB: 0,
  CENTRE: 0,
  DROP: 0,
};

const extractRentreeId = (item: BackendDashboard) => {
  if (item?.rentree && typeof item.rentree.id === "number") {
    return item.rentree.id;
  }

  if (typeof item?.rentree_id === "number") {
    return item.rentree_id;
  }

  return null;
};

const extractChatguiCount = (item: BackendDashboard) => {
  if (typeof item.chatguiCount === "number") {
    return item.chatguiCount;
  }

  if (typeof item.chatgui_count === "number") {
    return item.chatgui_count;
  }

  const statuses = item.fruits_by_status ?? item.statuses ?? {};
  const value = statuses.CHATGUI ?? statuses.chatgui;

  return typeof value === "number" ? value : 0;
};

const extractConversions = (item: BackendDashboard) => {
  const conversions =
    item.conversions ?? item.conversion_counts ?? item.fruits_by_status ?? {};

  return FRUIT_CONVERSION_STATUS_LABELS.reduce<Record<FruitConversionStatus, number>>(
    (acc, label) => {
      const value =
        conversions[label] ??
        conversions[label.toLowerCase()] ??
        (typeof item.statuses === "object"
          ? item.statuses[label] ?? item.statuses[label.toLowerCase()]
          : undefined);

      acc[label] = typeof value === "number" ? value : 0;
      return acc;
    },
    { ...DEFAULT_CONVERSION_COUNTS },
  );
};

const mapDashboard = (item: BackendDashboard): RentreeDashboardOverview | null => {
  const rentreeId = extractRentreeId(item);

  if (!rentreeId) {
    return null;
  }

  const conversionCounts = extractConversions(item);

  return {
    rentreeId,
    chatguiCount: extractChatguiCount(item),
    conversionCounts,
    fruitsByStatus: FRUIT_CONVERSION_STATUS_LABELS.map((label) => ({
      label,
      value: conversionCounts[label],
    })),
    rentree: item.rentree ?? null,
  } satisfies RentreeDashboardOverview;
};

export const useGetRentreeDashboards = () => {
  return useQuery({
    queryKey: ["rentree-dashboards"],
    queryFn: async () => {
      const dashboards = await apiFetch<BackendDashboard[]>(
        "/rentrees/dashboards/all",
      );

      return dashboards
        .map(mapDashboard)
        .filter((item): item is RentreeDashboardOverview => item !== null);
    },
  });
};
