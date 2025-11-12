import { useMemo } from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStudents } from "@/features/students/api/use-get-students";
import { useGetRentrees } from "@/features/rentrees/api/use-get-rentrees";
import {
  FRUIT_STATUS_LABELS,
  FRUIT_STATUS_SELECT_OPTIONS,
  toFruitStatusPayload,
} from "@/features/fruits/constants";
import { FruitStatusLabel } from "@/lib/types";

const optionalString = z
  .string()
  .optional()
  .transform((value) => (value && value.length ? value : ""));

const formSchema = z.object({
  firstname: z
    .string({ required_error: "Le prénom est requis" })
    .min(1, "Le prénom est requis"),
  student_evangelisateur_id: z.string().optional(),
  status: z
    .enum(FRUIT_STATUS_LABELS as [FruitStatusLabel, ...FruitStatusLabel[]])
    .optional(),
  location: optionalString,
  tagui_point: optionalString,
  date_evangelisation: optionalString,
  date_subae: optionalString,
  rentree_id: z.string().optional(),
  notes: optionalString,
});

export type FruitFormValues = z.infer<typeof formSchema>;

export type FruitSubmitValues = {
  firstname: string;
  indo: number | null;
  student_evangelisateur_id: number | null;
  status: FruitStatusLabel | null;
  status_value: number | null;
  location: string | null;
  tagui_point: string | null;
  date_evangelisation: string | null;
  date_subae: string | null;
  rentree_id: number | null;
  notes: string | null;
};

type Props = {
  id?: number;
  defaultValues?: FruitFormValues;
  onSubmit: (values: FruitSubmitValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const transformValues = (values: FruitFormValues): FruitSubmitValues => {
  const studentId = values.student_evangelisateur_id
    ? Number(values.student_evangelisateur_id)
    : null;

  const rentreeId = values.rentree_id ? Number(values.rentree_id) : null;
  const statusPayload = toFruitStatusPayload(values.status ?? null);

  return {
    firstname: values.firstname,
    indo: studentId,
    student_evangelisateur_id: studentId,
    status: statusPayload.status,
    status_value: statusPayload.status_value,
    location: values.location ? values.location : null,
    tagui_point: values.tagui_point ? values.tagui_point : null,
    date_evangelisation: values.date_evangelisation
      ? values.date_evangelisation
      : null,
    date_subae: values.date_subae ? values.date_subae : null,
    rentree_id: rentreeId,
    notes: values.notes ? values.notes : null,
  };
};

export const FruitForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FruitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const studentsQuery = useGetStudents();
  const rentreesQuery = useGetRentrees();

  const studentOptions = useMemo(
    () =>
      (studentsQuery.data ?? []).map((student) => ({
        value: student.id.toString(),
        label: student.firstname ?? `Étudiant ${student.id}`,
      })),
    [studentsQuery.data],
  );

  const rentreeOptions = useMemo(() => {
    if (!rentreesQuery.data) {
      return [] as { value: string; label: string }[];
    }

    return rentreesQuery.data.map((rentree) => {
      const date = new Date(rentree.date_rentree);
      const formattedDate = Number.isNaN(date.getTime())
        ? null
        : new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(date);

      return {
        value: rentree.id.toString(),
        label:
          rentree.nom_rentree ?? formattedDate ?? `Rentrée #${rentree.id}`,
      };
    });
  }, [rentreesQuery.data]);

  const handleSubmit = (values: FruitFormValues) => {
    onSubmit(transformValues(values));
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          name="firstname"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du fruit</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Entrez le nom du fruit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="student_evangelisateur_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Étudiant associé</FormLabel>
              <Select
                disabled={disabled || studentsQuery.isLoading}
                onValueChange={field.onChange}
                value={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un étudiant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {studentOptions.length ? (
                    studentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Aucun étudiant disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select
                disabled={disabled}
                value={field.value ?? undefined}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FRUIT_STATUS_SELECT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localisation</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Ville ou lieu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="tagui_point"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Point Tagui</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Point de contact"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="date_evangelisation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'évangélisation</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={disabled}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="date_subae"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Subae</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={disabled}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="rentree_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rentrée</FormLabel>
              <Select
                disabled={disabled || rentreesQuery.isLoading}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Associer à une rentrée" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Aucune rentrée</SelectItem>
                  {rentreeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  disabled={disabled}
                  placeholder="Ajouter des notes complémentaires"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Enregistrer" : "Créer"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Supprimer
          </Button>
        )}
      </form>
    </Form>
  );
};
