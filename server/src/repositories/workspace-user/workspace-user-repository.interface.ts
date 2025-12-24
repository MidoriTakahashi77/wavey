import type { WorkspaceUserRecord, AddWorkspaceUserData } from "../../db/types";
import type { MemberRole } from "../../schemas/workspace";

export interface WorkspaceUserRepository {
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceUserRecord[]>;
  findByUserId(userId: string): Promise<WorkspaceUserRecord[]>;
  isMember(workspaceId: string, userId: string): Promise<boolean>;
  add(data: AddWorkspaceUserData): Promise<WorkspaceUserRecord>;
  remove(workspaceId: string, userId: string): Promise<void>;
  updateRole(workspaceId: string, userId: string, role: MemberRole): Promise<void>;
  countByWorkspaceId(workspaceId: string): Promise<number>;
}
