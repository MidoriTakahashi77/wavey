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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">ワークスペース</h1>
        <Button onClick={() => setModalOpen(true)}>
          <HiPlus className="w-4 h-4 mr-1" />
          新規作成
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineCollection className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            ワークスペースがありません
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            チームで使うワークスペースを作成しましょう
          </p>
          <Button onClick={() => setModalOpen(true)}>
            <HiPlus className="w-4 h-4 mr-1" />
            ワークスペースを作成
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
