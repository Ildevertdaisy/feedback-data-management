import { Loader2 } from "lucide-react";

import { FruitFollowupForm, FruitFollowupFormValues, FruitFollowupSubmitValues } from "@/features/fruit-followups/components/fruit-followup-form";
import { useOpenFruitFollowup } from "@/features/fruit-followups/hooks/use-open-fruit-followup";
import { useGetFruitFollowup } from "@/features/fruit-followups/api/use-get-fruit-followup";
import { useEditFruitFollowup } from "@/features/fruit-followups/api/use-edit-fruit-followup";
import { useDeleteFruitFollowup } from "@/features/fruit-followups/api/use-delete-fruit-followup";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const emptyValues: FruitFollowupFormValues = {
  fruit_id: "",
  student_id: "",
  last_date: "",
};

export const EditFruitFollowupSheet = () => {
  const { isOpen, onClose, id } = useOpenFruitFollowup();

  const [ConfirmDialog, confirm] = useConfirm(
    "Supprimer le suivi ?",
    "Cette action est définitive.",
  );

  const followupQuery = useGetFruitFollowup(id);
  const editMutation = useEditFruitFollowup(id);
  const deleteMutation = useDeleteFruitFollowup(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = followupQuery.isLoading;

  const onSubmit = (values: FruitFollowupSubmitValues) => {
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

  const defaultValues: FruitFollowupFormValues = followupQuery.data
    ? {
        fruit_id: followupQuery.data.fruit_id?.toString() ?? "",
        student_id: followupQuery.data.student_id?.toString() ?? "",
        last_date: followupQuery.data.last_date ?? "",
      }
    : emptyValues;

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Modifier le suivi fruit</SheetTitle>
            <SheetDescription>
              Actualisez les informations du suivi sélectionné.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <FruitFollowupForm
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
