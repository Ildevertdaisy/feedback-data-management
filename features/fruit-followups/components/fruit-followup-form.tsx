import { useMemo } from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { DatePicker } from "@/components/date-picker";
import { useGetFruits } from "@/features/fruits/api/use-get-fruits";
import { useGetStudents } from "@/features/students/api/use-get-students";

const formSchema = z.object({
  fruit_id: z.string({ required_error: "Le fruit est requis" }),
  student_id: z.string({ required_error: "L'étudiant est requis" }),
  last_date: z.string().optional(),
});

export type FruitFollowupFormValues = z.infer<typeof formSchema>;

export type FruitFollowupSubmitValues = {
  fruit_id: number;
  student_id: number;
  last_date: string | null;
};

type Props = {
  id?: number;
  defaultValues?: FruitFollowupFormValues;
  onSubmit: (values: FruitFollowupSubmitValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const transformValues = (
  values: FruitFollowupFormValues,
): FruitFollowupSubmitValues => ({
  fruit_id: Number(values.fruit_id),
  student_id: Number(values.student_id),
  last_date: values.last_date ? values.last_date : null,
});

export const FruitFollowupForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FruitFollowupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const fruitsQuery = useGetFruits();
  const studentsQuery = useGetStudents();

  const fruitOptions = useMemo(
    () =>
      (fruitsQuery.data ?? []).map((fruit) => ({
        value: fruit.id.toString(),
        label: fruit.firstname ?? `Fruit ${fruit.id}`,
      })),
    [fruitsQuery.data],
  );

  const studentOptions = useMemo(
    () =>
      (studentsQuery.data ?? []).map((student) => ({
        value: student.id.toString(),
        label: student.firstname ?? `Étudiant ${student.id}`,
      })),
    [studentsQuery.data],
  );

  const handleSubmit = (values: FruitFollowupFormValues) => {
    onSubmit(transformValues(values));
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          name="fruit_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fruit</FormLabel>
              <Select
                disabled={disabled || fruitsQuery.isLoading}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un fruit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fruitOptions.length ? (
                    fruitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Aucun fruit disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="student_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Étudiant</FormLabel>
              <Select
                disabled={disabled || studentsQuery.isLoading}
                onValueChange={field.onChange}
                value={field.value}
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
          name="last_date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dernier suivi</FormLabel>
              <DatePicker
                disabled={disabled}
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) =>
                  field.onChange(date ? date.toISOString() : "")
                }
              />
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
