# 📺 Guía de Integración de Anuncios Reales

## ✅ Anuncios Implementados

Se han agregado 3 tipos de anuncios en el panel del jugador:

### 1. 🖼️ Banner Ads (Google AdSense)
**Ubicación:** 
- Banner estático después de la sección de descargas
- Banner sticky fijo en la parte inferior de la pantalla

**Estado actual:** Placeholder visual listo para reemplazar

---

### 2. 🎥 Rewarded Video Ads
**Ubicación:** 
- Botón para desbloquear descarga de "Goleadores/Anotadores"
- Botón para desbloquear Dashboard completo en vivo

**Funcionamiento:**
- Usuario hace clic en "Ver video para desbloquear"
- Se muestra modal con countdown de 5 segundos
- Al terminar, se desbloquea el contenido
- El desbloqueo persiste durante la sesión

**Estado actual:** Sistema funcional con placeholder visual

---

### 3. 📍 Local Business Ads
**Ubicación:** Sección dedicada "Negocios Cerca de Ti"

**Contenido:**
- 4 negocios de ejemplo (clínica, pizza, gym, tienda deportiva)
- Diseño atractivo con gradientes y botones de acción
- Información de distancia y calificación

**Estado actual:** Placeholder visual listo para personalizar

---

## 🔧 Cómo Integrar Anuncios Reales

### **Opción 1: Google AdSense (Web)**

#### Paso 1: Crear cuenta en Google AdSense
1. Ve a https://www.google.com/adsense
2. Regístrate con tu cuenta de Google
3. Agrega tu sitio web
4. Espera aprobación (1-2 días)

#### Paso 2: Obtener código de anuncio
1. En AdSense, ve a "Anuncios" → "Por unidad de anuncio"
2. Crea nuevo bloque de anuncios
3. Copia el código del anuncio

#### Paso 3: Reemplazar Banner Ad

**Busca en `src/App.tsx`:**
```tsx
{/* Banner Ad - Google AdSense */}
<div className="card bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-dashed border-gray-600">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs text-gray-500 uppercase tracking-wider">Publicidad</span>
    <span className="text-xs text-gray-600">320x50</span>
  </div>
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center">
    <div className="text-3xl mb-2">👟</div>
    <h4 className="text-white font-bold text-lg mb-1">Nike Mercurial 2024</h4>
    <p className="text-blue-100 text-sm mb-3">Los botines de los campeones</p>
    <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors">
      Comprar Ahora →
    </button>
  </div>
  <p className="text-xs text-gray-600 mt-2 text-center">
    Anuncio patrocinado • Google AdSense
  </p>
</div>
```

**Reemplaza con:**
```tsx
{/* Google AdSense Banner */}
<div className="card">
  <ins 
    className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
    data-ad-slot="XXXXXXXXXX"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

#### Paso 4: Agregar script de AdSense en `index.html`

**Agrega en `<head>`:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

---

### **Opción 2: Google AdMob (App Móvil)**

Si conviertes tu app a Android con Capacitor:

#### Paso 1: Instalar plugin de AdMob
```bash
npm install @capacitor-community/admob
npx cap sync
```

#### Paso 2: Configurar AdMob
```typescript
import { AdMob } from '@capacitor-community/admob';

await AdMob.initialize({
  requestTrackingAuthorization: true,
});
```

#### Paso 3: Mostrar Banner
```typescript
await AdMob.showBanner({
  adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  adSize: 'BANNER',
  position: 'BOTTOM_CENTER',
});
```

#### Paso 4: Mostrar Rewarded Video
```typescript
const result = await AdMob.showRewardedAd({
  adId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
});

if (result.rewarded) {
  // Desbloquear contenido
  setUnlockedContent(prev => [...prev, 'scorers']);
}
```

---

### **Opción 3: Facebook Audience Network**

#### Paso 1: Crear cuenta en Facebook for Developers
1. Ve a https://developers.facebook.com
2. Crea una app
3. Configura Audience Network

#### Paso 2: Instalar SDK
```bash
npm install react-facebook-ads
```

#### Paso 3: Implementar Banner
```tsx
import { BannerAd } from 'react-facebook-ads';

<BannerAd
  placementId="XXXXXXXXXXXXX_XXXXXXXXXXXXX"
  adType="largeBanner"
/>
```

---

### **Opción 4: Unity Ads (Rewarded Videos)**

#### Paso 1: Crear cuenta en Unity Ads
1. Ve a https://unity.com/solutions/gaming-services/ads
2. Crea un proyecto
3. Obtén Game ID y Placement ID

#### Paso 2: Implementar Rewarded Video
```typescript
import UnityAds from 'unity-ads-web';

const showRewardedAd = async () => {
  const result = await UnityAds.show('rewardedVideo', {
    gameId: 'XXXXXXXX',
    placementId: 'rewardedVideo',
  });

  if (result === 'completed') {
    // Desbloquear contenido
    setUnlockedContent(prev => [...prev, 'dashboard']);
  }
};
```

---

## 💰 Configuración de Negocios Locales

### Opción A: Manual (Sin backend)

**Edita directamente en `src/App.tsx`:**

Busca la sección "Local Business Ads" y reemplaza los datos:

```tsx
{/* Negocio 1 */}
<div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <div className="text-4xl">🏥</div>
    <div className="flex-1">
      <h4 className="font-bold text-white">Nombre del Negocio</h4>
      <p className="text-sm text-gray-400 mt-1">Descripción del negocio</p>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span>📍 Distancia</span>
        <span>⭐ Calificación</span>
      </div>
      <a 
        href="https://www.negocio.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors block text-center"
      >
        Visitar Sitio →
      </a>
    </div>
  </div>
