# Wavey サーバサイド設計

## 技術スタック

| 区分           | 技術                            |
| -------------- | ------------------------------- |
| フレームワーク | Hono                            |
| API仕様        | OpenAPI 3.1 (@hono/zod-openapi) |
| バリデーション | Zod                             |
| ORM            | Drizzle                         |
| DB             | Supabase Postgres               |
| 認証           | Supabase Auth (Google OAuth)    |
| Realtime       | Supabase Realtime               |

---

## アーキテクチャ概要

Repository パターンを採用した3層構造

```
┌─────────────────────────────────────────────────────────────┐
│                      Routes Layer                           │
│  (HTTP処理, Zodバリデーション, OpenAPI定義)                   │
├─────────────────────────────────────────────────────────────┤
│                     Services Layer                          │
│  (ビジネスロジック, トランザクション管理)                      │
├─────────────────────────────────────────────────────────────┤
│                   Repositories Layer                        │
│  (データアクセス抽象化, Drizzle実装)                          │
└─────────────────────────────────────────────────────────────┘
```

**依存関係**: Routes → Services → Repositories（単方向）

---

## ディレクトリ構造

```
server/
├── src/
│   ├── routes/                    # ルート層（HTTP）
│   │   ├── index.ts               # ルート統合
│   │   ├── profile.ts
│   │   ├── workspace.ts
│   │   ├── invite.ts
│   │   └── wave.ts
│   │
│   ├── services/                  # サービス層（ビジネスロジック）
│   │   ├── workspace.ts
│   │   ├── invite.ts
│   │   └── wave.ts
│   │
│   ├── repositories/              # リポジトリ層（データアクセス）
│   │   ├── types.ts               # Repository インターフェース
│   │   ├── user-repository.ts
│   │   ├── workspace-repository.ts
│   │   ├── workspace-user-repository.ts
│   │   ├── invite-repository.ts
│   │   └── wave-repository.ts
│   │
│   ├── db/                        # データベース
│   │   ├── schema.ts              # Drizzle スキーマ
│   │   ├── client.ts              # DB クライアント
│   │   └── migrations/
│   │
│   ├── schemas/                   # Zod + OpenAPI スキーマ
│   │   ├── common.ts              # 共通（Error, Pagination）
│   │   ├── profile.ts
│   │   ├── workspace.ts
│   │   ├── invite.ts
│   │   └── wave.ts
│   │
│   ├── middleware/                # ミドルウェア
│   │   ├── auth.ts                # 認証
│   │   └── error-handler.ts       # エラーハンドリング
│   │
│   ├── lib/                       # 共有ユーティリティ
│   │   ├── result.ts              # Result型
│   │   ├── errors.ts              # エラー定義
│   │   ├── constants.ts           # 定数（制限値など）
│   │   └── supabase.ts            # Supabase クライアント
│   │
│   └── index.ts                   # エントリポイント
│
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## 型定義

Zod スキーマから型を導出し、Single Source of Truth を維持する。

### エンティティ型

```typescript
// schemas/workspace.ts
import { z } from "@hono/zod-openapi";

// 共通型
export const MemberRole = z.enum(["owner", "member"]);
export const WaveStatus = z.enum(["pending", "accepted", "declined", "expired"]);

// Workspace
export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

// Workspace（メンバー付き）
export const WorkspaceWithMembersSchema = WorkspaceSchema.extend({
  members: z.array(WorkspaceUserSchema),
});
export type WorkspaceWithMembers = z.infer<typeof WorkspaceWithMembersSchema>;

// User
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1).max(20),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// WorkspaceUser（中間テーブル）
export const WorkspaceUserSchema = z.object({
  workspaceId: z.string().uuid(),
  userId: z.string().uuid(),
  role: MemberRole,
  joinedAt: z.string().datetime(),
});
export type WorkspaceUser = z.infer<typeof WorkspaceUserSchema>;

