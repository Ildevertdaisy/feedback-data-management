"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Student, FruitStatusLabel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FRUIT_STATUS_LABELS,
  formatFruitStatusLabel,
} from "@/features/fruits/constants";

import { Actions } from "./actions";

type FruitStatusCounts = Partial<Record<FruitStatusLabel, number>>;

export type ResponseType = Student & {
  fruitStatuses?: FruitStatusCounts;
};

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Prénom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "gender",
    header: "Genre",
  },
  {
    accessorKey: "jdsn",
    header: "JDSN",
  },
  {
    accessorKey: "classe",
    header: "Classe",
    cell: ({ row }) => row.original.classe ?? "—",
  },
  {
    id: "fruitStatuses",
    header: "Fruits (statuts)",
    cell: ({ row }) => {
      const statuses = row.original.fruitStatuses ?? {};
      const entries = FRUIT_STATUS_LABELS.filter(
        (label) => (statuses?.[label] ?? 0) > 0,
      ).map((label) => [label, statuses[label] ?? 0] as const);

      if (!entries.length) {
        return <span className="text-sm text-muted-foreground">Aucun fruit</span>;
      }

      return (
        <div className="flex flex-wrap gap-2">
          {entries.map(([label, count]) => (
            <span
              key={label}
              className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
            >
              {formatFruitStatusLabel(label)}
              <span className="ml-1 text-muted-foreground">({count})</span>
            </span>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
