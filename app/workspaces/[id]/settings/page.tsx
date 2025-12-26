"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, useToast } from "@/components/ui";
import { MemberManagement, InviteLinkSection, DangerZone } from "@/components/features/settings";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { HiArrowLeft } from "react-icons/hi";

type UserSummary = {
  id: string;
  displayName: string;
};

type WorkspaceMember = {
  user: UserSummary;
  role: "owner" | "member";
  joinedAt: string;
};

type WorkspaceWithMembers = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  members: WorkspaceMember[];
};

type Invite = {
  id: string;
  code: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function WorkspaceSettingsPage({ params }: PageProps) {
  const { id: workspaceId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [workspace, setWorkspace] = useState<WorkspaceWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = user?.id ?? null;
  const isOwner = workspace?.ownerId === currentUserId;

  // Fetch workspace and invites
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const workspaceData = await apiClient.get<WorkspaceWithMembers>(`/workspaces/${workspaceId}`);
      setWorkspace(workspaceData);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "データの取得に失敗しました";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchData();
    }
  }, [currentUserId, fetchData]);

  // Convert members for MemberManagement component
  const membersForManagement =
    workspace?.members.map((m) => ({
      id: m.user.id,
      name: m.user.displayName,
      isOwner: m.role === "owner",
      isMe: m.user.id === currentUserId,
    })) ?? [];

  // Handle member removal
  const handleRemoveMember = async (memberId: string) => {
    const member = workspace?.members.find((m) => m.user.id === memberId);
    if (!member) return;

    try {
      await apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
      setWorkspace((prev) =>
        prev ? { ...prev, members: prev.members.filter((m) => m.user.id !== memberId) } : null
      );
      toast.success("メンバーを削除", `${member.user.displayName}さんを削除しました`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "メンバーの削除に失敗しました";
      toast.error("エラー", message);
    }
  };

  // Handle owner transfer
  const handleTransferOwner = async (memberId: string) => {
    const member = workspace?.members.find((m) => m.user.id === memberId);
    if (!member) return;

    try {
      await apiClient.post(`/workspaces/${workspaceId}/transfer`, {
        newOwnerId: memberId,
      });
      toast.success(
        "オーナー権限を譲渡",
        `${member.user.displayName}さんにオーナー権限を譲渡しました`
      );
      // Refetch to update UI
      fetchData();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "オーナー権限の譲渡に失敗しました";
      toast.error("エラー", message);
    }
  };

  // Handle invite generation
  const handleGenerateInvite = async (): Promise<string | null> => {
    try {
      const invite = await apiClient.post<Invite>(`/workspaces/${workspaceId}/invites`, {
        maxUses: null,
      });
      const baseUrl = window.location.origin;
      return `${baseUrl}/invite/${invite.code}`;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "招待リンクの生成に失敗しました";
      toast.error("エラー", message);
      return null;
    }
  };

  // Handle workspace deletion
  const handleDeleteWorkspace = async () => {
    try {
      await apiClient.delete(`/workspaces/${workspaceId}`);
      toast.success("ワークスペースを削除", "ワークスペースを削除しました");
      router.push("/");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "ワークスペースの削除に失敗しました";
      toast.error("エラー", message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          {error ?? "ワークスペースが見つかりません"}
          <Button variant="ghost" className="ml-4" onClick={fetchData}>
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link href={`/workspaces/${workspaceId}`}>
          <Button variant="ghost" size="sm">
            <HiArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">ワークスペース設定</h1>
          <p className="text-sm text-gray-500">{workspace.name}</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <MemberManagement
          members={membersForManagement}
          onRemoveMember={handleRemoveMember}
          onTransferOwner={handleTransferOwner}
        />

        {isOwner && (
          <InviteLinkSection workspaceId={workspaceId} onGenerateLink={handleGenerateInvite} />
        )}

        {isOwner && (
          <DangerZone workspaceName={workspace.name} onDeleteWorkspace={handleDeleteWorkspace} />
        )}
      </div>
    </div>
  );
}
