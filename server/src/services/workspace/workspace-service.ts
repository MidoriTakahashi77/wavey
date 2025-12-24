import { db } from "../../db/client";
import type { WorkspaceRecord, WorkspaceWithMembersRecord } from "../../db/types";
import { AppError, ErrorCode } from "../../lib/errors";
import { ok, err, type Result } from "../../lib/result";
import { workspaceRepository } from "../../repositories/workspace/workspace-repository";
import { workspaceUserRepository } from "../../repositories/workspace-user/workspace-user-repository";
import { authorizationService } from "../authorization/authorization-service";

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

  async deleteWorkspace(workspaceId: string, requesterId: string): Promise<Result<void, AppError>> {
    const authResult = await authorizationService.requireWorkspaceOwner(workspaceId, requesterId);
    if (authResult.isFailure) return authResult;

    await workspaceRepository.deleteWorkspace(workspaceId);
    return ok(undefined);
  },

  async transferOwnership(input: TransferOwnershipInput): Promise<Result<void, AppError>> {
    const authResult = await authorizationService.requireWorkspaceOwner(
      input.workspaceId,
      input.currentOwnerId
    );
    if (authResult.isFailure) return authResult;

    const memberCheck = await authorizationService.requireWorkspaceMember(
      input.workspaceId,
      input.newOwnerId
    );
    if (memberCheck.isFailure) {
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
    workspaceId: string,
    requesterId: string
  ): Promise<Result<WorkspaceWithMembersRecord, AppError>> {
    const authResult = await authorizationService.requireWorkspaceMember(workspaceId, requesterId);
    if (authResult.isFailure) return authResult;

    const workspace = await workspaceRepository.findWorkspaceWithMembers(workspaceId);
    if (!workspace) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Workspace not found"));
    }

    return ok(workspace);
  },

  async getWorkspacesByUserId(userId: string): Promise<WorkspaceRecord[]> {
    return workspaceRepository.findWorkspacesByUserId(userId);
  },

  async removeMember(
    workspaceId: string,
    userId: string,
    requesterId: string
  ): Promise<Result<void, AppError>> {
    const workspace = await workspaceRepository.findWorkspaceById(workspaceId);
    if (!workspace) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Workspace not found"));
    }

    const isOwner = workspace.ownerId === requesterId;
    const isSelf = userId === requesterId;

    if (!isOwner && !isSelf) {
      return err(new AppError(ErrorCode.FORBIDDEN, "Only the owner can remove other members"));
    }

    if (userId === workspace.ownerId) {
      return err(
        new AppError(ErrorCode.FORBIDDEN, "Owner cannot be removed. Transfer ownership first.")
      );
    }

    await workspaceUserRepository.removeMember(workspaceId, userId);
    return ok(undefined);
  },
};
