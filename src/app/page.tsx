"use client";

import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Wavey コンポーネントプレビュー
      </h1>

      {/* Button */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Button</h2>

        {/* Variants */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">Variants</h3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">Sizes</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* States */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">States</h3>
          <div className="flex gap-4 flex-wrap">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">Use Cases</h3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="md">
              入室する
            </Button>
            <Button variant="secondary" size="md">
              離席する
            </Button>
            <Button variant="ghost" size="sm">
              キャンセル
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
