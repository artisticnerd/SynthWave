import { synthPresets, type Preset, type InsertPreset } from "@shared/schema";

export interface IStorage {
  getAllPresets(): Promise<Preset[]>;
  getPreset(id: number): Promise<Preset | undefined>;
  createPreset(preset: InsertPreset): Promise<Preset>;
  deletePreset(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private presets: Map<number, Preset>;
  private currentId: number;

  constructor() {
    this.presets = new Map();
    this.currentId = 1;
  }

  async getAllPresets(): Promise<Preset[]> {
    return Array.from(this.presets.values());
  }

  async getPreset(id: number): Promise<Preset | undefined> {
    return this.presets.get(id);
  }

  async createPreset(insertPreset: InsertPreset): Promise<Preset> {
    const id = this.currentId++;
    const preset: Preset = { ...insertPreset, id };
    this.presets.set(id, preset);
    return preset;
  }

  async deletePreset(id: number): Promise<void> {
    this.presets.delete(id);
  }
}

export const storage = new MemStorage();
