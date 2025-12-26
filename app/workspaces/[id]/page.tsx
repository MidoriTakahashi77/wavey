"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { Button, Modal, useToast } from "@/components/ui";
import { VirtualOffice } from "@/components/features/office";
import { WaveHistory } from "@/components/features/wave/WaveHistory";
import { WaveNotification } from "@/components/features/wave/WaveNotification";
import { CallModal } from "@/components/features/call";
import { useWaveReceiver } from "@/hooks/useWaveReceiver";
import { usePresence } from "@/hooks/usePresence";
import { useCall } from "@/hooks/useCall";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { HiArrowLeft, HiCog } from "react-icons/hi";

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

type WaveStatus = "pending" | "accepted" | "declined" | "expired";

type Wave = {
  id: string;
  workspaceId: string;
  fromUserId: string;
  toUserId: string;
  status: WaveStatus;
  createdAt: string;
  respondedAt: string | null;
};

type WaveRecord = {
  id: string;
  fromName: string;
  toName: string;
  timestamp: Date;
  result: "accepted" | "declined" | "pending";
};

const DEFAULT_ROOMS = [{ id: "main", name: "メインルーム", color: "blue" as const }];

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function WorkspacePage({ params }: PageProps) {
  const { id: workspaceId } = use(params);
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const currentUserName = user?.user_metadata?.display_name ?? user?.email ?? null;

  const [workspace, setWorkspace] = useState<WorkspaceWithMembers | null>(null);
  const [waves, setWaves] = useState<WaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isSendingWave, setIsSendingWave] = useState(false);
  const toast = useToast();

  // Presence for online members
  const { onlineMembers } = usePresence({
    workspaceId,
    currentUserId,
    currentUserName,
  });

  // Fetch workspace and waves data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [workspaceData, wavesData] = await Promise.all([
        apiClient.get<WorkspaceWithMembers>(`/workspaces/${workspaceId}`),
        apiClient.get<Wave[]>(`/waves?workspaceId=${workspaceId}`),
      ]);

      setWorkspace(workspaceData);

      // Convert waves to WaveRecord format
      const memberMap = new Map(workspaceData.members.map((m) => [m.user.id, m.user.displayName]));

      const waveRecords: WaveRecord[] = wavesData.map((wave) => ({
        id: wave.id,
        fromName: memberMap.get(wave.fromUserId) ?? "不明",
        toName: memberMap.get(wave.toUserId) ?? "不明",
        timestamp: new Date(wave.createdAt),
        result:
          wave.status === "expired"
            ? "declined"
            : (wave.status as "accepted" | "declined" | "pending"),
      }));
      setWaves(waveRecords);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "データの取得に失敗しました";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 通話管理
  const call = useCall({
    onCallStart: () => {
      toast.success("通話開始", "接続しました");
    },
    onCallEnd: (duration) => {
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      toast.info("通話終了", `通話時間: ${mins}分${secs}秒`);
    },
  });

  // Member name lookup function
  const memberNameLookup = useCallback(
    (userId: string): string => {
      const member = workspace?.members.find((m) => m.user.id === userId);
      return member?.user.displayName ?? userId.slice(0, 8);
    },
    [workspace?.members]
  );

  // Wave受信
  const waveReceiver = useWaveReceiver({
    workspaceId,
    currentUserId,
    memberNameLookup,
    onAccept: (wave) => {
      // 履歴に追加（重複を避ける）
      setWaves((prev) => {
        const filtered = prev.filter((w) => w.id !== wave.id);
        return [
          {
            id: wave.id,
            fromName: wave.fromName,
            toName: "自分",
            timestamp: wave.timestamp,
            result: "accepted",
          },
          ...filtered,
        ];
      });
      // 通話を開始
      call.startCall({
        id: wave.fromId,
        name: wave.fromName,
      });
    },
    onDecline: (wave) => {
      toast.info("またの機会に", `${wave.fromName}さんへの応答を保留しました`);
      // 履歴に追加（重複を避ける）
      setWaves((prev) => {
        const filtered = prev.filter((w) => w.id !== wave.id);
        return [
          {
            id: wave.id,
            fromName: wave.fromName,
            toName: "自分",
            timestamp: wave.timestamp,
            result: "declined",
          },
          ...filtered,
        ];
      });
    },
  });

  // Convert members for VirtualOffice
  const officeMembers =
    workspace?.members.map((m) => {
      const isOnline = onlineMembers.some((om) => om.userId === m.user.id);
      const presenceInfo = onlineMembers.find((om) => om.userId === m.user.id);
      return {
        id: m.user.id,
        name: m.user.displayName,
        status:
          presenceInfo?.status === "busy"
            ? ("busy" as const)
            : isOnline
              ? ("online" as const)
              : ("offline" as const),
        roomId: "main",
      };
    }) ?? [];

  const handleMemberClick = (memberId: string) => {
    if (memberId === currentUserId) return;
    setSelectedMember(memberId);
  };

  const handleWave = async () => {
    if (!selectedMember || !workspace) return;

    const member = workspace.members.find((m) => m.user.id === selectedMember);
    if (!member) return;

    setIsSendingWave(true);
    try {
      const wave = await apiClient.post<Wave>("/waves", {
        workspaceId,
        toUserId: selectedMember,
      });

      const newWave: WaveRecord = {
        id: wave.id,
        fromName: "自分",
        toName: member.user.displayName,
        timestamp: new Date(wave.createdAt),
        result: "pending",
      };
      // 重複を避ける
      setWaves((prev) => {
        const filtered = prev.filter((w) => w.id !== wave.id);
        return [newWave, ...filtered];
      });
      setSelectedMember(null);

      toast.wave("👋 Wave送信", `${member.user.displayName}さんに手を振りました`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Waveの送信に失敗しました";
      toast.error("エラー", message);
    } finally {
      setIsSendingWave(false);
    }
  };

  const selectedMemberData = workspace?.members.find((m) => m.user.id === selectedMember);
  const selectedMemberOnline = selectedMemberData
    ? onlineMembers.find((om) => om.userId === selectedMemberData.user.id)
    : null;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="mx-auto max-w-5xl p-6">
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
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <HiArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{workspace.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/workspaces/${workspaceId}/settings`}>
            <Button variant="ghost" size="sm">
              <HiCog className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Virtual Office */}
      <div className="mb-6">
        <VirtualOffice
          rooms={DEFAULT_ROOMS}
          members={officeMembers}
          onMemberClick={handleMemberClick}
        />
      </div>

      {/* Wave History */}
      <div className="max-w-md">
        <h2 className="mb-3 text-sm font-medium text-gray-500">最近のWave</h2>
        <WaveHistory waves={waves} />
      </div>

      {/* Member Action Modal */}
      <Modal
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
        title={selectedMemberData?.user.displayName || ""}
        description="アクションを選択してください"
      >
        <div className="space-y-3">
          <Button
            className="w-full justify-center"
            onClick={handleWave}
            disabled={selectedMemberOnline?.status === "busy" || isSendingWave}
            loading={isSendingWave}
          >
            <span>👋</span>
            <span className="ml-2">手を振る</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setSelectedMember(null)}
          >
            キャンセル
          </Button>
        </div>
      </Modal>

      {/* Wave受信通知 */}
      <WaveNotification
        wave={waveReceiver.currentWave}
        queueCount={waveReceiver.waveCount}
        onAccept={waveReceiver.acceptWave}
        onDecline={waveReceiver.declineWave}
      />

      {/* 通話画面 */}
      <CallModal
        state={call.state}
        participant={call.participant}
        duration={call.duration}
        isMuted={call.isMuted}
        onToggleMute={call.toggleMute}
        onEndCall={call.endCall}
      />
    </div>
  );
}
