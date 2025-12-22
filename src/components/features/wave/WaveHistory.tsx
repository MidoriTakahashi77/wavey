"use client";

import { Card, Avatar } from "@/components/ui";
import { HiOutlineClock } from "react-icons/hi";

type WaveRecord = {
  id: string;
  fromName: string;
  toName: string;
  timestamp: Date;
  result: "accepted" | "declined" | "pending";
};

type WaveHistoryProps = {
  waves: WaveRecord[];
};

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;

  return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

const resultLabels: Record<WaveRecord["result"], { text: string; color: string }> = {
  accepted: { text: "通話開始", color: "text-green-600" },
  declined: { text: "またの機会に", color: "text-gray-500" },
  pending: { text: "応答待ち...", color: "text-yellow-600" },
};

export function WaveHistory({ waves }: WaveHistoryProps) {
  if (waves.length === 0) {
    return (
      <Card className="p-6 text-center">
        <HiOutlineClock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">まだwaveの履歴がありません</p>
      </Card>
    );
  }

  return (
    <Card className="p-2">
      <h3 className="text-xs font-medium text-gray-500 uppercase px-3 py-2">
        Wave履歴
      </h3>
      <div className="space-y-1">
        {waves.map((wave) => {
          const { text, color } = resultLabels[wave.result];
          return (
            <div
              key={wave.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Avatar size="sm" />
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{wave.fromName}</span>
                    <span className="text-gray-500"> → </span>
                    <span className="font-medium">{wave.toName}</span>
                  </p>
                  <p className={`text-xs ${color}`}>{text}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(wave.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
