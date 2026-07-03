#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// MIGRADOR DE CANCIONES — Firebase-PC (HTML antiguo) → Alabanza PWA (JSON)
// ─────────────────────────────────────────────────────────────────────────────
// Uso:
//   node migrar-canciones.js <carpeta-de-entrada> <archivo-salida.json>
//
// Ejemplo:
//   node migrar-canciones.js ./html/cantos canciones-migradas.json
//
// Qué hace:
//   1. Lee todos los .html dentro de la carpeta de cantos
//   2. Extrae el tempo (<div class="tempo">)
//   3. Extrae el contenido del <pre> con letra+acordes
//   4. Detecta las secciones por las etiquetas VERSO/CORO/PUENTE/FINAL/etc.
//   5. Deriva título y autor (iniciales) del nombre del archivo
//   6. Intenta detectar el tono original a partir del primer acorde válido
//   7. Genera un JSON listo para pegar en DEMO_SONGS o importar a Supabase
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const INPUT_DIR  = process.argv[2] || './html/cantos';
const OUTPUT_FILE = process.argv[3] || './canciones-migradas.json';

// ── Mapa de iniciales de autor → nombre completo ─────────────────────────────
// Edita este mapa con tus propios autores conocidos.
// Lo que no esté aquí, se deja tal cual (las iniciales) para que lo corrijas luego.
const AUTORES = {
  'mw':   'Marcos Witt',
  'dm':   'Danilo Montero',
  'jar':  'Jesus Adrian Romero',         // ajusta si es otro
  'mb':   'Marco Barrientos',
  'cf':   'Conquistando Frontera',
  'rt':   'Roberto Torres',
  'i':    'IBI',
  'az':   'Abel Zavala',
  'vn':   'Vino Nuevo',
  'h':    'Hillsong',
  'jm':   'Jesus Adrian Romero',
  'eeyev':'En Espiritu y En Verdad',
  'jg':   'Job Gonzalez',
  'sp':   'Su Presencia',
  'cz':   'Coalo Zamorano',
  'ec':   'Evan Craft',
  'l':    'Living',
  'jca':  'Juan Carlos Alvarado',
  'np':   'North Point',
  'uc':   'Un Corazon',
  'er':   'Eduardo Rios',
  'r':    'Rojo',
  'p':    'Popular',
  'mv':   'Marcos Vidal',
  'mg':   'Marcela Gandara',
  'mws':  'Michael W. Smith',
  'jys':  'Jonathan y Sara',
  'eyl':  'Emmanuel y Linda',
  'dz':   'Darlene Zchach',
  'sg':   'Steve Green',
  'da':   'David Alfano',
  'cd':   'Christine DCalrio',
  'adb':  'Alejandro del Bosque',
  'jdc':  'Josue del Cid'
};

// ── Tipos de sección reconocidos en el texto original ────────────────────────
const TIPO_MAP = {
  'VERSO':       'VERSO',
  'CORO':        'CORO',
  'PRECORO':     'PRE-CORO',
  'PRE-CORO':    'PRE-CORO',
  'PUENTE':      'PUENTE',
  'INTRO':       'INTRO',
  'INTERLUDIO':  'INTERLUDIO',
  'FINAL':       'FINAL',
  'OUTRO':       'OUTRO',
  'TAG':         'TAG',
  'SOLO':        'SOLO',
};

const NOTAS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

