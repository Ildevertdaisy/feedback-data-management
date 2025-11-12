"use client";

import { useMemo } from "react";

import { formatFruitStatusLabel } from "@/features/fruits/constants";
import type {
  Fruit,
  Rentree,
  RentreeDashboard,
  RentreeDashboardOverview,
} from "@/lib/types";

import { SpendingPie, SpendingPieLoading } from "@/components/spending-pie";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
};

const DASHBOARD_COLOR_CLASSES = [
  "bg-blue-50 border-blue-200",
  "bg-purple-50 border-purple-200",
  "bg-emerald-50 border-emerald-200",
  "bg-orange-50 border-orange-200",
  "bg-sky-50 border-sky-200",
  "bg-rose-50 border-rose-200",
];

export const DataCharts = ({
  dashboard,
  dashboardLoading,
  chatguis,
  chatguisLoading,
  rentreeDashboards,
  rentreeDashboardsLoading,
  selectedRentree,
}: Props) => {
  const isLoading = dashboardLoading || chatguisLoading;
  const isRentreeDashboardsLoading = rentreeDashboardsLoading;

  const pieData = useMemo(() => {
    return (dashboard?.fruitsByStatus ?? [])
      .map(({ label, value }) => ({
        name: formatFruitStatusLabel(label),
        value,
      }))
      .filter((item) => item.value > 0);
  }, [dashboard?.fruitsByStatus]);

  const chatguiItems = chatguis ?? [];

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="col-span-1 lg:col-span-3 xl:col-span-4">
            <Card className="border-none drop-shadow-sm">
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 lg:col-span-3 xl:col-span-2">
            <SpendingPieLoading />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="col-span-1 lg:col-span-3 xl:col-span-4">
            <Card className="border-none drop-shadow-sm h-full">
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
          </div>
          <div className="col-span-1 lg:col-span-3 xl:col-span-2">
            <SpendingPie data={pieData} initialType="pie" />
          </div>
        </div>
      )}

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
