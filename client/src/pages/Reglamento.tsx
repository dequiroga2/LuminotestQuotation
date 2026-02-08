import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useProducts } from "@/hooks/use-products";
import { useEssaysByProduct } from "@/hooks/use-essays-by-product";
import { useEssays } from "@/hooks/use-essays";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { useTitulos } from "@/hooks/use-titulos";
import { usePersistentCart } from "@/hooks/use-persistent-cart";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2, Package, Search, Trash2, ShoppingCart } from "lucide-react";

type ReglamentoType = "RETILAP" | "RETIE" | "OTROS";
type FlowType = "reglamento" | "producto" | null;

export default function Reglamento() {
  const [selectedType, setSelectedType] = useState<ReglamentoType | null>(null);
  const [flowType, setFlowType] = useState<FlowType>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedEssays, setSelectedEssays] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const { data: titulos } = useTitulos();
  const { data: allProducts } = useProducts(selectedType || undefined);
  const { data: essays } = useEssays();
  const { data: essaysByProduct } = useEssaysByProduct(selectedProduct);
  const { mutate: createQuotation, isPending: isCreating } = useCreateQuotation();
  const [_, setLocation] = useLocation();

  const cart = usePersistentCart();

  // Filter products based on flow type
  let filteredProducts = allProducts || [];
  if (flowType === "reglamento" && selectedTitle) {
    filteredProducts = filteredProducts.filter((p) => p.titulo === selectedTitle);
  }
  filteredProducts = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedProductDetails = allProducts?.find((p) => p.id === selectedProduct);
  // essaysByProduct already contains the filtered essays for this product
  const availableEssays = essaysByProduct || [];

  const getStepLabel = () => {
    if (!selectedType) return "Paso 1 de 5: Seleccionar Normativa";
    if (!flowType) return "Paso 2 de 5: Seleccionar Método";
    if (flowType === "reglamento" && !selectedTitle) return "Paso 3 de 5: Seleccionar Título";
    if (!selectedProduct) return "Paso 4 de 5: Seleccionar Producto";
    return "Paso 5 de 5: Seleccionar Ensayos";
  };

  const handleAddToCart = () => {
    if (!selectedProduct || selectedEssays.length === 0) return;

    const essayNames = selectedEssays
      .map((id) => essays?.find((e) => e.id === id)?.name)
      .filter(Boolean) as string[];

    const itemToAdd = {
      productId: selectedProduct,
      productName: selectedProductDetails?.name || "Producto",
      essayIds: selectedEssays,
      essayNames
    };

    console.log("Reglamento - Attempting to add item:", itemToAdd);
    cart.addItem(itemToAdd);

    // Reset for next product
    setSelectedProduct(null);
    setSelectedEssays([]);
  };

  const handleSubmit = () => {
    if (cart.items.length === 0) return;

    const items = cart.items.flatMap((item) =>
      item.essayIds.map((essayId) => ({
        ...(item.productId && { productId: item.productId }),
        essayId: essayId,
      }))
    );

    createQuotation(
      {
        type: "REGLAMENTO",
        reglamentoType: selectedType!,
        items: items,
      },
      {
        onSuccess: () => {
          cart.clear();
          setLocation("/success");
        },
      }
    );
  };

  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
      setSelectedEssays([]);
    } else if (selectedTitle) {
      setSelectedTitle(null);
    } else if (flowType) {
      setFlowType(null);
    } else if (selectedType) {
      setSelectedType(null);
    } else {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Cotización por Reglamento</h1>
                <p className="text-slate-500">{getStepLabel()}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Select Regulation Type */}
              {!selectedType && (
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
                      onClick={() => {
                        setSelectedType(type);
                        setFlowType(null);
                      }}
                      className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="text-2xl font-bold">{type[0]}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{type}</h3>
                      <p className="text-sm text-slate-500 text-center">
                        {type === "RETILAP" && "Reglamento Técnico de Iluminación y Alumbrado Público"}
                        {type === "RETIE" && "Reglamento Técnico de Instalaciones Eléctricas"}
                        {type === "OTROS" && "Otros reglamentos y normativas aplicables"}
                      </p>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* STEP 2: Select Flow Type */}
              {selectedType && !flowType && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <button
                    onClick={() => setFlowType("reglamento")}
                    className="group flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 group-hover:from-primary group-hover:to-blue-400 group-hover:text-white transition-all">
                      <span className="text-4xl">📋</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Por Reglamento</h3>
                    <p className="text-sm text-slate-500 text-center">
                      Navega por los títulos y categorías definidas en {selectedType}
                    </p>
                  </button>

                  <button
                    onClick={() => setFlowType("producto")}
                    className="group flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-6 group-hover:from-purple-500 group-hover:to-purple-400 group-hover:text-white transition-all">
                      <span className="text-4xl">🛍️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Por Producto</h3>
                    <p className="text-sm text-slate-500 text-center">
                      Selecciona directamente los productos disponibles en {selectedType}
                    </p>
                  </button>
                </motion.div>
              )}

              {/* STEP 3: Select Title (Por Reglamento) */}
              {flowType === "reglamento" && !selectedTitle && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {titulos.map((titulo) => (
                    <button
                      key={titulo.code}
                      onClick={() => setSelectedTitle(titulo.nombre)}
                      className="flex flex-col items-start p-6 bg-white rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all text-left h-full"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 text-xl font-bold">
                        {titulo.id}
                      </div>
                      <h4 className="font-semibold text-slate-900 line-clamp-2">{titulo.nombre}</h4>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* STEP 4: Select Product */}
              {(flowType === "producto" || selectedTitle) && !selectedProduct && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {selectedTitle && (
                    <Card className="p-4 bg-blue-50/50 border-blue-100">
                      <p className="text-sm text-slate-600">
                        <strong>Productos en:</strong> {selectedTitle}
                      </p>
                    </Card>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Buscar producto..."
                      className="pl-10 h-12 text-lg bg-white shadow-sm border-slate-200"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product.id)}
                        className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all text-center h-full min-h-[140px]"
                      >
                        <Package className="w-8 h-8 text-blue-500 mb-3 opacity-80" />
                        <span className="font-medium text-slate-700 text-sm line-clamp-3">
                          {product.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      No hay productos disponibles
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 5: Select Essays */}
              {selectedProduct && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-50/30 border-blue-100">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{selectedProductDetails?.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Categoría: {selectedProductDetails?.category}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-amber-50/50 border-amber-100">
                    <p className="text-sm text-slate-600">
                      Seleccione los ensayos que necesita para este producto. Los ensayos requeridos pueden variar según las aplicaciones específicas.
                    </p>
                  </Card>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y max-h-96 overflow-y-auto">
                    {availableEssays.length > 0 ? (
                      availableEssays.map((essay) => (
                        <div
                          key={essay.id}
                          className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                            selectedEssays.includes(essay.id) ? "bg-blue-50/50" : ""
                          }`}
                          onClick={() => {
                            setSelectedEssays((prev) =>
                              prev.includes(essay.id)
                                ? prev.filter((e) => e !== essay.id)
                                : [...prev, essay.id]
                            );
                          }}
                        >
                          <Checkbox
                            checked={selectedEssays.includes(essay.id)}
                            onCheckedChange={() => {
                              setSelectedEssays((prev) =>
                                prev.includes(essay.id)
                                  ? prev.filter((e) => e !== essay.id)
                                  : [...prev, essay.id]
                              );
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-sm break-words">
                              {essay.name}
                            </h4>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                              {essay.category}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400">
                        No hay ensayos disponibles para este producto
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedProduct(null);
                        setSelectedEssays([]);
                      }}
                    >
                      Cambiar Producto
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={selectedEssays.length === 0}
                      onClick={handleAddToCart}
                    >
                      <Check className="mr-2 w-4 h-4" />
                      Agregar al Carrito
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Shopping Cart Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingCart className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Tu Carrito</h3>
                </div>
                <p className="text-blue-100 text-sm">
                  {cart.getTotalEssays()} ensayo{cart.getTotalEssays() !== 1 ? "s" : ""} seleccionado{cart.getTotalEssays() !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Items */}
              <div className="divide-y max-h-96 overflow-y-auto">
                {cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm break-words">
                            {item.productName || "Lote de ensayos"}
                          </h4>
                        </div>
                        <button
                          onClick={() => item.id && cart.removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2 ml-4">
                        {(item.essayIds || []).map((essayId, essayIdx) => (
                          <div key={essayId} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-600 break-words">
                              {item.essayNames?.[essayIdx] || "Ensayo"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Tu carrito está vacío</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t space-y-3">
                <Button
                  className="w-full"
                  disabled={cart.items.length === 0 || isCreating}
                  onClick={handleSubmit}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 animate-spin w-4 h-4" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 w-4 h-4" />
                      Solicitar Cotización
                    </>
                  )}
                </Button>
                {cart.items.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
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
