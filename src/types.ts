export type SportType = 'futbol' | 'tochito';
export type UserRole = 'superadmin' | 'admin' | 'referee' | 'player';
export type MatchStatus = 'pendiente' | 'en_vivo' | 'finalizado';
export type NotificationType = 'postponed' | 'cancelled' | 'rescheduled';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  tournamentId?: string;
  teamId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  sport: SportType;
  logo?: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  logo?: string;
  tournamentId: string;
}

export interface Field {
  id: string;
  name: string;
  tournamentId: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  fieldId?: string;
  date: string;
  time: string;
  week: number;
  jornada: number;
  status: MatchStatus;
  refereeId?: string;
  finishedAt?: string;
  homeScore: number;
  awayScore: number;
  homeMvp?: string;
  awayMvp?: string;
  isElimination?: boolean;
  eliminationRound?: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  type: 'gol' | 'yellow_card' | 'red_card' | 'touchdown' | 'conversion_1' | 'conversion_2' | 'sack';
  points: number;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  reason?: string;
  weekFrom?: number;
  weekTo?: number;
  tournamentId: string;
  read: boolean;
  timestamp: number;
}

export interface AppConfig {
  welcomeMessage: string;
  phone: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  description: string;
  icon: string;
  distance: string;
  rating: number;
  websiteUrl: string;
  gradientFrom: string;
  gradientTo: string;
  buttonText: string;
  active: boolean;
}

export interface StandingRow {
  teamId: string;
  teamName: string;
  teamColor: string;
  teamLogo?: string;
  jj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dif: number;
  pts: number;
}

export interface ScorerRow {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  goals: number;
  mvps?: number;
}
