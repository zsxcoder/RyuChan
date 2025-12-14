import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import playformCompress from "@playform/compress";
import terser from "@rollup/plugin-terser";
// --------------  只加这一行：Expressive Code --------------
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import { CODE_THEME, USER_SITE } from "./src/config.ts";
import updateConfig from "./src/integration/updateConfig.ts";

import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: USER_SITE,
  output: "server",
  adapter: vercel(),
  style: { scss: { includePaths: ["./src/styles"] } },
  integrations: [
    updateConfig(),

    // ① 只改这里：用 Expressive Code 接管代码块（含复制按钮、行号）
    expressiveCode({
      themes: [CODE_THEME], // 仍用你的主题变量
      styleOverrides: {
        borderRadius: "0.75rem", // 圆角同 Frosti
      },
      plugins: ["line-numbers"], // 行号
      // copy-button 默认已内置，无需显式声明
    }),

    mdx(),
    icon(),
    terser({ compress: true, mangle: true }),
    sitemap(),
    tailwind({ configFile: "./tailwind.config.mjs" }),
    playformCompress(),
  ],
  prefetch: { prefetchAll: false },
  viewTransitions: { fallback: "swap" },

  // ② 其余完全不动：Shiki 主题、transformers、外壳、复制按钮逻辑全部保留
  markdown: {
    shikiConfig: {
      theme: CODE_THEME,
      transformers: [
        // 你原来的外壳、行号、语言标签逻辑保持原样
        {
          preprocess(code, options) {
            this.meta = { lang: options.lang || "plaintext" };
            return code;
          },
          pre(node) {
            const lang = this.meta?.lang.toUpperCase() || "PLAINTEXT";
            return {
              type: "element",
              tagName: "div",
              properties: { class: "not-prose frosti-code" },
              children: [
                {
                  type: "element",
                  tagName: "div",
                  properties: { class: "frosti-code-toolbar" },
                  children: [
                    {
                      type: "element",
                      tagName: "span",
                      properties: { class: "frosti-code-toolbar-language" },
                      children: [{ type: "text", value: lang }],
                    },
                    // 复制按钮已由 Expressive Code 注入，这里不再手写
                  ],
                },
                {
                  ...node,
                  properties: { ...node.properties, class: "frosti-code-content" },
                  children: [
                    {
                      type: "element",
                      tagName: "code",
                      properties: {
                        class: "grid [&>.line]:px-4",
                        style: "counter-reset: line",
                      },
                      children: node.children,
                    },
                  ],
                },
              ],
            };
          },
          line(node) {
            return {
              ...node,
              properties: {
                ...node.properties,
                class: "line before:content-[counter(line)]",
                style: "counter-increment: line",
              },
            };
          },
          code(node) {
            delete node.properties.style;
            return node;
          },
        },
      ],
    },
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [
      rehypeKatex,
      [rehypeExternalLinks, { content: { type: "text", value: "↗" } }],
    ],
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" },
      },
    },
    optimizeDeps: {
      include: ["@astrojs/mdx", "@astrojs/tailwind"],
    },
  },
});
