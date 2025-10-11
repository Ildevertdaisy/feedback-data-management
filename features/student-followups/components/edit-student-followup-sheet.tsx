import { Loader2 } from "lucide-react";

import { StudentFollowupForm, StudentFollowupFormValues, StudentFollowupSubmitValues } from "@/features/student-followups/components/student-followup-form";
import { useOpenStudentFollowup } from "@/features/student-followups/hooks/use-open-student-followup";
import { useGetStudentFollowup } from "@/features/student-followups/api/use-get-student-followup";
import { useEditStudentFollowup } from "@/features/student-followups/api/use-edit-student-followup";
import { useDeleteStudentFollowup } from "@/features/student-followups/api/use-delete-student-followup";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const emptyValues: StudentFollowupFormValues = {
  student_id: "",
  fruit_name: "",
  description: "",
  created_at: "",
};

export const EditStudentFollowupSheet = () => {
  const { isOpen, onClose, id } = useOpenStudentFollowup();

  const [ConfirmDialog, confirm] = useConfirm(
    "Supprimer le suivi ?",
    "Cette action est définitive.",
  );

  const followupQuery = useGetStudentFollowup(id);
  const editMutation = useEditStudentFollowup(id);
  const deleteMutation = useDeleteStudentFollowup(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = followupQuery.isLoading;

  const onSubmit = (values: StudentFollowupSubmitValues) => {
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

  const defaultValues: StudentFollowupFormValues = followupQuery.data
    ? {
        student_id: followupQuery.data.student_id?.toString() ?? "",
        fruit_name: followupQuery.data.fruit_name ?? "",
        description: followupQuery.data.description ?? "",
        created_at: followupQuery.data.created_at ?? "",
      }
    : emptyValues;

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Modifier le suivi étudiant</SheetTitle>
            <SheetDescription>
              Actualisez les informations du suivi sélectionné.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <StudentFollowupForm
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
