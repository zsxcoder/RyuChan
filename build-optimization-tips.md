# Astro 构建优化指南

## 当前构建流程分析

你的构建命令是：
```bash
astro check && astro build && pagefind --site dist/client --output-path .vercel/output/static/pagefind
```

这个流程包括三个步骤：
1. `astro check` - TypeScript 类型检查
2. `astro build` - 构建项目
3. `pagefind` - 生成搜索索引

## 优化建议

### 1. 优化构建命令

#### 方案 A：跳过类型检查（快速构建）
```json
{
  "scripts": {
    "build": "astro build && pagefind --site dist/client --output-path .vercel/output/static/pagefind",
    "build:full": "astro check && astro build && pagefind --site dist/client --output-path .vercel/output/static/pagefind"
  }
}
```

#### 方案 B：并行运行类型检查和构建
```json
{
  "scripts": {
    "build": "concurrently \"astro check\" \"astro build\" && pagefind --site dist/client --output-path .vercel/output/static/pagefind",
    "build:full": "astro check && astro build && pagefind --site dist/client --output-path .vercel/output/static/pagefind"
  }
}
```

### 2. 优化 Astro 配置

#### 2.1 禁用不必要的功能
```javascript
// astro.config.mjs
export default defineConfig({
  // 其他配置...
  prefetch: { prefetchAll: false }, // 已经有了，很好
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" }, // 已经有了，很好
      },
    },
    // 添加优化选项
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined, // 禁用代码分割以减少构建时间
        },
      },
    },
    // 减少依赖解析时间
    optimizeDeps: {
      include: ["astro", "@astrojs/mdx", "@astrojs/tailwind"],
    },
  },
});
```

#### 2.2 调整压缩设置
```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  // 其他配置...
  vite: {
    build: {
      minify: "terser", // 使用 terser 而不是 esbuild（如果 terser 更快）
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console.log
          drop_debugger: true, // 移除 debugger
        },
      },
    },
  },
});
```

### 3. 优化 TypeScript 配置

#### 3.1 调整 tsconfig.json
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "target": "ESNext",
    "baseUrl": ".",
    "module": "ESNext",
    "moduleResolution": "Node",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@config": ["src/config.ts"],
      "@interfaces/*": ["src/interface/*"],
      "@utils/*": ["src/utils/*"]
    },
    "strict": true,
    "esModuleInterop": true,
    // 添加以下优化选项
    "skipLibCheck": true, // 跳过库文件检查
    "incremental": true, // 启用增量编译
    "tsBuildInfoFile": ".tsbuildinfo" // 存储增量编译信息
  }
}
```

### 4. 优化依赖安装

#### 4.1 使用更快的包管理器
你已经使用了 pnpm，这是很好的选择。确保使用最新版本：

```bash
pnpm update -g pnpm
```

#### 4.2 优化 pnpm 配置
在项目根目录创建 `.npmrc` 文件：

```
# .npmrc
shamefully-hoist=true
strict-peer-dependencies=false
```

### 5. 缓存优化

#### 5.1 添加构建缓存
```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  // 其他配置...
  vite: {
    // 添加构建缓存
    cacheDir: ".vite",
  },
});
```

#### 5.2 排除不必要的文件
在项目根目录创建 `.viteignore` 文件：

```
# .viteignore
src/content/images/*
public/images/*
dist/*
node_modules/*
*.md
*.mdx
```

### 6. 硬件优化

#### 6.1 增加内存限制
```json
{
  "scripts": {
    "build": "node --max-old-space-size=4096 node_modules/.bin/astro build && pagefind --site dist/client --output-path .vercel/output/static/pagefind"
  }
}
```

#### 6.2 使用多核处理
```json
{
  "scripts": {
    "build": "pnpm run build:parallel",
    "build:parallel": "concurrently \"node --max-old-space-size=4096 node_modules/.bin/astro build\" \"pnpm run pagefind\"",
    "pagefind": "pagefind --site dist/client --output-path .vercel/output/static/pagefind"
  }
}
```

### 7. 使用 CI/CD 优化

#### 7.1 缓存依赖
在 CI/CD 中使用依赖缓存：

```yaml
# GitHub Actions 示例
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Get pnpm store directory
  shell: bash
  run: |
    echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- name: Setup pnpm cache
  uses: actions/cache@v3
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

## 立即可用的优化

### 1. 快速构建脚本
```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "check": "astro check",
    "build": "astro build && pagefind --site dist/client --output-path .vercel/output/static/pagefind",
    "build:full": "astro check && astro build && pagefind --site dist/client --output-path .vercel/output/static/pagefind",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

### 2. 优化 TypeScript 配置
在 `tsconfig.json` 中添加：
```json
{
  "compilerOptions": {
    // 现有配置...
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### 3. 添加 .viteignore 文件
创建 `.viteignore` 文件：
```
src/content/images/*
public/images/*
dist/*
node_modules/*
```

## 测试优化效果

使用以下命令测试构建时间：

```bash
# 清理缓存
pnpm run clean || rm -rf dist .astro .vite

# 测试原始构建时间
time pnpm run build:full

# 测试优化后构建时间
time pnpm run build
```

## 预期效果

根据项目规模，这些优化通常可以减少 20-40% 的构建时间：
- 小型项目：可能减少 1-2 秒
- 中型项目：可能减少 5-10 秒
- 大型项目：可能减少 10-20 秒

## 持续优化

构建性能优化是一个持续的过程，建议：
1. 定期更新依赖
2. 监控构建时间
3. 根据项目变化调整优化策略
4. 考虑使用更快的硬件或 CI/CD 服务