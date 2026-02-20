import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── 67名分のエージェントマスターデータ ───────────────────────────────────────
const INITIAL_AGENTS = [
  // マネジメント（6名）
  { id: 1,  name: '田中 誠一',   role: 'CEO / 総括マネージャー',        team: 'マネジメント',     status: 'active', tasks: 15, currentTask: '全体戦略レビュー・KPI確認' },
  { id: 2,  name: '山本 恵子',   role: 'COO / 運営統括',                team: 'マネジメント',     status: 'active', tasks: 12, currentTask: '運営プロセス最適化' },
  { id: 3,  name: '佐藤 大輔',   role: 'プロジェクトマネージャー',       team: 'マネジメント',     status: 'active', tasks: 10, currentTask: 'YouTube運用プロジェクト全体管理' },
  { id: 4,  name: '鈴木 美咲',   role: 'プロジェクトマネージャー',       team: 'マネジメント',     status: 'active', tasks: 8,  currentTask: 'バナー広告制作プロジェクト管理' },
  { id: 5,  name: '高橋 拓也',   role: 'プロジェクトマネージャー',       team: 'マネジメント',     status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 6,  name: '伊藤 さくら', role: 'アシスタントマネージャー',       team: 'マネジメント',     status: 'active', tasks: 6,  currentTask: '週次ミーティング議事録作成・配布' },
  // コンテンツ（14名）
  { id: 7,  name: '中村 陽介',   role: 'コンテンツディレクター',         team: 'コンテンツ',       status: 'active', tasks: 9,  currentTask: 'コンテンツカレンダー策定（翌月分）' },
  { id: 8,  name: '小林 奈々',   role: 'YouTubeディレクター',            team: 'コンテンツ',       status: 'active', tasks: 7,  currentTask: 'YouTube動画構成・台本レビュー' },
  { id: 9,  name: '加藤 翔太',   role: 'YouTube編集者',                  team: 'コンテンツ',       status: 'active', tasks: 5,  currentTask: 'YouTube動画編集（クライアントA 第3話）' },
  { id: 10, name: '吉田 彩花',   role: 'YouTube編集者',                  team: 'コンテンツ',       status: 'active', tasks: 4,  currentTask: 'YouTube動画編集（クライアントB 第7話）' },
  { id: 11, name: '山田 健太',   role: 'YouTube編集者',                  team: 'コンテンツ',       status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 12, name: '渡辺 里奈',   role: 'コンテンツライター',             team: 'コンテンツ',       status: 'active', tasks: 6,  currentTask: 'note記事執筆（週次2本）' },
  { id: 13, name: '松本 浩二',   role: 'コンテンツライター',             team: 'コンテンツ',       status: 'active', tasks: 4,  currentTask: 'ホワイトペーパー作成（AI活用事例集）' },
  { id: 14, name: '井上 ひとみ', role: 'SNSライター',                    team: 'コンテンツ',       status: 'active', tasks: 8,  currentTask: 'X/Instagram投稿文生成（1日3投稿）' },
  { id: 15, name: '木村 蓮',     role: 'SNSライター',                    team: 'コンテンツ',       status: 'active', tasks: 5,  currentTask: 'TikTok・Reels用キャプション作成' },
  { id: 16, name: '林 真由',     role: 'ブログライター',                 team: 'コンテンツ',       status: 'active', tasks: 3,  currentTask: 'SEOブログ記事執筆（月4本）' },
  { id: 17, name: '清水 悠斗',   role: 'ブログライター',                 team: 'コンテンツ',       status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 18, name: '山口 菜摘',   role: 'メルマガライター',               team: 'コンテンツ',       status: 'active', tasks: 2,  currentTask: '週次メルマガ作成（配信数3,200件）' },
  { id: 19, name: '斎藤 颯太',   role: 'スクリプトライター',             team: 'コンテンツ',       status: 'active', tasks: 4,  currentTask: 'YouTube台本作成（クライアントC 第5話）' },
  { id: 20, name: '松田 愛',     role: 'スクリプトライター',             team: 'コンテンツ',       status: 'idle',   tasks: 0,  currentTask: '待機中' },
  // クリエイティブ（12名）
  { id: 21, name: '橋本 隼人',   role: 'クリエイティブディレクター',     team: 'クリエイティブ',   status: 'active', tasks: 7,  currentTask: 'ブランドガイドライン策定（新規クライアント）' },
  { id: 22, name: '岡田 結衣',   role: 'デザイナー',                     team: 'クリエイティブ',   status: 'active', tasks: 5,  currentTask: 'YouTubeサムネイル生成（クライアントA）' },
  { id: 23, name: '石川 大地',   role: 'デザイナー',                     team: 'クリエイティブ',   status: 'active', tasks: 3,  currentTask: 'SNS投稿用バナー制作（クライアントB）' },
  { id: 24, name: '前田 麻衣',   role: 'デザイナー',                     team: 'クリエイティブ',   status: 'active', tasks: 4,  currentTask: 'LP（ランディングページ）デザイン' },
  { id: 25, name: '藤田 涼介',   role: 'デザイナー（画像生成特化）',     team: 'クリエイティブ',   status: 'active', tasks: 6,  currentTask: 'Meta広告バナー並列生成（バッチ3）' },
  { id: 26, name: '後藤 莉子',   role: 'デザイナー（画像生成特化）',     team: 'クリエイティブ',   status: 'active', tasks: 6,  currentTask: 'Meta広告バナー並列生成（バッチ3）' },
  { id: 27, name: '西村 光',     role: 'デザイナー（画像生成特化）',     team: 'クリエイティブ',   status: 'active', tasks: 5,  currentTask: 'ECサイト商品画像生成（50点）' },
  { id: 28, name: '福田 千夏',   role: 'デザイナー（画像生成特化）',     team: 'クリエイティブ',   status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 29, name: '三浦 航',     role: 'バナーデザイナー',               team: 'クリエイティブ',   status: 'active', tasks: 8,  currentTask: 'Google広告バナー制作（5サイズ×10種）' },
  { id: 30, name: '岩田 沙織',   role: 'バナーデザイナー',               team: 'クリエイティブ',   status: 'active', tasks: 7,  currentTask: 'メルマガヘッダー画像制作' },
  { id: 31, name: '村上 遥',     role: 'バナーデザイナー',               team: 'クリエイティブ',   status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 32, name: '坂本 悠',     role: 'バナーデザイナー',               team: 'クリエイティブ',   status: 'idle',   tasks: 0,  currentTask: '待機中' },
  // テック（10名）
  { id: 33, name: '内田 雄太',   role: 'テックリード',                   team: 'テック',           status: 'active', tasks: 6,  currentTask: 'AI自動化システム設計・実装' },
  { id: 34, name: '小川 萌',     role: 'フロントエンドエンジニア',       team: 'テック',           status: 'active', tasks: 4,  currentTask: 'ダッシュボードUI改善' },
  { id: 35, name: '長谷川 蒼',   role: 'フロントエンドエンジニア',       team: 'テック',           status: 'active', tasks: 3,  currentTask: 'レポート自動生成UI実装' },
  { id: 36, name: '藤井 朱音',   role: 'バックエンドエンジニア',         team: 'テック',           status: 'active', tasks: 5,  currentTask: 'YouTube自動投稿スクリプト保守' },
  { id: 37, name: '近藤 拓海',   role: 'バックエンドエンジニア',         team: 'テック',           status: 'active', tasks: 4,  currentTask: 'Webhook連携システム構築' },
  { id: 38, name: '石井 夏希',   role: 'インフラエンジニア',             team: 'テック',           status: 'active', tasks: 3,  currentTask: 'Railway/Vercelインフラ監視・最適化' },
  { id: 39, name: '上田 竜也',   role: 'APIエンジニア',                  team: 'テック',           status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 40, name: '原田 葵',     role: 'APIエンジニア',                  team: 'テック',           status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 41, name: '中島 隆',     role: 'データエンジニア',               team: 'テック',           status: 'active', tasks: 2,  currentTask: 'アナリティクスデータ集計パイプライン構築' },
  { id: 42, name: '野村 詩織',   role: 'データエンジニア',               team: 'テック',           status: 'idle',   tasks: 0,  currentTask: '待機中' },
  // ビジネス開発（8名）
  { id: 43, name: '菊地 誠',     role: 'ビジネス開発ディレクター',       team: 'ビジネス開発',     status: 'active', tasks: 8,  currentTask: '新規クライアント獲得戦略策定' },
  { id: 44, name: '丸山 由佳',   role: '営業エージェント',               team: 'ビジネス開発',     status: 'active', tasks: 6,  currentTask: '営業メール送信（50件/日）' },
  { id: 45, name: '池田 翼',     role: '営業エージェント',               team: 'ビジネス開発',     status: 'active', tasks: 5,  currentTask: 'LinkedIn営業DM送信' },
  { id: 46, name: '桐島 彩',     role: '営業エージェント',               team: 'ビジネス開発',     status: 'active', tasks: 4,  currentTask: '提案資料作成（クライアント候補D社）' },
  { id: 47, name: '今井 大翔',   role: 'マーケティングエージェント',     team: 'ビジネス開発',     status: 'active', tasks: 7,  currentTask: 'Meta広告キャンペーン最適化' },
  { id: 48, name: '浜田 咲',     role: 'マーケティングエージェント',     team: 'ビジネス開発',     status: 'active', tasks: 5,  currentTask: 'Google広告キャンペーン管理' },
  { id: 49, name: '宮崎 悠人',   role: '見込み客分析エージェント',       team: 'ビジネス開発',     status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 50, name: '金子 凛',     role: '見込み客分析エージェント',       team: 'ビジネス開発',     status: 'idle',   tasks: 0,  currentTask: '待機中' },
  // オペレーション（9名）
  { id: 51, name: '横山 敬',     role: 'オペレーションマネージャー',     team: 'オペレーション',   status: 'active', tasks: 7,  currentTask: '業務フロー改善・自動化推進' },
  { id: 52, name: '平野 亜美',   role: 'スケジューラーエージェント',     team: 'オペレーション',   status: 'active', tasks: 5,  currentTask: '来週のミーティングスケジュール調整' },
  { id: 53, name: '和田 慶太',   role: 'スケジューラーエージェント',     team: 'オペレーション',   status: 'active', tasks: 4,  currentTask: 'コンテンツ投稿スケジュール管理' },
  { id: 54, name: '藤原 柚希',   role: 'メール対応エージェント',         team: 'オペレーション',   status: 'active', tasks: 9,  currentTask: '受信メール自動分類・返信（95件）' },
  { id: 55, name: '石橋 陸',     role: 'メール対応エージェント',         team: 'オペレーション',   status: 'active', tasks: 8,  currentTask: 'クライアントメール対応（優先案件）' },
  { id: 56, name: '大野 花音',   role: 'カスタマーサポートエージェント', team: 'オペレーション',   status: 'active', tasks: 6,  currentTask: 'チャットサポート対応（問い合わせ20件）' },
  { id: 57, name: '谷口 樹',     role: 'カスタマーサポートエージェント', team: 'オペレーション',   status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 58, name: '永田 澪',     role: 'データ入力エージェント',         team: 'オペレーション',   status: 'active', tasks: 3,  currentTask: 'CRMデータ更新（新規リード200件）' },
  { id: 59, name: '島田 蓮',     role: 'データ入力エージェント',         team: 'オペレーション',   status: 'idle',   tasks: 0,  currentTask: '待機中' },
  // QA・分析（8名）
  { id: 60, name: '森田 光輝',   role: 'QAリード',                       team: 'QA・分析',         status: 'active', tasks: 5,  currentTask: 'コンテンツ品質基準策定・管理' },
  { id: 61, name: '竹内 梨花',   role: '品質管理エージェント',           team: 'QA・分析',         status: 'active', tasks: 4,  currentTask: 'バナー品質チェック（バッチ1-2: 400枚）' },
  { id: 62, name: '松井 隼',     role: '品質管理エージェント',           team: 'QA・分析',         status: 'active', tasks: 3,  currentTask: 'コンテンツ誤字脱字チェック（今週分）' },
  { id: 63, name: '川口 芽依',   role: 'データアナリスト',               team: 'QA・分析',         status: 'active', tasks: 6,  currentTask: '月次パフォーマンスレポート作成' },
  { id: 64, name: '阿部 颯',     role: 'データアナリスト',               team: 'QA・分析',         status: 'active', tasks: 4,  currentTask: 'A/Bテスト結果分析' },
  { id: 65, name: '田村 心',     role: 'レポートエージェント',           team: 'QA・分析',         status: 'active', tasks: 3,  currentTask: '週次クライアントレポート自動生成' },
  { id: 66, name: '中野 涼太',   role: 'レポートエージェント',           team: 'QA・分析',         status: 'idle',   tasks: 0,  currentTask: '待機中' },
  { id: 67, name: '岡本 彩乃',   role: 'インサイトエージェント',         team: 'QA・分析',         status: 'active', tasks: 2,  currentTask: 'トレンド分析・競合調査' },
];

