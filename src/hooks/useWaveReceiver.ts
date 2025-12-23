"use client";

import { useState, useCallback } from "react";

export type IncomingWave = {
  id: string;
  fromId: string;
  fromName: string;
  timestamp: Date;
  gifUrl?: string;
};

type UseWaveReceiverOptions = {
  onAccept?: (wave: IncomingWave) => void;
  onDecline?: (wave: IncomingWave) => void;
};

export function useWaveReceiver(options: UseWaveReceiverOptions = {}) {
  const [incomingWaves, setIncomingWaves] = useState<IncomingWave[]>([]);

  // Wave受信（モック：外部から呼び出し可能）
  const receiveWave = useCallback((wave: Omit<IncomingWave, "id" | "timestamp">) => {
    const newWave: IncomingWave = {
      ...wave,
      id: String(Date.now()),
      timestamp: new Date(),
    };
    setIncomingWaves((prev) => [...prev, newWave]);
  }, []);

  // Wave承諾（話す）
  const acceptWave = useCallback(
    (waveId: string) => {
      const wave = incomingWaves.find((w) => w.id === waveId);
      if (wave) {
        options.onAccept?.(wave);
        setIncomingWaves((prev) => prev.filter((w) => w.id !== waveId));
      }
    },
    [incomingWaves, options]
  );

  // Wave辞退（あとで）
  const declineWave = useCallback(
    (waveId: string) => {
      const wave = incomingWaves.find((w) => w.id === waveId);
      if (wave) {
        options.onDecline?.(wave);
        setIncomingWaves((prev) => prev.filter((w) => w.id !== waveId));
      }
    },
    [incomingWaves, options]
  );

  // 最新のWaveを取得
  const currentWave = incomingWaves[0] || null;

  // 全てのWaveをクリア
  const clearAll = useCallback(() => {
    setIncomingWaves([]);
  }, []);

  return {
    incomingWaves,
    currentWave,
    waveCount: incomingWaves.length,
    receiveWave,
    acceptWave,
    declineWave,
    clearAll,
  };
}