// Invite
export const InviteSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  code: z.string(),
  expiresAt: z.string().datetime(),
  maxUses: z.number().nullable(),
  usedCount: z.number(),
  createdAt: z.string().datetime(),
});
export type Invite = z.infer<typeof InviteSchema>;

// Wave
export const WaveSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid(),
  status: WaveStatus,
  createdAt: z.string().datetime(),
  respondedAt: z.string().datetime().nullable(),
});
export type Wave = z.infer<typeof WaveSchema>;
```

---

## 定数（ビジネスルール）

```typescript
// lib/constants.ts
export const LIMITS = {
  MAX_MEMBERS_PER_WORKSPACE: 5,
  INVITE_EXPIRES_DAYS: 7,
  DISPLAY_NAME_MAX_LENGTH: 20,
  WORKSPACE_NAME_MAX_LENGTH: 50,
  WAVE_HISTORY_LIMIT: 50,
} as const;
```

### ワークスペースの仕様

- ユーザーは複数のワークスペースを**所有（作成）**できる
- ユーザーは複数のワークスペースに**メンバーとして参加**できる
- 各ワークスペースのメンバー上限は5名
- 所有数の制限はプラン機能で後から実装予定

---

## リポジトリ

### インターフェース定義

```typescript
// repositories/types.ts
import type { User, Workspace, WorkspaceUser, Invite, Wave } from "@/schemas";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  countWorkspaces(userId: string): Promise<number>;
}

export interface WorkspaceRepository {
  findById(id: string): Promise<Workspace | null>;
  findByUserId(userId: string): Promise<Workspace[]>;
  findWithMembers(id: string): Promise<WorkspaceWithMembers | null>;
  create(data: CreateWorkspaceData): Promise<Workspace>;
  delete(id: string): Promise<void>;
  updateOwner(id: string, newOwnerId: string): Promise<void>;
}

export interface WorkspaceUserRepository {
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceUser[]>;
  add(data: AddWorkspaceUserData): Promise<WorkspaceUser>;
  remove(workspaceId: string, userId: string): Promise<void>;
  updateRole(workspaceId: string, userId: string, role: MemberRole): Promise<void>;
  countByWorkspaceId(workspaceId: string): Promise<number>;
}

export interface InviteRepository {
  findByCode(code: string): Promise<Invite | null>;
  create(data: CreateInviteData): Promise<Invite>;
  incrementUsedCount(id: string): Promise<void>;
}

export interface WaveRepository {
  findById(id: string): Promise<Wave | null>;
  findByWorkspaceId(workspaceId: string, limit?: number): Promise<Wave[]>;
  create(data: CreateWaveData): Promise<Wave>;
  updateStatus(id: string, status: WaveStatus): Promise<void>;
}
```

### 実装例

```typescript
// repositories/workspace-repository.ts
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { workspaces, workspaceUsers } from "@/db/schema";
import type { WorkspaceRepository } from "./types";

export const workspaceRepository: WorkspaceRepository = {
  async findById(id) {
    return db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });
  },

  async findByUserId(userId) {
    const members = await db.query.workspaceUsers.findMany({
      where: eq(workspaceUsers.userId, userId),
      with: { workspace: true },
    });
    return members.map((m) => m.workspace);
  },

  async findWithMembers(id) {
    return db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
      with: { members: { with: { user: true } } },
    });
  },

  async create(data) {
    const [workspace] = await db.insert(workspaces).values(data).returning();
    return workspace;
  },

  async delete(id) {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  },

  async updateOwner(id, newOwnerId) {
    await db.update(workspaces).set({ ownerId: newOwnerId }).where(eq(workspaces.id, id));
  },
};
```

---

## サービス層

ビジネスロジックを集約。Repository を使用してデータアクセス。

```typescript
// services/workspace.ts
import { workspaceRepository, workspaceUserRepository } from "@/repositories";
import { ok, type Result } from "@/lib/result";
import { AppError } from "@/lib/errors";

