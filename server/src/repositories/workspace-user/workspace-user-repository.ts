import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { workspaceUsers } from "../../db/schema";
import type { WorkspaceUserRepository } from "./workspace-user-repository.interface";

export const workspaceUserRepository: WorkspaceUserRepository = {
  async findByWorkspaceId(workspaceId) {
    return db.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.workspaceId, workspaceId),
    });
  },

  async findByUserId(userId) {
    return db.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.userId, userId),
    });
  },

  async isMember(workspaceId, userId) {
    const result = await db.query.workspaceUsers.findFirst({
      where: and(eq(workspaceUsers.workspaceId, workspaceId), eq(workspaceUsers.userId, userId)),
    });
    return result !== undefined;
  },

  async add(data) {
    const [member] = await db
      .insert(workspaceUsers)
      .values({
        workspaceId: data.workspaceId,
        userId: data.userId,
        role: data.role,
      })
      .returning();
    return member;
  },

  async remove(workspaceId, userId) {
    await db
      .delete(workspaceUsers)
      .where(and(eq(workspaceUsers.workspaceId, workspaceId), eq(workspaceUsers.userId, userId)));
  },

  async updateRole(workspaceId, userId, role) {
    await db
      .update(workspaceUsers)
      .set({ role })
      .where(and(eq(workspaceUsers.workspaceId, workspaceId), eq(workspaceUsers.userId, userId)));
  },

  async countByWorkspaceId(workspaceId) {
    const result = await db.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.workspaceId, workspaceId),
    });
    return result.length;
  },
};
