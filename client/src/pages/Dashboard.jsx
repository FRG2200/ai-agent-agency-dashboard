import React, { useState, useEffect } from 'react';
import { Activity, Users, CheckCircle, Clock, Zap } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../api/client';
import { subscribeToOrders, subscribeToActivityLogs, subscribeToAgentStatus } from '../api/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    tasksInProgress: 0,
    activeAgents: 0,
    totalAgents: 67,
    completionRate: 94,
    uptime: '99.9%'
  });
  const [loading, setLoading] = useState(true);
  const [isRealtime, setIsRealtime] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [logs, setLogs] = useState([]);

  // APIからデータ取得
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, agentsRes, logsRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.DASHBOARD_STATS),
          apiClient.get(API_ENDPOINTS.DASHBOARD_AGENTS),
          apiClient.get(API_ENDPOINTS.ACTIVITY_LOGS)
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (agentsRes.success && agentsRes.data) {
          setDepartments(agentsRes.data);
        }
        if (logsRes.success && logsRes.data) {
          setLogs(logsRes.data);
        }
      } catch (error) {
        console.log('API unavailable, using mock data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Supabase Realtime購読
  useEffect(() => {
    const ordersSubscription = subscribeToOrders((payload) => {
      console.log('Order change:', payload);
      apiClient.get(API_ENDPOINTS.DASHBOARD_STATS).then(res => {
        if (res.success) setStats(res.data);
      });
    });

    const activitySubscription = subscribeToActivityLogs((payload) => {
      if (payload.new) {
        const newLog = {
          time: new Date(payload.new.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          agent: payload.new.agent_name,
          action: payload.new.action,
          details: payload.new.details
        };
        setLogs(prev => [newLog, ...prev.slice(0, 19)]);
      }
    });

    const agentSubscription = subscribeToAgentStatus((payload) => {
      console.log('Agent status change:', payload);
      apiClient.get(API_ENDPOINTS.DASHBOARD_AGENTS).then(res => {
        if (res.success) setDepartments(res.data);
      });
    });

    if (ordersSubscription || activitySubscription || agentSubscription) {
      setIsRealtime(true);
    }

    return () => {
      ordersSubscription?.unsubscribe();
      activitySubscription?.unsubscribe();
      agentSubscription?.unsubscribe();
    };
  }, []);

  // リアルタイム更新シミュレーション
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 2)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI組織稼働状況</h2>
          <p className="text-gray-400">リアルタイムモニタリング</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full">
          <span className="w-2 h-2 bg-red-400 rounded-full status-dot"></span>
          <span className="font-bold">LIVE</span>
          {isRealtime && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Realtime</span>}
          <span className="text-sm">{new Date().toLocaleTimeString('ja-JP')}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-neo-card rounded-xl p-6 border border-neo-blue/10">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span className="text-gray-400">本日完了</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.tasksCompleted}</p>
          <p className="text-sm text-green-400">+12% from yesterday</p>
        </div>

        <div className="bg-neo-card rounded-xl p-6 border border-neo-blue/10">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-neo-cyan" />
            <span className="text-gray-400">進行中</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.tasksInProgress}</p>
          <p className="text-sm text-gray-500">タスク</p>
        </div>

        <div className="bg-neo-card rounded-xl p-6 border border-neo-blue/10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-neo-blue" />
            <span className="text-gray-400">稼働エージェント</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeAgents}</p>
          <p className="text-sm text-gray-500">/ {stats.totalAgents}名</p>
        </div>

        <div className="bg-neo-card rounded-xl p-6 border border-neo-blue/10">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-neo-gold" />
            <span className="text-gray-400">稼働率</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.uptime}</p>
          <p className="text-sm text-gray-500">24時間365日</p>
        </div>
      </div>

      {/* Departments */}
      <div className="grid grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-neo-card rounded-xl p-6 border border-neo-blue/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{dept.icon}</span>
                <div>
                  <h3 className="font-bold text-white">{dept.name}</h3>
                  <p className="text-sm text-gray-400">{dept.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{dept.activeAgents}/{dept.totalAgents}</p>
                <p className="text-xs text-gray-500">稼働中</p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              {dept.tasks.map((task) => (
                <div key={task.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{task.name}</span>
                    <span className="text-white">{task.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neo-blue to-neo-cyan rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-neo-card rounded-xl p-6 border border-neo-blue/10">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-neo-cyan" />
          <h3 className="font-bold text-white">リアルタイムアクティビティ</h3>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-neo-dark/50 rounded-lg"
            >
              <span className="text-sm text-neo-cyan font-mono">{log.time}</span>
              <span className="px-2 py-1 bg-neo-blue/20 text-neo-blue text-xs rounded">
                {log.agent}
              </span>
              <span className="text-gray-300">{log.action}</span>
              <span className="text-gray-500 text-sm">{log.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
