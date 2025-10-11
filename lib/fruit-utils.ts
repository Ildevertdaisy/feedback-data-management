import { apiFetch } from "@/lib/api";
import { Fruit } from "@/lib/types";

export const fetchFruitById = async (id: number) => {
  return apiFetch<Fruit>(`/fruits/${id}`);
};

export const fetchFruitFirstname = async (id: number) => {
  try {
    const fruit = await fetchFruitById(id);
    return fruit.firstname ?? null;
  } catch (error) {
    console.error(`Unable to fetch fruit ${id}`, error);
    return null;
  }
};
