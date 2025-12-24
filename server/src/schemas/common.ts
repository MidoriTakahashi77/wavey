import { z } from "@hono/zod-openapi";

// Error response
export const ErrorSchema = z
  .object({
    code: z.string(),
    message: z.string(),
  })
  .openapi("Error");

export type ErrorResponse = z.infer<typeof ErrorSchema>;

// Pagination
export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  });

// UUID param
export const IdParamSchema = z.object({
  id: z.string().uuid(),
});

export type IdParam = z.infer<typeof IdParamSchema>;
