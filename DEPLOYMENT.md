# AI Design Hub 2.0 - 部署配置与文档

## 项目概述

AI Design Hub 是一个 AI 设计工具导航与博客平台，基于 Next.js 15 + TypeScript + TailwindCSS 构建。

- **仓库**: `ai-design-hub`
- **Node 版本**: 22.22.2
- **包管理器**: npm
- **渲染模式**: 混合（静态 + SSG + 动态）

---

## 构建产物

| 路由 | 类型 | 说明 |
|------|------|------|
| `/` | 静态 ○ | 首页 |
| `/tool/[slug]` | SSG ● | 33 个工具详情页（预渲染） |
| `/category/[slug]` | SSG ● | 6 个分类页（预渲染） |
| `/blog` | 动态 ƒ | 博客列表（SSR） |
| `/blog/[slug]` | SSG ● | 12 篇博客（预渲染） |
| `/tools` | 动态 ƒ | 工具列表（SSR） |
| `/admin` | 动态 ƒ | 后台管理（不索引） |

总页面数：**59 个静态页面**

---

## 环境变量

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> 当前使用 Mock 数据（`src/data/mock.ts`），无需数据库即可运行。
> 接入 Supabase 后，修改 `src/lib/supabase.ts` 中的函数实现即可。

---

## 部署方案

### Vercel 部署（推荐）

1. 连接 Git 仓库到 [Vercel](https://vercel.com)
2. 设置环境变量（如上）
3. 自动构建部署

```bash
# vercel.json (已配置)
{
  "frames": false,
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

### Node.js 自部署

```bash
# 1. 安装依赖
npm ci --production

# 2. 构建
npm run build

# 3. 启动
npm start -p 3000
# 或
NODE_ENV=production npx next start -p 3000
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start", "-p", "3000"]
```

---

## 性能优化

- **图片优化**: 使用 `next/image` + `placeholder="blur"`
- **字体优化**: 使用 `next/font/google` 自托管
- **静态生成**: 所有可预渲染页面均使用 SSG
- **代码分割**: 自动按路由分割 chunk
- **SEO**: 每页独立 `metadata` + `JsonLd` 结构化数据

---

## 维护脚本

```bash
scripts/
├── seo-keywords-update.py   # SEO 关键词更新（需接入 API）
├── tool-submit-review.py     # 新工具提交审核
└── build-analyzer.py        # 构建产物分析
```

---

## 待完成事项

- [ ] 接入真实 Supabase 数据库
- [ ] 后台管理：工具增删改功能
- [ ] 后台管理：博客编辑器（Markdown）
- [ ] 搜索功能（Algolia / Meilisearch）
- [ ] 用户评论系统
- [ ] RSS Feed 订阅
- [ ] 多语言支持（i18n）
