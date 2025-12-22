"use client";

import { Avatar } from "@/components/ui";
import { CallTimer } from "./CallTimer";
import { CallControls } from "./CallControls";
import type { CallState, CallParticipant } from "@/hooks/useCall";

type CallModalProps = {
  state: CallState;
  participant: CallParticipant | null;
  duration: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
};

export function CallModal({
  state,
  participant,
  duration,
  isMuted,
  onToggleMute,
  onEndCall,
}: CallModalProps) {
  if (state === "idle" || !participant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95">
      <div className="text-center text-white">
        {/* Status */}
        <div className="mb-8">
          {state === "connecting" && (
            <p className="text-gray-400 animate-pulse">接続中...</p>
          )}
          {state === "connected" && (
            <CallTimer duration={duration} className="text-gray-300" />
          )}
          {state === "ended" && (
            <p className="text-gray-400">通話終了</p>
          )}
        </div>

        {/* Participant */}
        <div className="mb-8">
          <div className="relative inline-block">
            <Avatar size="lg" status="busy" />
            {state === "connected" && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold">{participant.name}</h2>
          {state === "connected" && (
            <p className="text-gray-400 text-sm mt-1">通話中</p>
          )}
        </div>

        {/* Mute Indicator */}
        {isMuted && state === "connected" && (
          <div className="mb-6 text-red-400 text-sm">
            🔇 マイクがミュートされています
          </div>
        )}

        {/* Controls */}
        {state !== "ended" && (
          <CallControls
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onEndCall={onEndCall}
          />
        )}
      </div>
    </div>
  );
}
