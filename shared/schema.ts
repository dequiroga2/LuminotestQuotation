import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "Accesorios"
});

export const essays = pgTable("essays", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "Adhesion"
  // These flags help with the "Reglamento" flow defaults
  isDefaultRetilap: boolean("is_default_retilap").default(false),
  isDefaultRetie: boolean("is_default_retie").default(false),
});

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Link to Replit Auth user
  type: text("type").notNull(), // "REGLAMENTO", "PRODUCTO", "ENSAYO"
  reglamentoType: text("reglamento_type"), // "RETILAP", "RETIE", "OTROS" (only for Reglamento)
  status: text("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quotationItems = pgTable("quotation_items", {
  id: serial("id").primaryKey(),
  quotationId: integer("quotation_id").notNull().references(() => quotations.id),
  productId: integer("product_id").references(() => products.id),
  essayId: integer("essay_id").references(() => essays.id),
});

// === SCHEMAS ===

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertEssaySchema = createInsertSchema(essays).omit({ id: true });
export const insertQuotationSchema = createInsertSchema(quotations).omit({ id: true, createdAt: true, status: true });
export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({ id: true });

// === TYPES ===

export type Product = typeof products.$inferSelect;
export type Essay = typeof essays.$inferSelect;
export type Quotation = typeof quotations.$inferSelect;
export type QuotationItem = typeof quotationItems.$inferSelect;

export type InsertQuotation = z.infer<typeof insertQuotationSchema>;

// Full quotation request with items
export const createQuotationRequestSchema = insertQuotationSchema.extend({
  items: z.array(z.object({
    productId: z.number().optional(),
    essayId: z.number().optional(),
  })),
});

export type CreateQuotationRequest = z.infer<typeof createQuotationRequestSchema>;

export type QuotationWithItems = Quotation & {
  items: (QuotationItem & { product?: Product; essay?: Essay })[];
};
