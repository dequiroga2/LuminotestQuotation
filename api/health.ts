import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check environment
    const hasDatabase = !!process.env.DATABASE_URL;
    const nodeEnv = process.env.NODE_ENV || "not set";
    
    return res.status(200).json({
      status: "OK",
      message: "Health check passed",
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: nodeEnv,
        DATABASE_URL: hasDatabase ? "configured" : "NOT SET",
        cwd: process.cwd()
      }
    });
  } catch (error) {
    console.error("Health check error:", error);
    return res.status(500).json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
