import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Zap } from 'lucide-react';

const SERVICE_DATA = {
  youtube: {
    title: 'YouTube運用代行',
    icon: '🎬',
    description: 'AIエージェントがYouTubeチャンネルの企画・台本・サムネイル・投稿・分析を完全自動化します。',
    features: ['動画企画・台本生成', 'サムネイル自動生成', '最適な投稿時間への自動スケジュール', '視聴データ分析レポート', 'コメント返信自動化'],
    agents: ['PM-Alpha', 'Writer-01', 'Designer-01', 'Coder-01'],
    price: '¥150,000/月〜',
    deliverables: '月12本動画 / 週次レポート',
  },
  content: {
    title: 'コンテンツ制作',
    icon: '✍️',
    description: 'note・ブログ・SNS投稿など、あらゆるコンテンツをAIエージェントが高品質に制作します。',
    features: ['SEO最適化記事執筆', 'SNS投稿文生成 (X/Instagram/Facebook)', 'バナー・画像制作', 'メルマガ執筆', 'LP・セールスコピー'],
    agents: ['PM-Beta', 'Writer-01', 'Writer-02', 'Designer-02'],
    price: '¥80,000/月〜',
    deliverables: '記事8本 / SNS投稿60本 / バナー20枚',
  },
  automation: {
    title: '業務自動化',
    icon: '⚡',
    description: '繰り返し業務をAIエージェントが自動化。人件費削減と業務効率化を同時に実現します。',
    features: ['データ収集・整理自動化', 'レポート自動生成', 'メール・問い合わせ自動対応', 'スプレッドシート自動更新', 'API連携・システム統合'],
    agents: ['PM-Alpha', 'Coder-01', 'Coder-02', 'QA-01'],
    price: '¥200,000〜 (初期構築)',
    deliverables: '自動化システム構築 / 保守サポート',
  },
  sales: {
    title: '営業代行',
    icon: '💼',
    description: 'AIエージェントがリスト作成からアポ取り・フォローアップまで営業活動を代行します。',
    features: ['見込み客リスト自動収集', 'パーソナライズドメール送信', 'LinkedIn自動アプローチ', 'フォローアップシーケンス', '商談設定・スケジュール管理'],
    agents: ['PM-Beta', 'Writer-02', 'Coder-03'],
    price: '¥120,000/月〜',
    deliverables: '月50件アプローチ / 週次進捗レポート',
  },
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = SERVICE_DATA[serviceId];

  if (!service) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">サービスが見つかりません</p>
        <button onClick={() => navigate('/services')} className="mt-4 text-neo-blue hover:underline">サービス一覧に戻る</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate('/services')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">サービス一覧に戻る</span>
      </button>

      <div className="bg-neo-card rounded-2xl border border-neo-blue/20 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-neo-blue/10 rounded-2xl flex items-center justify-center text-3xl">{service.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{service.title}</h2>
            <p className="text-neo-cyan font-medium mt-1">{service.price}</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed mb-6">{service.description}</p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3">提供内容</h3>
            <div className="space-y-2">
              {service.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3">担当エージェント</h3>
            <div className="space-y-2">
              {service.agents.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white">{a}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-neo-blue/5 border border-neo-blue/20 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">納品物</p>
              <p className="text-sm text-white">{service.deliverables}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button className="flex-1 py-3 bg-neo-blue hover:bg-neo-blue/80 text-white font-bold rounded-xl transition-all">
            このサービスを受注する
          </button>
          <button onClick={() => navigate('/services')} className="px-6 py-3 border border-neo-blue/30 text-gray-300 hover:text-white rounded-xl transition-all">
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
