"use client";

import { Avatar, Badge } from "@/components/ui";
import { WaveButton } from "@/components/features/wave/WaveButton";

type MemberStatus = "online" | "busy" | "away" | "offline";

type MemberItemProps = {
  id: string;
  name: string;
  status: MemberStatus;
  statusMessage?: string;
  isMe?: boolean;
  onWave?: (memberId: string) => void;
};

const statusLabels: Record<
  MemberStatus,
  { label: string; variant: "success" | "error" | "warning" | "default" }
> = {
  online: { label: "オンライン", variant: "success" },
  busy: { label: "通話中", variant: "error" },
  away: { label: "離席中", variant: "warning" },
  offline: { label: "オフライン", variant: "default" },
};

export function MemberItem({
  id,
  name,
  status,
  statusMessage,
  isMe = false,
  onWave,
}: MemberItemProps) {
  const { label, variant } = statusLabels[status];

  return (
    <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <Avatar status={status} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{name}</span>
            {isMe && <span className="text-xs text-gray-400">(自分)</span>}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <Badge variant={variant}>{label}</Badge>
            {statusMessage && <span className="text-xs text-gray-500">{statusMessage}</span>}
          </div>
        </div>
      </div>

      {!isMe && status !== "offline" && (
        <WaveButton onClick={() => onWave?.(id)} disabled={status === "busy"} />
      )}
    </div>
  );
}
