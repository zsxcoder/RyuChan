import { marked } from "marked";

const CACHE = new Map<string, { t: number; html: string }>();
const TTL = 5 * 60 * 1000; // 5 min

export async function fetchWeather(city: string): Promise<string> {
  const key = `weather:${city}`;
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.t < TTL)
    return hit.html;

  const url = `https://60s.kemeow.top/v2/weather?query=${encodeURIComponent(city)}&encoding=markdown`;
  const md = await fetch(url).then((r) => r.text());
  const html = marked(md);

  CACHE.set(key, { t: Date.now(), html });
  return html;
}
