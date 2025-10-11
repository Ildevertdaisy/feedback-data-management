import { Loader2 } from "lucide-react";

import { FruitForm, FruitFormValues, FruitSubmitValues } from "@/features/fruits/components/fruit-form";
import { useOpenFruit } from "@/features/fruits/hooks/use-open-fruit";
import { useGetFruit } from "@/features/fruits/api/use-get-fruit";
import { useEditFruit } from "@/features/fruits/api/use-edit-fruit";
import { useDeleteFruit } from "@/features/fruits/api/use-delete-fruit";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const emptyValues: FruitFormValues = {
  firstname: "",
  indo: "",
  status: "",
  location: "",
  tagui_point: "",
};

export const EditFruitSheet = () => {
  const { isOpen, onClose, id } = useOpenFruit();

  const [ConfirmDialog, confirm] = useConfirm(
    "Supprimer le fruit ?",
    "Cette action est définitive."
  );

  const fruitQuery = useGetFruit(id);
  const editMutation = useEditFruit(id);
  const deleteMutation = useDeleteFruit(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = fruitQuery.isLoading;

  const onSubmit = (values: FruitSubmitValues) => {
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

  const defaultValues: FruitFormValues = fruitQuery.data
    ? {
        firstname: fruitQuery.data.firstname ?? "",
        indo: fruitQuery.data.indo?.toString() ?? "",
        status: fruitQuery.data.status?.toString() ?? "",
        location: fruitQuery.data.location ?? "",
        tagui_point: fruitQuery.data.tagui_point ?? "",
      }
    : emptyValues;

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Modifier le fruit</SheetTitle>
            <SheetDescription>
              Actualisez les informations d'un fruit existant.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <FruitForm
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
