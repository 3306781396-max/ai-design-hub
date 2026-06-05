# AI Design Hub - 部署配置

## 项目概述

AI Design Hub 是一个 AI 设计工具导航与博客平台，基于 Next.js 15 + TypeScript + TailwindCSS 构建，使用静态导出模式。

- **项目路径**: `ai-design-hub`
- **Node 版本**: 22.22.2
- **构建模式**: 静态导出 (output: "export")
- **输出目录**: `out/`

---

## 构建产物

| 路由 | 类型 | 说明 |
|------|------|------|
| `/` | 静态 | 首页 |
| `/tool/[slug]` | SSG | 工具详情页 |
| `/category/[slug]` | SSG | 分类页（6个） |
| `/blog` | 静态 | 博客列表 |
| `/blog/[slug]` | SSG | 博客详情页 |
| `/tools` | 静态 | 工具列表 |
| `/admin` | 静态 | 后台管理 |

总页面数：**20 个静态页面**

---

## 环境变量

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://ai-design-hub.vercel.app
```

---

## 部署方案

### Vercel 部署（推荐 - 不休眠静态站点）

项目已配置 `vercel.json`，支持一键部署：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署生产环境
vercel --prod
```

或通过 GitHub 自动部署：
1. 推送代码到 GitHub 仓库
2. 在 Vercel.com 导入项目
3. 设置 Framework Preset 为 "Other"
4. 设置 Build Command: `npm run build`
5. 设置 Output Directory: `out`
6. 添加环境变量 `NEXT_PUBLIC_SITE_URL`

---

## 维护脚本

```bash
scripts/
├── prebuild.py           # sitemap & robots.txt 生成
└── gen-images.py         # PNG 图标生成（纯Python）
