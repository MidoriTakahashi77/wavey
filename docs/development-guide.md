# Wavey 開発ガイド

## 目次

- [環境構築](#環境構築)
- [コマンド一覧](#コマンド一覧)
- [コミットルール](#コミットルール)
- [ディレクトリ構成](#ディレクトリ構成)
- [認可（Authorization）](#認可authorization)
- [API エンドポイント](#api-エンドポイント)
- [コーディング規約](#コーディング規約)
- [テスト](#テスト)

---

## 環境構築

### 必要なツール

- Node.js 20+
- pnpm 10.12.1+

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# Git hooks のセットアップ（初回のみ）
pnpm exec husky

# 開発サーバー起動
pnpm dev

# ブラウザで確認
open http://localhost:3000
```

### 開発サーバー

| URL                            | 説明           |
| ------------------------------ | -------------- |
| http://localhost:3000          | フロントエンド |
| http://localhost:3000/api      | API            |
| http://localhost:3000/api/docs | Swagger UI     |

---

## コマンド一覧

| コマンド            | 説明                       |
| ------------------- | -------------------------- |
| `pnpm dev`          | 開発サーバー起動           |
| `pnpm build`        | プロダクションビルド       |
| `pnpm start`        | プロダクションサーバー起動 |
| `pnpm lint`         | ESLint実行                 |
| `pnpm lint:fix`     | ESLint自動修正             |
| `pnpm format`       | Prettierで全ファイル整形   |
| `pnpm format:check` | フォーマットチェック       |
| `pnpm test`         | E2Eテスト実行              |
| `pnpm test:ui`      | E2Eテスト（UIモード）      |
| `pnpm test:headed`  | E2Eテスト（ブラウザ表示）  |

### データベース（Drizzle ORM）

| コマンド           | 説明                         |
| ------------------ | ---------------------------- |
| `pnpm db:generate` | マイグレーション生成         |
| `pnpm db:migrate`  | マイグレーション実行         |
| `pnpm db:push`     | スキーマを直接反映（開発用） |
| `pnpm db:ui`       | Drizzle Studio（GUI）        |

#### 開発時の使い分け

```bash
# 開発中: スキーマ変更を素早く反映（マイグレーション不要）
pnpm db:push

# 本番前: マイグレーションファイルを生成
pnpm db:generate

# 本番: マイグレーションを実行
pnpm db:migrate

# DBの中身を確認・編集
pnpm db:ui
```

> **Note:** `db:push` は開発用です。本番環境では必ず `db:generate` → `db:migrate` を使用してください。

### コミット時の自動フォーマット

Husky + lint-staged により、`git commit` 時にステージされたファイルが自動整形されます。

| ファイル            | 実行されるコマンド                  |
| ------------------- | ----------------------------------- |
| `*.{js,jsx,ts,tsx}` | `eslint --fix` + `prettier --write` |
| `*.{json,md,css}`   | `prettier --write`                  |

> **Note:** 初回は `pnpm exec husky` で Git hooks をセットアップしてください。

---

## コミットルール

### フォーマット

```
<emoji> <type>: <subject>

<body>
```

### 絵文字一覧（gitmoji）

| 絵文字 | コード                    | type     | 説明                   |
| ------ | ------------------------- | -------- | ---------------------- |
| ✨     | `:sparkles:`              | feat     | 新機能                 |
| 🐛     | `:bug:`                   | fix      | バグ修正               |
| 📝     | `:memo:`                  | docs     | ドキュメント           |
| 💄     | `:lipstick:`              | style    | UI/スタイル変更        |
| ♻️     | `:recycle:`               | refactor | リファクタリング       |
| ✅     | `:white_check_mark:`      | test     | テスト追加・修正       |
| ⚙️     | `:gear:`                  | chore    | 設定・ツール変更       |
| 📦     | `:package:`               | build    | ビルド・依存関係       |
| 🔥     | `:fire:`                  | remove   | コード・ファイル削除   |
| 🚀     | `:rocket:`                | perf     | パフォーマンス改善     |
| 🔒     | `:lock:`                  | security | セキュリティ修正       |
| 🎨     | `:art:`                   | art      | コード構造改善         |
| 🚧     | `:construction:`          | wip      | 作業中                 |
| ⬆️     | `:arrow_up:`              | deps     | 依存関係アップグレード |
| 🔧     | `:wrench:`                | config   | 設定ファイル変更       |
| 🌐     | `:globe_with_meridians:`  | i18n     | 国際化                 |
| ♿     | `:wheelchair:`            | a11y     | アクセシビリティ       |
| 🗃️     | `:card_file_box:`         | db       | データベース関連       |
| 🏗️     | `:building_construction:` | arch     | アーキテクチャ変更     |

### コミット例

```bash
# 新機能
✨ feat: add wave notification component

# バグ修正
🐛 fix: resolve timer not stopping on call end

# テスト追加
✅ test: add E2E tests for auth flow

# リファクタリング
♻️ refactor: extract call controls into separate component

# 設定変更
⚙️ chore: switch from npm to pnpm

# ドキュメント
📝 docs: add development guide

# 複数の変更
⚙️ chore: switch to pnpm and add E2E tests

- Add .tool-versions for pnpm 10.12.1
- Add E2E tests (auth-flow, wave-flow, workspace-flow)
- Add mock data (users, workspaces, waves)
```

### type一覧（Conventional Commits）

| type       | 説明                                                 |
| ---------- | ---------------------------------------------------- |
| `feat`     | 新機能                                               |
| `fix`      | バグ修正                                             |
| `docs`     | ドキュメントのみの変更                               |
| `style`    | コードの意味に影響しない変更（空白、フォーマット等） |
| `refactor` | バグ修正でも機能追加でもないコード変更               |
| `perf`     | パフォーマンス改善                                   |
| `test`     | テストの追加・修正                                   |
| `chore`    | ビルドプロセスや補助ツールの変更                     |
| `build`    | ビルドシステムや外部依存関係の変更                   |
| `ci`       | CI設定ファイルの変更                                 |

---

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ダッシュボード
│   ├── login/              # ログインページ
│   ├── profile/setup/      # プロフィール設定
│   └── workspaces/[id]/    # ワークスペース
│       └── settings/       # 設定ページ
├── components/
│   ├── ui/                 # 汎用UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/             # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   └── UserMenu.tsx
│   └── features/           # 機能別コンポーネント
│       ├── auth/           # 認証関連
│       ├── profile/        # プロフィール
│       ├── workspace/      # ワークスペース
│       ├── office/         # バーチャルオフィス
│       ├── wave/           # Wave機能
│       ├── call/           # 通話機能
│       └── settings/       # 設定
├── hooks/                  # カスタムフック
├── types/                  # 型定義
├── mocks/                  # モックデータ
└── lib/                    # ユーティリティ
```

---

## 認可（Authorization）

### 概要

Wavey では [CASL](https://casl.js.org/) を使用して認可（Authorization）を管理しています。

- **認証（Authentication）**: ユーザーが誰であるかを確認する（ログイン）
- **認可（Authorization）**: ユーザーが何をできるかを確認する（権限）

### ファイル構成

```
server/src/
├── lib/
│   └── abilities.ts              # CASL 権限定義
└── services/
    └── authorization/
        └── authorization-service.ts  # 認可サービス
```

### 権限ルール

| ロール | Workspace        | Member                   | Invite | Wave                             |
| ------ | ---------------- | ------------------------ | ------ | -------------------------------- |
| Owner  | manage（全操作） | manage                   | manage | create/read/update（自分のWave） |
| Member | read             | read, delete（自分のみ） | -      | create/read/update（自分のWave） |

### 使用方法

認可チェックは**ルート（Route）**で行います。サービス層はビジネスロジックのみを担当します。

#### ルートでの認可チェック

```typescript
import { authorizationService } from "../../services/authorization/authorization-service";

// DELETE /api/workspaces/:id
app.delete("/workspaces/:id", async (c) => {
  const userId = c.get("userId");
  const workspaceId = c.req.param("id");

  // 認可チェック（ルートで実行）
  const authResult = await authorizationService.requireWorkspaceOwner(workspaceId, userId);
  if (authResult.isFailure) {
    return c.json({ error: authResult.error.message }, 403);
  }

  // サービス呼び出し（ビジネスロジックのみ）
  await workspaceService.deleteWorkspace(workspaceId);
  return c.json({ success: true });
});
```

#### Ability の直接使用

```typescript
import { authorizationService } from "../../services/authorization/authorization-service";
import { subjects } from "../../lib/abilities";

// より細かい権限チェックが必要な場合
const ability = await authorizationService.buildAbility(userId, workspaceId);

if (ability.can("manage", subjects.workspace({ id: workspaceId, ownerId: "..." }))) {
  // オーナー権限あり
}

if (ability.can("read", subjects.wave({ fromUserId: userId, toUserId: "..." }))) {
  // Wave 読み取り権限あり
}
```

### authorizationService API

| メソッド                                                         | 説明                   | 戻り値                              |
| ---------------------------------------------------------------- | ---------------------- | ----------------------------------- |
| `buildAbility(userId, workspaceId?)`                             | CASL Ability を構築    | `AppAbility`                        |
| `requireWorkspaceOwner(workspaceId, userId)`                     | オーナー権限を要求     | `Result<WorkspaceRecord, AppError>` |
| `requireWorkspaceMember(workspaceId, userId)`                    | メンバー権限を要求     | `Result<void, AppError>`            |
| `requireInviteManager(workspaceId, userId)`                      | 招待管理権限を要求     | `Result<void, AppError>`            |
| `requireCanRemoveMember(workspaceId, requesterId, targetUserId)` | メンバー削除権限を要求 | `Result<WorkspaceRecord, AppError>` |
| `isWorkspaceOwner(workspaceId, userId)`                          | オーナーかどうか       | `boolean`                           |
| `isWorkspaceMember(workspaceId, userId)`                         | メンバーかどうか       | `boolean`                           |

### エラーコード

| コード                 | 説明                   |
| ---------------------- | ---------------------- |
| `NOT_FOUND`            | リソースが存在しない   |
| `UNAUTHORIZED`         | 認証が必要             |
| `FORBIDDEN`            | 操作が許可されていない |
| `NOT_WORKSPACE_OWNER`  | オーナー権限が必要     |
| `NOT_WORKSPACE_MEMBER` | メンバー権限が必要     |

---

## API エンドポイント

### 認証

すべてのエンドポイント（System 除く）は Bearer トークンによる認証が必要です。

```
Authorization: Bearer <JWT_TOKEN>
```

### System

| メソッド | パス      | 説明           | 認可 |
| -------- | --------- | -------------- | ---- |
| GET      | `/`       | API 情報       | なし |
| GET      | `/health` | ヘルスチェック | なし |

### Profile

| メソッド | パス       | 説明             | 認可     |
| -------- | ---------- | ---------------- | -------- |
| GET      | `/profile` | プロフィール取得 | 認証済み |
| PUT      | `/profile` | プロフィール更新 | 認証済み |

### Workspace

| メソッド | パス                                         | 説明         | 認可                     |
| -------- | -------------------------------------------- | ------------ | ------------------------ |
| GET      | `/workspaces`                                | 一覧取得     | 認証済み                 |
| POST     | `/workspaces`                                | 作成         | 認証済み                 |
| GET      | `/workspaces/{workspaceId}`                  | 詳細取得     | `requireWorkspaceMember` |
| DELETE   | `/workspaces/{workspaceId}`                  | 削除         | `requireWorkspaceOwner`  |
| POST     | `/workspaces/{workspaceId}/transfer`         | オーナー譲渡 | `requireWorkspaceOwner`  |
| DELETE   | `/workspaces/{workspaceId}/members/{userId}` | メンバー削除 | `requireCanRemoveMember` |

### Invite

| メソッド | パス                                | 説明         | 認可                    |
| -------- | ----------------------------------- | ------------ | ----------------------- |
| POST     | `/workspaces/{workspaceId}/invites` | 招待作成     | `requireWorkspaceOwner` |
| GET      | `/workspaces/{workspaceId}/invites` | 招待一覧     | `requireWorkspaceOwner` |
| POST     | `/invites/{code}/accept`            | 招待受け入れ | 認証済み                |
| DELETE   | `/invites/{id}`                     | 招待削除     | `requireWorkspaceOwner` |

### Wave

| メソッド | パス          | 説明      | 認可                        |
| -------- | ------------- | --------- | --------------------------- |
| POST     | `/waves`      | Wave 送信 | `requireWorkspaceMember`    |
| GET      | `/waves`      | Wave 履歴 | `requireWorkspaceMember`    |
| GET      | `/waves/{id}` | Wave 詳細 | Wave 送信者または受信者のみ |
| PUT      | `/waves/{id}` | Wave 応答 | Wave 受信者のみ             |

---

## コーディング規約

### コンポーネント

```tsx
// ファイル名: PascalCase.tsx
// コンポーネント名: PascalCase

"use client"; // クライアントコンポーネントの場合

import { useState } from "react";

type Props = {
  title: string;
  onAction?: () => void;
};

export function MyComponent({ title, onAction }: Props) {
  const [state, setState] = useState(false);

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}
```

### 命名規則

| 対象           | 規則                   | 例               |
| -------------- | ---------------------- | ---------------- |
| コンポーネント | PascalCase             | `WaveButton.tsx` |
| フック         | camelCase + use        | `useCall.ts`     |
| 型             | PascalCase             | `CallState`      |
| 定数           | SCREAMING_SNAKE_CASE   | `MOCK_USERS`     |
| 関数           | camelCase              | `handleClick`    |
| CSS クラス     | kebab-case（Tailwind） | `bg-gray-100`    |

### インポート順序

```tsx
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. 外部ライブラリ
import { HiPhone } from "react-icons/hi";

// 3. 内部コンポーネント（絶対パス）
import { Button, Modal } from "@/components/ui";
import { useCall } from "@/hooks/useCall";

// 4. 型
import type { CallState } from "@/types";
```

---

## テスト

### E2Eテスト（Playwright）

```bash
# 全テスト実行
pnpm test

# UIモード（デバッグに便利）
pnpm test:ui

# ブラウザ表示して実行
pnpm test:headed

# 特定のテストファイル
pnpm test auth-flow

# 特定のテスト名
pnpm test -- -g "ログイン画面が表示される"
```

### テストファイル構成

```
tests/
└── e2e/
    ├── auth-flow.spec.ts       # 認証フロー
    ├── wave-flow.spec.ts       # Waveフロー
    └── workspace-flow.spec.ts  # ワークスペース管理
```

### テスト記述例

```typescript
import { test, expect } from "@playwright/test";

test.describe("機能名", () => {
  test("テスト内容", async ({ page }) => {
    await page.goto("/path");

    // 要素の確認
    await expect(page.getByRole("heading", { name: "タイトル" })).toBeVisible();

    // クリック
    await page.getByRole("button", { name: "ボタン" }).click();

    // 入力
    await page.getByLabel("ラベル").fill("テキスト");
  });
});
```

### ロケーター優先順位

1. `getByRole` - アクセシビリティロール
2. `getByLabel` - ラベルテキスト
3. `getByText` - 表示テキスト（`{ exact: true }` で完全一致）
4. `getByTestId` - data-testid属性
5. `locator` - CSSセレクタ（最終手段）

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Base UI](https://base-ui.com/)
- [Playwright](https://playwright.dev/docs/intro)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [gitmoji](https://gitmoji.dev/)
