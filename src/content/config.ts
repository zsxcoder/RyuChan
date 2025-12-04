// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // ✅ 手动 UTC 解析
    pubDate: z
      .string()
      .regex(/^\d{2} \d{2} \d{4}$/)
      .transform((str: string) => {
        const [mm, dd, yyyy] = str.split(" ");
        return new Date(Date.UTC(+yyyy, +mm - 1, +dd));
      }),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    badge: z.string().optional(),
    draft: z.boolean().default(false),
    categories: z
      .array(z.string())
      .refine((items: string[]) => new Set(items).size === items.length, {
        message: "categories must be unique",
      })
      .optional(),
    tags: z
      .array(z.string())
      .refine((items: string[]) => new Set(items).size === items.length, {
        message: "tags must be unique",
      })
      .optional(),
  }),
});

export const collections = { blog };
