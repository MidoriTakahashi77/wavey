import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { workspaces, workspaceUsers } from "../../db/schema";
import type { WorkspaceRepository } from "./workspace-repository.interface";

export const workspaceRepository: WorkspaceRepository = {
  async findById(id) {
    const result = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });
    return result ?? null;
  },

  async findByOwnerId(ownerId) {
    return db.query.workspaces.findMany({
      where: eq(workspaces.ownerId, ownerId),
    });
  },

  async findByUserId(userId) {
    const members = await db.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.userId, userId),
      with: { workspace: true },
    });
    return members.map((m) => m.workspace);
  },

  async findWithMembers(id) {
    const result = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
      with: {
        members: {
          with: { user: true },
        },
      },
    });
    return result ?? null;
  },

  async create(data) {
    const [workspace] = await db
      .insert(workspaces)
      .values({
        name: data.name,
        ownerId: data.ownerId,
      })
      .returning();
    return workspace;
  },

  async delete(id) {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  },

  async updateOwner(id, newOwnerId) {
    await db.update(workspaces).set({ ownerId: newOwnerId }).where(eq(workspaces.id, id));
  },
};
