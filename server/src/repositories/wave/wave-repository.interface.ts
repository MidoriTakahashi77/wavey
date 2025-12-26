import type { WaveRecord, CreateWaveData, DbClient } from "../../../db/types";
import type { WaveStatus } from "../../schemas/wave";

export interface WaveRepository {
  findWaveById(id: string, tx?: DbClient): Promise<WaveRecord | null>;
  findWavesByWorkspaceId(workspaceId: string, tx?: DbClient): Promise<WaveRecord[]>;
  findSentWavesByUserId(workspaceId: string, userId: string, tx?: DbClient): Promise<WaveRecord[]>;
  findReceivedWavesByUserId(
    workspaceId: string,
    userId: string,
    tx?: DbClient
  ): Promise<WaveRecord[]>;
  findPendingWaveBetweenUsers(
    workspaceId: string,
    fromUserId: string,
    toUserId: string,
    tx?: DbClient
  ): Promise<WaveRecord | null>;
  createWave(data: CreateWaveData, tx?: DbClient): Promise<WaveRecord>;
  updateWaveStatus(id: string, status: WaveStatus, tx?: DbClient): Promise<void>;
}
