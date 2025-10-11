import { StudentFollowupForm, StudentFollowupSubmitValues } from "@/features/student-followups/components/student-followup-form";
import { useNewStudentFollowup } from "@/features/student-followups/hooks/use-new-student-followup";
import { useCreateStudentFollowup } from "@/features/student-followups/api/use-create-student-followup";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const emptyValues = {
  student_id: "",
  fruit_name: "",
  description: "",
  created_at: "",
};

export const NewStudentFollowupSheet = () => {
  const { isOpen, onClose } = useNewStudentFollowup();

  const mutation = useCreateStudentFollowup();

  const onSubmit = (values: StudentFollowupSubmitValues) => {
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
          <SheetTitle>Nouveau suivi étudiant</SheetTitle>
          <SheetDescription>
            Enregistrez un nouveau suivi pour un étudiant sans exposer d'identifiants techniques.
          </SheetDescription>
        </SheetHeader>
        <StudentFollowupForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={emptyValues}
        />
      </SheetContent>
    </Sheet>
  );
};
