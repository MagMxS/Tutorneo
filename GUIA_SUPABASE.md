# 🚀 Guía de Configuración de Supabase para TorneosPro

## 📋 Paso 1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Inicia sesión con GitHub (recomendado) o crea una cuenta con email
4. Es **GRATIS** hasta 50,000 usuarios activos/mes

---

## 📋 Paso 2: Crear un nuevo proyecto

1. En el dashboard de Supabase, haz clic en **"New Project"**
2. Completa la información:
   - **Name**: `torneospro` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡GUÁRDALA!)
   - **Region**: Selecciona la más cercana a tus usuarios (ej: `US East` para Latinoamérica)
   - **Pricing Plan**: Free (gratis)
3. Haz clic en **"Create new project"**
4. Espera 1-2 minutos mientras se crea el proyecto

---

## 📋 Paso 3: Obtener tus credenciales

1. Una vez creado el proyecto, ve a **Settings** (ícono de engranaje en el menú lateral)
2. Haz clic en **"API"**
3. Copia estos dos valores:
   - **Project URL**: Algo como `https://abcdefghijk.supabase.co`
   - **anon public key**: Una cadena larga que empieza con `eyJ...`

---

## 📋 Paso 4: Crear las tablas en la base de datos

1. En el menú lateral de Supabase, haz clic en **"SQL Editor"** (ícono de base de datos con código)
2. Haz clic en **"New query"**
3. Abre el archivo `supabase-schema.sql` que está en la raíz de este proyecto
4. **Copia TODO el contenido** del archivo SQL
5. **Pégalo** en el SQL Editor de Supabase
6. Haz clic en **"Run"** (botón verde en la esquina inferior derecha)
7. Espera a que se ejecute (debería tomar 2-3 segundos)
8. Deberías ver un mensaje de éxito: **"Success. No rows returned"**

### ✅ Verificar que se crearon las tablas

1. En el menú lateral, haz clic en **"Table Editor"**
2. Deberías ver estas tablas:
   - `config`
   - `fields`
   - `incidents`
   - `match_events`
   - `matches`
   - `notifications`
   - `teams`
   - `tournaments`
   - `users`

---

## 📋 Paso 5: Configurar las variables de entorno

1. En la raíz de tu proyecto, crea un archivo llamado `.env` (sin el `.example`)
2. Copia el contenido de `.env.example`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

3. **Reemplaza** los valores con tus credenciales reales:
   - `VITE_SUPABASE_URL`: La URL de tu proyecto (la copiaste en el Paso 3)
   - `VITE_SUPABASE_ANON_KEY`: La clave anon (la copiaste en el Paso 3)

**Ejemplo:**
```bash
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAwNTk5OTk5OX0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📋 Paso 6: Actualizar el código para usar Supabase

### Opción A: Reemplazar completamente localStorage (Recomendado)

Necesitas modificar `src/App.tsx` para importar desde `storageSupabase.ts` en lugar de `storage.ts`:

**Cambia esta línea (al inicio del archivo):**
```typescript
import {
  getDemoData, setDemoData, addDemoItem, removeDemoItem, updateDemoItem,
  generateId, getCurrentUser, setCurrentUser, getConfig, setConfig,
  initializeSystem, resetAllData, getCurrentWeek, formatDate, getWeekNumber, KEYS
} from './storage';
```

**Por esta:**
```typescript
import {
  getDemoData, setDemoData, addDemoItem, removeDemoItem, updateDemoItem,
  generateId, getCurrentUser, setCurrentUser, getConfig, setConfig,
  initializeSystem, resetAllData, getCurrentWeek, formatDate, getWeekNumber, KEYS
} from './storageSupabase';
```

### Opción B: Modo hìbrido (localStorage + Supabase)

Si quieres mantener localStorage como fallback, puedes crear un wrapper que intente Supabase primero y si falla, use localStorage.

---

## 📋 Paso 7: Hacer las funciones asíncronas

⚠️ **IMPORTANTE**: Las funciones de Supabase son **asíncronas** (usan `async/await`), mientras que localStorage es **síncrono**.

Necesitas actualizar todas las llamadas a estas funciones para usar `await`:

### Ejemplo de cambios necesarios:

**Antes (localStorage):**
```typescript
const users = getDemoData<User>(KEYS.users);
```

**Después (Supabase):**
```typescript
const users = await getDemoData<User>(KEYS.users);
```

### Funciones que necesitas actualizar:

1. **En el componente `Login`:**
```typescript
const handleLogin = async () => {
  const users = await getDemoData<User>(KEYS.users);
  // ... resto del código
};
```

2. **En `SuperAdminPanel`:**
```typescript
const loadData = useCallback(async () => {
  setTournaments(await getDemoData<Tournament>(KEYS.tournaments));
  setUsers(await getDemoData<User>(KEYS.users));
}, []);

