import { createClient } from '@supabase/supabase-js';

// TODO: Add your Supabase URL and ANON_KEY to .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('⚠️  Supabase credentials not configured. Please add to .env');
}

export default supabase;
