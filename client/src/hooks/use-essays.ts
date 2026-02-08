import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useEssays() {
  return useQuery({
    queryKey: [api.essays.list.path],
    queryFn: async () => {
      const res = await fetch(api.essays.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch essays");
      return api.essays.list.responses[200].parse(await res.json());
    },
  });
}
