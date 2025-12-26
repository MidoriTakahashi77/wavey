"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type CallState = "idle" | "connecting" | "connected" | "ended";

export type CallParticipant = {
  id: string;
  name: string;
};

type UseCallOptions = {
  onCallStart?: () => void;
  onCallEnd?: (duration: number) => void;
};

export function useCall(options: UseCallOptions = {}) {
  const [state, setState] = useState<CallState>("idle");
  const [participant, setParticipant] = useState<CallParticipant | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 通話開始
  const startCall = useCallback(
    (targetParticipant: CallParticipant) => {
      setState("connecting");
      setParticipant(targetParticipant);
      setDuration(0);
      setIsMuted(false);

      // モック: 1秒後に接続完了
      setTimeout(() => {
        setState("connected");
        options.onCallStart?.();
      }, 1000);
    },
    [options]
  );

  // 通話終了
  const endCall = useCallback(() => {
    const finalDuration = duration;
    setState("ended");

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    options.onCallEnd?.(finalDuration);

    // 少し待ってからリセット
    setTimeout(() => {
      setState("idle");
      setParticipant(null);
      setDuration(0);
    }, 500);
  }, [duration, options]);

  // ミュート切り替え
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // 通話時間カウント
  useEffect(() => {
    if (state === "connected") {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state]);

  return {
    state,
    participant,
    isMuted,
    duration,
    isActive: state === "connecting" || state === "connected",
    startCall,
    endCall,
    toggleMute,
  };
}
