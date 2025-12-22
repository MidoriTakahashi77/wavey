"use client";

import { useState } from "react";
import { Button, Input, Card, Modal, Avatar } from "@/components/ui";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

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

      {/* Modal */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Modal</h2>

        <Button onClick={() => setModalOpen(true)}>モーダルを開く</Button>

        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="ワークスペースを作成"
          description="新しいワークスペースの名前を入力してください"
        >
          <div className="space-y-4">
            <Input label="ワークスペース名" placeholder="例: 開発チーム" />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={() => setModalOpen(false)}>作成</Button>
            </div>
          </div>
        </Modal>
      </section>

      {/* Avatar */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Avatar</h2>

        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">Sizes</h3>
          <div className="flex gap-4 items-end">
            <Avatar size="sm" />
            <Avatar size="md" />
            <Avatar size="lg" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">Status</h3>
          <div className="flex gap-4 items-center">
            <Avatar status="online" />
            <Avatar status="busy" />
            <Avatar status="away" />
            <Avatar status="offline" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">With Name</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Avatar size="sm" status="online" />
              <span className="text-gray-900">田中太郎</span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar size="md" status="busy" />
              <div>
                <p className="text-gray-900 font-medium">佐藤花子</p>
                <p className="text-gray-500 text-sm">通話中</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
