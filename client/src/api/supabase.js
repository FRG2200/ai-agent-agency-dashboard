import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Realtimeサブスクリプションヘルパー
export const subscribeToOrders = (callback) => {
  if (!supabaseUrl) return null;
  
  const subscription = supabase
    .channel('orders-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
    
  return subscription;
};

export const subscribeToActivityLogs = (callback) => {
  if (!supabaseUrl) return null;
  
  const subscription = supabase
    .channel('activity-channel')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'activity_logs' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
    
  return subscription;
};

export const subscribeToAgentStatus = (callback) => {
  if (!supabaseUrl) return null;
  
  const subscription = supabase
    .channel('agents-channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'agent_status' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
    
  return subscription;
};
