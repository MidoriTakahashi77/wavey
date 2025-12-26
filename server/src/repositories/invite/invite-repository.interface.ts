import type { InviteRecord, CreateInviteData, DbClient } from "../../../db/types";

export interface InviteRepository {
  findInviteById(id: string, tx?: DbClient): Promise<InviteRecord | null>;
  findInviteByCode(code: string, tx?: DbClient): Promise<InviteRecord | null>;
  findInvitesByWorkspaceId(workspaceId: string, tx?: DbClient): Promise<InviteRecord[]>;
  createInvite(data: CreateInviteData, tx?: DbClient): Promise<InviteRecord>;
  incrementInviteUsedCount(id: string, tx?: DbClient): Promise<void>;
  deleteInvite(id: string, tx?: DbClient): Promise<void>;
}
