import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const svgIconTable = pgTable("svg_icons", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  svgContent: text("svg_content").notNull(),
  userId: serial("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});