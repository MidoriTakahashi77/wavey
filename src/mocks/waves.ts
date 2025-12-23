import type { Wave } from "@/types";

// フロントエンド用の拡張Wave型
export type WaveWithNames = Wave & {
  fromName: string;
  toName: string;
  gifUrl?: string;
};

export const MOCK_WAVES: Wave[] = [
  {
    id: "wave1",
    workspaceId: "1",
    fromUserId: "2",
    toUserId: "me",
    status: "accepted",
    createdAt: new Date(Date.now() - 5 * 60000),
    respondedAt: new Date(Date.now() - 4 * 60000),
  },
  {
    id: "wave2",
    workspaceId: "1",
    fromUserId: "me",
    toUserId: "3",
    status: "declined",
    createdAt: new Date(Date.now() - 30 * 60000),
    respondedAt: new Date(Date.now() - 29 * 60000),
  },
  {
    id: "wave3",
    workspaceId: "1",
    fromUserId: "4",
    toUserId: "me",
    status: "accepted",
    createdAt: new Date(Date.now() - 60 * 60000),
    respondedAt: new Date(Date.now() - 59 * 60000),
  },
  {
    id: "wave4",
    workspaceId: "1",
    fromUserId: "me",
    toUserId: "5",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 60000),
  },
];

export const MOCK_WAVES_WITH_NAMES: WaveWithNames[] = [
  { ...MOCK_WAVES[0], fromName: "田中", toName: "自分" },
  { ...MOCK_WAVES[1], fromName: "自分", toName: "佐藤" },
  { ...MOCK_WAVES[2], fromName: "鈴木", toName: "自分", gifUrl: "https://media.tenor.com/example.gif" },
  { ...MOCK_WAVES[3], fromName: "自分", toName: "高橋" },
];

export function getWavesByUserId(userId: string): WaveWithNames[] {
  return MOCK_WAVES_WITH_NAMES.filter(
    (wave) => wave.fromUserId === userId || wave.toUserId === userId
  );
}

export function getWavesByWorkspaceId(workspaceId: string): WaveWithNames[] {
  return MOCK_WAVES_WITH_NAMES.filter(
    (wave) => wave.workspaceId === workspaceId
  );
}
