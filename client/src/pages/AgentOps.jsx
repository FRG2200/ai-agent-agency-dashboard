import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Cpu, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const AGENT_DATA = [
  // ── マネジメント ──
  {
    id: 'mgmt-001', name: '田中 誠一', role: 'CEO / 総括マネージャー', team: 'マネジメント',
    status: 'active', progress: 82,
    currentTask: '全体戦略レビュー・KPI確認',
    taskDetail: '月次KPIレビューを実施中。全7部門の進捗を統括。クライアント5社の満足度スコアを分析し、次月戦略を策定中。',
    subtasks: [
      { name: '月次KPIレポート確認', status: 'done', time: '完了' },
      { name: '各部門ブリーフィング', status: 'done', time: '完了' },
      { name: '次月戦略策定', status: 'running', time: '進行中' },
      { name: 'クライアントフィードバック対応', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'mgmt-002', name: '山本 恵子', role: 'COO / 運営統括', team: 'マネジメント',
    status: 'active', progress: 70,
    currentTask: '運営プロセス最適化',
    taskDetail: '全部門のワークフロー効率化を推進中。自動化率を現在の68%から85%へ引き上げるロードマップを作成中。',
    subtasks: [
      { name: 'ワークフロー分析', status: 'done', time: '完了' },
      { name: '自動化ロードマップ作成', status: 'running', time: '進行中' },
      { name: '各部門への展開', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'mgmt-003', name: '佐藤 大輔', role: 'プロジェクトマネージャー', team: 'マネジメント',
    status: 'active', progress: 75,
    currentTask: 'YouTube運用プロジェクト全体管理',
    taskDetail: 'クライアント3社のYouTube運用プロジェクトを統括。週次レポート作成中。動画本数9/12本完了。',
    subtasks: [
      { name: 'クライアントAレポート', status: 'done', time: '完了' },
      { name: 'クライアントBレポート', status: 'done', time: '完了' },
      { name: 'クライアントCレポート', status: 'running', time: '進行中' },
      { name: '来週スケジュール確定', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'mgmt-004', name: '鈴木 美咲', role: 'プロジェクトマネージャー', team: 'マネジメント',
    status: 'active', progress: 77,
    currentTask: 'バナー広告制作プロジェクト管理',
    taskDetail: 'Meta広告用バナー550枚生成プロジェクト。現在423/550枚完了。画像生成AIを並列稼働中。',
    subtasks: [
      { name: '画像生成バッチ1 (1-200枚)', status: 'done', time: '完了' },
      { name: '画像生成バッチ2 (201-400枚)', status: 'done', time: '完了' },
      { name: '画像生成バッチ3 (401-550枚)', status: 'running', time: '423/550枚' },
      { name: '品質チェック・納品', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'mgmt-005', name: '高橋 拓也', role: 'プロジェクトマネージャー', team: 'マネジメント',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '新規案件の受付待ち。営業チームからのブリーフィング待機中。',
    subtasks: [],
  },
  {
    id: 'mgmt-006', name: '伊藤 さくら', role: 'アシスタントマネージャー', team: 'マネジメント',
    status: 'active', progress: 60,
    currentTask: '週次ミーティング議事録作成・配布',
    taskDetail: '全部門の週次ミーティング議事録をまとめ、関係者へ配布中。アクションアイテムの進捗管理も担当。',
    subtasks: [
      { name: '議事録まとめ', status: 'done', time: '完了' },
      { name: 'アクションアイテム整理', status: 'running', time: '進行中' },
      { name: '関係者への配布', status: 'pending', time: '待機中' },
    ],
  },

  // ── コンテンツ ──
  {
    id: 'cont-001', name: '中村 陽介', role: 'コンテンツディレクター', team: 'コンテンツ',
    status: 'active', progress: 65,
    currentTask: 'コンテンツカレンダー策定（翌月分）',
    taskDetail: '翌月のYouTube・SNS・ブログの投稿スケジュールを策定中。クライアント5社分のカレンダーを作成。',
    subtasks: [
      { name: 'YouTube投稿計画', status: 'done', time: '完了' },
      { name: 'SNS投稿計画', status: 'running', time: '進行中' },
      { name: 'ブログ投稿計画', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cont-002', name: '小林 奈々', role: 'YouTubeディレクター', team: 'コンテンツ',
    status: 'active', progress: 80,
    currentTask: 'YouTube動画構成・台本レビュー',
    taskDetail: '今週公開予定の動画4本の構成・台本をレビュー中。SEOキーワード最適化も実施。',
    subtasks: [
      { name: '動画1 台本レビュー', status: 'done', time: '完了' },
      { name: '動画2 台本レビュー', status: 'done', time: '完了' },
      { name: '動画3 台本レビュー', status: 'running', time: '進行中' },
      { name: '動画4 台本レビュー', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cont-003', name: '加藤 翔太', role: 'YouTube編集者', team: 'コンテンツ',
    status: 'active', progress: 55,
    currentTask: 'YouTube動画編集（クライアントA 第3話）',
    taskDetail: '15分動画の編集作業中。BGM挿入・テロップ追加・カラーグレーディングを実施中。',
    subtasks: [
      { name: '粗編集', status: 'done', time: '完了' },
      { name: 'BGM・SE挿入', status: 'running', time: '進行中' },
      { name: 'テロップ追加', status: 'pending', time: '待機中' },
      { name: 'カラーグレーディング', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cont-004', name: '吉田 彩花', role: 'YouTube編集者', team: 'コンテンツ',
    status: 'active', progress: 70,
    currentTask: 'YouTube動画編集（クライアントB 第7話）',
    taskDetail: '20分動画の最終仕上げ中。エンドカード・チャンネル登録促進テロップを追加中。',
    subtasks: [
      { name: '粗編集〜本編集', status: 'done', time: '完了' },
      { name: 'エンドカード追加', status: 'running', time: '進行中' },
      { name: '最終確認・書き出し', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cont-005', name: '山田 健太', role: 'YouTube編集者', team: 'コンテンツ',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次の編集案件待ち。',
    subtasks: [],
  },
  {
    id: 'cont-006', name: '渡辺 里奈', role: 'コンテンツライター', team: 'コンテンツ',
    status: 'active', progress: 80,
    currentTask: 'note記事執筆（週次2本）',
    taskDetail: 'SEO最適化されたnote記事を執筆中。今週分2本のうち1本完了、2本目執筆中（3,000字/5,000字）。',
    subtasks: [
      { name: '記事1: AIマーケティング入門', status: 'done', time: '完了・公開済み' },
      { name: '記事2: 自動化で売上3倍', status: 'running', time: '3,000/5,000字' },
    ],
  },
  {
    id: 'cont-007', name: '松本 浩二', role: 'コンテンツライター', team: 'コンテンツ',
    status: 'active', progress: 50,
    currentTask: 'ホワイトペーパー作成（AI活用事例集）',
    taskDetail: '30ページのホワイトペーパーを作成中。事例収集・構成・執筆を並行して実施。',
    subtasks: [
      { name: '事例収集（10件）', status: 'done', time: '完了' },
      { name: '構成案作成', status: 'done', time: '完了' },
      { name: '本文執筆（15/30ページ）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'cont-008', name: '井上 ひとみ', role: 'SNSライター', team: 'コンテンツ',
    status: 'active', progress: 100,
    currentTask: 'X/Instagram投稿文生成（1日3投稿）',
    taskDetail: '本日分のSNS投稿文3本を生成・スケジュール設定済み。明日分の下書き作成中。',
    subtasks: [
      { name: '本日X投稿（3/3本）', status: 'done', time: '完了・予約済み' },
      { name: '本日Instagram投稿（3/3本）', status: 'done', time: '完了・予約済み' },
      { name: '明日分下書き', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'cont-009', name: '木村 蓮', role: 'SNSライター', team: 'コンテンツ',
    status: 'active', progress: 75,
    currentTask: 'TikTok・Reels用キャプション作成',
    taskDetail: '今週公開予定のショート動画10本分のキャプション・ハッシュタグを作成中。',
    subtasks: [
      { name: 'TikTok用（5/5本）', status: 'done', time: '完了' },
      { name: 'Reels用（3/5本）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'cont-010', name: '林 真由', role: 'ブログライター', team: 'コンテンツ',
    status: 'active', progress: 40,
    currentTask: 'SEOブログ記事執筆（月4本）',
    taskDetail: '今月分のSEOブログ記事4本のうち2本完了。3本目を執筆中（2,000字/4,000字）。',
    subtasks: [
      { name: '記事1・2', status: 'done', time: '完了・公開済み' },
      { name: '記事3（執筆中）', status: 'running', time: '2,000/4,000字' },
      { name: '記事4', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cont-011', name: '清水 悠斗', role: 'ブログライター', team: 'コンテンツ',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のブログ案件待ち。',
    subtasks: [],
  },
  {
    id: 'cont-012', name: '山口 菜摘', role: 'メルマガライター', team: 'コンテンツ',
    status: 'active', progress: 90,
    currentTask: '週次メルマガ作成（配信数3,200件）',
    taskDetail: '今週のメルマガを作成中。件名A/Bテスト用に2パターン用意。開封率向上のための最適化を実施。',
    subtasks: [
      { name: '本文執筆', status: 'done', time: '完了' },
      { name: 'A/Bテスト件名作成', status: 'done', time: '完了' },
      { name: '配信設定・スケジュール', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'cont-013', name: '斎藤 颯太', role: 'スクリプトライター', team: 'コンテンツ',
    status: 'active', progress: 60,
    currentTask: 'YouTube台本作成（クライアントC 第5話）',
    taskDetail: '15分動画の台本を作成中。視聴維持率向上のための構成を意識して執筆。',
    subtasks: [
      { name: '構成案作成', status: 'done', time: '完了' },
      { name: '台本執筆（8/15分）', status: 'running', time: '進行中' },
      { name: 'レビュー・修正', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cont-014', name: '松田 愛', role: 'スクリプトライター', team: 'コンテンツ',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次の台本案件待ち。',
    subtasks: [],
  },

  // ── クリエイティブ ──
  {
    id: 'cre-001', name: '橋本 隼人', role: 'クリエイティブディレクター', team: 'クリエイティブ',
    status: 'active', progress: 70,
    currentTask: 'ブランドガイドライン策定（新規クライアント）',
    taskDetail: '新規クライアントのブランドカラー・フォント・ロゴ使用ルールを策定中。',
    subtasks: [
      { name: 'ヒアリング・リサーチ', status: 'done', time: '完了' },
      { name: 'ガイドライン草案作成', status: 'running', time: '進行中' },
      { name: 'クライアント確認', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cre-002', name: '岡田 結衣', role: 'デザイナー', team: 'クリエイティブ',
    status: 'active', progress: 67,
    currentTask: 'YouTubeサムネイル生成（クライアントA）',
    taskDetail: 'DALL-E 3を使用してYouTubeサムネイル12枚を生成中。A/Bテスト用バリエーション含む。現在8/12枚完了。',
    subtasks: [
      { name: 'ブランドガイドライン確認', status: 'done', time: '完了' },
      { name: 'サムネイル生成（8/12枚）', status: 'running', time: '進行中' },
      { name: 'A/Bテスト用バリエーション', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cre-003', name: '石川 大地', role: 'デザイナー', team: 'クリエイティブ',
    status: 'active', progress: 71,
    currentTask: 'SNS投稿用バナー制作（クライアントB）',
    taskDetail: 'Instagram/X用の週次投稿バナー21枚を制作中。Canva APIを使用して自動生成。15/21枚完了。',
    subtasks: [
      { name: 'Instagram用（7/7枚）', status: 'done', time: '完了' },
      { name: 'X用（5/7枚）', status: 'running', time: '進行中' },
      { name: 'Facebook用（3/7枚）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'cre-004', name: '前田 麻衣', role: 'デザイナー', team: 'クリエイティブ',
    status: 'active', progress: 50,
    currentTask: 'LP（ランディングページ）デザイン',
    taskDetail: '新商品のLPデザインをFigmaで作成中。ファーストビュー・CTAセクションのデザインを完成させ、残りのセクションを制作中。',
    subtasks: [
      { name: 'ワイヤーフレーム', status: 'done', time: '完了' },
      { name: 'ファーストビュー', status: 'done', time: '完了' },
      { name: '残りセクション（3/6）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'cre-005', name: '藤田 涼介', role: 'デザイナー（画像生成特化）', team: 'クリエイティブ',
    status: 'active', progress: 94,
    currentTask: 'Meta広告バナー並列生成（バッチ3: 401-475枚）',
    taskDetail: 'Midjourney APIを使用して広告バナーを並列生成中。4スレッド同時稼働。448/475枚完了。',
    subtasks: [
      { name: 'スレッド1（401-420枚）', status: 'done', time: '完了' },
      { name: 'スレッド2（421-440枚）', status: 'done', time: '完了' },
      { name: 'スレッド3（441-460枚）', status: 'running', time: '448/460枚' },
      { name: 'スレッド4（461-475枚）', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cre-006', name: '後藤 莉子', role: 'デザイナー（画像生成特化）', team: 'クリエイティブ',
    status: 'active', progress: 30,
    currentTask: 'Meta広告バナー並列生成（バッチ3: 476-550枚）',
    taskDetail: 'Stable Diffusion XLを使用して広告バナーを生成中。476-550枚担当。',
    subtasks: [
      { name: 'モデル初期化', status: 'done', time: '完了' },
      { name: 'バッチ生成（476-550枚）', status: 'running', time: '500/550枚' },
    ],
  },
  {
    id: 'cre-007', name: '西村 光', role: 'デザイナー（画像生成特化）', team: 'クリエイティブ',
    status: 'active', progress: 85,
    currentTask: 'ECサイト商品画像生成（50点）',
    taskDetail: 'EC商品の背景除去・リサイズ・ウォーターマーク追加を自動処理中。43/50点完了。',
    subtasks: [
      { name: '背景除去（43/50点）', status: 'running', time: '進行中' },
      { name: 'リサイズ・最適化', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cre-008', name: '福田 千夏', role: 'デザイナー（画像生成特化）', team: 'クリエイティブ',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次の画像生成案件待ち。',
    subtasks: [],
  },
  {
    id: 'cre-009', name: '三浦 航', role: 'バナーデザイナー', team: 'クリエイティブ',
    status: 'active', progress: 75,
    currentTask: 'Google広告バナー制作（5サイズ×10種）',
    taskDetail: 'レスポンシブ広告用に5サイズ×10種類のバナーを制作中。37/50枚完了。',
    subtasks: [
      { name: 'レクタングル（10/10）', status: 'done', time: '完了' },
      { name: 'スクエア（10/10）', status: 'done', time: '完了' },
      { name: 'リーダーボード（7/10）', status: 'running', time: '進行中' },
      { name: 'ハーフページ・ビルボード', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'cre-010', name: '岩田 沙織', role: 'バナーデザイナー', team: 'クリエイティブ',
    status: 'active', progress: 60,
    currentTask: 'メルマガヘッダー画像制作',
    taskDetail: '月次メルマガ用のヘッダー画像を制作中。A/Bテスト用に2パターン作成。',
    subtasks: [
      { name: 'パターンA作成', status: 'done', time: '完了' },
      { name: 'パターンB作成', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'cre-011', name: '村上 遥', role: 'バナーデザイナー', team: 'クリエイティブ',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のバナー案件待ち。',
    subtasks: [],
  },
  {
    id: 'cre-012', name: '坂本 悠', role: 'バナーデザイナー', team: 'クリエイティブ',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のバナー案件待ち。',
    subtasks: [],
  },

  // ── テック ──
  {
    id: 'tech-001', name: '内田 雄太', role: 'テックリード', team: 'テック',
    status: 'active', progress: 65,
    currentTask: 'AI自動化システム設計・実装',
    taskDetail: '新規自動化パイプラインの設計・実装中。LangChainを使用したマルチエージェントシステムを構築中。',
    subtasks: [
      { name: 'システム設計', status: 'done', time: '完了' },
      { name: 'コア実装', status: 'running', time: '進行中' },
      { name: 'テスト・デプロイ', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'tech-002', name: '小川 萌', role: 'フロントエンドエンジニア', team: 'テック',
    status: 'active', progress: 80,
    currentTask: 'ダッシュボードUI改善',
    taskDetail: 'React + TailwindCSSでダッシュボードのUIを改善中。レスポンシブ対応とアニメーション追加を実施。',
    subtasks: [
      { name: 'コンポーネント設計', status: 'done', time: '完了' },
      { name: 'UI実装', status: 'running', time: '進行中' },
      { name: 'レスポンシブ対応', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'tech-003', name: '長谷川 蒼', role: 'フロントエンドエンジニア', team: 'テック',
    status: 'active', progress: 55,
    currentTask: 'レポート自動生成UI実装',
    taskDetail: 'クライアント向けレポートの自動生成・PDF出力機能を実装中。',
    subtasks: [
      { name: 'UI設計', status: 'done', time: '完了' },
      { name: 'PDF出力機能', status: 'running', time: '進行中' },
      { name: 'テスト', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'tech-004', name: '藤井 朱音', role: 'バックエンドエンジニア', team: 'テック',
    status: 'active', progress: 60,
    currentTask: 'YouTube自動投稿スクリプト保守',
    taskDetail: 'YouTube Data API v3を使用した自動投稿システムのメンテナンス。API制限エラーを修正中。',
    subtasks: [
      { name: 'エラーログ解析', status: 'done', time: '完了' },
      { name: 'API制限回避ロジック修正', status: 'running', time: '進行中' },
      { name: 'テスト・本番デプロイ', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'tech-005', name: '近藤 拓海', role: 'バックエンドエンジニア', team: 'テック',
    status: 'active', progress: 45,
    currentTask: 'Webhook連携システム構築',
    taskDetail: 'Make.comとの連携Webhookを構築中。SNS投稿・メルマガ配信の自動トリガーを設定。',
    subtasks: [
      { name: 'Webhook設計', status: 'done', time: '完了' },
      { name: 'Make.com連携実装', status: 'running', time: '進行中' },
      { name: 'テスト', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'tech-006', name: '石井 夏希', role: 'インフラエンジニア', team: 'テック',
    status: 'active', progress: 70,
    currentTask: 'Railway/Vercelインフラ監視・最適化',
    taskDetail: 'Railway（バックエンド）とVercel（フロントエンド）のインフラを監視・最適化中。',
    subtasks: [
      { name: 'パフォーマンス監視設定', status: 'done', time: '完了' },
      { name: 'コスト最適化', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'tech-007', name: '上田 竜也', role: 'APIエンジニア', team: 'テック',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のAPI連携案件待ち。',
    subtasks: [],
  },
  {
    id: 'tech-008', name: '原田 葵', role: 'APIエンジニア', team: 'テック',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のAPI連携案件待ち。',
    subtasks: [],
  },
  {
    id: 'tech-009', name: '中島 隆', role: 'データエンジニア', team: 'テック',
    status: 'active', progress: 50,
    currentTask: 'アナリティクスデータ集計パイプライン構築',
    taskDetail: 'Google Analytics・YouTube Analytics・Meta Adsのデータを統合するパイプラインを構築中。',
    subtasks: [
      { name: 'データソース接続', status: 'done', time: '完了' },
      { name: 'ETL処理実装', status: 'running', time: '進行中' },
      { name: 'ダッシュボード連携', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'tech-010', name: '野村 詩織', role: 'データエンジニア', team: 'テック',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のデータ案件待ち。',
    subtasks: [],
  },

  // ── ビジネス開発 ──
  {
    id: 'biz-001', name: '菊地 誠', role: 'ビジネス開発ディレクター', team: 'ビジネス開発',
    status: 'active', progress: 72,
    currentTask: '新規クライアント獲得戦略策定',
    taskDetail: '今月の新規クライアント目標5社に対し、現在3社と商談中。提案資料を作成・送付済み。',
    subtasks: [
      { name: 'ターゲットリスト作成', status: 'done', time: '完了' },
      { name: 'アプローチメール送付', status: 'done', time: '完了' },
      { name: '商談フォローアップ', status: 'running', time: '3社対応中' },
    ],
  },
  {
    id: 'biz-002', name: '丸山 由佳', role: '営業エージェント', team: 'ビジネス開発',
    status: 'active', progress: 60,
    currentTask: '営業メール送信（50件/日）',
    taskDetail: '見込み客リストへの営業メールを自動送信中。開封率・返信率を追跡中。',
    subtasks: [
      { name: 'リスト整備', status: 'done', time: '完了' },
      { name: 'メール送信（35/50件）', status: 'running', time: '進行中' },
      { name: '返信対応', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'biz-003', name: '池田 翼', role: '営業エージェント', team: 'ビジネス開発',
    status: 'active', progress: 45,
    currentTask: 'LinkedIn営業DM送信',
    taskDetail: 'LinkedInで見込み客にDMを送信中。パーソナライズされたメッセージを自動生成して送付。',
    subtasks: [
      { name: 'ターゲット選定', status: 'done', time: '完了' },
      { name: 'DM送信（22/50件）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'biz-004', name: '桐島 彩', role: '営業エージェント', team: 'ビジネス開発',
    status: 'active', progress: 80,
    currentTask: '提案資料作成（クライアント候補D社）',
    taskDetail: 'D社向けの提案資料を作成中。競合分析・ROI試算・導入事例を盛り込んだ資料を作成。',
    subtasks: [
      { name: '競合分析', status: 'done', time: '完了' },
      { name: 'ROI試算', status: 'done', time: '完了' },
      { name: '資料デザイン・仕上げ', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'biz-005', name: '今井 大翔', role: 'マーケティングエージェント', team: 'ビジネス開発',
    status: 'active', progress: 65,
    currentTask: 'Meta広告キャンペーン最適化',
    taskDetail: '現在稼働中の広告キャンペーン5本のパフォーマンスを分析・最適化中。CPAを20%削減目標。',
    subtasks: [
      { name: 'パフォーマンス分析', status: 'done', time: '完了' },
      { name: 'ターゲティング調整', status: 'running', time: '進行中' },
      { name: 'クリエイティブA/Bテスト', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'biz-006', name: '浜田 咲', role: 'マーケティングエージェント', team: 'ビジネス開発',
    status: 'active', progress: 55,
    currentTask: 'Google広告キャンペーン管理',
    taskDetail: 'Google検索広告・ディスプレイ広告の入札調整・キーワード最適化を実施中。',
    subtasks: [
      { name: '入札調整', status: 'done', time: '完了' },
      { name: 'キーワード最適化', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'biz-007', name: '宮崎 悠人', role: '見込み客分析エージェント', team: 'ビジネス開発',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次の分析案件待ち。',
    subtasks: [],
  },
  {
    id: 'biz-008', name: '金子 凛', role: '見込み客分析エージェント', team: 'ビジネス開発',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次の分析案件待ち。',
    subtasks: [],
  },

  // ── オペレーション ──
  {
    id: 'ops-001', name: '横山 敬', role: 'オペレーションマネージャー', team: 'オペレーション',
    status: 'active', progress: 68,
    currentTask: '業務フロー改善・自動化推進',
    taskDetail: '繰り返し作業の自動化率を向上させるため、Make.com・Zapierのフローを最適化中。',
    subtasks: [
      { name: '現状分析', status: 'done', time: '完了' },
      { name: 'Make.comフロー最適化', status: 'running', time: '進行中' },
      { name: 'Zapier連携設定', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'ops-002', name: '平野 亜美', role: 'スケジューラーエージェント', team: 'オペレーション',
    status: 'active', progress: 85,
    currentTask: '来週のミーティングスケジュール調整',
    taskDetail: '来週の全社ミーティング・クライアントMTGのスケジュールを調整中。カレンダー招待を自動送信。',
    subtasks: [
      { name: '空き時間確認', status: 'done', time: '完了' },
      { name: 'カレンダー招待送信', status: 'done', time: '完了' },
      { name: 'リマインダー設定', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'ops-003', name: '和田 慶太', role: 'スケジューラーエージェント', team: 'オペレーション',
    status: 'active', progress: 70,
    currentTask: 'コンテンツ投稿スケジュール管理',
    taskDetail: '全クライアントのSNS・YouTube・ブログ投稿スケジュールを一元管理中。',
    subtasks: [
      { name: '今週分スケジュール確認', status: 'done', time: '完了' },
      { name: '来週分スケジュール作成', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'ops-004', name: '藤原 柚希', role: 'メール対応エージェント', team: 'オペレーション',
    status: 'active', progress: 90,
    currentTask: '受信メール自動分類・返信（95件）',
    taskDetail: '本日の受信メール95件を自動分類・優先度付け・定型返信を実施。重要案件は担当者にエスカレーション。',
    subtasks: [
      { name: 'メール分類（95/95件）', status: 'done', time: '完了' },
      { name: '定型返信（85/95件）', status: 'running', time: '進行中' },
      { name: 'エスカレーション対応', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'ops-005', name: '石橋 陸', role: 'メール対応エージェント', team: 'オペレーション',
    status: 'active', progress: 75,
    currentTask: 'クライアントメール対応（優先案件）',
    taskDetail: '優先度の高いクライアントメール10件に対して、カスタマイズされた返信を作成・送信中。',
    subtasks: [
      { name: '優先メール確認', status: 'done', time: '完了' },
      { name: '返信作成・送信（7/10件）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'ops-006', name: '大野 花音', role: 'カスタマーサポートエージェント', team: 'オペレーション',
    status: 'active', progress: 80,
    currentTask: 'チャットサポート対応（問い合わせ20件）',
    taskDetail: 'Webサイトのチャットサポートで問い合わせ対応中。FAQ自動回答率92%を維持。',
    subtasks: [
      { name: 'FAQ自動回答', status: 'done', time: '18/20件自動対応' },
      { name: '有人対応（2件）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'ops-007', name: '谷口 樹', role: 'カスタマーサポートエージェント', team: 'オペレーション',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のサポート案件待ち。',
    subtasks: [],
  },
  {
    id: 'ops-008', name: '永田 澪', role: 'データ入力エージェント', team: 'オペレーション',
    status: 'active', progress: 60,
    currentTask: 'CRMデータ更新（新規リード200件）',
    taskDetail: '営業チームから受け取った新規リード200件のCRMデータ入力・整理を実施中。',
    subtasks: [
      { name: 'データ整形', status: 'done', time: '完了' },
      { name: 'CRM入力（120/200件）', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'ops-009', name: '島田 蓮', role: 'データ入力エージェント', team: 'オペレーション',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のデータ入力案件待ち。',
    subtasks: [],
  },

  // ── QA・分析 ──
  {
    id: 'qa-001', name: '森田 光輝', role: 'QAリード', team: 'QA・分析',
    status: 'active', progress: 75,
    currentTask: 'コンテンツ品質基準策定・管理',
    taskDetail: '全コンテンツの品質基準を策定・管理中。誤字脱字・ブランドガイドライン準拠・SEO最適化を自動チェック。',
    subtasks: [
      { name: '品質基準ドキュメント作成', status: 'done', time: '完了' },
      { name: '自動チェックシステム設定', status: 'running', time: '進行中' },
    ],
  },
  {
    id: 'qa-002', name: '竹内 梨花', role: '品質管理エージェント', team: 'QA・分析',
    status: 'active', progress: 95,
    currentTask: 'バナー品質チェック（バッチ1-2: 400枚）',
    taskDetail: '生成済みバナー400枚の品質チェック中。解像度・ブランドガイドライン準拠・テキスト誤字を自動検査。380/400枚完了。',
    subtasks: [
      { name: '解像度チェック（400/400枚）', status: 'done', time: '完了' },
      { name: 'ブランドガイドライン確認（380/400枚）', status: 'running', time: '進行中' },
      { name: 'テキスト誤字チェック', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'qa-003', name: '松井 隼', role: '品質管理エージェント', team: 'QA・分析',
    status: 'active', progress: 70,
    currentTask: 'コンテンツ誤字脱字チェック（今週分）',
    taskDetail: '今週公開予定のブログ記事・SNS投稿・メルマガの誤字脱字・文法チェックを実施中。',
    subtasks: [
      { name: 'ブログ記事チェック', status: 'done', time: '完了' },
      { name: 'SNS投稿チェック', status: 'running', time: '進行中' },
      { name: 'メルマガチェック', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'qa-004', name: '川口 芽依', role: 'データアナリスト', team: 'QA・分析',
    status: 'active', progress: 65,
    currentTask: '月次パフォーマンスレポート作成',
    taskDetail: '全クライアントの月次パフォーマンスレポートを作成中。YouTube・SNS・広告の成果をまとめ、改善提案を作成。',
    subtasks: [
      { name: 'データ収集・集計', status: 'done', time: '完了' },
      { name: 'グラフ・可視化作成', status: 'running', time: '進行中' },
      { name: '改善提案まとめ', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'qa-005', name: '阿部 颯', role: 'データアナリスト', team: 'QA・分析',
    status: 'active', progress: 50,
    currentTask: 'A/Bテスト結果分析',
    taskDetail: '先月実施したメルマガ件名・広告クリエイティブのA/Bテスト結果を統計的に分析中。',
    subtasks: [
      { name: 'データ収集', status: 'done', time: '完了' },
      { name: '統計分析', status: 'running', time: '進行中' },
      { name: 'レポート作成', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'qa-006', name: '田村 心', role: 'レポートエージェント', team: 'QA・分析',
    status: 'active', progress: 85,
    currentTask: '週次クライアントレポート自動生成',
    taskDetail: '全クライアント向けの週次レポートをPDF形式で自動生成・送付中。5社分のレポートを作成。',
    subtasks: [
      { name: 'データ取得・整形', status: 'done', time: '完了' },
      { name: 'PDF生成（4/5社）', status: 'running', time: '進行中' },
      { name: 'メール送付', status: 'pending', time: '待機中' },
    ],
  },
  {
    id: 'qa-007', name: '中野 涼太', role: 'レポートエージェント', team: 'QA・分析',
    status: 'idle', progress: 0,
    currentTask: '待機中',
    taskDetail: '次のレポート案件待ち。',
    subtasks: [],
  },
  {
    id: 'qa-008', name: '岡本 彩乃', role: 'インサイトエージェント', team: 'QA・分析',
    status: 'active', progress: 55,
    currentTask: 'トレンド分析・競合調査',
    taskDetail: '業界トレンドと競合他社の動向を分析中。SNSトレンド・検索ボリューム変化・競合コンテンツ戦略を調査。',
    subtasks: [
      { name: 'SNSトレンド分析', status: 'done', time: '完了' },
      { name: '競合コンテンツ調査', status: 'running', time: '進行中' },
      { name: 'インサイトレポート作成', status: 'pending', time: '待機中' },
    ],
  },
];

const TEAM_COLORS = {
  'マネジメント':   'text-purple-300 bg-purple-500/20',
  'コンテンツ':     'text-blue-300 bg-blue-500/20',
  'クリエイティブ': 'text-pink-300 bg-pink-500/20',
  'テック':         'text-cyan-300 bg-cyan-500/20',
  'ビジネス開発':   'text-green-300 bg-green-500/20',
  'オペレーション': 'text-orange-300 bg-orange-500/20',
  'QA・分析':       'text-yellow-300 bg-yellow-500/20',
};

const subtaskStatusIcon = {
  done:    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />,
  running: <Cpu className="w-3.5 h-3.5 text-blue-400 animate-pulse flex-shrink-0" />,
  pending: <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />,
  error:   <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />,
};

const AgentCard = ({ agent, isExpanded, onToggle }) => {
  const isActive = agent.status === 'active';
  const teamColor = TEAM_COLORS[agent.team] || 'text-gray-400 bg-gray-700';

  return (
    <div className={`bg-neo-card rounded-2xl border transition-all duration-300 ${
      isActive ? 'border-green-500/30 shadow-lg shadow-green-500/5' : 'border-neo-blue/10'
    }`}>
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3 mb-3">
          {/* アバター */}
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl(agent.name)}
              alt={agent.name}
              className={`w-12 h-12 rounded-full border-2 object-cover ${
                isActive ? 'border-green-400' : 'border-gray-600'
              }`}
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className={`w-12 h-12 rounded-full hidden items-center justify-center text-lg font-bold ${
                isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'
              }`}
              style={{ display: 'none' }}
            >
              {agent.name.charAt(0)}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-neo-card ${
              isActive ? 'bg-green-400 animate-pulse' : 'bg-yellow-500'
            }`} />
          </div>

          {/* 名前・役職 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-white text-sm truncate">{agent.name}</p>
              {isExpanded
                ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              }
            </div>
            <p className="text-xs text-gray-400 truncate">{agent.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${isActive ? 'text-green-400' : 'text-yellow-400'}`}>
                {isActive ? '● 稼働中' : '○ 待機中'}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${teamColor}`}>{agent.team}</span>
            </div>
          </div>
        </div>

        {/* 現在のタスク */}
        <div className={`rounded-lg p-2.5 ${
          isActive ? 'bg-green-500/5 border border-green-500/20' : 'bg-gray-800/50'
        }`}>
          <p className="text-xs text-gray-400 mb-0.5">現在のタスク</p>
          <p className="text-xs text-white font-medium leading-snug">{agent.currentTask}</p>
        </div>

        {/* プログレスバー */}
        {isActive && agent.progress > 0 && (
          <div className="mt-2.5">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>進捗</span>
              <span>{agent.progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-neo-blue to-neo-cyan h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 展開パネル */}
      {isExpanded && agent.subtasks.length > 0 && (
        <div className="px-4 pb-4 border-t border-neo-blue/10 pt-3">
          <p className="text-xs text-gray-400 mb-2 font-medium">作業詳細</p>
          <p className="text-xs text-gray-300 mb-3 leading-relaxed">{agent.taskDetail}</p>
          <div className="space-y-1.5">
            {agent.subtasks.map((sub, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {subtaskStatusIcon[sub.status] || subtaskStatusIcon.pending}
                <span className={`flex-1 ${sub.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                  {sub.name}
                </span>
                <span className="text-gray-500 flex-shrink-0">{sub.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AgentOps = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [teamFilter, setTeamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const teams = ['all', 'マネジメント', 'コンテンツ', 'クリエイティブ', 'テック', 'ビジネス開発', 'オペレーション', 'QA・分析'];
  const activeCount = AGENT_DATA.filter(a => a.status === 'active').length;
  const idleCount = AGENT_DATA.filter(a => a.status === 'idle').length;

  const filtered = AGENT_DATA.filter(a => {
    const teamOk = teamFilter === 'all' || a.team === teamFilter;
    const statusOk = statusFilter === 'all' || a.status === statusFilter;
    return teamOk && statusOk;
  });

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">エージェント稼働状況</h2>
          <p className="text-gray-400 text-sm mt-1">
            全 <span className="text-white font-bold">{AGENT_DATA.length}</span> 名 ／
            稼働中 <span className="text-green-400 font-bold">{activeCount}</span> 名 ／
            待機中 <span className="text-yellow-400 font-bold">{idleCount}</span> 名
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="font-bold text-sm">LIVE</span>
        </div>
      </div>

      {/* チームフィルター */}
      <div className="flex gap-2 flex-wrap">
        {teams.map(team => (
          <button
            key={team}
            onClick={() => setTeamFilter(team)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              teamFilter === team
                ? 'bg-neo-blue text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {team === 'all'
              ? `全チーム (${AGENT_DATA.length})`
              : `${team} (${AGENT_DATA.filter(a => a.team === team).length})`}
          </button>
        ))}
      </div>

      {/* ステータスフィルター */}
      <div className="flex gap-2 items-center">
        {[
          { key: 'all',    label: '全員',   count: AGENT_DATA.length },
          { key: 'active', label: '稼働中', count: activeCount },
          { key: 'idle',   label: '待機中', count: idleCount },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === s.key
                ? s.key === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : s.key === 'idle' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  : 'bg-neo-blue/20 text-neo-blue border border-neo-blue/40'
                : 'bg-gray-800 text-gray-400 border border-transparent hover:text-white'
            }`}
          >
            {s.label} {s.count}名
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">{filtered.length}名表示中</span>
      </div>

      {/* エージェントグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isExpanded={expandedId === agent.id}
            onToggle={() => toggle(agent.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentOps;
