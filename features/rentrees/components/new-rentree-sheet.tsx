import { RentreeForm, RentreeSubmitValues } from "@/features/rentrees/components/rentree-form";
import { useNewRentree } from "@/features/rentrees/hooks/use-new-rentree";
import { useCreateRentree } from "@/features/rentrees/api/use-create-rentree";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const EMPTY_DEFAULTS = {
  nom_rentree: "",
  date_rentree: "",
  date_debut_chatgui: "",
  date_fin_chatgui: "",
  description: "",
} as const;

export const NewRentreeSheet = () => {
  const { isOpen, onClose } = useNewRentree();

  const mutation = useCreateRentree();

  const onSubmit = (values: RentreeSubmitValues) => {
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
          <SheetTitle>Nouvelle rentrée</SheetTitle>
          <SheetDescription>
            Créez une nouvelle rentrée pour suivre vos indicateurs.
          </SheetDescription>
        </SheetHeader>
        <RentreeForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ ...EMPTY_DEFAULTS }}
        />
      </SheetContent>
    </Sheet>
  );
};
