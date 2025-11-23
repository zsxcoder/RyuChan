import { XMLParser } from "fast-xml-parser";

export interface NewsItem {
  title: string;
  link: string;
  pubDate: Date;
  description: string;
}

const CACHE = new Map<string, { t: number; data: NewsItem[] }>();
const TTL = 5 * 60 * 1000; // 5 min

export async function fetchNews(): Promise<NewsItem[]> {
  const key = "60s";
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.t < TTL)
    return hit.data;

  const xml = await fetch("https://60s.kemeow.top/v2/60s/rss").then((r) => r.text());
  const rss = new XMLParser().parse(xml);
  const items: NewsItem[] = (rss.rss?.channel?.item || []).map((i: any) => ({
    title: i.title,
    link: i.link,
    pubDate: new Date(i.pubDate),
    description: i.description,
  }));

  CACHE.set(key, { t: Date.now(), data: items });
  return items;
}
