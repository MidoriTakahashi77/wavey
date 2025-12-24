import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { workspaceUsers } from "../../db/schema";
import type { DbClient } from "../../db/types";
import type { WorkspaceUserRepository } from "./workspace-user-repository.interface";

export const workspaceUserRepository: WorkspaceUserRepository = {
  async findMembersByWorkspaceId(workspaceId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.workspaceId, workspaceId),
    });
  },

  async findMembershipsByUserId(userId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.userId, userId),
    });
  },

  async isMemberOfWorkspace(workspaceId, userId, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.workspaceUsers.findFirst({
      where: and(eq(workspaceUsers.workspaceId, workspaceId), eq(workspaceUsers.userId, userId)),
    });
    return result !== undefined;
  },

  async addMember(data, tx?: DbClient) {
    const client = tx ?? db;
    const [member] = await client
      .insert(workspaceUsers)
      .values({
        workspaceId: data.workspaceId,
        userId: data.userId,
        role: data.role,
      })
      .returning();
    return member;
  },

  async removeMember(workspaceId, userId, tx?: DbClient) {
    const client = tx ?? db;
    await client
      .delete(workspaceUsers)
      .where(and(eq(workspaceUsers.workspaceId, workspaceId), eq(workspaceUsers.userId, userId)));
  },

  async updateMemberRole(workspaceId, userId, role, tx?: DbClient) {
    const client = tx ?? db;
    await client
      .update(workspaceUsers)
      .set({ role })
      .where(and(eq(workspaceUsers.workspaceId, workspaceId), eq(workspaceUsers.userId, userId)));
  },

  async countMembersByWorkspaceId(workspaceId, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.workspaceId, workspaceId),
    });
    return result.length;
  },
};
