import { randomBytes } from "crypto";
import { db } from "../../db/client";
import type { InviteRecord, WorkspaceUserRecord } from "../../db/types";
import { AppError, ErrorCode } from "../../lib/errors";
import { LIMITS } from "../../lib/constants";
import { ok, err, type Result } from "../../lib/result";
import { workspaceUserRepository } from "../../repositories/workspace-user/workspace-user-repository";
import { inviteRepository } from "../../repositories/invite/invite-repository";

export type CreateInviteInput = {
  workspaceId: string;
  maxUses?: number | null;
};

export type AcceptInviteInput = {
  code: string;
  userId: string;
};

function generateInviteCode(): string {
  return randomBytes(6).toString("hex");
}

export const inviteService = {
  async createInvite(input: CreateInviteInput): Promise<Result<InviteRecord, AppError>> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + LIMITS.INVITE_EXPIRES_DAYS);

    const invite = await inviteRepository.createInvite({
      workspaceId: input.workspaceId,
      code: generateInviteCode(),
      expiresAt,
      maxUses: input.maxUses ?? null,
    });

    return ok(invite);
  },

  async acceptInvite(input: AcceptInviteInput): Promise<Result<WorkspaceUserRecord, AppError>> {
    const invite = await inviteRepository.findInviteByCode(input.code);

    if (!invite) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Invite not found"));
    }

    if (new Date() > invite.expiresAt) {
      return err(new AppError(ErrorCode.INVITE_EXPIRED, "This invite has expired"));
    }

    if (invite.maxUses !== null && invite.usedCount >= invite.maxUses) {
      return err(
        new AppError(ErrorCode.INVITE_MAX_USES_REACHED, "This invite has reached its maximum uses")
      );
    }

    const isMember = await workspaceUserRepository.isMemberOfWorkspace(
      invite.workspaceId,
      input.userId
    );
    if (isMember) {
      return err(
        new AppError(ErrorCode.ALREADY_MEMBER, "You are already a member of this workspace")
      );
    }

    const memberCount = await workspaceUserRepository.countMembersByWorkspaceId(invite.workspaceId);
    if (memberCount >= LIMITS.MAX_MEMBERS_PER_WORKSPACE) {
      return err(
        new AppError(
          ErrorCode.MEMBER_LIMIT_EXCEEDED,
          `Workspace has reached the maximum of ${LIMITS.MAX_MEMBERS_PER_WORKSPACE} members`
        )
      );
    }

    const member = await db.transaction(async (tx) => {
      await inviteRepository.incrementInviteUsedCount(invite.id, tx);

      return workspaceUserRepository.addMember(
        {
          workspaceId: invite.workspaceId,
          userId: input.userId,
          role: "member",
        },
        tx
      );
    });

    return ok(member);
  },

  async getInvitesByWorkspaceId(workspaceId: string): Promise<InviteRecord[]> {
    return inviteRepository.findInvitesByWorkspaceId(workspaceId);
  },

  async deleteInvite(inviteId: string): Promise<Result<void, AppError>> {
    const invite = await inviteRepository.findInviteById(inviteId);
    if (!invite) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Invite not found"));
    }

    await inviteRepository.deleteInvite(inviteId);
    return ok(undefined);
  },
};
