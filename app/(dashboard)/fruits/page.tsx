"use client";

import { Loader2, Plus } from "lucide-react";

import { useNewFruit } from "@/features/fruits/hooks/use-new-fruit";
import { useGetFruits } from "@/features/fruits/api/use-get-fruits";
import { useBulkDeleteFruits } from "@/features/fruits/api/use-bulk-delete-fruits";

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

const FruitsPage = () => {
  const newFruit = useNewFruit();
  const deleteFruits = useBulkDeleteFruits();
  const fruitsQuery = useGetFruits();
  const fruits = fruitsQuery.data || [];

  const isDisabled = fruitsQuery.isLoading || deleteFruits.isPending;

  if (fruitsQuery.isLoading) {
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
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Fruits</CardTitle>
          <Button onClick={newFruit.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Ajouter un fruit
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKeys={["firstname", "studentFirstname"]}
            columns={columns}
            data={fruits}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id));
              deleteFruits.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FruitsPage;
