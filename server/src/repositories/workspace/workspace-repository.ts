import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { workspaces, workspaceUsers } from "../../db/schema";
import type { DbClient } from "../../db/types";
import type { WorkspaceRepository } from "./workspace-repository.interface";

export const workspaceRepository: WorkspaceRepository = {
  async findById(id, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });
    return result ?? null;
  },

  async findByOwnerId(ownerId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.workspaces.findMany({
      where: eq(workspaces.ownerId, ownerId),
    });
  },

  async findByUserId(userId, tx?: DbClient) {
    const client = tx ?? db;
    const members = await client.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.userId, userId),
      with: { workspace: true },
    });
    return members.map((m) => m.workspace);
  },

  async findWithMembers(id, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
      with: {
        members: {
          with: { user: true },
        },
      },
    });
    return result ?? null;
  },

  async create(data, tx?: DbClient) {
    const client = tx ?? db;
    const [workspace] = await client
      .insert(workspaces)
      .values({
        name: data.name,
        ownerId: data.ownerId,
      })
      .returning();
    return workspace;
  },

  async delete(id, tx?: DbClient) {
    const client = tx ?? db;
    await client.delete(workspaces).where(eq(workspaces.id, id));
  },

  async updateOwner(id, newOwnerId, tx?: DbClient) {
    const client = tx ?? db;
    await client.update(workspaces).set({ ownerId: newOwnerId }).where(eq(workspaces.id, id));
  },
};
