import type {
  WorkspaceRecord,
  CreateWorkspaceData,
  WorkspaceWithMembersRecord,
} from "../../db/types";

export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceRecord | null>;
  findByOwnerId(ownerId: string): Promise<WorkspaceRecord[]>;
  findByUserId(userId: string): Promise<WorkspaceRecord[]>;
  findWithMembers(id: string): Promise<WorkspaceWithMembersRecord | null>;
  create(data: CreateWorkspaceData): Promise<WorkspaceRecord>;
  delete(id: string): Promise<void>;
  updateOwner(id: string, newOwnerId: string): Promise<void>;
}
