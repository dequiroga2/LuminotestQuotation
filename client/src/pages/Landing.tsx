import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50">Cargando...</div>;
  if (user) return <Redirect to="/dashboard" />;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="font-display font-bold text-2xl text-slate-900">
            LUMINOTEST <span className="text-blue-600">SAS</span>
          </span>
        </div>
        <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>
          Iniciar Sesión
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Sistema de Cotización Digital
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1]">
            Precisión en cada <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Ensayo</span>
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Gestione sus cotizaciones de laboratorio para RETILAP, RETIE y ensayos de producto con nuestra plataforma especializada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg rounded-xl shadow-xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all"
              onClick={() => window.location.href = "/api/login"}
            >
              Iniciar Cotización
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-lg rounded-xl border-2 hover:bg-slate-50"
            >
              Conocer Servicios
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Acreditado ONAC</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Normativa Vigente</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 relative hidden lg:block"
        >
          {/* Decorative abstract UI representation */}
          <div className="relative w-full aspect-square max-w-[600px] mx-auto">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-50/50 rounded-3xl backdrop-blur-3xl border border-white/40 shadow-2xl overflow-hidden p-8">
                <div className="space-y-6 opacity-80">
                  <div className="h-32 w-full bg-white rounded-2xl shadow-sm animate-pulse" />
                  <div className="flex gap-6">
                    <div className="h-48 w-1/2 bg-blue-50 rounded-2xl shadow-sm" />
                    <div className="h-48 w-1/2 bg-white rounded-2xl shadow-sm" />
                  </div>
                  <div className="h-24 w-full bg-white rounded-2xl shadow-sm" />
                </div>
                
                {/* Floating Card */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute top-1/4 -right-8 w-64 bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Cotización Aprobada</div>
                      <div className="text-xs text-slate-500">Hace 2 minutos</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full w-full mb-2 overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>
                </motion.div>
             </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
