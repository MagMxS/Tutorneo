# 🏆 TorneosPro - Gestión de Torneos Deportivos

Aplicación web completa para la gestión de torneos deportivos de Fútbol y Tochito Bandera, ahora con soporte para base de datos compartida usando Supabase.

## ✨ Características

- ✅ **4 roles de usuario**: SuperAdmin, Admin, Árbitro, Jugador
- ✅ **Gestión completa**: Torneos, equipos, canchas, usuarios, partidos
- ✅ **Calendario Round Robin**: Generación automática de calendarios
- ✅ **Registro en vivo**: Eventos en tiempo real (goles, tarjetas, touchdowns)
- ✅ **Estadísticas**: Tablas de posiciones, goleadores, MVPs
- ✅ **Eliminatorias**: Sistema completo de playoffs
- ✅ **Dashboard en vivo**: Estadísticas en tiempo real para jugadores
- ✅ **Exportación Excel**: Descarga de estadísticas en formato Excel
- ✅ **Acta PDF**: Generación de actas oficiales de partidos
- ✅ **Multi-usuario**: Todos los usuarios ven los mismos datos (con Supabase)

## 🚀 Inicio Rápido

### Opción 1: Modo Local (localStorage)

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

**Limitación**: Cada usuario tiene sus propios datos en su navegador.

### Opción 2: Modo Multi-usuario (Supabase) ⭐ Recomendado

Permite que miles de usuarios compartan los mismos datos.

**Tiempo de configuración**: 10 minutos

**Costo**: GRATIS hasta 50,000 usuarios/mes

