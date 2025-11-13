"use client";

import { ReactNode, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileSearch } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type StatusBarChartDatum = {
  label: string;
  name: string;
  value: number;
  color?: string;
};

type Props = {
  data?: StatusBarChartDatum[];
  action?: ReactNode;
};

const DEFAULT_COLORS = ["#0EA5E9", "#22C55E", "#F97316", "#6366F1", "#F43F5E"];

export const StatusBarChart = ({ data = [], action }: Props) => {
  const hasData = useMemo(
    () => data.some((item) => Number(item.value) > 0),
    [data],
  );

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-xl">Fruits par statut</CardTitle>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={48}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
                  formatter={(value: number | string) => [`${value}`, "Fruits"]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`${entry.label}-${index}`}
                      fill={entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const StatusBarChartLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-10 w-full sm:w-44" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
};
