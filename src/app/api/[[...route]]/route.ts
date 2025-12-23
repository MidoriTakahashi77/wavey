import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { handle } from "hono/vercel";
import { healthRoute, rootRoute } from "../../../../server/src/routes";

const app = new OpenAPIHono().basePath("/api");

// System routes
app.openapi(healthRoute, (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.openapi(rootRoute, (c) => {
  return c.json({
    name: "Wavey API",
    version: "0.1.0",
    docs: "/api/docs",
  });
});

// OpenAPI spec
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "Wavey API",
    version: "0.1.0",
    description: "Wavey - 軽量コミュニケーションアプリ API",
  },
  servers: [{ url: "/api", description: "API" }],
});

// Swagger UI
app.get("/docs", swaggerUI({ url: "/api/openapi.json" }));

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