👉 **Lee la guía completa**: [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

👉 **Guía detallada**: [GUIA_SUPABASE.md](./GUIA_SUPABASE.md)

---

## 📋 Pasos para configurar Supabase

### 1. Crear cuenta en Supabase
- Ve a [https://supabase.com](https://supabase.com)
- Regístrate gratis con GitHub o email

### 2. Crear proyecto
- Nombre: `torneospro`
- Password: (guárdala)
- Region: US East (o la más cercana)

### 3. Copiar credenciales
- Ve a Settings → API
- Copia:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **anon public key**: `eyJhbGc...`

### 4. Crear tablas
- Ve a SQL Editor
- Copia y ejecuta el contenido de `supabase-schema.sql`

### 5. Configurar variables de entorno
Crea un archivo `.env` en la raíz:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 6. Actualizar código
En `src/App.tsx`, cambia:

```typescript
// ANTES:
import { ... } from './storage';

// DESPUÉS:
import { ... } from './storageSupabase';
```

### 7. Hacer funciones asíncronas
Agrega `await` en todas las llamadas a funciones de datos:

```typescript
// ANTES:
const users = getDemoData<User>(KEYS.users);

// DESPUÉS:
const users = await getDemoData<User>(KEYS.users);
```

### 8. Probar
```bash
npm run dev
```

Login:
- Usuario: `superadmin`
- Contraseña: `admin123`

---

## 🌐 Deploy a Producción

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Ve a [https://vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Agrega Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click "Deploy"

**Resultado**: Tu app estará disponible en `https://torneospro.vercel.app`

### Netlify

1. Sube tu código a GitHub
2. Ve a [https://netlify.com](https://netlify.com)
3. Importa tu repositorio
4. Agrega las mismas variables de entorno
5. Click "Deploy"

---

## 👥 Roles de Usuario

### Super Administrador
- **Credenciales**: `superadmin` / `admin123`
- **Acceso**: Gestión completa del sistema
- **Funciones**:
  - Crear/editar/eliminar torneos
  - Crear/editar/eliminar usuarios
  - Configurar el sistema
  - Resetear todo el sistema

### Administrador de Torneo
- **Acceso**: Gestión de un torneo específico
- **Funciones**:
  - Crear/editar/eliminar equipos
  - Crear/editar/eliminar canchas
  - Crear árbitros y jugadores
  - Generar calendario Round Robin
  - Editar partidos (durante período de gracia)
  - Ver tabla de posiciones
  - Generar eliminatorias

### Árbitro
- **Acceso**: Gestión de partidos en vivo
- **Funciones**:
  - Iniciar/finalizar partidos
  - Registrar jugadores al vuelo
  - Registrar eventos (goles, tarjetas, touchdowns)
  - Ver historial de eventos
  - Deshacer último evento (30 segundos)
  - Reportar incidencias
  - Generar acta PDF
  - Gestionar múltiples partidos

### Jugador
- **Acceso**: Vista de su equipo
- **Funciones**:
  - Ver partidos de su equipo
  - Dashboard de estadísticas en vivo
  - Ver tabla de posiciones
  - Ver tabla de goleadores/anotadores
  - Descargar estadísticas en Excel

---

## 📊 Estructura de la Base de Datos

### Tablas principales

```sql
tournaments      -- Torneos (Fútbol/Tochito)
users            -- Usuarios (superadmin, admin, referee, player)
teams            -- Equipos
fields           -- Canchas
matches          -- Partidos
match_events     -- Eventos (goles, tarjetas, etc.)
notifications    -- Notificaciones
incidents        -- Incidencias reportadas por árbitros
config           -- Configuración global
```

### Relaciones

```
tournament 1───N teams
tournament 1───N fields
tournament 1───N matches
tournament 1───N users

team 1───N matches (local/visitante)
team 1───N users (jugadores)

match 1───N match_events
match 1───N incidents

user 1───1 tournament (admin/referee)
user 1───1 team (player)
```

---

## 🎮 Funcionalidades por Deporte

### Fútbol
- **Eventos**: Gol (1pt), Tarjeta Amarilla, Tarjeta Roja
- **Puntos**: 3 pts victoria, 1 pt empate, 0 pts derrota
- **Tabla**: JJ, G, E, P, GF, GC, Dif, Pts
- **Goleadores**: Ranking de máximos goleadores

### Tochito Bandera
- **Eventos**: Touchdown (6pts), Conversión 1pt, Conversión 2pts, Sack
- **Puntos**: 2 pts victoria, 0 pts derrota (sin empates)
- **Tabla**: JJ, G, P, GF, GC, Dif, Pts
- **Anotadores**: Ranking con columna de MVPs
- **MVP**: Obligatorio al finalizar cada partido

---

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Exportación**: 
  - Excel: SheetJS (xlsx)
  - PDF: jsPDF
- **Animaciones**: canvas-confetti

---

## 📱 Características Especiales

### Para Árbitros
- ✅ Botón "Deshacer último evento" (30 segundos)
- ✅ Animaciones visuales al registrar goles/touchdowns
- ✅ Vibración háptica en móviles
- ✅ Sistema de incidencias
- ✅ Generación de acta PDF
- ✅ Período de gracia para cancelar inicio (2 min)
- ✅ Período de gracia para editar resultado (5 min)
- ✅ Gestión de múltiples partidos simultáneos
- ✅ Banner con timer de partidos pendientes

### Para Jugadores
- ✅ Dashboard de estadísticas en vivo
- ✅ Filtros de eventos por tipo
- ✅ Timeline de eventos
- ✅ Descarga de Excel (Mis Partidos, Posiciones, Goleadores)
- ✅ Actualización automática cada 3 segundos

### Para Admins
- ✅ Generación automática de calendario Round Robin
- ✅ Sistema de eliminatorias
- ✅ Edición de partidos durante período de gracia
- ✅ Vista completa del calendario

---

## 🔒 Seguridad

### Row Level Security (RLS)

Supabase incluye RLS para proteger los datos. Por defecto, el schema permite lectura/escritura pública para facilitar el desarrollo.

**Para producción**, debes crear políticas específicas:

```sql
-- Ejemplo: Solo admins pueden crear torneos
CREATE POLICY "Solo admins crean torneos" 
ON tournaments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
```

### Autenticación

Actualmente usa autenticación simple (usuario/contraseña en base de datos).

**Para producción**, considera:
- Supabase Auth (email/password, Google, GitHub, etc.)
- JWT tokens
- Refresh tokens

---

## 📦 Estructura del Proyecto

```
torneospro/
├── src/
│   ├── App.tsx              # Componente principal
│   ├── types.ts             # Tipos TypeScript
│   ├── storage.ts           # Almacenamiento localStorage (original)
│   ├── storageSupabase.ts   # Almacenamiento Supabase (nuevo)
│   ├── supabaseClient.ts    # Cliente de Supabase
│   ├── index.css            # Estilos globales
│   └── main.tsx             # Punto de entrada
├── public/                  # Archivos estáticos
├── supabase-schema.sql      # Schema de base de datos
├── .env.example             # Ejemplo de variables de entorno
├── INICIO_RAPIDO.md         # Guía rápida
├── GUIA_SUPABASE.md         # Guía completa de Supabase
└── README.md                # Este archivo
```

---

## 💰 Costos

### Plan Gratuito (Supabase)
- ✅ 500 MB base de datos
- ✅ 1 GB storage
- ✅ 50,000 usuarios activos/mes
- ✅ 2 GB transferencia/mes
- ✅ Proyectos ilimitados

### Hosting (Vercel/Netlify)
- ✅ Gratis para proyectos personales
- ✅ CDN global
- ✅ HTTPS incluido
- ✅ Dominio personalizado gratis

### Total: $0/mes hasta 50K usuarios activos

---

## 🐛 Solución de Problemas

### Error: "relation does not exist"
**Solución**: Ejecuta `supabase-schema.sql` en el SQL Editor

### Error: "Invalid API key"
**Solución**: Verifica las credenciales en `.env`

### Error: "new row violates row-level security policy"
**Solución**: Deshabilita RLS temporalmente o crea políticas adecuadas

### Los datos no se guardan
**Solución**: Asegúrate de usar `await` en todas las llamadas a Supabase

---

## 📚 Documentación

- [Guía de Inicio Rápido](./INICIO_RAPIDO.md) - Configuración en 10 minutos
- [Guía Completa de Supabase](./GUIA_SUPABASE.md) - Instrucciones detalladas
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión de torneos deportivos

---

## 🎉 Agradecimientos

- [Supabase](https://supabase.com) - Backend como servicio
- [Vercel](https://vercel.com) - Hosting y deploy
- [React](https://react.dev) - Biblioteca UI
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Lucide](https://lucide.dev) - Iconos

---

## 📞 Soporte

Si tienes preguntas o problemas:

1. Revisa la [Guía de Supabase](./GUIA_SUPABASE.md)
2. Consulta la [documentación de Supabase](https://supabase.com/docs)
3. Abre un issue en GitHub

---

**¡Disfruta gestionando tus torneos con TorneosPro!** 🏆⚽🏈
