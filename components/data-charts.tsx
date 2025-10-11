"use client";

import { CalendarDays } from "lucide-react";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { SpendingPie, SpendingPieLoading } from "@/components/spending-pie";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const resolveChartType = (count: number) => {
  if (count <= 3) {
    return "radial" as const;
  }

  if (count <= 7) {
    return "pie" as const;
  }

  return "radar" as const;
};

export const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
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
    );
  }

  const fruitsByLocation = data?.fruitsByLocation.map(({ label, value }) => ({
    name: label,
    value,
  }));

  const preferredChart = resolveChartType(data?.fruitCount ?? 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Card className="border-none drop-shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl line-clamp-1">Évènements à venir</CardTitle>
            <CalendarDays className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.upcomingEvents.length ? (
              data.upcomingEvents.map((event) => (
                <div key={event.id} className="border rounded-lg px-4 py-3 bg-muted/40">
                  <p className="font-medium text-sm">
                    {event.type ?? "Sans titre"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.date ? new Date(event.date).toLocaleString() : "Date non définie"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun évènement à venir enregistré.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={fruitsByLocation} initialType={preferredChart} />
      </div>
    </div>
  );
};
