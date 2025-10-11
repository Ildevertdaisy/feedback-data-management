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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { useGetStudents } from "@/features/students/api/use-get-students";

const formSchema = z.object({
  student_id: z.string({ required_error: "L'étudiant est requis" }),
  fruit_name: z.string().optional(),
  description: z.string().optional(),
  created_at: z.string().optional(),
});

export type StudentFollowupFormValues = z.infer<typeof formSchema>;

export type StudentFollowupSubmitValues = {
  student_id: number;
  fruit_name: string | null;
  description: string | null;
  created_at: string | null;
};

type Props = {
  id?: number;
  defaultValues?: StudentFollowupFormValues;
  onSubmit: (values: StudentFollowupSubmitValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const transformValues = (
  values: StudentFollowupFormValues,
): StudentFollowupSubmitValues => ({
  student_id: Number(values.student_id),
  fruit_name: values.fruit_name ? values.fruit_name : null,
  description: values.description ? values.description : null,
  created_at: values.created_at ? values.created_at : null,
});

export const StudentFollowupForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<StudentFollowupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const studentsQuery = useGetStudents();

  const studentOptions = useMemo(
    () =>
      (studentsQuery.data ?? []).map((student) => ({
        value: student.id.toString(),
        label: student.firstname ?? `Étudiant ${student.id}`,
      })),
    [studentsQuery.data],
  );

  const handleSubmit = (values: StudentFollowupFormValues) => {
    onSubmit(transformValues(values));
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
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
          name="fruit_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du fruit</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Associez un fruit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={disabled}
                  placeholder="Notes de suivi"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="created_at"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date du suivi</FormLabel>
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
