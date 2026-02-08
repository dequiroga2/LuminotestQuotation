import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { FileBadge, Package, FlaskConical, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
      </main>
    </div>
  );
}
