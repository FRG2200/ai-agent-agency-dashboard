import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Cpu, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { useAgents } from '../context/AgentContext';
import AgentModal from '../components/AgentModal';

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const AGENT_DETAILS = {
  1:  { progress: 82, taskDetail: '月次KPIレビューを実施中。全7部門の進捗を統括。クライアント5社の満足度スコアを分析し、次月戦略を策定中。', subtasks: [{ name: '月次KPIレポート確認', status: 'done', time: '完了' }, { name: '各部門ブリーフィング', status: 'done', time: '完了' }, { name: '次月戦略策定', status: 'running', time: '進行中' }, { name: 'クライアントフィードバック対応', status: 'pending', time: '待機中' }] },
  2:  { progress: 70, taskDetail: '全部門のワークフロー効率化を推進中。自動化率を現在の68%から85%へ引き上げるロードマップを作成中。', subtasks: [{ name: 'ワークフロー分析', status: 'done', time: '完了' }, { name: '自動化ロードマップ作成', status: 'running', time: '進行中' }, { name: '各部門への展開', status: 'pending', time: '待機中' }] },
  3:  { progress: 75, taskDetail: 'クライアント3社のYouTube運用プロジェクトを統括。週次レポート作成中。動画本数9/12本完了。', subtasks: [{ name: 'クライアントAレポート', status: 'done', time: '完了' }, { name: 'クライアントBレポート', status: 'done', time: '完了' }, { name: 'クライアントCレポート', status: 'running', time: '進行中' }] },
  4:  { progress: 77, taskDetail: 'Meta広告用バナー550枚生成プロジェクト。現在423/550枚完了。画像生成AIを並列稼働中。', subtasks: [{ name: '画像生成バッチ1 (1-200枚)', status: 'done', time: '完了' }, { name: '画像生成バッチ2 (201-400枚)', status: 'done', time: '完了' }, { name: '画像生成バッチ3 (401-550枚)', status: 'running', time: '423/550枚' }, { name: '品質チェック・納品', status: 'pending', time: '待機中' }] },
  5:  { progress: 0,  taskDetail: '新規案件の受付待ち。営業チームからのブリーフィング待機中。', subtasks: [] },
  6:  { progress: 60, taskDetail: '全部門の週次ミーティング議事録をまとめ、関係者へ配布中。アクションアイテムの進捗管理も担当。', subtasks: [{ name: '議事録まとめ', status: 'done', time: '完了' }, { name: 'アクションアイテム整理', status: 'running', time: '進行中' }, { name: '関係者への配布', status: 'pending', time: '待機中' }] },
  7:  { progress: 65, taskDetail: '翌月のYouTube・SNS・ブログの投稿スケジュールを策定中。クライアント5社分のカレンダーを作成。', subtasks: [{ name: 'YouTube投稿計画', status: 'done', time: '完了' }, { name: 'SNS投稿計画', status: 'running', time: '進行中' }, { name: 'ブログ投稿計画', status: 'pending', time: '待機中' }] },
  8:  { progress: 80, taskDetail: '今週公開予定の動画4本の構成・台本をレビュー中。SEOキーワード最適化も実施。', subtasks: [{ name: '動画1 台本レビュー', status: 'done', time: '完了' }, { name: '動画2 台本レビュー', status: 'done', time: '完了' }, { name: '動画3 台本レビュー', status: 'running', time: '進行中' }, { name: '動画4 台本レビュー', status: 'pending', time: '待機中' }] },
  9:  { progress: 55, taskDetail: '15分動画の編集作業中。BGM挿入・テロップ追加・カラーグレーディングを実施中。', subtasks: [{ name: '粗編集', status: 'done', time: '完了' }, { name: 'BGM・SE挿入', status: 'running', time: '進行中' }, { name: 'テロップ追加', status: 'pending', time: '待機中' }] },
  10: { progress: 70, taskDetail: '20分動画の最終仕上げ中。エンドカード・チャンネル登録促進テロップを追加中。', subtasks: [{ name: '粗編集〜本編集', status: 'done', time: '完了' }, { name: 'エンドカード追加', status: 'running', time: '進行中' }, { name: '最終確認・書き出し', status: 'pending', time: '待機中' }] },
};

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
};

