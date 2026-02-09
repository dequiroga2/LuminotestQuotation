import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import server modules directly (without .js extension for TypeScript compilation)
import { registerRoutes } from "../server/routes";

// Create app instance
const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Initialize once
let isInitialized = false;
let initError: Error | null = null;

async function initialize() {
  if (isInitialized) return;
  if (initError) throw initError;
  
  try {
    console.log("Initializing application...");
    
    // Check critical environment variables
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set. Please configure it in Vercel project settings.");
    }
    console.log("DATABASE_URL is configured");
    
    // Register API routes
    await registerRoutes(httpServer, app);
    console.log("Routes registered successfully");

    // Error handler
    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error("Error:", err);

      if (res.headersSent) {
        return next(err);
      }

      return res.status(status).json({ message });
    });

    // Serve static files from dist/public (AFTER API routes)
    const distPath = path.resolve(process.cwd(), "dist/public");
    console.log(`Looking for static files in: ${distPath}`);
    
    if (fs.existsSync(distPath)) {
      console.log("Serving static files from dist/public");
      app.use(express.static(distPath));
      
      // Fallback to index.html for client-side routing (catch-all must be last)
      app.get(/^(?!\/api).*/, (_req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send("Not found");
        }
      });
    } else {
      console.warn(`Warning: Static files directory not found: ${distPath}`);
    }
    
    isInitialized = true;
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    initError = error as Error;
    throw error;
  }
}

// Vercel serverless function handler
module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initialize();
    
    // Convert Vercel request to Express request and handle
    return new Promise((resolve, reject) => {
      app(req as any, res as any, (err?: any) => {
        if (err) {
          console.error("Request handling error:", err);
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  } catch (error) {
    console.error("Handler error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    
    return res.status(500).json({ 
      error: "Internal Server Error",
      message,
      details: stack,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  }
};
