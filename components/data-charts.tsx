"use client";

import { useMemo } from "react";

import { Download } from "lucide-react";

import {
  FRUIT_CONVERSION_STATUS_LABELS,
  formatFruitStatusLabel,
} from "@/features/fruits/constants";
import type {
  Fruit,
  FruitConversionStatus,
  Rentree,
  RentreeDashboard,
  RentreeDashboardOverview,
} from "@/lib/types";

import {
  StatusBarChart,
  StatusBarChartLoading,
} from "@/components/status-bar-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

type Props = {
  dashboard: RentreeDashboard | null | undefined;
  dashboardLoading: boolean;
  chatguis: Fruit[] | undefined;
  chatguisLoading: boolean;
  rentreeDashboards: RentreeDashboardOverview[] | undefined;
  rentreeDashboardsLoading: boolean;
  selectedRentree?: Rentree | null;
  onExport?: () => Promise<void>;
  isExporting?: boolean;
  canExport?: boolean;
};

const DASHBOARD_COLOR_CLASSES = [
  "bg-blue-50 border-blue-200",
  "bg-purple-50 border-purple-200",
  "bg-emerald-50 border-emerald-200",
  "bg-orange-50 border-orange-200",
  "bg-sky-50 border-sky-200",
  "bg-rose-50 border-rose-200",
];

const FRUIT_STATUS_COLORS: Record<FruitConversionStatus, string> = {
  TAGUI: "#0EA5E9",
  BB: "#22C55E",
  CENTRE: "#6366F1",
  DROP: "#F97316",
};

export const DataCharts = ({
  dashboard,
  dashboardLoading,
  chatguis,
  chatguisLoading,
  rentreeDashboards,
  rentreeDashboardsLoading,
  selectedRentree,
  onExport,
  isExporting,
  canExport = false,
}: Props) => {
  const isLoading = dashboardLoading || chatguisLoading;
  const isRentreeDashboardsLoading = rentreeDashboardsLoading;

  const barData = useMemo(() => {
    const counts = new Map(
      (dashboard?.fruitsByStatus ?? []).map(({ label, value }) => [
        label,
        value,
      ]),
    );

    return FRUIT_CONVERSION_STATUS_LABELS.map((status) => ({
      label: status,
      name: formatFruitStatusLabel(status),
      value: counts.get(status) ?? 0,
      color: FRUIT_STATUS_COLORS[status],
    }));
  }, [dashboard?.fruitsByStatus]);

  const chatguiItems = chatguis ?? [];
  const exportDisabled = !onExport || !canExport || !!isExporting;

  const exportButton = onExport ? (
    <Button
      variant="secondary"
      className="w-full sm:w-auto"
      disabled={exportDisabled}
      onClick={() => {
        if (!onExport || exportDisabled) {
          return;
        }

        void onExport();
      }}
    >
      <Download className="size-4 mr-2" />
      {isExporting ? "Export en cours..." : "Exporter en CSV"}
    </Button>
  ) : null;

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {isLoading ? (
            <StatusBarChartLoading />
          ) : (
            <StatusBarChart data={barData} action={exportButton} />
          )}
        </div>
      </div>

      <div>
        {isLoading ? (
          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="border rounded-lg px-4 py-3 bg-muted/40"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-44 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl line-clamp-1">
                {selectedRentree?.nom_rentree
                  ? `Chatguis de ${selectedRentree.nom_rentree}`
                  : "Chatguis de la rentrée"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {chatguiItems.length ? (
                chatguiItems.map((fruit) => {
                  const evangelisationDate = formatDate(
                    fruit.date_evangelisation ?? null,
                  );
                  const subaeDate = formatDate(fruit.date_subae ?? null);

                  return (
                    <div
                      key={fruit.id}
                      className="border rounded-lg px-4 py-3 bg-muted/40"
                    >
                      <p className="font-medium text-sm">
                        {fruit.firstname ?? `Fruit ${fruit.id}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {evangelisationDate
                          ? `Évangélisé le ${evangelisationDate}`
                          : "Date d'évangélisation inconnue"}
                      </p>
                      {subaeDate ? (
                        <p className="text-xs text-muted-foreground">
                          {`Subae le ${subaeDate}`}
                        </p>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun chatgui enregistré pour la période sélectionnée.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tableau de bord des rentrées</h2>
          {isRentreeDashboardsLoading ? (
            <span className="text-xs text-muted-foreground">Chargement...</span>
          ) : null}
        </div>
        {isRentreeDashboardsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-none drop-shadow-sm">
                <CardContent className="py-6">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rentreeDashboards && rentreeDashboards.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rentreeDashboards.map((rentreeDashboard, index) => {
              const colorClass =
                DASHBOARD_COLOR_CLASSES[index % DASHBOARD_COLOR_CLASSES.length];
              const rentreeLabel =
                rentreeDashboard.rentree?.nom_rentree ??
                formatDate(rentreeDashboard.rentree?.date_rentree ?? null) ??
                  `Rentrée #${rentreeDashboard.rentreeId}`;

              return (
                <Card
                  key={rentreeDashboard.rentreeId}
                  className={`border ${colorClass}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">
                      {rentreeLabel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">
                        {rentreeDashboard.chatguiCount}
                      </span>{" "}
                      chatguis
                    </p>
                    <ul className="space-y-1">
                      {rentreeDashboard.fruitsByStatus.map(({ label, value }) => (
                        <li key={label} className="flex items-center justify-between">
                          <span>{formatFruitStatusLabel(label)}</span>
                          <span className="font-semibold">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-none drop-shadow-sm">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground">
                Aucune rentrée enregistrée pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};
