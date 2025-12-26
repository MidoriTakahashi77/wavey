import { eq, sql } from "drizzle-orm";
import { db } from "../../../db/client";
import { workspaceInvites } from "../../../db/schema";
import type { DbClient } from "../../../db/types";
import type { InviteRepository } from "./invite-repository.interface";

export const inviteRepository: InviteRepository = {
  async findInviteById(id, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.workspaceInvites.findFirst({
      where: eq(workspaceInvites.id, id),
    });
    return result ?? null;
  },

  async findInviteByCode(code, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.workspaceInvites.findFirst({
      where: eq(workspaceInvites.code, code),
    });
    return result ?? null;
  },

  async findInvitesByWorkspaceId(workspaceId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.workspaceInvites.findMany({
      where: eq(workspaceInvites.workspaceId, workspaceId),
    });
  },

  async createInvite(data, tx?: DbClient) {
    const client = tx ?? db;
    const [invite] = await client
      .insert(workspaceInvites)
      .values({
        workspaceId: data.workspaceId,
        code: data.code,
        expiresAt: data.expiresAt,
        maxUses: data.maxUses,
      })
      .returning();
    return invite;
  },

  async incrementInviteUsedCount(id, tx?: DbClient) {
    const client = tx ?? db;
    await client
      .update(workspaceInvites)
      .set({ usedCount: sql`${workspaceInvites.usedCount} + 1` })
      .where(eq(workspaceInvites.id, id));
  },

  async deleteInvite(id, tx?: DbClient) {
    const client = tx ?? db;
    await client.delete(workspaceInvites).where(eq(workspaceInvites.id, id));
  },
};
