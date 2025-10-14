"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewStudent } from "@/features/students/hooks/use-new-student";
import { useGetStudents } from "@/features/students/api/use-get-students";
import { useBulkDeleteStudents } from "@/features/students/api/use-bulk-delete-students";

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

const ALL_HJN_VALUE = "all";

const StudentsPage = () => {
  const newStudent = useNewStudent();
  const deleteStudents = useBulkDeleteStudents();
  const studentsQuery = useGetStudents();
  const students = useMemo(
    () => studentsQuery.data ?? [],
    [studentsQuery.data],
  );
  const [selectedHjnValue, setSelectedHjnValue] = useState<string>(
    ALL_HJN_VALUE,
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
      return students;
    }

    return students.filter((student) => student.jdsn === selectedHjnValue);
  }, [students, selectedHjnValue]);

  const isDisabled = studentsQuery.isLoading || deleteStudents.isPending;

  const hjnFilter = (
    <div className="flex items-center gap-2">
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
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Étudiants</CardTitle>
          <Button onClick={newStudent.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Ajouter un étudiant
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKeys={["firstname"]}
            columns={columns}
            data={filteredStudents}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id));
              deleteStudents.mutate({ ids });
            }}
            disabled={isDisabled}
            toolbar={hjnFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
