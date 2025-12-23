"use client";

import { useState } from "react";
import { Button, useToast } from "@/components/ui";
import { WorkspaceCard } from "@/components/features/workspace/WorkspaceCard";
import { CreateWorkspaceModal } from "@/components/features/workspace/CreateWorkspaceModal";
import { HiPlus, HiOutlineCollection } from "react-icons/hi";

// モックデータ
const MOCK_WORKSPACES = [
  { id: "1", name: "開発チーム", memberCount: 5, onlineCount: 3 },
  { id: "2", name: "デザインチーム", memberCount: 3, onlineCount: 1 },
  { id: "3", name: "マーケティング", memberCount: 8, onlineCount: 0 },
];

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const handleCreateWorkspace = (name: string) => {
    const newWorkspace = {
      id: String(Date.now()),
      name,
      memberCount: 1,
      onlineCount: 1,
    };
    setWorkspaces([...workspaces, newWorkspace]);
    toast.success("作成完了", `「${name}」を作成しました`);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">ワークスペース</h1>
        <Button onClick={() => setModalOpen(true)}>
          <HiPlus className="mr-1 h-4 w-4" />
          新規作成
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <HiOutlineCollection className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="mb-2 text-lg font-medium text-gray-900">ワークスペースがありません</h2>
          <p className="mb-6 text-sm text-gray-500">チームで使うワークスペースを作成しましょう</p>
          <Button onClick={() => setModalOpen(true)}>
            <HiPlus className="mr-1 h-4 w-4" />
            ワークスペースを作成
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} {...workspace} />
          ))}
        </div>
      )}

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={handleCreateWorkspace}
      />
    </div>
  );
}
