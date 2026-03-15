import type { Express } from "express";
import type { Server } from "http";

export async function registerRoutes(server: Server, app: Express) {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Future: API routes for Supabase-backed persistence will go here
  // For now, all data is stored client-side in memory
}
