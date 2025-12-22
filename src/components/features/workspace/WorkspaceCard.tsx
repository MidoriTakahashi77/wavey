"use client";

import Link from "next/link";
import { Card, Avatar, Badge } from "@/components/ui";
import { HiUsers } from "react-icons/hi";

type WorkspaceCardProps = {
  id: string;
  name: string;
  memberCount: number;
  onlineCount: number;
};

export function WorkspaceCard({
  id,
  name,
  memberCount,
  onlineCount,
}: WorkspaceCardProps) {
  return (
    <Link href={`/workspaces/${id}`}>
      <Card clickable className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 truncate">{name}</h3>
          {onlineCount > 0 && (
            <Badge variant="success">{onlineCount}人オンライン</Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[...Array(Math.min(memberCount, 3))].map((_, i) => (
              <Avatar key={i} size="sm" className="border-2 border-white" />
            ))}
            {memberCount > 3 && (
              <div className="w-8 h-8 rounded-md bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{memberCount - 3}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <HiUsers className="w-4 h-4" />
            <span>{memberCount}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
