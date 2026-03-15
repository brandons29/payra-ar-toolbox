import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Minimal schema — the app is primarily frontend with client-side calculations
// Supabase will be connected later for auth + persistence

export const toolResults = pgTable("tool_results", {
  id: serial("id").primaryKey(),
  toolName: text("tool_name").notNull(),
  resultData: json("result_data").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertToolResultSchema = createInsertSchema(toolResults).omit({ id: true, completedAt: true });
export type InsertToolResult = z.infer<typeof insertToolResultSchema>;
export type ToolResult = typeof toolResults.$inferSelect;
