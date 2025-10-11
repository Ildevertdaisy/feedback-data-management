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
  type: z.string().min(1, "Le type est requis"),
  date: z.string().optional(),
});

export type EventFormValues = z.infer<typeof formSchema>;

export type EventSubmitValues = {
  type: string;
  date: string | null;
};

type Props = {
  id?: number;
  defaultValues?: EventFormValues;
  onSubmit: (values: EventSubmitValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const transformValues = (values: EventFormValues): EventSubmitValues => ({
  type: values.type,
  date: values.date ? new Date(values.date).toISOString() : null,
});

export const EventForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: EventFormValues) => {
    onSubmit(transformValues(values));
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'évènement</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Type d'évènement"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  type="datetime-local"
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
