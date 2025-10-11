"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, RotateCcw } from "lucide-react";

import { useNewStudentFollowup } from "@/features/student-followups/hooks/use-new-student-followup";
import { useGetStudentFollowups } from "@/features/student-followups/api/use-get-student-followups";
import { useBulkDeleteStudentFollowups } from "@/features/student-followups/api/use-bulk-delete-student-followups";
import { useGetStudents } from "@/features/students/api/use-get-students";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { columns } from "./columns";

const StudentFollowupsPage = () => {
  const newFollowup = useNewStudentFollowup();
  const deleteFollowups = useBulkDeleteStudentFollowups();
  const studentsQuery = useGetStudents();

  const [studentFilter, setStudentFilter] = useState<string>("");
  const [fruitFilter, setFruitFilter] = useState<string>("");

  const filters = useMemo(
    () => ({
      studentId: studentFilter ? Number(studentFilter) : undefined,
      fruitName: fruitFilter || undefined,
    }),
    [studentFilter, fruitFilter],
  );

  const followupsQuery = useGetStudentFollowups(filters);
  const followups = followupsQuery.data || [];

  const isDisabled = followupsQuery.isLoading || deleteFollowups.isPending;

  const handleClearFilters = () => {
    setStudentFilter("");
    setFruitFilter("");
  };

  if (followupsQuery.isLoading && !followups.length) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-56" />
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

  const studentOptions = (studentsQuery.data ?? []).map((student) => ({
    value: student.id.toString(),
    label: student.firstname ?? `Étudiant ${student.id}`,
  }));

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 space-y-4">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl line-clamp-1">Suivis étudiants</CardTitle>
            <p className="text-sm text-muted-foreground">
              Suivez les actions réalisées auprès des étudiants et appliquez des filtres ciblés.
            </p>
          </div>
          <Button onClick={newFollowup.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Ajouter un suivi
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Select
              value={studentFilter}
              onValueChange={(value) => setStudentFilter(value)}
              disabled={studentsQuery.isLoading}
            >
              <SelectTrigger className="lg:w-[220px]">
                <SelectValue placeholder="Tous les étudiants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les étudiants</SelectItem>
                {studentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={fruitFilter}
              onChange={(event) => setFruitFilter(event.target.value)}
              placeholder="Filtrer par fruit associé"
              className="lg:w-[260px]"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              disabled={!studentFilter && !fruitFilter}
              className="lg:ml-auto"
            >
              <RotateCcw className="size-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
          <DataTable
            filterKeys={["studentFirstname", "fruit_name"]}
            columns={columns}
            data={followups}
            onDelete={(rows) => {
              const ids = rows.map((row) => Number(row.original.id));
              deleteFollowups.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFollowupsPage;
