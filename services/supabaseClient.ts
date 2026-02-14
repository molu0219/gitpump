
import { createClient } from '@supabase/supabase-js';

// 從環境變數讀取憑證，若不存在則回退至提供的預設值
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://djqcgvprlntkfkalhsva.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Bv33rD0JKrCAwnTMsjmsYA_Jbu_4008';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * 核心 Supabase 客戶端實例
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 為了保持兼容性保留的空函式
 */
export const saveSupabaseConfig = () => {};
export const clearSupabaseConfig = () => {};
