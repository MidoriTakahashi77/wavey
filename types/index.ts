/**
 * Wavey 型定義
 * spec.md セクション14.2「設計指針」に準拠
 * 将来拡張を見据えたデータ駆動設計
 */

// ============================================
// User / Profile
// ============================================

export type User = {
  id: string;
  email: string;
  displayName: string;
  skinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * ユーザーステータス（拡張可能）
 * enumではなくstringで将来の拡張に対応
 */
export type UserStatus = {
  type: string; // "available" | "focusing" | "away" | ...拡張可能
  message?: string; // 一言ステータス
  emoji?: string; // カスタム絵文字
  expiresAt?: Date; // 自動解除
};

// ============================================
// Workspace
// ============================================

export type Workspace = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
};

export type WorkspaceMember = {
  workspaceId: string;
  userId: string;
  role: "owner" | "member";
  joinedAt: Date;
};

export type WorkspaceInvite = {
  id: string;
  workspaceId: string;
  expiresAt: Date;
  maxUses?: number;
  usedCount: number;
  createdAt: Date;
};

/**
 * 部屋カスタマイズ（将来拡張用）
 */
export type RoomTheme = {
  backgroundUrl?: string; // ピクセルアート背景
  ambientSound?: string; // 環境音
  colorScheme?: string; // カラーテーマ
};

// ============================================
// Wave
// ============================================

export type WaveStatus = "pending" | "accepted" | "declined" | "expired";

export type Wave = {
  id: string;
  workspaceId: string;
  fromUserId: string;
  toUserId: string;
  status: WaveStatus;
  createdAt: Date;
  respondedAt?: Date;
};

// ============================================
// Presence（リアルタイム）
// ============================================

export type PresenceState = {
  oderId: string;
  status: UserStatus;
  isInCall: boolean;
  joinedAt: Date;
};

// ============================================
// Broadcast Events（リアルタイム）
// ============================================

/**
 * Supabase Broadcast イベント（汎用設計）
 * 将来のイベントタイプ拡張に対応
 */
export type BroadcastEventType =
  | "wave"
  | "wave_response"
  | "call_offer"
  | "call_answer"
  | "call_ice_candidate"
  | "call_end"
  | "reaction" // 将来拡張: リアクション
  | "status_change" // 将来拡張: ステータス変更
  | "activity"; // 将来拡張: アクティビティ

export type BroadcastEvent<T = unknown> = {
  type: BroadcastEventType;
  payload: T;
  senderId: string;
  timestamp: Date;
};

// ============================================
// Call（WebRTC）
// ============================================

export type CallState = {
  callId: string;
  peerId: string;
  isMuted: boolean;
  startedAt: Date;
};
