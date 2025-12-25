import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

/**
 * Supabase client for browser-side operations
 * Uses anon key for client-side auth flows
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
