import { Loader2 } from "lucide-react";

import { StudentForm, StudentFormValues, StudentSubmitValues } from "@/features/students/components/student-form";
import { useOpenStudent } from "@/features/students/hooks/use-open-student";
import { useGetStudent } from "@/features/students/api/use-get-student";
import { useEditStudent } from "@/features/students/api/use-edit-student";
import { useDeleteStudent } from "@/features/students/api/use-delete-student";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const emptyValues: StudentFormValues = {
  firstname: "",
  gender: "",
  jdsn: "",
};

export const EditStudentSheet = () => {
  const { isOpen, onClose, id } = useOpenStudent();

  const [ConfirmDialog, confirm] = useConfirm(
    "Supprimer l'étudiant ?",
    "Cette action est définitive."
  );

  const studentQuery = useGetStudent(id);
  const editMutation = useEditStudent(id);
  const deleteMutation = useDeleteStudent(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = studentQuery.isLoading;

  const onSubmit = (values: StudentSubmitValues) => {
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

  const defaultValues: StudentFormValues = studentQuery.data
    ? {
        firstname: studentQuery.data.firstname ?? "",
        gender: studentQuery.data.gender ?? "",
        jdsn: studentQuery.data.jdsn ?? "",
      }
    : emptyValues;

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Modifier l'étudiant</SheetTitle>
            <SheetDescription>
              Mettez à jour les informations de l'étudiant.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <StudentForm
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
