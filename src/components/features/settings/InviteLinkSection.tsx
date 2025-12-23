"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { HiClipboardCopy, HiRefresh, HiCheck } from "react-icons/hi";

type InviteLinkSectionProps = {
  workspaceId: string;
  onGenerateLink: () => string;
};

export function InviteLinkSection({
  workspaceId,
  onGenerateLink,
}: InviteLinkSectionProps) {
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">招待リンク</h2>
      <p className="text-sm text-gray-500 mb-4">
        リンクを共有してメンバーを招待できます
      </p>

      {inviteLink ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <HiCheck className="w-4 h-4 mr-1 text-green-600" />
                  コピー済み
                </>
              ) : (
                <>
                  <HiClipboardCopy className="w-4 h-4 mr-1" />
                  コピー
                </>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateLink}
            className="text-gray-500"
          >
            <HiRefresh className="w-4 h-4 mr-1" />
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
