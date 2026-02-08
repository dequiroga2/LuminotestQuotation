import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

type RegulationType = "RETILAP" | "RETIE" | "OTROS";

export function useProducts(regulationType?: RegulationType) {
  return useQuery({
    queryKey: [api.products.list.path, regulationType],
    queryFn: async () => {
      const url = regulationType 
        ? `${api.products.list.path}?regulationType=${regulationType}` 
        : api.products.list.path;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}
