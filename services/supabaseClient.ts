
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase configuration
 * The URL is now updated to the one provided: https://djqcgvprlntkfkalhsva.supabase.co
 */
const supabaseUrl = process.env.SUPABASE_URL || 'https://djqcgvprlntkfkalhsva.supabase.co';

/**
 * Note: If the project URL has changed, the anon key might also need updating 
 * to match the new project 'djqcgvprlntkfkalhsva'.
 */
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_Bv33rD0JKrCAwnTMsjmsYA_Jbu_4008';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log(`GitPump: Supabase initialized at ${supabaseUrl}`);
