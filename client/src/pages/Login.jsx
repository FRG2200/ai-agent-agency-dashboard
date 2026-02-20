import React, { useState } from 'react';
import { Zap, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAgents } from '../context/AgentContext';

const Login = () => {
  const { login } = useAgents();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // ローディング演出
    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@ai-agency.jp');
      setPassword('admin123');
    } else {
      setEmail('tanaka@ai-agency.jp');
      setPassword('tanaka123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-neo-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-neo-blue/20 rounded-xl flex items-center justify-center border border-neo-blue/30">
              <Zap className="w-7 h-7 text-neo-cyan" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">AI Agent Agency</h1>
          <p className="text-gray-400 text-sm mt-1">AI Organization Management Platform</p>
        </div>

        {/* ログインカード */}
        <div className="bg-neo-card rounded-2xl border border-neo-blue/20 p-8 shadow-xl shadow-black/30">
          <h2 className="text-lg font-bold text-white mb-6">ログイン</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス */}
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@ai-agency.jp"
                  required
                  className="w-full bg-gray-800 text-white text-sm rounded-lg pl-10 pr-4 py-3 border border-neo-blue/20 focus:outline-none focus:border-neo-blue placeholder-gray-600"
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">パスワード</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                  required
                  className="w-full bg-gray-800 text-white text-sm rounded-lg pl-10 pr-10 py-3 border border-neo-blue/20 focus:outline-none focus:border-neo-blue placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* エラー */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neo-blue hover:bg-neo-blue/80 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ログイン中...
                </span>
              ) : 'ログイン'}
            </button>
          </form>

          {/* デモアカウント */}
          <div className="mt-6 pt-5 border-t border-neo-blue/10">
            <p className="text-xs text-gray-500 text-center mb-3">デモアカウントで試す</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('admin')}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs transition-all border border-gray-700"
              >
                管理者アカウント
              </button>
              <button
                onClick={() => fillDemo('manager')}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs transition-all border border-gray-700"
              >
                マネージャーアカウント
              </button>
            </div>
          </div>
        </div>

        {/* フッター */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 AI Agent Agency. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
