import type { User } from "@/types";

// フロントエンド用の拡張Member型
export type MemberStatus = "online" | "busy" | "away" | "offline";

export type Member = {
  id: string;
  name: string;
  status: MemberStatus;
  statusEmoji?: string;
  roomId?: string;
  isOwner?: boolean;
  isMe?: boolean;
};

export const MOCK_CURRENT_USER: User = {
  id: "me",
  email: "me@example.com",
  displayName: "自分",
  skinUrl: "/skins/skin1.png",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  {
    id: "2",
    email: "tanaka@example.com",
    displayName: "田中",
    skinUrl: "/skins/skin2.png",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "3",
    email: "sato@example.com",
    displayName: "佐藤",
    skinUrl: "/skins/skin3.png",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    email: "suzuki@example.com",
    displayName: "鈴木",
    skinUrl: "/skins/skin1.png",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "5",
    email: "takahashi@example.com",
    displayName: "高橋",
    skinUrl: "/skins/skin2.png",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "6",
    email: "ito@example.com",
    displayName: "伊藤",
    skinUrl: "/skins/skin3.png",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "7",
    email: "watanabe@example.com",
    displayName: "渡辺",
    skinUrl: "/skins/skin1.png",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

export const MOCK_MEMBERS: Member[] = [
  {
    id: "me",
    name: "自分",
    status: "online",
    statusEmoji: "💻",
    roomId: "room1",
    isOwner: true,
    isMe: true,
  },
  { id: "2", name: "田中", status: "online", statusEmoji: "👍", roomId: "room1" },
  { id: "3", name: "佐藤", status: "busy", statusEmoji: "📞", roomId: "room2" },
  { id: "4", name: "鈴木", status: "online", statusEmoji: "😊", roomId: "room2" },
  { id: "5", name: "高橋", status: "away", statusEmoji: "🍵", roomId: "room3" },
  { id: "6", name: "伊藤", status: "online", roomId: "room3" },
  { id: "7", name: "渡辺", status: "online", statusEmoji: "🎨", roomId: "room3" },
];

export function getMembersByRoomId(roomId: string): Member[] {
  return MOCK_MEMBERS.filter((member) => member.roomId === roomId);
}

export function getMemberById(id: string): Member | undefined {
  return MOCK_MEMBERS.find((member) => member.id === id);
}
