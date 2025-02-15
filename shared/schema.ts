import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const synthPresets = pgTable("synth_presets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  settings: jsonb("settings").notNull(),
});

export const insertPresetSchema = createInsertSchema(synthPresets).pick({
  name: true,
  settings: true,
});

export type InsertPreset = z.infer<typeof insertPresetSchema>;
export type Preset = typeof synthPresets.$inferSelect;

export const synthSettingsSchema = z.object({
  oscillator: z.object({
    type: z.enum(["sine", "square", "sawtooth", "triangle"]),
    detune: z.number(),
  }),
  filter: z.object({
    frequency: z.number(),
    resonance: z.number(),
    type: z.enum(["lowpass", "highpass", "bandpass"]),
  }),
  envelope: z.object({
    attack: z.number(),
    decay: z.number(),
    sustain: z.number(),
    release: z.number(),
  }),
  effects: z.object({
    delay: z.object({
      time: z.number(),
      feedback: z.number(),
    }),
    reverb: z.object({
      roomSize: z.number(),
      dampening: z.number(),
    }),
  }),
});

export type SynthSettings = z.infer<typeof synthSettingsSchema>;
