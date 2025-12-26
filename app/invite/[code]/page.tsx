"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, useToast } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { HiUserGroup, HiExclamation } from "react-icons/hi";

type AcceptInviteResponse = {
  workspaceId: string;
  workspaceName: string;
};

type PageProps = {
  params: Promise<{ code: string }>;
};

export default function InviteAcceptPage({ params }: PageProps) {
  const { code } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const toast = useToast();

  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Store the invite code in sessionStorage to redirect back after login
      sessionStorage.setItem("pendingInvite", code);
      router.push("/login");
    }
  }, [authLoading, user, code, router]);

  // Check for pending invite after login
  useEffect(() => {
    if (user && !authLoading) {
      const pendingInvite = sessionStorage.getItem("pendingInvite");
      if (pendingInvite === code) {
        sessionStorage.removeItem("pendingInvite");
        // Auto-accept after login redirect
        handleAccept();
      }
    }
  }, [user, authLoading, code]);

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      const result = await apiClient.post<AcceptInviteResponse>(`/invites/${code}/accept`);
      setAccepted(true);
      toast.success("参加完了", `「${result.workspaceName}」に参加しました`);

      // Redirect to workspace after a short delay
      setTimeout(() => {
        router.push(`/workspaces/${result.workspaceId}`);
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("招待の受け入れに失敗しました");
      }
    } finally {
      setIsAccepting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500">ログインページへ移動中...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <Card className="p-8 text-center">
        {accepted ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <HiUserGroup className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-gray-900">参加完了!</h1>
            <p className="text-gray-500">ワークスペースに移動します...</p>
          </>
        ) : error ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <HiExclamation className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-gray-900">招待エラー</h1>
            <p className="mb-6 text-gray-500">{error}</p>
            <Button variant="secondary" onClick={() => router.push("/")}>
              ダッシュボードへ戻る
            </Button>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <HiUserGroup className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-gray-900">ワークスペースへの招待</h1>
            <p className="mb-6 text-gray-500">この招待を受け入れてワークスペースに参加しますか？</p>
            <div className="space-y-3">
              <Button
                className="w-full justify-center"
                onClick={handleAccept}
                loading={isAccepting}
              >
                参加する
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() => router.push("/")}
              >
                キャンセル
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
