"use client";

import { useState } from "react";
import { Button, Input, Card, Modal, Avatar, Badge, useToast } from "@/components/ui";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Wavey コンポーネントプレビュー</h1>

      {/* Button */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Button</h2>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">States</h3>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </div>
      </section>

      {/* Input */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Input</h2>

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
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Card</h2>

        <div className="flex flex-wrap gap-4">
          <Card className="w-64">
            <h3 className="font-bold text-gray-900">開発チーム</h3>
            <p className="mt-1 text-sm text-gray-500">3人のメンバー</p>
          </Card>

          <Card clickable className="w-64" onClick={() => alert("clicked!")}>
            <h3 className="font-bold text-gray-900">クリック可能</h3>
            <p className="mt-1 text-sm text-gray-500">クリックしてみてください</p>
          </Card>
        </div>
      </section>

      {/* Modal */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Modal</h2>

        <Button onClick={() => setModalOpen(true)}>モーダルを開く</Button>

        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="ワークスペースを作成"
          description="新しいワークスペースの名前を入力してください"
        >
          <div className="space-y-4">
            <Input label="ワークスペース名" placeholder="例: 開発チーム" />
            <div className="flex justify-end gap-2">
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
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Avatar</h2>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">Sizes</h3>
          <div className="flex items-end gap-4">
            <Avatar size="sm" />
            <Avatar size="md" />
            <Avatar size="lg" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">Status</h3>
          <div className="flex items-center gap-4">
            <Avatar status="online" />
            <Avatar status="busy" />
            <Avatar status="away" />
            <Avatar status="offline" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">With Name</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Avatar size="sm" status="online" />
              <span className="text-gray-900">田中太郎</span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar size="md" status="busy" />
              <div>
                <p className="font-medium text-gray-900">佐藤花子</p>
                <p className="text-sm text-gray-500">通話中</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badge */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Badge</h2>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">Variants</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm text-gray-500">Use Cases</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="success">入室中</Badge>
            <Badge variant="error">通話中</Badge>
            <Badge variant="warning">離席中</Badge>
            <Badge>オフライン</Badge>
          </div>
        </div>
      </section>

      {/* Toast */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Toast</h2>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => toast.success("成功", "操作が完了しました")}>
            Success
          </Button>
          <Button variant="secondary" onClick={() => toast.error("エラー", "問題が発生しました")}>
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info("お知らせ", "新しい更新があります")}
          >
            Info
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.wave("👋 Wave", "田中さんが手を振っています")}
          >
            Wave
          </Button>
        </div>
      </section>
    </div>
  );
}
