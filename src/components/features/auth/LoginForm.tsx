"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl">👋</div>
        <h1 className="text-xl font-bold text-gray-900">Waveyにログイン</h1>
        <p className="mt-1 text-sm text-gray-500">Googleアカウントでログインしてください</p>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        loading={isLoading}
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Googleでログイン
      </Button>

      <p className="text-center text-xs text-gray-500">
        ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
      </p>
    </div>
  );
}
