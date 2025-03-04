import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your project
// You'll get these when you connect to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please connect to Supabase to get your credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);