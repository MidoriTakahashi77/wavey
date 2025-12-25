import type { WorkspaceRecord } from "../../db/types";
import { AppError, ErrorCode } from "../../lib/errors";
import { ok, err, type Result } from "../../lib/result";
import {
  defineAbilitiesFor,
  subjects,
  type AppAbility,
  type UserContext,
  type WorkspaceContext,
} from "../../lib/abilities";
import { workspaceRepository } from "../../repositories/workspace/workspace-repository";
import { workspaceUserRepository } from "../../repositories/workspace-user/workspace-user-repository";

export const authorizationService = {
  /**
   * Build ability instance for a user in a workspace context
   */
  async buildAbility(userId: string, workspaceId?: string): Promise<AppAbility> {
    const user: UserContext = { id: userId };

    if (!workspaceId) {
      return defineAbilitiesFor(user);
    }

    const workspace = await workspaceRepository.findWorkspaceById(workspaceId);
    if (!workspace) {
      return defineAbilitiesFor(user);
    }

    const isMember = await workspaceUserRepository.isMemberOfWorkspace(workspaceId, userId);

    const workspaceContext: WorkspaceContext = {
      id: workspace.id,
      ownerId: workspace.ownerId,
      isMember,
    };

    return defineAbilitiesFor(user, workspaceContext);
  },

  /**
   * Check if user is workspace owner, returns workspace if authorized
   */
  async requireWorkspaceOwner(
    workspaceId: string,
    userId: string
  ): Promise<Result<WorkspaceRecord, AppError>> {
    const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

    if (!workspace) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Workspace not found"));
    }

    const ability = await this.buildAbility(userId, workspaceId);
    const subject = subjects.workspace(workspace);

    if (!ability.can("manage", subject)) {
      return err(
        new AppError(ErrorCode.NOT_WORKSPACE_OWNER, "Only the owner can perform this action")
      );
    }

    return ok(workspace);
  },

  /**
   * Check if user is workspace member
   */
  async requireWorkspaceMember(
    workspaceId: string,
    userId: string
  ): Promise<Result<void, AppError>> {
    const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

    if (!workspace) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Workspace not found"));
    }

    const ability = await this.buildAbility(userId, workspaceId);
    const subject = subjects.workspace(workspace);

    if (!ability.can("read", subject)) {
      return err(
        new AppError(ErrorCode.NOT_WORKSPACE_MEMBER, "You are not a member of this workspace")
      );
    }

    return ok(undefined);
  },

  /**
   * Check if user can manage invites
   */
  async requireInviteManager(workspaceId: string, userId: string): Promise<Result<void, AppError>> {
    const ability = await this.buildAbility(userId, workspaceId);
    const subject = subjects.invite({ workspaceId });

    if (!ability.can("manage", subject)) {
      return err(new AppError(ErrorCode.NOT_WORKSPACE_OWNER, "Only the owner can manage invites"));
    }

    return ok(undefined);
  },

  /**
   * Check if user can respond to a wave
   */
  canRespondToWave(ability: AppAbility, wave: { fromUserId: string; toUserId: string }): boolean {
    return ability.can("update", subjects.wave(wave));
  },

  /**
   * Check if user can read a wave
   */
  canReadWave(ability: AppAbility, wave: { fromUserId: string; toUserId: string }): boolean {
    return ability.can("read", subjects.wave(wave));
  },

  /**
   * Check if user can remove a member from workspace
   * - Owner can remove any member (except themselves)
   * - Member can only remove themselves (leave)
   */
  async requireCanRemoveMember(
    workspaceId: string,
    requesterId: string,
    targetUserId: string
  ): Promise<Result<WorkspaceRecord, AppError>> {
    const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

    if (!workspace) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Workspace not found"));
    }

    // Owner cannot be removed
    if (targetUserId === workspace.ownerId) {
      return err(
        new AppError(ErrorCode.FORBIDDEN, "Owner cannot be removed. Transfer ownership first.")
      );
    }

    const isOwner = workspace.ownerId === requesterId;
    const isSelf = targetUserId === requesterId;

    if (!isOwner && !isSelf) {
      return err(new AppError(ErrorCode.FORBIDDEN, "Only the owner can remove other members"));
    }

    return ok(workspace);
  },

  /**
   * Simple boolean checks
   */
  async isWorkspaceOwner(workspaceId: string, userId: string): Promise<boolean> {
    const workspace = await workspaceRepository.findWorkspaceById(workspaceId);
    return workspace?.ownerId === userId;
  },

  async isWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
    return workspaceUserRepository.isMemberOfWorkspace(workspaceId, userId);
  },
};
