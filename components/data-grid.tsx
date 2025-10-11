"use client";

import { FaAppleAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { CalendarDays } from "lucide-react";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { DataCard, DataCardLoading } from "@/components/data-card";

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Étudiants"
        value={data?.studentCount ?? 0}
        icon={FaUsers}
        dateRange="Total"
      />
      <DataCard
        title="Fruits"
        value={data?.fruitCount ?? 0}
        icon={FaAppleAlt}
        dateRange="Total"
      />
      <DataCard
        title="Évènements à venir"
        value={data?.upcomingEventsCount ?? 0}
        icon={CalendarDays}
        dateRange="Prochains rendez-vous"
      />
    </div>
  );
};
