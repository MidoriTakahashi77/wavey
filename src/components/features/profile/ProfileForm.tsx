"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { SkinSelector } from "./SkinSelector";

export function ProfileForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [skinId, setSkinId] = useState("skin1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsSubmitting(true);
    // モック: 1秒待機
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    // ダッシュボードへ遷移
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900">プロフィール設定</h1>
        <p className="mt-1 text-sm text-gray-500">あなたの表示名とアバターを設定してください</p>
      </div>

      <div className="space-y-6">
        <Input
          label="ニックネーム"
          placeholder="表示名を入力"
          hint="他のメンバーに表示される名前です"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />

        <SkinSelector value={skinId} onChange={setSkinId} />

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={!nickname.trim() || isSubmitting}
        >
          設定を保存
        </Button>
      </div>
    </form>
  );
}