export async function createWorkspace(
  userId: string,
  input: { name: string }
): Promise<Result<Workspace, AppError>> {
  // TODO: プラン機能実装時に所有数チェック追加
  // const owned = await workspaceRepository.findByOwnerId(userId);
  // const limit = getPlanLimit(user.plan);
  // if (owned.length >= limit) { ... }

  // トランザクションで作成
  const workspace = await db.transaction(async (tx) => {
    const ws = await workspaceRepository.create({ name: input.name, ownerId: userId });
    await workspaceUserRepository.add({ workspaceId: ws.id, userId, role: "owner" });
    return ws;
  });

  return ok(workspace);
}

export async function transferOwnership(
  workspaceId: string,
  currentOwnerId: string,
  newOwnerId: string
): Promise<Result<void, AppError>> {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    return err(new AppError("NOT_FOUND", "ワークスペースが見つかりません"));
  }
  if (workspace.ownerId !== currentOwnerId) {
    return err(new AppError("FORBIDDEN", "オーナーのみ譲渡できます"));
  }

  await db.transaction(async (tx) => {
    await workspaceRepository.updateOwner(workspaceId, newOwnerId);
    await workspaceUserRepository.updateRole(workspaceId, currentOwnerId, "member");
    await workspaceUserRepository.updateRole(workspaceId, newOwnerId, "owner");
  });

  return ok(undefined);
}
```

---

## API エンドポイント

| Method | Path                            | 説明               | UseCase           |
| ------ | ------------------------------- | ------------------ | ----------------- |
| GET    | /profile                        | プロフィール取得   | GetProfile        |
| PUT    | /profile                        | プロフィール更新   | UpdateProfile     |
| POST   | /workspaces                     | ワークスペース作成 | CreateWorkspace   |
| GET    | /workspaces                     | 一覧取得           | GetWorkspaces     |
| GET    | /workspaces/:id                 | 詳細取得           | GetWorkspace      |
| DELETE | /workspaces/:id                 | 削除               | DeleteWorkspace   |
| POST   | /workspaces/:id/transfer        | owner譲渡          | TransferOwnership |
| DELETE | /workspaces/:id/members/:userId | メンバー削除       | RemoveMember      |
| POST   | /workspaces/:id/invites         | 招待作成           | CreateInvite      |
| POST   | /invites/:code/accept           | 招待参加           | AcceptInvite      |
| POST   | /waves                          | wave送信           | SendWave          |
| GET    | /waves                          | 履歴取得           | GetWaveHistory    |
| PUT    | /waves/:id                      | 応答               | RespondWave       |

---

## OpenAPI 仕様

`@hono/zod-openapi` を使用し、Zodスキーマから OpenAPI 3.1 仕様を自動生成する。

### メリット

- **Single Source of Truth**: Zodスキーマ1つでバリデーション + OpenAPI定義 + 型推論
- **自動ドキュメント生成**: Swagger UI / Scalar で確認可能
- **型安全**: リクエスト/レスポンスが完全に型付け

### エンドポイント

| Path          | 説明                 |
| ------------- | -------------------- |
| /openapi.json | OpenAPI仕様（JSON）  |
| /docs         | Swagger UI           |
| /scalar       | Scalar（モダンなUI） |

### ルート定義例

```typescript
// interface/http/routes/workspace-routes.ts
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

// リクエストスキーマ
const CreateWorkspaceRequestSchema = z
  .object({
    name: z.string().min(1).max(50),
  })
  .openapi("CreateWorkspaceRequest");

// レスポンススキーマ
const WorkspaceSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    ownerId: z.string().uuid(),
    createdAt: z.string().datetime(),
  })
  .openapi("Workspace");

// エラースキーマ
const ErrorSchema = z
  .object({
    code: z.string(),
    message: z.string(),
  })
  .openapi("Error");

// ルート定義
const createWorkspaceRoute = createRoute({
  method: "post",
  path: "/workspaces",
  tags: ["Workspace"],
  summary: "ワークスペース作成",
  description: "新しいワークスペースを作成し、作成者をオーナーとして登録する",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateWorkspaceRequestSchema },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "作成成功",
      content: {
        "application/json": { schema: WorkspaceSchema },
      },
    },
    400: {
      description: "バリデーションエラー",
      content: {
        "application/json": { schema: ErrorSchema },
      },
    },
    409: {
      description: "既にワークスペースに参加している",
      content: {
        "application/json": { schema: ErrorSchema },
      },
    },
  },
});

