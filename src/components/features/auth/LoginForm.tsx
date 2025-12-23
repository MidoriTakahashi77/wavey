"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { HiOutlineMail, HiCheckCircle } from "react-icons/hi";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // モック: 1秒待機
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <HiCheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">メールを送信しました</h2>
        <p className="mb-4 text-sm text-gray-600">
          <span className="font-medium">{email}</span> に
          <br />
          ログインリンクを送信しました。
        </p>
        <p className="text-xs text-gray-500">
          メールが届かない場合は、迷惑メールフォルダをご確認ください。
        </p>
        <button
          type="button"
          className="mt-6 text-sm text-blue-600 hover:text-blue-800"
          onClick={() => {
            setIsSubmitted(false);
            setEmail("");
          }}
        >
          別のメールアドレスで試す
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl">👋</div>
        <h1 className="text-xl font-bold text-gray-900">Waveyにログイン</h1>
        <p className="mt-1 text-sm text-gray-500">メールアドレスを入力してください</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="email"
            label="メールアドレス"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={!email || isSubmitting}
        >
          <HiOutlineMail className="mr-2 h-4 w-4" />
          ログインリンクを送信
        </Button>
      </div>

      <p className="text-center text-xs text-gray-500">
        パスワードは不要です。メールに届くリンクからログインできます。
      </p>
    </form>
  );
}
