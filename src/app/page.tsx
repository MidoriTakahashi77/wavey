"use client";

import { Button, Input, Card } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Wavey コンポーネントプレビュー
      </h1>

      {/* Button */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Button</h2>

        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">Variants</h3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">Sizes</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">States</h3>
          <div className="flex gap-4 flex-wrap">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </div>
      </section>

      {/* Input */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Input</h2>

        <div className="mb-6 max-w-sm">
          <Input label="メールアドレス" type="email" placeholder="you@example.com" />
        </div>

        <div className="mb-6 max-w-sm">
          <Input
            label="ニックネーム"
            placeholder="表示名を入力"
            hint="他のメンバーに表示される名前です"
          />
        </div>

        <div className="mb-6 max-w-sm">
          <Input
            label="エラー例"
            type="email"
            defaultValue="invalid"
            error="有効なメールアドレスを入力してください"
          />
        </div>

        <div className="mb-6 max-w-sm">
          <Input label="無効" disabled defaultValue="編集不可" />
        </div>
      </section>

      {/* Card */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Card</h2>

        <div className="flex gap-4 flex-wrap">
          <Card className="w-64">
            <h3 className="text-gray-900 font-bold">開発チーム</h3>
            <p className="text-gray-500 text-sm mt-1">3人のメンバー</p>
          </Card>

          <Card clickable className="w-64" onClick={() => alert("clicked!")}>
            <h3 className="text-gray-900 font-bold">クリック可能</h3>
            <p className="text-gray-500 text-sm mt-1">クリックしてみてください</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
