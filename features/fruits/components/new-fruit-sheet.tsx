import { FruitForm, FruitSubmitValues } from "@/features/fruits/components/fruit-form";
import { useNewFruit } from "@/features/fruits/hooks/use-new-fruit";
import { useCreateFruit } from "@/features/fruits/api/use-create-fruit";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const NewFruitSheet = () => {
  const { isOpen, onClose } = useNewFruit();

  const mutation = useCreateFruit();

  const onSubmit = (values: FruitSubmitValues) => {
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
          <SheetTitle>Nouveau fruit</SheetTitle>
          <SheetDescription>
            Ajoutez un fruit pour suivre vos suivis et événements.
          </SheetDescription>
        </SheetHeader>
        <FruitForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            firstname: "",
            indo: "",
            status: "",
            location: "",
            tagui_point: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
