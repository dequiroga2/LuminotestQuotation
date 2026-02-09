import { db } from "./db";
import {
  users, products, essays, quotations, quotationItems, productEssays, shoppingCartItems,
  type User, type Product, type Essay, type Quotation, type InsertQuotation,
  type CreateQuotationRequest, type QuotationWithItems, type ShoppingCartItem
} from "../shared/schema";
  import { eq, desc, sql } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Users
  ensureUser(userId: string): Promise<void>;
  getUser(userId: string): Promise<User | undefined>;

  // Products
  getProducts(): Promise<Product[]>;
  createProduct(product: { name: string; category: string; isRetilap?: boolean; isRetie?: boolean; isOtros?: boolean }): Promise<Product>;
  
  // Essays
  getEssays(): Promise<Essay[]>;
  getEssaysByProduct(productId: number): Promise<number[]>;
  createEssay(essay: { name: string; category: string; isDefaultRetilap?: boolean; isDefaultRetie?: boolean }): Promise<Essay>;
  
  // Quotations
  createQuotation(userId: string, request: CreateQuotationRequest): Promise<Quotation>;
  getQuotations(userId: string): Promise<Quotation[]>;
  getQuotation(id: number): Promise<QuotationWithItems | undefined>;

  // Shopping Cart
  getShoppingCart(userId: string): Promise<ShoppingCartItem[]>;
  addToCart(userId: string, item: { productId?: number; productName?: string; essayIds: number[]; essayNames: string[] }): Promise<ShoppingCartItem>;
  getCartItem(itemId: number): Promise<ShoppingCartItem | undefined>;
  updateCartItemQuantity(itemId: number, quantity: number): Promise<void>;
  removeFromCart(userId: string, index: number): Promise<void>;
  clearCart(userId: string): Promise<void>;
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

  async createProduct(product: { name: string; category: string; isRetilap?: boolean; isRetie?: boolean; isOtros?: boolean }): Promise<Product> {
    const [newProduct] = await db.insert(products).values({
      ...product,
      isRetilap: product.isRetilap ?? false,
      isRetie: product.isRetie ?? false,
      isOtros: product.isOtros ?? false,
    }).returning();
    return newProduct;
  }

  // Essays
  async getEssays(): Promise<Essay[]> {
    return await db.select().from(essays);
  }

  async getEssaysByProduct(productId: number): Promise<number[]> {
    try {
      const results = await db.select({ essayId: productEssays.essayId })
        .from(productEssays)
        .where(eq(productEssays.productId, productId));
      
      // Si hay resultados, devolverlos
      if (results.length > 0) {
        return results.map(r => r.essayId);
      }
      
      // Si no hay relaciones, devolver todos los ensayos (fallback para desarrollo)
      const allEssays = await db.select({ id: essays.id }).from(essays);
      return allEssays.map(e => e.id);
    } catch (error) {
      // Si la tabla no existe (error en desarrollo), devolver todos los ensayos
      console.warn('Error fetching product essays, returning all essays as fallback:', error);
      const allEssays = await db.select({ id: essays.id }).from(essays);
      return allEssays.map(e => e.id);
    }
  }

  async createEssay(essay: { name: string; category: string; isDefaultRetilap?: boolean; isDefaultRetie?: boolean }): Promise<Essay> {
    const [newEssay] = await db.insert(essays).values({
      ...essay,
      isDefaultRetilap: essay.isDefaultRetilap ?? false,
      isDefaultRetie: essay.isDefaultRetie ?? false
    }).returning();
    return newEssay;
  }

  // Users
  async ensureUser(userId: string): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO users (id) 
        VALUES (${userId})
        ON CONFLICT (id) DO NOTHING
      `);
    } catch (err) {
      console.error("Error ensuring user:", err);
    }
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

  // Shopping Cart
  async getShoppingCart(userId: string): Promise<ShoppingCartItem[]> {
    try {
      console.log("Storage.getShoppingCart - Getting cart for user:", userId);
      const items = await db.select().from(shoppingCartItems).where(eq(shoppingCartItems.userId, userId));
      console.log("Cart items retrieved:", items.length);
      return items;
    } catch (err) {
      console.error("Error in storage.getShoppingCart:", err);
      throw err;
    }
  }

  async addToCart(userId: string, item: { productId?: number; productName?: string; essayIds: number[]; essayNames: string[] }): Promise<ShoppingCartItem> {
    try {
      const essayIdsJson = JSON.stringify(item.essayIds);
      const essayNamesJson = JSON.stringify(item.essayNames);

      console.log("Storage.addToCart - Creating cart item:", {
        userId,
        productId: item.productId,
        productName: item.productName,
        essayIdsJson,
        essayNamesJson
      });

      // Always create a new cart item
      const [newItem] = await db.insert(shoppingCartItems).values({
        userId,
        productId: item.productId,
        productName: item.productName,
        essayIds: essayIdsJson,
        essayNames: essayNamesJson
      }).returning();

      console.log("Cart item created:", newItem);
      return newItem;
    } catch (err) {
      console.error("Error in storage.addToCart:", err);
      throw err;
    }
  }

  async removeFromCart(userId: string, id: number): Promise<void> {
    try {
      console.log("Storage.removeFromCart - Removing item:", { userId, id });
      await db.delete(shoppingCartItems).where(eq(shoppingCartItems.id, id));
      console.log("Item removed from database");
    } catch (err) {
      console.error("Error in storage.removeFromCart:", err);
      throw err;
    }
  }

  async getCartItem(itemId: number): Promise<ShoppingCartItem | undefined> {
    try {
      console.log("Storage.getCartItem - Getting item:", itemId);
      const [item] = await db.select().from(shoppingCartItems).where(eq(shoppingCartItems.id, itemId));
      return item;
    } catch (err) {
      console.error("Error in storage.getCartItem:", err);
      return undefined;
    }
  }

  async updateCartItemQuantity(itemId: number, quantity: number): Promise<void> {
    try {
      console.log("Storage.updateCartItemQuantity - Item:", itemId, "Quantity:", quantity);
      await db.update(shoppingCartItems)
        .set({ quantity })
        .where(eq(shoppingCartItems.id, itemId));
      console.log("Cart item quantity updated");
    } catch (err) {
      console.error("Error in storage.updateCartItemQuantity:", err);
      throw err;
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      console.log("Storage.clearCart - Clearing cart for user:", userId);
      await db.delete(shoppingCartItems).where(eq(shoppingCartItems.userId, userId));
      console.log("Cart cleared from database");
    } catch (err) {
      console.error("Error in storage.clearCart:", err);
      throw err;
    }
  }

    // User Tracking
    async incrementInteractions(userId: string): Promise<void> {
      try {
        await db.execute(sql`
          INSERT INTO users (id, interactions_count) 
          VALUES (${userId}, 1)
          ON CONFLICT (id) 
          DO UPDATE SET interactions_count = CAST(users.interactions_count AS INTEGER) + 1
        `);
      } catch (err) {
        console.error("Error incrementing interactions:", err);
      }
    }

    async incrementQuotations(userId: string): Promise<void> {
      try {
        await db.execute(sql`
          INSERT INTO users (id, quotations_count) 
          VALUES (${userId}, 1)
          ON CONFLICT (id) 
          DO UPDATE SET quotations_count = CAST(users.quotations_count AS INTEGER) + 1
        `);
      } catch (err) {
        console.error("Error incrementing quotations:", err);
      }
    }
}

export const storage = new DatabaseStorage();
