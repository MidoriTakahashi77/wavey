import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { workspaces, workspaceUsers } from "../../db/schema";
import type { DbClient } from "../../db/types";
import type { WorkspaceRepository } from "./workspace-repository.interface";

export const workspaceRepository: WorkspaceRepository = {
  async findWorkspaceById(id, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });
    return result ?? null;
  },

  async findWorkspacesByOwnerId(ownerId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.workspaces.findMany({
      where: eq(workspaces.ownerId, ownerId),
    });
  },

  async findWorkspacesByUserId(userId, tx?: DbClient) {
    const client = tx ?? db;
    const members = await client.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.userId, userId),
      with: { workspace: true },
    });
    return members.map((m) => m.workspace);
  },

  async findWorkspaceWithMembers(id, tx?: DbClient) {
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

  async createWorkspace(data, tx?: DbClient) {
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

  async deleteWorkspace(id, tx?: DbClient) {
    const client = tx ?? db;
    await client.delete(workspaces).where(eq(workspaces.id, id));
  },

  async updateWorkspaceOwner(id, newOwnerId, tx?: DbClient) {
    const client = tx ?? db;
    await client.update(workspaces).set({ ownerId: newOwnerId }).where(eq(workspaces.id, id));
  },
};
