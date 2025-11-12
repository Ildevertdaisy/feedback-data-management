"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { useGetRentrees } from "@/features/rentrees/api/use-get-rentrees";
import { useGetRentreeDashboard } from "@/features/rentrees/api/use-get-rentree-dashboard";
import { useGetRentreeChatguis } from "@/features/rentrees/api/use-get-rentree-chatguis";
import { useGetRentreeDashboards } from "@/features/rentrees/api/use-get-rentree-dashboards";
import { downloadRentreeCsv } from "@/features/rentrees/utils/download-rentree-csv";

export default function DashboardPage() {
  const rentreesQuery = useGetRentrees();
  const [selectedRentreeId, setSelectedRentreeId] = useState<number | null>(
    null,
  );
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (
      selectedRentreeId === null &&
      rentreesQuery.data &&
      rentreesQuery.data.length > 0
    ) {
      setSelectedRentreeId(rentreesQuery.data[0].id);
    }
  }, [rentreesQuery.data, selectedRentreeId]);

  const dashboardQuery = useGetRentreeDashboard(selectedRentreeId);
  const chatguisQuery = useGetRentreeChatguis(selectedRentreeId);
  const dashboardsQuery = useGetRentreeDashboards();

  const selectedRentree = useMemo(() => {
    if (!rentreesQuery.data || selectedRentreeId === null) {
      return null;
    }

    return (
      rentreesQuery.data.find((rentree) => rentree.id === selectedRentreeId) ?? null
    );
  }, [rentreesQuery.data, selectedRentreeId]);

  const handleExport = async () => {
    if (!selectedRentreeId) {
      return;
    }

    try {
      setIsExporting(true);
      await downloadRentreeCsv(selectedRentreeId);
      toast.success("Export CSV en cours de téléchargement");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'export.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 space-y-8">
      <DataGrid
        rentrees={rentreesQuery.data ?? []}
        rentreesLoading={rentreesQuery.isLoading || rentreesQuery.isFetching}
        selectedRentreeId={selectedRentreeId}
        onRentreeChange={setSelectedRentreeId}
        dashboard={dashboardQuery.data}
        dashboardLoading={dashboardQuery.isLoading || dashboardQuery.isFetching}
      />
      <DataCharts
        dashboard={dashboardQuery.data}
        dashboardLoading={dashboardQuery.isLoading || dashboardQuery.isFetching}
        chatguis={chatguisQuery.data}
        chatguisLoading={chatguisQuery.isLoading || chatguisQuery.isFetching}
        rentreeDashboards={dashboardsQuery.data}
        rentreeDashboardsLoading={
          dashboardsQuery.isLoading || dashboardsQuery.isFetching
        }
        selectedRentree={selectedRentree}
        onExport={selectedRentreeId ? handleExport : undefined}
        isExporting={isExporting}
        canExport={!!selectedRentreeId}
      />
    </div>
  );
}
