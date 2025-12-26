import { and, eq } from "drizzle-orm";
import { db } from "../../../db/client";
import { waves } from "../../../db/schema";
import type { DbClient } from "../../../db/types";
import type { WaveRepository } from "./wave-repository.interface";

export const waveRepository: WaveRepository = {
  async findWaveById(id, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.waves.findFirst({
      where: eq(waves.id, id),
    });
    return result ?? null;
  },

  async findWavesByWorkspaceId(workspaceId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.waves.findMany({
      where: eq(waves.workspaceId, workspaceId),
    });
  },

  async findSentWavesByUserId(workspaceId, userId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.waves.findMany({
      where: and(eq(waves.workspaceId, workspaceId), eq(waves.fromUserId, userId)),
    });
  },

  async findReceivedWavesByUserId(workspaceId, userId, tx?: DbClient) {
    const client = tx ?? db;
    return client.query.waves.findMany({
      where: and(eq(waves.workspaceId, workspaceId), eq(waves.toUserId, userId)),
    });
  },

  async findPendingWaveBetweenUsers(workspaceId, fromUserId, toUserId, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.waves.findFirst({
      where: and(
        eq(waves.workspaceId, workspaceId),
        eq(waves.fromUserId, fromUserId),
        eq(waves.toUserId, toUserId),
        eq(waves.status, "pending")
      ),
    });
    return result ?? null;
  },

  async createWave(data, tx?: DbClient) {
    const client = tx ?? db;
    const [wave] = await client
      .insert(waves)
      .values({
        workspaceId: data.workspaceId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        status: data.status,
      })
      .returning();
    return wave;
  },

  async updateWaveStatus(id, status, tx?: DbClient) {
    const client = tx ?? db;
    await client
      .update(waves)
      .set({
        status,
        respondedAt: status !== "pending" ? new Date() : null,
      })
      .where(eq(waves.id, id));
  },
};
