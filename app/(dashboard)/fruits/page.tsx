"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewFruit } from "@/features/fruits/hooks/use-new-fruit";
import { useGetFruits } from "@/features/fruits/api/use-get-fruits";
import { useBulkDeleteFruits } from "@/features/fruits/api/use-bulk-delete-fruits";
import { useGetStudents } from "@/features/students/api/use-get-students";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { columns } from "./columns";

const FruitsPage = () => {
  const newFruit = useNewFruit();
  const deleteFruits = useBulkDeleteFruits();
  const [selectedIndo, setSelectedIndo] = useState<number | null>(null);
  const fruitsQuery = useGetFruits({ indo: selectedIndo });
  const studentsQuery = useGetStudents();
  const fruits = fruitsQuery.data || [];

  const isDisabled = fruitsQuery.isLoading || deleteFruits.isPending;

  const studentOptions = useMemo(
    () =>
      [
        { value: "", label: "Tous les étudiants" },
        ...(studentsQuery.data ?? []).map((student) => ({
          value: student.id.toString(),
          label: student.firstname ?? `Étudiant ${student.id}`,
        })),
      ],
    [studentsQuery.data],
  );

  const handleIndoChange = (value: string) => {
    if (!value) {
      setSelectedIndo(null);
      return;
    }

    setSelectedIndo(Number(value));
  };

  const indoFilter = (
    <div className="flex items-center gap-2">
      <Label htmlFor="fruit-indo-filter" className="whitespace-nowrap">
        Indo
      </Label>
      <Select
        value={selectedIndo?.toString() ?? ""}
        onValueChange={handleIndoChange}
        disabled={studentsQuery.isLoading}
      >
        <SelectTrigger
          id="fruit-indo-filter"
          className="bg-transparent min-w-[200px]"
        >
          <SelectValue placeholder="Tous les étudiants" />
        </SelectTrigger>
        <SelectContent>
          {studentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

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
            filterKeys={["firstname"]}
            columns={columns}
            data={fruits}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id));
              deleteFruits.mutate({ ids });
            }}
            disabled={isDisabled}
            toolbar={indoFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FruitsPage;
