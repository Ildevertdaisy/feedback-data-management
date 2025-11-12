"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Fruit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatFruitStatusLabel } from "@/features/fruits/constants";

import { Actions } from "./actions";

export type ResponseType = Fruit;

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
    accessorKey: "studentFirstname",
    header: "Étudiant",
    cell: ({ row }) => row.original.studentFirstname ?? "Non renseigné",
  },
  {
    accessorKey: "statusLabel",
    header: "Statut",
    cell: ({ row }) =>
      row.original.statusLabel
        ? formatFruitStatusLabel(row.original.statusLabel)
        : "Non renseigné",
  },
  {
    accessorKey: "location",
    header: "Localisation",
  },
  {
    accessorKey: "tagui_point",
    header: "Point Tagui",
  },
  {
    accessorKey: "date_subae",
    header: "Date Subae",
    cell: ({ row }) => {
      const value = row.original.date_subae;

      if (!value) {
        return "—";
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleDateString("fr-FR");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
