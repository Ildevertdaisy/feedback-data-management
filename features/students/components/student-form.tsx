import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
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

const JDSN_OPTIONS = ["Andrea", "Béni", "Eriette", "Fann", "Madison"] as const;
const JDSN_EMPTY_VALUE = "__none";

const isValidJdsn = (value?: string | null) => {
  if (!value) {
    return true;
  }

  return JDSN_OPTIONS.includes(value as (typeof JDSN_OPTIONS)[number]);
};

const formSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  gender: z.string().optional(),
  jdsn: z
    .string()
    .optional()
    .refine(isValidJdsn, "Sélectionnez une valeur valide"),
});

export type StudentFormValues = z.infer<typeof formSchema>;

export type StudentSubmitValues = {
  firstname: string;
  gender: string | null;
  jdsn: string | null;
};

type Props = {
  id?: number;
  defaultValues?: StudentFormValues;
  onSubmit: (values: StudentSubmitValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const transformValues = (values: StudentFormValues): StudentSubmitValues => ({
  firstname: values.firstname,
  gender: values.gender ? values.gender : null,
  jdsn: values.jdsn ? values.jdsn : null,
});

export const StudentForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: StudentFormValues) => {
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
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Prénom de l'étudiant"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="gender"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Genre (F/M/Autre)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="jdsn"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>JDSN</FormLabel>
              <Select
                disabled={disabled}
                value={field.value ?? JDSN_EMPTY_VALUE}
                onValueChange={(value) => {
                  if (value === JDSN_EMPTY_VALUE) {
                    field.onChange(undefined);
                    return;
                  }

                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un JDSN" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={JDSN_EMPTY_VALUE}>Aucun</SelectItem>
                  {JDSN_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
