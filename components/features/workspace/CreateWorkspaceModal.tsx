"use client";

import { useState } from "react";
import { Modal, Input, Button, useToast } from "@/components/ui";
import { apiClient, ApiError } from "@/lib/api";

type Workspace = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
};

type CreateWorkspaceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (workspace: Workspace) => void;
};

export function CreateWorkspaceModal({ open, onOpenChange, onCreated }: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const workspace = await apiClient.post<Workspace>("/workspaces", { name: name.trim() });
      onCreated?.(workspace);
      setName("");
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "ワークスペースの作成に失敗しました";
      toast.error("エラー", message);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!name.trim() || isSubmitting}>
            作成
          </Button>
        </div>
      </form>
    </Modal>
  );
}
