"use client";

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

import { columns } from "./columns";

const StudentsPage = () => {
  const newStudent = useNewStudent();
  const deleteStudents = useBulkDeleteStudents();
  const studentsQuery = useGetStudents();
  const students = studentsQuery.data || [];

  const isDisabled = studentsQuery.isLoading || deleteStudents.isPending;

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
            data={students}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id));
              deleteStudents.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
