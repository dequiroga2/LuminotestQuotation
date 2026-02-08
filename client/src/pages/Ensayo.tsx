import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEssays } from "@/hooks/use-essays";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { usePersistentCart } from "@/hooks/use-persistent-cart";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical, Loader2, Trash2, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Ensayo() {
  const [selectedEssays, setSelectedEssays] = useState<number[]>([]);
  const { data: essays, isLoading } = useEssays();
  const { mutate: createQuotation, isPending } = useCreateQuotation();
  const [_, setLocation] = useLocation();
  const cart = usePersistentCart();

  const handleAddEssay = (essayId: string) => {
    const id = parseInt(essayId);
    if (!selectedEssays.includes(id)) {
      setSelectedEssays(prev => [...prev, id]);
    }
  };

  const removeEssayFromSelection = (id: number) => {
    setSelectedEssays(prev => prev.filter(item => item !== id));
  };

  const handleAddToCart = () => {
    if (selectedEssays.length === 0) return;
    
    const essayNames = selectedEssays
      .map(id => essays?.find(e => e.id === id)?.name)
      .filter(Boolean) as string[];
    
    const itemToAdd = {
      essayIds: selectedEssays,
      essayNames
    };

    console.log("Ensayo - Attempting to add item:", itemToAdd);
    cart.addItem(itemToAdd);
    
    // Reset selection
    setSelectedEssays([]);
  };

  const handleCreateQuotation = () => {
    const allItems: any[] = [];
    cart.items.forEach(item => {
      item.essayIds.forEach(essayId => {
        allItems.push({
          essayId
        });
      });
    });

    createQuotation({
      type: "ENSAYO",
      items: allItems
    }, {
      onSuccess: () => {
        cart.clear();
        setLocation("/success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Cotización por Ensayo</h1>
                <p className="text-slate-500">Agregue ensayos individuales a su carrito</p>
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
                  <SelectContent className="bg-white max-h-[300px] z-50">
                    {isLoading ? (
                      <div className="p-4 text-center">Cargando...</div>
                    ) : (
                      essays?.map((essay) => (
                        <SelectItem 
                          key={essay.id} 
                          value={essay.id.toString()}
                          className="hover:bg-slate-100"
                        >
                          {essay.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Essays List */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900">Ensayos seleccionados para agregar ({selectedEssays.length})</h3>
                {selectedEssays.length === 0 && (
                  <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                    <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Selecciona ensayos para agregar</p>
                  </div>
                )}
                
                {selectedEssays.map((id) => {
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
                        onClick={() => removeEssayFromSelection(id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {selectedEssays.length > 0 && (
                <Button 
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-blue-500/20" 
                  onClick={handleAddToCart}
                >
                  Agregar al Carrito
                </Button>
              )}
            </motion.div>
          </div>

          {/* Cart Sidebar */}
          <div className="w-96 sticky top-20 h-fit">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Carrito ({cart.items.length})</span>
                </div>
              </div>

              <ScrollArea className="flex-1">
                {cart.items.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 text-sm">
                              {item.productName || "Lote de ensayos"}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {item.essayIds?.length || 0} ensayo{(item.essayIds?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => item.id && cart.removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1 pl-2">
                          {(item.essayNames || []).map((name, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-slate-400">•</span>
                              <span className="line-clamp-1">{name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Separator />
              <div className="p-4 space-y-2">
                <div className="text-sm font-medium text-slate-600">
                  Total: <span className="text-lg text-blue-600 font-bold">{cart.getTotalEssays()}</span> ensayos
                </div>
                <Button 
                  className="w-full"
                  size="lg"
                  disabled={cart.items.length === 0 || isPending}
                  onClick={handleCreateQuotation}
                >
                  {isPending ? <Loader2 className="animate-spin mr-2" /> : "Crear Cotización"}
                </Button>
                {cart.items.length > 0 && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => cart.clear()}
                  >
                    Limpiar Carrito
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
