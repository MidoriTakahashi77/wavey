import type { WaveRecord } from "../../db/types";
import { AppError, ErrorCode } from "../../lib/errors";
import { ok, err, type Result } from "../../lib/result";
import { waveRepository } from "../../repositories/wave/wave-repository";
import { authorizationService } from "../authorization/authorization-service";

export type SendWaveInput = {
  workspaceId: string;
  fromUserId: string;
  toUserId: string;
};

export type RespondWaveInput = {
  waveId: string;
  userId: string;
  status: "accepted" | "declined";
};

export const waveService = {
  async sendWave(input: SendWaveInput): Promise<Result<WaveRecord, AppError>> {
    if (input.fromUserId === input.toUserId) {
      return err(new AppError(ErrorCode.CANNOT_WAVE_SELF, "You cannot wave to yourself"));
    }

    const fromMemberResult = await authorizationService.requireWorkspaceMember(
      input.workspaceId,
      input.fromUserId
    );
    if (fromMemberResult.isFailure) return fromMemberResult;

    const isToMember = await authorizationService.isWorkspaceMember(
      input.workspaceId,
      input.toUserId
    );
    if (!isToMember) {
      return err(
        new AppError(
          ErrorCode.NOT_WORKSPACE_MEMBER,
          "Target user is not a member of this workspace"
        )
      );
    }

    const existingWave = await waveRepository.findPendingWaveBetweenUsers(
      input.workspaceId,
      input.fromUserId,
      input.toUserId
    );

    if (existingWave) {
      return ok(existingWave);
    }

    const wave = await waveRepository.createWave({
      workspaceId: input.workspaceId,
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      status: "pending",
    });

    return ok(wave);
  },

  async respondWave(input: RespondWaveInput): Promise<Result<void, AppError>> {
    const wave = await waveRepository.findWaveById(input.waveId);

    if (!wave) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Wave not found"));
    }

    if (wave.toUserId !== input.userId) {
      return err(new AppError(ErrorCode.FORBIDDEN, "You can only respond to waves sent to you"));
    }

    if (wave.status !== "pending") {
      return err(
        new AppError(ErrorCode.WAVE_ALREADY_RESPONDED, "This wave has already been responded to")
      );
    }

    await waveRepository.updateWaveStatus(input.waveId, input.status);
    return ok(undefined);
  },

  async getReceivedWaves(
    workspaceId: string,
    userId: string
  ): Promise<Result<WaveRecord[], AppError>> {
    const authResult = await authorizationService.requireWorkspaceMember(workspaceId, userId);
    if (authResult.isFailure) return authResult;

    const waves = await waveRepository.findReceivedWavesByUserId(workspaceId, userId);
    return ok(waves);
  },

  async getSentWaves(workspaceId: string, userId: string): Promise<Result<WaveRecord[], AppError>> {
    const authResult = await authorizationService.requireWorkspaceMember(workspaceId, userId);
    if (authResult.isFailure) return authResult;

    const waves = await waveRepository.findSentWavesByUserId(workspaceId, userId);
    return ok(waves);
  },

  async getWaveById(waveId: string, userId: string): Promise<Result<WaveRecord, AppError>> {
    const wave = await waveRepository.findWaveById(waveId);

    if (!wave) {
      return err(new AppError(ErrorCode.NOT_FOUND, "Wave not found"));
    }

    if (wave.fromUserId !== userId && wave.toUserId !== userId) {
      return err(new AppError(ErrorCode.FORBIDDEN, "You can only view your own waves"));
    }

    return ok(wave);
  },
};
