import { synthPresets, type Preset, type InsertPreset } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllPresets(): Promise<Preset[]>;
  getPreset(id: number): Promise<Preset | undefined>;
  createPreset(preset: InsertPreset): Promise<Preset>;
  deletePreset(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllPresets(): Promise<Preset[]> {
    return await db.select().from(synthPresets);
  }

  async getPreset(id: number): Promise<Preset | undefined> {
    const [preset] = await db.select().from(synthPresets).where(eq(synthPresets.id, id));
    return preset;
  }

  async createPreset(insertPreset: InsertPreset): Promise<Preset> {
    const [preset] = await db
      .insert(synthPresets)
      .values(insertPreset)
      .returning();
    return preset;
  }

  async deletePreset(id: number): Promise<void> {
    await db.delete(synthPresets).where(eq(synthPresets.id, id));
  }
}

export const storage = new DatabaseStorage();