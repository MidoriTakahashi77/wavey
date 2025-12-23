"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";

type Member = {
  id: string;
  name: string;
};

type TransferOwnerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  onTransfer: (memberId: string) => void;
};

export function TransferOwnerModal({
  open,
  onOpenChange,
  members,
  onTransfer,
}: TransferOwnerModalProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleTransfer = () => {
    if (selectedMember && confirmText === "譲渡する") {
      onTransfer(selectedMember);
      setSelectedMember(null);
      setConfirmText("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedMember(null);
    setConfirmText("");
    onOpenChange(false);
  };

  const isValid = selectedMember && confirmText === "譲渡する";

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="オーナー権限を譲渡"
      description="この操作は取り消せません"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            譲渡先メンバー
          </label>
          <select
            value={selectedMember || ""}
            onChange={(e) => setSelectedMember(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            確認のため「譲渡する」と入力
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="譲渡する"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={handleTransfer}
            disabled={!isValid}
          >
            譲渡する
          </Button>
        </div>
      </div>
    </Modal>
  );
}
