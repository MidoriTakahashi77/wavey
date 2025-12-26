import type { Workspace } from "@/types";

// フロントエンド用のRoom型
export type RoomColor = "blue" | "green" | "yellow" | "pink" | "purple";

export type Room = {
  id: string;
  name: string;
  color: RoomColor;
  workspaceId: string;
};

export type WorkspaceWithMeta = Workspace & {
  memberCount: number;
  onlineCount: number;
};

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "1",
    name: "開発チーム",
    ownerId: "me",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "デザインチーム",
    ownerId: "3",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "マーケティング",
    ownerId: "5",
    createdAt: new Date("2024-03-01"),
  },
];

export const MOCK_WORKSPACES_WITH_META: WorkspaceWithMeta[] = [
  { ...MOCK_WORKSPACES[0], memberCount: 7, onlineCount: 5 },
  { ...MOCK_WORKSPACES[1], memberCount: 4, onlineCount: 2 },
  { ...MOCK_WORKSPACES[2], memberCount: 3, onlineCount: 1 },
];

export const MOCK_ROOMS: Room[] = [
  { id: "room1", name: "エンジニアリング", color: "blue", workspaceId: "1" },
  { id: "room2", name: "ミーティング", color: "green", workspaceId: "1" },
  { id: "room3", name: "デザイン", color: "yellow", workspaceId: "1" },
  { id: "room4", name: "UIデザイン", color: "pink", workspaceId: "2" },
  { id: "room5", name: "ブランディング", color: "purple", workspaceId: "2" },
];

export function getWorkspaceById(id: string): Workspace | undefined {
  return MOCK_WORKSPACES.find((ws) => ws.id === id);
}

export function getRoomsByWorkspaceId(workspaceId: string): Room[] {
  return MOCK_ROOMS.filter((room) => room.workspaceId === workspaceId);
}