// ルート登録
export function workspaceRoutes(app: OpenAPIHono) {
  app.openapi(createWorkspaceRoute, async (c) => {
    const body = c.req.valid("json"); // 型安全: { name: string }
    // UseCase実行...
    return c.json(workspace, 201);
  });
}
```

### アプリケーション設定

```typescript
// index.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono();

// ルート登録
workspaceRoutes(app);
profileRoutes(app);
waveRoutes(app);
inviteRoutes(app);

// OpenAPI仕様
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "Wavey API",
    version: "1.0.0",
    description: "Wavey - 軽量コミュニケーションアプリ API",
  },
  servers: [
    { url: "http://localhost:3001", description: "開発環境" },
    { url: "https://api.wavey.app", description: "本番環境" },
  ],
});

// Swagger UI
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

export default app;
```

### ディレクトリ構造（更新）

```
interface/
├── http/
│   ├── routes/
│   │   └── workspace-routes.ts   # createRoute + openapi()
│   └── schemas/                  # OpenAPIスキーマ定義
│       ├── common.ts             # ErrorSchema, PaginationSchema
│       ├── workspace.ts          # WorkspaceSchema, CreateWorkspaceRequestSchema
│       ├── profile.ts
│       ├── wave.ts
│       └── invite.ts
```

---

## エラーハンドリング

### Result型

```typescript
type Result<T, E> = Success<T> | Failure<E>;

class Success<T> {
  readonly isSuccess = true;
  constructor(readonly value: T) {}
}

class Failure<E> {
  readonly isSuccess = false;
  constructor(readonly error: E) {}
}
```

### ドメインエラー

```typescript
abstract class DomainError extends Error {
  abstract readonly code: string;
}

class WorkspaceLimitExceededError extends DomainError {
  readonly code = "WORKSPACE_LIMIT_EXCEEDED";
}

class MemberLimitExceededError extends DomainError {
  readonly code = "MEMBER_LIMIT_EXCEEDED";
}

class InviteExpiredError extends DomainError {
  readonly code = "INVITE_EXPIRED";
}

class NotOwnerError extends DomainError {
  readonly code = "NOT_OWNER";
}

class AlreadyMemberError extends DomainError {
  readonly code = "ALREADY_MEMBER";
}
```

---

## Drizzle スキーマ

```typescript
// schema.ts
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").unique().notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workspaceUsers = pgTable(
  "workspace_users",
  {
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    role: text("role", { enum: ["owner", "member"] }).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
  })
);

export const workspaceInvites = pgTable("workspace_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id)
    .notNull(),
  code: text("code").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waves = pgTable("waves", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id)
    .notNull(),
  fromUserId: uuid("from_user_id")
    .references(() => users.id)
    .notNull(),
  toUserId: uuid("to_user_id")
    .references(() => users.id)
    .notNull(),
  status: text("status", { enum: ["pending", "accepted", "declined", "expired"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
});
```

---

## 設計原則

| 原則                      | 適用箇所                                                                |
| ------------------------- | ----------------------------------------------------------------------- |
| **Single Responsibility** | Routes=HTTP処理, Services=ビジネスロジック, Repositories=データアクセス |
| **Dependency Inversion**  | Services は Repository Interface に依存（実装に依存しない）             |
| **Interface Segregation** | 小さなインターフェース（UserRepository, WorkspaceRepository等）         |

---

## 次のステップ

1. サーバプロジェクト初期化（Hono + Drizzle + Zod OpenAPI）
2. DB スキーマ実装（Drizzle）
3. Repository 実装
4. Services 実装
5. Routes 実装（OpenAPI）
6. Supabase Auth 連携
7. Supabase Realtime 連携
