import { createRoute, z } from "@hono/zod-openapi";
import { AcceptInviteResponseSchema, InviteCodeParamSchema } from "../schemas/invite";
import { ErrorSchema } from "../schemas/common";

// POST /invites/:code/accept - Accept invite
export const acceptInviteRoute = createRoute({
  method: "post",
  path: "/invites/{code}/accept",
  tags: ["Invite"],
  summary: "招待を受け入れる",
  description: "招待コードを使用してワークスペースに参加します",
  security: [{ Bearer: [] }],
  request: {
    params: InviteCodeParamSchema,
  },
  responses: {
    200: {
      description: "参加成功",
      content: {
        "application/json": {
          schema: AcceptInviteResponseSchema,
        },
      },
    },
    400: {
      description: "招待が無効（期限切れ、使用回数超過、既にメンバー等）",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "招待が見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// DELETE /invites/:id - Delete invite
export const deleteInviteRoute = createRoute({
  method: "delete",
  path: "/invites/{id}",
  tags: ["Invite"],
  summary: "招待リンク削除",
  description: "招待リンクを削除します（オーナーのみ）",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
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
      description: "招待が見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});