useEffect(() => { loadData(); }, [loadData]);
```

3. **En `AdminPanel`, `RefereePanel`, `PlayerPanel`:**
```typescript
const loadData = useCallback(async () => {
  // ... todas las llamadas a getDemoData necesitan await
  setMatches(await getDemoData<Match>(KEYS.matches));
  setEvents(await getDemoData<MatchEvent>(KEYS.events));
  // etc.
}, []);
```

4. **Funciones de guardar:**
```typescript
const saveTournament = async () => {
  await addDemoItem<Tournament>(KEYS.tournaments, { ... });
  loadData();
};
```

---

## 📋 Paso 8: Probar la conexión

1. Ejecuta tu aplicación:
```bash
npm run dev
```

2. Abre la consola del navegador (F12)
3. Deberías ver mensajes de conexión a Supabase
4. Intenta iniciar sesión con:
   - **Usuario**: `superadmin`
   - **Contraseña**: `admin123`

5. Si funciona, ¡felicidades! Tu app ya está conectada a Supabase

---

## 📋 Paso 9: Deploy a producción

### Opción 1: Vercel (Recomendado)

1. Sube tu código a GitHub
2. Ve a [https://vercel.com](https://vercel.com)
3. Importa tu repositorio
4. En **"Environment Variables"**, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Haz clic en **"Deploy"**

### Opción 2: Netlify

1. Sube tu código a GitHub
2. Ve a [https://netlify.com](https://netlify.com)
3. Importa tu repositorio
4. En **"Environment variables"**, agrega las mismas variables
5. Haz clic en **"Deploy"**

---

## 🔒 Paso 10: Seguridad (IMPORTANTE)

### Proteger tu anon key

La `anon key` es pública por diseño, pero debes:

1. **Habilitar Row Level Security (RLS)** en todas las tablas
2. **Crear políticas** específicas para cada rol de usuario
3. **No exponer** la `service_role key` (esa es secreta)

### Ejemplo de política RLS para torneos:

```sql
-- Solo los admins pueden crear torneos
CREATE POLICY "Solo admins crean torneos" 
ON tournaments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Todos pueden ver torneos
CREATE POLICY "Todos ven torneos" 
ON tournaments FOR SELECT 
USING (true);
```

---

## 📊 Monitoreo y límites

### Plan gratuito de Supabase incluye:

- ✅ 500 MB de base de datos
- ✅ 1 GB de storage
- ✅ 50,000 usuarios activos mensuales
- ✅ 2 GB de transferencia/mes
- ✅ Proyectos ilimitados

### ¿Cuándo necesitas upgrade?

- Si tienes más de 50K usuarios activos/mes
- Si tu base de datos crece más de 500 MB
- Si necesitas más de 2 GB de transferencia

**Costo del plan Pro**: $25/mes

---

## 🐛 Solución de problemas comunes

### Error: "relation does not exist"

**Causa**: Las tablas no se crearon correctamente

**Solución**: 
1. Ve al SQL Editor de Supabase
2. Ejecuta el archivo `supabase-schema.sql` nuevamente

### Error: "Invalid API key"

**Causa**: Las credenciales en `.env` son incorrectas

**Solución**:
1. Verifica que copiaste correctamente la URL y la anon key
2. Asegúrate de que el archivo `.env` esté en la raíz del proyecto
3. Reinicia el servidor de desarrollo

### Error: "new row violates row-level security policy"

**Causa**: Las políticas RLS están bloqueando la operación

**Solución**:
1. Para desarrollo, puedes deshabilitar RLS temporalmente:
```sql
ALTER TABLE tournaments DISABLE ROW LEVEL SECURITY;
-- (repetir para cada tabla)
```

2. Para producción, crea políticas específicas (ver Paso 10)

### Los datos no se guardan

**Causa**: Las funciones no son asíncronas

**Solución**:
1. Asegúrate de usar `await` en todas las llamadas a Supabase
2. Revisa la consola del navegador para ver errores

---

## 📚 Recursos adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de JavaScript/TypeScript](https://supabase.com/docs/reference/javascript/introduction)
- [Comunidad de Supabase en Discord](https://discord.supabase.com)

---

## ✅ Checklist final

- [ ] Crear cuenta en Supabase
- [ ] Crear proyecto nuevo
- [ ] Copiar URL y anon key
- [ ] Ejecutar SQL schema
- [ ] Verificar que se crearon las tablas
- [ ] Crear archivo `.env` con las credenciales
- [ ] Modificar imports en `App.tsx` para usar `storageSupabase`
- [ ] Agregar `await` en todas las llamadas a funciones de datos
- [ ] Probar login con superadmin
- [ ] Crear un torneo de prueba
- [ ] Verificar que los datos se guardan en Supabase
- [ ] Deploy a Vercel/Netlify con variables de entorno

---

## 🎉 ¡Listo!

Tu aplicación TorneosPro ahora está conectada a Supabase y lista para ser usada por miles de usuarios. Todos los datos se sincronizan en tiempo real y cada usuario puede ver los mismos torneos, equipos y partidos.

**Siguiente paso**: ¡Comparte tu app con el mundo! 🌍
