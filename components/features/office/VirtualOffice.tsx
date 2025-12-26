"use client";

import { Room } from "./Room";
import { RoomMember } from "./RoomMember";

type Member = {
  id: string;
  name: string;
  status: "online" | "busy" | "away" | "offline";
  statusEmoji?: string;
  roomId: string;
};

type RoomData = {
  id: string;
  name: string;
  color: "blue" | "green" | "yellow" | "pink" | "purple";
};

type VirtualOfficeProps = {
  rooms: RoomData[];
  members: Member[];
  onMemberClick?: (memberId: string) => void;
};

export function VirtualOffice({ rooms, members, onMemberClick }: VirtualOfficeProps) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-gray-100 p-6">
      {/* 背景パターン */}
      <div
        className="relative"
        style={{
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      >
        {/* ルーム配置 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {rooms.map((room) => {
            const roomMembers = members.filter((m) => m.roomId === room.id);
            return (
              <Room key={room.id} name={room.name} color={room.color}>
                {roomMembers.length === 0 ? (
                  <div className="text-sm text-gray-400">空室</div>
                ) : (
                  roomMembers.map((member) => (
                    <RoomMember
                      key={member.id}
                      name={member.name}
                      status={member.status}
                      statusEmoji={member.statusEmoji}
                      onClick={() => onMemberClick?.(member.id)}
                    />
                  ))
                )}
              </Room>
            );
          })}
        </div>
      </div>
    </div>
  );
}
