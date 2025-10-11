import { Loader2 } from "lucide-react";

import { EventForm, EventFormValues, EventSubmitValues } from "@/features/events/components/event-form";
import { useOpenEvent } from "@/features/events/hooks/use-open-event";
import { useGetEvent } from "@/features/events/api/use-get-event";
import { useEditEvent } from "@/features/events/api/use-edit-event";
import { useDeleteEvent } from "@/features/events/api/use-delete-event";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const emptyValues: EventFormValues = {
  type: "",
  date: "",
};

const toInputDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

export const EditEventSheet = () => {
  const { isOpen, onClose, id } = useOpenEvent();

  const [ConfirmDialog, confirm] = useConfirm(
    "Supprimer l'évènement ?",
    "Cette action est définitive."
  );

  const eventQuery = useGetEvent(id);
  const editMutation = useEditEvent(id);
  const deleteMutation = useDeleteEvent(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = eventQuery.isLoading;

  const onSubmit = (values: EventSubmitValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues: EventFormValues = eventQuery.data
    ? {
        type: eventQuery.data.type ?? "",
        date: toInputDate(eventQuery.data.date ?? null),
      }
    : emptyValues;

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Modifier l'évènement</SheetTitle>
            <SheetDescription>
              Mettez à jour les informations de l'évènement.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <EventForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