</div>
```

### Opción B: Dinámico (Con Supabase)

#### Paso 1: Crear tabla en Supabase

```sql
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

-- Insertar negocios de ejemplo
INSERT INTO local_businesses (name, description, icon, distance, rating, website_url, gradient_from, gradient_to, button_text) VALUES
('Clínica Deportiva García', 'Fisioterapia y prevención de lesiones', '🏥', '2 km', 4.8, 'https://clinicagarcia.com', 'orange-500', 'red-500', 'Agendar Cita →'),
('Pizza Sport', '20% descuento mostrando esta app', '🍕', '500 m', 4.6, 'https://pizzaspot.com', 'blue-500', 'purple-500', 'Ver Menú →');
```

#### Paso 2: Crear función para obtener negocios

```typescript
// En src/storageSupabase.ts
export async function getLocalBusinesses() {
  const { data, error } = await supabase
    .from('local_businesses')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(4);
  
  if (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
  
  return data || [];
}
```

#### Paso 3: Usar en PlayerPanel

```typescript
const [businesses, setBusinesses] = useState<any[]>([]);

useEffect(() => {
  const loadBusinesses = async () => {
    const data = await getLocalBusinesses();
    setBusinesses(data);
  };
  loadBusinesses();
}, []);
```

```tsx
{/* Local Business Ads */}
<div className="card">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-bold flex items-center gap-2">
      <span className="text-2xl">📍</span>
      Negocios Cerca de Ti
    </h3>
    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Patrocinado</span>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {businesses.map((business, index) => (
      <div key={business.id} className={`bg-gradient-to-br from-${business.gradient_from}/10 to-${business.gradient_to}/10 border border-${business.gradient_from}/30 rounded-lg p-4`}>
        <div className="flex items-start gap-3">
          <div className="text-4xl">{business.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-white">{business.name}</h4>
            <p className="text-sm text-gray-400 mt-1">{business.description}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>📍 {business.distance}</span>
              <span>⭐ {business.rating}</span>
            </div>
            <a 
              href={business.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 w-full bg-${business.gradient_from} hover:bg-${business.gradient_from}/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors block text-center`}
            >
              {business.button_text}
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>
  <p className="text-xs text-gray-500 mt-4 text-center">
    💼 ¿Tienes un negocio? <button className="text-blue-400 hover:underline">Anúnciate aquí</button>
  </p>
</div>
```

---

## 📊 Métricas y Analytics

### Google AdSense

1. Ve a tu panel de AdSense
2. Monitorea:
   - **Impresiones**: Cuántas veces se muestra el anuncio
   - **CTR (Click-Through Rate)**: Porcentaje de clics
   - **CPM**: Ingresos por cada 1,000 impresiones
   - **Ingresos totales**

### Google AdMob

1. Ve a Firebase Console
2. Monitorea:
   - **Impressions**
   - **eCPM** (effective CPM)
   - **Revenue**
   - **Fill Rate**

### Custom Analytics

Agrega tracking personalizado:

```typescript
// Función para trackear clicks en anuncios
const trackAdClick = (adType: string, adId: string) => {
  // Enviar a tu backend o analytics
  fetch('/api/track-ad-click', {
    method: 'POST',
    body: JSON.stringify({
      adType,
      adId,
      userId: user.id,
      timestamp: Date.now()
    })
  });
};

// Usar en botones de anuncios
<button onClick={() => trackAdClick('banner', 'nike_mercurial_2024')}>
  Comprar Ahora →
</button>
```

---

## 💡 Mejores Prácticas

### 1. No sobre-cargar con anuncios
- Máximo 2-3 banners por pantalla
- Espacio entre anuncios
- No interrumpir la experiencia del usuario

### 2. Optimizar ubicación
- Banners en zonas de "descanso visual"
- Rewarded videos solo para contenido premium
- Anuncios nativos integrados naturalmente

### 3. Respetar al usuario
- Botón de cerrar visible
- No autoplay de videos con sonido
- Indicador claro de "Publicidad"

### 4. Monitorear rendimiento
- Revisar métricas semanalmente
- A/B test de ubicaciones
- Optimizar según CPM

---

## 🎯 Próximos Pasos

1. **Crear cuenta en Google AdSense** (si es web)
2. **Obtener códigos de anuncio**
3. **Reemplazar placeholders** con código real
4. **Probar en desarrollo** con anuncios de prueba
5. **Publicar y monitorear** ingresos

---

## 📞 Soporte

- **Google AdSense**: https://support.google.com/adsense
- **Google AdMob**: https://support.google.com/admob
- **Facebook Audience Network**: https://developers.facebook.com/docs/audience-network

---

**¡Listo para monetizar!** 💰🚀
