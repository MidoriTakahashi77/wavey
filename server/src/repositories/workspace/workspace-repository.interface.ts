import type {
  WorkspaceRecord,
  CreateWorkspaceData,
  WorkspaceWithMembersRecord,
  DbClient,
} from "../../db/types";

export interface WorkspaceRepository {
  findById(id: string, tx?: DbClient): Promise<WorkspaceRecord | null>;
  findByOwnerId(ownerId: string, tx?: DbClient): Promise<WorkspaceRecord[]>;
  findByUserId(userId: string, tx?: DbClient): Promise<WorkspaceRecord[]>;
  findWithMembers(id: string, tx?: DbClient): Promise<WorkspaceWithMembersRecord | null>;
  create(data: CreateWorkspaceData, tx?: DbClient): Promise<WorkspaceRecord>;
  delete(id: string, tx?: DbClient): Promise<void>;
  updateOwner(id: string, newOwnerId: string, tx?: DbClient): Promise<void>;
}
