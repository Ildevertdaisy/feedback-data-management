import { StudentForm, StudentSubmitValues } from "@/features/students/components/student-form";
import { useNewStudent } from "@/features/students/hooks/use-new-student";
import { useCreateStudent } from "@/features/students/api/use-create-student";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const NewStudentSheet = () => {
  const { isOpen, onClose } = useNewStudent();

  const mutation = useCreateStudent();

  const onSubmit = (values: StudentSubmitValues) => {
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
          <SheetTitle>Nouvel étudiant</SheetTitle>
          <SheetDescription>
            Créez un étudiant pour suivre ses présences et suivis.
          </SheetDescription>
        </SheetHeader>
        <StudentForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            firstname: "",
            gender: "",
            jdsn: undefined,
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
