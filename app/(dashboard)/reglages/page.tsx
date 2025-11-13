"use client";

import { useMemo } from "react";

import { useGetRentrees } from "@/features/rentrees/api/use-get-rentrees";
import { useDefaultRentree } from "@/features/rentrees/hooks/use-default-rentree";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (value: string | null | undefined) => {
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

const ReglagesPage = () => {
  const rentreesQuery = useGetRentrees();
  const { defaultRentreeId, setDefaultRentreeId } = useDefaultRentree();

  const rentreeOptions = useMemo(() => {
    if (!rentreesQuery.data) {
      return [] as { value: string; label: string }[];
    }

    return rentreesQuery.data.map((rentree) => ({
      value: rentree.id.toString(),
      label:
        rentree.nom_rentree ??
        formatDate(rentree.date_rentree) ??
        `Rentrée #${rentree.id}`,
    }));
  }, [rentreesQuery.data]);

  const handleRentreeChange = (value: string) => {
    if (value === "none") {
      setDefaultRentreeId(null);
      return;
    }

    const parsed = Number.parseInt(value, 10);
    setDefaultRentreeId(Number.isNaN(parsed) ? null : parsed);
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-10 space-y-8">
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle>Réglages</CardTitle>
          <CardDescription>
            Définissez la rentrée en cours utilisée par défaut sur le dashboard et la
            page Fruits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="default-rentree-select">Rentrée par défaut</Label>
            {rentreesQuery.isLoading ? (
              <Skeleton className="h-10 w-full max-w-sm" />
            ) : (
              <Select
                value={
                  defaultRentreeId !== null
                    ? defaultRentreeId.toString()
                    : "none"
                }
                onValueChange={handleRentreeChange}
                disabled={!rentreeOptions.length}
              >
                <SelectTrigger
                  id="default-rentree-select"
                  className="w-full max-w-sm bg-background"
                >
                  <SelectValue placeholder="Sélectionner une rentrée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    Aucune rentrée par défaut
                  </SelectItem>
                  {rentreeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-sm text-muted-foreground">
              Cette sélection sera appliquée automatiquement au dashboard et à la page
              Fruits lors de votre prochaine visite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReglagesPage;
