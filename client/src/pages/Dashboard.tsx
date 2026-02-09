import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { usePersistentCart } from "@/hooks/use-persistent-cart";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { FileBadge, Package, FlaskConical, ArrowRight, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const options = [
  {
    title: "Reglamento",
    description: "Cotización basada en normativas RETILAP, RETIE y otros estándares.",
    icon: FileBadge,
    color: "bg-blue-500",
    href: "/quote/reglamento",
    delay: 0.1
  },
  {
    title: "Producto",
    description: "Seleccione productos específicos y sus ensayos correspondientes.",
    icon: Package,
    color: "bg-indigo-500",
    href: "/quote/producto",
    delay: 0.2
  },
  {
    title: "Ensayo",
    description: "Elija ensayos individuales de nuestro catálogo completo.",
    icon: FlaskConical,
    color: "bg-cyan-500",
    href: "/quote/ensayo",
    delay: 0.3
  }
];

export default function Dashboard() {
  const { user } = useFirebaseAuth();
  const cart = usePersistentCart();
  const { mutate: createQuotation, isPending } = useCreateQuotation();
  const [_, setLocation] = useLocation();

  const handleCreateQuotation = () => {
    if (cart.items.length === 0) return;

    const items = cart.items.flatMap((item) =>
      item.essayIds.map((essayId) => ({
        ...(item.productId && { productId: item.productId }),
        essayId: essayId,
      }))
    );

    createQuotation(
      {
        type: "PRODUCTO", // Default type for mixed cart
        items: items,
      },
      {
        onSuccess: () => {
          cart.clear();
          setLocation("/success");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="text-center mb-16 space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-display font-bold text-slate-900"
              >
                Selecciona el tipo de <span className="text-primary">cotización</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 max-w-2xl mx-auto"
              >
                Bienvenido al sistema de cotización de LUMINOTEST. Elija una de las siguientes opciones para comenzar su solicitud.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {options.map((opt) => (
                <Link key={opt.title} href={opt.href} className="group cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: opt.delay }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className="h-full p-8 border-slate-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden bg-white">
                      <div className={`absolute top-0 right-0 w-32 h-32 ${opt.color} opacity-[0.03] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />
                      
                      <div className={`w-16 h-16 rounded-2xl ${opt.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                        <opt.icon size={32} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {opt.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed mb-8">
                        {opt.description}
                      </p>
                      
                      <div className="flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                        Comenzar <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Shopping Cart Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-96 sticky top-24 h-fit"
          >
            <Card className="overflow-hidden border-slate-200 shadow-lg">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-2 text-white">
                  <ShoppingCart className="w-5 h-5" />
                  <h2 className="font-bold text-lg">Carrito de Compras</h2>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>

              <ScrollArea className="h-[400px]">
                {cart.isLoading ? (
                  <div className="p-8 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : cart.items.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Tu carrito está vacío</p>
                    <p className="text-xs mt-2">Selecciona una opción arriba para comenzar</p>
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
                        <div className="text-xs text-slate-600 space-y-1 pl-2 mb-3">
                          {(item.essayNames || []).map((name, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-slate-400">•</span>
                              <span className="line-clamp-1">{name}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                          <span className="text-xs text-slate-600 font-medium">Cant:</span>
                          <div className="flex items-center gap-1 ml-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              disabled={(item.quantity || 1) <= 1}
                              onClick={() => item.id && cart.updateQuantity(item.id, (item.quantity || 1) - 1)}
                            >
                              <span className="text-lg">−</span>
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity || 1}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => item.id && cart.updateQuantity(item.id, (item.quantity || 1) + 1)}
                            >
                              <span className="text-lg">+</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {cart.items.length > 0 && (
                <>
                  <Separator />
                  <div className="p-4 space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Total de Ensayos:</span>
                      <span className="text-2xl font-bold text-blue-600">{cart.getTotalEssays()}</span>
                    </div>
                    <Button 
                      className="w-full h-12 text-base shadow-lg shadow-blue-500/20"
                      onClick={handleCreateQuotation}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="animate-spin mr-2" />
                          Procesando...
                        </>
                      ) : (
                        "Crear Cotización"
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => cart.clear()}
                    >
                      Vaciar Carrito
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