// ─── タスクログの初期データ ───────────────────────────────────────────────────
const INITIAL_TASK_LOG = [
  { id: 1, agentId: 1, agentName: '田中 誠一', task: '月次KPIレポート確認', assignedBy: '管理者', assignedAt: '2026-02-20 09:00', status: 'done' },
  { id: 2, agentId: 8, agentName: '小林 奈々', task: 'YouTube動画構成・台本レビュー', assignedBy: '管理者', assignedAt: '2026-02-20 09:30', status: 'active' },
  { id: 3, agentId: 25, agentName: '藤田 涼介', task: 'Meta広告バナー並列生成（バッチ3）', assignedBy: '管理者', assignedAt: '2026-02-20 10:00', status: 'active' },
];

// ─── チャットログの初期データ ─────────────────────────────────────────────────
const INITIAL_CHAT_LOG = [
  { id: 1, agentId: 1, agentName: '田中 誠一', from: 'agent', message: '月次KPIレポートの確認が完了しました。全部門の進捗は概ね順調です。', timestamp: '2026-02-20 09:15' },
  { id: 2, agentId: 8, agentName: '小林 奈々', from: 'agent', message: '動画2本の台本レビューが完了しました。3本目に取り掛かっています。', timestamp: '2026-02-20 10:05' },
];

