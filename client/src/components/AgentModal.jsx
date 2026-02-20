import React, { useState, useRef, useEffect } from 'react';
import { X, Send, CheckCircle, Clock, Cpu, AlertCircle, MessageSquare, ClipboardList, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAgents } from '../context/AgentContext';

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const TEAM_COLORS = {
  'マネジメント':   'text-purple-300 bg-purple-500/20',
  'コンテンツ':     'text-blue-300 bg-blue-500/20',
  'クリエイティブ': 'text-pink-300 bg-pink-500/20',
  'テック':         'text-cyan-300 bg-cyan-500/20',
  'ビジネス開発':   'text-green-300 bg-green-500/20',
  'オペレーション': 'text-orange-300 bg-orange-500/20',
  'QA・分析':       'text-yellow-300 bg-yellow-500/20',
};

const QUICK_TASKS = [
  'SNS投稿文を3本作成してください',
  'YouTubeサムネイルを5枚生成してください',
  '競合分析レポートを作成してください',
  '今週のメルマガ本文を作成してください',
  '営業メールリストへのDMを送信してください',
  'データ分析レポートをまとめてください',
];

const AgentModal = ({ agent, onClose }) => {
  const { assignTask, sendChatMessage, toggleAgentStatus, chatLog } = useAgents();
  const [tab, setTab] = useState('chat'); // 'chat' | 'task' | 'status'
  const [message, setMessage] = useState('');
  const [taskText, setTaskText] = useState('');
  const [taskSent, setTaskSent] = useState(false);
  const chatEndRef = useRef(null);

  const agentChats = chatLog.filter(c => c.agentId === agent.id);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentChats]);

  const handleSendChat = () => {
    if (!message.trim()) return;
    sendChatMessage(agent.id, message.trim());
    setMessage('');
  };

  const handleAssignTask = () => {
    if (!taskText.trim()) return;
    assignTask(agent.id, taskText.trim());
    setTaskSent(true);
    setTimeout(() => setTaskSent(false), 2000);
    setTaskText('');
  };

  const handleQuickTask = (task) => {
    setTaskText(task);
    setTab('task');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-neo-card rounded-t-2xl sm:rounded-2xl border border-neo-blue/30 w-full sm:max-w-lg shadow-2xl shadow-black/50 flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center gap-3 p-5 border-b border-neo-blue/10">
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl(agent.name)}
              alt={agent.name}
              className={`w-12 h-12 rounded-full border-2 object-cover ${
                agent.status === 'active' ? 'border-green-400' : 'border-gray-600'
              }`}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
            <div className="w-12 h-12 rounded-full hidden items-center justify-center text-xl font-bold bg-gray-700 text-gray-300" style={{display:'none'}}>
              {agent.name.charAt(0)}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-neo-card ${
              agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-500'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white">{agent.name}</p>
            <p className="text-xs text-gray-400 truncate">{agent.role}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${TEAM_COLORS[agent.team] || 'bg-gray-700 text-gray-400'}`}>
              {agent.team}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-neo-blue/10">
          {[
            { key: 'chat',   icon: MessageSquare,  label: 'チャット' },
            { key: 'task',   icon: ClipboardList,  label: 'タスク割り当て' },
            { key: 'status', icon: ToggleRight,    label: '稼働状況' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all border-b-2 ${
                tab === t.key ? 'border-neo-blue text-neo-blue' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* チャットタブ */}
        {tab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[350px]">
              {agentChats.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>まだメッセージがありません</p>
                  <p className="text-xs mt-1">エージェントに指示を送ってみましょう</p>
                </div>
              )}
              {agentChats.map(chat => (
                <div key={chat.id} className={`flex ${chat.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    chat.from === 'user'
                      ? 'bg-neo-blue text-white rounded-br-sm'
                      : chat.from === 'system'
                      ? 'bg-gray-700/50 text-gray-400 text-xs italic'
                      : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                  }`}>
                    <p className="leading-relaxed">{chat.message}</p>
                    <p className="text-xs opacity-50 mt-1 text-right">{chat.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-neo-blue/10">
              {/* クイックタスク */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {QUICK_TASKS.slice(0, 3).map(qt => (
                  <button
                    key={qt}
                    onClick={() => { sendChatMessage(agent.id, qt); }}
                    className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all border border-gray-700"
                  >
                    {qt.slice(0, 15)}...
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  placeholder={`${agent.name}に指示を送る...`}
                  className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 border border-neo-blue/20 focus:outline-none focus:border-neo-blue placeholder-gray-600"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!message.trim()}
                  className="bg-neo-blue hover:bg-neo-blue/80 disabled:opacity-40 text-white rounded-lg px-4 py-2.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* タスク割り当てタブ */}
        {tab === 'task' && (
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">現在のタスク</p>
              <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-white border border-neo-blue/10">
                {agent.currentTask}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">新しいタスクを割り当て</p>
              <textarea
                value={taskText}
                onChange={e => setTaskText(e.target.value)}
                placeholder="タスクの内容を入力してください..."
                rows={3}
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-3 border border-neo-blue/20 focus:outline-none focus:border-neo-blue placeholder-gray-600 resize-none"
              />
              <button
                onClick={handleAssignTask}
                disabled={!taskText.trim() || taskSent}
                className={`w-full mt-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  taskSent
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-neo-blue hover:bg-neo-blue/80 disabled:opacity-40 text-white'
                }`}
              >
                {taskSent ? '✓ タスクを割り当てました' : 'タスクを割り当てる'}
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">クイックタスク</p>
              <div className="space-y-1.5">
                {QUICK_TASKS.map(qt => (
                  <button
                    key={qt}
                    onClick={() => handleQuickTask(qt)}
                    className="w-full text-left text-sm px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700"
                  >
                    {qt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 稼働状況タブ */}
        {tab === 'status' && (
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-neo-blue/10">
              <p className="text-xs text-gray-400 mb-3 font-medium">現在の稼働状況</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-500'}`} />
                  <span className={`font-bold text-lg ${agent.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {agent.status === 'active' ? '稼働中' : '待機中'}
                  </span>
                </div>
                <button
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    agent.status === 'active'
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                  }`}
                >
                  {agent.status === 'active'
                    ? <><ToggleRight className="w-4 h-4" /> 待機中に変更</>
                    : <><ToggleLeft className="w-4 h-4" /> 稼働中に変更</>
                  }
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-medium">エージェント情報</p>
              {[
                { label: '名前',     value: agent.name },
                { label: '役職',     value: agent.role },
                { label: 'チーム',   value: agent.team },
                { label: 'タスク数', value: `${agent.tasks}件` },
                { label: '現在のタスク', value: agent.currentTask },
              ].map(info => (
                <div key={info.label} className="flex items-start gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-500 w-20 flex-shrink-0 pt-0.5">{info.label}</span>
                  <span className="text-sm text-white">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentModal;
