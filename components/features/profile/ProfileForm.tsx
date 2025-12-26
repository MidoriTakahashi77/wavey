"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, useToast } from "@/components/ui";
import { SkinSelector } from "./SkinSelector";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";

type Profile = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export function ProfileForm() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const toast = useToast();

  const [nickname, setNickname] = useState("");
  const [skinId, setSkinId] = useState("skin1");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Fetch profile or set defaults from Google account
  useEffect(() => {
    if (authLoading || !user) return;

    const fetchProfile = async () => {
      try {
        const profile = await apiClient.get<Profile>("/profile");
        setNickname(profile.displayName);
        setIsNewUser(false);
      } catch (err) {
        // Profile not found - new user, use Google name as default
        if (err instanceof ApiError && err.status === 404) {
          const googleName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "";
          setNickname(googleName);
          setIsNewUser(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsSubmitting(true);
    try {
      await apiClient.put<Profile>("/profile", {
        displayName: nickname.trim(),
      });

      toast.success("保存完了", "プロフィールを保存しました");

      // Check for pending invite
      const pendingInvite = sessionStorage.getItem("pendingInvite");
      if (pendingInvite) {
        sessionStorage.removeItem("pendingInvite");
        router.push(`/invite/${pendingInvite}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "プロフィールの保存に失敗しました";
      toast.error("エラー", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900">
          {isNewUser ? "プロフィール設定" : "プロフィール編集"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isNewUser
            ? "あなたの表示名とアバターを設定してください"
            : "表示名やアバターを変更できます"}
        </p>
      </div>

      <div className="space-y-6">
        <Input
          label="ニックネーム"
          placeholder="表示名を入力"
          hint="他のメンバーに表示される名前です（最大20文字）"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          required
        />

        <SkinSelector value={skinId} onChange={setSkinId} />

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={!nickname.trim() || isSubmitting}
        >
          {isNewUser ? "設定を保存" : "変更を保存"}
        </Button>
      </div>
    </form>
  );
}
