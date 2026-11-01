import { User, Tournament, Team, Field, Match, MatchEvent, Notification, AppConfig, LocalBusiness } from './types';

const KEYS = {
  users: 'torneospro_users',
  config: 'torneospro_config',
  tournaments: 'torneospro_tournaments',
  teams: 'torneospro_teams',
  fields: 'torneospro_fields',
  matches: 'torneospro_matches',
  events: 'torneospro_events',
  notifications: 'torneospro_notifications',
  businesses: 'torneospro_businesses',
  initialized: 'torneospro_initialized',
  currentUser: 'torneospro_user',
};

export function getDemoData<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function setDemoData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function addDemoItem<T extends { id: string }>(key: string, item: T): void {
  const data = getDemoData<T>(key);
  data.push(item);
  setDemoData(key, data);
}

export function removeDemoItem<T extends { id: string }>(key: string, id: string): void {
  const data = getDemoData<T>(key).filter(item => item.id !== id);
  setDemoData(key, data);
}

export function updateDemoItem<T extends { id: string }>(key: string, id: string, updates: Partial<T>): void {
  const data = getDemoData<T>(key).map(item => item.id === id ? { ...item, ...updates } : item);
  setDemoData(key, data);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(KEYS.currentUser);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.currentUser);
  }
}

export function getConfig(): AppConfig {
  const data = localStorage.getItem(KEYS.config);
  return data ? JSON.parse(data) : { welcomeMessage: '¡Bienvenido a TorneosPro!', phone: '+52 555 123 4567' };
}

export function setConfig(config: AppConfig): void {
  localStorage.setItem(KEYS.config, JSON.stringify(config));
}

export function initializeSystem(): void {
  const initialized = localStorage.getItem(KEYS.initialized);
  if (!initialized) {
    const superAdmin: User = {
      id: generateId(),
      username: 'superadmin',
      password: 'admin123',
      name: 'Super Administrador',
      role: 'superadmin',
    };
    setDemoData<User>(KEYS.users, [superAdmin]);
    setDemoData<Tournament>(KEYS.tournaments, []);
    setDemoData<Team>(KEYS.teams, []);
    setDemoData<Field>(KEYS.fields, []);
    setDemoData<Match>(KEYS.matches, []);
    setDemoData<MatchEvent>(KEYS.events, []);
    setDemoData<Notification>(KEYS.notifications, []);
    setDemoData<LocalBusiness>(KEYS.businesses, []);
    setConfig({ welcomeMessage: '¡Bienvenido a TorneosPro!', phone: '+52 555 123 4567' });
    localStorage.setItem(KEYS.initialized, 'true');
  }
}

export function resetAllData(): void {
  const users = getDemoData<User>(KEYS.users);
  const superAdmin = users.find(u => u.role === 'superadmin');
  setDemoData<User>(KEYS.users, superAdmin ? [superAdmin] : []);
  setDemoData<Tournament>(KEYS.tournaments, []);
  setDemoData<Team>(KEYS.teams, []);
  setDemoData<Field>(KEYS.fields, []);
  setDemoData<Match>(KEYS.matches, []);
  setDemoData<MatchEvent>(KEYS.events, []);
  setDemoData<Notification>(KEYS.notifications, []);
  setDemoData<LocalBusiness>(KEYS.businesses, []);
  setConfig({ welcomeMessage: '¡Bienvenido a TorneosPro!', phone: '+52 555 123 4567' });
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

export { KEYS };
