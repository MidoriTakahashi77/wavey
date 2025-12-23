"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, useToast } from "@/components/ui";
import { MemberManagement, InviteLinkSection, DangerZone } from "@/components/features/settings";
import { HiArrowLeft } from "react-icons/hi";

// モックデータ
const MOCK_WORKSPACE = {
  id: "1",
  name: "開発チーム",
};

const MOCK_MEMBERS = [
  { id: "me", name: "自分", isOwner: true, isMe: true },
  { id: "2", name: "田中" },
  { id: "3", name: "佐藤" },
  { id: "4", name: "鈴木" },
  { id: "5", name: "高橋" },
];

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();

  const handleRemoveMember = (memberId: string) => {
    const member = MOCK_MEMBERS.find((m) => m.id === memberId);
    if (member) {
      toast.success("メンバーを削除", `${member.name}さんを削除しました`);
    }
  };

  const handleTransferOwner = (memberId: string) => {
    const member = MOCK_MEMBERS.find((m) => m.id === memberId);
    if (member) {
      toast.success("オーナー権限を譲渡", `${member.name}さんにオーナー権限を譲渡しました`);
    }
  };

  const handleGenerateInviteLink = () => {
    const token = Math.random().toString(36).substring(2, 10);
    return `https://wavey.app/invite/${MOCK_WORKSPACE.id}/${token}`;
  };

  const handleDeleteWorkspace = () => {
    toast.success("ワークスペースを削除", "ワークスペースを削除しました");
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link href={`/workspaces/${params.id}`}>
          <Button variant="ghost" size="sm">
            <HiArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">ワークスペース設定</h1>
          <p className="text-sm text-gray-500">{MOCK_WORKSPACE.name}</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <MemberManagement
          members={MOCK_MEMBERS}
          onRemoveMember={handleRemoveMember}
          onTransferOwner={handleTransferOwner}
        />

        <InviteLinkSection
          workspaceId={MOCK_WORKSPACE.id}
          onGenerateLink={handleGenerateInviteLink}
        />

        <DangerZone workspaceName={MOCK_WORKSPACE.name} onDeleteWorkspace={handleDeleteWorkspace} />
      </div>
    </div>
  );
}
