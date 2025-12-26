import type { WorkspaceUserRecord, AddWorkspaceUserData, DbClient } from "../../../db/types";
import type { MemberRole } from "../../schemas/workspace";

export interface WorkspaceUserRepository {
  findMembersByWorkspaceId(workspaceId: string, tx?: DbClient): Promise<WorkspaceUserRecord[]>;
  findMembershipsByUserId(userId: string, tx?: DbClient): Promise<WorkspaceUserRecord[]>;
  isMemberOfWorkspace(workspaceId: string, userId: string, tx?: DbClient): Promise<boolean>;
  addMember(data: AddWorkspaceUserData, tx?: DbClient): Promise<WorkspaceUserRecord>;
  removeMember(workspaceId: string, userId: string, tx?: DbClient): Promise<void>;
  updateMemberRole(
    workspaceId: string,
    userId: string,
    role: MemberRole,
    tx?: DbClient
  ): Promise<void>;
  countMembersByWorkspaceId(workspaceId: string, tx?: DbClient): Promise<number>;
}
