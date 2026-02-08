import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/use-products";
import { useEssays } from "@/hooks/use-essays";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { usePersistentCart } from "@/hooks/use-persistent-cart";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2, Search, Package, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Producto() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedEssays, setSelectedEssays] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: essays, isLoading: loadingEssays } = useEssays();
  const { mutate: createQuotation, isPending } = useCreateQuotation();
  const [_, setLocation] = useLocation();
  const cart = usePersistentCart();

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleProductSelect = (id: number) => {
    setSelectedProduct(id);
    setSelectedEssays([]);
    setStep(2);
  };

  const toggleEssay = (id: number) => {
    setSelectedEssays(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    if (!selectedProduct || selectedEssays.length === 0) return;
    
    const productName = selectedProductDetails?.name || "Producto";
    const essayNames = selectedEssays
      .map(id => essays?.find(e => e.id === id)?.name)
      .filter(Boolean) as string[];
    
    const itemToAdd = {
      productId: selectedProduct,
      productName,
      essayIds: selectedEssays,
      essayNames
    };

    console.log("Producto - Attempting to add item:", itemToAdd);
    cart.addItem(itemToAdd);
    
    // Reset selection
    setSelectedProduct(null);
    setSelectedEssays([]);
    setStep(1);
  };

  const handleCreateQuotation = () => {
    const allItems: any[] = [];
    cart.items.forEach(item => {
      item.essayIds.forEach(essayId => {
        allItems.push({
          ...(item.productId && { productId: item.productId }),
          essayId
        });
      });
    });

    createQuotation({
      type: "PRODUCTO",
      items: allItems
    }, {
      onSuccess: () => {
        cart.clear();
        setLocation("/success");
      }
    });
  };

  const selectedProductDetails = products?.find(p => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" onClick={() => step === 1 ? setLocation("/dashboard") : setStep(1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Cotización por Producto</h1>
                <p className="text-slate-500">
                  {step === 1 ? "Seleccione un producto para ver sus ensayos disponibles" : `Ensayos para: ${selectedProductDetails?.name}`}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input 
                      placeholder="Buscar producto (ej: Aisladores, Cables...)" 
                      className="pl-10 h-12 text-lg bg-white shadow-sm border-slate-200"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {loadingProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts?.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product.id)}
                          className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all text-center h-full min-h-[140px]"
                        >
                          <Package className="w-8 h-8 text-blue-500 mb-3 opacity-80" />
                          <span className="font-medium text-slate-700 text-sm line-clamp-3">
                            {product.name}
                          </span>
                        </button>
                      ))}
                      {filteredProducts?.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400">
                          No se encontraron productos que coincidan con su búsqueda.
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Product Summary Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedProductDetails?.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">Categoría: {selectedProductDetails?.category}</p>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-slate-600">Ensayos seleccionados</span>
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {selectedEssays.length}
                        </span>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        disabled={selectedEssays.length === 0}
                        onClick={handleAddToCart}
                      >
                        <Plus className="mr-2 w-4 h-4" />
                        Agregar al Carrito
                      </Button>
                    </div>
                  </div>

                  {/* Essay Selection */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-medium text-slate-700 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Agregar Ensayos
                    </div>
                    {loadingEssays ? (
                      <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {essays?.map((essay) => (
                          <div 
                            key={essay.id}
                            className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${selectedEssays.includes(essay.id) ? 'bg-blue-50/40' : ''}`}
                            onClick={() => toggleEssay(essay.id)}
                          >
                            <Checkbox 
                              checked={selectedEssays.includes(essay.id)}
                              onCheckedChange={() => toggleEssay(essay.id)}
                              className="mt-1"
                            />
                            <div>
                              <h4 className="font-medium text-slate-900 text-sm">{essay.name}</h4>
                              <span className="text-xs text-slate-400 mt-1 block">{essay.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 text-sm">{item.productName || "Lote de ensayos"}</h4>
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