const AgentCard = ({ agent, isExpanded, onToggle, onOpenModal }) => {
  const isActive = agent.status === 'active';
  const detail = AGENT_DETAILS[agent.id] || { progress: 0, taskDetail: agent.currentTask, subtasks: [] };
  const teamColor = TEAM_COLORS[agent.team] || 'text-gray-400 bg-gray-700';

  return (
    <div className={`bg-neo-card rounded-2xl border transition-all duration-300 ${
      isActive ? 'border-green-500/30 shadow-lg shadow-green-500/5' : 'border-neo-blue/10'
    }`}>
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl(agent.name)}
              alt={agent.name}
              className={`w-12 h-12 rounded-full border-2 object-cover ${isActive ? 'border-green-400' : 'border-gray-600'}`}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className={`w-12 h-12 rounded-full hidden items-center justify-center text-lg font-bold ${isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`} style={{ display: 'none' }}>
              {agent.name.charAt(0)}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-neo-card ${isActive ? 'bg-green-400 animate-pulse' : 'bg-yellow-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-white text-sm truncate">{agent.name}</p>
              {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
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

        <div className={`rounded-lg p-2.5 ${isActive ? 'bg-green-500/5 border border-green-500/20' : 'bg-gray-800/50'}`}>
          <p className="text-xs text-gray-400 mb-0.5">現在のタスク</p>
          <p className="text-xs text-white font-medium leading-snug">{agent.currentTask}</p>
        </div>

        {isActive && detail.progress > 0 && (
          <div className="mt-2.5">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>進捗</span>
              <span>{detail.progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-neo-blue to-neo-cyan h-1.5 rounded-full transition-all duration-500" style={{ width: `${detail.progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* 展開パネル */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-neo-blue/10 pt-3">
          {detail.taskDetail && (
            <>
              <p className="text-xs text-gray-400 mb-2 font-medium">作業詳細</p>
              <p className="text-xs text-gray-300 mb-3 leading-relaxed">{detail.taskDetail}</p>
            </>
          )}
          {detail.subtasks.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {detail.subtasks.map((sub, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {subtaskStatusIcon[sub.status] || subtaskStatusIcon.pending}
                  <span className={`flex-1 ${sub.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{sub.name}</span>
                  <span className="text-gray-500 flex-shrink-0">{sub.time}</span>
                </div>
              ))}
            </div>
          )}
          {/* 指示ボタン */}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-neo-blue/10 hover:bg-neo-blue/20 text-neo-blue rounded-lg text-xs font-medium transition-all border border-neo-blue/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            指示を送る / タスク割り当て
          </button>
        </div>
      )}
    </div>
  );
};

const AgentOps = () => {
  const { agents, activeCount } = useAgents();
  const [expandedId, setExpandedId] = useState(null);
  const [teamFilter, setTeamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const teams = ['all', 'マネジメント', 'コンテンツ', 'クリエイティブ', 'テック', 'ビジネス開発', 'オペレーション', 'QA・分析'];
  const idleCount = agents.filter(a => a.status === 'idle').length;

  const filtered = agents.filter(a => {
    const teamOk = teamFilter === 'all' || a.team === teamFilter;
    const statusOk = statusFilter === 'all' || a.status === statusFilter;
    return teamOk && statusOk;
  });

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">エージェント稼働状況</h2>
          <p className="text-gray-400 text-sm mt-1">
            全 <span className="text-white font-bold">{agents.length}</span> 名 ／
            稼働中 <span className="text-green-400 font-bold">{activeCount}</span> 名 ／
            待機中 <span className="text-yellow-400 font-bold">{idleCount}</span> 名
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="font-bold text-sm">LIVE</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {teams.map(team => (
          <button key={team} onClick={() => setTeamFilter(team)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${teamFilter === team ? 'bg-neo-blue text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {team === 'all' ? `全チーム (${agents.length})` : `${team} (${agents.filter(a => a.team === team).length})`}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        {[
          { key: 'all',    label: '全員',   count: agents.length },
          { key: 'active', label: '稼働中', count: activeCount },
          { key: 'idle',   label: '待機中', count: idleCount },
        ].map(s => (
          <button key={s.key} onClick={() => setStatusFilter(s.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === s.key
                ? s.key === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : s.key === 'idle' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  : 'bg-neo-blue/20 text-neo-blue border border-neo-blue/40'
                : 'bg-gray-800 text-gray-400 border border-transparent hover:text-white'
            }`}>
            {s.label} {s.count}名
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">{filtered.length}名表示中</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isExpanded={expandedId === agent.id}
            onToggle={() => toggle(agent.id)}
            onOpenModal={() => setSelectedAgent(agent)}
          />
        ))}
      </div>

      {selectedAgent && (
        <AgentModal
          agent={agents.find(a => a.id === selectedAgent.id) || selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

export default AgentOps;
