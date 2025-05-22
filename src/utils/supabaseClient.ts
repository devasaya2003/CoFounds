import { createClient } from '@supabase/supabase-js';

// Client-side supabase client that uses the anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
