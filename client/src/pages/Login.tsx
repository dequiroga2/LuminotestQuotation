import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de login (decorativo por ahora)
    setTimeout(() => {
      const mockUser = {
        id: "mock-user-id",
        email: email,
        username: email.split("@")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });

      setIsLoading(false);
      window.location.href = "/dashboard";
    }, 1000);
  };

  const handleRegister = () => {
    toast({
      title: "Registro",
      description: "La funcionalidad de registro estará disponible próximamente",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-3xl">L</span>
              </div>
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-wide">
              LUMINOTEST
            </h1>
            <p className="text-blue-100 mt-2 font-medium">
              Sistema de Cotizaciones
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-base shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={handleRegister}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Sistema seguro de gestión de cotizaciones
        </p>
      </motion.div>
    </div>
  );
}
