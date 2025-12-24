import { z } from "@hono/zod-openapi";

// Invite entity
export const InviteSchema = z
  .object({
    id: z.string().uuid(),
    workspaceId: z.string().uuid(),
    code: z.string(),
    expiresAt: z.string().datetime(),
    maxUses: z.number().nullable(),
    usedCount: z.number(),
    createdAt: z.string().datetime(),
  })
  .openapi("Invite");

export type Invite = z.infer<typeof InviteSchema>;

// Create invite request
export const CreateInviteRequestSchema = z
  .object({
    maxUses: z.number().min(1).nullable().optional(),
  })
  .openapi("CreateInviteRequest");

export type CreateInviteRequest = z.infer<typeof CreateInviteRequestSchema>;

// Invite code param
export const InviteCodeParamSchema = z.object({
  code: z.string(),
});

export type InviteCodeParam = z.infer<typeof InviteCodeParamSchema>;

// Accept invite response
export const AcceptInviteResponseSchema = z
  .object({
    workspaceId: z.string().uuid(),
    workspaceName: z.string(),
  })
  .openapi("AcceptInviteResponse");

export type AcceptInviteResponse = z.infer<typeof AcceptInviteResponseSchema>;
