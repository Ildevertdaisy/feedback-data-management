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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  nom_rentree: z
    .string({ required_error: "Le nom de la rentrée est requis" })
    .min(1, "Le nom de la rentrée est requis"),
  date_rentree: z
    .string({ required_error: "La date de rentrée est requise" })
    .min(1, "La date de rentrée est requise"),
  date_debut_chatgui: z
    .string({ required_error: "La date de début Chatgui est requise" })
    .min(1, "La date de début Chatgui est requise"),
  date_fin_chatgui: z
    .string({ required_error: "La date de fin Chatgui est requise" })
    .min(1, "La date de fin Chatgui est requise"),
  description: z.string().optional(),
});

export type RentreeFormValues = z.infer<typeof formSchema>;

export type RentreeSubmitValues = {
  nom_rentree: string;
  date_rentree: string;
  date_debut_chatgui: string;
  date_fin_chatgui: string;
  description: string | null;
};

type Props = {
  id?: number;
  defaultValues?: RentreeFormValues;
  onSubmit: (values: RentreeSubmitValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const transformValues = (values: RentreeFormValues): RentreeSubmitValues => ({
  nom_rentree: values.nom_rentree,
  date_rentree: values.date_rentree,
  date_debut_chatgui: values.date_debut_chatgui,
  date_fin_chatgui: values.date_fin_chatgui,
  description: values.description && values.description.length
    ? values.description
    : null,
});

export const RentreeForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<RentreeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: RentreeFormValues) => {
    onSubmit(transformValues(values));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          name="nom_rentree"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la rentrée</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Ex: Septembre 2025"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="date_rentree"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de rentrée</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="date_debut_chatgui"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Début collecte Chatgui</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={disabled}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="date_fin_chatgui"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fin collecte Chatgui</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={disabled}
                  value={field.value}
                  onChange={field.onChange}
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
                  placeholder="Ajouter une description de la rentrée"
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
            onClick={onDelete}
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
