import { createRoute, z } from "@hono/zod-openapi";

export const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["System"],
  summary: "ヘルスチェック",
  responses: {
    200: {
      description: "サーバー稼働中",
      content: {
        "application/json": {
          schema: z.object({
            status: z.string(),
            timestamp: z.string(),
          }),
        },
      },
    },
  },
});

export const rootRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["System"],
  summary: "API情報",
  responses: {
    200: {
      description: "API情報",
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
            version: z.string(),
            docs: z.string(),
          }),
        },
      },
    },
  },
});
