import React, { useState } from 'react';
import { useAgents } from '../context/AgentContext';
import AgentModal from '../components/AgentModal';

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const TEAM_COLORS = {
  'マネジメント':   'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'コンテンツ':     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'クリエイティブ': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'テック':         'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'ビジネス開発':   'bg-green-500/20 text-green-300 border-green-500/30',
  'オペレーション': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'QA・分析':       'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

const Agents = () => {
  const { agents, activeCount } = useAgents();
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const teams = ['all', ...Object.keys(TEAM_COLORS)];
  const idleCount = agents.filter(a => a.status === 'idle').length;

  const filtered = agents.filter(a => {
    const teamOk = filter === 'all' || a.team === filter;
    const statusOk = statusFilter === 'all' || a.status === statusFilter;
    const searchOk = search === '' || a.name.includes(search) || a.role.includes(search);
    return teamOk && statusOk && searchOk;
  });

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">エージェント一覧</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              全 <span className="text-white font-bold">{agents.length}</span> 名 ／
              稼働中 <span className="text-green-400 font-bold">{activeCount}</span> 名 ／
              待機中 <span className="text-yellow-400 font-bold">{idleCount}</span> 名
            </p>
          </div>
        </div>
        <input
          type="text"
          placeholder="名前・役職で検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2 border border-neo-blue/20 focus:outline-none focus:border-neo-blue"
        />
      </div>

      {/* チームフィルター */}
      <div className="flex gap-2 flex-wrap">
        {teams.map(team => (
          <button
            key={team}
            onClick={() => setFilter(team)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              filter === team
                ? 'bg-neo-blue text-white border-neo-blue'
                : 'bg-gray-800 text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {team === 'all' ? `全チーム (${agents.length})` : `${team} (${agents.filter(a => a.team === team).length})`}
          </button>
        ))}
      </div>

      {/* ステータスフィルター */}
      <div className="flex gap-2">
        {[
          { key: 'all',    label: '全員',   count: agents.length },
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
        <span className="ml-auto text-xs text-gray-500 self-center">{filtered.length}名表示中</span>
      </div>

      {/* エージェントグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filtered.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`bg-neo-card rounded-xl p-4 border transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${
              agent.status === 'active'
                ? 'border-green-500/30 hover:shadow-green-500/10'
                : 'border-neo-blue/10 hover:shadow-neo-blue/10'
            }`}
          >
            {/* アバター */}
            <div className="relative mx-auto w-16 h-16 mb-3">
              <img
                src={avatarUrl(agent.name)}
                alt={agent.name}
                className={`w-16 h-16 rounded-full object-cover border-2 ${
                  agent.status === 'active' ? 'border-green-400' : 'border-gray-600'
                }`}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div
                className={`w-16 h-16 rounded-full hidden items-center justify-center text-2xl font-bold ${
                  agent.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'
                }`}
                style={{ display: 'none' }}
              >
                {agent.name.charAt(0)}
              </div>
              <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-neo-card ${
                agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-500'
              }`} />
            </div>

            {/* 名前・役職 */}
            <div className="text-center mb-2">
              <p className="font-bold text-white text-sm leading-tight">{agent.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{agent.role}</p>
            </div>

            {/* チームバッジ */}
            <div className="flex justify-center mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${TEAM_COLORS[agent.team] || 'bg-gray-700 text-gray-400'}`}>
                {agent.team}
              </span>
            </div>

            {/* ステータス・タスク数 */}
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs font-medium ${agent.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                {agent.status === 'active' ? '● 稼働中' : '○ 待機中'}
              </span>
              {agent.tasks > 0 && (
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                  {agent.tasks}件
                </span>
              )}
            </div>

            {/* クリックヒント */}
            <p className="text-center text-xs text-gray-600 mt-2">タップして指示</p>
          </div>
        ))}
      </div>

      {/* エージェントモーダル */}
      {selectedAgent && (
        <AgentModal
          agent={agents.find(a => a.id === selectedAgent.id) || selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

export default Agents;