// ── Utilidades ────────────────────────────────────────────────────────────────
function decodeFilenameEntities(name) {
  // Los nombres de archivo traen cosas como al_que_me_ci#U00f1e-jar.html
  // donde #U00f1e representa "ñe" url-encoded a su manera
  return name.replace(/#U([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

function slugToTitle(slug) {
  return slug
    .split('_')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function parseFilename(filename) {
  const base = decodeFilenameEntities(path.basename(filename, '.html'));
  const lastDash = base.lastIndexOf('-');
  let slug = base, authorCode = '';
  if (lastDash > -1) {
    slug = base.substring(0, lastDash);
    authorCode = base.substring(lastDash + 1);
  }
  const titulo = slugToTitle(slug);
  const autor = AUTORES[authorCode.toLowerCase()] || authorCode.toUpperCase() || '';
  return { titulo, autor, authorCode };
}

function extractTempo(html) {
  const m = html.match(/<div class="tempo">\s*(\d+)\s*<\/div>/i);
  return m ? parseInt(m[1], 10) : 80;
}

function extractPreContent(html) {
  const m = html.match(/<pre>([\s\S]*?)<\/pre>/i);
  if (!m) return '';
  return m[1]
    .replace(/\r/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
    .trim();
}

// Detecta encabezados de sección tipo "VERSO 1:", "CORO:", "PUENTE 2:"
const SECTION_HEADER_RE = /^([A-ZÁÉÍÓÚÑ#-]+)\s*(\d*)\s*:?\s*$/;

function splitIntoSections(preText) {
  const lines = preText.split('\n');
  const sections = [];
  let current = null;
  let counters = {};

  for (let rawLine of lines) {
    const line = rawLine.replace(/\r/g, '');
    const trimmed = line.trim();
    const headerMatch = trimmed.match(SECTION_HEADER_RE);
    const upperWord = trimmed.replace(/[:\d\s]/g, '');
    const isKnownHeader = headerMatch && TIPO_MAP[upperWord.toUpperCase()];

    if (isKnownHeader) {
      // Cerrar sección anterior
      if (current) sections.push(current);
      const tipo = TIPO_MAP[upperWord.toUpperCase()];
      const numFromLabel = headerMatch[2] ? parseInt(headerMatch[2], 10) : null;
      counters[tipo] = counters[tipo] || 0;
      counters[tipo] += 1;
      const numero = numFromLabel || counters[tipo];
      current = { tipo, numero, contenido: '' };
    } else {
      if (!current) {
        // Contenido antes de cualquier encabezado → lo metemos en un INTRO implícito
        current = { tipo: 'VERSO', numero: 1, contenido: '' };
      }
      current.contenido += (current.contenido ? '\n' : '') + line;
    }
  }
  if (current) sections.push(current);

  // Limpiar contenido: quitar líneas en blanco al inicio/fin de cada sección
  return sections.map((s, i) => ({
    id: `sec_${i}_${Date.now()}`,
    tipo: s.tipo,
    numero: s.numero,
    contenido: s.contenido.replace(/^\n+|\n+$/g, ''),
  })).filter(s => s.contenido.trim().length > 0);
}

// Heurística simple: toma el primer acorde válido como tono aproximado
function guessKey(preText) {
  const match = preText.match(/\b([A-G][#b]?)(m|maj7|m7|sus[24]|add\d?|dim|aug|7)?\b/);
  if (!match) return 'C';
  let root = match[1];
  const isMinor = match[2] === 'm';
  return isMinor ? root + 'm' : root;
}

function buildEnsayoDefault() {
  return {
    youtubeId: '',
    pistas: [
      { tipo:'original',   label:'Original completo',          url:'', volumen:100 },
      { tipo:'aumentada',  label:'Mezcla aumentada (+voz guía)', url:'', volumen:100 },
      { tipo:'disminuida', label:'Mezcla disminuida (-voz guía)',url:'', volumen:100 },
      { tipo:'bajo',       label:'Solo bajo',                   url:'', volumen:100 },
      { tipo:'teclado',    label:'Solo teclado',                url:'', volumen:100 },
      { tipo:'guitarra',   label:'Solo guitarra',               url:'', volumen:100 },
      { tipo:'bateria',    label:'Solo batería',                url:'', volumen:100 },
    ],
    notas: '',
    bpmEnsayo: 80,
  };
}

// ── Proceso principal ────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ No se encontró la carpeta: ${INPUT_DIR}`);
    console.error(`   Uso: node migrar-canciones.js <carpeta-cantos> <salida.json>`);
    process.exit(1);
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.html'));
  console.log(`📂 Encontrados ${files.length} archivos .html en ${INPUT_DIR}\n`);

  const songs = [];
  const warnings = [];

  for (const file of files) {
    const fullPath = path.join(INPUT_DIR, file);
    const html = fs.readFileSync(fullPath, 'utf8');

    const { titulo, autor, authorCode } = parseFilename(file);
    const tempo = extractTempo(html);
    const preText = extractPreContent(html);

    if (!preText) {
      warnings.push(`⚠️  ${file}: no se encontró contenido <pre> — se omite`);
      continue;
    }

    const secciones = splitIntoSections(preText);
    if (secciones.length === 0) {
      warnings.push(`⚠️  ${file}: no se detectaron secciones (VERSO/CORO/...) — revisar a mano`);
    }

    const tono = guessKey(preText);

    if (!AUTORES[authorCode.toLowerCase()] && authorCode) {
      warnings.push(`ℹ️  ${file}: autor "${authorCode}" no está en el mapa AUTORES — quedó como "${autor}"`);
    }

    songs.push({
      id: `mig_${songs.length + 1}_${Date.now()}`,
      titulo,
      autor,
      tono,
      tempo,
      categoria: [],   // No disponible en el HTML original — asignar manualmente o por Firestore
      tags: [],
      secciones,
      ensayo: buildEnsayoDefault(),
      freeshowData: null,
      createdAt: Date.now(),
      _sourceFile: file, // referencia para auditoría, puedes borrar este campo después
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(songs, null, 2), 'utf8');

  console.log(`✅ Migradas ${songs.length} canciones → ${OUTPUT_FILE}\n`);
  if (warnings.length) {
    console.log(`── Avisos (${warnings.length}) ──`);
    warnings.forEach(w => console.log(w));
    console.log('');
  }
  console.log('Siguiente paso: revisa el JSON generado, especialmente:');
  console.log('  • Tono detectado automáticamente (puede no ser exacto)');
  console.log('  • Autor (si quedó como iniciales, edita el mapa AUTORES y vuelve a correr)');
  console.log('  • Categoría (queda vacía — asígnala manualmente o impórtala desde Firestore)');
}

main();
