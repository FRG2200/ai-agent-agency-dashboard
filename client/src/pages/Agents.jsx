import React, { useState } from 'react';

// 顔アバター: DiceBear APIでリアルなアバターを生成（seed=名前で固定）
const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const AGENTS = [
  // ── マネジメント（6名）──
  { id: 1,  name: '田中 誠一',   role: 'CEO / 総括マネージャー',       team: 'マネジメント',     status: 'active', tasks: 15 },
  { id: 2,  name: '山本 恵子',   role: 'COO / 運営統括',               team: 'マネジメント',     status: 'active', tasks: 12 },
  { id: 3,  name: '佐藤 大輔',   role: 'プロジェクトマネージャー',      team: 'マネジメント',     status: 'active', tasks: 10 },
  { id: 4,  name: '鈴木 美咲',   role: 'プロジェクトマネージャー',      team: 'マネジメント',     status: 'active', tasks: 8  },
  { id: 5,  name: '高橋 拓也',   role: 'プロジェクトマネージャー',      team: 'マネジメント',     status: 'idle',   tasks: 0  },
  { id: 6,  name: '伊藤 さくら', role: 'アシスタントマネージャー',      team: 'マネジメント',     status: 'active', tasks: 6  },

  // ── コンテンツ事業部（14名）──
  { id: 7,  name: '中村 陽介',   role: 'コンテンツディレクター',        team: 'コンテンツ',       status: 'active', tasks: 9  },
  { id: 8,  name: '小林 奈々',   role: 'YouTubeディレクター',           team: 'コンテンツ',       status: 'active', tasks: 7  },
  { id: 9,  name: '加藤 翔太',   role: 'YouTube編集者',                 team: 'コンテンツ',       status: 'active', tasks: 5  },
  { id: 10, name: '吉田 彩花',   role: 'YouTube編集者',                 team: 'コンテンツ',       status: 'active', tasks: 4  },
  { id: 11, name: '山田 健太',   role: 'YouTube編集者',                 team: 'コンテンツ',       status: 'idle',   tasks: 0  },
  { id: 12, name: '渡辺 里奈',   role: 'コンテンツライター',            team: 'コンテンツ',       status: 'active', tasks: 6  },
  { id: 13, name: '松本 浩二',   role: 'コンテンツライター',            team: 'コンテンツ',       status: 'active', tasks: 4  },
  { id: 14, name: '井上 ひとみ', role: 'SNSライター',                   team: 'コンテンツ',       status: 'active', tasks: 8  },
  { id: 15, name: '木村 蓮',     role: 'SNSライター',                   team: 'コンテンツ',       status: 'active', tasks: 5  },
  { id: 16, name: '林 真由',     role: 'ブログライター',                team: 'コンテンツ',       status: 'active', tasks: 3  },
  { id: 17, name: '清水 悠斗',   role: 'ブログライター',                team: 'コンテンツ',       status: 'idle',   tasks: 0  },
  { id: 18, name: '山口 菜摘',   role: 'メルマガライター',              team: 'コンテンツ',       status: 'active', tasks: 2  },
  { id: 19, name: '斎藤 颯太',   role: 'スクリプトライター',            team: 'コンテンツ',       status: 'active', tasks: 4  },
  { id: 20, name: '松田 愛',     role: 'スクリプトライター',            team: 'コンテンツ',       status: 'idle',   tasks: 0  },

  // ── クリエイティブ部（12名）──
  { id: 21, name: '橋本 隼人',   role: 'クリエイティブディレクター',    team: 'クリエイティブ',   status: 'active', tasks: 7  },
  { id: 22, name: '岡田 結衣',   role: 'デザイナー',                    team: 'クリエイティブ',   status: 'active', tasks: 5  },
  { id: 23, name: '石川 大地',   role: 'デザイナー',                    team: 'クリエイティブ',   status: 'active', tasks: 3  },
  { id: 24, name: '前田 麻衣',   role: 'デザイナー',                    team: 'クリエイティブ',   status: 'active', tasks: 4  },
  { id: 25, name: '藤田 涼介',   role: 'デザイナー（画像生成特化）',    team: 'クリエイティブ',   status: 'active', tasks: 6  },
  { id: 26, name: '後藤 莉子',   role: 'デザイナー（画像生成特化）',    team: 'クリエイティブ',   status: 'active', tasks: 6  },
  { id: 27, name: '西村 光',     role: 'デザイナー（画像生成特化）',    team: 'クリエイティブ',   status: 'active', tasks: 5  },
  { id: 28, name: '福田 千夏',   role: 'デザイナー（画像生成特化）',    team: 'クリエイティブ',   status: 'idle',   tasks: 0  },
  { id: 29, name: '三浦 航',     role: 'バナーデザイナー',              team: 'クリエイティブ',   status: 'active', tasks: 8  },
  { id: 30, name: '岩田 沙織',   role: 'バナーデザイナー',              team: 'クリエイティブ',   status: 'active', tasks: 7  },
  { id: 31, name: '村上 遥',     role: 'バナーデザイナー',              team: 'クリエイティブ',   status: 'idle',   tasks: 0  },
  { id: 32, name: '坂本 悠',     role: 'バナーデザイナー',              team: 'クリエイティブ',   status: 'idle',   tasks: 0  },

  // ── テクニカル部（10名）──
  { id: 33, name: '内田 雄太',   role: 'テックリード',                  team: 'テック',           status: 'active', tasks: 6  },
  { id: 34, name: '小川 萌',     role: 'フロントエンドエンジニア',      team: 'テック',           status: 'active', tasks: 4  },
  { id: 35, name: '長谷川 蒼',   role: 'フロントエンドエンジニア',      team: 'テック',           status: 'active', tasks: 3  },
  { id: 36, name: '藤井 朱音',   role: 'バックエンドエンジニア',        team: 'テック',           status: 'active', tasks: 5  },
  { id: 37, name: '近藤 拓海',   role: 'バックエンドエンジニア',        team: 'テック',           status: 'active', tasks: 4  },
  { id: 38, name: '石井 夏希',   role: 'インフラエンジニア',            team: 'テック',           status: 'active', tasks: 3  },
  { id: 39, name: '上田 竜也',   role: 'APIエンジニア',                 team: 'テック',           status: 'idle',   tasks: 0  },
  { id: 40, name: '原田 葵',     role: 'APIエンジニア',                 team: 'テック',           status: 'idle',   tasks: 0  },
  { id: 41, name: '中島 隆',     role: 'データエンジニア',              team: 'テック',           status: 'active', tasks: 2  },
  { id: 42, name: '野村 詩織',   role: 'データエンジニア',              team: 'テック',           status: 'idle',   tasks: 0  },

  // ── ビジネス開発部（8名）──
  { id: 43, name: '菊地 誠',     role: 'ビジネス開発ディレクター',      team: 'ビジネス開発',     status: 'active', tasks: 8  },
  { id: 44, name: '丸山 由佳',   role: '営業エージェント',              team: 'ビジネス開発',     status: 'active', tasks: 6  },
  { id: 45, name: '池田 翼',     role: '営業エージェント',              team: 'ビジネス開発',     status: 'active', tasks: 5  },
  { id: 46, name: '桐島 彩',     role: '営業エージェント',              team: 'ビジネス開発',     status: 'active', tasks: 4  },
  { id: 47, name: '今井 大翔',   role: 'マーケティングエージェント',    team: 'ビジネス開発',     status: 'active', tasks: 7  },
  { id: 48, name: '浜田 咲',     role: 'マーケティングエージェント',    team: 'ビジネス開発',     status: 'active', tasks: 5  },
  { id: 49, name: '宮崎 悠人',   role: '見込み客分析エージェント',      team: 'ビジネス開発',     status: 'idle',   tasks: 0  },
  { id: 50, name: '金子 凛',     role: '見込み客分析エージェント',      team: 'ビジネス開発',     status: 'idle',   tasks: 0  },

  // ── オペレーション部（9名）──
  { id: 51, name: '横山 敬',     role: 'オペレーションマネージャー',    team: 'オペレーション',   status: 'active', tasks: 7  },
  { id: 52, name: '平野 亜美',   role: 'スケジューラーエージェント',    team: 'オペレーション',   status: 'active', tasks: 5  },
  { id: 53, name: '和田 慶太',   role: 'スケジューラーエージェント',    team: 'オペレーション',   status: 'active', tasks: 4  },
  { id: 54, name: '藤原 柚希',   role: 'メール対応エージェント',        team: 'オペレーション',   status: 'active', tasks: 9  },
  { id: 55, name: '石橋 陸',     role: 'メール対応エージェント',        team: 'オペレーション',   status: 'active', tasks: 8  },
  { id: 56, name: '大野 花音',   role: 'カスタマーサポートエージェント',team: 'オペレーション',   status: 'active', tasks: 6  },
  { id: 57, name: '谷口 樹',     role: 'カスタマーサポートエージェント',team: 'オペレーション',   status: 'idle',   tasks: 0  },
  { id: 58, name: '永田 澪',     role: 'データ入力エージェント',        team: 'オペレーション',   status: 'active', tasks: 3  },
  { id: 59, name: '島田 蓮',     role: 'データ入力エージェント',        team: 'オペレーション',   status: 'idle',   tasks: 0  },

  // ── QA・分析部（8名）──
  { id: 60, name: '森田 光輝',   role: 'QAリード',                      team: 'QA・分析',         status: 'active', tasks: 5  },
  { id: 61, name: '竹内 梨花',   role: '品質管理エージェント',          team: 'QA・分析',         status: 'active', tasks: 4  },
  { id: 62, name: '松井 隼',     role: '品質管理エージェント',          team: 'QA・分析',         status: 'active', tasks: 3  },
  { id: 63, name: '川口 芽依',   role: 'データアナリスト',              team: 'QA・分析',         status: 'active', tasks: 6  },
  { id: 64, name: '阿部 颯',     role: 'データアナリスト',              team: 'QA・分析',         status: 'active', tasks: 4  },
  { id: 65, name: '田村 心',     role: 'レポートエージェント',          team: 'QA・分析',         status: 'active', tasks: 3  },
  { id: 66, name: '中野 涼太',   role: 'レポートエージェント',          team: 'QA・分析',         status: 'idle',   tasks: 0  },
  { id: 67, name: '岡本 彩乃',   role: 'インサイトエージェント',        team: 'QA・分析',         status: 'active', tasks: 2  },
];

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
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const teams = ['all', ...Object.keys(TEAM_COLORS)];
  const activeCount = AGENTS.filter(a => a.status === 'active').length;
  const idleCount = AGENTS.filter(a => a.status === 'idle').length;

  const filtered = AGENTS.filter(a => {
    const teamOk = filter === 'all' || a.team === filter;
    const statusOk = statusFilter === 'all' || a.status === statusFilter;
    const searchOk = search === '' || a.name.includes(search) || a.role.includes(search);
    return teamOk && statusOk && searchOk;
  });

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">エージェント一覧</h2>
          <p className="text-gray-400 text-sm mt-1">
            全 <span className="text-white font-bold">{AGENTS.length}</span> 名 ／
            稼働中 <span className="text-green-400 font-bold">{activeCount}</span> 名 ／
            待機中 <span className="text-yellow-400 font-bold">{idleCount}</span> 名
          </p>
        </div>
        {/* 検索 */}
        <input
          type="text"
          placeholder="名前・役職で検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-800 text-white text-sm rounded-lg px-4 py-2 border border-neo-blue/20 focus:outline-none focus:border-neo-blue w-56"
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
            {team === 'all' ? `全チーム (${AGENTS.length})` : `${team} (${AGENTS.filter(a => a.team === team).length})`}
          </button>
        ))}
      </div>

      {/* ステータスフィルター */}
      <div className="flex gap-2">
        {[
          { key: 'all',    label: '全員',   count: AGENTS.length },
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map(agent => (
          <div
            key={agent.id}
            className={`bg-neo-card rounded-xl p-4 border transition-all hover:scale-105 hover:shadow-lg ${
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
              {/* フォールバック */}
              <div
                className={`w-16 h-16 rounded-full hidden items-center justify-center text-2xl font-bold ${
                  agent.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'
                }`}
                style={{ display: 'none' }}
              >
                {agent.name.charAt(0)}
              </div>
              {/* ステータスドット */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
