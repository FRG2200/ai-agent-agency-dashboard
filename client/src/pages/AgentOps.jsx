import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Cpu, Clock, CheckCircle, AlertCircle, Pause } from 'lucide-react';

// モックデータ: エージェント組織構造
const AGENT_DATA = [
  {
    id: 'pm-001',
    name: 'PM-Alpha',
    role: 'プロジェクトマネージャー',
    team: 'マネジメント',
    status: 'active',
    avatar: '👔',
    currentTask: 'YouTube運用プロジェクト全体管理・進捗確認',
    taskDetail: 'クライアント3社の週次レポート作成中。動画本数: 9/12本完了。次回投稿スケジュール調整中。',
    progress: 75,
    subtasks: [
      { name: 'クライアントAレポート作成', status: 'done', time: '完了' },
      { name: 'クライアントBレポート作成', status: 'done', time: '完了' },
      { name: 'クライアントCレポート作成', status: 'running', time: '進行中' },
      { name: '来週スケジュール確定', status: 'pending', time: '待機中' },
    ],
    subordinates: ['designer-001', 'designer-002', 'coder-001'],
  },
  {
    id: 'pm-002',
    name: 'PM-Beta',
    role: 'プロジェクトマネージャー',
    team: 'マネジメント',
    status: 'active',
    avatar: '🧑‍💼',
    currentTask: 'バナー広告制作プロジェクト管理',
    taskDetail: 'Meta広告用バナー550枚生成プロジェクト。現在423/550枚完了。画像生成AIを並列稼働中。',
    progress: 77,
    subtasks: [
      { name: '画像生成バッチ1 (1-200枚)', status: 'done', time: '完了' },
      { name: '画像生成バッチ2 (201-400枚)', status: 'done', time: '完了' },
      { name: '画像生成バッチ3 (401-550枚)', status: 'running', time: '423/550枚' },
      { name: '品質チェック・納品', status: 'pending', time: '待機中' },
    ],
    subordinates: ['designer-003', 'designer-004', 'qa-001'],
  },
  {
    id: 'pm-003',
    name: 'PM-Gamma',
    role: 'プロジェクトマネージャー',
    team: 'マネジメント',
    status: 'idle',
    avatar: '👩‍💼',
    currentTask: '待機中',
    taskDetail: '新規案件の受付待ち。営業チームからのブリーフィング待機中。',
    progress: 0,
    subtasks: [],
    subordinates: ['coder-002', 'coder-003'],
  },
  {
    id: 'designer-001',
    name: 'Designer-01',
    role: 'デザイナー',
    team: 'クリエイティブ',
    status: 'active',
    avatar: '🎨',
    currentTask: 'YouTube サムネイル生成 (クライアントA)',
    taskDetail: 'DALL-E 3を使用してYouTubeサムネイル12枚を生成中。A/Bテスト用バリエーション含む。現在8/12枚完了。',
    progress: 67,
    subtasks: [
      { name: 'ブランドガイドライン確認', status: 'done', time: '完了' },
      { name: 'サムネイル生成 (8/12枚)', status: 'running', time: '進行中' },
      { name: 'A/Bテスト用バリエーション', status: 'pending', time: '待機中' },
    ],
    subordinates: [],
  },
  {
    id: 'designer-002',
    name: 'Designer-02',
    role: 'デザイナー',
    team: 'クリエイティブ',
    status: 'active',
    avatar: '🖌️',
    currentTask: 'SNS投稿用バナー制作 (クライアントB)',
    taskDetail: 'Instagram/X用の週次投稿バナー21枚を制作中。Canva APIを使用して自動生成。15/21枚完了。',
    progress: 71,
    subtasks: [
      { name: 'Instagram用 (7/7枚)', status: 'done', time: '完了' },
      { name: 'X用 (5/7枚)', status: 'running', time: '進行中' },
      { name: 'Facebook用 (3/7枚)', status: 'running', time: '進行中' },
    ],
    subordinates: [],
  },
  {
    id: 'designer-003',
    name: 'Designer-03',
    role: 'デザイナー (画像生成特化)',
    team: 'クリエイティブ',
    status: 'active',
    avatar: '🤖',
    currentTask: 'Meta広告バナー並列生成 (バッチ3: 401-475枚)',
    taskDetail: 'Midjourney APIを使用して広告バナーを並列生成中。4スレッド同時稼働。401-475枚担当。現在448/475枚完了。',
    progress: 94,
    subtasks: [
      { name: 'スレッド1 (401-420枚)', status: 'done', time: '完了' },
      { name: 'スレッド2 (421-440枚)', status: 'done', time: '完了' },
      { name: 'スレッド3 (441-460枚)', status: 'running', time: '448/460枚' },
      { name: 'スレッド4 (461-475枚)', status: 'pending', time: '待機中' },
    ],
    subordinates: [],
  },
  {
    id: 'designer-004',
    name: 'Designer-04',
    role: 'デザイナー (画像生成特化)',
    team: 'クリエイティブ',
    status: 'active',
    avatar: '🎭',
    currentTask: 'Meta広告バナー並列生成 (バッチ3: 476-550枚)',
    taskDetail: 'Stable Diffusion XLを使用して広告バナーを生成中。476-550枚担当。現在476/550枚 (開始直後)。',
    progress: 0,
    subtasks: [
      { name: 'モデル初期化', status: 'done', time: '完了' },
      { name: 'バッチ生成 (476-550枚)', status: 'running', time: '476/550枚' },
    ],
    subordinates: [],
  },
  {
    id: 'coder-001',
    name: 'Coder-01',
    role: 'エンジニア',
    team: 'テック',
    status: 'active',
    avatar: '💻',
    currentTask: 'YouTube自動投稿スクリプト保守',
    taskDetail: 'YouTube Data API v3を使用した自動投稿システムのメンテナンス。先週のAPI制限エラーを修正中。',
    progress: 60,
    subtasks: [
      { name: 'エラーログ解析', status: 'done', time: '完了' },
      { name: 'API制限回避ロジック修正', status: 'running', time: '進行中' },
      { name: 'テスト実行', status: 'pending', time: '待機中' },
      { name: '本番デプロイ', status: 'pending', time: '待機中' },
    ],
    subordinates: [],
  },
  {
    id: 'coder-002',
    name: 'Coder-02',
    role: 'エンジニア',
    team: 'テック',
    status: 'idle',
    avatar: '🖥️',
    currentTask: '待機中',
    taskDetail: 'PM-Gammaからのタスク割り当て待ち。',
    progress: 0,
    subtasks: [],
    subordinates: [],
  },
  {
    id: 'coder-003',
    name: 'Coder-03',
    role: 'エンジニア',
    team: 'テック',
    status: 'idle',
    avatar: '⌨️',
    currentTask: '待機中',
    taskDetail: 'PM-Gammaからのタスク割り当て待ち。',
    progress: 0,
    subtasks: [],
    subordinates: [],
  },
  {
    id: 'qa-001',
    name: 'QA-01',
    role: '品質管理',
    team: 'QA',
    status: 'active',
    avatar: '🔍',
    currentTask: 'バナー品質チェック (バッチ1-2: 400枚)',
    taskDetail: '生成済みバナー400枚の品質チェック中。解像度・ブランドガイドライン準拠・テキスト誤字を自動検査。380/400枚チェック完了。',
    progress: 95,
    subtasks: [
      { name: '解像度チェック (400/400枚)', status: 'done', time: '完了' },
      { name: 'ブランドガイドライン確認 (380/400枚)', status: 'running', time: '進行中' },
      { name: 'テキスト誤字チェック', status: 'pending', time: '待機中' },
    ],
    subordinates: [],
  },
  {
    id: 'writer-001',
    name: 'Writer-01',
    role: 'コンテンツライター',
    team: 'コンテンツ',
    status: 'active',
    avatar: '✍️',
    currentTask: 'note記事執筆 (週次2本)',
    taskDetail: 'GPT-4を使用してSEO最適化されたnote記事を執筆中。今週分2本のうち1本完了、2本目執筆中 (3,000字/5,000字)。',
    progress: 80,
    subtasks: [
      { name: '記事1: AIマーケティング入門', status: 'done', time: '完了・公開済み' },
      { name: '記事2: 自動化で売上3倍', status: 'running', time: '3,000/5,000字' },
    ],
    subordinates: [],
  },
  {
    id: 'writer-002',
    name: 'Writer-02',
    role: 'SNSライター',
    team: 'コンテンツ',
    status: 'active',
    avatar: '📱',
    currentTask: 'X/Instagram投稿文生成 (1日3投稿)',
    taskDetail: '本日分のSNS投稿文3本を生成・スケジュール設定済み。明日分の下書き作成中。',
    progress: 100,
    subtasks: [
      { name: '本日X投稿 (3/3本)', status: 'done', time: '完了・予約済み' },
      { name: '本日Instagram投稿 (3/3本)', status: 'done', time: '完了・予約済み' },
      { name: '明日分下書き', status: 'running', time: '進行中' },
    ],
    subordinates: [],
  },
];

