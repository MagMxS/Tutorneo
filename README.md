# 🏆 TorneosPro - Gestión de Torneos Deportivos

Aplicación web completa para la gestión de torneos deportivos de Fútbol y Tochito Bandera, desarrollada con React 18, TypeScript, Vite y Tailwind CSS.

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
- ✅ **Monetización**: Sistema de anuncios y contenido premium

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

### Credenciales de Acceso

**Super Administrador:**
- Usuario: `superadmin`
- Contraseña: `admin123`

## 📦 Estructura del Proyecto

```
tutorneo/
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias y scripts
├── vite.config.js                # Configuración de Vite
├── vercel.json                   # Configuración de Vercel
├── tsconfig.json                 # Configuración de TypeScript
├── supabase-schema.sql           # Schema de base de datos Supabase
├── .env.example                  # Ejemplo de variables de entorno
├── README.md                     # Este archivo
├── src/
│   ├── main.tsx                  # Punto de entrada React
│   ├── App.tsx                   # Componente principal
│   ├── index.css                 # Estilos globales
│   ├── types.ts                  # Tipos TypeScript
│   ├── storage.ts                # Funciones localStorage
│   ├── supabaseClient.ts         # Cliente de Supabase
│   └── vite-env.d.ts             # Tipos para variables de entorno
└── dist/                         # Archivos de producción (generado)
```

## 🔧 Configuración de Supabase (Opcional)

Si quieres usar Supabase en lugar de localStorage:

### 1. Crear cuenta en Supabase
- Ve a https://supabase.com
- Regístrate gratis

### 2. Crear proyecto
- Nombre: `torneospro`
- Password: (créala y guárdala)
- Region: US East

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

### 6. Actualizar el código
Cambia los imports en `App.tsx` de `./storage` a `./storageSupabase`

## 🌐 Despliegue en Vercel

### Configuración Automática

El proyecto ya incluye `vercel.json` con la configuración correcta:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Pasos para Desplegar

1. Sube el código a GitHub
2. Conecta tu repositorio con Vercel
3. Vercel detectará automáticamente la configuración
4. El deployment se completará en 2-3 minutos

### Configuración Manual en Vercel

Si necesitas configurar manualmente:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Root Directory** | `./` |

## 👥 Roles de Usuario

### Super Administrador
- **Credenciales**: `superadmin` / `admin123`
- **Acceso**: Gestión completa del sistema
- **Funciones**:
  - Crear/editar/eliminar torneos
  - Crear/editar/eliminar usuarios
  - Configurar el sistema
  - Gestionar negocios locales
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

## 💰 Monetización

### Estrategias Implementadas

1. **Banner Ads**: Anuncios estáticos y sticky
2. **Rewarded Video Ads**: Videos para desbloquear contenido (24h)
3. **Local Business Ads**: Negocios locales gestionados desde SuperAdmin

### Contenido Desbloqueable

- 📊 Descarga de "Mis Partidos" (Excel)
- 📊 Descarga de "Tabla de Posiciones" (Excel)
- 📊 Descarga de "Goleadores/Anotadores" (Excel)
- 📺 Dashboard completo de estadísticas en vivo

### Gestión de Negocios

El SuperAdmin puede gestionar negocios locales desde el panel:
- Nombre, descripción, icono
- Distancia y calificación
- URL del sitio web
- Teléfono/WhatsApp
- Colores personalizados
- Estado activo/inactivo

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Backend**: localStorage (por defecto) o Supabase (opcional)
- **Exportación**: 
  - Excel: SheetJS (xlsx)
  - PDF: jsPDF
- **Animaciones**: canvas-confetti

## 📊 Almacenamiento de Datos

### localStorage (Por Defecto)
- ✅ Sin configuración necesaria
- ✅ Funciona inmediatamente
- ❌ Datos solo en el navegador del usuario
- ❌ No es colaborativo

### Supabase (Opcional)
- ✅ Base de datos en la nube
- ✅ Colaborativo (todos ven los mismos datos)
- ✅ Respaldo automático
- ✅ Gratis hasta 50K usuarios/mes
- ⚠️ Requiere configuración

## 🔒 Seguridad

### Row Level Security (RLS)
Supabase incluye RLS para proteger los datos. Por defecto, el schema permite lectura/escritura pública para facilitar el desarrollo.

### Autenticación
Actualmente usa autenticación simple (usuario/contraseña en base de datos).

## 📱 Responsividad

La aplicación es completamente responsive:
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🐛 Solución de Problemas

### Error 404 en Vercel
- Verifica que `vercel.json` existe
- Confirma que `index.html` está en la raíz
- Verifica Build Command: `npm run build`
- Verifica Output Directory: `dist`

### Los datos no se guardan
- Si usas localStorage: los datos están en el navegador
- Si usas Supabase: verifica las credenciales en `.env`

### Error de conexión a Supabase
- Verifica que el archivo `.env` existe
- Verifica que las credenciales son correctas
- Verifica que ejecutaste `supabase-schema.sql`

## 📚 Documentación Adicional

- **Guía de Supabase**: `GUIA_SUPABASE.md`
- **Guía de Anuncios**: `GUIA_ANUNCIOS.md`
- **Guía de Negocios**: `GUIA_NEGOCIOS_SUPERADMIN.md`
- **Instrucciones de Despliegue**: `INSTRUCCIONES_DESPLIEGUE.md`

## 💡 Próximos Pasos

1. **Probar la aplicación**: Inicia sesión con `superadmin` / `admin123`
2. **Crear un torneo**: Agrega equipos, canchas y usuarios
3. **Generar calendario**: Usa la generación automática Round Robin
4. **Probar roles**: Crea usuarios con diferentes roles
5. **Desplegar**: Sube a GitHub y despliega en Vercel

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión de torneos deportivos

---

**¡Disfruta gestionando tus torneos con TorneosPro!** 🏆⚽🏈
