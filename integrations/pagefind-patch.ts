import type { AstroIntegration } from "astro";
import { cp } from "node:fs/promises";
import { join } from "node:path";

export default function pagefindPatch(): AstroIntegration {
  return {
    name: "pagefind-patch",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const src = join(dir.pathname, "client/pagefind"); // dist/client/pagefind
        const dest = join(process.cwd(), ".vercel/output/static/pagefind");
        try {
          await cp(src, dest, { recursive: true, force: true });
          console.log("[pagefind-patch] copied to .vercel/output/static/pagefind");
        }
        catch (e) {
          console.warn("[pagefind-patch] copy failed", e);
        }
      },
    },
  };
}
