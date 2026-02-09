import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api, type CreateQuotationRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

export function useQuotations() {
  const { token } = useFirebaseAuth();
  
  return useQuery({
    queryKey: [api.quotations.list.path],
    queryFn: async () => {
      const res = await fetch(api.quotations.list.path, { 
        credentials: "include",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch quotations");
      return api.quotations.list.responses[200].parse(await res.json());
    },
    enabled: !!token, // Only run when we have a token
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { token } = useFirebaseAuth();

  return useMutation({
    mutationFn: async (data: CreateQuotationRequest) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(api.quotations.create.path, {
        method: "POST",
        headers,
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