const statusConfig = {
  active: { label: '稼働中', color: 'text-green-400', bg: 'bg-green-500', dot: 'bg-green-400' },
  idle: { label: '待機中', color: 'text-yellow-400', bg: 'bg-yellow-500', dot: 'bg-yellow-400' },
  error: { label: 'エラー', color: 'text-red-400', bg: 'bg-red-500', dot: 'bg-red-400' },
};

const subtaskStatusIcon = {
  done: <CheckCircle className="w-4 h-4 text-green-400" />,
  running: <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />,
  pending: <Clock className="w-4 h-4 text-gray-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
};

const AgentCard = ({ agent, isExpanded, onToggle }) => {
  const status = statusConfig[agent.status];
  const isPM = agent.role.includes('プロジェクトマネージャー');

  return (
    <div
      className={`bg-neo-card rounded-2xl border transition-all duration-300 ${
        agent.status === 'active'
          ? 'border-green-500/30 shadow-lg shadow-green-500/5'
          : 'border-neo-blue/10'
      } ${isPM ? 'col-span-1' : ''}`}
    >
      {/* カードヘッダー */}
      <div
        className="p-5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* アバター + ステータスライト */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                agent.status === 'active' ? 'bg-green-500/10' : 'bg-gray-700/50'
              }`}>
                {agent.avatar}
              </div>
              {/* ステータスインジケーター */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neo-card ${status.dot} ${
                agent.status === 'active' ? 'animate-pulse' : ''
              }`} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{agent.name}</p>
              <p className="text-xs text-gray-400">{agent.role}</p>
              <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{agent.team}</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* 現在のタスク */}
        <div className={`rounded-lg p-3 ${
          agent.status === 'active' ? 'bg-green-500/5 border border-green-500/20' : 'bg-gray-800/50'
        }`}>
          <p className="text-xs text-gray-400 mb-1">現在のタスク</p>
          <p className="text-sm text-white font-medium leading-snug">{agent.currentTask}</p>
        </div>

        {/* プログレスバー */}
        {agent.status === 'active' && agent.progress > 0 && (
          <div className="mt-3">
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
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-neo-blue/10 pt-4">
          {/* 詳細説明 */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 font-medium">作業詳細</p>
            <p className="text-sm text-gray-300 leading-relaxed">{agent.taskDetail}</p>
          </div>

          {/* サブタスク一覧 */}
          {agent.subtasks.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">サブタスク</p>
              <div className="space-y-2">
                {agent.subtasks.map((sub, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
                    {subtaskStatusIcon[sub.status]}
                    <span className={`text-sm flex-1 ${
                      sub.status === 'done' ? 'text-gray-400 line-through' :
                      sub.status === 'running' ? 'text-white' : 'text-gray-500'
                    }`}>{sub.name}</span>
                    <span className={`text-xs ${
                      sub.status === 'done' ? 'text-green-400' :
                      sub.status === 'running' ? 'text-blue-400' : 'text-gray-600'
                    }`}>{sub.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AgentOps = () => {
  const [expandedAgents, setExpandedAgents] = useState(new Set(['pm-001', 'pm-002']));
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const toggleExpand = (id) => {
    setExpandedAgents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const teams = ['all', ...new Set(AGENT_DATA.map(a => a.team))];
  const activeCount = AGENT_DATA.filter(a => a.status === 'active').length;
  const idleCount = AGENT_DATA.filter(a => a.status === 'idle').length;

  const filteredAgents = AGENT_DATA.filter(agent => {
    if (filterTeam !== 'all' && agent.team !== filterTeam) return false;
    if (filterStatus !== 'all' && agent.status !== filterStatus) return false;
    return true;
  });

  // チーム別グループ
  const pmAgents = filteredAgents.filter(a => a.role.includes('プロジェクトマネージャー'));
  const otherAgents = filteredAgents.filter(a => !a.role.includes('プロジェクトマネージャー'));

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">エージェント稼働状況</h2>
          <p className="text-gray-400 text-sm mt-1">社内専用 — リアルタイム稼働モニタリング</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">{activeCount}名稼働中</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-yellow-400 text-sm font-medium">{idleCount}名待機中</span>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">チーム:</span>
          {teams.map(team => (
            <button
              key={team}
              onClick={() => setFilterTeam(team)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterTeam === team
                  ? 'bg-neo-blue text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {team === 'all' ? '全て' : team}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-gray-400 text-sm">状態:</span>
          {['all', 'active', 'idle'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterStatus === s
                  ? 'bg-neo-blue text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {s === 'all' ? '全て' : s === 'active' ? '稼働中' : '待機中'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setExpandedAgents(new Set(filteredAgents.map(a => a.id)))}
          className="ml-auto px-3 py-1 text-xs text-gray-400 border border-gray-700 rounded-lg hover:text-white hover:border-gray-500 transition-all"
        >
          全て展開
        </button>
        <button
          onClick={() => setExpandedAgents(new Set())}
          className="px-3 py-1 text-xs text-gray-400 border border-gray-700 rounded-lg hover:text-white hover:border-gray-500 transition-all"
        >
          全て閉じる
        </button>
      </div>

      {/* PM層 */}
      {pmAgents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-neo-blue rounded-full" />
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">マネジメント層</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {pmAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isExpanded={expandedAgents.has(agent.id)}
                onToggle={() => toggleExpand(agent.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 実行層 */}
      {otherAgents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-neo-cyan rounded-full" />
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">実行層</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {otherAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isExpanded={expandedAgents.has(agent.id)}
                onToggle={() => toggleExpand(agent.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 全体サマリー */}
      <div className="bg-neo-card rounded-2xl border border-neo-blue/10 p-6">
        <h3 className="text-sm font-bold text-gray-300 mb-4">本日の稼働サマリー</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: '総エージェント数', value: `${AGENT_DATA.length}名`, color: 'text-white' },
            { label: '稼働中', value: `${activeCount}名`, color: 'text-green-400' },
            { label: '待機中', value: `${idleCount}名`, color: 'text-yellow-400' },
            { label: '完了タスク', value: '127件', color: 'text-neo-cyan' },
            { label: '生成コンテンツ', value: '423枚+', color: 'text-neo-blue' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentOps;
