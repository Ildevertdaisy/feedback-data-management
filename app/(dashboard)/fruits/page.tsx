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
import { FRUIT_STATUS_SELECT_OPTIONS } from "@/features/fruits/constants";
import { FruitStatusLabel } from "@/lib/types";

import { columns } from "./columns";

const ALL_STUDENTS_VALUE = "all";

const ALL_STATUS_VALUE = "all";

const FruitsPage = () => {
  const newFruit = useNewFruit();
  const deleteFruits = useBulkDeleteFruits();
  const [selectedStudentValue, setSelectedStudentValue] = useState<string>(
    ALL_STUDENTS_VALUE,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    FruitStatusLabel | typeof ALL_STATUS_VALUE
  >(ALL_STATUS_VALUE);

  const selectedIndo = useMemo(() => {
    if (selectedStudentValue === ALL_STUDENTS_VALUE) {
      return null;
    }

    const parsedValue = Number.parseInt(selectedStudentValue, 10);

    return Number.isNaN(parsedValue) ? null : parsedValue;
  }, [selectedStudentValue]);

  const fruitsQuery = useGetFruits({ indo: selectedIndo });
  const studentsQuery = useGetStudents();
  const fruits = useMemo(
    () => fruitsQuery.data ?? [],
    [fruitsQuery.data],
  );

  const isDisabled = fruitsQuery.isLoading || deleteFruits.isPending;

  const studentOptions = useMemo(
    () =>
      [
        { value: ALL_STUDENTS_VALUE, label: "Tous les étudiants" },
        ...(studentsQuery.data ?? []).map((student) => ({
          value: student.id.toString(),
          label: student.firstname ?? `Étudiant ${student.id}`,
        })),
      ],
    [studentsQuery.data],
  );

  const handleIndoChange = (value: string) => {
    setSelectedStudentValue(value);
  };

  const handleStatusChange = (value: FruitStatusLabel | typeof ALL_STATUS_VALUE) => {
    setSelectedStatus(value);
  };

  const statusOptions = useMemo(
    () => [
      { value: ALL_STATUS_VALUE, label: "Tous les statuts" },
      ...FRUIT_STATUS_SELECT_OPTIONS,
    ],
    [],
  );

  const studentFilter = (
    <div className="flex items-center gap-2">
      <Label htmlFor="fruit-indo-filter" className="whitespace-nowrap">
        Indo
      </Label>
      <Select
        value={selectedStudentValue}
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

  const statusFilter = (
    <div className="flex items-center gap-2">
      <Label htmlFor="fruit-status-filter" className="whitespace-nowrap">
        Statut
      </Label>
      <Select
        value={selectedStatus}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger
          id="fruit-status-filter"
          className="bg-transparent min-w-[200px]"
        >
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const filtersToolbar = (
    <div className="flex flex-wrap items-center gap-4">
      {studentFilter}
      {statusFilter}
    </div>
  );

  const filteredFruits = useMemo(() => {
    if (selectedStatus === ALL_STATUS_VALUE) {
      return fruits;
    }

    return fruits.filter((fruit) => fruit.statusLabel === selectedStatus);
  }, [fruits, selectedStatus]);

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
            data={filteredFruits}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id));
              deleteFruits.mutate({ ids });
            }}
            disabled={isDisabled}
            toolbar={filtersToolbar}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FruitsPage;
