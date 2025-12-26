"use client";

import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { Card } from "@/components/ui";
import { useRequireAuth } from "@/hooks/useAuth";

export default function ProfileSetupPage() {
  const { isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6">
        <ProfileForm />
      </Card>
    </div>
  );
}
