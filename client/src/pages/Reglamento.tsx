import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEssays } from "@/hooks/use-essays";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { api } from "@shared/routes";

type ReglamentoType = "RETILAP" | "RETIE" | "OTROS";

export default function Reglamento() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<ReglamentoType | null>(null);
  const [selectedEssays, setSelectedEssays] = useState<number[]>([]);
  const { data: essays, isLoading } = useEssays();
  const { mutate: createQuotation, isPending: isCreating } = useCreateQuotation();
  const [_, setLocation] = useLocation();

  const handleTypeSelect = (type: ReglamentoType) => {
    setSelectedType(type);
    
    // Auto-select defaults based on type (mock logic for demo)
    if (essays) {
      const defaults = essays
        .filter(e => {
          if (type === "RETILAP") return e.isDefaultRetilap;
          if (type === "RETIE") return e.isDefaultRetie;
          return false;
        })
        .map(e => e.id);
      setSelectedEssays(defaults);
    }
    
    setStep(2);
  };

  const toggleEssay = (id: number) => {
    setSelectedEssays(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!selectedType) return;
    
    createQuotation({
      type: "REGLAMENTO",
      reglamentoType: selectedType,
      items: selectedEssays.map(id => ({ essayId: id }))
    }, {
      onSuccess: () => setLocation("/success")
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => step === 1 ? setLocation("/dashboard") : setStep(1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Cotización por Reglamento</h1>
              <p className="text-slate-500">Paso {step} de 2: {step === 1 ? "Seleccionar Normativa" : "Confirmar Ensayos"}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {(["RETILAP", "RETIE", "OTROS"] as const).map((type) => (
                  <button 
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="text-2xl font-bold">{type[0]}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{type}</h3>
                    <p className="text-sm text-slate-500 text-center">
                      Normativa oficial colombiana para instalaciones {type === "RETIE" ? "eléctricas" : "de iluminación"}.
                    </p>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-blue-50/50 border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-lg font-bold">
                      {selectedType}
                    </div>
                    <p className="text-slate-600 text-sm">
                      Hemos pre-seleccionado los ensayos obligatorios para esta normativa. Puede deseleccionar los que no requiera.
                    </p>
                  </div>
                </Card>

                {isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                  <div className="bg-white rounded-2xl border border-border shadow-sm divide-y">
                    {essays?.map((essay) => (
                      <div 
                        key={essay.id}
                        className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${selectedEssays.includes(essay.id) ? 'bg-blue-50/30' : ''}`}
                        onClick={() => toggleEssay(essay.id)}
                      >
                        <Checkbox 
                          checked={selectedEssays.includes(essay.id)}
                          onCheckedChange={() => toggleEssay(essay.id)}
                          className="mt-1"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-900">{essay.name}</h4>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full mt-1 inline-block">
                            {essay.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button 
                    size="lg" 
                    className="px-8" 
                    onClick={handleSubmit}
                    disabled={isCreating || selectedEssays.length === 0}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Confirmar Cotización
                        <Check className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
