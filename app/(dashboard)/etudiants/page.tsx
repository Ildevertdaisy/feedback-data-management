"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewStudent } from "@/features/students/hooks/use-new-student";
import { useGetStudents } from "@/features/students/api/use-get-students";
import { useBulkDeleteStudents } from "@/features/students/api/use-bulk-delete-students";
import { useGetRentrees } from "@/features/rentrees/api/use-get-rentrees";
import { useGetFruits } from "@/features/fruits/api/use-get-fruits";

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
import type { FruitStatusLabel } from "@/lib/types";

import { columns } from "./columns";

const ALL_HJN_VALUE = "all";

type FruitStatusCounts = Partial<Record<FruitStatusLabel, number>>;

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

const StudentsPage = () => {
  const newStudent = useNewStudent();
  const deleteStudents = useBulkDeleteStudents();
  const rentreesQuery = useGetRentrees();
  const [selectedRentreeId, setSelectedRentreeId] = useState<number | null>(
    null,
  );
  const studentsQuery = useGetStudents();
  const [selectedHjnValue, setSelectedHjnValue] = useState<string>(
    ALL_HJN_VALUE,
  );

  useEffect(() => {
    if (
      selectedRentreeId === null &&
      rentreesQuery.data &&
      rentreesQuery.data.length > 0
    ) {
      setSelectedRentreeId(rentreesQuery.data[0].id);
    }
  }, [rentreesQuery.data, selectedRentreeId]);

  const fruitsQuery = useGetFruits({
    rentreeId: selectedRentreeId ?? undefined,
  });

  const students = useMemo(
    () => studentsQuery.data ?? [],
    [studentsQuery.data],
  );

  const fruitStatusMap = useMemo(() => {
    const map = new Map<number, FruitStatusCounts>();

    (fruitsQuery.data ?? []).forEach((fruit) => {
      const studentId = fruit.student_evangelisateur_id ?? fruit.indo;

      if (typeof studentId !== "number") {
        return;
      }

      const label = fruit.statusLabel;

      if (!label) {
        return;
      }

      const current = map.get(studentId) ?? {};
      current[label] = (current[label] ?? 0) + 1;
      map.set(studentId, current);
    });

    return map;
  }, [fruitsQuery.data]);

  const studentsWithFruits = useMemo(
    () =>
      students.map((student) => ({
        ...student,
        fruitStatuses: fruitStatusMap.get(student.id) ?? {},
      })),
    [students, fruitStatusMap],
  );

  const hjnOptions = useMemo(() => {
    const uniqueHjns = new Set<string>();

    students.forEach((student) => {
      if (student.jdsn) {
        uniqueHjns.add(student.jdsn);
      }
    });

    return [
      { value: ALL_HJN_VALUE, label: "Tous les HJN" },
      ...Array.from(uniqueHjns)
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({
          value,
          label: value,
        })),
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (selectedHjnValue === ALL_HJN_VALUE) {
      return studentsWithFruits;
    }

    return studentsWithFruits.filter(
      (student) => student.jdsn === selectedHjnValue,
    );
  }, [studentsWithFruits, selectedHjnValue]);

  const isDisabled =
    studentsQuery.isLoading || studentsQuery.isFetching || deleteStudents.isPending;

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
      <Label htmlFor="students-rentree-filter" className="whitespace-nowrap">
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
          id="students-rentree-filter"
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

  const hjnFilter = (
    <div className="flex flex-col gap-1">
      <Label htmlFor="student-hjn-filter" className="whitespace-nowrap">
        HJN
      </Label>
      <Select
        value={selectedHjnValue}
        onValueChange={setSelectedHjnValue}
        disabled={studentsQuery.isLoading}
      >
        <SelectTrigger
          id="student-hjn-filter"
          className="bg-transparent min-w-[200px]"
        >
          <SelectValue placeholder="Tous les HJN" />
        </SelectTrigger>
        <SelectContent>
          {hjnOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (studentsQuery.isLoading) {
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
          <CardTitle className="text-xl line-clamp-1">Étudiants</CardTitle>
          <Button onClick={newStudent.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Ajouter un étudiant
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKeys={["firstname", "jdsn"]}
            columns={columns}
            data={filteredStudents}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id));
              deleteStudents.mutate({ ids });
            }}
            disabled={isDisabled}
            toolbar={
              <div className="flex flex-wrap items-center gap-4">
                {rentreeFilter}
                {hjnFilter}
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
