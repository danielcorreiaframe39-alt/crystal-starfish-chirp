import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variaveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY sao obrigatorias. Defina-as no arquivo .env.local.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
