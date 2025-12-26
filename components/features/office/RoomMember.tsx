"use client";

import { Avatar } from "@/components/ui";

type MemberStatus = "online" | "busy" | "away" | "offline";

type RoomMemberProps = {
  name: string;
  status: MemberStatus;
  statusEmoji?: string;
  onClick?: () => void;
};

export function RoomMember({ name, status, statusEmoji, onClick }: RoomMemberProps) {
  return (
    <button onClick={onClick} className="group flex cursor-pointer flex-col items-center gap-1">
      <div className="relative">
        {statusEmoji && (
          <div className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 rounded-lg border bg-white px-1.5 py-0.5 text-sm shadow-sm">
            {statusEmoji}
          </div>
        )}
        <div className="transition-transform group-hover:scale-110">
          <Avatar size="md" status={status} />
        </div>
      </div>
      <div className="max-w-[80px] truncate rounded-full bg-gray-800/80 px-2 py-0.5 text-xs text-white">
        {name}
      </div>
    </button>
  );
}
