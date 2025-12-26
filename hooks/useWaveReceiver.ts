"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type IncomingWave = {
  id: string;
  fromId: string;
  fromName: string;
  timestamp: Date;
  gifUrl?: string;
};

type WaveSentPayload = {
  waveId: string;
  workspaceId: string;
  fromUserId: string;
  toUserId: string;
};

type UseWaveReceiverOptions = {
  workspaceId: string | null;
  currentUserId: string | null;
  memberNameLookup?: (userId: string) => string;
  onAccept?: (wave: IncomingWave) => void;
  onDecline?: (wave: IncomingWave) => void;
};

export function useWaveReceiver(options: UseWaveReceiverOptions) {
  const { workspaceId, currentUserId, memberNameLookup, onAccept, onDecline } = options;
  const [incomingWaves, setIncomingWaves] = useState<IncomingWave[]>([]);

  // Subscribe to Realtime wave events
  useEffect(() => {
    if (!workspaceId || !currentUserId) return;

    console.log(`[WaveReceiver] Subscribing to workspace:${workspaceId} for user:${currentUserId}`);

    const channel = supabase
      .channel(`workspace:${workspaceId}`)
      .on("broadcast", { event: "wave:sent" }, async ({ payload }) => {
        console.log("[WaveReceiver] Received wave:sent event:", payload);
        const data = payload as WaveSentPayload;

        // Only show waves sent to current user
        if (data.toUserId !== currentUserId) {
          console.log("[WaveReceiver] Ignoring wave - not for current user");
          return;
        }

        const newWave: IncomingWave = {
          id: data.waveId,
          fromId: data.fromUserId,
          fromName: memberNameLookup?.(data.fromUserId) ?? data.fromUserId.slice(0, 8),
          timestamp: new Date(),
        };

        console.log("[WaveReceiver] Adding wave to queue:", newWave);
        setIncomingWaves((prev) => [...prev, newWave]);
      })
      .subscribe((status) => {
        console.log(`[WaveReceiver] Channel status: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, currentUserId, memberNameLookup]);

  // Wave承諾（話す）
  const acceptWave = useCallback(
    async (waveId: string) => {
      const wave = incomingWaves.find((w) => w.id === waveId);
      if (!wave) return;

      // Call API to respond to wave
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        await fetch(`/api/waves/${waveId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "accepted" }),
        });

        onAccept?.(wave);
      } catch (error) {
        console.error("Failed to accept wave:", error);
      }

      setIncomingWaves((prev) => prev.filter((w) => w.id !== waveId));
    },
    [incomingWaves, onAccept]
  );

  // Wave辞退（あとで）
  const declineWave = useCallback(
    async (waveId: string) => {
      const wave = incomingWaves.find((w) => w.id === waveId);
      if (!wave) return;

      // Call API to respond to wave
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        await fetch(`/api/waves/${waveId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "declined" }),
        });

        onDecline?.(wave);
      } catch (error) {
        console.error("Failed to decline wave:", error);
      }

      setIncomingWaves((prev) => prev.filter((w) => w.id !== waveId));
    },
    [incomingWaves, onDecline]
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
    acceptWave,
    declineWave,
    clearAll,
  };
}
