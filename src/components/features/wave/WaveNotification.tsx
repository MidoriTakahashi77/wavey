"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Badge } from "@/components/ui";
import { HiPhone, HiX } from "react-icons/hi";
import type { IncomingWave } from "@/hooks/useWaveReceiver";

type WaveNotificationProps = {
  wave: IncomingWave | null;
  queueCount: number;
  onAccept: (waveId: string) => void;
  onDecline: (waveId: string) => void;
};

export function WaveNotification({ wave, queueCount, onAccept, onDecline }: WaveNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (wave) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      // 少し遅れてアニメーション開始
      setTimeout(() => setIsAnimating(true), 50);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [wave]);

  if (!isVisible || !wave) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className={`pointer-events-auto absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onDecline(wave.id)}
      />

      {/* Notification Card */}
      <div
        className={`pointer-events-auto relative mx-4 w-full max-w-sm transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 ${
          isAnimating ? "translate-y-0 scale-100 opacity-100" : "-translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Queue Badge */}
        {queueCount > 1 && (
          <div className="absolute -top-2 -right-2">
            <Badge variant="error">+{queueCount - 1}</Badge>
          </div>
        )}

        {/* Wave Animation */}
        {/* TODO: wave.gifUrl がある場合は👋の代わりに送信者が選んだGIFを表示する */}
        <div className="mb-4 text-center">
          <div className="animate-wave text-6xl">👋</div>
        </div>

        {/* From User */}
        <div className="mb-6 flex flex-col items-center">
          <Avatar size="lg" status="online" />
          <h3 className="mt-3 text-lg font-bold text-gray-900">{wave.fromName}</h3>
          <p className="text-sm text-gray-500">さんが手を振っています</p>
        </div>

        {/* GIF if present */}
        {wave.gifUrl && (
          <div className="mb-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wave.gifUrl} alt="Wave GIF" className="max-h-32 rounded-lg object-contain" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 justify-center"
            onClick={() => onDecline(wave.id)}
          >
            <HiX className="mr-1 h-4 w-4" />
            あとで
          </Button>
          <Button
            className="flex-1 justify-center bg-green-600 hover:bg-green-700"
            onClick={() => onAccept(wave.id)}
          >
            <HiPhone className="mr-1 h-4 w-4" />
            話す
          </Button>
        </div>
      </div>
    </div>
  );
}
