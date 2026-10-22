# 🚀 Inicio Rápido - TorneosPro con Supabase

## ⚡ Configuración en 10 minutos

### 1. Crear proyecto en Supabase (2 min)
```
1. Ve a https://supabase.com
2. Click en "New Project"
3. Nombre: torneospro
4. Password: (guárdala)
5. Region: US East
6. Click "Create new project"
```

### 2. Copiar credenciales (1 min)
```
1. Settings → API
2. Copia:
   - Project URL: https://xxxxx.supabase.co
   - anon public key: eyJhbGc...
```

### 3. Crear tablas (2 min)
```
1. SQL Editor → New query
2. Copia TODO el contenido de supabase-schema.sql
3. Click "Run"
4. Verifica en Table Editor que se crearon las tablas
```

### 4. Configurar .env (1 min)
```bash
# Crea archivo .env en la raíz del proyecto
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 5. Actualizar código (2 min)

En `src/App.tsx`, cambia el import:

```typescript
// ANTES:
import { ... } from './storage';

// DESPUÉS:
import { ... } from './storageSupabase';
```

### 6. Hacer funciones asíncronas (2 min)

Busca y reemplaza en todo el código:

```typescript
// ANTES:
const users = getDemoData<User>(KEYS.users);

// DESPUÉS:
const users = await getDemoData<User>(KEYS.users);
```

**Funciones principales a actualizar:**
- `loadData()` en todos los paneles
- `handleLogin()` en Login
- Todas las funciones de guardar (saveTournament, saveTeam, etc.)
- `initializeSystem()` en App

### 7. Probar (1 min)
```bash
npm run dev
```

Login:
- Usuario: `superadmin`
- Contraseña: `admin123`

---

## 🎯 Deploy a Producción

### Vercel (Gratis)
```bash
# 1. Sube a GitHub
git add .
git commit -m "Integración con Supabase"
git push

# 2. Ve a https://vercel.com
# 3. Importa tu repositorio
# 4. Agrega Environment Variables:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
# 5. Click "Deploy"
```

---

## 📊 Costo

**GRATIS** hasta:
- 50,000 usuarios activos/mes
- 500 MB base de datos
- 2 GB transferencia/mes

---

## 🆘 Problemas comunes

**Error de conexión:**
- Verifica que el archivo `.env` existe
- Verifica que las credenciales son correctas
- Reinicia el servidor

**Error de tablas:**
- Ejecuta nuevamente `supabase-schema.sql`

**Error de permisos:**
- Deshabilita RLS temporalmente para desarrollo

---

## ✅ Checklist rápido

- [ ] Cuenta en Supabase creada
- [ ] Proyecto creado
- [ ] SQL ejecutado
- [ ] Tablas verificadas
- [ ] Archivo `.env` creado
- [ ] Imports actualizados
- [ ] Funciones con `await`
- [ ] Login funciona
- [ ] Deploy completado

---

## 📖 Guía completa

Para instrucciones detalladas, lee: `GUIA_SUPABASE.md`
