import { createClient } from '@supabase/supabase-js';

// Credenciales de Supabase - REEMPLAZAR CON TUS PROPIAS CREDENCIALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verificar conexión
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('tournaments').select('count').limit(1);
    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err };
  }
};
