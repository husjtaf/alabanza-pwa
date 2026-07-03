# 🎵 Alabanza PWA — Guía Paso a Paso

Esta guía asume que **no sabes de páginas web**. Cada paso trae el comando exacto
para copiar y pegar. Vas a necesitar instalar dos programas gratis antes de empezar.

---

## PARTE 0 — Instalar lo necesario (una sola vez)

### 0.1 Instalar Node.js
Node.js es el programa que ejecuta JavaScript fuera del navegador (lo necesitas para
correr este proyecto en tu computadora).

1. Ve a **https://nodejs.org**
2. Descarga la versión **LTS** (botón grande, recomendada)
3. Instálalo como cualquier programa (Siguiente, Siguiente, Finalizar)
4. Para confirmar que quedó instalado, abre una terminal y escribe:
   ```bash
   node -v
   ```
   Debe mostrarte algo como `v20.x.x` o más nuevo.

   **¿Cómo abro una terminal?**
   - Windows: busca "PowerShell" o "cmd" en el menú inicio
   - Mac: busca "Terminal" en Spotlight (Cmd+Espacio)

### 0.2 Instalar un editor de código (opcional pero recomendado)
Descarga **Visual Studio Code** (gratis): https://code.visualstudio.com
Te sirve para abrir y mirar archivos, aunque no necesitas escribir código.

---

## PARTE 1 — Descomprimir el proyecto

1. Descarga el archivo `alabanza-app.zip` que te compartí
2. Descomprímelo en una carpeta fácil de encontrar, por ejemplo:
   - Windows: `C:\Users\TuNombre\alabanza-app`
   - Mac: `/Users/TuNombre/alabanza-app`
3. Abre la terminal y navega a esa carpeta:
   ```bash
   cd ruta/a/alabanza-app
   ```
   (En Windows puedes simplemente escribir `cd ` y luego arrastrar la carpeta a la terminal)

---

## PARTE 2 — Instalar las dependencias del proyecto

Dentro de la carpeta del proyecto, ejecuta:

```bash
npm install
```

Esto descarga las piezas necesarias (React, Vite). Tarda 1-2 minutos. Verás una
carpeta nueva llamada `node_modules` — es normal, ahí van todas las piezas.

---

## PARTE 3 — Probar que funciona en tu computadora

```bash
npm run dev
```

Esto te dará un mensaje como:
```
  ➜  Local:   http://localhost:5173/
```

Abre esa dirección en tu navegador (Chrome, Edge, etc.) y deberías ver la app
funcionando con canciones de ejemplo. **Esto es solo para pruebas en tu compu** —
todavía no está en internet ni tiene tus canciones reales.

Para detener el servidor de pruebas, presiona `Ctrl + C` en la terminal.

---

## PARTE 4 — Migrar tus 143 canciones existentes

Tu proyecto viejo tenía las canciones como archivos `.html` individuales. Te incluí
un script que las convierte automáticamente al nuevo formato.

### 4.1 Copia tus archivos de canciones
Copia la carpeta `html/cantos` de tu proyecto **Firebase-PC** original y pégala
dentro de la carpeta `migracion/` de este proyecto nuevo, por ejemplo:
```
alabanza-app/migracion/cantos-originales/   ← pega aquí todos los .html
```

### 4.2 Corre el script de migración
```bash
node migracion/migrar-canciones.js migracion/cantos-originales migracion/mis-canciones.json
```

Verás un resumen como:
```
📂 Encontrados 143 archivos .html
✅ Migradas 143 canciones → migracion/mis-canciones.json
── Avisos (37) ──
ℹ️  archivo.html: autor "xyz" no está en el mapa AUTORES...
```

### 4.3 Revisa los avisos (opcional pero recomendado)
El script no puede saber el nombre completo de cada autor si solo tenía iniciales
en el nombre del archivo (ej: `mw` = Marcos Witt). Abre el archivo:
```
migracion/migrar-canciones.js
```
Busca la sección `AUTORES` cerca del inicio y agrega los que falten:
```js
const AUTORES = {
  'mw': 'Marcos Witt',
  'tuiniciales': 'Nombre Completo Aquí',   // ← agrega los tuyos
};
```
Luego vuelve a correr el comando del paso 4.2.

### 4.4 ⚠️ Importante: revisa el tono y la categoría
El script **no puede leer tu base de datos Firestore** (donde tenías guardado el
tono original y la categoría de cada canción), así que:
- El **tono** lo detecta automáticamente analizando el primer acorde — revísalo,
  puede no ser 100% exacto
- La **categoría** queda vacía — tendrás que asignarla manualmente desde la app
  (Editar canción → Categorías) o decirme y te ayudo a exportarla de Firestore

### 4.5 Cargar las canciones migradas en la app
Abre el archivo `migracion/mis-canciones.json` con VS Code, copia todo su contenido,
y pégalo dentro de `src/App.jsx` reemplazando la lista `DEMO_SONGS` (búscala con
Ctrl+F, está cerca de la línea 5). Guarda el archivo.

*(Si prefieres que esto quede automático sin copiar/pegar a mano, dímelo y te
preparo una versión que carga el JSON directamente.)*

---

## PARTE 5 — Conectar Supabase (guarda tus datos en la nube)

Sigue la guía completa en **`docs/supabase-schema.sql`** y el documento `SETUP.md`
que ya tenías. En resumen:

1. Crea cuenta gratis en https://supabase.com
2. Crea un proyecto nuevo
3. Ve a **SQL Editor** → pega el contenido de `docs/supabase-schema.sql` → Run
4. Ve a **Settings → API** → copia tu `Project URL` y `anon public key`
5. Abre `src/App.jsx`, busca (Ctrl+F) `SUPABASE_URL` cerca de la línea 1780 y
   reemplaza con tus datos:
   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_KEY = "tu-anon-key-aqui";
   ```

---

## PARTE 6 — Generar los íconos de la app

1. Ve a **https://www.pwabuilder.com/imageGenerator**
2. Sube tu logo (el de "Dunamis Adoración" que ya tenías)
3. Descarga el paquete de íconos generado
4. Copia los archivos PNG dentro de `public/icons/` con estos nombres exactos:
   `icon-72.png`, `icon-96.png`, `icon-128.png`, `icon-144.png`, `icon-152.png`,
   `icon-192.png`, `icon-384.png`, `icon-512.png`

---

## PARTE 7 — Publicar la app en internet (Hosting)

Como ya usabas **Firebase Hosting**, la forma más simple es seguir usándolo:

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --only hosting
```
*(Esto asume que ya tienes el proyecto Firebase configurado de antes — si necesitas
que te explique el `firebase init` desde cero, dímelo.)*

**Alternativa más simple (recomendada si quieres evitar configurar Firebase Hosting):**
Usa **Vercel** o **Netlify** (gratis, sin configuración):
1. Sube este proyecto a GitHub
2. Ve a https://vercel.com → "Import Project" → conecta tu GitHub → Deploy
3. Listo, te da una URL pública en 2 minutos

---

## Resumen de comandos que vas a usar más seguido

| Quiero... | Comando |
|---|---|
| Probar la app en mi computadora | `npm run dev` |
| Migrar canciones nuevas | `node migracion/migrar-canciones.js carpeta-entrada salida.json` |
| Generar la versión final para publicar | `npm run build` |
| Publicar en Firebase | `firebase deploy --only hosting` |

---

## ¿Algo no funciona?

Si ves un error en la terminal, cópialo y pégamelo — lo resolvemos juntos. Lo más
común suele ser: olvidar el `npm install`, estar en la carpeta equivocada al correr
un comando, o un dato de Supabase mal copiado.
