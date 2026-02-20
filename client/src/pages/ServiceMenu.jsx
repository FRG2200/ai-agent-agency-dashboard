import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../api/client';

const ServiceMenu = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // APIから取得（フォールバックでモックデータ）
    const fetchServices = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.SERVICES);
        if (response.success && response.data) {
          // APIデータをフォーマット
          const formattedServices = response.data.map(s => ({
            id: s.id,
            icon: s.icon,
            title: s.title,
            price: `¥${s.price.toLocaleString()}`,
            priceUnit: s.priceUnit,
            description: s.description,
            features: s.features,
            popular: s.id === 'youtube'
          }));
          setServices(formattedServices);
        }
      } catch (error) {
        console.log('API unavailable, using mock data');
        // フォールバック: モックデータ
        setServices([
          {
            id: 'youtube',
            icon: '🎬',
            title: 'YouTube運用代行',
            price: '¥30,000',
            priceUnit: '/月',
            description: 'AIが企画・脚本・編集・投稿を完全自動化',
            features: ['週3本投稿', 'SEO最適化', '分析レポート', 'サムネイル自動生成'],
            popular: true
          },
          {
            id: 'content',
            icon: '✍️',
            title: 'コンテンツ制作',
            price: '¥10,000',
            priceUnit: '/月',
            description: 'ブログ・メルマガ・SNS投稿を自動生成',
            features: ['note週2本', 'SNS投稿1日3回', 'メルマガ週1回', 'SEO対策込み'],
            popular: false
          },
          {
            id: 'sales',
            icon: '💼',
            title: '営業代行',
            price: '¥50,000',
            priceUnit: '/月',
            description: 'リード生成から商談設定まで自動化',
            features: ['月500リード発掘', 'AI営業メール', '商談設定', 'CRM連携'],
            popular: false
          },
          {
            id: 'automation',
            icon: '⚙️',
            title: '業務自動化',
            price: '¥100,000',
            priceUnit: '〜',
            description: '受注から納品までのワークフロー構築',
            features: ['カスタム構築', 'N8N連携', '24時間稼働', '専任サポート'],
            popular: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
      {
        id: 'youtube',
        icon: '🎬',
        title: 'YouTube運用代行',
        price: '¥30,000',
        priceUnit: '/月',
        description: 'AIが企画・脚本・編集・投稿を完全自動化',
        features: ['週3本投稿', 'SEO最適化', '分析レポート', 'サムネイル自動生成'],
        popular: true
      },
      {
        id: 'content',
        icon: '✍️',
        title: 'コンテンツ制作',
        price: '¥10,000',
        priceUnit: '/月',
        description: 'ブログ・メルマガ・SNS投稿を自動生成',
        features: ['note週2本', 'SNS投稿1日3回', 'メルマガ週1回', 'SEO対策込み'],
        popular: false
      },
      {
        id: 'sales',
        icon: '💼',
        title: '営業代行',
        price: '¥50,000',
        priceUnit: '/月',
        description: 'リード生成から商談設定まで自動化',
        features: ['月500リード発掘', 'AI営業メール', '商談設定', 'CRM連携'],
        popular: false
      },
      {
        id: 'automation',
        icon: '⚙️',
        title: '業務自動化',
        price: '¥100,000',
        priceUnit: '〜',
        description: '受注から納品までのワークフロー構築',
        features: ['カスタム構築', 'N8N連携', '24時間稼働', '専任サポート'],
        popular: false
      }
    ]);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          <span className="gradient-text">AI組織</span>を即座に導入
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          67名のAIエージェントが24時間365日、あなたのビジネスをサポートします。
          <br />
          人材採用・教育不要、即日から業務を開始。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        {[
          { label: '稼働エージェント', value: '31名', sub: '/ 67名' },
          { label: '本日完了タスク', value: '127件', sub: '+12%' },
          { label: '累計納品', value: '1,234件', sub: 'すべてAI実行' },
          { label: '稼働率', value: '99.9%', sub: '24時間365日' },
        ].map((stat) => (
          <div key={stat.label} className="bg-neo-card rounded-xl p-6 border border-neo-blue/10">
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-neo-cyan">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Service Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neo-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {services.map((service) => (
          <div
            key={service.id}
            className={`bg-neo-card rounded-2xl p-8 border card-hover relative ${
              service.popular ? 'border-neo-gold' : 'border-neo-blue/20'
            }`}
          >
            {service.popular && (
              <div className="absolute -top-3 left-6 px-3 py-1 bg-neo-gold text-neo-dark text-xs font-bold rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                人気
              </div>
            )}

            <div className="flex items-start justify-between mb-6">
              <div className="text-5xl">{service.icon}</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{service.price}</p>
                <p className="text-sm text-gray-400">{service.priceUnit}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-gray-400 mb-6">{service.description}</p>

            <div className="space-y-3 mb-8">
              {service.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-neo-cyan" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              service.popular 
                ? 'bg-gradient-to-r from-neo-blue to-neo-cyan text-white hover:opacity-90' 
                : 'bg-neo-blue/20 text-neo-blue border border-neo-blue/50 hover:bg-neo-blue/30'
            }`}>
              受注する
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center bg-gradient-to-r from-neo-blue/20 to-neo-cyan/20 rounded-2xl p-8 border border-neo-blue/20">
        <h3 className="text-2xl font-bold mb-2">カスタム開発も承ります</h3>
        <p className="text-gray-400 mb-6">既存の業務フローにAIを組み込む、完全カスタマイズも可能です。</p>
        <button className="px-8 py-3 bg-neo-gold text-neo-dark font-bold rounded-xl hover:opacity-90 transition-opacity">
          無料相談する
        </button>
      </div>
    </div>
  );
};

export default ServiceMenu;
