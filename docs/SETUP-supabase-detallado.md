# 🎵 Alabanza PWA — Guía de Configuración

## Archivos entregados

| Archivo | Descripción |
|---|---|
| `alabanza-pwa.jsx` | Componente principal React (TODO incluido) |
| `sw.js` | Service Worker (modo offline) |
| `manifest.json` | Manifiesto PWA (instalable) |
| `supabase-schema.sql` | SQL para crear las tablas en Supabase |
| `supabase-sync.js` | Cliente Supabase con cola offline (referencia) |

---

## PASO 1 — Crear proyecto en Supabase

1. Ve a **https://supabase.com** → Crear cuenta gratuita
2. Clic en **"New Project"**
3. Pon nombre: `alabanza-pwa`, elige región (US East o EU West)
4. Espera ~2 minutos a que se inicialice

---

## PASO 2 — Crear las tablas

1. En tu proyecto Supabase → **SQL Editor** → **New Query**
2. Pega **todo** el contenido de `supabase-schema.sql`
3. Clic **Run** ✅

Esto crea:
- Tabla `canciones` con RLS activado
- Tabla `setlists` con RLS activado
- Triggers para `updated_at`
- Publicación para Realtime

---

## PASO 3 — Obtener tus credenciales

1. Supabase → **Settings** → **API**
2. Copia:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public** key (la key larga)

3. Abre `alabanza-pwa.jsx` y reemplaza al principio:

```js
const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";   // ← tu URL
const SUPABASE_KEY = "tu-anon-key-aqui";                   // ← tu key
```

---

## PASO 4 — Colocar los archivos en tu proyecto

### Estructura de carpetas recomendada (Vite + React)

```
mi-proyecto/
├── public/
│   ├── sw.js           ← Service Worker
│   ├── manifest.json   ← Manifiesto PWA
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   └── App.jsx         ← alabanza-pwa.jsx (renombrado)
├── index.html
└── package.json
```

### En tu `index.html` agrega en `<head>`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#6366f1" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

---

## PASO 5 — Crear los iconos

Necesitas generar iconos PNG en estos tamaños: 72, 96, 128, 144, 152, 192, 384, 512 px.

**Opción fácil**: Ve a https://realfavicongenerator.net o https://www.pwabuilder.com/imageGenerator, sube una imagen y descarga todos los tamaños.

Colócalos en `public/icons/`.

---

## PASO 6 — Instalar dependencias y ejecutar

```bash
npm create vite@latest mi-alabanza -- --template react
cd mi-alabanza
npm install
# Copia tus archivos
npm run dev
```

Para producción:
```bash
npm run build
# Sube la carpeta dist/ a Vercel, Netlify, o Firebase Hosting
```

---

## Cómo funciona el Sync

```
App abierta + ONLINE  →  guarda en Supabase inmediatamente
                       →  Realtime notifica a otros dispositivos

App abierta + OFFLINE →  guarda en localStorage
                       →  encola la operación en offline_queue
                       →  cuando vuelve internet: flush automático

App cerrada + vuelve internet → Service Worker Background Sync
                                notifica a la app que haga flush
```

### Indicadores visuales en la app:
- 🟢 Barra verde = online, todo sincronizado
- 🟡 Barra amarilla = cambios pendientes por sincronizar
- 🔴 Barra roja = sin conexión, modo local
- Toast = confirmación de cada operación

---

## Habilitar Realtime en Supabase

1. Supabase → **Database** → **Replication**
2. Activa las tablas `canciones` y `setlists`

Esto permite que si alguien del equipo agrega una canción, todos los dispositivos conectados la ven al instante.

---

## Usuarios / Equipo

La app tiene pantalla de login con:
- **Iniciar sesión** (usuarios existentes)
- **Crear cuenta** (registro con email/password)
- **Usar sin cuenta** (solo local, sin sync)

Puedes crear cuentas directamente desde la app. Supabase Auth maneja todo.

---

## Próximas funciones disponibles para agregar

- 🎸 Diagramas de acordes de guitarra (jtab)
- 🎹 Piano de acordes visual
- 📅 Calendario de servicios
- 👥 Roles por músico en setlist
- 📤 Compartir setlist por link
- 🎙️ Notas de voz por sección
