import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { z } from "zod";

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
    res.json(products);
  });

  // Essays
  app.get(api.essays.list.path, async (req, res) => {
    const essays = await storage.getEssays();
    res.json(essays);
  });

  // Quotations
  app.post(api.quotations.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.quotations.create.input.parse(req.body);
      const userId = req.user.claims.sub; // Replit Auth ID
      const quotation = await storage.createQuotation(userId, input);
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
    const userId = req.user.claims.sub;
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

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length > 0) return;

  console.log("Seeding database...");

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
    await storage.createProduct({ name, category: "Accesorios" });
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

  console.log("Database seeded!");
}
