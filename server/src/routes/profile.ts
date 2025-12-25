import { createRoute } from "@hono/zod-openapi";
import { ProfileSchema, UpdateProfileRequestSchema } from "../schemas/user";
import { ErrorSchema } from "../schemas/common";

export const getProfileRoute = createRoute({
  method: "get",
  path: "/profile",
  tags: ["Profile"],
  summary: "プロフィール取得",
  description: "認証済みユーザー自身のプロフィール情報を取得します",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "プロフィール情報",
      content: {
        "application/json": {
          schema: ProfileSchema,
        },
      },
    },
    401: {
      description: "認証エラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: "ユーザーが見つからない",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

export const updateProfileRoute = createRoute({
  method: "put",
  path: "/profile",
  tags: ["Profile"],
  summary: "プロフィール更新",
  description: "認証済みユーザー自身のプロフィール情報を更新します",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateProfileRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "更新後のプロフィール情報",
      content: {
        "application/json": {
          schema: ProfileSchema,
        },
      },
    },
    400: {
      description: "バリデーションエラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    401: {
      description: "認証エラー",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: "ユーザーが見つからない",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});
