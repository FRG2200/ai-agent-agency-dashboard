import React, { useState } from 'react';

const AGENTS = [
  { id: 1, name: 'PM-Alpha', role: 'プロジェクトマネージャー', team: 'マネジメント', status: 'active', tasks: 12 },
  { id: 2, name: 'PM-Beta', role: 'プロジェクトマネージャー', team: 'マネジメント', status: 'active', tasks: 8 },
  { id: 3, name: 'PM-Gamma', role: 'プロジェクトマネージャー', team: 'マネジメント', status: 'idle', tasks: 0 },
  { id: 4, name: 'Designer-01', role: 'デザイナー', team: 'クリエイティブ', status: 'active', tasks: 3 },
  { id: 5, name: 'Designer-02', role: 'デザイナー', team: 'クリエイティブ', status: 'active', tasks: 5 },
  { id: 6, name: 'Designer-03', role: 'デザイナー (画像生成)', team: 'クリエイティブ', status: 'active', tasks: 1 },
  { id: 7, name: 'Designer-04', role: 'デザイナー (画像生成)', team: 'クリエイティブ', status: 'active', tasks: 1 },
  { id: 8, name: 'Coder-01', role: 'エンジニア', team: 'テック', status: 'active', tasks: 4 },
  { id: 9, name: 'Coder-02', role: 'エンジニア', team: 'テック', status: 'idle', tasks: 0 },
  { id: 10, name: 'Coder-03', role: 'エンジニア', team: 'テック', status: 'idle', tasks: 0 },
  { id: 11, name: 'QA-01', role: '品質管理', team: 'QA', status: 'active', tasks: 2 },
  { id: 12, name: 'Writer-01', role: 'コンテンツライター', team: 'コンテンツ', status: 'active', tasks: 2 },
  { id: 13, name: 'Writer-02', role: 'SNSライター', team: 'コンテンツ', status: 'active', tasks: 3 },
];

const Agents = () => {
  const [filter, setFilter] = useState('all');
  const teams = ['all', ...new Set(AGENTS.map(a => a.team))];
  const filtered = filter === 'all' ? AGENTS : AGENTS.filter(a => a.team === filter);
  const activeCount = AGENTS.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">エージェント一覧</h2>
          <p className="text-gray-400 text-sm mt-1">全{AGENTS.length}名 / {activeCount}名稼働中</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {teams.map(team => (
          <button key={team} onClick={() => setFilter(team)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === team ? 'bg-neo-blue text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {team === 'all' ? '全て' : team}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {filtered.map(agent => (
          <div key={agent.id} className={`bg-neo-card rounded-xl p-4 border ${agent.status === 'active' ? 'border-green-500/30' : 'border-neo-blue/10'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{agent.team}</span>
            </div>
            <p className="font-bold text-white text-sm">{agent.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{agent.role}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs font-medium ${agent.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                {agent.status === 'active' ? '稼働中' : '待機中'}
              </span>
              {agent.tasks > 0 && <span className="text-xs text-gray-400">{agent.tasks}タスク</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
