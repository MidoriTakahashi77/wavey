import type { WorkspaceUserRecord, AddWorkspaceUserData, DbClient } from "../../db/types";
import type { MemberRole } from "../../schemas/workspace";

export interface WorkspaceUserRepository {
  findByWorkspaceId(workspaceId: string, tx?: DbClient): Promise<WorkspaceUserRecord[]>;
  findByUserId(userId: string, tx?: DbClient): Promise<WorkspaceUserRecord[]>;
  isMember(workspaceId: string, userId: string, tx?: DbClient): Promise<boolean>;
  add(data: AddWorkspaceUserData, tx?: DbClient): Promise<WorkspaceUserRecord>;
  remove(workspaceId: string, userId: string, tx?: DbClient): Promise<void>;
  updateRole(workspaceId: string, userId: string, role: MemberRole, tx?: DbClient): Promise<void>;
  countByWorkspaceId(workspaceId: string, tx?: DbClient): Promise<number>;
}
