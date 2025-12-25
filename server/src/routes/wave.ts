import { createRoute, z } from "@hono/zod-openapi";
import {
  WaveSchema,
  SendWaveRequestSchema,
  RespondWaveRequestSchema,
  WaveIdParamSchema,
} from "../schemas/wave";
import { ErrorSchema } from "../schemas/common";

// POST /waves - Send wave
export const sendWaveRoute = createRoute({
  method: "post",
  path: "/waves",
  tags: ["Wave"],
  summary: "Wave 送信",
  description: "他のメンバーに Wave を送信します",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: SendWaveRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "送信された Wave",
      content: {
        "application/json": {
          schema: WaveSchema,
        },
      },
    },
    400: {
      description: "バリデーションエラー（自分自身への Wave 等）",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "ワークスペースのメンバーではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// GET /waves - Get waves (sent and received)
export const listWavesRoute = createRoute({
  method: "get",
  path: "/waves",
  tags: ["Wave"],
  summary: "Wave 履歴取得",
  description: "送受信した Wave の履歴を取得します",
  security: [{ Bearer: [] }],
  request: {
    query: z.object({
      workspaceId: z.string().uuid(),
      type: z.enum(["sent", "received"]).optional(),
    }),
  },
  responses: {
    200: {
      description: "Wave 一覧",
      content: {
        "application/json": {
          schema: z.array(WaveSchema),
        },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "ワークスペースのメンバーではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// PUT /waves/:id - Respond to wave
export const respondWaveRoute = createRoute({
  method: "put",
  path: "/waves/{id}",
  tags: ["Wave"],
  summary: "Wave 応答",
  description: "受信した Wave に応答します（accept または decline）",
  security: [{ Bearer: [] }],
  request: {
    params: WaveIdParamSchema,
    body: {
      content: {
        "application/json": {
          schema: RespondWaveRequestSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: "応答成功",
    },
    400: {
      description: "既に応答済み",
      content: { "application/json": { schema: ErrorSchema } },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "Wave の受信者ではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "Wave が見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

// GET /waves/:id - Get wave by ID
export const getWaveRoute = createRoute({
  method: "get",
  path: "/waves/{id}",
  tags: ["Wave"],
  summary: "Wave 詳細取得",
  description: "Wave の詳細を取得します（送信者または受信者のみ）",
  security: [{ Bearer: [] }],
  request: {
    params: WaveIdParamSchema,
  },
  responses: {
    200: {
      description: "Wave 詳細",
      content: {
        "application/json": {
          schema: WaveSchema,
        },
      },
    },
    401: {
      description: "認証エラー",
      content: { "application/json": { schema: ErrorSchema } },
    },
    403: {
      description: "Wave の送信者または受信者ではない",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "Wave が見つからない",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});
