import { z } from "@hono/zod-openapi";
import { LIMITS } from "../lib/constants";
import { UserSummarySchema } from "./user";

// Member role
export const MemberRoleSchema = z.enum(["owner", "member"]);

export type MemberRole = z.infer<typeof MemberRoleSchema>;

// Workspace entity
export const WorkspaceSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).max(LIMITS.WORKSPACE_NAME_MAX_LENGTH),
    ownerId: z.string().uuid(),
    createdAt: z.string().datetime(),
  })
  .openapi("Workspace");

export type Workspace = z.infer<typeof WorkspaceSchema>;

// Workspace member
export const WorkspaceMemberSchema = z
  .object({
    user: UserSummarySchema,
    role: MemberRoleSchema,
    joinedAt: z.string().datetime(),
  })
  .openapi("WorkspaceMember");

export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;

// Workspace with members
export const WorkspaceWithMembersSchema = WorkspaceSchema.extend({
  members: z.array(WorkspaceMemberSchema),
}).openapi("WorkspaceWithMembers");

export type WorkspaceWithMembers = z.infer<typeof WorkspaceWithMembersSchema>;

// Create workspace request
export const CreateWorkspaceRequestSchema = z
  .object({
    name: z.string().min(1).max(LIMITS.WORKSPACE_NAME_MAX_LENGTH),
  })
  .openapi("CreateWorkspaceRequest");

export type CreateWorkspaceRequest = z.infer<typeof CreateWorkspaceRequestSchema>;

// Transfer ownership request
export const TransferOwnershipRequestSchema = z
  .object({
    newOwnerId: z.string().uuid(),
  })
  .openapi("TransferOwnershipRequest");

export type TransferOwnershipRequest = z.infer<typeof TransferOwnershipRequestSchema>;

// Workspace ID param
export const WorkspaceIdParamSchema = z.object({
  workspaceId: z.string().uuid(),
});

export type WorkspaceIdParam = z.infer<typeof WorkspaceIdParamSchema>;

// Member ID param
export const MemberIdParamSchema = z.object({
  workspaceId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type MemberIdParam = z.infer<typeof MemberIdParamSchema>;
