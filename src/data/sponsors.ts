export interface Sponsor {
  name: string;
  amount: string; // 例如 "¥20"
  date: string; // 2025-11-25
  avatar?: string; // 可空
}

/** 按时间倒序排好，页面直接循环即可 */
export const sponsors: Sponsor[] = [
  { name: "张三", amount: "¥20", date: "2025-11-25" },
  { name: "李四", amount: "¥10", date: "2025-11-20", avatar: "https://img.xiaozhangya.xin/avatar/lisi.jpg" },
];
