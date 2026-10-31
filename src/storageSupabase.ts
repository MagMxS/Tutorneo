import { supabase } from './supabaseClient';
import { User, Tournament, Team, Field, Match, MatchEvent, Notification, AppConfig } from './types';

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export function generateId(): string {
  return crypto.randomUUID();
}

export function getCurrentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  return Math.ceil(diff / oneWeek);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

export function getWeekNumber(dateStr: string): number {
  const date = new Date(dateStr + 'T12:00:00');
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 604800000;
  return Math.ceil(diff / oneWeek);
}

// ============================================
// SESIÓN DE USUARIO
// ============================================

export function getCurrentUser(): User | null {
  const data = localStorage.getItem('torneospro_user');
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem('torneospro_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('torneospro_user');
  }
}

// ============================================
// CONFIGURACIÓN
// ============================================

export async function getConfig(): Promise<AppConfig> {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .single();
  
  if (error || !data) {
    return { welcomeMessage: '¡Bienvenido a TorneosPro!', phone: '+52 555 123 4567' };
  }
  
  return { welcomeMessage: data.welcome_message, phone: data.phone };
}

export async function setConfig(config: AppConfig): Promise<void> {
  await supabase
    .from('config')
    .update({ 
      welcome_message: config.welcomeMessage, 
      phone: config.phone,
      updated_at: new Date().toISOString()
    })
    .neq('id', '00000000-0000-0000-0000-000000000000');
}

// ============================================
// FUNCIONES GENÉRICAS DE DATOS
// ============================================

const TABLE_MAP: Record<string, string> = {
  'torneospro_users': 'users',
  'torneospro_tournaments': 'tournaments',
  'torneospro_teams': 'teams',
  'torneospro_fields': 'fields',
  'torneospro_matches': 'matches',
  'torneospro_events': 'match_events',
  'torneospro_notifications': 'notifications',
};

export async function getDemoData<T>(key: string): Promise<T[]> {
  const table = TABLE_MAP[key];
  if (!table) return [];
  
  const { data, error } = await supabase.from(table).select('*');
  
  if (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }
  
  return (data || []) as T[];
}

export async function setDemoData<T>(key: string, data: T[]): Promise<void> {
  const table = TABLE_MAP[key];
  if (!table) return;
  
  // Eliminar todos los registros existentes
  await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Insertar nuevos datos
  if (data.length > 0) {
    await supabase.from(table).insert(data as any);
  }
}

export async function addDemoItem<T extends { id?: string }>(key: string, item: T): Promise<void> {
  const table = TABLE_MAP[key];
  if (!table) return;
  
  const newItem = { ...item, id: item.id || generateId() };
  await supabase.from(table).insert(newItem as any);
}

export async function removeDemoItem<T extends { id: string }>(key: string, id: string): Promise<void> {
  const table = TABLE_MAP[key];
  if (!table) return;
  
  await supabase.from(table).delete().eq('id', id);
}

export async function updateDemoItem<T extends { id: string }>(key: string, id: string, updates: Partial<T>): Promise<void> {
  const table = TABLE_MAP[key];
  if (!table) return;
  
  await supabase.from(table).update(updates as any).eq('id', id);
}

// ============================================
// INICIALIZACIÓN
// ============================================

export async function initializeSystem(): Promise<void> {
  const initialized = localStorage.getItem('torneospro_initialized');
  if (initialized) return;
  
  // Verificar si ya existe el superadmin en Supabase
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'superadmin');
  
  if (!users || users.length === 0) {
    // Insertar superadmin
    await supabase.from('users').insert({
      id: generateId(),
      username: 'superadmin',
      password: 'admin123',
      name: 'Super Administrador',
      role: 'superadmin'
    });
  }
  
  localStorage.setItem('torneospro_initialized', 'true');
}

export async function resetAllData(): Promise<void> {
  // Eliminar todos los datos excepto el superadmin
  await supabase.from('tournaments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('fields').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('match_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('incidents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Eliminar todos los usuarios excepto superadmin
  await supabase.from('users').delete().neq('role', 'superadmin');
  
  // Resetear configuración
  await supabase.from('config').update({
    welcome_message: '¡Bienvenido a TorneosPro!',
    phone: '+52 555 123 4567'
  }).neq('id', '00000000-0000-0000-0000-000000000000');
}

// ============================================
// KEYS (para compatibilidad)
// ============================================

export const KEYS = {
  users: 'torneospro_users',
  config: 'torneospro_config',
  tournaments: 'torneospro_tournaments',
  teams: 'torneospro_teams',
  fields: 'torneospro_fields',
  matches: 'torneospro_matches',
  events: 'torneospro_events',
  notifications: 'torneospro_notifications',
  initialized: 'torneospro_initialized',
  currentUser: 'torneospro_user',
};
