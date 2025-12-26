import type {
  WorkspaceRecord,
  CreateWorkspaceData,
  WorkspaceWithMembersRecord,
  DbClient,
} from "../../../db/types";

export interface WorkspaceRepository {
  findWorkspaceById(id: string, tx?: DbClient): Promise<WorkspaceRecord | null>;
  findWorkspacesByOwnerId(ownerId: string, tx?: DbClient): Promise<WorkspaceRecord[]>;
  findWorkspacesByUserId(userId: string, tx?: DbClient): Promise<WorkspaceRecord[]>;
  findWorkspaceWithMembers(id: string, tx?: DbClient): Promise<WorkspaceWithMembersRecord | null>;
  createWorkspace(data: CreateWorkspaceData, tx?: DbClient): Promise<WorkspaceRecord>;
  deleteWorkspace(id: string, tx?: DbClient): Promise<void>;
  updateWorkspaceOwner(id: string, newOwnerId: string, tx?: DbClient): Promise<void>;
}
