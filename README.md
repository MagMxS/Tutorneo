# TorneosPro - Gestión de Torneos Deportivos

Aplicación web completa para la gestión de torneos deportivos de Fútbol y Tochito Bandera.

## 🚀 Despliegue en Vercel

### Configuración Requerida

1. **Framework Preset:** `Vite`
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Install Command:** `npm install`
5. **Root Directory:** `./`

### Archivos Importantes

- `vercel.json` - Configuración de Vercel (rewrites para SPA)
- `vite.config.js` - Configuración de Vite
- `index.html` - Punto de entrada de la aplicación

### Pasos para Desplegar

1. Sube el código a GitHub
2. Conecta tu repositorio con Vercel
3. Vercel detectará automáticamente la configuración
4. El deployment se completará en 2-3 minutos

## 📦 Estructura del Proyecto

```
tutorneo/
├── index.html              # Punto de entrada HTML
├── package.json            # Dependencias y scripts
├── vite.config.js          # Configuración de Vite
├── vercel.json             # Configuración de Vercel
├── tsconfig.json           # Configuración de TypeScript
├── src/
│   ├── main.tsx           # Punto de entrada React
│   ├── App.tsx            # Componente principal
│   └── index.css          # Estilos globales
└── dist/                   # Archivos de producción (generado)
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Type checking
npm run typecheck
```

## 🔧 Solución de Problemas

### Error 404 en Vercel

Si ves un error 404 después del despliegue:

1. Verifica que `vercel.json` existe en la raíz
2. Confirma que `index.html` está en la raíz
3. Verifica que el Build Command es `npm run build`
4. Verifica que Output Directory es `dist`
5. Realiza un redeploy

### El sitio no carga

1. Abre la consola del navegador (F12)
2. Revisa si hay errores de JavaScript
3. Verifica que todos los archivos están en la raíz del repositorio
4. Asegúrate de que `main.tsx` existe en `src/`

## 📝 Notas

- La aplicación usa React 18 con TypeScript
- Estilos con Tailwind CSS
- Iconos con Lucide React
- Almacenamiento local con localStorage
- Configurado para despliegue en Vercel

## 🌐 URL de Producción

Después del despliegue, tu aplicación estará disponible en:
`https://tu-proyecto.vercel.app`

---

**Desarrollado con ❤️ para la gestión de torneos deportivos**
