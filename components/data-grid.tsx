"use client";

import { useMemo } from "react";
import { FaAppleAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

import { FRUIT_CONVERSION_STATUS_LABELS, formatFruitStatusLabel } from "@/features/fruits/constants";
import type { FruitConversionStatus, Rentree, RentreeDashboard } from "@/lib/types";

import { DataCard, DataCardLoading } from "@/components/data-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const buildPeriodLabel = (rentree?: Rentree | null) => {
  if (!rentree) {
    return "Mois N-1";
  }

  const start = formatDate(rentree.date_debut_chatgui);
  const end = formatDate(rentree.date_fin_chatgui);

  if (!start && !end) {
    return "Mois N-1";
  }

  if (start && end) {
    return `Collecte du ${start} au ${end}`;
  }

  if (start) {
    return `Collecte depuis le ${start}`;
  }

  if (end) {
    return `Collecte jusqu'au ${end}`;
  }

  return "Mois N-1";
};

const DEFAULT_CONVERSION_COUNTS: Record<FruitConversionStatus, number> = {
  TAGUI: 0,
  BB: 0,
  CENTRE: 0,
  DROP: 0,
};

type Props = {
  rentrees: Rentree[];
  rentreesLoading: boolean;
  selectedRentreeId: number | null;
  onRentreeChange: (value: number | null) => void;
  dashboard: RentreeDashboard | null | undefined;
  dashboardLoading: boolean;
};

export const DataGrid = ({
  rentrees,
  rentreesLoading,
  selectedRentreeId,
  onRentreeChange,
  dashboard,
  dashboardLoading,
}: Props) => {
  const selectedRentree = useMemo(() => {
    if (!rentrees?.length || selectedRentreeId === null) {
      return null;
    }

    return rentrees.find((rentree) => rentree.id === selectedRentreeId) ?? null;
  }, [rentrees, selectedRentreeId]);

  const isLoading = rentreesLoading || dashboardLoading;

  const cards = useMemo(() => {
    const conversionCounts = dashboard?.conversionCounts ?? DEFAULT_CONVERSION_COUNTS;

    return [
      {
        key: "chatgui",
        title: "Chatguis",
        value: dashboard?.chatguiCount ?? 0,
        icon: FaUsers,
        dateRange: buildPeriodLabel(selectedRentree),
        subtitle: "Fruits identifiés sur la période sélectionnée",
      },
      ...FRUIT_CONVERSION_STATUS_LABELS.map((status) => ({
        key: status,
        title: formatFruitStatusLabel(status),
        value: conversionCounts[status] ?? 0,
        icon: FaAppleAlt,
        subtitle: `Chatguis devenus ${formatFruitStatusLabel(status)}`,
      })),
    ];
  }, [dashboard?.chatguiCount, dashboard?.conversionCounts, selectedRentree]);

  const handleRentreeChange = (value: string) => {
    if (value === "none") {
      onRentreeChange(null);
      return;
    }

    const parsed = Number.parseInt(value, 10);
    onRentreeChange(Number.isNaN(parsed) ? null : parsed);
  };

  return (
    <div className="pb-2 mb-8">
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase text-muted-foreground">Rentrée</p>
          <Select
            value={
              selectedRentreeId !== null ? selectedRentreeId.toString() : "none"
            }
            onValueChange={handleRentreeChange}
            disabled={rentreesLoading}
          >
            <SelectTrigger className="w-[260px] bg-background">
              <SelectValue
                placeholder={
                  rentreesLoading
                    ? "Chargement..."
                    : "Sélectionner une rentrée"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Toutes les rentrées</SelectItem>
              {rentrees.map((rentree) => (
                <SelectItem key={rentree.id} value={rentree.id.toString()}>
                  {rentree.nom_rentree ??
                    formatDate(rentree.date_rentree) ??
                    `Rentrée #${rentree.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <DataCardLoading key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-5">
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
      )}
    </div>
  );
};
