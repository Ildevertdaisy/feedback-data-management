import { apiFetch } from "@/lib/api";
import { Student } from "@/lib/types";

export const fetchStudentById = async (id: number) => {
  return apiFetch<Student>(`/students/${id}`);
};

export const fetchStudentFirstname = async (id: number) => {
  try {
    const student = await fetchStudentById(id);
    return student.firstname ?? null;
  } catch (error) {
    console.error(`Unable to fetch student ${id}`, error);
    return null;
  }
};
