import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { z } from "zod";

const QUOTATION_WEBHOOK_URL = "https://automation.luminotest.com/webhook/cotizacionesLuminotest";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    
    // Filter by regulation type if specified
    const regType = req.query.regulationType as string | undefined;
    let filtered = products;

    if (regType) {
      filtered = filtered.filter(p => {
        if (regType === 'RETILAP') return p.isRetilap;
        if (regType === 'RETIE') return p.isRetie;
        if (regType === 'OTROS') return p.isOtros;
        return true;
      });
    }

    // Filter by titulo if specified
    const titulo = req.query.titulo as string | undefined;
    if (titulo) {
      filtered = filtered.filter(p => p.titulo === titulo);
    }
    
    res.json(filtered);
  });

  // Essays
  app.get(api.essays.list.path, async (req, res) => {
    const essays = await storage.getEssays();
    
    // Filter by product if specified
    const productId = req.query.productId as string | undefined;
    if (productId) {
      try {
        const essayIds = await storage.getEssaysByProduct(Number(productId));
        const filtered = essays.filter(e => essayIds.includes(e.id));
        return res.json(filtered);
      } catch (error) {
        console.error('Error filtering essays by product:', error);
        // Return all essays on error
        return res.json(essays);
      }
    }
    
    res.json(essays);
  });

  // Quotations
  app.post(api.quotations.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.quotations.create.input.parse(req.body);
      const userId = req.user?.claims?.sub || 'dev-user'; // Replit Auth ID or dev user
      await storage.ensureUser(userId);
      const quotation = await storage.createQuotation(userId, input);
        await storage.incrementQuotations(userId);

      // Send webhook with full quotation details (best-effort)
      try {
        const fullQuotation = await storage.getQuotation(quotation.id);
        const userDetails = await storage.getUser(userId);
        
        if (fullQuotation) {
          const itemCounts = new Map<number, { quantity: number; essayName?: string; productId?: number; productName?: string }>();

          fullQuotation.items.forEach((item) => {
            if (!item.essayId) return;
            const existing = itemCounts.get(item.essayId) || { quantity: 0 };
            itemCounts.set(item.essayId, {
              quantity: existing.quantity + 1,
              essayName: item.essay?.name || existing.essayName,
              productId: item.productId || existing.productId,
              productName: item.product?.name || existing.productName
            });
          });

          const payload = {
            quotationId: fullQuotation.id,
            userId: fullQuotation.userId,
            type: fullQuotation.type,
            reglamentoType: fullQuotation.reglamentoType,
            createdAt: fullQuotation.createdAt,
            user: {
              firstName: userDetails?.firstName,
              lastName: userDetails?.lastName,
              email: userDetails?.email,
              organizacion: userDetails?.organizacion,
              direccion: userDetails?.direccion,
              telefono: userDetails?.telefono,
              ciudad: userDetails?.ciudad,
              moneda: userDetails?.moneda,
              moneySymbol: userDetails?.symbol
            },
            items: Array.from(itemCounts.entries()).map(([essayId, info]) => ({
              essayId,
              essayName: info.essayName,
              productId: info.productId,
              productName: info.productName,
              quantity: info.quantity
            })),
            rawItems: fullQuotation.items.map((item) => ({
              productId: item.productId,
              productName: item.product?.name,
              essayId: item.essayId,
              essayName: item.essay?.name
            }))
          };

          await fetch(QUOTATION_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        }
      } catch (err) {
        console.error("Error sending quotation webhook:", err);
      }

      res.status(201).json(quotation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.quotations.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub || 'dev-user';
    const quotations = await storage.getQuotations(userId);
    res.json(quotations);
  });

  app.get(api.quotations.get.path, isAuthenticated, async (req, res) => {
    const quotation = await storage.getQuotation(Number(req.params.id));
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(quotation);
  });

  // Shopping Cart
  app.get("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || 'dev-user';
      console.log("Getting cart for user:", userId);
      
      const cartItems = await storage.getShoppingCart(userId);
      console.log("Cart items from DB:", cartItems.length);
      
      // Parse JSON strings back to arrays
      const parsed = cartItems.map(item => ({
        ...item,
        essayIds: JSON.parse(item.essayIds as any),
        essayNames: JSON.parse(item.essayNames as any)
      }));
      
      res.json(parsed);
    } catch (err: any) {
      console.error("Error getting cart:", err);
      res.status(500).json({ error: err.message || "Failed to get cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || 'dev-user';
      const item = req.body;
      
      console.log("Adding to cart - User:", userId, "Item:", item);
      
      if (!item.essayIds || !Array.isArray(item.essayIds) || item.essayIds.length === 0) {
        return res.status(400).json({ error: "essayIds is required and must be a non-empty array" });
      }
      
      if (!item.essayNames || !Array.isArray(item.essayNames)) {
        return res.status(400).json({ error: "essayNames is required and must be an array" });
      }
      
      const cartItem = await storage.addToCart(userId, item);
      const parsed = {
        ...cartItem,
        essayIds: JSON.parse(cartItem.essayIds as any),
        essayNames: JSON.parse(cartItem.essayNames as any)
      };
      
        await storage.incrementInteractions(userId);
      
      console.log("Cart item added successfully:", parsed);
      res.status(201).json(parsed);
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      res.status(500).json({ error: err.message || "Failed to add item to cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || 'dev-user';
      const itemId = Number(req.params.id);
      console.log("Removing item from cart - User:", userId, "Item ID:", itemId);
      
      await storage.removeFromCart(userId, itemId);
      console.log("Item removed successfully");
      res.status(204).send();
    } catch (err: any) {
      console.error("Error removing from cart:", err);
      res.status(500).json({ error: err.message || "Failed to remove item" });
    }
  });

  app.patch("/api/cart/:id/quantity", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || 'dev-user';
      const itemId = Number(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }
      
      console.log("Updating quantity - User:", userId, "Item ID:", itemId, "Quantity:", quantity);
      await storage.updateCartItemQuantity(itemId, quantity);
      
      const updatedItem = await storage.getCartItem(itemId);
      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      const parsed = {
        ...updatedItem,
        essayIds: JSON.parse(updatedItem.essayIds as any),
        essayNames: JSON.parse(updatedItem.essayNames as any)
      };
      
      console.log("Quantity updated successfully");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      res.status(500).json({ error: err.message || "Failed to update quantity" });
    }
  });

  app.delete("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || 'dev-user';
      console.log("Clearing cart for user:", userId);
      
      await storage.clearCart(userId);
      console.log("Cart cleared successfully");
      res.status(204).send();
    } catch (err: any) {
      console.error("Error clearing cart:", err);
      res.status(500).json({ error: err.message || "Failed to clear cart" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length > 0) return;

  console.log("⏳ Seeding database with initial data...");

  // Products from Accesorios file
  const accesorios = [
    "Aisladores en resina tipo poste",
    "Alfombras y / o tapetes aislantes (de la electricidad)",
    "Balasto Lámparas Fluorescentes Tubulares",
    "Balasto lámparas de alta intensidad de descarga",
    "Balastos",
    "Baterías (pilas) primaria de referencia 9V (6LR61/6F22)",
    "Baterías (pilas) primaria de referencia AAA",
    "Baterías (pilas) primaria de referencia AA",
    "Baterías (pilas) primaria de referencia C",
    "Baterías (pilas) primaria de referencia D",
    "Baterías (pilas) primaria de referencia N",
    "Bombillas",
    "Bombillas (E14)",
    "Bombillas (E40)",
    "Bombillas Fluorescentes",
    "Bombillas LED",
    "Cables y alambres conductores",
    "Calzado dieléctrico (botas de hule)",
    "Canalizaciones",
    "Cargadores vehículos sitio",
    "Casquillos y bases de bombillas",
    "Clavijas",
    "Clavijas de uso doméstico y similares",
    "Clavijas y Tomacorriente",
    "Drivers",
    "Drivers o Controladores LED",
    "Electrodomésticos y aparatos eléctricos similares",
    "Guantes dieléctricos",
    "Interruptores automáticos (Breakers)",
    "Interruptores manuales",
    "Luminarias",
    "Luminarias LED",
    "Luminarias de Emergencia",
    "Lámparas",
    "Lámparas LED",
    "Lámparas fluorescentes",
    "Mangas dieléctricas",
    "Mantas aislantes",
    "Paneles fotovoltaicos",
    "Portalámparas",
    "Productos eléctricos",
    "Tomacorriente",
    "Tomacorrientes portátiles",
    "Tubos LED G13 y G5"
  ];

  for (const name of accesorios) {
    // Randomly assign each product to one or more regulations (70% chance for each)
    const isRetilap = Math.random() > 0.3;
    const isRetie = Math.random() > 0.3;
    const isOtros = Math.random() > 0.3;
    
    await storage.createProduct({ 
      name, 
      category: "Accesorios",
      isRetilap,
      isRetie,
      isOtros
    });
  }

  // Essays from Adhesion file
  const ensayos = [
      "Adhesión por el método de cinta",
      "Análisis dimensional",
      "Área de la sección transversal del conductor",
      "Aumento de temperatura",
      "Calentamiento y/o Aumento de temperatura",
      "Cámara salina (1 hora)",
      "Capacidad de apertura y cierre",
      "Características Eléctricas y Flujo Luminoso",
      "Distancias de aislamiento y fuga",
      "Endurancia",
      "Evaluación de la durabilidad del rotulado",
      "Fotometría",
      "Grado IP (Hermeticidad)",
      "Impedancia eléctrica",
      "Medición de resistencia a tierra",
      "Operación normal",
      "Protección Contra Choque Eléctrico",
      "Quemador de aguja",
      "Resistencia a la Corrosión",
      "Resistencia a la Humedad",
      "Resistencia de Aislamiento",
      "Rigidez Dieléctrica",
      "Resistencia al Hilo Incandescente",
      "Resistencia al Impacto (IK)",
      "Resistencia de aislamiento a tensión de impulso",
      "Tensión de circuito abierto",
      "Verificación de dimensiones"
    ];

    for (const name of ensayos) {
      // Randomly assign defaults for demo purposes since logic wasn't fully specified
      const isRetilap = Math.random() > 0.5;
      const isRetie = Math.random() > 0.5;
      await storage.createEssay({ 
        name, 
        category: "Adhesion", // Default category based on file name start
        isDefaultRetilap: isRetilap,
        isDefaultRetie: isRetie 
      });
    }

    console.log("✅ Database seeded successfully!");
}
