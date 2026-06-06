# 🚀 AI Design Hub - Vercel 部署指南

## ✅ 当前状态

- ✅ 代码已准备完毕（68 个工具 + 12 篇博客）
- ✅ 构建成功（67 个静态页面）
- ✅ Git 仓库已初始化，commit 完成
- ✅ GitHub 远程仓库已配置：`https://github.com/kirakira/ai-design-hub.git`

---

## 📋 部署步骤（共 3 步，约 3 分钟）

### 第 1 步：推送代码到 GitHub

在**本地 Mac 终端**执行（不要用 WorkBuddy 终端）：

```bash
cd ~/WorkBuddy/2026-06-04-21-08-38/ai-design-hub
git push -u origin main
```

> 第一次 push 会弹窗要求 GitHub 登录，按提示操作即可。

---

### 第 2 步：在 Vercel 导入项目

1. 打开 [vercel.com/dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **GitHub 仓库** `kirakira/ai-design-hub`
4. 配置如下：

| 设置项 | 值 |
|--------|-----|
| Framework Preset | `Other` |
| Build Command | `npm run build` |
| Output Directory | `out` |
| Install Command | `npm install` |

5. 点击 **"Deploy"**，等待 2 分钟

---

### 第 3 步：获得永久域名

部署完成后，Vercel 会显示：

```
✅ Production: https://ai-design-hub.vercel.app
```

这个点 **永久有效，永不休眠** 🎉

---

## 🔄 后续自动更新

每次你（或我）执行 `git push`，Vercel 会**自动重新部署**：

```bash
# 当我添加了新工具后
git add src/data/mock.ts
git commit -m "Add new AI tools"
git push origin main
# → Vercel 自动重新构建 + 部署
```

---

## 💡 如果第 1 步 push 失败

**原因**：GitHub 需要 Personal Access Token (PAT)

**解决方法**：
1. 打开 [github.com/settings/tokens](https://github.com/settings/tokens)
2. 点 **"Generate new token (classic)"**
3. 勾选 `repo` 权限
4. 复制生成的 token
5. 在终端执行：
   ```bash
   git remote set-url origin https://<YOUR_TOKEN>@github.com/kirakira/ai-design-hub.git
   git push -u origin main
   ```

---

## 🎯 部署完成后

网站将拥有：
- ✅ 永久在线（永不休眠）
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 每次 `git push` 自动更新
- ✅ 我设置的定时任务会自动添加新工具并推送
