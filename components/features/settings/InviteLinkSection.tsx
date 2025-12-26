"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { HiClipboardCopy, HiRefresh, HiCheck } from "react-icons/hi";

type InviteLinkSectionProps = {
  workspaceId: string;
  onGenerateLink: () => string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InviteLinkSection({ workspaceId, onGenerateLink }: InviteLinkSectionProps) {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = () => {
    const link = onGenerateLink();
    setInviteLink(link);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック
      const textArea = document.createElement("textarea");
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">招待リンク</h2>
      <p className="mb-4 text-sm text-gray-500">リンクを共有してメンバーを招待できます</p>

      {inviteLink ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            />
            <Button variant="secondary" size="sm" onClick={handleCopyLink} className="shrink-0">
              {copied ? (
                <>
                  <HiCheck className="mr-1 h-4 w-4 text-green-600" />
                  コピー済み
                </>
              ) : (
                <>
                  <HiClipboardCopy className="mr-1 h-4 w-4" />
                  コピー
                </>
              )}
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleGenerateLink} className="text-gray-500">
            <HiRefresh className="mr-1 h-4 w-4" />
            新しいリンクを生成
          </Button>
        </div>
      ) : (
        <Button variant="primary" onClick={handleGenerateLink}>
          招待リンクを生成
        </Button>
      )}
    </div>
  );
}
