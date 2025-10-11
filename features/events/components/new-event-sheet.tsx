import { EventForm, EventSubmitValues } from "@/features/events/components/event-form";
import { useNewEvent } from "@/features/events/hooks/use-new-event";
import { useCreateEvent } from "@/features/events/api/use-create-event";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const NewEventSheet = () => {
  const { isOpen, onClose } = useNewEvent();

  const mutation = useCreateEvent();

  const onSubmit = (values: EventSubmitValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Nouvel évènement</SheetTitle>
          <SheetDescription>
            Planifiez un évènement et partagez-le avec votre équipe.
          </SheetDescription>
        </SheetHeader>
        <EventForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            type: "",
            date: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
