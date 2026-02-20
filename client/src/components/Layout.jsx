import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, GitBranch, Zap, Users, Activity, LogOut, User } from 'lucide-react';
import { useAgents } from '../context/AgentContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { activeCount, totalCount, currentUser, logout } = useAgents();

  const navItems = [
    { path: '/', icon: Briefcase, label: 'サービス' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
    { path: '/workflow', icon: GitBranch, label: 'ワークフロー' },
    { path: '/agents', icon: Users, label: 'エージェント一覧' },
    { path: '/agent-ops', icon: Activity, label: '稼働状況', internal: true },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/services' || location.pathname.startsWith('/services/');
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-neo-dark">
      {/* Header */}
      <header className="bg-neo-card border-b border-neo-blue/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-neo-cyan" />
            <div>
              <h1 className="text-xl font-bold text-white">AI Agent Agency</h1>
              <p className="text-xs text-gray-400">AI Organization Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 稼働人数（動的） */}
            <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full status-dot"></span>
              {activeCount}名稼働中 / 全{totalCount}名
            </span>

            {/* ユーザー情報 */}
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-neo-blue/10 text-neo-blue rounded-full text-sm border border-neo-blue/20">
                  <User className="w-3.5 h-3.5" />
                  <span>{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-xs bg-neo-blue/20 px-1.5 py-0.5 rounded text-neo-cyan">管理者</span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full text-sm transition-all"
                  title="ログアウト"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ログアウト</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-neo-card/50 border-b border-neo-blue/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-3 border-b-2 transition-colors ${
                  isActive(item.path)
                    ? 'border-neo-blue text-neo-blue'
                    : 'border-transparent text-gray-400 hover:text-white'
                } ${item.internal ? 'ml-auto' : ''}`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.internal && (
                  <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded ml-1">社内</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
