import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
let _warned = false;

export function getSupabase(): SupabaseClient | null {
  if (!_supabase) {
    const url =
      process.env.SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      if (!_warned) {
        console.warn("Supabase env vars not set — logging disabled");
        _warned = true;
      }
      return null;
    }

    _supabase = createClient(url, key);
  }
  return _supabase;
}
