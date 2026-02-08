import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Home, FileText } from "lucide-react";

export default function QuotationSuccess() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 h-[calc(100vh-64px)] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl shadow-blue-900/5 text-center max-w-lg border border-slate-100"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">
            ¡Cotización Exitosa!
          </h1>
          
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Hemos recibido su solicitud correctamente. Un asesor comercial revisará los detalles y se pondrá en contacto pronto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl">
                <Home className="mr-2 w-4 h-4" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
