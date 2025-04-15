import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (retained from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Cognitive map model
export const maps = pgTable("maps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  nodes: jsonb("nodes").notNull(),
  edges: jsonb("edges").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertMapSchema = createInsertSchema(maps).pick({
  name: true,
  userId: true,
  nodes: true,
  edges: true,
  createdAt: true,
});

export type InsertMap = z.infer<typeof insertMapSchema>;
export type Map = typeof maps.$inferSelect;

// Node type for frontend usage
export const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    label: z.string(),
    description: z.string().optional(),
  }),
});

export type Node = z.infer<typeof nodeSchema>;

// Edge type for frontend usage
export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
});

export type Edge = z.infer<typeof edgeSchema>;

// For OpenAI API requests/responses
export const topicAnalysisSchema = z.object({
  topic: z.string(),
});

export type TopicAnalysis = z.infer<typeof topicAnalysisSchema>;

export const chatMessageSchema = z.object({
  message: z.string(),
  mapState: z.optional(z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any())
  }))
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
