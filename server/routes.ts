import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPresetSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/presets", async (_req, res) => {
    const presets = await storage.getAllPresets();
    res.json(presets);
  });

  app.post("/api/presets", async (req, res) => {
    const result = insertPresetSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    const preset = await storage.createPreset(result.data);
    res.json(preset);
  });

  app.delete("/api/presets/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    await storage.deletePreset(id);
    res.status(204).end();
  });

  return createServer(app);
}
