# Vercel + Railway デプロイガイド

## 🚀 デプロイ手順

### 1. Railway（バックエンド）デプロイ

```bash
# Railway CLIインストール
npm install -g @railway/cli

# ログイン
railway login

# プロジェクト作成
cd server
railway init --name ai-agent-agency-api

# 環境変数設定
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_ANON_KEY=your_anon_key
railway variables set KIMI_API_KEY=your_kimi_key

# デプロイ
railway up
```

**取得するもの:** Railwayダッシュボードで `https://xxx.up.railway.app` のURLをコピー

---

### 2. Vercel（フロントエンド）デプロイ

```bash
# Vercel CLIインストール
npm install -g vercel

# フロントエンドディレクトリへ
cd client

# 環境変数設定（RailwayのURLを設定）
vercel env add VITE_API_URL
# → https://xxx.up.railway.app を入力

# デプロイ
vercel --prod
```

またはGitHub連携:
1. GitHubにこのリポジトリをプッシュ
2. VercelダッシュボードでImport
3. Root Directory: `client`
4. Environment Variables: `VITE_API_URL=https://xxx.up.railway.app`

---

## 📁 ファイル構造

```
ai-agent-agency/
├── client/          # → Vercel
│   ├── src/
│   ├── package.json
│   └── vercel.json  # ✅ Vercel設定
│
├── server/          # → Railway
│   ├── index.js
│   ├── package.json
│   └── railway.json # ✅ Railway設定
│
└── vercel.json      # ルート（リダイレクト用・オプション）
```

---

## ⚙️ 環境変数一覧

### Railway（サーバー側）
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
KIMI_API_KEY=sk-kimi-...
PORT=3000
```

### Vercel（クライアント側）
```env
VITE_API_URL=https://xxx.up.railway.app
```

---

## 🔗 ドメイン設定（オプション）

### カスタムドメイン使用時

**Vercel:**
- Settings → Domains → ドメイン追加

**Railway:**
- Settings → Domains → カスタムドメイン設定

### CORS設定（server/index.js）

本番ドメインに限定:
```javascript
app.use(cors({
  origin: [
    'https://ai-agent-agency.vercel.app',  // Vercel本番URL
    'http://localhost:5173',               // 開発用
  ],
  credentials: true
}));
```

---

## 💰 料金見積もり

| サービス | プラン | 月額 | 備考 |
|---------|-------|------|------|
| **Vercel** | Hobby | ¥0 | 無料枠で十分 |
| **Railway** | Starter | $5 (~¥750) | 常時稼働に必要 |
| **Supabase** | Free | ¥0 | 500MB, 2GB帯域 |
| **合計** | - | **~¥750/月** | - |

---

## 🆘 トラブルシューティング

### API接続エラー
```
フロント: VITE_API_URLが正しく設定されているか確認
バック: CORS設定にVercelドメインが含まれているか確認
```

### ビルドエラー
```bash
# Vercelビルドログ確認
vercel --logs

# Railwayビルドログ確認
railway logs
```

### 環境変数が反映されない
```bash
# Vercel再デプロイ
vercel --prod

# Railway再起動
railway restart
```

---

## ✅ デプロイチェックリスト

- [ ] Railwayにデプロイ完了
- [ ] RailwayのURLを取得
- [ ] Vercelに`VITE_API_URL`を設定
- [ ] Vercelにデプロイ完了
- [ ] 両方のサービスが正常動作
- [ ] カスタムドメイン設定（必要な場合）

---

## 📞 サポート

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Supabase Docs:** https://supabase.com/docs
