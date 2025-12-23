import { z } from "zod";

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  category: z.enum(["sweaters", "jackets", "pants", "hoodies"]).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["price", "createdAt", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type GetProductsQueryInput = z.infer<typeof getProductsQuerySchema>;
