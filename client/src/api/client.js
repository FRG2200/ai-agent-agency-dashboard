// APIクライアント設定
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// API呼び出しヘルパー
export const apiClient = {
  async get(endpoint) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
  
  async post(endpoint, data) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }
};

// APIエンドポイント
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  SERVICES: '/api/services',
  DASHBOARD_STATS: '/api/dashboard/stats',
  DASHBOARD_AGENTS: '/api/dashboard/agents',
  WORKFLOW_ORDERS: '/api/workflow/orders',
  ACTIVITY_LOGS: '/api/activity/logs',
};
