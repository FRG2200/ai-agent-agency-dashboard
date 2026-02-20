-- AI Agent Agency - Supabase データベース設計
-- 実行方法: Supabase Dashboard → SQL Editor → New query → 貼り付け → Run

-- ============================================
-- 1. サービステーブル
-- ============================================
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10) NOT NULL,
  title VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  price_unit VARCHAR(20) DEFAULT '/月',
  description TEXT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. 注文テーブル
-- ============================================
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(200) NOT NULL,
  client_email VARCHAR(200),
  service_id VARCHAR(50) REFERENCES services(service_id),
  service_name VARCHAR(100),
  amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in-progress', 'review', 'completed', 'cancelled')),
  
  -- 割当情報
  assigned_agent VARCHAR(100),
  assigned_at TIMESTAMP WITH TIME ZONE,
  
  -- 進捗情報
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  eta VARCHAR(50),
  deadline TIMESTAMP WITH TIME ZONE,
  
  -- レビュー情報
  qa_agent VARCHAR(100),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- 完了情報
  completed_at TIMESTAMP WITH TIME ZONE,
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  
  -- N8N連携
  n8n_workflow_id VARCHAR(100),
  n8n_execution_id VARCHAR(100),
  
  -- メタデータ
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. エージェントステータステーブル
-- ============================================
CREATE TABLE agent_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id VARCHAR(100) UNIQUE NOT NULL,
  agent_name VARCHAR(200) NOT NULL,
  department VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'busy', 'offline')),
  current_task_id UUID REFERENCES orders(id),
  current_task_name VARCHAR(200),
  completed_tasks_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. アクティビティログテーブル
