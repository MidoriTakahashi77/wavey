import { createRoute, z } from "@hono/zod-openapi";
import {
  WorkspaceSchema,
  WorkspaceWithMembersSchema,
  CreateWorkspaceRequestSchema,
  TransferOwnershipRequestSchema,
  WorkspaceIdParamSchema,
  MemberIdParamSchema,
} from "../schemas/workspace";
import { InviteSchema, CreateInviteRequestSchema } from "../schemas/invite";
import { ErrorSchema } from "../schemas/common";

// GET /workspaces - List user's workspaces
export const listWorkspacesRoute = createRoute({
  method: "get",
  path: "/workspaces",
  tags: ["Workspace"],
  summary: "ワークスペース一覧取得",
  description: "認証済みユーザーが所属するワークスペース一覧を取得します",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "ワークスペース一覧",
      content: {
        "application/json": {
          schema: z.array(WorkspaceSchema),
        },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// POST /workspaces - Create workspace
export const createWorkspaceRoute = createRoute({
  method: "post",
  path: "/workspaces",
  tags: ["Workspace"],
  summary: "ワークスペース作成",
  description: "新しいワークスペースを作成します",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateWorkspaceRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "作成されたワークスペース",
      content: {
        "application/json": {
          schema: WorkspaceSchema,
        },
      },
    },
    400: {
      description: "バリデーションエラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// GET /workspaces/:workspaceId - Get workspace with members
export const getWorkspaceRoute = createRoute({
  method: "get",
  path: "/workspaces/{workspaceId}",
  tags: ["Workspace"],
  summary: "ワークスペース詳細取得",
  description: "ワークスペースの詳細情報とメンバー一覧を取得します",
  security: [{ Bearer: [] }],
  request: {
    params: WorkspaceIdParamSchema,
  },
  responses: {
    200: {
      description: "ワークスペース詳細",
      content: {
        "application/json": {
          schema: WorkspaceWithMembersSchema,
        },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "メンバーではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "ワークスペースが見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// DELETE /workspaces/:workspaceId - Delete workspace
export const deleteWorkspaceRoute = createRoute({
  method: "delete",
  path: "/workspaces/{workspaceId}",
  tags: ["Workspace"],
  summary: "ワークスペース削除",
  description: "ワークスペースを削除します（オーナーのみ）",
  security: [{ Bearer: [] }],
  request: {
    params: WorkspaceIdParamSchema,
  },
  responses: {
    204: {
      description: "削除成功",
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "オーナーではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "ワークスペースが見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// POST /workspaces/:workspaceId/transfer - Transfer ownership
export const transferOwnershipRoute = createRoute({
  method: "post",
  path: "/workspaces/{workspaceId}/transfer",
  tags: ["Workspace"],
  summary: "オーナー権限譲渡",
  description: "ワークスペースのオーナー権限を他のメンバーに譲渡します",
  security: [{ Bearer: [] }],
  request: {
    params: WorkspaceIdParamSchema,
    body: {
      content: {
        "application/json": {
          schema: TransferOwnershipRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "譲渡成功",
    },
    400: {
      description: "バリデーションエラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "オーナーではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "ワークスペースが見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// DELETE /workspaces/:workspaceId/members/:userId - Remove member
export const removeMemberRoute = createRoute({
  method: "delete",
  path: "/workspaces/{workspaceId}/members/{userId}",
  tags: ["Workspace"],
  summary: "メンバー削除",
  description: "ワークスペースからメンバーを削除します（オーナーまたは自分自身）",
  security: [{ Bearer: [] }],
  request: {
    params: MemberIdParamSchema,
  },
  responses: {
    204: {
      description: "削除成功",
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "権限がない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "ワークスペースまたはメンバーが見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// POST /workspaces/:workspaceId/invites - Create invite
export const createInviteRoute = createRoute({
  method: "post",
  path: "/workspaces/{workspaceId}/invites",
  tags: ["Invite"],
  summary: "招待リンク作成",
  description: "ワークスペースへの招待リンクを作成します（オーナーのみ）",
  security: [{ Bearer: [] }],
  request: {
    params: WorkspaceIdParamSchema,
    body: {
      content: {
        "application/json": {
          schema: CreateInviteRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "作成された招待",
      content: {
        "application/json": {
          schema: InviteSchema,
        },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "オーナーではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "ワークスペースが見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// GET /workspaces/:workspaceId/invites - List invites
export const listInvitesRoute = createRoute({
  method: "get",
  path: "/workspaces/{workspaceId}/invites",
  tags: ["Invite"],
  summary: "招待リンク一覧取得",
  description: "ワークスペースの招待リンク一覧を取得します（オーナーのみ）",
  security: [{ Bearer: [] }],
  request: {
    params: WorkspaceIdParamSchema,
  },
  responses: {
    200: {
      description: "招待リンク一覧",
      content: {
        "application/json": {
          schema: z.array(InviteSchema),
        },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "オーナーではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "ワークスペースが見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});
