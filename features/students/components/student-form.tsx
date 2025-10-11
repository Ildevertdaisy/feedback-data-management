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

const formSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  gender: z.string().optional(),
  jdsn: z.string().optional(),
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
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Identifiant JDSN"
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
