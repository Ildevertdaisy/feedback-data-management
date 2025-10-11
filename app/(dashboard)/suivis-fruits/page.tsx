"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, RotateCcw } from "lucide-react";

import { useNewFruitFollowup } from "@/features/fruit-followups/hooks/use-new-fruit-followup";
import { useGetFruitFollowups } from "@/features/fruit-followups/api/use-get-fruit-followups";
import { useBulkDeleteFruitFollowups } from "@/features/fruit-followups/api/use-bulk-delete-fruit-followups";
import { useGetFruits } from "@/features/fruits/api/use-get-fruits";
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

const FruitFollowupsPage = () => {
  const newFollowup = useNewFruitFollowup();
  const deleteFollowups = useBulkDeleteFruitFollowups();
  const fruitsQuery = useGetFruits();
  const studentsQuery = useGetStudents();

  const [fruitFilter, setFruitFilter] = useState<string>("");
  const [studentFilter, setStudentFilter] = useState<string>("");
  const [daysFilter, setDaysFilter] = useState<string>("180");

  const filters = useMemo(() => {
    const parsedDays = Number(daysFilter);
    const daysValue =
      !fruitFilter && !studentFilter && Number.isFinite(parsedDays) && parsedDays > 0
        ? parsedDays
        : undefined;

    return {
      fruitId: fruitFilter ? Number(fruitFilter) : undefined,
      studentId: studentFilter ? Number(studentFilter) : undefined,
      days: daysValue,
    };
  }, [fruitFilter, studentFilter, daysFilter]);

  const followupsQuery = useGetFruitFollowups(filters);
  const followups = followupsQuery.data || [];

  const isDisabled = followupsQuery.isLoading || deleteFollowups.isPending;

  const handleClearFilters = () => {
    setFruitFilter("");
    setStudentFilter("");
    setDaysFilter("180");
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

  const fruitOptions = (fruitsQuery.data ?? []).map((fruit) => ({
    value: fruit.id.toString(),
    label: fruit.firstname ?? `Fruit ${fruit.id}`,
  }));

  const studentOptions = (studentsQuery.data ?? []).map((student) => ({
    value: student.id.toString(),
    label: student.firstname ?? `Étudiant ${student.id}`,
  }));

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 space-y-4">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl line-clamp-1">Suivis fruits</CardTitle>
            <p className="text-sm text-muted-foreground">
              Surveillez les suivis réalisés pour chaque fruit et identifiez ceux sans interactions récentes.
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
              value={fruitFilter}
              onValueChange={(value) => setFruitFilter(value)}
              disabled={fruitsQuery.isLoading}
            >
              <SelectTrigger className="lg:w-[220px]">
                <SelectValue placeholder="Tous les fruits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les fruits</SelectItem>
                {fruitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              value={daysFilter}
              onChange={(event) => setDaysFilter(event.target.value)}
              placeholder="Période en jours"
              type="number"
              min={1}
              className="lg:w-[200px]"
              disabled={!!fruitFilter || !!studentFilter}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              disabled={!fruitFilter && !studentFilter && daysFilter === "180"}
              className="lg:ml-auto"
            >
              <RotateCcw className="size-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
          <DataTable
            filterKeys={["fruitFirstname", "studentFirstname"]}
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

export default FruitFollowupsPage;
