import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEssays } from "@/hooks/use-essays";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical, Loader2, Trash2 } from "lucide-react";

export default function Ensayo() {
  const [items, setItems] = useState<number[]>([]); // Array of essay IDs
  const { data: essays, isLoading } = useEssays();
  const { mutate: createQuotation, isPending } = useCreateQuotation();
  const [_, setLocation] = useLocation();

  const handleAddEssay = (essayId: string) => {
    const id = parseInt(essayId);
    if (!items.includes(id)) {
      setItems(prev => [...prev, id]);
    }
  };

  const removeEssay = (id: number) => {
    setItems(prev => prev.filter(item => item !== id));
  };

  const handleSubmit = () => {
    createQuotation({
      type: "ENSAYO",
      items: items.map(id => ({ essayId: id }))
    }, {
      onSuccess: () => setLocation("/success")
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Cotización por Ensayo</h1>
              <p className="text-slate-500">Agregue ensayos individuales a su lista</p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Add Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Ensayo</label>
              <Select onValueChange={handleAddEssay}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Buscar en la lista..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="p-4 text-center">Cargando...</div>
                  ) : (
                    essays?.map((essay) => (
                      <SelectItem key={essay.id} value={essay.id.toString()}>
                        {essay.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* List */}
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay ensayos seleccionados</p>
                </div>
              )}
              
              {items.map((id) => {
                const essay = essays?.find(e => e.id === id);
                return (
                  <motion.div 
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100"
                  >
                    <div>
                      <h4 className="font-medium text-slate-900">{essay?.name}</h4>
                      <span className="text-xs text-slate-500">{essay?.category}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeEssay(id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {items.length > 0 && (
              <Button 
                className="w-full h-14 text-lg rounded-xl shadow-lg shadow-blue-500/20" 
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin mr-2" /> : "Crear Cotización"}
              </Button>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
