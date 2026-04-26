# Sooon 統合開発リポジトリ（Submodule構成）

複数のプロジェクトを Git Submodule で管理する親リポジトリです。

## プロジェクト構成

### 1. sooon-sales-os
- **説明：** Sooon 社内CRM＆営業管理プラットフォーム
- **Tech Stack：** Next.js, Supabase, FileMaker, Clerk
- **Deployment：** Vercel (`webapp-sigma-lyart-99.vercel.app`)

### 2. silas-saas
- **説明：** Google Maps B2B スクレイピング SaaS
- **Tech Stack：** Python, Playwright, Upstash Redis
- **Infrastructure：** Windows 10台（Office環境）

### 3. mens-esthe-seo-tools
- **説明：** 美容ポータルサイト SEO自動更新ツール
- **Tech Stack：** WordPress, Python
- **Deployment：** Xserver（GitHub Actions FTP auto-deploy）

### 4. rokuon
- **説明：** コール録音・文字起こしアプリ
- **Tech Stack：** Next.js, Python (Whisper), Supabase

## 使い方

### 初回クローン（Submodule を含める）

\`\`\`bash
git clone --recurse-submodules git@github.com:atmgmj7-lab/dev-all-projects.git
cd dev-all-projects
\`\`\`

### 特定プロジェクトで作業

\`\`\`bash
cd sooon-sales-os
git add .
git commit -m "feat: add new feature"
git push origin main

# 親リポジトリで submodule のバージョンを更新
cd ../
git add sooon-sales-os
git commit -m "chore: update sooon-sales-os to latest"
git push origin main
\`\`\`

### 全プロジェクトの最新版を取得

\`\`\`bash
git pull
git submodule update --remote --recursive
\`\`\`

---

**Maintained by：** narikiyotakashi (@atmgmj7)
