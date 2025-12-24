import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, workspaces, workspaceUsers, workspaceInvites, waves } from "./schema";
import type { Database, Transaction } from "./client";

// Database client (can be db or transaction)
export type DbClient = Database | Transaction;

// User
export type UserRecord = InferSelectModel<typeof users>;
export type CreateUserData = Pick<InferInsertModel<typeof users>, "id" | "email" | "displayName">;
export type UpdateUserData = Partial<Pick<InferInsertModel<typeof users>, "displayName">>;

// Workspace
export type WorkspaceRecord = InferSelectModel<typeof workspaces>;
export type CreateWorkspaceData = Pick<InferInsertModel<typeof workspaces>, "name" | "ownerId">;

// WorkspaceUser
export type WorkspaceUserRecord = InferSelectModel<typeof workspaceUsers>;
export type AddWorkspaceUserData = Pick<
  InferInsertModel<typeof workspaceUsers>,
  "workspaceId" | "userId" | "role"
>;

// WorkspaceInvite
export type InviteRecord = InferSelectModel<typeof workspaceInvites>;
export type CreateInviteData = Pick<
  InferInsertModel<typeof workspaceInvites>,
  "workspaceId" | "code" | "expiresAt" | "maxUses"
>;

// Wave
export type WaveRecord = InferSelectModel<typeof waves>;
export type CreateWaveData = Pick<
  InferInsertModel<typeof waves>,
  "workspaceId" | "fromUserId" | "toUserId" | "status"
>;

// Composite types
export type WorkspaceWithMembersRecord = WorkspaceRecord & {
  members: (WorkspaceUserRecord & { user: UserRecord })[];
};
