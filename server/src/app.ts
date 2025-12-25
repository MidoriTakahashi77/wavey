import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { healthRoute, rootRoute, getProfileRoute, updateProfileRoute } from "./routes";
import { authMiddleware, type AuthUser } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";
import { userRepository } from "./repositories/user/user-repository";
import { AppError, ErrorCode } from "./lib/errors";

type Variables = {
  user: AuthUser;
};

export function createApp() {
  const app = new OpenAPIHono<{ Variables: Variables }>().basePath("/api");

  // Global error handler
  app.onError(errorHandler);

  // System routes (public)
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

  // Profile routes (authenticated)
  app.use("/profile", authMiddleware);

  app.openapi(getProfileRoute, async (c) => {
    const authUser = c.get("user");
    const user = await userRepository.findUserById(authUser.id);

    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, "User not found");
    }

    return c.json(
      {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      200
    );
  });

  app.openapi(updateProfileRoute, async (c) => {
    const authUser = c.get("user");
    const body = c.req.valid("json");

    const existingUser = await userRepository.findUserById(authUser.id);
    if (!existingUser) {
      throw new AppError(ErrorCode.NOT_FOUND, "User not found");
    }

    const user = await userRepository.updateUser(authUser.id, {
      displayName: body.displayName,
    });

    return c.json(
      {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      200
    );
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
    security: [{ Bearer: [] }],
  });

  // Register security scheme
  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "JWT token from Supabase Auth",
  });

  // Swagger UI
  app.get("/docs", swaggerUI({ url: "/api/openapi.json" }));

  return app;
}
