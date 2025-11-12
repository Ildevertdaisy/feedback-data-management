import { Loader2 } from "lucide-react";

import { RentreeForm, RentreeFormValues, RentreeSubmitValues } from "@/features/rentrees/components/rentree-form";
import { useOpenRentree } from "@/features/rentrees/hooks/use-open-rentree";
import { useGetRentree } from "@/features/rentrees/api/use-get-rentree";
import { useEditRentree } from "@/features/rentrees/api/use-edit-rentree";
import { useDeleteRentree } from "@/features/rentrees/api/use-delete-rentree";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const EMPTY_VALUES: RentreeFormValues = {
  nom_rentree: "",
  date_rentree: "",
  date_debut_chatgui: "",
  date_fin_chatgui: "",
  description: "",
};

export const EditRentreeSheet = () => {
  const { isOpen, onClose, id } = useOpenRentree();

  const [ConfirmDialog, confirm] = useConfirm(
    "Supprimer la rentrée ?",
    "Cette action est définitive.",
  );

  const rentreeQuery = useGetRentree(id);
  const editMutation = useEditRentree(id);
  const deleteMutation = useDeleteRentree(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = rentreeQuery.isLoading;

  const onSubmit = (values: RentreeSubmitValues) => {
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

  const defaultValues: RentreeFormValues = rentreeQuery.data
    ? {
        nom_rentree: rentreeQuery.data.nom_rentree ?? "",
        date_rentree: rentreeQuery.data.date_rentree ?? "",
        date_debut_chatgui: rentreeQuery.data.date_debut_chatgui ?? "",
        date_fin_chatgui: rentreeQuery.data.date_fin_chatgui ?? "",
        description: rentreeQuery.data.description ?? "",
      }
    : { ...EMPTY_VALUES };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Modifier la rentrée</SheetTitle>
            <SheetDescription>
              Mettez à jour les informations de la rentrée sélectionnée.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <RentreeForm
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
