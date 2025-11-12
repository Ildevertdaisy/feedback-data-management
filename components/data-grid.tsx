"use client";

import { FaAppleAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import {
  FRUIT_CONVERSION_STATUS_LABELS,
  formatFruitStatusLabel,
} from "@/features/fruits/constants";
import type { FruitConversionStatus } from "@/lib/types";

import { DataCard, DataCardLoading } from "@/components/data-card";

const PERIOD_LABEL = "Mois N-1";

const DEFAULT_CONVERSION_COUNTS: Record<FruitConversionStatus, number> = {
  TTAGUI: 0,
  BB: 0,
  CENTRE: 0,
  DROP: 0,
};

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 pb-2 mb-8 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <DataCardLoading key={index} />
        ))}
      </div>
    );
  }

  const conversionCounts = data?.conversionCounts ?? DEFAULT_CONVERSION_COUNTS;

  const cards = [
    {
      key: "chatgui",
      title: "Chatguis",
      value: data?.chatguiCount ?? 0,
      icon: FaUsers,
      dateRange: PERIOD_LABEL,
      subtitle: "Fruits identifiés sur la période N-1",
    },
    ...FRUIT_CONVERSION_STATUS_LABELS.map((status) => ({
      key: status,
      title: formatFruitStatusLabel(status),
      value: conversionCounts[status],
      icon: FaAppleAlt,
      subtitle: `Chatguis devenus ${formatFruitStatusLabel(status)}`,
    })),
  ];

  return (
    <div className="grid grid-cols-1 gap-8 pb-2 mb-8 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <DataCard
          key={card.key}
          title={card.title}
          value={card.value}
          icon={card.icon}
          dateRange={card.dateRange}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  );
};
