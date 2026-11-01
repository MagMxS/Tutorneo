-- ============================================
-- TORNEOSPRO - ESQUEMA DE BASE DE DATOS
-- Ejecutar este SQL en el SQL Editor de Supabase
-- ============================================

-- 1. Tabla de Torneos
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('futbol', 'tochito')),
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'referee', 'player')),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Equipos
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  logo TEXT,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar foreign key para team_id en users
ALTER TABLE users ADD CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- 4. Tabla de Canchas
CREATE TABLE fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Partidos
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  week INTEGER NOT NULL,
  jornada INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_vivo', 'finalizado')),
  referee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  finished_at TEXT,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  home_mvp TEXT,
  away_mvp TEXT,
  is_elimination BOOLEAN DEFAULT FALSE,
  elimination_round TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de Eventos
CREATE TABLE match_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gol', 'yellow_card', 'red_card', 'touchdown', 'conversion_1', 'conversion_2', 'sack')),
  points INTEGER DEFAULT 0,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de Notificaciones
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('postponed', 'cancelled', 'rescheduled')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reason TEXT,
  week_from INTEGER,
  week_to INTEGER,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla de Configuración
CREATE TABLE config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  welcome_message TEXT DEFAULT '¡Bienvenido a TorneosPro!',
  phone TEXT DEFAULT '+52 555 123 4567',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración inicial
INSERT INTO config (welcome_message, phone) VALUES ('¡Bienvenido a TorneosPro!', '+52 555 123 4567');

-- 9. Tabla de Negocios Locales
CREATE TABLE local_businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  distance TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  website_url TEXT,
  phone TEXT,
  gradient_from TEXT NOT NULL,
  gradient_to TEXT NOT NULL,
  button_text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabla de Incidencias
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('lesion', 'conducta', 'cancha', 'otro')),
  details TEXT NOT NULL,
  referee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

CREATE INDEX idx_teams_tournament ON teams(tournament_id);
CREATE INDEX idx_fields_tournament ON fields(tournament_id);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_week ON matches(week);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_events_match ON match_events(match_id);
CREATE INDEX idx_notifications_tournament ON notifications(tournament_id);
CREATE INDEX idx_users_tournament ON users(tournament_id);

-- ============================================
-- INSERTAR SUPERADMIN INICIAL
-- ============================================

INSERT INTO users (username, password, name, role) 
VALUES ('superadmin', 'admin123', 'Super Administrador', 'superadmin');

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura (para empezar)
CREATE POLICY "Permitir lectura pública" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON users FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON teams FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON fields FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON matches FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON match_events FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON notifications FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON config FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON local_businesses FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública" ON incidents FOR SELECT USING (true);

-- Políticas de escritura (para empezar, luego puedes restringir)
CREATE POLICY "Permitir escritura pública" ON tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON match_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON local_businesses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escritura pública" ON incidents FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN DEL ESQUEMA
-- ============================================
