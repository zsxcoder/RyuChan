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
  video?: {
    type: VideoType;
    id: string;
    ratio?: string | number;
    poster?: string;
  };
  music?: MusicItem | MusicItem[];
  github?: string | string[];
  /* 新增 */
  url?: string | string[];
}

/* ---------- 日记数据 ---------- */
export const diaryEntries: DiaryEntry[] = [
  {
    text: "今天部署了news和天气页面，感谢60S项目~",
    date: "2025-11-23 23:22",
    github: ["https://github.com/vikiboss/60s"],
    tags: ["日常"],
    location: "南京",
    url: ["https://boke.zsx815.top/weather", "https://boke.zsx815.top/news"],
  },
  {
    text: "今天部署了我的装备页面，日历和站点信息组件，参考mizuki项目~",
    date: "2025-11-22 23:17",
    github: ["https://github.com/matsuzaka-yuki/Mizuki"],
    tags: ["日常"],
    location: "南京",
    url: "https://boke.zsx815.top/device",
  },
  {
    text: "今天部署了音乐页面，勉勉强强吧，参考张洪大佬的HeoMusic~",
    date: "2025-11-21 23:50",
    github: ["https://github.com/zhheo/HeoMusict"],
    tags: ["日常"],
    location: "南京",
    url: "https://boke.zsx815.top/music",
  },
  {
    text: "今天完善了关于页面，参考[博客的关于页面](https://www.myxz.top/about)",
    date: "2025-11-20 23:30",
    github: ["https://github.com/661111/Myxz_Blog_Nuxt"],
    tags: ["日常"],
    location: "南京",
    url: "https://www.myxz.top/about",
  },
  {
    text: "今天完善了友链页面，想添加友链最好去下面的仓库。",
    date: "2025-11-19 23:30",
    github: ["https://github.com/mcyzsx/friends"],
    tags: ["日常"],
    location: "南京",
  },
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