// ─── Context作成 ─────────────────────────────────────────────────────────────
const AgentContext = createContext(null);

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [taskLog, setTaskLog] = useState(INITIAL_TASK_LOG);
  const [chatLog, setChatLog] = useState(INITIAL_CHAT_LOG);
  const [currentUser, setCurrentUser] = useState(null); // null = 未ログイン

  // 稼働状況トグル
  const toggleAgentStatus = useCallback((agentId) => {
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? { ...a, status: a.status === 'active' ? 'idle' : 'active', tasks: a.status === 'active' ? 0 : a.tasks }
        : a
    ));
  }, []);

  // タスク割り当て
  const assignTask = useCallback((agentId, taskText) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    // エージェントを稼働中にしてタスクを更新
    setAgents(prev => prev.map(a =>
      a.id === agentId
        ? { ...a, status: 'active', currentTask: taskText, tasks: a.tasks + 1 }
        : a
    ));
    // タスクログに追加
    setTaskLog(prev => [...prev, {
      id: Date.now(),
      agentId,
      agentName: agent.name,
      task: taskText,
      assignedBy: currentUser?.name || '管理者',
      assignedAt: new Date().toLocaleString('ja-JP'),
      status: 'active',
    }]);
    // チャットログにシステムメッセージ追加
    setChatLog(prev => [...prev, {
      id: Date.now() + 1,
      agentId,
      agentName: agent.name,
      from: 'system',
      message: `「${taskText}」のタスクが割り当てられました。`,
      timestamp: new Date().toLocaleString('ja-JP'),
    }]);
  }, [agents, currentUser]);

  // エージェントへのチャット送信
  const sendChatMessage = useCallback((agentId, message) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    // ユーザーメッセージ追加
    setChatLog(prev => [...prev, {
      id: Date.now(),
      agentId,
      agentName: agent.name,
      from: 'user',
      message,
      timestamp: new Date().toLocaleString('ja-JP'),
    }]);
    // エージェントの自動返信（モック）
    setTimeout(() => {
      const replies = [
        '了解しました。すぐに取り掛かります。',
        '承知しました。現在の作業を完了次第、対応します。',
        '指示を受け取りました。優先度を上げて対応します。',
        'ありがとうございます。詳細を確認して作業を開始します。',
        '了解です。完了したら報告します。',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChatLog(prev => [...prev, {
        id: Date.now() + 1,
        agentId,
        agentName: agent.name,
        from: 'agent',
        message: reply,
        timestamp: new Date().toLocaleString('ja-JP'),
      }]);
    }, 800);
  }, [agents]);

  // ログイン
  const login = useCallback((email, password) => {
    // モック認証（実際はAPI連携が必要）
    const users = [
      { id: 1, name: '管理者', email: 'admin@ai-agency.jp', role: 'admin', password: 'admin123' },
      { id: 2, name: '田中 誠一', email: 'tanaka@ai-agency.jp', role: 'manager', password: 'tanaka123' },
    ];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      return { success: true };
    }
    return { success: false, error: 'メールアドレスまたはパスワードが正しくありません' };
  }, []);

  // ログアウト
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const activeCount = agents.filter(a => a.status === 'active').length;
  const totalCount = agents.length;

  return (
    <AgentContext.Provider value={{
      agents,
      taskLog,
      chatLog,
      currentUser,
      activeCount,
      totalCount,
      toggleAgentStatus,
      assignTask,
      sendChatMessage,
      login,
      logout,
    }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgents must be used within AgentProvider');
  return ctx;
};

export default AgentContext;
