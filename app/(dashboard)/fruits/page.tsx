"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2, Plus } from "lucide-react";

import { useNewFruit } from "@/features/fruits/hooks/use-new-fruit";
import { useGetFruits } from "@/features/fruits/api/use-get-fruits";
import { useBulkDeleteFruits } from "@/features/fruits/api/use-bulk-delete-fruits";
import { useGetStudents } from "@/features/students/api/use-get-students";
import { useGetRentrees } from "@/features/rentrees/api/use-get-rentrees";
import { useDefaultRentree } from "@/features/rentrees/hooks/use-default-rentree";

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
import { DatePicker } from "@/components/date-picker";
import { FRUIT_STATUS_SELECT_OPTIONS } from "@/features/fruits/constants";
import { FruitStatusLabel } from "@/lib/types";

import { columns } from "./columns";

const ALL_STUDENTS_VALUE = "all";
const ALL_STATUS_VALUE = "all";

const formatApiDate = (value: Date | null) => {
  if (!value) {
    return null;
  }

  return format(value, "yyyy-MM-dd");
};

const buildRentreeLabel = (value: string | null | undefined) => {
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

const FruitsPage = () => {
  const newFruit = useNewFruit();
  const deleteFruits = useBulkDeleteFruits();
  const rentreesQuery = useGetRentrees();
  const [selectedRentreeId, setSelectedRentreeId] = useState<number | null>(
    null,
  );
  const [selectedStudentValue, setSelectedStudentValue] = useState<string>(
    ALL_STUDENTS_VALUE,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    FruitStatusLabel | typeof ALL_STATUS_VALUE
  >(ALL_STATUS_VALUE);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { defaultRentreeId } = useDefaultRentree();

  useEffect(() => {
    const rentrees = rentreesQuery.data;

    if (!rentrees || rentrees.length === 0) {
      return;
    }

    const hasSelectedRentree =
      typeof selectedRentreeId === "number" &&
      rentrees.some((rentree) => rentree.id === selectedRentreeId);

    if (hasSelectedRentree) {
      return;
    }

    if (
      typeof defaultRentreeId === "number" &&
      rentrees.some((rentree) => rentree.id === defaultRentreeId)
    ) {
      setSelectedRentreeId(defaultRentreeId);
      return;
    }

    setSelectedRentreeId(rentrees[0]?.id ?? null);
  }, [defaultRentreeId, rentreesQuery.data, selectedRentreeId]);

  const studentsQuery = useGetStudents();

  const selectedStudentId = useMemo(() => {
    if (selectedStudentValue === ALL_STUDENTS_VALUE) {
      return null;
    }

    const parsedValue = Number.parseInt(selectedStudentValue, 10);
    return Number.isNaN(parsedValue) ? null : parsedValue;
  }, [selectedStudentValue]);

  const formattedStart = formatApiDate(startDate);
  const formattedEnd = formatApiDate(endDate);

  const fruitsQuery = useGetFruits({
    rentreeId: selectedRentreeId ?? undefined,
    studentId: selectedStudentId ?? undefined,
    status:
      selectedStatus === ALL_STATUS_VALUE ? null : (selectedStatus as FruitStatusLabel),
    dateSubaeStart: formattedStart,
    dateSubaeEnd: formattedEnd,
  });

  const fruits = useMemo(
    () => fruitsQuery.data ?? [],
    [fruitsQuery.data],
  );

  const isDisabled =
    fruitsQuery.isLoading || fruitsQuery.isFetching || deleteFruits.isPending;

  const studentOptions = useMemo(
    () =>
      [
        { value: ALL_STUDENTS_VALUE, label: "Tous les évangélisateurs" },
        ...(studentsQuery.data ?? []).map((student) => ({
          value: student.id.toString(),
          label: student.firstname ?? `Étudiant ${student.id}`,
        })),
      ],
    [studentsQuery.data],
  );

  const rentreeOptions = useMemo(() => {
    if (!rentreesQuery.data) {
      return [] as { value: string; label: string }[];
    }

    return rentreesQuery.data.map((rentree) => ({
      value: rentree.id.toString(),
      label:
        rentree.nom_rentree ??
        buildRentreeLabel(rentree.date_rentree) ??
        `Rentrée #${rentree.id}`,
    }));
  }, [rentreesQuery.data]);

  const statusOptions = useMemo(
    () => [
      { value: ALL_STATUS_VALUE, label: "Tous les statuts" },
      ...FRUIT_STATUS_SELECT_OPTIONS,
    ],
    [],
  );

  const handleRentreeChange = (value: string) => {
    if (value === "none") {
      setSelectedRentreeId(null);
      return;
    }

    const parsed = Number.parseInt(value, 10);
    setSelectedRentreeId(Number.isNaN(parsed) ? null : parsed);
  };

  const rentreeFilter = (
    <div className="flex flex-col gap-1">
      <Label htmlFor="fruit-rentree-filter" className="whitespace-nowrap">
        Rentrée
      </Label>
      <Select
        value={
          selectedRentreeId !== null ? selectedRentreeId.toString() : "none"
        }
        onValueChange={handleRentreeChange}
        disabled={rentreesQuery.isLoading}
      >
        <SelectTrigger
          id="fruit-rentree-filter"
          className="bg-transparent min-w-[220px]"
        >
          <SelectValue placeholder="Sélectionner une rentrée" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Toutes les rentrées</SelectItem>
          {rentreeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const studentFilter = (
    <div className="flex flex-col gap-1">
      <Label htmlFor="fruit-student-filter" className="whitespace-nowrap">
        Évangélisateur
      </Label>
      <Select
        value={selectedStudentValue}
        onValueChange={setSelectedStudentValue}
        disabled={studentsQuery.isLoading}
      >
        <SelectTrigger
          id="fruit-student-filter"
          className="bg-transparent min-w-[220px]"
        >
          <SelectValue placeholder="Tous les évangélisateurs" />
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
    <div className="flex flex-col gap-1">
      <Label htmlFor="fruit-status-filter" className="whitespace-nowrap">
        Statut
      </Label>
      <Select
        value={selectedStatus}
        onValueChange={setSelectedStatus}
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

  const dateFilter = (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">Date Subae</span>
      <div className="flex flex-wrap items-center gap-2">
        <DatePicker
          value={startDate ?? undefined}
          onChange={(date) => setStartDate(date ?? null)}
        />
        <span className="text-muted-foreground text-sm">à</span>
        <DatePicker
          value={endDate ?? undefined}
          onChange={(date) => setEndDate(date ?? null)}
        />
      </div>
    </div>
  );

  const filtersToolbar = (
    <div className="flex flex-wrap items-center gap-4">
      {rentreeFilter}
      {studentFilter}
      {statusFilter}
      {dateFilter}
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
        <CardHeader className="gap-y-4 lg:flex-row lg:items-center lg:justify-between">
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
            toolbar={filtersToolbar}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FruitsPage;
