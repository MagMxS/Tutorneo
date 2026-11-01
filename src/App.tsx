import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy, Users, Settings, LogOut, Eye, EyeOff, Plus, Edit, Trash2,
  Calendar, Clock, MapPin, Bell, Check, X, AlertTriangle, Star,
  ChevronDown, ChevronUp, User as UserIcon, Shield, Target, Award,
  Undo, FileText, AlertCircle, Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import {
  User, Tournament, Team, Field, Match, MatchEvent, Notification,
  AppConfig, SportType, MatchStatus, StandingRow, ScorerRow, LocalBusiness
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

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            <h1 className="text-xl font-bold text-white">TorneosPro</h1>
            <span className="text-xs bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full font-bold">
              {currentUser.role === 'superadmin' ? 'SuperAdmin' : currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'referee' ? 'Árbitro' : 'Jugador'}
            </span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white flex items-center gap-1">
            <LogOut size={18} />Salir
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">¡Bienvenido, {currentUser.name}!</h2>
          <p className="text-gray-300 mb-6">Has iniciado sesión como {currentUser.role}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <Users className="text-blue-400 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-lg mb-2">Panel Completo</h3>
              <p className="text-gray-400 text-sm">El panel completo está en desarrollo. Por ahora puedes usar el sistema de login.</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-6">
              <Settings className="text-green-400 mx-auto mb-3" size={32} />
              <h3 className="font-bold text-lg mb-2">Configuración</h3>
              <p className="text-gray-400 text-sm">La aplicación está usando localStorage para almacenar datos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
