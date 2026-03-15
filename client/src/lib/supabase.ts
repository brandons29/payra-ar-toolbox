import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured =
  !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== "" && supabaseAnonKey !== "";

// Only create the Supabase client when env vars are present.
// On Vercel, localStorage is available so sessions persist across page loads.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
