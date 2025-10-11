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
  firstname: z.string({ required_error: "Le prénom est requis" }).min(1, "Le prénom est requis"),
  indo: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  tagui_point: z.string().optional(),
});

export type FruitFormValues = z.infer<typeof formSchema>;

export type FruitSubmitValues = {
  firstname: string;
  indo: number | null;
  status: number | null;
  location: string | null;
  tagui_point: string | null;
};

type Props = {
  id?: number;
  defaultValues?: FruitFormValues;
  onSubmit: (values: FruitSubmitValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const transformValues = (values: FruitFormValues): FruitSubmitValues => ({
  firstname: values.firstname,
  indo: values.indo ? Number(values.indo) : null,
  status: values.status ? Number(values.status) : null,
  location: values.location ? values.location : null,
  tagui_point: values.tagui_point ? values.tagui_point : null,
});

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
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Entrez le prénom du fruit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="indo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indo</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Identifiant interne"
                  type="number"
                  {...field}
                />
              </FormControl>
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
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Statut (numérique)"
                  type="number"
                  {...field}
                />
              </FormControl>
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
