import { db } from "./db";
import {
  users, products, essays, quotations, quotationItems,
  type User, type InsertUser, type Product, type Essay, type Quotation, type InsertQuotation,
  type CreateQuotationRequest, type QuotationWithItems
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Products
  getProducts(): Promise<Product[]>;
  createProduct(product: { name: string; category: string }): Promise<Product>;
  
  // Essays
  getEssays(): Promise<Essay[]>;
  createEssay(essay: { name: string; category: string; isDefaultRetilap?: boolean; isDefaultRetie?: boolean }): Promise<Essay>;
  
  // Quotations
  createQuotation(userId: string, request: CreateQuotationRequest): Promise<Quotation>;
  getQuotations(userId: string): Promise<Quotation[]>;
  getQuotation(id: number): Promise<QuotationWithItems | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods delegated to authStorage
  async getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }
  
  async upsertUser(user: any): Promise<User> {
    return authStorage.upsertUser(user);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async createProduct(product: { name: string; category: string }): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  // Essays
  async getEssays(): Promise<Essay[]> {
    return await db.select().from(essays);
  }

  async createEssay(essay: { name: string; category: string; isDefaultRetilap?: boolean; isDefaultRetie?: boolean }): Promise<Essay> {
    const [newEssay] = await db.insert(essays).values({
      ...essay,
      isDefaultRetilap: essay.isDefaultRetilap ?? false,
      isDefaultRetie: essay.isDefaultRetie ?? false
    }).returning();
    return newEssay;
  }

  // Quotations
  async createQuotation(userId: string, request: CreateQuotationRequest): Promise<Quotation> {
    // 1. Create Quotation
    const [quotation] = await db.insert(quotations).values({
      userId,
      type: request.type,
      reglamentoType: request.reglamentoType,
      status: "PENDING",
    }).returning();

    // 2. Create Items
    if (request.items && request.items.length > 0) {
      await db.insert(quotationItems).values(
        request.items.map(item => ({
          quotationId: quotation.id,
          productId: item.productId,
          essayId: item.essayId,
        }))
      );
    }

    return quotation;
  }

  async getQuotations(userId: string): Promise<Quotation[]> {
    return await db.select()
      .from(quotations)
      .where(eq(quotations.userId, userId))
      .orderBy(desc(quotations.createdAt));
  }

  async getQuotation(id: number): Promise<QuotationWithItems | undefined> {
    const [quotation] = await db.select().from(quotations).where(eq(quotations.id, id));
    
    if (!quotation) return undefined;

    const items = await db.select({
      id: quotationItems.id,
      quotationId: quotationItems.quotationId,
      productId: quotationItems.productId,
      essayId: quotationItems.essayId,
      product: products,
      essay: essays
    })
    .from(quotationItems)
    .leftJoin(products, eq(quotationItems.productId, products.id))
    .leftJoin(essays, eq(quotationItems.essayId, essays.id))
    .where(eq(quotationItems.quotationId, id));

    return {
      ...quotation,
      items: items.map(item => ({
        id: item.id,
        quotationId: item.quotationId,
        productId: item.productId,
        essayId: item.essayId,
        product: item.product || undefined,
        essay: item.essay || undefined
      }))
    };
  }
}

export const storage = new DatabaseStorage();
