"use client";

import { useState } from "react";
import { Button, Avatar } from "@/components/ui";
import { TransferOwnerModal } from "./TransferOwnerModal";
import { HiUserRemove, HiSwitchHorizontal } from "react-icons/hi";

type Member = {
  id: string;
  name: string;
  isOwner?: boolean;
  isMe?: boolean;
};

type MemberManagementProps = {
  members: Member[];
  onRemoveMember: (memberId: string) => void;
  onTransferOwner: (memberId: string) => void;
};

export function MemberManagement({
  members,
  onRemoveMember,
  onTransferOwner,
}: MemberManagementProps) {
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const transferableMembers = members.filter((m) => !m.isOwner && !m.isMe);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">メンバー管理</h2>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <Avatar size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {member.name}
                  </span>
                  {member.isOwner && (
                    <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      オーナー
                    </span>
                  )}
                  {member.isMe && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      自分
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!member.isOwner && !member.isMe && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveMember(member.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <HiUserRemove className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {transferableMembers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTransferModalOpen(true)}
          >
            <HiSwitchHorizontal className="w-4 h-4 mr-2" />
            オーナー権限を譲渡
          </Button>
        </div>
      )}

      <TransferOwnerModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        members={transferableMembers}
        onTransfer={onTransferOwner}
      />
    </div>
  );
}
