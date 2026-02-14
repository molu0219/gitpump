
import { createClient } from '@supabase/supabase-js';

// 直接 Hardcode 您提供的憑證
const supabaseUrl = 'https://djqcgvprlntkfkalhsva.supabase.co';
const supabaseAnonKey = 'sb_publishable_Bv33rD0JKrCAwnTMsjmsYA_Jbu_4008';

export const isSupabaseConfigured = true;

/**
 * 核心 Supabase 客戶端實例
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 為了保持兼容性保留的空函式
 */
export const saveSupabaseConfig = () => {};
export const clearSupabaseConfig = () => {};
