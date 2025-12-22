"use client";

import { useState } from "react";
import { Modal, Input, Button } from "@/components/ui";

type CreateWorkspaceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (name: string) => void;
};

export function CreateWorkspaceModal({
  open,
  onOpenChange,
  onCreated,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    // モック: 1秒待機
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    onCreated?.(name);
    setName("");
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="ワークスペースを作成"
      description="チームで使うワークスペースを作成しましょう"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="ワークスペース名"
          placeholder="例: 開発チーム"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!name.trim() || isSubmitting}
          >
            作成
          </Button>
        </div>
      </form>
    </Modal>
  );
}
