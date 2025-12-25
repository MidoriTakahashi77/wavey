import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import {
  healthRoute,
  rootRoute,
  getProfileRoute,
  updateProfileRoute,
  listWorkspacesRoute,
  createWorkspaceRoute,
  getWorkspaceRoute,
  deleteWorkspaceRoute,
  transferOwnershipRoute,
  removeMemberRoute,
  createInviteRoute,
  listInvitesRoute,
  acceptInviteRoute,
  deleteInviteRoute,
} from "./routes";
import { authMiddleware, type AuthUser } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";
import { userRepository } from "./repositories/user/user-repository";
import { workspaceRepository } from "./repositories/workspace/workspace-repository";
import { inviteRepository } from "./repositories/invite/invite-repository";
import { AppError, ErrorCode } from "./lib/errors";
import { workspaceService } from "./services/workspace/workspace-service";
import { inviteService } from "./services/invite/invite-service";
import { authorizationService } from "./services/authorization/authorization-service";

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

  // Authenticated routes
  app.use("/profile", authMiddleware);
  app.use("/workspaces/*", authMiddleware);
  app.use("/workspaces", authMiddleware);
  app.use("/invites/*", authMiddleware);

  // Profile routes
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

  // Workspace routes
  app.openapi(listWorkspacesRoute, async (c) => {
    const authUser = c.get("user");
    const workspaces = await workspaceService.getWorkspacesByUserId(authUser.id);

    return c.json(
      workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        ownerId: w.ownerId,
        createdAt: w.createdAt.toISOString(),
      })),
      200
    );
  });

  app.openapi(createWorkspaceRoute, async (c) => {
    const authUser = c.get("user");
    const body = c.req.valid("json");

    const result = await workspaceService.createWorkspace({
      name: body.name,
      ownerId: authUser.id,
    });

    if (result.isFailure) {
      throw result.error;
    }

    const workspace = result.value;
    return c.json(
      {
        id: workspace.id,
        name: workspace.name,
        ownerId: workspace.ownerId,
        createdAt: workspace.createdAt.toISOString(),
      },
      201
    );
  });

  app.openapi(getWorkspaceRoute, async (c) => {
    const authUser = c.get("user");
    const { workspaceId } = c.req.valid("param");

    // Authorization check
    const authResult = await authorizationService.requireWorkspaceMember(workspaceId, authUser.id);
    if (authResult.isFailure) {
      throw authResult.error;
    }

    const result = await workspaceService.getWorkspaceWithMembers(workspaceId);
    if (result.isFailure) {
      throw result.error;
    }

    const workspace = result.value;
    return c.json(
      {
        id: workspace.id,
        name: workspace.name,
        ownerId: workspace.ownerId,
        createdAt: workspace.createdAt.toISOString(),
        members: workspace.members.map((m) => ({
          user: {
            id: m.user.id,
            displayName: m.user.displayName,
          },
          role: m.role,
          joinedAt: m.joinedAt.toISOString(),
        })),
      },
      200
    );
  });

  app.openapi(deleteWorkspaceRoute, async (c) => {
    const authUser = c.get("user");
    const { workspaceId } = c.req.valid("param");

    // Authorization check
    const authResult = await authorizationService.requireWorkspaceOwner(workspaceId, authUser.id);
    if (authResult.isFailure) {
      throw authResult.error;
    }

    const result = await workspaceService.deleteWorkspace(workspaceId);
    if (result.isFailure) {
      throw result.error;
    }

    return c.body(null, 204);
  });

  app.openapi(transferOwnershipRoute, async (c) => {
    const authUser = c.get("user");
    const { workspaceId } = c.req.valid("param");
    const body = c.req.valid("json");

    // Authorization check
    const authResult = await authorizationService.requireWorkspaceOwner(workspaceId, authUser.id);
    if (authResult.isFailure) {
      throw authResult.error;
    }

    const result = await workspaceService.transferOwnership({
      workspaceId,
      currentOwnerId: authUser.id,
      newOwnerId: body.newOwnerId,
    });

    if (result.isFailure) {
      throw result.error;
    }

    return c.body(null, 204);
  });

  app.openapi(removeMemberRoute, async (c) => {
    const authUser = c.get("user");
    const { workspaceId, userId } = c.req.valid("param");

    // Get workspace to check ownership
    const workspace = await workspaceRepository.findWorkspaceById(workspaceId);
    if (!workspace) {
      throw new AppError(ErrorCode.NOT_FOUND, "Workspace not found");
    }

    // Authorization: owner can remove anyone, members can only remove themselves
    const isOwner = workspace.ownerId === authUser.id;
    const isSelf = userId === authUser.id;

    if (!isOwner && !isSelf) {
      throw new AppError(ErrorCode.FORBIDDEN, "Only the owner can remove other members");
    }

    const result = await workspaceService.removeMember(workspaceId, userId, workspace.ownerId);
    if (result.isFailure) {
      throw result.error;
    }

    return c.body(null, 204);
  });

  // Invite routes (within workspace)
  app.openapi(createInviteRoute, async (c) => {
    const authUser = c.get("user");
    const { workspaceId } = c.req.valid("param");
    const body = c.req.valid("json");

    // Authorization check
    const authResult = await authorizationService.requireWorkspaceOwner(workspaceId, authUser.id);
    if (authResult.isFailure) {
      throw authResult.error;
    }

    const result = await inviteService.createInvite({
      workspaceId,
      maxUses: body.maxUses,
    });

    if (result.isFailure) {
      throw result.error;
    }

    const invite = result.value;
    return c.json(
      {
        id: invite.id,
        workspaceId: invite.workspaceId,
        code: invite.code,
        expiresAt: invite.expiresAt.toISOString(),
        maxUses: invite.maxUses,
        usedCount: invite.usedCount,
        createdAt: invite.createdAt.toISOString(),
      },
      201
    );
  });

  app.openapi(listInvitesRoute, async (c) => {
    const authUser = c.get("user");
    const { workspaceId } = c.req.valid("param");

    // Authorization check
    const authResult = await authorizationService.requireWorkspaceOwner(workspaceId, authUser.id);
    if (authResult.isFailure) {
      throw authResult.error;
    }

    const invites = await inviteService.getInvitesByWorkspaceId(workspaceId);

    return c.json(
      invites.map((invite) => ({
        id: invite.id,
        workspaceId: invite.workspaceId,
        code: invite.code,
        expiresAt: invite.expiresAt.toISOString(),
        maxUses: invite.maxUses,
        usedCount: invite.usedCount,
        createdAt: invite.createdAt.toISOString(),
      })),
      200
    );
  });

  // Invite routes (standalone)
  app.openapi(acceptInviteRoute, async (c) => {
    const authUser = c.get("user");
    const { code } = c.req.valid("param");

    const result = await inviteService.acceptInvite({
      code,
      userId: authUser.id,
    });

    if (result.isFailure) {
      throw result.error;
    }

    const member = result.value;
    const workspace = await workspaceRepository.findWorkspaceById(member.workspaceId);

    return c.json(
      {
        workspaceId: member.workspaceId,
        workspaceName: workspace?.name ?? "",
      },
      200
    );
  });

  app.openapi(deleteInviteRoute, async (c) => {
    const authUser = c.get("user");
    const { id } = c.req.valid("param");

    // Get invite to check workspace ownership
    const invite = await inviteRepository.findInviteById(id);
    if (!invite) {
      throw new AppError(ErrorCode.NOT_FOUND, "Invite not found");
    }

    // Authorization check
    const authResult = await authorizationService.requireWorkspaceOwner(
      invite.workspaceId,
      authUser.id
    );
    if (authResult.isFailure) {
      throw authResult.error;
    }

    const result = await inviteService.deleteInvite(id);
    if (result.isFailure) {
      throw result.error;
    }

    return c.body(null, 204);
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
