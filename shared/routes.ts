import { z } from 'zod';
import { 
  createQuotationRequestSchema, 
  products, 
  essays, 
  quotations 
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
  },
  essays: {
    list: {
      method: 'GET' as const,
      path: '/api/essays' as const,
      responses: {
        200: z.array(z.custom<typeof essays.$inferSelect>()),
      },
    },
  },
  quotations: {
    create: {
      method: 'POST' as const,
      path: '/api/quotations' as const,
      input: createQuotationRequestSchema,
      responses: {
        201: z.custom<typeof quotations.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.validation, // Unauthorized
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/quotations' as const,
      responses: {
        200: z.array(z.custom<typeof quotations.$inferSelect>()),
        401: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/quotations/:id' as const,
      responses: {
        200: z.custom<typeof quotations.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
