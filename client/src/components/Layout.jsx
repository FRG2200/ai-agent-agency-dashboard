import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, GitBranch, Zap, Users, Activity, LogOut, User, Menu, X } from 'lucide-react';
import { useAgents } from '../context/AgentContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { activeCount, totalCount, currentUser, logout } = useAgents();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Zap className="w-6 h-6 text-neo-cyan" />
            <div>
              <h1 className="text-base font-bold text-white leading-tight">AI Agent Agency</h1>
              <p className="text-xs text-gray-400 hidden sm:block">AI Organization Management</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* 稼働人数（動的） */}
            <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full status-dot flex-shrink-0"></span>
              <span className="hidden xs:inline">{activeCount}名稼働中 / 全{totalCount}名</span>
              <span className="xs:hidden">{activeCount}/{totalCount}</span>
            </span>

            {/* ユーザー情報 (デスクトップのみ) */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-neo-blue/10 text-neo-blue rounded-full text-xs border border-neo-blue/20">
                  <User className="w-3 h-3" />
                  <span>{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-xs bg-neo-blue/20 px-1 py-0.5 rounded text-neo-cyan">管理者</span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full text-xs transition-all"
                  title="ログアウト"
                >
                  <LogOut className="w-3 h-3" />
                  <span>ログアウト</span>
                </button>
              </div>
            )}

            {/* ハンバーガーメニュー (スマホのみ) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-1.5 text-gray-400 hover:text-white"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* スマホ用ドロップダウンメニュー */}
        {menuOpen && (
          <div className="sm:hidden border-t border-neo-blue/10 bg-neo-card px-4 py-3 space-y-1">
            {currentUser && (
              <div className="flex items-center justify-between py-2 border-b border-neo-blue/10 mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <User className="w-4 h-4 text-neo-blue" />
                  <span>{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-xs bg-neo-blue/20 px-1.5 py-0.5 rounded text-neo-cyan">管理者</span>
                  )}
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                >
                  <LogOut className="w-3 h-3" />
                  ログアウト
                </button>
              </div>
            )}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-neo-blue/20 text-neo-blue'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.internal && (
                  <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded ml-auto">社内</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Navigation (デスクトップのみ) */}
      <nav className="hidden sm:block bg-neo-card/50 border-b border-neo-blue/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-3 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
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
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
