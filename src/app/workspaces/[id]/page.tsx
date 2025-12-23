"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Modal, useToast } from "@/components/ui";
import { VirtualOffice } from "@/components/features/office";
import { WaveHistory } from "@/components/features/wave/WaveHistory";
import { WaveNotification } from "@/components/features/wave/WaveNotification";
import { CallModal } from "@/components/features/call";
import { useWaveReceiver } from "@/hooks/useWaveReceiver";
import { useCall } from "@/hooks/useCall";
import { HiArrowLeft, HiCog, HiBell } from "react-icons/hi";

type WaveResult = "accepted" | "declined" | "pending";

type WaveRecord = {
  id: string;
  fromName: string;
  toName: string;
  timestamp: Date;
  result: WaveResult;
};

// モックデータ
const MOCK_WORKSPACE = {
  id: "1",
  name: "開発チーム",
};

const MOCK_ROOMS = [
  { id: "room1", name: "エンジニアリング", color: "blue" as const },
  { id: "room2", name: "ミーティング", color: "green" as const },
  { id: "room3", name: "デザイン", color: "yellow" as const },
];

const MOCK_MEMBERS = [
  { id: "me", name: "自分", status: "online" as const, statusEmoji: "💻", roomId: "room1" },
  { id: "2", name: "田中", status: "online" as const, statusEmoji: "👍", roomId: "room1" },
  { id: "3", name: "佐藤", status: "busy" as const, statusEmoji: "📞", roomId: "room2" },
  { id: "4", name: "鈴木", status: "online" as const, statusEmoji: "😊", roomId: "room2" },
  { id: "5", name: "高橋", status: "away" as const, statusEmoji: "🍵", roomId: "room3" },
  { id: "6", name: "伊藤", status: "online" as const, roomId: "room3" },
  { id: "7", name: "渡辺", status: "online" as const, statusEmoji: "🎨", roomId: "room3" },
];

const MOCK_WAVES: WaveRecord[] = [
  {
    id: "1",
    fromName: "田中",
    toName: "自分",
    timestamp: new Date(Date.now() - 5 * 60000),
    result: "accepted",
  },
  {
    id: "2",
    fromName: "自分",
    toName: "佐藤",
    timestamp: new Date(Date.now() - 30 * 60000),
    result: "declined",
  },
];

export default function WorkspacePage() {
  const [waves, setWaves] = useState(MOCK_WAVES);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const toast = useToast();

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

  // Wave受信
  const waveReceiver = useWaveReceiver({
    onAccept: (wave) => {
      // 履歴に追加
      setWaves((prev) => [
        {
          id: wave.id,
          fromName: wave.fromName,
          toName: "自分",
          timestamp: wave.timestamp,
          result: "accepted",
        },
        ...prev,
      ]);
      // 通話を開始
      call.startCall({
        id: wave.fromId,
        name: wave.fromName,
      });
    },
    onDecline: (wave) => {
      toast.info("またの機会に", `${wave.fromName}さんへの応答を保留しました`);
      // 履歴に追加
      setWaves((prev) => [
        {
          id: wave.id,
          fromName: wave.fromName,
          toName: "自分",
          timestamp: wave.timestamp,
          result: "declined",
        },
        ...prev,
      ]);
    },
  });

  // デモ用：ランダムにWaveを受信
  const simulateIncomingWave = () => {
    const randomMember = MOCK_MEMBERS.filter((m) => m.id !== "me")[
      Math.floor(Math.random() * (MOCK_MEMBERS.length - 1))
    ];
    waveReceiver.receiveWave({
      fromId: randomMember.id,
      fromName: randomMember.name,
    });
  };

  const handleMemberClick = (memberId: string) => {
    if (memberId === "me") return;
    setSelectedMember(memberId);
  };

  const handleWave = () => {
    const member = MOCK_MEMBERS.find((m) => m.id === selectedMember);
    if (!member) return;

    const newWave: WaveRecord = {
      id: String(Date.now()),
      fromName: "自分",
      toName: member.name,
      timestamp: new Date(),
      result: "pending",
    };
    setWaves([newWave, ...waves]);
    setSelectedMember(null);

    toast.wave("👋 Wave送信", `${member.name}さんに手を振りました`);
  };

  const selectedMemberData = MOCK_MEMBERS.find((m) => m.id === selectedMember);

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
          <h1 className="text-xl font-bold text-gray-900">{MOCK_WORKSPACE.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* デモ用：Wave受信シミュレート */}
          <Button variant="secondary" size="sm" onClick={simulateIncomingWave}>
            <HiBell className="mr-1 h-4 w-4" />
            Wave受信デモ
          </Button>
          <Link href={`/workspaces/${MOCK_WORKSPACE.id}/settings`}>
            <Button variant="ghost" size="sm">
              <HiCog className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Virtual Office */}
      <div className="mb-6">
        <VirtualOffice
          rooms={MOCK_ROOMS}
          members={MOCK_MEMBERS}
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
        title={selectedMemberData?.name || ""}
        description="アクションを選択してください"
      >
        <div className="space-y-3">
          <Button
            className="w-full justify-center"
            onClick={handleWave}
            disabled={selectedMemberData?.status === "busy"}
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
