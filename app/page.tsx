"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, useToast } from "@/components/ui";
import { WorkspaceCard } from "@/components/features/workspace/WorkspaceCard";
import { CreateWorkspaceModal } from "@/components/features/workspace/CreateWorkspaceModal";
import { HiPlus, HiOutlineCollection } from "react-icons/hi";
import { useRequireAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";

type Workspace = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
};

export default function Dashboard() {
  const { isLoading: authLoading } = useRequireAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.get<Workspace[]>("/workspaces");
      setWorkspaces(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "ワークスペースの取得に失敗しました";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchWorkspaces();
    }
  }, [authLoading, fetchWorkspaces]);

  const handleWorkspaceCreated = (workspace: Workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
    toast.success("作成完了", `「${workspace.name}」を作成しました`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          {error}
          <Button variant="ghost" className="ml-4" onClick={fetchWorkspaces}>
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">ワークスペース</h1>
        {workspaces.length > 0 && (
          <Button onClick={() => setModalOpen(true)}>
            <HiPlus className="mr-1 h-4 w-4" />
            新規作成
          </Button>
        )}
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
            <WorkspaceCard key={workspace.id} id={workspace.id} name={workspace.name} />
          ))}
        </div>
      )}

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={handleWorkspaceCreated}
      />
    </div>
  );
}
