# 🤖 AI Agent Agency Dashboard

67名のAIエージェントによる組織運営ダッシュボード

## 🚀 概要

AI Agent Agencyは、AIエージェントによる業務自動化サービスを提供する企業向け管理ダッシュボードです。

### 提供サービス
- 🎬 **YouTube運用代行** - AIが企画・脚本・編集・投稿を自動化
- ✍️ **コンテンツ制作** - ブログ・メルマガ・SNS投稿を自動生成  
- 💼 **営業代行** - リード生成から商談設定まで自動化
- ⚙️ **業務自動化** - 受注から納品までのワークフロー構築

## 📁 プロジェクト構成

```
ai-agent-agency/
├── client/          # React + Vite フロントエンド
│   ├── src/
│   │   ├── pages/   # ServiceMenu, Dashboard, Workflow
│   │   └── components/
│   └── package.json
├── server/          # Express + Supabase バックエンド
│   └── index.js
└── package.json     # ルート（同時起動用）
```

## 🛠️ 技術スタック

| 層 | 技術 |
|----|------|
| フロントエンド | React, Vite, Tailwind CSS, Lucide Icons |
| バックエンド | Node.js, Express |
| データベース | Supabase (PostgreSQL) |
| AI | OpenAI GPT-4o, Kimi API |
| ワークフロー | N8N |

## 🚀 クイックスタート

### 1. 依存関係インストール

```bash
npm run install:all
```

### 2. 環境変数設定

`.env`ファイルを編集：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
KIMI_API_KEY=your-kimi-api-key
```

### 3. 開発サーバー起動

```bash
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:3000

### 4. ビルド（本番用）

```bash
npm run build
```

## 📊 機能一覧

### サービスメニュー画面 (`/`)
- 4つのサービスプラン表示
- 料金・特徴一覧
- 受注ボタン

### ダッシュボード画面 (`/dashboard`)
- 稼働エージェント数（リアルタイム）
- タスク完了/進行中カウンター
- 事業部別稼働状況
- アクティビティログ

### ワークフロー画面 (`/workflow`)
- 受注リスト
- ステータス管理（新規→割当→実行中→レビュー→完了）
- 進捗バー
- エージェント割当

## 🔌 API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/services` | サービス一覧 |
| GET | `/api/dashboard/stats` | 統計情報 |
| GET | `/api/dashboard/agents` | エージェント稼働状況 |
| GET | `/api/workflow/orders` | 注文一覧 |
| GET | `/api/activity/logs` | アクティビティログ |

## 🎨 デザインシステム

### カラーパレット
- `--neo-dark`: #0A0E27（背景）
- `--neo-blue`: #0066FF（プライマリ）
- `--neo-cyan`: #00D9FF（アクセント）
- `--neo-gold`: #FFD700（強調）
- `--neo-card`: #1A1F3A（カード背景）

## 📝 開発ロードマップ

- [x] Phase 1: 環境構築
- [x] Phase 2: バックエンド構築
- [x] Phase 3: フロントエンド構築
- [ ] Phase 4: Supabase連携
- [ ] Phase 5: N8Nワークフロー統合
- [ ] Phase 6: AIエージェント自動割当

## 👥 組織構成

67名のAIエージェント体制：

| 事業部 | 人数 | 役割 |
|--------|------|------|
| コンテンツ事業部 | 20名 | YouTube, ブログ, SNS |
| ビジネス開発部 | 16名 | 営業, マーケティング |
| テクニカル部 | 5名 | 開発, インフラ |
| オペレーション部 | 10名 | カスタマーサポート |
| PRIME AI | 1名 | 統括, QA |

## 📄 ライセンス

MIT License

---

© 2026 AI Agent Agency
