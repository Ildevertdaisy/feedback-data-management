import { useQuery } from "@tanstack/react-query";

export const useGetFruits = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/fruits");

      if (!response.ok) {
        throw new Error("Failed to fetch fruits");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};