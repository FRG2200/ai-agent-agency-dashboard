import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Clock, User, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../api/client';

const Workflow = () => {
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const [ordersRes, logsRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.WORKFLOW_ORDERS),
          apiClient.get(API_ENDPOINTS.ACTIVITY_LOGS)
        ]);

        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data);
        }
        if (logsRes.success && logsRes.data) {
          setLogs(logsRes.data);
        }
      } catch (error) {
        console.log('API unavailable, using mock data');
        // フォールバック: モックデータ
        setOrders([
          {
            id: 'ORD-2026-0001',
            client: 'ABC株式会社',
            service: 'YouTube運用代行',
            amount: 30000,
            status: 'new',
            receivedAt: '12:00',
            priority: 'high'
          },
          {
            id: 'ORD-2026-0002',
            client: 'XYZ商事',
            service: 'コンテンツ制作',
            amount: 10000,
            status: 'assigned',
            assignedAgent: 'AI-Writer-01',
            deadline: '明日 18:00',
            priority: 'normal'
          },
          {
            id: 'ORD-2026-0003',
            client: '123株式会社',
            service: '営業代行',
            amount: 50000,
            status: 'in-progress',
            assignedAgent: 'Sales-AI-02',
            progress: 65,
            eta: '30分後',
            priority: 'high'
          },
          {
            id: 'ORD-2026-0004',
            client: 'Sample Inc.',
            service: '業務自動化',
            amount: 150000,
            status: 'review',
            qaAgent: 'PRIME-AI',
            priority: 'urgent'
          },
          {
            id: 'ORD-2026-0005',
            client: 'Test Corp',
            service: 'YouTube運用',
            amount: 30000,
            status: 'completed',
            completedAt: '11:30',
            clientRating: 5,
            priority: 'normal'
          }
        ]);
        setLogs([
          { time: '12:15', agent: 'YouTube-Director', action: '動画投稿完了', details: '週次レポート #45' },
          { time: '12:14', agent: 'Sales-AI', action: '営業メール送信', details: '50件送信完了' },
          { time: '12:12', agent: 'Content-Writer', action: 'ブログ記事完了', details: '2本公開' },
          { time: '12:10', agent: 'Scheduler-AI', action: 'ミーティング設定', details: '明日14:00' },
          { time: '12:08', agent: 'Analytics-AI', action: 'レポート生成', details: '週次分析完了' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, []);

  const columns = [
    { id: 'new', title: '📥 新規受注', color: 'blue' },
    { id: 'assigned', title: '🔄 配布中', color: 'cyan' },
    { id: 'in-progress', title: '▶️ 実行中', color: 'yellow' },
    { id: 'review', title: '👁️ 検査中', color: 'purple' },
    { id: 'completed', title: '✅ 納品済', color: 'green' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      assigned: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      review: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      completed: 'bg-green-500/20 text-green-400 border-green-500/50',
    };
    return colors[status] || colors.new;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      urgent: '🔥',
      high: '⚡',
      normal: '•',
      low: '○'
    };
    return icons[priority] || icons.normal;
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-72">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">{column.title}</h3>
                <span className="px-2 py-1 bg-neo-card text-gray-400 text-sm rounded">
                  {orders.filter(o => o.status === column.id).length}
                </span>
              </div>

              <div className="space-y-3">
                {orders
                  .filter((order) => order.status === column.id)
                  .map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-neo-card rounded-xl p-4 border cursor-pointer transition-all hover:border-neo-blue/50 ${
                        selectedOrder?.id === order.id
                          ? 'border-neo-blue'
                          : 'border-neo-blue/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs text-gray-500 font-mono">{order.id}</span>
                        <span className="text-xs">{getPriorityIcon(order.priority)}</span>
                      </div>

                      <p className="font-bold text-white mb-1">{order.client}</p>
                      <p className="text-sm text-gray-400 mb-3">{order.service}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-neo-cyan font-bold">¥{order.amount.toLocaleString()}</span>
                        
                        {order.progress && (
                          <span className="text-sm text-gray-400">{order.progress}%</span>
                        )}
                      </div>

                      {order.progress && (
                        <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neo-blue rounded-full"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      )}

                      {order.assignedAgent && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                          <User className="w-4 h-4" />
                          {order.assignedAgent}
                        </div>
                      )}

                      {order.eta && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-neo-cyan">
                          <Clock className="w-4 h-4" />
                          {order.eta}
                        </div>
                      )}

                      {order.clientRating && (
                        <div className="mt-2 flex items-center gap-1">
                          {'⭐'.repeat(order.clientRating)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-80 flex-shrink-0">
        {selectedOrder ? (
          <div className="bg-neo-card rounded-xl p-6 border border-neo-blue/10 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">注文詳細</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-400">注文番号</p>
                <p className="font-mono text-neo-cyan">{selectedOrder.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">クライアント</p>
                <p className="font-bold text-white">{selectedOrder.client}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">サービス</p>
                <p className="text-white">{selectedOrder.service}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">金額</p>
                <p className="text-2xl font-bold text-neo-cyan">
                  ¥{selectedOrder.amount.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">ステータス</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedOrder.status)}`}>
                  {columns.find(c => c.id === selectedOrder.status)?.title}
                </span>
              </div>

              {selectedOrder.assignedAgent && (
                <div>
                  <p className="text-sm text-gray-400">担当AI</p>
                  <p className="text-white">{selectedOrder.assignedAgent}</p>
                </div>
              )}

              {selectedOrder.progress && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">進捗 {selectedOrder.progress}%</p>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neo-blue rounded-full"
                      style={{ width: `${selectedOrder.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedOrder.eta && (
                <div>
                  <p className="text-sm text-gray-400">完了予定</p>
                  <p className="text-neo-cyan">{selectedOrder.eta}</p>
                </div>
              )}

              {selectedOrder.clientRating && (
                <div>
                  <p className="text-sm text-gray-400">クライアント評価</p>
                  <div className="text-neo-gold">{'⭐'.repeat(selectedOrder.clientRating)}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                {selectedOrder.status === 'new' && (
                  <button className="w-full py-3 bg-neo-blue text-white rounded-xl font-bold flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    AIに配布
                  </button>
                )}
                
                {selectedOrder.status === 'review' && (
                  <button className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    承認して納品
                  </button>
                )}
                
                <button className="w-full py-3 bg-neo-card border border-neo-blue/30 text-gray-300 rounded-xl hover:border-neo-blue">
                  詳細を見る
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-neo-card rounded-xl p-6 border border-neo-blue/10 h-full flex items-center justify-center">
            <p className="text-gray-400 text-center">
              注文を選択して<br />詳細を表示
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflow;
