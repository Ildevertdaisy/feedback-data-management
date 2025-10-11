"use client";

import { Loader2, Plus } from "lucide-react";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetFruits } from "@/features/fruits/api/use-get-fruits";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";

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
  const newFruit = useNewAccount();
  const deleteAccounts = useBulkDeleteAccounts();
  const fruitsQuery = useGetFruits();
  const fruits = fruitsQuery.data || [];

  const isDisabled = fruitsQuery.isLoading || deleteAccounts.isPending;

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
          <CardTitle className="text-xl line-clamp-1">Fuits liste</CardTitle>
          <Button onClick={newFruit.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Ajouter un nouveau fruit
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            columns={columns}
            data={fruits}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};
 
export default FruitsPage;
