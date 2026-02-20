import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, GitBranch, Zap } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Briefcase, label: 'サービス' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
    { path: '/workflow', icon: GitBranch, label: 'ワークフロー' },
  ];

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
          
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full status-dot"></span>
              31名稼働中
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-neo-card/50 border-b border-neo-blue/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                  location.pathname === item.path
                    ? 'border-neo-blue text-neo-blue'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
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
