import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy, Users, Settings, LogOut, Eye, EyeOff, Plus, Edit, Trash2,
  Calendar, Clock, MapPin, Bell, Check, X, AlertTriangle, Star,
  ChevronDown, ChevronUp, User as UserIcon, Shield, Target, Award
} from 'lucide-react';
import {
  User, Tournament, Team, Field, Match, MatchEvent, Notification,
  AppConfig, SportType, MatchStatus, StandingRow, ScorerRow
} from './types';
import {
  getDemoData, setDemoData, addDemoItem, removeDemoItem, updateDemoItem,
  generateId, getCurrentUser, setCurrentUser, getConfig, setConfig,
  initializeSystem, resetAllData, getCurrentWeek, formatDate, getWeekNumber, KEYS
} from './storage';

// ==================== MODAL COMPONENT ====================
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-yellow-400">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ==================== CONFIRM MODAL ====================
function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content max-w-md" onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-red-500/20 p-3 rounded-full">
            <AlertTriangle className="text-red-400" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 btn-danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== IMAGE UPLOADER ====================
function ImageUploader({ value, onChange, label }: { value?: string; onChange: (v: string) => void; label: string }) {
  const [error, setError] = useState('');
  const handleFile = (file: File) => {
    setError('');
    if (file.size > 512000) { setError('Imagen mayor a 500 KB'); return; }
    if (!['image/png', 'image/jpeg'].includes(file.type)) { setError('Solo PNG o JPG'); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">{label}</label>
      {value ? (
        <div className="flex items-center gap-3">
          <img src={value} className="w-16 h-16 rounded-lg object-cover border border-gray-600" />
          <button onClick={() => onChange('')} className="text-red-400 hover:text-red-300 text-sm">Eliminar</button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-yellow-500 transition-colors">
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <span className="text-gray-400 text-sm">Seleccionar imagen (PNG/JPG, máx 500KB)</span>
        </label>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

// ==================== LOGIN ====================
function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const config = getConfig();

  const handleLogin = () => {
    const users = getDemoData<User>(KEYS.users);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) { setCurrentUser(user); onLogin(user); }
    else setError('Credenciales incorrectas');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">TorneosPro</h1>
          <p className="text-gray-400 mt-2">{config.welcomeMessage}</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Usuario</label>
            <input className="input-field" value={username} onChange={e => { setUsername(e.target.value); setError(''); }} placeholder="Nombre de usuario" />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Contraseña</label>
            <div className="relative">
              <input className="input-field pr-10" type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Contraseña" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="btn-primary w-full" onClick={handleLogin}>Iniciar Sesión</button>
          <p className="text-center text-gray-500 text-sm">{config.phone}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== SUPER ADMIN PANEL ====================
function SuperAdminPanel({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab, setTab] = useState<'tournaments' | 'users' | 'config'>('tournaments');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfigState] = useState<AppConfig>(getConfig());
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassMap, setShowPassMap] = useState<Record<string, boolean>>({});
  const [resetUsername, setResetUsername] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'tournament' | 'user'; id: string; name: string } | null>(null);

  const loadData = useCallback(() => {
    setTournaments(getDemoData<Tournament>(KEYS.tournaments));
    setUsers(getDemoData<User>(KEYS.users));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Tournament CRUD
  const [tForm, setTForm] = useState({ name: '', sport: 'futbol' as SportType, logo: '' });
  const openTournamentModal = (t?: Tournament) => {
    if (t) { setEditingTournament(t); setTForm({ name: t.name, sport: t.sport, logo: t.logo || '' }); }
    else { setEditingTournament(null); setTForm({ name: '', sport: 'futbol', logo: '' }); }
    setShowTournamentModal(true);
  };
  const saveTournament = () => {
    if (!tForm.name.trim()) return;
    if (editingTournament) {
      updateDemoItem<Tournament>(KEYS.tournaments, editingTournament.id, { name: tForm.name, sport: tForm.sport, logo: tForm.logo });
    } else {
      addDemoItem<Tournament>(KEYS.tournaments, { id: generateId(), name: tForm.name, sport: tForm.sport, logo: tForm.logo });
    }
    setShowTournamentModal(false);
    loadData();
  };
  const deleteTournament = (id: string, name: string) => {
    setConfirmDelete({ type: 'tournament', id, name });
  };
  const confirmDeleteTournament = () => {
    if (!confirmDelete || confirmDelete.type !== 'tournament') return;
    const id = confirmDelete.id;
    removeDemoItem<Tournament>(KEYS.tournaments, id);
    setDemoData<Team>(KEYS.teams, getDemoData<Team>(KEYS.teams).filter(t => t.tournamentId !== id));
    setDemoData<Field>(KEYS.fields, getDemoData<Field>(KEYS.fields).filter(f => f.tournamentId !== id));
    setDemoData<Match>(KEYS.matches, getDemoData<Match>(KEYS.matches).filter(m => m.tournamentId !== id));
    setDemoData<User>(KEYS.users, getDemoData<User>(KEYS.users).filter(u => u.tournamentId !== id || u.role === 'superadmin'));
    setConfirmDelete(null);
    loadData();
  };

  // User CRUD
  const [uForm, setUForm] = useState({ name: '', username: '', password: '', role: 'admin' as User['role'], tournamentId: '', teamId: '' });
  const openUserModal = (u?: User) => {
    if (u) {
      setEditingUser(u);
      setUForm({ name: u.name, username: u.username, password: u.password, role: u.role, tournamentId: u.tournamentId || '', teamId: u.teamId || '' });
    } else {
      setEditingUser(null);
      setUForm({ name: '', username: '', password: '', role: 'admin', tournamentId: '', teamId: '' });
    }
    setShowUserModal(true);
  };
  const saveUser = () => {
    if (!uForm.name.trim() || !uForm.username.trim() || !uForm.password.trim()) return;
    if (editingUser) {
      updateDemoItem<User>(KEYS.users, editingUser.id, { ...uForm, tournamentId: uForm.tournamentId || undefined, teamId: uForm.teamId || undefined });
    } else {
      addDemoItem<User>(KEYS.users, { id: generateId(), ...uForm, tournamentId: uForm.tournamentId || undefined, teamId: uForm.teamId || undefined });
    }
    setShowUserModal(false);
    loadData();
  };
  const deleteUser = (id: string, name: string) => {
    setConfirmDelete({ type: 'user', id, name });
  };
  const confirmDeleteUser = () => {
    if (!confirmDelete || confirmDelete.type !== 'user') return;
    removeDemoItem<User>(KEYS.users, confirmDelete.id);
    setConfirmDelete(null);
    loadData();
  };

  const handleReset = () => {
    if (resetUsername === 'superadmin' && resetPassword === 'admin123') {
      resetAllData();
      setShowResetModal(false);
      setResetUsername(''); setResetPassword('');
      loadData();
    }
  };

  const teams = getDemoData<Team>(KEYS.teams);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            <h1 className="text-xl font-bold text-white">TorneosPro</h1>
            <span className="text-xs bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full font-bold">SuperAdmin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowResetModal(true)} className="btn-danger text-sm flex items-center gap-1"><AlertTriangle size={16} />Resetear</button>
            <button onClick={onLogout} className="text-gray-400 hover:text-white flex items-center gap-1"><LogOut size={18} />Salir</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[{ k: 'tournaments', label: 'Torneos', icon: <Trophy size={18} /> }, { k: 'users', label: 'Usuarios', icon: <Users size={18} /> }, { k: 'config', label: 'Configuración', icon: <Settings size={18} /> }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${tab === t.k ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Tournaments Tab */}
        {tab === 'tournaments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Torneos</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => openTournamentModal()}><Plus size={18} />Nuevo Torneo</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.map(t => (
                <div key={t.id} className="card flex items-start gap-4">
                  {t.logo ? <img src={t.logo} className="w-16 h-16 rounded-lg object-cover" /> : <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center"><Trophy size={24} className="text-gray-900" /></div>}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <span className="text-sm text-gray-400 capitalize">{t.sport === 'futbol' ? '⚽ Fútbol' : '🏈 Tochito'}</span>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => openTournamentModal(t)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></button>
                      <button onClick={() => deleteTournament(t.id, t.name)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {tournaments.length === 0 && <p className="text-gray-500 text-center py-8">No hay torneos creados</p>}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Usuarios</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => openUserModal()}><Plus size={18} />Nuevo Usuario</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-gray-400">Nombre</th>
                  <th className="py-3 px-4 text-gray-400">Usuario</th>
                  <th className="py-3 px-4 text-gray-400">Contraseña</th>
                  <th className="py-3 px-4 text-gray-400">Rol</th>
                  <th className="py-3 px-4 text-gray-400">Torneo</th>
                  <th className="py-3 px-4 text-gray-400">Acciones</th>
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4 text-gray-300">{u.username}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">{showPassMap[u.id] ? u.password : '••••••'}</span>
                          <button onClick={() => setShowPassMap(p => ({ ...p, [u.id]: !p[u.id] }))} className="text-gray-400 hover:text-white">
                            {showPassMap[u.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : u.role === 'referee' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{u.role === 'admin' ? 'Admin' : u.role === 'referee' ? 'Árbitro' : 'Jugador'}</span></td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{tournaments.find(t => t.id === u.tournamentId)?.name || '-'}</td>
                      <td className="py-3 px-4">
                        {u.role !== 'superadmin' && (
                          <div className="flex gap-2">
                            <button onClick={() => openUserModal(u)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></button>
                            <button onClick={() => deleteUser(u.id, u.name)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Config Tab */}
        {tab === 'config' && (
          <div className="card max-w-lg">
            <h2 className="text-xl font-bold mb-4">Configuración</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Mensaje de Bienvenida</label>
                <input className="input-field" value={config.welcomeMessage} onChange={e => setConfigState({ ...config, welcomeMessage: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Teléfono de Contacto</label>
                <input className="input-field" value={config.phone} onChange={e => setConfigState({ ...config, phone: e.target.value })} />
              </div>
              <button className="btn-primary" onClick={() => { setConfig(config); alert('Configuración guardada'); }}>Guardar</button>
            </div>
          </div>
        )}
      </div>

      {/* Tournament Modal */}
      <Modal isOpen={showTournamentModal} onClose={() => setShowTournamentModal(false)} title={editingTournament ? 'Editar Torneo' : 'Nuevo Torneo'}>
        <div className="space-y-4">
          <div><label className="text-sm text-gray-300 mb-1 block">Nombre</label><input className="input-field" value={tForm.name} onChange={e => setTForm({ ...tForm, name: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Deporte</label>
            <select className="input-field" value={tForm.sport} onChange={e => setTForm({ ...tForm, sport: e.target.value as SportType })}>
              <option value="futbol">⚽ Fútbol</option><option value="tochito">🏈 Tochito Bandera</option>
            </select>
          </div>
          <ImageUploader value={tForm.logo} onChange={v => setTForm({ ...tForm, logo: v })} label="Logo del torneo" />
          <button className="btn-primary w-full" onClick={saveTournament}>{editingTournament ? 'Guardar Cambios' : 'Crear Torneo'}</button>
        </div>
      </Modal>

      {/* User Modal */}
      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <div className="space-y-4">
          <div><label className="text-sm text-gray-300 mb-1 block">Nombre</label><input className="input-field" value={uForm.name} onChange={e => setUForm({ ...uForm, name: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Usuario</label><input className="input-field" value={uForm.username} onChange={e => setUForm({ ...uForm, username: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Contraseña</label><input className="input-field" value={uForm.password} onChange={e => setUForm({ ...uForm, password: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Rol</label>
            <select className="input-field" value={uForm.role} onChange={e => setUForm({ ...uForm, role: e.target.value as User['role'] })}>
              <option value="admin">Administrador</option><option value="referee">Árbitro</option><option value="player">Jugador</option>
            </select>
          </div>
          <div><label className="text-sm text-gray-300 mb-1 block">Torneo</label>
            <select className="input-field" value={uForm.tournamentId} onChange={e => setUForm({ ...uForm, tournamentId: e.target.value })}>
              <option value="">Sin asignar</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {uForm.role === 'player' && uForm.tournamentId && (
            <div><label className="text-sm text-gray-300 mb-1 block">Equipo</label>
              <select className="input-field" value={uForm.teamId} onChange={e => setUForm({ ...uForm, teamId: e.target.value })}>
                <option value="">Sin asignar</option>
                {teams.filter(t => t.tournamentId === uForm.tournamentId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          )}
          <button className="btn-primary w-full" onClick={saveUser}>{editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</button>
        </div>
      </Modal>

      {/* Reset Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Resetear Sistema">
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-medium mb-2">⚠️ Se eliminarán todos los datos:</p>
            <ul className="text-red-300 text-sm space-y-1">
              <li>• Todos los torneos</li><li>• Todos los equipos</li><li>• Todos los partidos</li>
              <li>• Todos los usuarios (excepto superadmin)</li><li>• Todas las configuraciones</li>
            </ul>
          </div>
          <div><label className="text-sm text-gray-300 mb-1 block">Usuario (debe ser: superadmin)</label><input className="input-field" value={resetUsername} onChange={e => setResetUsername(e.target.value)} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Contraseña (debe ser: admin123)</label><input className="input-field" type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} /></div>
          <button className="btn-danger w-full" onClick={handleReset} disabled={resetUsername !== 'superadmin' || resetPassword !== 'admin123'}>
            Confirmar Reset
          </button>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDelete?.type === 'tournament' ? confirmDeleteTournament : confirmDeleteUser}
        title={confirmDelete?.type === 'tournament' ? 'Eliminar Torneo' : 'Eliminar Usuario'}
        message={confirmDelete?.type === 'tournament'
          ? `¿Eliminar el torneo "${confirmDelete?.name}" y todos sus datos asociados?`
          : `¿Eliminar al usuario "${confirmDelete?.name}"?`}
      />
    </div>
  );
}

// ==================== ADMIN PANEL ====================
function AdminPanel({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab, setTab] = useState<'teams' | 'fields' | 'users' | 'calendar' | 'standings' | 'elimination'>('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'team' | 'field' | 'user' | 'match'; id: string; name: string } | null>(null);
  const tournament = getDemoData<Tournament>(KEYS.tournaments).find(t => t.id === user.tournamentId);

  const loadData = useCallback(() => {
    if (!user.tournamentId) return;
    setTeams(getDemoData<Team>(KEYS.teams).filter(t => t.tournamentId === user.tournamentId));
    setFields(getDemoData<Field>(KEYS.fields).filter(f => f.tournamentId === user.tournamentId));
    setUsers(getDemoData<User>(KEYS.users).filter(u => u.tournamentId === user.tournamentId));
    setMatches(getDemoData<Match>(KEYS.matches).filter(m => m.tournamentId === user.tournamentId));
    setEvents(getDemoData<MatchEvent>(KEYS.events));
  }, [user.tournamentId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Team CRUD
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamForm, setTeamForm] = useState({ name: '', color: '#3B82F6', logo: '' });
  const openTeamModal = (t?: Team) => {
    if (t) { setEditingTeam(t); setTeamForm({ name: t.name, color: t.color, logo: t.logo || '' }); }
    else { setEditingTeam(null); setTeamForm({ name: '', color: '#3B82F6', logo: '' }); }
    setShowTeamModal(true);
  };
  const saveTeam = () => {
    if (!teamForm.name.trim()) return;
    if (editingTeam) updateDemoItem<Team>(KEYS.teams, editingTeam.id, { name: teamForm.name, color: teamForm.color, logo: teamForm.logo });
    else addDemoItem<Team>(KEYS.teams, { id: generateId(), name: teamForm.name, color: teamForm.color, logo: teamForm.logo, tournamentId: user.tournamentId! });
    setShowTeamModal(false); loadData();
  };
  const deleteTeam = (id: string, name: string) => { setConfirmDelete({ type: 'team', id, name }); };
  const confirmDeleteTeam = () => {
    if (!confirmDelete || confirmDelete.type !== 'team') return;
    removeDemoItem<Team>(KEYS.teams, confirmDelete.id);
    setConfirmDelete(null);
    loadData();
  };

  // Field CRUD
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [fieldForm, setFieldForm] = useState({ name: '' });
  const openFieldModal = (f?: Field) => {
    if (f) { setEditingField(f); setFieldForm({ name: f.name }); } else { setEditingField(null); setFieldForm({ name: '' }); }
    setShowFieldModal(true);
  };
  const saveField = () => {
    if (!fieldForm.name.trim()) return;
    if (editingField) updateDemoItem<Field>(KEYS.fields, editingField.id, { name: fieldForm.name });
    else addDemoItem<Field>(KEYS.fields, { id: generateId(), name: fieldForm.name, tournamentId: user.tournamentId! });
    setShowFieldModal(false); loadData();
  };
  const deleteField = (id: string, name: string) => { setConfirmDelete({ type: 'field', id, name }); };
  const confirmDeleteField = () => {
    if (!confirmDelete || confirmDelete.type !== 'field') return;
    removeDemoItem<Field>(KEYS.fields, confirmDelete.id);
    setConfirmDelete(null);
    loadData();
  };

  // User CRUD (referees/players)
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [uForm, setUForm] = useState({ name: '', username: '', password: '', role: 'referee' as User['role'], teamId: '' });
  const openUserModal = (u?: User) => {
    if (u) { setEditingUser(u); setUForm({ name: u.name, username: u.username, password: u.password, role: u.role, teamId: u.teamId || '' }); }
    else { setEditingUser(null); setUForm({ name: '', username: '', password: '', role: 'referee', teamId: '' }); }
    setShowUserModal(true);
  };
  const saveUser = () => {
    if (!uForm.name.trim() || !uForm.username.trim() || !uForm.password.trim()) return;
    if (editingUser) updateDemoItem<User>(KEYS.users, editingUser.id, { ...uForm, tournamentId: user.tournamentId, teamId: uForm.role === 'player' ? uForm.teamId : undefined });
    else addDemoItem<User>(KEYS.users, { id: generateId(), ...uForm, tournamentId: user.tournamentId, teamId: uForm.role === 'player' ? uForm.teamId : undefined });
    setShowUserModal(false); loadData();
  };
  const deleteUser = (id: string, name: string) => { setConfirmDelete({ type: 'user', id, name }); };
  const confirmDeleteUser = () => {
    if (!confirmDelete || confirmDelete.type !== 'user') return;
    removeDemoItem<User>(KEYS.users, confirmDelete.id);
    setConfirmDelete(null);
    loadData();
  };

  // Calendar generation
  const [showGenModal, setShowGenModal] = useState(false);
  const [genForm, setGenForm] = useState({ day: '0', startDate: '', startTime: '10:00', interval: 2, jornada: 1, numJornadas: 1 });

  const generateCalendar = () => {
    if (teams.length < 2) { alert('Se necesitan al menos 2 equipos'); return; }
    const newMatches: Match[] = [];
    const dayNum = parseInt(genForm.day);
    const start = new Date(genForm.startDate + 'T12:00:00');
    let currentDate = new Date(start);

    // Find next occurrence of the day
    while (currentDate.getDay() !== dayNum) currentDate.setDate(currentDate.getDate() + 1);

    const teamIds = teams.map(t => t.id);
    const n = teamIds.length;
    const hasBye = n % 2 !== 0;
    const roundTeams = hasBye ? [...teamIds, 'BYE'] : [...teamIds];
    const numRounds = roundTeams.length - 1;

    for (let j = 0; j < genForm.numJornadas; j++) {
      const jornadaNum = genForm.jornada + j;
      const roundIdx = (jornadaNum - 1) % numRounds;
      const weekNum = getWeekNumber(currentDate.toISOString().split('T')[0]);

      // Round robin rotation
      const rotated = [roundTeams[0], ...roundTeams.slice(1).slice(roundIdx).concat(roundTeams.slice(1, roundIdx + 1) as any).slice(0, roundTeams.length - 1)];
      
      let hourOffset = 0;
      for (let i = 0; i < rotated.length / 2; i++) {
        const home = i % 2 === 0 ? rotated[i] : rotated[rotated.length - 1 - i];
        const away = i % 2 === 0 ? rotated[rotated.length - 1 - i] : rotated[i];
        if (home === 'BYE' || away === 'BYE') continue;
        const [h, m] = genForm.startTime.split(':').map(Number);
        const matchTime = new Date(currentDate);
        matchTime.setHours(h + hourOffset, m);
        hourOffset += genForm.interval;

        newMatches.push({
          id: generateId(),
          tournamentId: user.tournamentId!,
          homeTeamId: home,
          awayTeamId: away,
          date: currentDate.toISOString().split('T')[0],
          time: `${String(matchTime.getHours()).padStart(2, '0')}:${String(matchTime.getMinutes()).padStart(2, '0')}`,
          week: weekNum,
          jornada: jornadaNum,
          status: 'pendiente',
          homeScore: 0,
          awayScore: 0,
        });
      }
      currentDate.setDate(currentDate.getDate() + 7);
    }

    const existing = getDemoData<Match>(KEYS.matches);
    setDemoData<Match>(KEYS.matches, [...existing, ...newMatches]);
    setShowGenModal(false);
    loadData();
  };

  // Match editing
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [matchForm, setMatchForm] = useState({ homeTeamId: '', awayTeamId: '', fieldId: '', date: '', time: '', jornada: 1, week: 1 });

  const openMatchModal = (m: Match) => {
    // Check grace period for finished matches
    if (m.status === 'finalizado' && m.finishedAt) {
      const elapsed = Date.now() - new Date(m.finishedAt).getTime();
      if (elapsed > 5 * 60 * 1000) { alert('🔒 Período de edición expirado'); return; }
    }
    setEditingMatch(m);
    setMatchForm({ homeTeamId: m.homeTeamId, awayTeamId: m.awayTeamId, fieldId: m.fieldId || '', date: m.date, time: m.time, jornada: m.jornada, week: m.week });
    setShowMatchModal(true);
  };
  const saveMatch = () => {
    if (!editingMatch) return;
    updateDemoItem<Match>(KEYS.matches, editingMatch.id, { ...matchForm, fieldId: matchForm.fieldId || undefined });
    setShowMatchModal(false); loadData();
  };
  const deleteMatch = (id: string) => {
    const m = matches.find(x => x.id === id);
    if (m) {
      const homeName = teams.find(t => t.id === m.homeTeamId)?.name || 'Local';
      const awayName = teams.find(t => t.id === m.awayTeamId)?.name || 'Visitante';
      setConfirmDelete({ type: 'match', id, name: `${homeName} vs ${awayName}` });
    }
  };
  const confirmDeleteMatch = () => {
    if (!confirmDelete || confirmDelete.type !== 'match') return;
    removeDemoItem<Match>(KEYS.matches, confirmDelete.id);
    setDemoData<MatchEvent>(KEYS.events, getDemoData<MatchEvent>(KEYS.events).filter(e => e.matchId !== confirmDelete.id));
    setConfirmDelete(null);
    loadData();
  };

  // Standings calculation
  const calculateStandings = (): StandingRow[] => {
    const finishedMatches = matches.filter(m => m.status === 'finalizado');
    const rows: Record<string, StandingRow> = {};
    teams.forEach(t => { rows[t.id] = { teamId: t.id, teamName: t.name, teamColor: t.color, teamLogo: t.logo, jj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dif: 0, pts: 0 }; });
    finishedMatches.forEach(m => {
      if (rows[m.homeTeamId]) {
        rows[m.homeTeamId].jj++;
        rows[m.homeTeamId].gf += m.homeScore;
        rows[m.homeTeamId].gc += m.awayScore;
      }
      if (rows[m.awayTeamId]) {
        rows[m.awayTeamId].jj++;
        rows[m.awayTeamId].gf += m.awayScore;
        rows[m.awayTeamId].gc += m.homeScore;
      }
      if (m.homeScore > m.awayScore) {
        if (rows[m.homeTeamId]) { rows[m.homeTeamId].g++; rows[m.homeTeamId].pts += tournament?.sport === 'tochito' ? 2 : 3; }
        if (rows[m.awayTeamId]) rows[m.awayTeamId].p++;
      } else if (m.homeScore < m.awayScore) {
        if (rows[m.awayTeamId]) { rows[m.awayTeamId].g++; rows[m.awayTeamId].pts += tournament?.sport === 'tochito' ? 2 : 3; }
        if (rows[m.homeTeamId]) rows[m.homeTeamId].p++;
      } else {
        if (rows[m.homeTeamId]) { rows[m.homeTeamId].e++; rows[m.homeTeamId].pts += 1; }
        if (rows[m.awayTeamId]) { rows[m.awayTeamId].e++; rows[m.awayTeamId].pts += 1; }
      }
    });
    return Object.values(rows).map(r => ({ ...r, dif: r.gf - r.gc })).sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf);
  };

  // Group matches by jornada
  const matchesByJornada = matches.reduce((acc, m) => {
    if (!acc[m.jornada]) acc[m.jornada] = [];
    acc[m.jornada].push(m);
    return acc;
  }, {} as Record<number, Match[]>);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-400" size={28} />
            <div>
              <h1 className="text-lg font-bold text-white">{tournament?.name || 'Torneo'}</h1>
              <span className="text-xs text-gray-400">Admin: {user.name}</span>
            </div>
          </div>
          <button onClick={onLogout} className="text-gray-400 hover:text-white flex items-center gap-1"><LogOut size={18} />Salir</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { k: 'teams', label: 'Equipos', icon: <Users size={16} /> },
            { k: 'fields', label: 'Canchas', icon: <MapPin size={16} /> },
            { k: 'users', label: 'Usuarios', icon: <UserIcon size={16} /> },
            { k: 'calendar', label: 'Calendario', icon: <Calendar size={16} /> },
            { k: 'standings', label: 'Posiciones', icon: <Award size={16} /> },
            { k: 'elimination', label: 'Eliminatorias', icon: <Trophy size={16} /> },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as any)} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap text-sm transition-all ${tab === t.k ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Teams */}
        {tab === 'teams' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Equipos</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => openTeamModal()}><Plus size={18} />Nuevo Equipo</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.map(t => (
                <div key={t.id} className="card flex items-center gap-4">
                  {t.logo ? <img src={t.logo} className="w-14 h-14 rounded-full object-cover" /> : <div className="w-14 h-14 rounded-full" style={{ backgroundColor: t.color }} />}
                  <div className="flex-1">
                    <h3 className="font-bold">{t.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => openTeamModal(t)} className="text-blue-400 hover:text-blue-300"><Edit size={14} /></button>
                      <button onClick={() => deleteTeam(t.id, t.name)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fields */}
        {tab === 'fields' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Canchas</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => openFieldModal()}><Plus size={18} />Nueva Cancha</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {fields.map(f => (
                <div key={f.id} className="card flex items-center justify-between">
                  <div className="flex items-center gap-3"><MapPin className="text-green-400" size={20} /><span className="font-medium">{f.name}</span></div>
                  <div className="flex gap-2">
                    <button onClick={() => openFieldModal(f)} className="text-blue-400 hover:text-blue-300"><Edit size={14} /></button>
                    <button onClick={() => deleteField(f.id, f.name)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Usuarios del Torneo</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => openUserModal()}><Plus size={18} />Nuevo Usuario</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-gray-400">Nombre</th><th className="py-3 px-4 text-gray-400">Usuario</th>
                  <th className="py-3 px-4 text-gray-400">Rol</th><th className="py-3 px-4 text-gray-400">Equipo</th>
                  <th className="py-3 px-4 text-gray-400">Acciones</th>
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-700/50">
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4 text-gray-300">{u.username}</td>
                      <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'referee' ? 'bg-green-500/20 text-green-400' : u.role === 'player' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role === 'referee' ? '🏃 Árbitro' : u.role === 'player' ? '⚽ Jugador' : '👤 Admin'}</span></td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{teams.find(t => t.id === u.teamId)?.name || '-'}</td>
                      <td className="py-3 px-4"><div className="flex gap-2"><button onClick={() => openUserModal(u)} className="text-blue-400 hover:text-blue-300"><Edit size={14} /></button><button onClick={() => deleteUser(u.id, u.name)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar */}
        {tab === 'calendar' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Calendario</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => setShowGenModal(true)}><Calendar size={18} />Generar Calendario</button>
            </div>
            {Object.entries(matchesByJornada).sort(([a], [b]) => Number(a) - Number(b)).map(([jornada, jornadaMatches]) => {
              const firstMatch = jornadaMatches[0];
              return (
                <div key={jornada} className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">J{jornada}</span>
                    <span className="text-gray-300">{formatDate(firstMatch.date)}</span>
                    <span className="text-gray-500 text-sm">Semana {firstMatch.week}</span>
                    <span className="text-gray-500 text-sm">({jornadaMatches.length} partidos)</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {jornadaMatches.map(m => {
                      const home = teams.find(t => t.id === m.homeTeamId);
                      const away = teams.find(t => t.id === m.awayTeamId);
                      const field = fields.find(f => f.id === m.fieldId);
                      const isEditable = m.status === 'finalizado' && m.finishedAt ? (Date.now() - new Date(m.finishedAt).getTime()) < 5 * 60 * 1000 : true;
                      return (
                        <div key={m.id} className={`card p-4 ${m.status === 'en_vivo' ? 'border-green-500' : m.status === 'finalizado' ? 'border-gray-600' : 'border-gray-700'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: home?.color || '#666' }} />
                              <span className="font-bold text-sm">{home?.name || 'Local'}</span>
                              <span className="text-gray-500">vs</span>
                              <span className="font-bold text-sm">{away?.name || 'Visitante'}</span>
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: away?.color || '#666' }} />
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'en_vivo' ? 'bg-green-500/20 text-green-400 animate-pulse' : m.status === 'finalizado' ? 'bg-gray-600 text-gray-300' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {m.status === 'en_vivo' ? '🔴 En Vivo' : m.status === 'finalizado' ? 'Finalizado' : 'Pendiente'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>📅 {formatDate(m.date)}</span>
                            <span>🕐 {m.time}</span>
                            {field && <span>📍 {field.name}</span>}
                            {m.status === 'finalizado' && <span className="font-bold text-white">{m.homeScore} - {m.awayScore}</span>}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => openMatchModal(m)} className={`text-sm px-2 py-1 rounded ${isEditable ? 'text-blue-400 hover:bg-blue-500/10' : 'text-gray-600 cursor-not-allowed'}`} disabled={!isEditable}>
                              {isEditable ? '✏️ Editar' : '🔒 Bloqueado'}
                            </button>
                            <button onClick={() => deleteMatch(m.id)} className="text-sm text-red-400 hover:bg-red-500/10 px-2 py-1 rounded">🗑️ Eliminar</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {matches.length === 0 && <p className="text-gray-500 text-center py-8">No hay partidos programados</p>}
          </div>
        )}

        {/* Standings */}
        {tab === 'standings' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Tabla de Posiciones</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-gray-700">
                  <th className="py-3 px-3 text-gray-400">#</th>
                  <th className="py-3 px-3 text-gray-400">Equipo</th>
                  <th className="py-3 px-3 text-gray-400">JJ</th>
                  {tournament?.sport !== 'tochito' && <th className="py-3 px-3 text-gray-400">E</th>}
                  <th className="py-3 px-3 text-gray-400">G</th>
                  <th className="py-3 px-3 text-gray-400">P</th>
                  <th className="py-3 px-3 text-gray-400">GF</th>
                  <th className="py-3 px-3 text-gray-400">GC</th>
                  <th className="py-3 px-3 text-gray-400">Dif</th>
                  <th className="py-3 px-3 text-gray-400">Pts</th>
                </tr></thead>
                <tbody>
                  {calculateStandings().map((row, i) => (
                    <tr key={row.teamId} className="border-b border-gray-700/50">
                      <td className="py-3 px-3 font-bold">{i + 1}</td>
                      <td className="py-3 px-3 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: row.teamColor }} />
                        {row.teamName}
                      </td>
                      <td className="py-3 px-3">{row.jj}</td>
                      {tournament?.sport !== 'tochito' && <td className="py-3 px-3">{row.e}</td>}
                      <td className="py-3 px-3 text-green-400">{row.g}</td>
                      <td className="py-3 px-3 text-red-400">{row.p}</td>
                      <td className="py-3 px-3">{row.gf}</td>
                      <td className="py-3 px-3">{row.gc}</td>
                      <td className={`py-3 px-3 ${row.dif > 0 ? 'text-green-400' : row.dif < 0 ? 'text-red-400' : 'text-gray-400'}`}>{row.dif > 0 ? '+' : ''}{row.dif}</td>
                      <td className="py-3 px-3 font-bold text-yellow-400">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Elimination */}
        {tab === 'elimination' && (
          <EliminationView teams={teams} matches={matches} tournamentId={user.tournamentId!} sport={tournament?.sport || 'futbol'} onUpdate={loadData} />
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} title={editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}>
        <div className="space-y-4">
          <div><label className="text-sm text-gray-300 mb-1 block">Nombre</label><input className="input-field" value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Color</label><input type="color" value={teamForm.color} onChange={e => setTeamForm({ ...teamForm, color: e.target.value })} className="w-12 h-10 rounded cursor-pointer" /></div>
          <ImageUploader value={teamForm.logo} onChange={v => setTeamForm({ ...teamForm, logo: v })} label="Logo del equipo" />
          <button className="btn-primary w-full" onClick={saveTeam}>{editingTeam ? 'Guardar' : 'Crear'}</button>
        </div>
      </Modal>

      <Modal isOpen={showFieldModal} onClose={() => setShowFieldModal(false)} title={editingField ? 'Editar Cancha' : 'Nueva Cancha'}>
        <div className="space-y-4">
          <div><label className="text-sm text-gray-300 mb-1 block">Nombre</label><input className="input-field" value={fieldForm.name} onChange={e => setFieldForm({ name: e.target.value })} /></div>
          <button className="btn-primary w-full" onClick={saveField}>{editingField ? 'Guardar' : 'Crear'}</button>
        </div>
      </Modal>

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <div className="space-y-4">
          <div><label className="text-sm text-gray-300 mb-1 block">Nombre</label><input className="input-field" value={uForm.name} onChange={e => setUForm({ ...uForm, name: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Usuario</label><input className="input-field" value={uForm.username} onChange={e => setUForm({ ...uForm, username: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Contraseña</label><input className="input-field" value={uForm.password} onChange={e => setUForm({ ...uForm, password: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Rol</label>
            <select className="input-field" value={uForm.role} onChange={e => setUForm({ ...uForm, role: e.target.value as User['role'] })}>
              <option value="referee">Árbitro</option><option value="player">Jugador</option>
            </select>
          </div>
          {uForm.role === 'player' && (
            <div><label className="text-sm text-gray-300 mb-1 block">Equipo</label>
              <select className="input-field" value={uForm.teamId} onChange={e => setUForm({ ...uForm, teamId: e.target.value })}>
                <option value="">Seleccionar equipo</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          )}
          <button className="btn-primary w-full" onClick={saveUser}>{editingUser ? 'Guardar' : 'Crear'}</button>
        </div>
      </Modal>

      <Modal isOpen={showGenModal} onClose={() => setShowGenModal(false)} title="Generar Calendario Round Robin">
        <div className="space-y-4">
          {teams.length < 2 && <p className="text-red-400">Se necesitan al menos 2 equipos</p>}
          <div><label className="text-sm text-gray-300 mb-1 block">Día de la semana</label>
            <select className="input-field" value={genForm.day} onChange={e => setGenForm({ ...genForm, day: e.target.value })}>
              <option value="0">Domingo</option><option value="1">Lunes</option><option value="2">Martes</option>
              <option value="3">Miércoles</option><option value="4">Jueves</option><option value="5">Viernes</option><option value="6">Sábado</option>
            </select>
          </div>
          <div><label className="text-sm text-gray-300 mb-1 block">Fecha de inicio</label><input type="date" className="input-field" value={genForm.startDate} onChange={e => setGenForm({ ...genForm, startDate: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Hora del primer partido</label><input type="time" className="input-field" value={genForm.startTime} onChange={e => setGenForm({ ...genForm, startTime: e.target.value })} /></div>
          <div><label className="text-sm text-gray-300 mb-1 block">Intervalo entre partidos (horas)</label>
            <div className="flex items-center gap-2">
              <button className="bg-gray-700 px-3 py-2 rounded" onClick={() => setGenForm({ ...genForm, interval: Math.max(1, genForm.interval - 1) })}>-</button>
              <span className="text-lg font-bold w-8 text-center">{genForm.interval}</span>
              <button className="bg-gray-700 px-3 py-2 rounded" onClick={() => setGenForm({ ...genForm, interval: Math.min(6, genForm.interval + 1) })}>+</button>
            </div>
          </div>
          <div><label className="text-sm text-gray-300 mb-1 block">Jornada inicial</label>
            <div className="flex items-center gap-2">
              <button className="bg-gray-700 px-3 py-2 rounded" onClick={() => setGenForm({ ...genForm, jornada: Math.max(1, genForm.jornada - 1) })}>-</button>
              <span className="text-lg font-bold w-8 text-center">{genForm.jornada}</span>
              <button className="bg-gray-700 px-3 py-2 rounded" onClick={() => setGenForm({ ...genForm, jornada: genForm.jornada + 1 })}>+</button>
            </div>
          </div>
          <div><label className="text-sm text-gray-300 mb-1 block">Número de jornadas</label>
            <div className="flex items-center gap-2">
              <button className="bg-gray-700 px-3 py-2 rounded" onClick={() => setGenForm({ ...genForm, numJornadas: Math.max(1, genForm.numJornadas - 1) })}>-</button>
              <span className="text-lg font-bold w-8 text-center">{genForm.numJornadas}</span>
              <button className="bg-gray-700 px-3 py-2 rounded" onClick={() => setGenForm({ ...genForm, numJornadas: Math.min(teams.length - 1, genForm.numJornadas + 1) })}>+</button>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-sm text-gray-300">
            <p>📊 Total de partidos: ~{genForm.numJornadas * Math.floor(teams.length / 2)}</p>
            <p>👥 {teams.length} equipos</p>
          </div>
          <button className="btn-primary w-full" onClick={generateCalendar} disabled={teams.length < 2}>Generar Calendario</button>
        </div>
      </Modal>

      <Modal isOpen={showMatchModal} onClose={() => setShowMatchModal(false)} title="Editar Partido">
        <div className="space-y-4">
          <div><label className="text-sm text-gray-300 mb-1 block">Local</label>
            <select className="input-field" value={matchForm.homeTeamId} onChange={e => setMatchForm({ ...matchForm, homeTeamId: e.target.value })}>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div><label className="text-sm text-gray-300 mb-1 block">Visitante</label>
            <select className="input-field" value={matchForm.awayTeamId} onChange={e => setMatchForm({ ...matchForm, awayTeamId: e.target.value })}>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div><label className="text-sm text-gray-300 mb-1 block">Cancha</label>
            <select className="input-field" value={matchForm.fieldId} onChange={e => setMatchForm({ ...matchForm, fieldId: e.target.value })}>
              <option value="">Sin asignar</option>
              {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm text-gray-300 mb-1 block">Fecha</label><input type="date" className="input-field" value={matchForm.date} onChange={e => setMatchForm({ ...matchForm, date: e.target.value })} /></div>
            <div><label className="text-sm text-gray-300 mb-1 block">Hora</label><input type="time" className="input-field" value={matchForm.time} onChange={e => setMatchForm({ ...matchForm, time: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm text-gray-300 mb-1 block">Jornada</label><input type="number" className="input-field" value={matchForm.jornada} onChange={e => setMatchForm({ ...matchForm, jornada: parseInt(e.target.value) || 1 })} /></div>
            <div><label className="text-sm text-gray-300 mb-1 block">Semana</label><input type="number" className="input-field" value={matchForm.week} onChange={e => setMatchForm({ ...matchForm, week: parseInt(e.target.value) || 1 })} /></div>
          </div>
          <button className="btn-primary w-full" onClick={saveMatch}>Guardar Cambios</button>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={
          confirmDelete?.type === 'team' ? confirmDeleteTeam :
          confirmDelete?.type === 'field' ? confirmDeleteField :
          confirmDelete?.type === 'user' ? confirmDeleteUser :
          confirmDeleteMatch
        }
        title={
          confirmDelete?.type === 'team' ? 'Eliminar Equipo' :
          confirmDelete?.type === 'field' ? 'Eliminar Cancha' :
          confirmDelete?.type === 'user' ? 'Eliminar Usuario' :
          'Eliminar Partido'
        }
        message={
          confirmDelete?.type === 'match'
            ? `¿Eliminar el partido "${confirmDelete?.name}"?`
            : `¿Eliminar "${confirmDelete?.name}"?`
        }
      />
    </div>
  );
}

// ==================== ELIMINATION VIEW ====================
function EliminationView({ teams, matches, tournamentId, sport, onUpdate }: { teams: Team[]; matches: Match[]; tournamentId: string; sport: SportType; onUpdate: () => void }) {
  const [showGenModal, setShowGenModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState('');
  const eliminationMatches = matches.filter(m => m.isElimination);

  const standings = (() => {
    const finishedMatches = matches.filter(m => m.status === 'finalizado' && !m.isElimination);
    const rows: Record<string, StandingRow> = {};
    teams.forEach(t => { rows[t.id] = { teamId: t.id, teamName: t.name, teamColor: t.color, teamLogo: t.logo, jj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dif: 0, pts: 0 }; });
    finishedMatches.forEach(m => {
      if (rows[m.homeTeamId]) { rows[m.homeTeamId].jj++; rows[m.homeTeamId].gf += m.homeScore; rows[m.homeTeamId].gc += m.awayScore; }
      if (rows[m.awayTeamId]) { rows[m.awayTeamId].jj++; rows[m.awayTeamId].gf += m.awayScore; rows[m.awayTeamId].gc += m.homeScore; }
      if (m.homeScore > m.awayScore) { if (rows[m.homeTeamId]) { rows[m.homeTeamId].g++; rows[m.homeTeamId].pts += sport === 'tochito' ? 2 : 3; } if (rows[m.awayTeamId]) rows[m.awayTeamId].p++; }
      else if (m.homeScore < m.awayScore) { if (rows[m.awayTeamId]) { rows[m.awayTeamId].g++; rows[m.awayTeamId].pts += sport === 'tochito' ? 2 : 3; } if (rows[m.homeTeamId]) rows[m.homeTeamId].p++; }
      else { if (rows[m.homeTeamId]) { rows[m.homeTeamId].e++; rows[m.homeTeamId].pts += 1; } if (rows[m.awayTeamId]) { rows[m.awayTeamId].e++; rows[m.awayTeamId].pts += 1; } }
    });
    return Object.values(rows).map(r => ({ ...r, dif: r.gf - r.gc })).sort((a, b) => b.pts - a.pts || b.dif - a.dif);
  })();

  const generateElimination = () => {
    const phases: Record<string, number> = { 'Octavos': 16, 'Cuartos': 8, 'Semifinal': 4 };
    const needed = phases[selectedPhase];
    if (standings.length < needed) { alert(`Se necesitan ${needed} equipos`); return; }
    const qualified = standings.slice(0, needed);
    const newMatches: Match[] = [];
    for (let i = 0; i < needed / 2; i++) {
      newMatches.push({
        id: generateId(), tournamentId, homeTeamId: qualified[i].teamId, awayTeamId: qualified[needed - 1 - i].teamId,
        date: '', time: '', week: getCurrentWeek(), jornada: 100, status: 'pendiente', homeScore: 0, awayScore: 0,
        isElimination: true, eliminationRound: selectedPhase,
      });
    }
    const existing = getDemoData<Match>(KEYS.matches);
    setDemoData<Match>(KEYS.matches, [...existing, ...newMatches]);
    setShowGenModal(false);
    onUpdate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Eliminatorias</h2>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowGenModal(true)}><Plus size={18} />Generar</button>
      </div>
      {eliminationMatches.length > 0 ? (
        <div className="space-y-4">
          {['Octavos', 'Cuartos', 'Semifinal', 'Tercer Lugar', 'Final'].map(round => {
            const roundMatches = eliminationMatches.filter(m => m.eliminationRound === round);
            if (roundMatches.length === 0) return null;
            return (
              <div key={round}>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{round}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {roundMatches.map(m => {
                    const home = teams.find(t => t.id === m.homeTeamId);
                    const away = teams.find(t => t.id === m.awayTeamId);
                    return (
                      <div key={m.id} className="card p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{home?.name}</span>
                          <span className="text-xl font-bold text-yellow-400">{m.status === 'finalizado' ? `${m.homeScore} - ${m.awayScore}` : 'vs'}</span>
                          <span className="font-bold">{away?.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : <p className="text-gray-500 text-center py-8">No hay eliminatorias generadas</p>}

      <Modal isOpen={showGenModal} onClose={() => setShowGenModal(false)} title="Generar Eliminatorias">
        <div className="space-y-4">
          <p className="text-gray-300">Selecciona la fase inicial:</p>
          <select className="input-field" value={selectedPhase} onChange={e => setSelectedPhase(e.target.value)}>
            <option value="">Seleccionar...</option>
            <option value="Octavos">Octavos de Final (16 equipos)</option>
            <option value="Cuartos">Cuartos de Final (8 equipos)</option>
            <option value="Semifinal">Semifinal (4 equipos)</option>
          </select>
          {selectedPhase && (
            <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
              <p className="text-gray-300 mb-2">Cruces (1° vs Último, 2° vs Penúltimo...):</p>
              {(() => {
                const n = selectedPhase === 'Octavos' ? 16 : selectedPhase === 'Cuartos' ? 8 : 4;
                const crosses = [];
                for (let i = 0; i < Math.min(n / 2, standings.length / 2); i++) {
                  crosses.push(`${standings[i]?.teamName || '-'} vs ${standings[n - 1 - i]?.teamName || '-'}`);
                }
                return crosses.map((c, i) => <p key={i} className="text-yellow-400">{c}</p>);
              })()}
            </div>
          )}
          <button className="btn-primary w-full" onClick={generateElimination} disabled={!selectedPhase}>Generar</button>
        </div>
      </Modal>
    </div>
  );
}

// ==================== REFEREE PANEL ====================
function RefereePanel({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [gracePeriod, setGracePeriod] = useState<number | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<MatchEvent['type'] | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [manualPlayerName, setManualPlayerName] = useState('');
  const [manualPlayerTeam, setManualPlayerTeam] = useState('');
  const [registeredPlayers, setRegisteredPlayers] = useState<{ name: string; teamId: string }[]>([]);
  const [homePlayerInput, setHomePlayerInput] = useState('');
  const [awayPlayerInput, setAwayPlayerInput] = useState('');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [homeMvp, setHomeMvp] = useState('');
  const [awayMvp, setAwayMvp] = useState('');
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHomeScore, setEditHomeScore] = useState(0);
  const [editAwayScore, setEditAwayScore] = useState(0);
  const [editTimeLeft, setEditTimeLeft] = useState(300); // 5 minutos en segundos
  const tournament = getDemoData<Tournament>(KEYS.tournaments).find(t => t.id === user.tournamentId);
  const currentWeek = getCurrentWeek();

  const loadData = useCallback(() => {
    if (!user.tournamentId) return;
    const allMatches = getDemoData<Match>(KEYS.matches).filter(m => m.tournamentId === user.tournamentId);
    setMatches(allMatches);
    setEvents(getDemoData<MatchEvent>(KEYS.events));
    setTeams(getDemoData<Team>(KEYS.teams).filter(t => t.tournamentId === user.tournamentId));
    setNotifications(getDemoData<Notification>(KEYS.notifications).filter(n => n.tournamentId === user.tournamentId));
  }, [user.tournamentId]);

  useEffect(() => { loadData(); }, [loadData]);

  const weekMatches = matches.filter(m => m.week === currentWeek);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  // Sincronizar activeMatch con los datos actualizados (para marcador en vivo)
  useEffect(() => {
    if (!activeMatch) return;
    const updated = matches.find(m => m.id === activeMatch.id);
    if (updated && (updated.homeScore !== activeMatch.homeScore || updated.awayScore !== activeMatch.awayScore || updated.status !== activeMatch.status)) {
      setActiveMatch(updated);
      // Si el partido fue finalizado, limpiar para permitir iniciar otro
      if (updated.status === 'finalizado') {
        setTimeout(() => setActiveMatch(null), 100);
      }
    }
  }, [matches, activeMatch]);

  const startMatch = (match: Match) => {
    updateDemoItem<Match>(KEYS.matches, match.id, { status: 'en_vivo', refereeId: user.id });
    setActiveMatch({ ...match, status: 'en_vivo', refereeId: user.id });
    setShowStartConfirm(false);
    setGracePeriod(Date.now());
    setRegisteredPlayers([]);
  };

  const cancelStart = () => {
    if (!activeMatch) return;
    updateDemoItem<Match>(KEYS.matches, activeMatch.id, { status: 'pendiente', refereeId: undefined });
    setActiveMatch(null);
    setGracePeriod(null);
  };

  const exitMatch = () => {
    if (!activeMatch) return;
    // Mantener el estado "en_vivo" pero liberar al árbitro temporalmente
    // El partido seguirá en vivo pero el árbitro podrá iniciar otro
    setActiveMatch(null);
    setGracePeriod(null);
    setRegisteredPlayers([]);
  };

  useEffect(() => {
    if (gracePeriod) {
      const timer = setInterval(() => {
        if (Date.now() - gracePeriod > 2 * 60 * 1000) { setGracePeriod(null); }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gracePeriod]);

  // Timer para período de edición post-finalización (5 minutos)
  useEffect(() => {
    if (showEditModal && editTimeLeft > 0) {
      const timer = setInterval(() => {
        setEditTimeLeft(prev => {
          if (prev <= 1) {
            setShowEditModal(false);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showEditModal, editTimeLeft]);

  const addHomePlayer = () => {
    if (!homePlayerInput.trim() || !activeMatch) return;
    setRegisteredPlayers([...registeredPlayers, { name: homePlayerInput.trim(), teamId: activeMatch.homeTeamId }]);
    setHomePlayerInput('');
  };

  const addAwayPlayer = () => {
    if (!awayPlayerInput.trim() || !activeMatch) return;
    setRegisteredPlayers([...registeredPlayers, { name: awayPlayerInput.trim(), teamId: activeMatch.awayTeamId }]);
    setAwayPlayerInput('');
  };

  const openEventModal = (type: MatchEvent['type']) => {
    if (!activeMatch) return;
    setSelectedEventType(type);
    setSelectedPlayer('');
    setManualPlayerName('');
    setManualPlayerTeam('');
    setShowEventModal(true);
  };

  const confirmEvent = () => {
    if (!activeMatch || !selectedEventType) return;
    const playerName = manualPlayerName || selectedPlayer;
    const teamId = manualPlayerTeam || (registeredPlayers.find(p => p.name === playerName)?.teamId) || '';
    if (!playerName) { alert('Selecciona o escribe un jugador'); return; }
    const team = teams.find(t => t.id === teamId);
    const pointsMap: Record<string, number> = { gol: 1, yellow_card: 0, red_card: 0, touchdown: 6, conversion_1: 1, conversion_2: 2, sack: 0 };
    const newEvent: MatchEvent = {
      id: generateId(), matchId: activeMatch.id, playerId: generateId(), playerName, teamId,
      teamName: team?.name || '', type: selectedEventType, points: pointsMap[selectedEventType] || 0, timestamp: Date.now()
    };
    addDemoItem<MatchEvent>(KEYS.events, newEvent);
    // Update score
    const matchEvents = [...getDemoData<MatchEvent>(KEYS.events), newEvent];
    const matchEventsForMatch = matchEvents.filter(e => e.matchId === activeMatch.id);
    const homeScore = matchEventsForMatch.filter(e => e.teamId === activeMatch.homeTeamId).reduce((s, e) => s + e.points, 0);
    const awayScore = matchEventsForMatch.filter(e => e.teamId === activeMatch.awayTeamId).reduce((s, e) => s + e.points, 0);
    updateDemoItem<Match>(KEYS.matches, activeMatch.id, { homeScore, awayScore });
    setShowEventModal(false);
    loadData();
  };

  const deleteEvent = (eventId: string) => {
    removeDemoItem<MatchEvent>(KEYS.events, eventId);
    if (activeMatch) {
      const matchEvents = getDemoData<MatchEvent>(KEYS.events).filter(e => e.matchId === activeMatch.id);
      const homeScore = matchEvents.filter(e => e.teamId === activeMatch.homeTeamId).reduce((s, e) => s + e.points, 0);
      const awayScore = matchEvents.filter(e => e.teamId === activeMatch.awayTeamId).reduce((s, e) => s + e.points, 0);
      updateDemoItem<Match>(KEYS.matches, activeMatch.id, { homeScore, awayScore });
    }
    loadData();
  };

  const finishMatch = () => {
    if (!activeMatch) return;
    if (tournament?.sport === 'tochito' && (!homeMvp || !awayMvp)) { alert('Debes seleccionar MVPs'); return; }
    
    const matchId = activeMatch.id;
    const finalHomeScore = activeMatch.homeScore;
    const finalAwayScore = activeMatch.awayScore;
    
    updateDemoItem<Match>(KEYS.matches, matchId, {
      status: 'finalizado', finishedAt: new Date().toISOString(),
      homeMvp: tournament?.sport === 'tochito' ? homeMvp : undefined,
      awayMvp: tournament?.sport === 'tochito' ? awayMvp : undefined,
    });
    
    // Limpiar estados para permitir iniciar otro partido
    setActiveMatch(null);
    setShowFinishModal(false);
    setRegisteredPlayers([]);
    setHomeMvp('');
    setAwayMvp('');
    loadData();
    
    // Abrir modal de edición automáticamente
    setEditHomeScore(finalHomeScore);
    setEditAwayScore(finalAwayScore);
    setEditTimeLeft(300); // Resetear a 5 minutos
    setShowEditModal(true);
  };

  const saveEditedResult = () => {
    // Buscar el último partido finalizado por este árbitro
    const myFinishedMatches = matches.filter(m => 
      m.status === 'finalizado' && 
      m.refereeId === user.id
    ).sort((a, b) => {
      const timeA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
      const timeB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
      return timeB - timeA; // Más reciente primero
    });
    
    if (myFinishedMatches.length === 0) return;
    
    const lastMatch = myFinishedMatches[0];
    
    // Verificar que esté dentro del período de 5 minutos
    if (lastMatch.finishedAt) {
      const elapsed = Date.now() - new Date(lastMatch.finishedAt).getTime();
      if (elapsed > 5 * 60 * 1000) {
        alert('⏰ El período de edición ha expirado');
        setShowEditModal(false);
        return;
      }
    }
    
    updateDemoItem<Match>(KEYS.matches, lastMatch.id, {
      homeScore: editHomeScore,
      awayScore: editAwayScore,
    });
    
    setShowEditModal(false);
    setEditTimeLeft(300);
    loadData();
  };

  const matchEvents = activeMatch ? events.filter(e => e.matchId === activeMatch.id).sort((a, b) => b.timestamp - a.timestamp) : [];
  const homePlayers = registeredPlayers.filter(p => p.teamId === activeMatch?.homeTeamId);
  const awayPlayers = registeredPlayers.filter(p => p.teamId === activeMatch?.awayTeamId);
  const allMatchPlayers = [...new Set([...registeredPlayers.map(p => p.name), ...matchEvents.map(e => e.playerName)])];

  const homeTeam = teams.find(t => t.id === activeMatch?.homeTeamId);
  const awayTeam = teams.find(t => t.id === activeMatch?.awayTeamId);

  // Calcular partidos pendientes
  const pendingMatches = weekMatches.filter(m => m.status === 'pendiente');
  const hasActiveMatch = activeMatch !== null;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Banner de partidos pendientes */}
      {hasActiveMatch && pendingMatches.length > 0 && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">
                {pendingMatches.length} partido{pendingMatches.length !== 1 ? 's' : ''} pendiente{pendingMatches.length !== 1 ? 's' : ''} por iniciar
              </span>
            </div>
            <button 
              onClick={() => setShowQuickAccess(true)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            >
              Ver partidos
            </button>
          </div>
        </div>
      )}

      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="text-green-400" size={28} />
            <div>
              <h1 className="text-lg font-bold text-white">{tournament?.name || 'Torneo'}</h1>
              <span className="text-xs text-gray-400">Árbitro: {user.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifPanel(true)} className="relative text-gray-400 hover:text-white">
              <Bell size={22} />
              {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unreadNotifs}</span>}
            </button>
            <button onClick={onLogout} className="text-gray-400 hover:text-white flex items-center gap-1"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Grace period banner */}
        {gracePeriod && (
          <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-orange-400 font-bold">⏱️ Período de gracia activo</p>
              <p className="text-orange-300 text-sm">Puedes cancelar el inicio del partido (2 minutos)</p>
            </div>
            <button onClick={cancelStart} className="btn-danger text-sm">Cancelar Inicio</button>
          </div>
        )}

        {/* Active match */}
        {activeMatch ? (
          <div className="space-y-6">
            {/* Scoreboard */}
            <div className="card text-center">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: homeTeam?.color || '#666' }} />
                  <p className="font-bold">{homeTeam?.name}</p>
                  <p className="text-xs text-gray-400">(Local)</p>
                </div>
                <div className="text-4xl font-bold text-yellow-400">{activeMatch.homeScore} - {activeMatch.awayScore}</div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: awayTeam?.color || '#666' }} />
                  <p className="font-bold">{awayTeam?.name}</p>
                  <p className="text-xs text-gray-400">(Visitante)</p>
                </div>
              </div>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm animate-pulse">🔴 En Vivo</span>
            </div>

            {/* Register players */}
            <div className="card">
              <h3 className="font-bold text-lg mb-3">Registrar Jugadores</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: homeTeam?.color }} />
                    {homeTeam?.name} (Local) - {homePlayers.length} jugadores
                  </h4>
                  <div className="flex gap-2">
                    <input className="input-field text-sm" placeholder="Nombre jugador local" value={homePlayerInput} onChange={e => setHomePlayerInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHomePlayer()} />
                    <button className="btn-primary text-sm px-3" onClick={addHomePlayer}><Plus size={16} /></button>
                  </div>
                  {homePlayers.length === 0 && <p className="text-gray-500 text-xs mt-1">Sin jugadores</p>}
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {homePlayers.map((p, i) => <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded inline-block mr-1 mb-1">{p.name}</span>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: awayTeam?.color }} />
                    {awayTeam?.name} (Visitante) - {awayPlayers.length} jugadores
                  </h4>
                  <div className="flex gap-2">
                    <input className="input-field text-sm" placeholder="Nombre jugador visitante" value={awayPlayerInput} onChange={e => setAwayPlayerInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAwayPlayer()} />
                    <button className="btn-primary text-sm px-3" onClick={addAwayPlayer}><Plus size={16} /></button>
                  </div>
                  {awayPlayers.length === 0 && <p className="text-gray-500 text-xs mt-1">Sin jugadores</p>}
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {awayPlayers.map((p, i) => <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded inline-block mr-1 mb-1">{p.name}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Event buttons */}
            <div className="card">
              <h3 className="font-bold text-lg mb-3">Registrar Evento</h3>
              <div className="flex flex-wrap gap-2">
                {tournament?.sport === 'futbol' ? (
                  <>
                    <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium" onClick={() => openEventModal('gol')}>⚽ Gol (+1)</button>
                    <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium" onClick={() => openEventModal('yellow_card')}>🟨 Amarilla</button>
                    <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium" onClick={() => openEventModal('red_card')}>🟥 Roja</button>
                  </>
                ) : (
                  <>
                    <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium" onClick={() => openEventModal('touchdown')}>🏈 Touchdown (+6)</button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium" onClick={() => openEventModal('conversion_1')}>1️⃣ Conv 1pt (+1)</button>
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium" onClick={() => openEventModal('conversion_2')}>2️⃣ Conv 2pts (+2)</button>
                    <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium" onClick={() => openEventModal('sack')}>💪 Sack</button>
                  </>
                )}
              </div>
            </div>

            {/* Event history */}
            <div className="card">
              <h3 className="font-bold text-lg mb-3">Historial de Eventos</h3>
              {matchEvents.length === 0 ? <p className="text-gray-500">No hay eventos registrados</p> : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {matchEvents.map(e => (
                    <div key={e.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span>{e.type === 'gol' ? '⚽' : e.type === 'yellow_card' ? '🟨' : e.type === 'red_card' ? '🟥' : e.type === 'touchdown' ? '🏈' : e.type === 'conversion_1' ? '1️⃣' : e.type === 'conversion_2' ? '2️⃣' : '💪'}</span>
                        <span className="text-sm font-medium">{e.playerName}</span>
                        <span className="text-xs text-gray-400">({e.teamName})</span>
                        {e.points > 0 && <span className="text-xs text-yellow-400">+{e.points}pts</span>}
                      </div>
                      <button onClick={() => deleteEvent(e.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button className="btn-secondary flex-1 text-lg py-3" onClick={exitMatch}>
                🚪 Salir del Partido
              </button>
              <button className="btn-danger flex-1 text-lg py-3" onClick={() => setShowFinishModal(true)}>
                🏁 Finalizar
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm">
              💡 Al salir, el partido permanecerá en vivo y podrás volver a él desde la lista
            </p>
          </div>
        ) : (
          /* Match list */
          <div>
            <h2 className="text-xl font-bold mb-4">Partidos de la Semana {currentWeek}</h2>
            {weekMatches.length === 0 ? <p className="text-gray-500 text-center py-8">No hay partidos programados para esta semana</p> : (
              <div className="space-y-3">
                {weekMatches.map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  const isMyLiveMatch = m.status === 'en_vivo' && m.refereeId === user.id;
                  return (
                    <div key={m.id} className={`card flex items-center justify-between ${isMyLiveMatch ? 'border-green-500' : ''}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: home?.color }} />
                          <span className="font-bold">{home?.name}</span>
                          <span className="text-gray-500">vs</span>
                          <span className="font-bold">{away?.name}</span>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: away?.color }} />
                        </div>
                        <p className="text-sm text-gray-400">J{m.jornada} • {formatDate(m.date)} • {m.time}</p>
                        {m.status === 'en_vivo' && (
                          <p className="text-xs text-green-400 mt-1">
                            {isMyLiveMatch ? '🔴 Tu partido en vivo' : '🔴 En vivo (otro árbitro)'}
                          </p>
                        )}
                      </div>
                      <div>
                        {m.status === 'pendiente' ? (
                          <button className="btn-success text-sm" onClick={() => { setActiveMatch(m); setShowStartConfirm(true); }}>▶️ Iniciar</button>
                        ) : isMyLiveMatch ? (
                          <button className="btn-primary text-sm" onClick={() => { 
                            setActiveMatch(m); 
                            setGracePeriod(null);
                            // Cargar jugadores registrados del partido
                            const matchEvents = events.filter(e => e.matchId === m.id);
                            const playerNames = [...new Set(matchEvents.map(e => e.playerName))];
                            setRegisteredPlayers(playerNames.map(name => {
                              const event = matchEvents.find(e => e.playerName === name);
                              return { name, teamId: event?.teamId || '' };
                            }));
                          }}>📝 Continuar</button>
                        ) : (
                          <span className={`text-sm px-3 py-1 rounded-full ${m.status === 'finalizado' ? 'bg-gray-600 text-gray-300' : 'bg-green-500/20 text-green-400'}`}>
                            {m.status === 'finalizado' ? 'Finalizado' : 'En curso'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Start confirmation modal */}
      <Modal isOpen={showStartConfirm} onClose={() => setShowStartConfirm(false)} title="Iniciar Partido">
        <div className="space-y-4">
          {activeMatch && (
            <>
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="font-bold text-lg">{teams.find(t => t.id === activeMatch.homeTeamId)?.name} vs {teams.find(t => t.id === activeMatch.awayTeamId)?.name}</p>
                <p className="text-sm text-gray-400">J{activeMatch.jornada} • Semana {activeMatch.week}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-300">
                <p>⚠️ Al iniciar, serás el árbitro asignado exclusivamente.</p>
                <p>Tienes 2 minutos de gracia para cancelar.</p>
              </div>
              <button className="btn-success w-full" onClick={() => startMatch(activeMatch)}>✅ Confirmar Inicio</button>
            </>
          )}
        </div>
      </Modal>

      {/* Event modal */}
      <Modal isOpen={showEventModal} onClose={() => setShowEventModal(false)} title="Seleccionar Jugador">
        <div className="space-y-4">
          <p className="text-gray-300">Selecciona un jugador registrado o escribe el nombre:</p>
          {registeredPlayers.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {registeredPlayers.map((p, i) => (
                <button key={i} onClick={() => { setSelectedPlayer(p.name); setManualPlayerName(''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedPlayer === p.name ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                  {p.name} <span className="text-gray-400">({teams.find(t => t.id === p.teamId)?.name})</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay jugadores registrados. Escribe el nombre abajo.</p>
          )}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">O escribir nombre manualmente:</label>
            <input className="input-field" value={manualPlayerName} onChange={e => { setManualPlayerName(e.target.value); setSelectedPlayer(''); }} placeholder="Nombre del jugador" />
          </div>
          {manualPlayerName && (
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Equipo:</label>
              <select className="input-field" value={manualPlayerTeam} onChange={e => setManualPlayerTeam(e.target.value)}>
                <option value="">Seleccionar equipo</option>
                {activeMatch && <option value={activeMatch.homeTeamId}>{teams.find(t => t.id === activeMatch.homeTeamId)?.name} (Local)</option>}
                {activeMatch && <option value={activeMatch.awayTeamId}>{teams.find(t => t.id === activeMatch.awayTeamId)?.name} (Visitante)</option>}
              </select>
            </div>
          )}
          {!selectedPlayer && !manualPlayerName && <p className="text-red-400 text-sm">Selecciona o escribe un jugador</p>}
          <button className="btn-primary w-full" onClick={confirmEvent} disabled={!selectedPlayer && !manualPlayerName}>Confirmar Evento</button>
        </div>
      </Modal>

      {/* Finish modal */}
      <Modal isOpen={showFinishModal} onClose={() => setShowFinishModal(false)} title="Finalizar Partido">
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
            <p>ℹ️ Al finalizar tendrás 5 minutos para editar resultados.</p>
            <p>Después se bloqueará automáticamente.</p>
          </div>
          {tournament?.sport === 'tochito' && (
            <div className="space-y-3">
              <p className="text-yellow-400 font-medium">🏆 Selecciona MVPs (obligatorio):</p>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">MVP {homeTeam?.name} (Local):</label>
                <select className="input-field" value={homeMvp} onChange={e => setHomeMvp(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {allMatchPlayers.filter(p => { const rp = registeredPlayers.find(x => x.name === p); return rp?.teamId === activeMatch?.homeTeamId; }).map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">MVP {awayTeam?.name} (Visitante):</label>
                <select className="input-field" value={awayMvp} onChange={e => setAwayMvp(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {allMatchPlayers.filter(p => { const rp = registeredPlayers.find(x => x.name === p); return rp?.teamId === activeMatch?.awayTeamId; }).map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          )}
          <button className="btn-danger w-full" onClick={finishMatch} disabled={tournament?.sport === 'tochito' && (!homeMvp || !awayMvp)}>🏁 Finalizar Partido</button>
        </div>
      </Modal>

      {/* Banner con timer de edición */}
      {showEditModal && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-4 animate-pulse">
          <div className="flex items-center gap-2">
            <Clock size={20} className="animate-spin" />
            <span className="font-bold">Período de edición:</span>
            <span className="font-mono text-xl font-bold">
              {Math.floor(editTimeLeft / 60)}:{String(editTimeLeft % 60).padStart(2, '0')}
            </span>
          </div>
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Editar Resultado
          </button>
        </div>
      )}

      {/* Modal de edición post-finalización */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Resultado Final">
        <div className="space-y-4">
          {/* Timer visible */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={20} className="text-blue-400" />
              <span className="text-blue-300 font-medium">Tiempo restante para editar:</span>
            </div>
            <div className="text-4xl font-bold font-mono text-blue-400">
              {Math.floor(editTimeLeft / 60)}:{String(editTimeLeft % 60).padStart(2, '0')}
            </div>
            <p className="text-xs text-gray-400 mt-2">Después de este tiempo, el resultado se bloqueará permanentemente</p>
          </div>

          {/* Editar marcador */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-bold text-lg mb-3 text-center">Marcador Final</h4>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <label className="text-sm text-gray-400 block mb-1">Local</label>
                <input
                  type="number"
                  min="0"
                  value={editHomeScore}
                  onChange={(e) => setEditHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input-field text-center text-2xl font-bold w-24"
                />
              </div>
              <div className="text-3xl font-bold text-gray-500">-</div>
              <div className="text-center">
                <label className="text-sm text-gray-400 block mb-1">Visitante</label>
                <input
                  type="number"
                  min="0"
                  value={editAwayScore}
                  onChange={(e) => setEditAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input-field text-center text-2xl font-bold w-24"
                />
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-300">
            <p className="font-medium mb-1">⚠️ Importante:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Solo puedes editar el marcador final</li>
              <li>Los eventos individuales (goles, tarjetas) no se pueden modificar</li>
              <li>Después de 5 minutos, el resultado se bloqueará permanentemente</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button 
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={saveEditedResult}
              className="flex-1 btn-primary"
            >
              💾 Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>

      {/* Notifications panel */}
      <Modal isOpen={showNotifPanel} onClose={() => setShowNotifPanel(false)} title="Notificaciones">
        <div className="space-y-3">
          {notifications.length === 0 ? <p className="text-gray-500">No hay notificaciones</p> : (
            notifications.map(n => (
              <div key={n.id} className={`rounded-lg p-3 ${n.read ? 'bg-gray-700/50' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{n.type === 'postponed' ? '⏸️' : n.type === 'cancelled' ? '❌' : '🔄'}</span>
                      <span className="font-medium text-sm">{n.title}</span>
                      {!n.read && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">NUEVO</span>}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{n.message}</p>
                    {n.reason && <p className="text-xs text-gray-500 mt-1">Motivo: {n.reason}</p>}
                  </div>
                  {!n.read && <button onClick={() => { updateDemoItem<Notification>(KEYS.notifications, n.id, { read: true }); loadData(); }} className="text-blue-400 text-xs"><Check size={14} /></button>}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Quick Access Modal */}
      <Modal isOpen={showQuickAccess} onClose={() => setShowQuickAccess(false)} title="Gestión de Partidos">
        <div className="space-y-4">
          {/* Active match info */}
          {activeMatch && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-green-400">Partido Activo</span>
                </div>
                <button 
                  onClick={() => { setShowQuickAccess(false); }}
                  className="btn-primary text-sm px-3 py-1"
                >
                  Volver al partido
                </button>
              </div>
              <p className="text-sm text-gray-300">
                {teams.find(t => t.id === activeMatch.homeTeamId)?.name} vs {teams.find(t => t.id === activeMatch.awayTeamId)?.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Marcador: {activeMatch.homeScore} - {activeMatch.awayScore}
              </p>
            </div>
          )}

          {/* Pending matches */}
          <div>
            <h4 className="font-bold text-lg mb-3 text-yellow-400">
              Partidos Pendientes ({pendingMatches.length})
            </h4>
            {pendingMatches.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay partidos pendientes</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pendingMatches.map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  return (
                    <div key={m.id} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: home?.color }} />
                          <span className="font-medium text-sm">{home?.name}</span>
                          <span className="text-gray-500 text-xs">vs</span>
                          <span className="font-medium text-sm">{away?.name}</span>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: away?.color }} />
                        </div>
                        <p className="text-xs text-gray-400">J{m.jornada} • {formatDate(m.date)} • {m.time}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveMatch(m);
                          setShowStartConfirm(true);
                          setShowQuickAccess(false);
                        }}
                        className="btn-success text-sm px-3 py-1"
                      >
                        ▶️ Iniciar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My live matches */}
          {matches.filter(m => m.status === 'en_vivo' && m.refereeId === user.id && m.id !== activeMatch?.id).length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-3 text-green-400">
                Mis Otros Partidos en Vivo
              </h4>
              <div className="space-y-2">
                {matches.filter(m => m.status === 'en_vivo' && m.refereeId === user.id && m.id !== activeMatch?.id).map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  return (
                    <div key={m.id} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: home?.color }} />
                          <span className="font-medium text-sm">{home?.name}</span>
                          <span className="text-gray-500 text-xs">vs</span>
                          <span className="font-medium text-sm">{away?.name}</span>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: away?.color }} />
                        </div>
                        <p className="text-xs text-gray-400">Marcador: {m.homeScore} - {m.awayScore}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveMatch(m);
                          setGracePeriod(null);
                          setShowQuickAccess(false);
                        }}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        📝 Continuar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Floating Action Button */}
      {hasActiveMatch && (
        <button
          onClick={() => setShowQuickAccess(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
          title="Gestión de partidos"
        >
          {pendingMatches.length > 0 ? (
            <div className="relative">
              <Calendar size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {pendingMatches.length}
              </span>
            </div>
          ) : (
            <Calendar size={24} />
          )}
        </button>
      )}
    </div>
  );
}

// ==================== PLAYER PANEL ====================
function PlayerPanel({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLiveDashboard, setShowLiveDashboard] = useState(false);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const tournament = getDemoData<Tournament>(KEYS.tournaments).find(t => t.id === user.tournamentId);
  const myTeam = getDemoData<Team>(KEYS.teams).find(t => t.id === user.teamId);

  const loadData = useCallback(() => {
    if (!user.tournamentId) return;
    setMatches(getDemoData<Match>(KEYS.matches).filter(m => m.tournamentId === user.tournamentId));
    setEvents(getDemoData<MatchEvent>(KEYS.events));
    setTeams(getDemoData<Team>(KEYS.teams).filter(t => t.tournamentId === user.tournamentId));
    setNotifications(getDemoData<Notification>(KEYS.notifications).filter(n => n.tournamentId === user.tournamentId));
  }, [user.tournamentId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Polling para actualizar estadísticas en vivo cada 3 segundos
  useEffect(() => {
    const hasLiveMatch = matches.some(m => m.status === 'en_vivo');
    if (!hasLiveMatch) return;
    const interval = setInterval(() => {
      loadData();
    }, 3000);
    return () => clearInterval(interval);
  }, [matches, loadData]);

  const myMatches = matches.filter(m => m.homeTeamId === user.teamId || m.awayTeamId === user.teamId);
  const finishedMatches = myMatches.filter(m => m.status === 'finalizado');
  const liveMatches = myMatches.filter(m => m.status === 'en_vivo');
  const unreadNotifs = notifications.filter(n => !n.read).length;

  // Live dashboard data
  const liveMatch = liveMatches[0]; // Tomar el primer partido en vivo
  const liveMatchEvents = liveMatch ? events.filter(e => e.matchId === liveMatch.id).sort((a, b) => b.timestamp - a.timestamp) : [];
  const filteredLiveEvents = eventFilter === 'all' ? liveMatchEvents : liveMatchEvents.filter(e => e.type === eventFilter);
  const homeTeamLive = liveMatch ? teams.find(t => t.id === liveMatch.homeTeamId) : null;
  const awayTeamLive = liveMatch ? teams.find(t => t.id === liveMatch.awayTeamId) : null;
  
  // Stats comparison
  const homeStats = liveMatch ? {
    goals: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.homeTeamId && e.type === 'gol').length,
    yellowCards: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.homeTeamId && e.type === 'yellow_card').length,
    redCards: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.homeTeamId && e.type === 'red_card').length,
    touchdowns: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.homeTeamId && e.type === 'touchdown').length,
    conversions: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.homeTeamId && (e.type === 'conversion_1' || e.type === 'conversion_2')).length,
    sacks: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.homeTeamId && e.type === 'sack').length,
  } : null;
  
  const awayStats = liveMatch ? {
    goals: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.awayTeamId && e.type === 'gol').length,
    yellowCards: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.awayTeamId && e.type === 'yellow_card').length,
    redCards: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.awayTeamId && e.type === 'red_card').length,
    touchdowns: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.awayTeamId && e.type === 'touchdown').length,
    conversions: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.awayTeamId && (e.type === 'conversion_1' || e.type === 'conversion_2')).length,
    sacks: events.filter(e => e.matchId === liveMatch.id && e.teamId === liveMatch.awayTeamId && e.type === 'sack').length,
  } : null;

  // Standings
  const standings = (() => {
    const finishedAll = matches.filter(m => m.status === 'finalizado' && !m.isElimination);
    const rows: Record<string, StandingRow> = {};
    teams.forEach(t => { rows[t.id] = { teamId: t.id, teamName: t.name, teamColor: t.color, teamLogo: t.logo, jj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dif: 0, pts: 0 }; });
    finishedAll.forEach(m => {
      if (rows[m.homeTeamId]) { rows[m.homeTeamId].jj++; rows[m.homeTeamId].gf += m.homeScore; rows[m.homeTeamId].gc += m.awayScore; }
      if (rows[m.awayTeamId]) { rows[m.awayTeamId].jj++; rows[m.awayTeamId].gf += m.awayScore; rows[m.awayTeamId].gc += m.homeScore; }
      if (m.homeScore > m.awayScore) { if (rows[m.homeTeamId]) { rows[m.homeTeamId].g++; rows[m.homeTeamId].pts += tournament?.sport === 'tochito' ? 2 : 3; } if (rows[m.awayTeamId]) rows[m.awayTeamId].p++; }
      else if (m.homeScore < m.awayScore) { if (rows[m.awayTeamId]) { rows[m.awayTeamId].g++; rows[m.awayTeamId].pts += tournament?.sport === 'tochito' ? 2 : 3; } if (rows[m.homeTeamId]) rows[m.homeTeamId].p++; }
      else { if (rows[m.homeTeamId]) { rows[m.homeTeamId].e++; rows[m.homeTeamId].pts += 1; } if (rows[m.awayTeamId]) { rows[m.awayTeamId].e++; rows[m.awayTeamId].pts += 1; } }
    });
    return Object.values(rows).map(r => ({ ...r, dif: r.gf - r.gc })).sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf);
  })();

  // Scorers
  const scorers = (() => {
    const allEvents = events.filter(e => matches.some(m => m.id === e.matchId && m.tournamentId === user.tournamentId && m.status === 'finalizado'));
    const goalTypes = tournament?.sport === 'futbol' ? ['gol'] : ['touchdown'];
    const goalEvents = allEvents.filter(e => goalTypes.includes(e.type));
    const map: Record<string, ScorerRow> = {};
    goalEvents.forEach(e => {
      if (!map[e.playerName]) map[e.playerName] = { playerId: e.playerId, playerName: e.playerName, teamId: e.teamId, teamName: e.teamName, goals: 0, mvps: 0 };
      map[e.playerName].goals++;
    });
    // MVPs for tochito
    if (tournament?.sport === 'tochito') {
      const finishedMatches = matches.filter(m => m.tournamentId === user.tournamentId && m.status === 'finalizado');
      finishedMatches.forEach(m => {
        if (m.homeMvp) { if (map[m.homeMvp]) map[m.homeMvp].mvps = (map[m.homeMvp].mvps || 0) + 1; }
        if (m.awayMvp) { if (map[m.awayMvp]) map[m.awayMvp].mvps = (map[m.awayMvp].mvps || 0) + 1; }
      });
    }
    return Object.values(map).sort((a, b) => b.goals - a.goals);
  })();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="text-purple-400" size={28} />
            <div>
              <h1 className="text-lg font-bold text-white">{tournament?.name || 'Torneo'}</h1>
              <span className="text-xs text-gray-400">{user.name} • {myTeam?.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifPanel(true)} className="relative text-gray-400 hover:text-white">
              <Bell size={22} />
              {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unreadNotifs}</span>}
            </button>
            <button onClick={onLogout} className="text-gray-400 hover:text-white flex items-center gap-1"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Team card */}
        <div className="card text-center">
          {myTeam?.logo ? (
            <img src={myTeam.logo} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto mb-3" style={{ backgroundColor: myTeam?.color || '#666' }} />
          )}
          <h2 className="text-2xl font-bold">{myTeam?.name || 'Mi Equipo'}</h2>
          <p className="text-gray-400">{tournament?.name}</p>
        </div>

        {/* Live Stats Dashboard */}
        {liveMatches.length > 0 && (
          <div className="card border-2 border-green-500/50 bg-gradient-to-br from-green-900/20 to-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold text-green-400">📺 Partido en Vivo</h3>
              </div>
              <button 
                onClick={() => setShowLiveDashboard(!showLiveDashboard)}
                className="btn-secondary text-sm px-4 py-2"
              >
                {showLiveDashboard ? 'Ocultar Dashboard' : 'Ver Dashboard Completo'}
              </button>
            </div>

            {/* Compact view - always visible */}
            <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: homeTeamLive?.color || '#666' }}></div>
                  <span className="font-bold text-lg">{homeTeamLive?.name}</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400">
                    {liveMatch?.homeScore} - {liveMatch?.awayScore}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">J{liveMatch?.jornada} • Semana {liveMatch?.week}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{awayTeamLive?.name}</span>
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: awayTeamLive?.color || '#666' }}></div>
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-sm text-gray-400">
                  {liveMatchEvents.length} evento{liveMatchEvents.length !== 1 ? 's' : ''} registrado{liveMatchEvents.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Full dashboard - toggleable */}
            {showLiveDashboard && (
              <div className="space-y-4">
                {/* Stats Comparison */}
                {homeStats && awayStats && (
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-3 text-center">📊 Comparativa de Equipos</h4>
                    <div className="space-y-3">
                      {tournament?.sport === 'futbol' ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">{homeStats.goals}</span>
                            <span className="text-sm text-gray-400">Goles</span>
                            <span className="font-bold text-lg">{awayStats.goals}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-yellow-400">{homeStats.yellowCards}</span>
                            <span className="text-sm text-gray-400">Tarjetas Amarillas</span>
                            <span className="font-bold text-lg text-yellow-400">{awayStats.yellowCards}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-red-400">{homeStats.redCards}</span>
                            <span className="text-sm text-gray-400">Tarjetas Rojas</span>
                            <span className="font-bold text-lg text-red-400">{awayStats.redCards}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">{homeStats.touchdowns}</span>
                            <span className="text-sm text-gray-400">Touchdowns</span>
                            <span className="font-bold text-lg">{awayStats.touchdowns}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-blue-400">{homeStats.conversions}</span>
                            <span className="text-sm text-gray-400">Conversiones</span>
                            <span className="font-bold text-lg text-blue-400">{awayStats.conversions}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-orange-400">{homeStats.sacks}</span>
                            <span className="text-sm text-gray-400">Sacks</span>
                            <span className="font-bold text-lg text-orange-400">{awayStats.sacks}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Filters */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-3">🔍 Filtrar Eventos</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setEventFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        eventFilter === 'all' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Todos ({liveMatchEvents.length})
                    </button>
                    {tournament?.sport === 'futbol' ? (
                      <>
                        <button
                          onClick={() => setEventFilter('gol')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            eventFilter === 'gol' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          ⚽ Goles ({(homeStats?.goals || 0) + (awayStats?.goals || 0)})
                        </button>
                        <button
                          onClick={() => setEventFilter('yellow_card')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            eventFilter === 'yellow_card' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          🟨 Amarillas ({(homeStats?.yellowCards || 0) + (awayStats?.yellowCards || 0)})
                        </button>
                        <button
                          onClick={() => setEventFilter('red_card')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            eventFilter === 'red_card' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          🟥 Rojas ({(homeStats?.redCards || 0) + (awayStats?.redCards || 0)})
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEventFilter('touchdown')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            eventFilter === 'touchdown' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          🏈 TDs ({(homeStats?.touchdowns || 0) + (awayStats?.touchdowns || 0)})
                        </button>
                        <button
                          onClick={() => setEventFilter('conversion_1')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            eventFilter === 'conversion_1' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          1️⃣ Conv 1pt
                        </button>
                        <button
                          onClick={() => setEventFilter('conversion_2')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            eventFilter === 'conversion_2' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          2️⃣ Conv 2pts
                        </button>
                        <button
                          onClick={() => setEventFilter('sack')}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            eventFilter === 'sack' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          💪 Sacks ({(homeStats?.sacks || 0) + (awayStats?.sacks || 0)})
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Timeline of Events */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-3">⏱️ Timeline de Eventos</h4>
                  {filteredLiveEvents.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay eventos registrados aún</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredLiveEvents.map((event, index) => {
                        const eventTime = new Date(event.timestamp);
                        const timeStr = eventTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        const isHomeTeam = event.teamId === liveMatch?.homeTeamId;
                        const teamColor = isHomeTeam ? homeTeamLive?.color : awayTeamLive?.color;
                        
                        return (
                          <div key={event.id} className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3 border-l-4" style={{ borderColor: teamColor || '#666' }}>
                            <div className="flex-shrink-0 text-2xl">
                              {event.type === 'gol' && '⚽'}
                              {event.type === 'yellow_card' && '🟨'}
                              {event.type === 'red_card' && '🟥'}
                              {event.type === 'touchdown' && '🏈'}
                              {event.type === 'conversion_1' && '1️⃣'}
                              {event.type === 'conversion_2' && '2️⃣'}
                              {event.type === 'sack' && '💪'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold">{event.playerName}</span>
                                <span className="text-xs text-gray-400">{timeStr}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-400">{event.teamName}</span>
                                {event.points > 0 && (
                                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                                    +{event.points} pts
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Auto-refresh indicator */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    🔄 Actualización automática cada 3 segundos
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My matches */}
        <div>
          <h3 className="text-xl font-bold mb-3">Mis Partidos</h3>
          <div className="space-y-3">
            {myMatches.map(m => {
              const home = teams.find(t => t.id === m.homeTeamId);
              const away = teams.find(t => t.id === m.awayTeamId);
              const isMyTeamHome = m.homeTeamId === user.teamId;
              return (
                <div key={m.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${isMyTeamHome ? 'text-yellow-400' : ''}`}>{home?.name}</span>
                      <span className="text-xl font-bold text-white">{m.status === 'finalizado' || m.status === 'en_vivo' ? `${m.homeScore} - ${m.awayScore}` : 'vs'}</span>
                      <span className={`font-bold ${!isMyTeamHome ? 'text-yellow-400' : ''}`}>{away?.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-400">J{m.jornada}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'en_vivo' ? 'bg-green-500/20 text-green-400' : m.status === 'finalizado' ? 'bg-gray-600 text-gray-300' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {m.status === 'en_vivo' ? '🔴 En Vivo' : m.status === 'finalizado' ? 'Finalizado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats for finished matches */}
        {finishedMatches.length > 0 && (
          <div>
            <button className="btn-secondary w-full mb-3" onClick={() => setShowStats(!showStats)}>
              {showStats ? 'Ocultar' : 'Ver'} estadísticas completas {showStats ? <ChevronUp size={16} className="inline" /> : <ChevronDown size={16} className="inline" />}
            </button>
            {showStats && (
              <div className="card space-y-4">
                {finishedMatches.map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  const matchEvents = events.filter(e => e.matchId === m.id);
                  return (
                    <div key={m.id} className="border-b border-gray-700 pb-4 last:border-0">
                      <p className="font-bold mb-2">{home?.name} {m.homeScore} - {m.awayScore} {away?.name}</p>
                      {tournament?.sport === 'futbol' ? (
                        <div className="text-sm space-y-1">
                          {matchEvents.filter(e => e.type === 'gol').map(e => <p key={e.id} className="text-green-400">⚽ {e.playerName} ({e.teamName})</p>)}
                          {matchEvents.filter(e => e.type === 'yellow_card').map(e => <p key={e.id} className="text-yellow-400">🟨 {e.playerName} ({e.teamName})</p>)}
                          {matchEvents.filter(e => e.type === 'red_card').map(e => <p key={e.id} className="text-red-400">🟥 {e.playerName} ({e.teamName})</p>)}
                          <p className="text-gray-400 mt-2">📊 Total: {matchEvents.filter(e => e.type === 'gol').length} goles, {matchEvents.filter(e => e.type === 'yellow_card').length} amarillas, {matchEvents.filter(e => e.type === 'red_card').length} rojas</p>
                        </div>
                      ) : (
                        <div className="text-sm space-y-1">
                          {matchEvents.filter(e => e.type === 'touchdown').map(e => <p key={e.id} className="text-green-400">🏈 {e.playerName} ({e.teamName})</p>)}
                          {matchEvents.filter(e => e.type === 'conversion_1').map(e => <p key={e.id} className="text-blue-400">1️⃣ {e.playerName} ({e.teamName})</p>)}
                          {matchEvents.filter(e => e.type === 'conversion_2').map(e => <p key={e.id} className="text-purple-400">2️⃣ {e.playerName} ({e.teamName})</p>)}
                          {matchEvents.filter(e => e.type === 'sack').map(e => <p key={e.id} className="text-orange-400">💪 {e.playerName} ({e.teamName})</p>)}
                          <p className="text-gray-400 mt-2">📊 Total: {matchEvents.filter(e => e.type === 'touchdown').length} TD, {matchEvents.filter(e => e.type === 'conversion_1').length + matchEvents.filter(e => e.type === 'conversion_2').length} conv, {matchEvents.filter(e => e.type === 'sack').length} sacks</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Standings */}
        <div>
          <h3 className="text-xl font-bold mb-3">Tabla de Posiciones</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-gray-700">
                <th className="py-2 px-2 text-gray-400">#</th>
                <th className="py-2 px-2 text-gray-400">Equipo</th>
                <th className="py-2 px-2 text-gray-400">JJ</th>
                {tournament?.sport !== 'tochito' && <th className="py-2 px-2 text-gray-400">E</th>}
                <th className="py-2 px-2 text-gray-400">G</th>
                <th className="py-2 px-2 text-gray-400">P</th>
                <th className="py-2 px-2 text-gray-400">Dif</th>
                <th className="py-2 px-2 text-gray-400">Pts</th>
              </tr></thead>
              <tbody>
                {standings.map((row, i) => (
                  <tr key={row.teamId} className={`border-b border-gray-700/50 ${row.teamId === user.teamId ? 'bg-yellow-500/10' : ''}`}>
                    <td className="py-2 px-2 font-bold">{i + 1}</td>
                    <td className="py-2 px-2 flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.teamColor }} />{row.teamName}</td>
                    <td className="py-2 px-2">{row.jj}</td>
                    {tournament?.sport !== 'tochito' && <td className="py-2 px-2">{row.e}</td>}
                    <td className="py-2 px-2 text-green-400">{row.g}</td>
                    <td className="py-2 px-2 text-red-400">{row.p}</td>
                    <td className={`py-2 px-2 ${row.dif > 0 ? 'text-green-400' : row.dif < 0 ? 'text-red-400' : 'text-gray-400'}`}>{row.dif > 0 ? '+' : ''}{row.dif}</td>
                    <td className="py-2 px-2 font-bold text-yellow-400">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scorers */}
        <div>
          <h3 className="text-xl font-bold mb-3">{tournament?.sport === 'futbol' ? '🥅 Goleadores' : '🏈 Anotadores'}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-gray-700">
                <th className="py-2 px-2 text-gray-400">#</th>
                <th className="py-2 px-2 text-gray-400">Jugador</th>
                <th className="py-2 px-2 text-gray-400">Equipo</th>
                <th className="py-2 px-2 text-gray-400">{tournament?.sport === 'futbol' ? 'Goles' : 'TDs'}</th>
                {tournament?.sport === 'tochito' && <th className="py-2 px-2 text-gray-400">MVPs</th>}
              </tr></thead>
              <tbody>
                {scorers.map((s, i) => (
                  <tr key={s.playerId + s.playerName} className="border-b border-gray-700/50">
                    <td className="py-2 px-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                    <td className="py-2 px-2 font-medium">{s.playerName}</td>
                    <td className="py-2 px-2 text-gray-300">{s.teamName}</td>
                    <td className="py-2 px-2 font-bold text-yellow-400">{s.goals}</td>
                    {tournament?.sport === 'tochito' && <td className="py-2 px-2">{s.mvps || 0} 🏆</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {scorers.length === 0 && <p className="text-gray-500 text-center py-4">Sin anotadores registrados</p>}
        </div>
      </div>

      {/* Notifications */}
      <Modal isOpen={showNotifPanel} onClose={() => setShowNotifPanel(false)} title="Notificaciones">
        <div className="space-y-3">
          {notifications.length === 0 ? <p className="text-gray-500">No hay notificaciones</p> : (
            notifications.map(n => (
              <div key={n.id} className={`rounded-lg p-3 ${n.read ? 'bg-gray-700/50' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{n.type === 'postponed' ? '⏸️' : n.type === 'cancelled' ? '❌' : '🔄'}</span>
                      <span className="font-medium text-sm">{n.title}</span>
                      {!n.read && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">NUEVO</span>}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{n.message}</p>
                  </div>
                  {!n.read && <button onClick={() => { updateDemoItem<Notification>(KEYS.notifications, n.id, { read: true }); loadData(); }} className="text-blue-400 text-xs"><Check size={14} /></button>}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [currentUser, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeSystem();
    const saved = getCurrentUser();
    if (saved) setUser(saved);
  }, []);

  const handleLogin = (user: User) => setUser(user);
  const handleLogout = () => { setCurrentUser(null); setUser(null); };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  switch (currentUser.role) {
    case 'superadmin': return <SuperAdminPanel user={currentUser} onLogout={handleLogout} />;
    case 'admin': return <AdminPanel user={currentUser} onLogout={handleLogout} />;
    case 'referee': return <RefereePanel user={currentUser} onLogout={handleLogout} />;
    case 'player': return <PlayerPanel user={currentUser} onLogout={handleLogout} />;
    default: return <Login onLogin={handleLogin} />;
  }
}
