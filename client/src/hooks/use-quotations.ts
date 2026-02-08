import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api, type CreateQuotationRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useQuotations() {
  return useQuery({
    queryKey: [api.quotations.list.path],
    queryFn: async () => {
      const res = await fetch(api.quotations.list.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch quotations");
      return api.quotations.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateQuotationRequest) => {
      const res = await fetch(api.quotations.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create quotation");
      }
      
      return api.quotations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quotations.list.path] });
      toast({
        title: "Cotización Creada",
        description: "Su solicitud ha sido enviada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
