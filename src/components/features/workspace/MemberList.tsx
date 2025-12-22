"use client";

import { Card } from "@/components/ui";
import { MemberItem } from "./MemberItem";

type Member = {
  id: string;
  name: string;
  status: "online" | "busy" | "away" | "offline";
  statusMessage?: string;
};

type MemberListProps = {
  members: Member[];
  currentUserId: string;
  onWave: (memberId: string) => void;
};

export function MemberList({ members, currentUserId, onWave }: MemberListProps) {
  const onlineMembers = members.filter((m) => m.status !== "offline");
  const offlineMembers = members.filter((m) => m.status === "offline");

  return (
    <Card className="p-2">
      {onlineMembers.length > 0 && (
        <div className="mb-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase px-3 py-2">
            オンライン — {onlineMembers.length}
          </h3>
          <div className="space-y-1">
            {onlineMembers.map((member) => (
              <MemberItem
                key={member.id}
                {...member}
                isMe={member.id === currentUserId}
                onWave={onWave}
              />
            ))}
          </div>
        </div>
      )}

      {offlineMembers.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase px-3 py-2">
            オフライン — {offlineMembers.length}
          </h3>
          <div className="space-y-1">
            {offlineMembers.map((member) => (
              <MemberItem
                key={member.id}
                {...member}
                isMe={member.id === currentUserId}
                onWave={onWave}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
