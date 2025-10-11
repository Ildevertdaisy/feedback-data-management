import { FruitFollowupForm, FruitFollowupSubmitValues } from "@/features/fruit-followups/components/fruit-followup-form";
import { useNewFruitFollowup } from "@/features/fruit-followups/hooks/use-new-fruit-followup";
import { useCreateFruitFollowup } from "@/features/fruit-followups/api/use-create-fruit-followup";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const emptyValues = {
  fruit_id: "",
  student_id: "",
  last_date: "",
};

export const NewFruitFollowupSheet = () => {
  const { isOpen, onClose } = useNewFruitFollowup();

  const mutation = useCreateFruitFollowup();

  const onSubmit = (values: FruitFollowupSubmitValues) => {
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
          <SheetTitle>Nouveau suivi fruit</SheetTitle>
          <SheetDescription>
            Planifiez un nouveau suivi fruit sans afficher les identifiants internes.
          </SheetDescription>
        </SheetHeader>
        <FruitFollowupForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={emptyValues}
        />
      </SheetContent>
    </Sheet>
  );
};
