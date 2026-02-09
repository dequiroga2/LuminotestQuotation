import { useState } from "react";
import { useNavigate } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { signIn, signUp, signInWithGoogle } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Componente de Login con Firebase
 * Soporta:
 * - Inicio de sesión con email/password
 * - Registro con email/password
 * - Inicio de sesión con Google
 */
export function FirebaseLoginComponent() {
  const { user, loading, token } = useFirebaseAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Si ya está autenticado, redirige
  if (user) {
    navigate("/dashboard");
    return null;
  }

  // Mientras carga el estado de autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password);
      }
      
      // El useFirebaseAuth hook detectará el cambio y redirigirá
    } catch (err: any) {
      const errorMessage = err?.message || "Error de autenticación";
      setError(
        mode === "login"
          ? "Email o contraseña incorrectos"
          : "No pudimos crear tu cuenta. El email ya está en uso."
      );
      console.error("Auth error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithGoogle();
      // El useFirebaseAuth hook detectará el cambio y redirigirá
    } catch (err: any) {
      setError("Error al iniciar sesión con Google");
      console.error("Google signin error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Cargando..."
              : mode === "login"
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
          </Button>
        </form>

        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            🔵 Iniciar con Google
          </Button>
        </div>

        <div className="mt-6 text-center">
          {mode === "login" ? (
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Crear una
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>

        {token && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 text-sm rounded">
            ✓ Token disponible para API requests
          </div>
        )}
      </div>
    </div>
  );
}

export default FirebaseLoginComponent;
