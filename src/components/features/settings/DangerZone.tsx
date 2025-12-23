"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import { HiExclamation } from "react-icons/hi";

type DangerZoneProps = {
  workspaceName: string;
  onDeleteWorkspace: () => void;
};

export function DangerZone({
  workspaceName,
  onDeleteWorkspace,
}: DangerZoneProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    if (confirmText === workspaceName) {
      onDeleteWorkspace();
      setDeleteModalOpen(false);
      setConfirmText("");
    }
  };

  const handleClose = () => {
    setDeleteModalOpen(false);
    setConfirmText("");
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <HiExclamation className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-900 mb-1">
              危険な操作
            </h2>
            <p className="text-sm text-red-700 mb-4">
              この操作は取り消せません。すべてのデータが削除されます。
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              ワークスペースを削除
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={deleteModalOpen}
        onOpenChange={handleClose}
        title="ワークスペースを削除"
        description="この操作は取り消せません"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>{workspaceName}</strong>{" "}
              を削除すると、すべてのメンバー、履歴、設定が完全に削除されます。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              確認のためワークスペース名を入力
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={workspaceName}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={handleClose}>
              キャンセル
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={confirmText !== workspaceName}
            >
              削除する
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
