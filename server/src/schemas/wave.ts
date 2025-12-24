import { z } from "@hono/zod-openapi";
import { UserSummarySchema } from "./user";

// Wave status
export const WaveStatusSchema = z.enum(["pending", "accepted", "declined", "expired"]);

export type WaveStatus = z.infer<typeof WaveStatusSchema>;

// Wave entity
export const WaveSchema = z
  .object({
    id: z.string().uuid(),
    workspaceId: z.string().uuid(),
    fromUserId: z.string().uuid(),
    toUserId: z.string().uuid(),
    status: WaveStatusSchema,
    createdAt: z.string().datetime(),
    respondedAt: z.string().datetime().nullable(),
  })
  .openapi("Wave");

export type Wave = z.infer<typeof WaveSchema>;

// Wave with user details
export const WaveWithUsersSchema = z
  .object({
    id: z.string().uuid(),
    workspaceId: z.string().uuid(),
    fromUser: UserSummarySchema,
    toUser: UserSummarySchema,
    status: WaveStatusSchema,
    createdAt: z.string().datetime(),
    respondedAt: z.string().datetime().nullable(),
  })
  .openapi("WaveWithUsers");

export type WaveWithUsers = z.infer<typeof WaveWithUsersSchema>;

// Send wave request
export const SendWaveRequestSchema = z
  .object({
    workspaceId: z.string().uuid(),
    toUserId: z.string().uuid(),
  })
  .openapi("SendWaveRequest");

export type SendWaveRequest = z.infer<typeof SendWaveRequestSchema>;

// Respond wave request
export const RespondWaveRequestSchema = z
  .object({
    status: z.enum(["accepted", "declined"]),
  })
  .openapi("RespondWaveRequest");

export type RespondWaveRequest = z.infer<typeof RespondWaveRequestSchema>;

// Wave ID param
export const WaveIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type WaveIdParam = z.infer<typeof WaveIdParamSchema>;
