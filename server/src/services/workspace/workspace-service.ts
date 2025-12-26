import { db } from "../../../db/client";
import type { WorkspaceRecord, WorkspaceWithMembersRecord } from "../../../db/types";
import { AppError, ErrorCode } from "../../lib/errors";
import { ok, err, type Result } from "../../lib/result";
import { workspaceRepository } from "../../repositories/workspace/workspace-repository";
import { workspaceUserRepository } from "../../repositories/workspace-user/workspace-user-repository";

// Note: Authorization checks are performed in route handlers using authorizationService

export type CreateWorkspaceInput = {
  name: string;
  ownerId: string;
};

export type TransferOwnershipInput = {
  workspaceId: string;
  currentOwnerId: string;
  newOwnerId: string;
};

export const workspaceService = {
  async createWorkspace(input: CreateWorkspaceInput): Promise<Result<WorkspaceRecord, AppError>> {
    const workspace = await db.transaction(async (tx) => {
      const created = await workspaceRepository.createWorkspace(
        { name: input.name, ownerId: input.ownerId },
        tx
      );

      await workspaceUserRepository.addMember(
        { workspaceId: created.id, userId: input.ownerId, role: "owner" },
        tx
      );

      return created;
    });

    return ok(workspace);
  },

  async deleteWorkspace(workspaceId: string): Promise<Result<void, AppError>> {
    await workspaceRepository.deleteWorkspace(workspaceId);
    return ok(undefined);
  },

  async transferOwnership(input: TransferOwnershipInput): Promise<Result<void, AppError>> {
    const isMember = await workspaceUserRepository.isMemberOfWorkspace(
      input.workspaceId,
      input.newOwnerId
    );
    if (!isMember) {
      return err(
        new AppError(ErrorCode.NOT_WORKSPACE_MEMBER, "New owner must be a workspace member")
      );
    }

    await db.transaction(async (tx) => {
      await workspaceRepository.updateWorkspaceOwner(input.workspaceId, input.newOwnerId, tx);
      await workspaceUserRepository.updateMemberRole(
        input.workspaceId,
        input.currentOwnerId,
        "member",
        tx
      );
      await workspaceUserRepository.updateMemberRole(
        input.workspaceId,
        input.newOwnerId,
        "owner",
        tx
      );
    });

    return ok(undefined);
  },

  async getWorkspaceWithMembers(
    workspaceId: string
  ): Promise<Result<WorkspaceWithMembersRecord, AppError>> {
    const workspace = await workspaceRepository.findWorkspaceWithMembers(workspaceId);
    if (!workspace) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Workspace not found"));
    }

    return ok(workspace);
  },

  async getWorkspacesByUserId(userId: string): Promise<WorkspaceRecord[]> {
    return workspaceRepository.findWorkspacesByUserId(userId);
  },

  async removeMember(workspaceId: string, targetUserId: string): Promise<Result<void, AppError>> {
    await workspaceUserRepository.removeMember(workspaceId, targetUserId);
    return ok(undefined);
  },
};
