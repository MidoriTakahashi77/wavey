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
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group cursor-pointer"
    >
      <div className="relative">
        {statusEmoji && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-lg px-1.5 py-0.5 shadow-sm border text-sm z-10">
            {statusEmoji}
          </div>
        )}
        <div className="transition-transform group-hover:scale-110">
          <Avatar size="md" status={status} />
        </div>
      </div>
      <div className="bg-gray-800/80 text-white text-xs px-2 py-0.5 rounded-full max-w-[80px] truncate">
        {name}
      </div>
    </button>
  );
}