-- ============================================
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id VARCHAR(100),
  agent_name VARCHAR(200),
  action VARCHAR(200) NOT NULL,
  details TEXT,
  order_id UUID REFERENCES orders(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. N8N Webhook連携テーブル
-- ============================================
CREATE TABLE n8n_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_type VARCHAR(100) NOT NULL, -- 'order_received', 'task_complete', etc.
  workflow_id VARCHAR(100),
  execution_id VARCHAR(100),
  payload JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- インデックス作成
-- ============================================
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_assigned_agent ON orders(assigned_agent);
CREATE INDEX idx_agent_status_department ON agent_status(department);
CREATE INDEX idx_agent_status_status ON agent_status(status);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================
-- 初期データ投入
-- ============================================

-- サービスデータ
INSERT INTO services (service_id, icon, title, price, price_unit, description, features) VALUES
('youtube', '🎬', 'YouTube運用代行', 30000, '/月', 'AIが企画・脚本・編集・投稿を自動化', '["週3本投稿", "SEO最適化", "分析レポート", "サムネイル自動生成"]'),
('content', '✍️', 'コンテンツ制作', 10000, '/月', 'ブログ・メルマガ・SNS投稿を自動生成', '["note週2本", "SNS投稿1日3回", "メルマガ週1回", "SEO対策込み"]'),
('sales', '💼', '営業代行', 50000, '/月', 'リード生成・アプローチ・商談まで自動化', '["月500リード発掘", "AI営業メール", "商談設定", "CRM連携"]'),
('automation', '⚙️', '業務自動化', 100000, '〜', '受注から納品までのワークフローを構築', '["カスタム構築", "N8N連携", "24時間稼働", "専任サポート"]');

-- エージェントデータ（67名）
-- コンテンツ事業部（20名）
INSERT INTO agent_status (agent_id, agent_name, department, status) VALUES
('AI-CONTENT-01', 'YouTube-Director', 'コンテンツ事業部', 'active'),
('AI-CONTENT-02', 'YouTube-Editor-01', 'コンテンツ事業部', 'active'),
('AI-CONTENT-03', 'YouTube-Editor-02', 'コンテンツ事業部', 'active'),
('AI-CONTENT-04', 'Content-Writer-01', 'コンテンツ事業部', 'active'),
('AI-CONTENT-05', 'Content-Writer-02', 'コンテンツ事業部', 'active'),
('AI-CONTENT-06', 'Content-Writer-03', 'コンテンツ事業部', 'idle'),
('AI-CONTENT-07', 'SNS-Manager-01', 'コンテンツ事業部', 'active'),
('AI-CONTENT-08', 'SNS-Manager-02', 'コンテンツ事業部', 'active'),
('AI-CONTENT-09', 'SNS-Manager-03', 'コンテンツ事業部', 'idle'),
('AI-CONTENT-10', 'Thumbnail-Designer', 'コンテンツ事業部', 'active'),
('AI-CONTENT-11', 'SEO-Specialist-01', 'コンテンツ事業部', 'active'),
('AI-CONTENT-12', 'SEO-Specialist-02', 'コンテンツ事業部', 'idle'),
('AI-CONTENT-13', 'Script-Writer-01', 'コンテンツ事業部', 'busy'),
('AI-CONTENT-14', 'Script-Writer-02', 'コンテンツ事業部', 'active'),
('AI-CONTENT-15', 'Blog-Writer-01', 'コンテンツ事業部', 'active'),
('AI-CONTENT-16', 'Blog-Writer-02', 'コンテンツ事業部', 'active'),
('AI-CONTENT-17', 'Newsletter-Writer', 'コンテンツ事業部', 'idle'),
('AI-CONTENT-18', 'X-Poster-01', 'コンテンツ事業部', 'active'),
('AI-CONTENT-19', 'X-Poster-02', 'コンテンツ事業部', 'active'),
('AI-CONTENT-20', 'X-Poster-03', 'コンテンツ事業部', 'idle');

-- ビジネス開発事業部（16名）
INSERT INTO agent_status (agent_id, agent_name, department, status) VALUES
('AI-SALES-01', 'Sales-AI-01', 'ビジネス開発事業部', 'active'),
('AI-SALES-02', 'Sales-AI-02', 'ビジネス開発事業部', 'busy'),
('AI-SALES-03', 'Sales-AI-03', 'ビジネス開発事業部', 'active'),
('AI-SALES-04', 'Sales-AI-04', 'ビジネス開発事業部', 'idle'),
('AI-SALES-05', 'Lead-Generator-01', 'ビジネス開発事業部', 'active'),
('AI-SALES-06', 'Lead-Generator-02', 'ビジネス開発事業部', 'active'),
('AI-SALES-07', 'Lead-Generator-03', 'ビジネス開発事業部', 'idle'),
('AI-SALES-08', 'CRM-Manager', 'ビジネス開発事業部', 'active'),
('AI-SALES-09', 'Email-Marketer-01', 'ビジネス開発事業部', 'active'),
('AI-SALES-10', 'Email-Marketer-02', 'ビジネス開発事業部', 'idle'),
('AI-SALES-11', 'Appointment-Setter', 'ビジネス開発事業部', 'active'),
('AI-SALES-12', 'Proposal-Writer', 'ビジネス開発事業部', 'busy'),
('AI-SALES-13', 'Market-Researcher-01', 'ビジネス開発事業部', 'active'),
('AI-SALES-14', 'Market-Researcher-02', 'ビジネス開発事業部', 'idle'),
('AI-SALES-15', 'Competitor-Analyst', 'ビジネス開発事業部', 'active'),
('AI-SALES-16', 'Sales-Reporter', 'ビジネス開発事業部', 'active');

-- テクニカル事業部（5名）
INSERT INTO agent_status (agent_id, agent_name, department, status) VALUES
('AI-TECH-01', 'Code-Reviewer', 'テクニカル事業部', 'active'),
('AI-TECH-02', 'DevOps-AI', 'テクニカル事業部', 'busy'),
('AI-TECH-03', 'Test-Engineer', 'テクニカル事業部', 'active'),
('AI-TECH-04', 'Security-AI', 'テクニカル事業部', 'idle'),
('AI-TECH-05', 'Database-AI', 'テクニカル事業部', 'active');

-- オペレーション事業部（10名）
INSERT INTO agent_status (agent_id, agent_name, department, status) VALUES
('AI-OPS-01', 'Email-Handler-01', 'オペレーション事業部', 'active'),
('AI-OPS-02', 'Email-Handler-02', 'オペレーション事業部', 'active'),
('AI-OPS-03', 'Scheduler-AI', 'オペレーション事業部', 'busy'),
('AI-OPS-04', 'Document-Manager', 'オペレーション事業部', 'active'),
('AI-OPS-05', 'Invoice-Processor', 'オペレーション事業部', 'idle'),
('AI-OPS-06', 'Customer-Support-01', 'オペレーション事業部', 'active'),
('AI-OPS-07', 'Customer-Support-02', 'オペレーション事業部', 'idle'),
('AI-OPS-08', 'Data-Entry-AI', 'オペレーション事業部', 'active'),
('AI-OPS-09', 'Meeting-Transcriber', 'オペレーション事業部', 'active'),
('AI-OPS-10', 'Report-Generator', 'オペレーション事業部', 'idle');

-- PRIME AI（統括）
INSERT INTO agent_status (agent_id, agent_name, department, status) VALUES
('PRIME-AI', 'PRIME-AI', '経営層', 'active');

-- サンプル注文データ
INSERT INTO orders (order_id, client_name, client_email, service_id, service_name, amount, status, priority) VALUES
('ORD-2026-0001', 'ABC株式会社', 'contact@abc-corp.jp', 'youtube', 'YouTube運用代行', 30000, 'new', 'high'),
('ORD-2026-0002', 'XYZ商事', 'info@xyz-trade.co.jp', 'content', 'コンテンツ制作', 10000, 'assigned', 'normal'),
('ORD-2026-0003', '123株式会社', 'hello@123-inc.com', 'sales', '営業代行', 50000, 'in-progress', 'high'),
('ORD-2026-0004', 'Sample Inc.', 'admin@sample.jp', 'automation', '業務自動化', 150000, 'review', 'urgent');

-- サンプルアクティビティログ
INSERT INTO activity_logs (agent_id, agent_name, action, details) VALUES
('AI-CONTENT-01', 'YouTube-Director', '動画投稿完了', '週次レポート #45'),
('AI-SALES-02', 'Sales-AI-02', '営業メール送信', '50件送信完了'),
('AI-CONTENT-04', 'Content-Writer-01', 'ブログ記事完了', '2本公開'),
('AI-OPS-03', 'Scheduler-AI', 'ミーティング設定', '明日14:00'),
('PRIME-AI', 'PRIME-AI', 'レポート生成', '週次分析完了');

-- ============================================
-- 自動更新トリガー
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_status_updated_at BEFORE UPDATE ON agent_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLSポリシー（セキュリティ）
-- ============================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 読み取りポリシー（認証済みユーザー）
CREATE POLICY "Allow read services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow read agent_status" ON agent_status FOR SELECT USING (true);
CREATE POLICY "Allow read activity_logs" ON activity_logs FOR SELECT USING (true);

-- 書き込みポリシー（サービスロールのみ）
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update orders" ON orders FOR UPDATE USING (true);

-- ============================================
-- Realtime有効化
-- ============================================
BEGIN;
  -- テーブルをRealtimeに追加
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  ALTER PUBLICATION supabase_realtime ADD TABLE agent_status;
  ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
COMMIT;
