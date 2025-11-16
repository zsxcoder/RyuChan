export type VideoType =
  | "raw"
  | "bilibili"
  | "bilibili-nano"
  | "youtube"
  | "douyin"
  | "douyin-wide"
  | "tiktok";

export type MusicServer = "netease" | "tencent" | "kuwo" | "kugou" | "xiami" | "baidu";
export type MusicType = "song" | "playlist" | "album" | "artist";

export interface MusicItem {
  server: MusicServer;
  type: MusicType;
  id: string;
}

export interface DiaryEntry {
  text?: string;
  date: string;
  images?: string[];
  tags?: string[];
  location?: string;
  /** 与 VideoEmbed 保持一致 */
  video?: {
    type: VideoType;
    id: string;
    ratio?: string | number;
    poster?: string;
  };
  /** 新增：音乐 */
  music?: MusicItem | MusicItem[];
  github?: string | string[];
}

/* ---------- 日记数据 ---------- */
export const diaryEntries: DiaryEntry[] = [
  {
    text: "今天完成了 mizuki 博客的内容分离，还听到一首超好听的歌~",
    date: "2025-11-16 21:12",
    github: ["https://github.com/mcyzsx/Mizuki", "https://github.com/mcyzsx/mizuki-content"],
    music: { server: "netease", type: "song", id: "1957502053" },
    tags: ["日常", "音乐"],
    location: "南京",
  },
  {
    text: "一次放两首，测试列表。",
    date: "2025-11-15 22:01",
    music: [
      { server: "netease", type: "song", id: "1957502053" },
      { server: "netease", type: "song", id: "1466975169" },
    ],
    tags: ["音乐"],
    location: "南京",
  },
  {
    text: "纯测试视频",
    date: "2025-11-15 18:32",
    video: { type: "bilibili", id: "BV1h5QaY5EaH" },
    tags: ["测试"],
    location: "南京",
  },
];

/* ---------- 工具函数 ---------- */
export function getRecentDiaryEntries(count = 30): DiaryEntry[] {
  return [...diaryEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
