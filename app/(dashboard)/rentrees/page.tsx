"use client";

import { useMemo } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewRentree } from "@/features/rentrees/hooks/use-new-rentree";
import { useGetRentrees } from "@/features/rentrees/api/use-get-rentrees";
import { useBulkDeleteRentrees } from "@/features/rentrees/api/use-bulk-delete-rentrees";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { columns } from "./columns";

const RentreesPage = () => {
  const newRentree = useNewRentree();
  const deleteRentrees = useBulkDeleteRentrees();
  const rentreesQuery = useGetRentrees();

  const rentrees = useMemo(
    () => rentreesQuery.data ?? [],
    [rentreesQuery.data],
  );

  const isDisabled =
    rentreesQuery.isLoading || rentreesQuery.isFetching || deleteRentrees.isPending;

  if (rentreesQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Rentrées</CardTitle>
          <Button onClick={newRentree.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Ajouter une rentrée
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKeys={["nom_rentree"]}
            columns={columns}
            data={rentrees}
            onDelete={(rows) => {
              const ids = rows
                .map((row) => Number(row.original.id))
                .filter((value) => Number.isFinite(value));

              if (ids.length) {
                deleteRentrees.mutate({ ids });
              }
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RentreesPage;
