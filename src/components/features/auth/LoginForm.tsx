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
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiCheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          メールを送信しました
        </h2>
        <p className="text-sm text-gray-600 mb-4">
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
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">👋</div>
        <h1 className="text-xl font-bold text-gray-900">Waveyにログイン</h1>
        <p className="text-sm text-gray-500 mt-1">
          メールアドレスを入力してください
        </p>
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
          <HiOutlineMail className="w-4 h-4 mr-2" />
          ログインリンクを送信
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        パスワードは不要です。メールに届くリンクからログインできます。
      </p>
    </form>
  );
}
