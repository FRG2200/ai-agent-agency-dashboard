# Supabase + N8N 本番運用セットアップガイド

## 🎯 ゴール
本番運用可能なAI Agent Agencyダッシュボードを構築
- ✅ Supabase: データ永続化
- ✅ N8N: 業務自動化ワークフロー
- ✅ リアルタイム更新
- ✅ 67名AIエージェント管理

---

## 📋 前提条件

- Supabaseアカウント（無料枠でOK）
- N8Nインスタンス（自前 or Cloud）
- Railwayアカウント（バックエンドホスティング）

---

## 🗄️ Step 1: Supabaseセットアップ

### 1.1 プロジェクト作成
1. https://supabase.com/dashboard にアクセス
2. 「New Project」
3. プロジェクト名: `ai-agent-agency`
4. リージョン: `Tokyo (Northeast Asia)`
5. 「Create new project」

### 1.2 データベーススキーマ適用
1. 左メニュー → SQL Editor
2. 「New query」
3. `supabase/schema.sql` の内容をコピー＆ペースト
4. 「Run」で実行

### 1.3 APIキー取得
1. Project Settings → API
2. 以下をコピー:
   - **Project URL** (`SUPABASE_URL`)
   - **anon public** (`SUPABASE_ANON_KEY`)
   - **service_role secret** (`SUPABASE_SERVICE_ROLE_KEY`)

---

## ⚡ Step 2: N8Nセットアップ

### 2.1 N8N Cloud使用（推奨・簡単）
1. https://n8n.io/cloud にアクセス
2. アカウント作成（14日間無料トライアル）
3. インスタンス起動

### 2.2 ワークフローインポート
1. N8Nダッシュボード → 「Import from File」
2. `n8n/workflow-order-automation.json` を選択
3. 保存

### 2.3 Supabase認証設定
1. ワークフロー内の「Update Order」「Log Activity」ノードを選択
2. Credentials → 「Create New Credential」
3. Supabase → 以下を入力:
   - Host: `SUPABASE_URL`
   - Service Role Secret: `SUPABASE_SERVICE_ROLE_KEY`

### 2.4 Webhook URL取得
1. 「Order Webhook」ノードを選択
2. Webhook URLをコピー（例: `https://xxx.n8n.cloud/webhook/order-received`）
3. これを `N8N_WEBHOOK_URL` として使用

---

## 🚀 Step 3: Railwayデプロイ（バックエンド）

### 3.1 環境変数準備
```bash
# .env ファイル作成
cat > server/.env << 'EOF'
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
N8N_WEBHOOK_URL=https://xxxx.n8n.cloud/webhook/order-received
NODE_ENV=production
PORT=3000
EOF
```

### 3.2 Railwayデプロイ
```bash
cd server

# Railway CLIインストール（初回のみ）
npm install -g @railway/cli

# ログイン
railway login

# プロジェクト作成
railway init --name ai-agent-agency-api

# 環境変数設定
railway variables set SUPABASE_URL="https://xxxx.supabase.co"
railway variables set SUPABASE_SERVICE_ROLE_KEY="eyJ..."
railway variables set N8N_WEBHOOK_URL="https://xxx.n8n.cloud/webhook/order-received"
railway variables set NODE_ENV="production"

# デプロイ
railway up

# ダッシュボードでURLを確認
railway open
```

**取得したURL:** `https://ai-agent-agency-api.up.railway.app`

---

## 🎨 Step 4: Vercelデプロイ（フロントエンド）

### 4.1 環境変数準備
```bash
cd client

# .env.local 作成
echo "VITE_API_URL=https://ai-agent-agency-api.up.railway.app" > .env.local
```

### 4.2 Vercelデプロイ
```bash
# Vercel CLIインストール（初回のみ）
npm install -g vercel

# ログイン
vercel login

# プロジェクト作成
vercel

# 本番デプロイ
vercel --prod
```

**またはGitHub連携:**
1. GitHubにリポジトリをプッシュ
2. Vercelダッシュボード → Import
3. Root Directory: `client`
4. Environment Variables: `VITE_API_URL=https://ai-agent-agency-api.up.railway.app`

---

## 🔗 Step 5: 連携確認

### 5.1 API接続テスト
```bash
# ヘルスチェック
curl https://ai-agent-agency-api.up.railway.app/api/health

# サービス一覧
curl https://ai-agent-agency-api.up.railway.app/api/services

# 注文作成テスト
curl -X POST https://ai-agent-agency-api.up.railway.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "テスト株式会社",
    "client_email": "test@example.com",
    "service_id": "youtube",
    "notes": "テスト注文"
  }'
```

### 5.2 N8N連携テスト
1. N8Nで「Order Webhook」ワークフローを開く
2. 「Listen for Test Event」をクリック
3. 上記の注文作成APIを実行
4. N8Nで実行履歴を確認

---

## 📊 本番運用時の監視

### Supabase（データベース）
- Dashboard → Table Editor でデータ確認
- Logs → Postgres でクエリログ確認
- Database → Usage で容量確認（無料枠: 500MB）

### N8N（ワークフロー）
- Executions で実行履歴確認
- エラー時は赤いアイコンで通知
- Webhook応答時間: 3秒以内を目標

### Railway（バックエンド）
- Dashboard → Deployments でデプロイ状況
- Logs でエラーログ確認
- Metrics でCPU/メモリ監視

### Vercel（フロントエンド）
- Analytics でアクセス解析
- Logs でエラー確認
- Deployments でビルド状況

---

## 💰 運用コスト（月額見積もり）

| サービス | プラン | 月額 | 備考 |
|---------|-------|------|------|
| **Supabase** | Free | ¥0 | 500MB, 2GB帯域 |
| **N8N** | Starter | $20 (~¥3,000) | 5,000実行/月 |
| **Railway** | Starter | $5 (~¥750) | 常時稼働 |
| **Vercel** | Hobby | ¥0 | 無料枠で十分 |
| **合計** | - | **~¥3,750/月** | - |

※ N8Nは自前サーバーで運用すれば¥0（別途サーバー費用）

---

## 🆘 トラブルシューティング

### Supabase接続エラー
```
Error: connection refused
→ Project Settings → Database → Connection string確認
→ SSL設定: `?sslmode=require` を追加
```

### N8N Webhookエラー
```
404 Not Found
→ Webhook URLが正しいか確認
→ Webhookが「Active」になっているか確認
```

### CORSエラー
```
CORS policy: No 'Access-Control-Allow-Origin'
→ server/index.js の corsOptions.origin にVercelドメインを追加
→ Railwayで環境変数 FRONTEND_URL を設定
```

### データが反映されない
```
→ Supabase Realtimeが有効か確認（schema.sql参照）
→ RLSポリシーが正しく設定されているか確認
```

---

## 📝 次のステップ

- [ ] メール通知機能（SendGrid連携）
- [ ] Slack通知（チーム連携）
- [ ] 認証機能（Clerk/Auth0）
- [ ] 請求・決済（Stripe連携）
- [ ] 詳細な分析レポート

---

## 🔗 参考リンク

- Supabase Docs: https://supabase.com/docs
- N8N Docs: https://docs.n8n.io
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
