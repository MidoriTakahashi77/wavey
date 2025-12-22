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

export function WaveNotification({
  wave,
  queueCount,
  onAccept,
  onDecline,
}: WaveNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (wave) {
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 pointer-events-auto ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onDecline(wave.id)}
      />

      {/* Notification Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full pointer-events-auto transform transition-all duration-300 ${
          isAnimating
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-8 opacity-0 scale-95"
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
        <div className="text-center mb-4">
          <div className="text-6xl animate-wave">👋</div>
        </div>

        {/* From User */}
        <div className="flex flex-col items-center mb-6">
          <Avatar size="lg" status="online" />
          <h3 className="mt-3 text-lg font-bold text-gray-900">
            {wave.fromName}
          </h3>
          <p className="text-gray-500 text-sm">さんが手を振っています</p>
        </div>

        {/* GIF if present */}
        {wave.gifUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={wave.gifUrl}
              alt="Wave GIF"
              className="rounded-lg max-h-32 object-contain"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 justify-center"
            onClick={() => onDecline(wave.id)}
          >
            <HiX className="w-4 h-4 mr-1" />
            あとで
          </Button>
          <Button
            className="flex-1 justify-center bg-green-600 hover:bg-green-700"
            onClick={() => onAccept(wave.id)}
          >
            <HiPhone className="w-4 h-4 mr-1" />
            話す
          </Button>
        </div>
      </div>
    </div>
  );
}
