import { useState, useEffect, useRef, useCallback } from "react";

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_SONGS = [
  {
    id: "1",
    titulo: "Alabadle",
    autor: "Marcos Witt",
    tono: "G",
    tempo: 92,
    categoria: ["Alabanza"],
    tags: [],
    secciones: [
      { id: "v1", tipo: "VERSO", numero: 1, contenido: "G                C/G   G\nNos hemos congregado    en este día\n             C\npara darle gloria\nD/F#  G                  G\nLa    música tocamos las voces elevamos\n             C\npara darle gloria" },
      { id: "c1", tipo: "CORO", numero: 1, contenido: "        G9sus4 ─ G         G9sus4 ─ G\nAlabadle,          alabadle\n       D\nSolo a El.\n        G9sus4 ─ G          G9sus4 ─ G\nAdoradle,           adoradle\n             D\nÉl ha sido fiel." },
      { id: "v2", tipo: "VERSO", numero: 2, contenido: "D/F#  G                C/G\n  Las manos levantadas   corazones hacia\n               C\nel cielo esperando\nD/F#   G\n  Sin  duda lo sabemos\n    G                             C\nque su presencia se está manifestando" },
      { id: "c2", tipo: "CORO", numero: 2, contenido: "        G9sus4 ─ G         G9sus4 ─ G\nAlabadle,          alabadle\n       D\nSolo a El.\n        G9sus4 ─ G          G9sus4 ─ G\nAdoradle,           adoradle\n             D\nÉl ha sido fiel." },
      { id: "f1", tipo: "FINAL", numero: 1, contenido: "         A9sus4 ─ A       E7sus4 ─ Eadd2\nAlabadle,          adorad\n           Dadd9   | A\na Jesús el Rey" },
    ],
    ensayo: {
      youtubeId: "",
      pistas: [
        { tipo: "original", label: "Original completo", url: "", volumen: 100 },
        { tipo: "aumentada", label: "Mezcla aumentada (+voz guía)", url: "", volumen: 100 },
        { tipo: "disminuida", label: "Mezcla disminuida (-voz guía)", url: "", volumen: 100 },
        { tipo: "bajo", label: "Solo bajo", url: "", volumen: 100 },
        { tipo: "teclado", label: "Solo teclado", url: "", volumen: 100 },
        { tipo: "guitarra", label: "Solo guitarra", url: "", volumen: 100 },
        { tipo: "bateria", label: "Solo batería", url: "", volumen: 100 },
      ],
      notas: "",
      bpmEnsayo: 80,
    },
    freeshowData: null,
    createdAt: Date.now(),
  },
  {
    id: "2",
    titulo: "Al estar ante ti",
    autor: "Jesus Adrian Romero",
    tono: "D",
    tempo: 75,
    categoria: ["Adoracion"],
    tags: [],
    secciones: [
      { id: "v1", tipo: "VERSO", numero: 1, contenido: "D                    A\nAl estar ante ti en tu presencia\n    Bm             G\ncaigo de rodillas, te contemplo\n    D                  A\nEres el Señor de cielo y tierra\n   Bm          G    A\nmi Rey y Salvador" },
      { id: "c1", tipo: "CORO", numero: 1, contenido: "    G           D\nSanto, Santo, Santo\n    A             Bm\nSanto es el Señor\n    G           D\nSanto, Santo, Santo\n    A          D\nes digno de honor" },
    ],
    ensayo: {
      youtubeId: "",
      pistas: [
        { tipo: "original", label: "Original completo", url: "", volumen: 100 },
        { tipo: "aumentada", label: "Mezcla aumentada (+voz guía)", url: "", volumen: 100 },
        { tipo: "disminuida", label: "Mezcla disminuida (-voz guía)", url: "", volumen: 100 },
        { tipo: "bajo", label: "Solo bajo", url: "", volumen: 100 },
        { tipo: "teclado", label: "Solo teclado", url: "", volumen: 100 },
        { tipo: "guitarra", label: "Solo guitarra", url: "", volumen: 100 },
        { tipo: "bateria", label: "Solo batería", url: "", volumen: 100 },
      ],
      notas: "",
      bpmEnsayo: 65,
    },
    freeshowData: null,
    createdAt: Date.now(),
  },
];

const DEMO_SETLISTS = [
  {
    id: "sl1",
    nombre: "Domingo 29 Jun",
    tipo: "Domingo",
    fecha: "2025-06-29",
    cantos: [{ cantoId: "1", tonoCustom: "G" }, { cantoId: "2", tonoCustom: "D" }],
    createdAt: Date.now(),
  },
];

const CATEGORIAS = ["Adoracion","Alabanza","Confesion","Evangelismo","Servicio","Unidad","Oracion","Fortaleza","Perdon","Accion de Gracias","Semana Santa","Navidad","Himnos"];
const TIPOS_SECCION = ["INTRO","VERSO","PRE-CORO","CORO","PUENTE","INTERLUDIO","FINAL","OUTRO","TAG","SOLO"];
const NOTAS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const INSTRUMENTOS_PISTA = [
  { tipo:"original", label:"Original completo", icon:"🎵" },
  { tipo:"aumentada", label:"Mezcla aumentada", icon:"⬆️" },
  { tipo:"disminuida", label:"Mezcla disminuida", icon:"⬇️" },
  { tipo:"bajo", label:"Solo bajo", icon:"🎸" },
  { tipo:"teclado", label:"Solo teclado", icon:"🎹" },
  { tipo:"guitarra", label:"Solo guitarra", icon:"🎸" },
  { tipo:"bateria", label:"Solo batería", icon:"🥁" },
  { tipo:"voz", label:"Solo voz", icon:"🎤" },
  { tipo:"coros", label:"Solo coros", icon:"🎶" },
];

// ─── THEME ────────────────────────────────────────────────────────────────────
// Tokens: dark (default) y light
const THEMES = {
  dark: {
    bg:"#0d1117", surface:"#161b22", surface2:"#0d1117", border:"#21262d",
    border2:"#30363d", text:"#e6edf3", textSub:"#7d8590", textMid:"#c9d1d9",
    accent:"#0ea5e9", accentSub:"#38bdf8", navBg:"linear-gradient(180deg,#161b22,#0d1117)",
    inputBg:"#21262d", pre:"#0d1117", preText:"#c9d1d9",
  },
  light: {
    bg:"#f0f6ff", surface:"#ffffff", surface2:"#f0f6ff", border:"#d0d7de",
    border2:"#b0bbc6", text:"#1f2328", textSub:"#636c76", textMid:"#24292f",
    accent:"#0284c7", accentSub:"#0ea5e9", navBg:"linear-gradient(180deg,#ffffff,#f0f6ff)",
    inputBg:"#f6f8fa", pre:"#f6f8fa", preText:"#24292f",
  },
};
// Theme is passed as prop; hooks live in App
let _theme = THEMES.dark; // fallback for static S object (overridden dynamically)

const ROLES_MUSICOS = ["Líder","Voz principal","Coros","Guitarra eléctrica","Guitarra acústica","Bajo","Teclado/Piano","Batería","Percusión","Violín","Flauta","Trompeta","Técnico de sonido","Proyección"];

// ─── GUITAR CHORD DATABASE ────────────────────────────────────────────────────
// Formato: [cuerda6, cuerda5, cuerda4, cuerda3, cuerda2, cuerda1]
// -1 = no tocar, 0 = al aire, 1-12 = traste
const CHORD_DB = {
  // Mayores
  "C":  { frets:[null,3,2,0,1,0], fingers:[null,3,2,0,1,0], barre:0, baseFret:1 },
  "D":  { frets:[null,null,0,2,3,2], fingers:[null,null,0,1,3,2], barre:0, baseFret:1 },
  "E":  { frets:[0,2,2,1,0,0], fingers:[0,2,3,1,0,0], barre:0, baseFret:1 },
  "F":  { frets:[1,1,2,3,3,1], fingers:[1,1,2,4,3,1], barre:1, baseFret:1 },
  "G":  { frets:[3,2,0,0,0,3], fingers:[2,1,0,0,0,3], barre:0, baseFret:1 },
  "A":  { frets:[null,0,2,2,2,0], fingers:[null,0,1,2,3,0], barre:0, baseFret:1 },
  "B":  { frets:[null,2,4,4,4,2], fingers:[null,1,2,3,4,1], barre:2, baseFret:2 },
  // Menores
  "Cm": { frets:[null,3,5,5,4,3], fingers:[null,1,3,4,2,1], barre:3, baseFret:3 },
  "Dm": { frets:[null,null,0,2,3,1], fingers:[null,null,0,2,3,1], barre:0, baseFret:1 },
  "Em": { frets:[0,2,2,0,0,0], fingers:[0,2,3,0,0,0], barre:0, baseFret:1 },
  "Fm": { frets:[1,1,3,3,2,1], fingers:[1,1,3,4,2,1], barre:1, baseFret:1 },
  "Gm": { frets:[3,5,5,3,3,3], fingers:[1,3,4,1,1,1], barre:3, baseFret:3 },
  "Am": { frets:[null,0,2,2,1,0], fingers:[null,0,2,3,1,0], barre:0, baseFret:1 },
  "Bm": { frets:[null,2,4,4,3,2], fingers:[null,1,3,4,2,1], barre:2, baseFret:2 },
  // Séptimas
  "C7": { frets:[null,3,2,3,1,0], fingers:[null,3,2,4,1,0], barre:0, baseFret:1 },
  "D7": { frets:[null,null,0,2,1,2], fingers:[null,null,0,2,1,3], barre:0, baseFret:1 },
  "E7": { frets:[0,2,0,1,0,0], fingers:[0,2,0,1,0,0], barre:0, baseFret:1 },
  "G7": { frets:[3,2,0,0,0,1], fingers:[3,2,0,0,0,1], barre:0, baseFret:1 },
  "A7": { frets:[null,0,2,0,2,0], fingers:[null,0,2,0,3,0], barre:0, baseFret:1 },
  "Am7":{ frets:[null,0,2,0,1,0], fingers:[null,0,2,0,1,0], barre:0, baseFret:1 },
  "Em7":{ frets:[0,2,2,0,3,0], fingers:[0,2,3,0,4,0], barre:0, baseFret:1 },
  "Dm7":{ frets:[null,null,0,2,1,1], fingers:[null,null,0,2,1,1], barre:1, baseFret:1 },
  // Sus y add
  "Gsus4":{ frets:[3,3,0,0,1,3], fingers:[2,3,0,0,1,4], barre:0, baseFret:1 },
  "Asus2":{ frets:[null,0,2,2,0,0], fingers:[null,0,1,2,0,0], barre:0, baseFret:1 },
  "Asus4":{ frets:[null,0,2,2,3,0], fingers:[null,0,1,2,3,0], barre:0, baseFret:1 },
  "Dsus2":{ frets:[null,null,0,2,3,0], fingers:[null,null,0,1,2,0], barre:0, baseFret:1 },
  "Dsus4":{ frets:[null,null,0,2,3,3], fingers:[null,null,0,1,2,3], barre:0, baseFret:1 },
  "Esus4":{ frets:[0,2,2,2,0,0], fingers:[0,1,2,3,0,0], barre:0, baseFret:1 },
  "Cadd9":{ frets:[null,3,2,0,3,0], fingers:[null,3,2,0,4,0], barre:0, baseFret:1 },
  "Dadd9":{ frets:[null,null,0,2,3,0], fingers:[null,null,0,1,2,0], barre:0, baseFret:1 },
};

// ─── GUITAR CHORD DIAGRAM ─────────────────────────────────────────────────────
function GuitarChordDiagram({ chordName, theme }) {
  const T = theme || THEMES.dark;
  const chord = CHORD_DB[chordName];

  if (!chord) {
    return (
      <div style={{ textAlign:"center", padding:"8px" }}>
        <div style={{ fontSize:"12px", color:T.textSub }}>{chordName}</div>
        <div style={{ fontSize:"10px", color:T.textSub, marginTop:"4px" }}>diagrama no disponible</div>
      </div>
    );
  }

  const W = 72, H = 88, PAD = 14;
  const stringSpacing = (W - PAD*2) / 5;
  const fretSpacing = (H - PAD*2 - 12) / 4;
  const numFrets = 5;
  const strings = 6;

  return (
    <div style={{ display:"inline-block", textAlign:"center" }}>
      <div style={{ fontSize:"12px", fontWeight:700, color:T.text, marginBottom:"2px" }}>{chordName}</div>
      <svg width={W} height={H} style={{ display:"block", margin:"0 auto" }}>
        {/* Traste base */}
        {chord.baseFret > 1 && (
          <text x={PAD-8} y={PAD+fretSpacing/2+4} fontSize="9" fill={T.textSub} textAnchor="end">{chord.baseFret}</text>
        )}
        {/* Línea superior (cejilla si es traste 1) */}
        <line x1={PAD} y1={PAD} x2={PAD + stringSpacing*5} y2={PAD}
          stroke={chord.baseFret === 1 ? T.text : T.border2} strokeWidth={chord.baseFret === 1 ? 4 : 1.5}/>
        {/* Trastes */}
        {[...Array(numFrets)].map((_,i)=>(
          <line key={i} x1={PAD} y1={PAD + fretSpacing*(i+1)} x2={PAD + stringSpacing*5} y2={PAD + fretSpacing*(i+1)}
            stroke={T.border} strokeWidth={1}/>
        ))}
        {/* Cuerdas */}
        {[...Array(strings)].map((_,i)=>(
          <line key={i} x1={PAD+stringSpacing*i} y1={PAD} x2={PAD+stringSpacing*i} y2={PAD+fretSpacing*4}
            stroke={T.border2} strokeWidth={1}/>
        ))}
        {/* Cejilla */}
        {chord.barre > 0 && (
          <rect x={PAD} y={PAD + fretSpacing*(chord.barre-0.5)} width={stringSpacing*5} height={fretSpacing*0.7}
            rx={4} fill={T.accent} opacity={0.85}/>
        )}
        {/* Posiciones de dedos */}
        {chord.frets.map((fret, strIdx) => {
          const x = PAD + stringSpacing * (5 - strIdx);
          if (fret === null) {
            // X = no tocar
            return <text key={strIdx} x={x} y={PAD-5} fontSize="10" fill="#ef4444" textAnchor="middle">✕</text>;
          }
          if (fret === 0) {
            // O = al aire
            return <circle key={strIdx} cx={x} cy={PAD-5} r={4} fill="none" stroke={T.accent} strokeWidth={1.5}/>;
          }
          const y = PAD + fretSpacing*(fret - chord.baseFret) + fretSpacing/2;
          return <circle key={strIdx} cx={x} cy={y} r={6} fill={T.accent}/>;
        })}
      </svg>
    </div>
  );
}

// ─── PIANO CHORD DIAGRAM ──────────────────────────────────────────────────────
// Mapa de notas a teclas del piano (octava central, relativo a C)
const PIANO_NOTES = {
  "C":  [0],
  "C#": [1], "Db":[1],
  "D":  [2],
  "D#": [3], "Eb":[3],
  "E":  [4],
  "F":  [5],
  "F#": [6], "Gb":[6],
  "G":  [7],
  "G#": [8], "Ab":[8],
  "A":  [9],
  "A#": [10],"Bb":[10],
  "B":  [11],
};

// Intervalos de acordes (en semitonos desde la raíz)
const CHORD_INTERVALS = {
  "":    [0,4,7],        // Mayor
  "m":   [0,3,7],        // Menor
  "7":   [0,4,7,10],     // Dom7
  "maj7":[0,4,7,11],     // Maj7
  "m7":  [0,3,7,10],     // m7
  "sus2":[0,2,7],        // sus2
  "sus4":[0,5,7],        // sus4
  "add9":[0,4,7,14],     // add9
  "dim": [0,3,6],        // disminuido
  "aug": [0,4,8],        // aumentado
  "9":   [0,4,7,10,14],  // 9
};

function parseChordName(name) {
  const match = name.match(/^([A-G][#b]?)(m(?:aj)?7?|7|sus[24]|add9|dim|aug|9|m)?/);
  if (!match) return null;
  const root = match[1];
  const quality = match[2] || "";
  return { root, quality };
}

function PianoChordDiagram({ chordName, theme }) {
  const T = theme || THEMES.dark;
  const parsed = parseChordName(chordName);
  if (!parsed) return null;

  const rootIdx = PIANO_NOTES[parsed.root]?.[0];
  if (rootIdx === undefined) return null;

  const intervals = CHORD_INTERVALS[parsed.quality] || CHORD_INTERVALS[""];
  const noteIndices = intervals.map(i => (rootIdx + i) % 12);

  // Piano: 2 octavas, 15 teclas blancas, 10 negras
  const whites = [0,2,4,5,7,9,11,12,14,16,17,19,21,23]; // índices en semitono (0=C)
  const blacks = [1,3,null,6,8,10,null,13,15,null,18,20,22,null]; // null = sin tecla negra

  const KW = 22, KH = 70, KB_H = 44, KB_W = 14;
  const totalW = whites.length * KW;

  return (
    <div style={{ display:"inline-block", textAlign:"center" }}>
      <div style={{ fontSize:"12px", fontWeight:700, color:T.text, marginBottom:"4px" }}>{chordName}</div>
      <svg width={totalW} height={KH+8} style={{ display:"block", margin:"0 auto", borderRadius:"4px", overflow:"visible" }}>
        {/* Teclas blancas */}
        {whites.map((semitone, i) => {
          const note = semitone % 12;
          const active = noteIndices.includes(note);
          return (
            <rect key={i} x={i*KW+1} y={0} width={KW-2} height={KH}
              rx={2} fill={active ? T.accent : T.surface}
              stroke={T.border2} strokeWidth={1}/>
          );
        })}
        {/* Teclas negras */}
        {whites.map((semitone, i) => {
          const blackNote = semitone + 1;
          if ([5,12,17,24].includes(semitone) || i === whites.length-1) return null; // No hay negra después de E, B
          if ([4,11,16,23].includes(semitone)) return null;
          const note = blackNote % 12;
          const active = noteIndices.includes(note);
          return (
            <rect key={`b${i}`} x={i*KW+KW-KB_W/2} y={0} width={KB_W} height={KB_H}
              rx={2} fill={active ? T.accent : T.text}
              stroke={T.bg} strokeWidth={1}/>
          );
        })}
        {/* Etiqueta de notas */}
        {whites.map((semitone, i) => {
          const note = semitone % 12;
          const active = noteIndices.includes(note);
          if (!active) return null;
          return (
            <text key={`l${i}`} x={i*KW+KW/2} y={KH-6} fontSize="9" fontWeight="700"
              fill={active ? "#fff" : T.textSub} textAnchor="middle">{parsed.root}</text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── CHORD PANEL (Guitar + Piano) ─────────────────────────────────────────────
function ChordPanel({ text, semitones, theme }) {
  const T = theme || THEMES.dark;
  const [view, setView] = useState("guitar"); // guitar | piano

  // Extraer acordes únicos del texto
  const allText = transposeText(text, semitones);
  const raw = allText.match(/\b([A-G][#b]?(?:maj7?|m(?:aj)?7?|sus[24]|add9|dim|aug|9)?)\b/g) || [];
  const chords = [...new Set(raw)].slice(0, 12);

  if (chords.length === 0) return (
    <div style={{ padding:"12px", color:T.textSub, fontSize:"12px", textAlign:"center" }}>
      No se detectaron acordes en esta sección.
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:"4px", marginBottom:"10px", background:T.surface2, borderRadius:"8px", padding:"3px" }}>
        {[["guitar","🎸 Guitarra"],["piano","🎹 Piano"]].map(([k,l])=>(
          <button key={k} style={{ flex:1, padding:"6px", border:"none", borderRadius:"6px", cursor:"pointer", fontSize:"12px", fontWeight:600,
            background:view===k?T.accent:"transparent", color:view===k?"#fff":T.textSub }}
            onClick={()=>setView(k)}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", justifyContent:"center" }}>
        {chords.map(c => (
          <div key={c} style={{ background:T.surface2, borderRadius:"8px", padding:"8px", border:`1px solid ${T.border}` }}>
            {view === "guitar"
              ? <GuitarChordDiagram chordName={c} theme={T}/>
              : <PianoChordDiagram chordName={c} theme={T}/>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION SEQUENCE BAR ─────────────────────────────────────────────────────
function SectionSequenceBar({ secciones, onJump, theme }) {
  const T = theme || THEMES.dark;
  const ref = useRef(null);
  const [active, setActive] = useState(null);

  function handleJump(idx) {
    setActive(idx);
    onJump?.(idx);
    // Smooth scroll to section card
    const el = document.getElementById(`sec-card-${idx}`);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  return (
    <div ref={ref} style={{ overflowX:"auto", paddingBottom:"4px", marginBottom:"8px",
      scrollbarWidth:"thin", scrollbarColor:`${T.accent} ${T.surface2}` }}>
      <div style={{ display:"flex", gap:"4px", alignItems:"center", minWidth:"max-content", padding:"2px 0" }}>
        {secciones.map((sec, idx) => {
          const color = S.tipoColor[sec.tipo] || T.accent;
          const isActive = active === idx;
          return (
            <button key={sec.id || idx}
              onClick={() => handleJump(idx)}
              style={{
                padding:"4px 10px", border:`1px solid ${color}55`, borderRadius:"20px",
                cursor:"pointer", fontSize:"11px", fontWeight:700,
                background: isActive ? color : color+"22",
                color: isActive ? "#fff" : color,
                whiteSpace:"nowrap", transition:"all 0.15s",
                flexShrink: 0,
              }}>
              {sec.tipo[0]}{sec.numero}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── CALENDARIO ───────────────────────────────────────────────────────────────
function CalendarioPanel({ setlists, songs, onSelectSetlist, onNewSetlist, theme }) {
  const T = theme || THEMES.dark;
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based

  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const DAYS   = ["D","L","M","M","J","V","S"];

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat([...Array(daysInMonth)].map((_,i)=>i+1));
  while (cells.length % 7 !== 0) cells.push(null);

  // Map setlists by date "YYYY-MM-DD"
  const byDate = {};
  setlists.forEach(sl => {
    if (!sl.fecha) return;
    if (!byDate[sl.fecha]) byDate[sl.fecha] = [];
    byDate[sl.fecha].push(sl);
  });

  function pad(n) { return String(n).padStart(2,"0"); }
  function dateKey(d) { return `${year}-${pad(month+1)}-${pad(d)}`; }
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;

  return (
    <div>
      {/* Header navegación */}
      <div style={{ ...S.between, marginBottom:"16px" }}>
        <h2 style={{ ...S.h1, color:T.text }}>Calendario</h2>
        <button style={{ ...S.btn("primary",true) }} onClick={onNewSetlist}>
          <Icon name="plus" size={14}/> Nuevo
        </button>
      </div>

      <div style={{ background:T.surface, borderRadius:"12px", padding:"14px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>
        {/* Mes / año nav */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
          <button style={{ background:T.surface2, border:`1px solid ${T.border}`, color:T.text, borderRadius:"8px", padding:"6px 12px", cursor:"pointer", fontWeight:700 }}
            onClick={()=>{ if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }}>‹</button>
          <span style={{ fontWeight:800, fontSize:"16px", color:T.text }}>{MONTHS[month]} {year}</span>
          <button style={{ background:T.surface2, border:`1px solid ${T.border}`, color:T.text, borderRadius:"8px", padding:"6px 12px", cursor:"pointer", fontWeight:700 }}
            onClick={()=>{ if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }}>›</button>
        </div>

        {/* Cabecera días */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px", marginBottom:"4px" }}>
          {DAYS.map((d,i)=>(
            <div key={i} style={{ textAlign:"center", fontSize:"11px", fontWeight:700, color:i===0?T.accent:T.textSub, padding:"4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Grid días */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i}/>;
            const key = dateKey(day);
            const hasSl = byDate[key]?.length > 0;
            const isToday = key === todayKey;
            return (
              <div key={i}
                onClick={() => hasSl && onSelectSetlist(byDate[key][0])}
                style={{ minHeight:"36px", borderRadius:"8px", padding:"3px", position:"relative",
                  background: isToday ? T.accent+"33" : hasSl ? T.accent+"15" : "transparent",
                  border: isToday ? `1.5px solid ${T.accent}` : hasSl ? `1px solid ${T.accent}44` : `1px solid transparent`,
                  cursor: hasSl ? "pointer" : "default",
                  transition:"background 0.15s",
                }}>
                <div style={{ fontSize:"12px", fontWeight: isToday||hasSl ? 800 : 400, color: isToday ? T.accent : T.text, textAlign:"center" }}>{day}</div>
                {hasSl && byDate[key].map((sl,si)=>(
                  <div key={si} style={{ background:T.accent, borderRadius:"3px", height:"4px", marginTop:"2px", width:"100%" }}/>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista del mes */}
      <div style={{ color:T.textSub, fontSize:"12px", fontWeight:700, marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
        Servicios de {MONTHS[month]}
      </div>
      {setlists
        .filter(sl => sl.fecha?.startsWith(`${year}-${pad(month+1)}`))
        .sort((a,b)=>a.fecha>b.fecha?1:-1)
        .map(sl=>(
          <div key={sl.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"10px", padding:"12px", marginBottom:"8px", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px" }}
            onClick={()=>onSelectSetlist(sl)}>
            <div style={{ background:T.accent+"33", borderRadius:"8px", width:"40px", height:"40px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:"14px", fontWeight:800, color:T.accent }}>{sl.fecha?.slice(8)}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{ fontWeight:700, color:T.text }}>{sl.nombre}</div>
              <div style={{ fontSize:"12px", color:T.textSub }}>{sl.tipo} · {sl.cantos.length} cantos</div>
            </div>
            <span style={{ fontSize:"11px", color:T.accent, background:T.accent+"22", borderRadius:"6px", padding:"2px 8px", fontWeight:700 }}>{sl.tipo}</span>
          </div>
        ))
      }
      {setlists.filter(sl=>sl.fecha?.startsWith(`${year}-${pad(month+1)}`)).length === 0 && (
        <div style={{ textAlign:"center", padding:"24px", color:T.textSub, fontSize:"13px" }}>Sin servicios este mes</div>
      )}
    </div>
  );
}

// ─── ROLES MÚSICOS ────────────────────────────────────────────────────────────
function RolesPanel({ roles = [], onChange, theme }) {
  const T = theme || THEMES.dark;
  const [nombre, setNombre] = useState("");
  const [rol, setRol]       = useState(ROLES_MUSICOS[0]);

  function add() {
    if (!nombre.trim()) return;
    onChange([...roles, { id:Date.now().toString(), nombre:nombre.trim(), rol }]);
    setNombre("");
  }
  function remove(id) { onChange(roles.filter(r=>r.id!==id)); }

  return (
    <div>
      <div style={{ ...S.h3, color:T.accentSub, marginBottom:"10px" }}>👥 Músicos del servicio</div>

      {/* Agregar músico */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:"6px", marginBottom:"10px" }}>
        <input style={{ ...S.input, background:T.inputBg, color:T.text, borderColor:T.border2 }}
          placeholder="Nombre..." value={nombre} onChange={e=>setNombre(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&add()}/>
        <select style={{ ...S.select, background:T.inputBg, color:T.text, borderColor:T.border2 }}
          value={rol} onChange={e=>setRol(e.target.value)}>
          {ROLES_MUSICOS.map(r=><option key={r}>{r}</option>)}
        </select>
        <button style={S.btn("primary",true)} onClick={add}><Icon name="plus" size={14}/></button>
      </div>

      {/* Lista de músicos */}
      {roles.length === 0 ? (
        <div style={{ textAlign:"center", padding:"16px", color:T.textSub, fontSize:"12px" }}>
          Agrega los músicos que participarán en este servicio
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          {roles.map(r=>(
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"8px", background:T.surface2, borderRadius:"8px", padding:"8px 10px", border:`1px solid ${T.border}` }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:T.accent+"33", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:"14px" }}>🎵</span>
              </div>
              <div style={{flex:1}}>
                <div style={{ fontWeight:700, fontSize:"13px", color:T.text }}>{r.nombre}</div>
                <div style={{ fontSize:"11px", color:T.accentSub }}>{r.rol}</div>
              </div>
              <button style={{ ...S.btn("ghost",true), color:"#ef4444", padding:"4px 6px" }} onClick={()=>remove(r.id)}>
                <Icon name="close" size={12}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CHORD TRANSPOSER ─────────────────────────────────────────────────────────
function transposeChord(chord, semitones) {
  const chordRegex = /([A-G][#b]?)(.*)/;
  return chord.replace(/[A-G][#b]?/g, (match) => {
    const idx = NOTAS.indexOf(match.replace("b", "#").replace("Bb","A#").replace("Eb","D#").replace("Ab","G#").replace("Db","C#").replace("Gb","F#"));
    if (idx === -1) return match;
    return NOTAS[(idx + semitones + 12) % 12];
  });
}

function transposeText(text, semitones) {
  if (semitones === 0) return text;
  return text.replace(/\b([A-G][#b]?(?:maj|min|m|sus|add|dim|aug|\/[A-G][#b]?)?[0-9]*)\b/g, (match) => {
    return transposeChord(match, semitones);
  });
}

// ─── FREESHOW EXPORT ──────────────────────────────────────────────────────────
// Convierte texto con brackets [G][Am] a texto plano eliminando los brackets
function stripBracketChords(text) {
  return text.replace(/\[([A-G][^\]]*)\]/g, "");
}
// Extrae solo los acordes entre brackets para líneas de acordes
function extractBracketChords(text) {
  const matches = text.match(/\[([A-G][^\]]*)\]/g);
  return matches ? matches.map(m=>m.slice(1,-1)).join("  ") : "";
}
// Transpone texto con acordes en brackets [G] → [A] si semitones=2
function transposeBracketText(text, semitones) {
  if (semitones === 0) return text;
  return text.replace(/\[([A-G][^\]]*)\]/g, (_, chord) => `[${transposeChord(chord, semitones)}]`);
}
// Detecta si el contenido usa formato bracket o formato clásico (acordes en línea separada)
function isBracketFormat(text) {
  return /\[[A-G][^\]]*\]/.test(text);
}
function songToFreeShow(song, semitones = 0) {
  const slides = song.secciones.map((sec, i) => {
    // Support both bracket format and classic format
    const raw = isBracketFormat(sec.contenido)
      ? transposeBracketText(sec.contenido, semitones).replace(/\[[^\]]*\]/g, "")  // export clean text
      : transposeText(sec.contenido, semitones);
    return {
      id: `slide_${i}`,
      group: `${sec.tipo} ${sec.numero}`,
      color: sec.tipo === "CORO" ? "#4A90D9" : sec.tipo === "VERSO" ? "#2ECC71" : "#E67E22",
      globalGroup: sec.tipo.toLowerCase(),
      items: [{
        id: `item_${i}`,
        lines: raw.split("\n").map(line => ({
          align: "",
          text: [{ value: line, style: "" }],
        })),
      }],
    };
  });

  return {
    name: song.titulo,
    author: song.autor,
    key: transposeChord(song.tono, semitones),
    bpm: song.tempo,
    slides,
    metadata: { exportedFrom: "Alabanza PWA", version: "1.0" },
  };
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function useStorage(key, defaultVal) {
  const [val, setValState] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : defaultVal; }
    catch { return defaultVal; }
  });
  const setVal = useCallback((v) => {
    setValState(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [val, setVal];
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    songs: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    setlist: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z",
    calendar: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
    rehearsal: "M12 1a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 21l2.31-2.31C18.16 17.67 21 14.17 21 10c0-4.97-4.03-9-9-9zm0 2c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7 3.14-7 7-7zm-1.5 3.5l4.5 2.5-4.5 2.5v-5z",
    plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    delete: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
    export: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    music: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    play: "M8 5v14l11-7z",
    pause: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
    stop: "M6 6h12v12H6z",
    save: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    drag: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
    link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
    vol: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
    metronome: "M12 2L6.5 11H8l-2 9h12l-2-9h1.5L12 2zm0 2.9L15.5 11h-7L12 4.9zM9.1 13h5.8l1.5 7H7.6l1.5-7z",
    info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
    freeshow: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
    moon: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
    sun: "M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z",
    settings: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z",
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <path d={icons[name] || icons.info} />
    </svg>
  );
};

// ─── STYLES FACTORY (theme-aware) ─────────────────────────────────────────────
function makeStyles(T) {
  return {
  app: { minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", display:"flex", flexDirection:"column" },
  nav: { background:T.navBg, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 4px", gap:"2px", height:"56px", position:"sticky", top:0, zIndex:100 },
  navBtn: (active) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"2px", padding:"8px 4px", border:"none", borderRadius:"8px", cursor:"pointer", transition:"all 0.2s", background: active ? T.accent+"33" : "transparent", color: active ? T.accentSub : T.textSub, fontSize:"10px", fontWeight: active ? 700 : 500 }),
  content: { flex:1, padding:"16px", maxWidth:"768px", margin:"0 auto", width:"100%", boxSizing:"border-box" },
  card: { background:T.surface, borderRadius:"12px", padding:"16px", marginBottom:"12px", border:`1px solid ${T.border}` },
  cardHover: { background:T.surface, borderRadius:"12px", padding:"16px", marginBottom:"12px", border:`1px solid ${T.border}`, cursor:"pointer", transition:"border-color 0.2s" },
  h1: { fontSize:"22px", fontWeight:800, color:T.text, margin:"0 0 4px" },
  h2: { fontSize:"18px", fontWeight:700, color:T.textMid, margin:"0 0 12px" },
  h3: { fontSize:"14px", fontWeight:600, color:T.accentSub, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 8px" },
  sub: { fontSize:"12px", color:T.textSub },
  btn: (variant="primary", small=false) => {
    const base = { display:"inline-flex", alignItems:"center", gap:"6px", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:600, transition:"all 0.2s", padding: small ? "6px 12px" : "10px 16px", fontSize: small ? "12px" : "14px" };
    return { ...base, ...({
      primary:   { background:T.accent, color:"#fff" },
      secondary: { background:T.inputBg, color:T.textMid, border:`1px solid ${T.border}` },
      danger:    { background:"#7f1d1d", color:"#fca5a5" },
      ghost:     { background:"transparent", color:T.accentSub, padding:"6px 10px" },
      success:   { background:"#14532d", color:"#86efac" },
    }[variant]) };
  },
  input: { width:"100%", background:T.inputBg, border:`1px solid ${T.border2}`, borderRadius:"8px", color:T.text, padding:"10px 12px", fontSize:"14px", boxSizing:"border-box", outline:"none" },
  textarea: { width:"100%", background:T.inputBg, border:`1px solid ${T.border2}`, borderRadius:"8px", color:T.text, padding:"10px 12px", fontSize:"13px", fontFamily:"'Courier New',monospace", boxSizing:"border-box", outline:"none", resize:"vertical", lineHeight:1.6 },
  select: { background:T.inputBg, border:`1px solid ${T.border2}`, borderRadius:"8px", color:T.text, padding:"8px 12px", fontSize:"14px", outline:"none" },
  label: { fontSize:"12px", color:T.accentSub, fontWeight:600, display:"block", marginBottom:"4px" },
  chip: (color="#6366f1") => ({ display:"inline-block", background:color+"22", color:color, border:`1px solid ${color}44`, borderRadius:"20px", padding:"2px 10px", fontSize:"11px", fontWeight:600 }),
  tipoColor: { VERSO:"#3b82f6", CORO:"#8b5cf6", "PRE-CORO":"#f59e0b", PUENTE:"#10b981", INTRO:"#6b7280", FINAL:"#ef4444", OUTRO:"#ef4444", INTERLUDIO:"#06b6d4", TAG:"#84cc16", SOLO:"#f97316" },
  row: (gap=8) => ({ display:"flex", alignItems:"center", gap:`${gap}px` }),
  between: { display:"flex", alignItems:"center", justifyContent:"space-between" },
  backdrop: { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"20px", overflowY:"auto" },
  modal: { background:T.surface, borderRadius:"16px", padding:"20px", width:"100%", maxWidth:"600px", border:`1px solid ${T.border2}` },
  badge: (c="#6366f1") => ({ background:c+"33", color:c, borderRadius:"6px", padding:"1px 6px", fontSize:"11px", fontWeight:700 }),
  pill: { background:T.inputBg, borderRadius:"20px", padding:"4px 12px", fontSize:"12px", color:T.textMid, border:`1px solid ${T.border}` },
  sep: { borderColor:T.border, margin:"12px 0" },
  pre: { background:T.pre, borderRadius:"8px", padding:"12px", fontFamily:"'Courier New',monospace", fontSize:"13px", lineHeight:1.7, color:T.preText, overflowX:"auto", whiteSpace:"pre", margin:0 },
  };
}
// Static S for components that receive theme separately; overridden where T is passed
const S = makeStyles(THEMES.dark);

// ─── SECCION CARD (editor list) ───────────────────────────────────────────────
function SeccionCard({ sec, onEdit, onDelete, onMoveUp, onMoveDown, semitones }) {
  const color = S.tipoColor[sec.tipo] || "#0ea5e9";
  const TIPO_ABR = { VERSO:"V", CORO:"C", "PRE-CORO":"PC", PUENTE:"P", INTRO:"I", FINAL:"F", OUTRO:"O", INTERLUDIO:"IL", TAG:"T", SOLO:"S" };
  const abr = (TIPO_ABR[sec.tipo]||sec.tipo[0]) + sec.numero;
  // Preview: first non-empty line of the content
  const preview = sec.contenido.split("\n").find(l=>l.trim())||"";

  return (
    <div style={{ borderRadius:"14px", overflow:"hidden", marginBottom:"10px", border:`1.5px solid ${color}55` }}>
      {/* Header colorido */}
      <div style={{ background:color, padding:"10px 14px", display:"flex", alignItems:"center", gap:"10px" }}>
        <div style={{ background:"rgba(0,0,0,0.25)", color:"#fff", borderRadius:"50%", width:"30px", height:"30px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"11px", flexShrink:0 }}>
          {abr}
        </div>
        <span style={{ fontWeight:800, fontSize:"14px", color:"#fff", flex:1 }}>
          {sec.tipo.charAt(0)+sec.tipo.slice(1).toLowerCase()} {sec.numero}
        </span>
        <button style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"8px", padding:"4px 8px", cursor:"pointer", color:"#fff" }} onClick={onMoveUp}>▲</button>
        <button style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"8px", padding:"4px 8px", cursor:"pointer", color:"#fff" }} onClick={onMoveDown}>▼</button>
        <button style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"8px", padding:"4px 8px", cursor:"pointer", color:"#fff" }} onClick={onEdit}><Icon name="edit" size={13}/></button>
        <button style={{ background:"rgba(0,0,0,0.2)", border:"none", borderRadius:"8px", padding:"4px 8px", cursor:"pointer", color:"#ffaaaa" }} onClick={onDelete}><Icon name="delete" size={13}/></button>
      </div>
      {/* Preview del contenido */}
      <div style={{ background:THEMES.dark.surface, padding:"10px 14px" }}>
        <div style={{ fontFamily:"'Courier New',monospace", fontSize:"12px", color:THEMES.dark.textSub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {preview || <span style={{fontStyle:"italic", color:THEMES.dark.textSub}}>Sin contenido</span>}
        </div>
      </div>
    </div>
  );
}

// ─── SECCION EDITOR ───────────────────────────────────────────────────────────
function SeccionEditor({ sec, onSave, onCancel }) {
  const [tipo, setTipo] = useState(sec?.tipo || "VERSO");
  const [numero, setNumero] = useState(sec?.numero || 1);
  const [contenido, setContenido] = useState(sec?.contenido || "");
  const [showHelp, setShowHelp] = useState(false);

  // Live preview: render bracket chords inline highlighted
  function renderPreview(text) {
    if (!text.trim()) return null;
    return text.split("\n").map((line, li) => {
      const parts = line.split(/(\[[A-G][^\]]*\])/g);
      return (
        <div key={li} style={{ fontFamily:"'Courier New',monospace", fontSize:"13px", lineHeight:1.7, minHeight:"20px", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
          {parts.map((part, pi) =>
            /^\[[A-G][^\]]*\]$/.test(part)
              ? <span key={pi} style={{ color:"#38bdf8", fontWeight:700 }}>{part}</span>
              : <span key={pi} style={{ color:THEMES.dark.text }}>{part}</span>
          )}
        </div>
      );
    });
  }

  const color = S.tipoColor[tipo] || "#0ea5e9";
  const TIPO_ABR = { VERSO:"V", CORO:"C", "PRE-CORO":"PC", PUENTE:"P", INTRO:"I", FINAL:"F", OUTRO:"O", INTERLUDIO:"IL", TAG:"T", SOLO:"S" };
  const abr = (TIPO_ABR[tipo]||tipo[0]) + numero;

  return (
    <div style={{ background:THEMES.dark.surface, borderRadius:"16px", padding:"0", width:"100%", maxWidth:"600px", border:`1px solid ${THEMES.dark.border2}`, overflow:"hidden" }}>
      {/* Header colorido del modal */}
      <div style={{ background:color, padding:"14px 16px", display:"flex", alignItems:"center", gap:"10px" }}>
        <div style={{ background:"rgba(0,0,0,0.25)", color:"#fff", borderRadius:"50%", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"12px" }}>
          {abr}
        </div>
        <span style={{ fontWeight:800, fontSize:"16px", color:"#fff", flex:1 }}>
          {sec ? "Editar sección" : "Nueva sección"}
        </span>
        <button style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:"8px", padding:"6px 8px", cursor:"pointer", color:"#fff" }} onClick={onCancel}>
          <Icon name="close" size={16}/>
        </button>
      </div>

      <div style={{ padding:"16px" }}>
        {/* Tipo + número */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:"8px", marginBottom:"14px" }}>
          <div>
            <label style={S.label}>Tipo de sección</label>
            <select style={{ ...S.select, width:"100%", borderColor:color+"88" }} value={tipo} onChange={e=>setTipo(e.target.value)}>
              {TIPOS_SECCION.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>Número</label>
            <input style={{ ...S.input, borderColor:color+"88" }} type="number" min={1} max={10} value={numero} onChange={e=>setNumero(+e.target.value)}/>
          </div>
        </div>

        {/* Instrucciones del formato bracket */}
        <div style={{ background:THEMES.dark.bg, borderRadius:"10px", padding:"10px 12px", marginBottom:"10px", border:`1px solid ${THEMES.dark.border}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:showHelp?"8px":"0" }}>
            <span style={{ fontSize:"12px", color:"#38bdf8", fontWeight:700 }}>💡 Formato de acordes con [ ]</span>
            <button style={{ background:"none", border:"none", color:THEMES.dark.textSub, cursor:"pointer", fontSize:"12px" }} onClick={()=>setShowHelp(h=>!h)}>
              {showHelp?"Ocultar":"Ver cómo"}
            </button>
          </div>
          {showHelp && (
            <div style={{ fontSize:"12px", color:THEMES.dark.textMid, lineHeight:1.7 }}>
              <p style={{margin:"0 0 6px"}}>Coloca el acorde entre corchetes <strong style={{color:"#38bdf8"}}>[G]</strong> justo antes de la sílaba donde cae.</p>
              <div style={{ background:THEMES.dark.surface, borderRadius:"8px", padding:"8px", fontFamily:"monospace", fontSize:"12px" }}>
                <div><span style={{color:"#38bdf8"}}>[G]</span>Nos hemos congregado <span style={{color:"#38bdf8"}}>[C/G]</span>en este día</div>
                <div>para dar<span style={{color:"#38bdf8"}}>[D]</span>le gloria</div>
              </div>
              <p style={{margin:"6px 0 0", color:THEMES.dark.textSub}}>Al agrandar el texto los acordes se quedan pegados a la letra, sin desfasarse.</p>
            </div>
          )}
        </div>

        {/* Textarea */}
        <div style={{marginBottom:"12px"}}>
          <label style={S.label}>Letra y acordes</label>
          <textarea
            style={{ ...S.textarea, minHeight:"180px", border:`1px solid ${color}66` }}
            value={contenido}
            onChange={e=>setContenido(e.target.value)}
            placeholder={"[G]Nos hemos congregado [C/G]en este día\npara dar[D]le gloria"}
            spellCheck={false}
          />
        </div>

        {/* Live preview */}
        {contenido.trim() && (
          <div style={{ marginBottom:"12px" }}>
            <label style={S.label}>Vista previa</label>
            <div style={{ background:THEMES.dark.bg, borderRadius:"10px", padding:"12px 14px", border:`1px solid ${THEMES.dark.border}`, lineHeight:1.7 }}>
              {renderPreview(contenido)}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
          <button style={S.btn("secondary")} onClick={onCancel}>Cancelar</button>
          <button style={{ ...S.btn("primary"), background:color }} onClick={()=>onSave({ tipo, numero, contenido })}>
            <Icon name="save" size={16}/> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ENSAYO (REHEARSAL) ───────────────────────────────────────────────────────
function EnsayoPanel({ ensayo, onSave }) {
  const [data, setData] = useState(ensayo || {
    youtubeId:"", pistas:INSTRUMENTOS_PISTA.map(i=>({...i,url:"",volumen:100})), notas:"", bpmEnsayo:80
  });
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(null);
  const [bpmRunning, setBpmRunning] = useState(false);
  const metroRef = useRef(null);
  const audioCtxRef = useRef(null);

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));
  const updatePista = (idx, key, val) => setData(d => ({
    ...d,
    pistas: d.pistas.map((p,i)=>i===idx?{...p,[key]:val}:p)
  }));

  // Simple metronome using Web Audio
  function startMetronome(bpm) {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext||window.webkitAudioContext)();
    const ctx = audioCtxRef.current;
    const interval = 60000/bpm;
    function click() {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.value = 880;
      g.gain.setValueAtTime(0.3,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.05);
      osc.start(); osc.stop(ctx.currentTime+0.05);
    }
    click();
    metroRef.current = setInterval(click, interval);
  }
  function stopMetronome() { clearInterval(metroRef.current); }
  function toggleMetronome() {
    if (bpmRunning) { stopMetronome(); setBpmRunning(false); }
    else { startMetronome(data.bpmEnsayo); setBpmRunning(true); }
  }
  useEffect(() => () => stopMetronome(), []);

  function playAudio(url, idx) {
    if (playing === idx) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const a = new Audio(url);
    a.volume = (data.pistas[idx]?.volumen||100)/100;
    a.play().catch(()=>{});
    audioRef.current = a;
    setPlaying(idx);
    a.onended = () => setPlaying(null);
  }

  const ytEmbed = data.youtubeId
    ? `https://www.youtube.com/embed/${data.youtubeId}`
    : null;

  return (
    <div>
      {/* BPM Metronome */}
      <div style={{ ...S.card, marginBottom:"12px" }}>
        <div style={{ ...S.between, marginBottom:"12px" }}>
          <span style={S.h3}><Icon name="metronome" size={14}/> Metrónomo de ensayo</span>
        </div>
        <div style={S.row(12)}>
          <input type="range" min={40} max={220} value={data.bpmEnsayo}
            onChange={e=>update("bpmEnsayo",+e.target.value)}
            style={{flex:1}}/>
          <span style={{ ...S.badge(), minWidth:"60px", textAlign:"center" }}>{data.bpmEnsayo} BPM</span>
          <button
            style={S.btn(bpmRunning?"danger":"success",false)}
            onClick={toggleMetronome}>
            {bpmRunning ? <><Icon name="stop" size={16}/> Stop</> : <><Icon name="play" size={16}/> Iniciar</>}
          </button>
        </div>
      </div>

      {/* YouTube Reference */}
      <div style={{ ...S.card, marginBottom:"12px" }}>
        <span style={S.h3}><Icon name="link" size={14}/> Referencia de YouTube</span>
        <input
          style={{ ...S.input, marginTop:"8px", marginBottom: ytEmbed?"10px":"0" }}
          placeholder="ID de YouTube (ej: dQw4w9WgXcQ)"
          value={data.youtubeId}
          onChange={e=>update("youtubeId",e.target.value)}
        />
        {ytEmbed && (
          <div style={{position:"relative",paddingBottom:"56.25%",height:0,borderRadius:"8px",overflow:"hidden"}}>
            <iframe src={ytEmbed} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} frameBorder="0" allowFullScreen title="YouTube reference"/>
          </div>
        )}
      </div>

      {/* Pistas - RehearsalMix */}
      <div style={{ ...S.card, marginBottom:"12px" }}>
        <span style={S.h3}><Icon name="vol" size={14}/> Pistas de ensayo (RehearsalMix)</span>
        <p style={{ ...S.sub, marginTop:"4px", marginBottom:"12px" }}>
          Agrega URLs de audio para cada mezcla. Similar a WorshipTools Rehearse y RehearsalMix de Secuencias.com
        </p>
        {data.pistas.map((pista,idx)=>(
          <div key={pista.tipo} style={{ background:"#12121c", borderRadius:"8px", padding:"10px", marginBottom:"8px" }}>
            <div style={{ ...S.between, marginBottom:"6px" }}>
              <span style={{ fontSize:"13px", fontWeight:600, color:"#c8c8e0" }}>
                {INSTRUMENTOS_PISTA.find(i=>i.tipo===pista.tipo)?.icon} {pista.label}
              </span>
              {pista.url && (
                <button
                  style={S.btn(playing===idx?"danger":"success",true)}
                  onClick={()=>playAudio(pista.url,idx)}>
                  {playing===idx ? <><Icon name="stop" size={12}/> Detener</> : <><Icon name="play" size={12}/> Reproducir</>}
                </button>
              )}
            </div>
            <input
              style={{ ...S.input, fontSize:"12px", marginBottom:"6px" }}
              placeholder={`URL de audio para ${pista.label}...`}
              value={pista.url}
              onChange={e=>updatePista(idx,"url",e.target.value)}
            />
            <div style={S.row(8)}>
              <Icon name="vol" size={14}/>
              <input type="range" min={0} max={100} value={pista.volumen}
                onChange={e=>updatePista(idx,"volumen",+e.target.value)}
                style={{flex:1}}/>
              <span style={S.sub}>{pista.volumen}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Notas de ensayo */}
      <div style={{ ...S.card, marginBottom:"12px" }}>
        <span style={S.h3}><Icon name="edit" size={14}/> Notas del ensayo</span>
        <textarea
          style={{ ...S.textarea, marginTop:"8px", minHeight:"100px" }}
          placeholder="Notas para el ensayo, partes difíciles, instrucciones para músicos..."
          value={data.notas}
          onChange={e=>update("notas",e.target.value)}
        />
      </div>

      <button style={{ ...S.btn("primary"), width:"100%" }} onClick={()=>onSave(data)}>
        <Icon name="save" size={16}/> Guardar datos de ensayo
      </button>
    </div>
  );
}

// ─── SONG VIEW ────────────────────────────────────────────────────────────────
function SongView({ song, allSongs, onBack, onEdit, onUpdate, theme }) {
  const T = theme || THEMES.dark;
  const Ts = makeStyles(T);

  const [viewMode, setViewMode]   = useState("acordes");
  const [semitones, setSemitones] = useState(0);
  const [fontSize, setFontSize]   = useState(18);
  const [showConfig, setShowConfig] = useState(false);
  const [showTonoPopup, setShowTonoPopup] = useState(false); // ← nuevo: popup de tono
  const [activeTab, setActiveTab]   = useState(null);
  const [freeshowJson, setFreeshowJson] = useState("");
  const [showFSJson, setShowFSJson]   = useState(false);
  const [notas, setNotas]     = useState(song.notas || "");
  const [notasSaved, setNotasSaved] = useState(true);

  const currentTono = transposeChord(song.tono, semitones);
  const semDisplay  = semitones > 0 ? `+${semitones}` : semitones < 0 ? `${semitones}` : "0";
  const allChordText = song.secciones.map(s=>s.contenido).join("\n");
  const TIPO_ABR = { VERSO:"V", CORO:"C", "PRE-CORO":"PC", PUENTE:"P", INTRO:"I", FINAL:"F", OUTRO:"O", INTERLUDIO:"IL", TAG:"T", SOLO:"S" };

  function exportFreeShow() {
    const data = songToFreeShow(song, semitones);
    setFreeshowJson(JSON.stringify(data, null, 2));
    setShowFSJson(true);
  }
  function downloadFreeShow() {
    const blob = new Blob([freeshowJson], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${song.titulo.replace(/\s/g,"_")}.json`; a.click();
  }
  function saveNotas() { onUpdate({...song, notas}); setNotasSaved(true); }

  // ── Renderiza texto con acordes en brackets o clásico ─────────────────────
  function renderSection(rawText, mode) {
    const transposed = isBracketFormat(rawText)
      ? transposeBracketText(rawText, semitones)
      : transposeText(rawText, semitones);

    if (mode === "letra") {
      // Solo letra: quita brackets/acordes
      const clean = isBracketFormat(transposed)
        ? transposed.replace(/\[[^\]]*\]/g, "")
        : transposed.split("\n").filter(line=>{
            const w = line.trim().split(/\s+/);
            const cc = w.filter(x=>/^[A-G][#b]?/.test(x)).length;
            return !(cc>0 && cc/Math.max(w.length,1)>0.4 && !/[a-záéíóúñ]{3}/i.test(line));
          }).join("\n");
      return (
        <div style={{ fontFamily:"'Georgia',serif", fontSize:`${fontSize}px`, lineHeight:1.8, color:T.text, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
          {clean}
        </div>
      );
    }

    if (isBracketFormat(transposed)) {
      // FORMATO BRACKET: [G]texto → acorde inline resaltado
      return (
        <div>
          {transposed.split("\n").map((line, li) => {
            const parts = line.split(/(\[[A-G][^\]]*\])/g);
            const hasChord = parts.some(p=>/^\[[A-G]/.test(p));
            return (
              <div key={li} style={{
                fontFamily:"'Courier New',monospace",
                fontSize:`${fontSize}px`,
                lineHeight: 1.8,
                minHeight: line.trim()===""?`${fontSize*0.5}px`:undefined,
                whiteSpace:"pre-wrap",
                wordBreak:"break-word",
                color: T.text,
              }}>
                {parts.map((part, pi) =>
                  /^\[[A-G][^\]]*\]$/.test(part)
                    ? <span key={pi} style={{ color:T.accentSub, fontWeight:800, fontSize:`${fontSize-1}px` }}>{part.slice(1,-1)}</span>
                    : <span key={pi}>{part}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // FORMATO CLÁSICO: acordes en línea separada (arriba de la letra)
    return (
      <div>
        {transposed.split("\n").map((line, li) => {
          const w = line.trim().split(/\s+/);
          const isChord = w.filter(x=>/^[A-G][#b]?/.test(x)).length > 0
            && w.filter(x=>/^[A-G][#b]?/.test(x)).length / Math.max(w.length,1) > 0.4
            && !/[a-záéíóúñ]{3}/i.test(line);
          return (
            <div key={li} style={{
              fontFamily:"'Courier New',monospace",
              fontSize: isChord ? `${fontSize-1}px` : `${fontSize}px`,
              lineHeight: 1.6,
              color: isChord ? T.accentSub : T.text,
              fontWeight: isChord ? 700 : 400,
              minHeight: line.trim()===""?`${fontSize*0.5}px`:undefined,
              whiteSpace:"pre-wrap",
              wordBreak:"break-word",
            }}>
              {line||" "}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Panel de configuración ────────────────────────────────────────────────
  const ConfigPanel = () => (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", flexDirection:"column", background:T.bg }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 16px 12px", borderBottom:`1px solid ${T.border}` }}>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:T.text, padding:4 }} onClick={()=>setShowConfig(false)}>
          <Icon name="close" size={22}/>
        </button>
        <span style={{ fontWeight:800, fontSize:"18px", color:T.text }}>Preferencias</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
        {/* Editar canción */}
        <div style={{ background:T.surface, borderRadius:"12px", marginBottom:"16px", border:`1px solid ${T.border}` }}>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", color:T.accent }}
            onClick={()=>{ setShowConfig(false); onEdit(); }}>
            <Icon name="edit" size={18}/>
            <span style={{ flex:1, fontWeight:600, fontSize:"15px", textAlign:"left" }}>Editar canción</span>
            <Icon name="back" size={16}/>
          </button>
        </div>

        {/* Tempo + Tamaño fuente */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
          <div>
            <label style={{ ...Ts.label, marginBottom:"6px" }}>Tempo</label>
            <div style={{ background:T.surface, borderRadius:"10px", padding:"12px 14px", border:`1px solid ${T.border}`, fontSize:"15px", color:T.textSub }}>
              ♩= {song.tempo} bpm
            </div>
          </div>
          <div>
            <label style={{ ...Ts.label, marginBottom:"6px" }}>Tamaño de letra</label>
            <div style={{ background:T.surface, borderRadius:"10px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center" }}>
              <button style={{ flex:1, padding:"12px", background:"none", border:"none", cursor:"pointer", color:T.textSub, fontSize:"16px" }} onClick={()=>setFontSize(f=>Math.max(12,f-1))}>A−</button>
              <span style={{ color:T.text, fontWeight:700, fontSize:"15px" }}>{fontSize}px</span>
              <button style={{ flex:1, padding:"12px", background:"none", border:"none", cursor:"pointer", color:T.textSub, fontSize:"16px" }} onClick={()=>setFontSize(f=>Math.min(28,f+1))}>A+</button>
            </div>
          </div>
        </div>

        {/* Vista de canción */}
        <label style={{ ...Ts.label, marginBottom:"8px" }}>Vista de canción</label>
        <div style={{ display:"flex", background:T.surface, borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:"16px" }}>
          {[["acordes","Acordes"],["letra","Solo letra"]].map(([k,l])=>(
            <button key={k} style={{ flex:1, padding:"12px", border:"none", cursor:"pointer", fontWeight:600, fontSize:"14px",
              background:viewMode===k?T.accent:"transparent", color:viewMode===k?"#fff":T.textMid }}
              onClick={()=>setViewMode(k)}>{l}</button>
          ))}
        </div>

        {/* Herramientas */}
        <label style={{ ...Ts.label, marginBottom:"8px" }}>Herramientas</label>
        <div style={{ background:T.surface, borderRadius:"12px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
          {[
            ["ensayo",    "🎙", "Pistas de ensayo",     "Mezclas aumentada/disminuida por instrumento"],
            ["diagramas", "🎸", "Diagramas de acordes", "Guitarra y piano"],
            ["notas",     "📝", "Notas del canto",      song.notas?"Con notas guardadas":"Sin notas aún"],
            ["freeshow",  "📺", "Exportar a FreeShow",  "Genera JSON para presentación"],
          ].map(([key,icon,title,sub],i,arr)=>(
            <button key={key}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", background:"none", border:"none",
                borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none", cursor:"pointer", textAlign:"left" }}
              onClick={()=>{ setActiveTab(key); setShowConfig(false); }}>
              <span style={{ fontSize:"20px", width:"28px", textAlign:"center" }}>{icon}</span>
              <div style={{flex:1}}>
                <div style={{ fontWeight:600, color:T.text, fontSize:"14px" }}>{title}</div>
                <div style={{ fontSize:"12px", color:T.textSub, marginTop:"1px" }}>{sub}</div>
              </div>
              <Icon name="back" size={14}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Popup de cambio de tono (al tocar el badge) ───────────────────────────
  const TonoPopup = () => (
    <div style={{ position:"fixed", inset:0, zIndex:400, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", padding:"56px 12px 0" }}
      onClick={()=>setShowTonoPopup(false)}>
      <div style={{ background:T.surface, borderRadius:"16px", padding:"16px", border:`1px solid ${T.border}`, boxShadow:"0 8px 32px #00000066", minWidth:"200px" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:700, fontSize:"14px", color:T.text, marginBottom:"12px", textAlign:"center" }}>
          Transportar tono
        </div>
        {/* Tono actual grande */}
        <div style={{ textAlign:"center", marginBottom:"12px" }}>
          <span style={{ fontSize:"36px", fontWeight:800, color:T.accent }}>{currentTono}</span>
          {semitones!==0 && <div style={{ fontSize:"12px", color:T.textSub }}>({semDisplay} semitonos)</div>}
        </div>
        {/* Botones − y + grandes */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
          <button
            style={{ flex:1, padding:"14px", background:T.inputBg, border:`1px solid ${T.border2}`, borderRadius:"12px", cursor:"pointer", fontSize:"24px", fontWeight:700, color:T.text }}
            onClick={()=>setSemitones(s=>s-1)}>−</button>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:"22px", fontWeight:800, color:semitones===0?T.textSub:T.accent }}>{semDisplay}</div>
            <div style={{ fontSize:"10px", color:T.textSub }}>semitonos</div>
          </div>
          <button
            style={{ flex:1, padding:"14px", background:T.inputBg, border:`1px solid ${T.border2}`, borderRadius:"12px", cursor:"pointer", fontSize:"24px", fontWeight:700, color:T.text }}
            onClick={()=>setSemitones(s=>s+1)}>+</button>
        </div>
        {/* Notas de la escala para referencia rápida */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"12px", justifyContent:"center" }}>
          {NOTAS.map((n,i)=>{
            const active = currentTono.replace("m","")===n;
            return (
              <button key={n} style={{ padding:"4px 8px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:700, fontSize:"12px",
                background:active?T.accent:T.inputBg, color:active?"#fff":T.textSub }}
                onClick={()=>{ const diff=(i - NOTAS.indexOf(song.tono.replace("m","")));  setSemitones(diff<-6?diff+12:diff>6?diff-12:diff); }}>
                {n}
              </button>
            );
          })}
        </div>
        {semitones!==0 && (
          <button style={{ width:"100%", padding:"10px", background:T.accent+"22", color:T.accent, border:`1px solid ${T.accent}44`, borderRadius:"10px", cursor:"pointer", fontWeight:700 }}
            onClick={()=>setSemitones(0)}>
            Restablecer ({song.tono})
          </button>
        )}
      </div>
    </div>
  );

  // ── Tabs secundarias ──────────────────────────────────────────────────────
  if (activeTab) {
    return (
      <div style={{ background:T.bg, minHeight:"100vh" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", borderBottom:`1px solid ${T.border}`, background:T.surface }}>
          <button style={{ background:"none", border:"none", cursor:"pointer", color:T.text, padding:4 }} onClick={()=>setActiveTab(null)}>
            <Icon name="back" size={20}/>
          </button>
          <span style={{ fontWeight:700, fontSize:"16px", color:T.text }}>
            {activeTab==="ensayo"?"🎙 Pistas de ensayo":activeTab==="diagramas"?"🎸 Diagramas de acordes":activeTab==="notas"?"📝 Notas":"📺 Exportar a FreeShow"}
          </span>
        </div>
        <div style={{ padding:"16px" }}>
          {activeTab==="ensayo" && <EnsayoPanel ensayo={song.ensayo} onSave={(ensayo)=>onUpdate({...song,ensayo})}/>}
          {activeTab==="diagramas" && (
            <div>
              <div style={{ background:T.surface, borderRadius:"12px", padding:"14px", border:`1px solid ${T.border}`, marginBottom:"10px" }}>
                <div style={{ fontSize:"12px", fontWeight:700, color:T.accentSub, marginBottom:"10px", textTransform:"uppercase" }}>Acordes del canto completo</div>
                <ChordPanel text={allChordText} semitones={semitones} theme={T}/>
              </div>
              {song.secciones.map((sec,idx)=>{
                const color=S.tipoColor[sec.tipo]||T.accent;
                return (
                  <div key={sec.id} style={{ background:T.surface, borderRadius:"10px", marginBottom:"8px", padding:"10px 12px", border:`1px solid ${T.border}`, borderLeft:`3px solid ${color}` }}>
                    <div style={{ ...Ts.chip(color), marginBottom:"8px", display:"inline-block" }}>{sec.tipo} {sec.numero}</div>
                    <ChordPanel text={sec.contenido} semitones={semitones} theme={T}/>
                  </div>
                );
              })}
            </div>
          )}
          {activeTab==="notas" && (
            <div style={{ background:T.surface, borderRadius:"12px", padding:"14px", border:`1px solid ${T.border}` }}>
              <p style={{ ...Ts.sub, marginBottom:"10px", lineHeight:1.5 }}>Notas privadas del canto: partes difíciles, cambios, instrucciones...</p>
              <textarea style={{ ...Ts.textarea, minHeight:"220px", fontSize:"15px", lineHeight:1.7 }}
                placeholder="Ej: En el puente subir al tono A. El baterista entra suave en el Verso 1..."
                value={notas} onChange={e=>{ setNotas(e.target.value); setNotasSaved(false); }}/>
              <button style={{ ...Ts.btn("primary"), width:"100%", justifyContent:"center", marginTop:"12px" }} onClick={saveNotas}>
                <Icon name="save" size={16}/> {notasSaved?"✅ Guardado":"Guardar notas"}
              </button>
            </div>
          )}
          {activeTab==="freeshow" && (
            <div>
              <div style={{ background:T.surface, borderRadius:"12px", padding:"14px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>
                <p style={{ ...Ts.sub, marginBottom:"12px", lineHeight:1.5 }}>
                  Tono actual: <strong style={{color:T.accent}}>{currentTono}</strong> ({semDisplay} st)
                </p>
                {song.secciones.map(sec=>{
                  const color=S.tipoColor[sec.tipo]||T.accent;
                  return (
                    <div key={sec.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"4px 0", borderBottom:`1px solid ${T.border}` }}>
                      <span style={{ ...Ts.badge(color), minWidth:"80px", textAlign:"center" }}>{sec.tipo} {sec.numero}</span>
                      <span style={{ ...Ts.sub, fontSize:"11px" }}>{sec.contenido.replace(/\[[^\]]*\]/g,"").split("\n").filter(l=>l.trim())[0]?.substring(0,40)}...</span>
                    </div>
                  );
                })}
                <button style={{ ...Ts.btn("primary"), width:"100%", justifyContent:"center", marginTop:"12px" }} onClick={exportFreeShow}>
                  <Icon name="export" size={16}/> Generar JSON FreeShow
                </button>
              </div>
              {showFSJson && (
                <div style={{ background:T.surface, borderRadius:"12px", padding:"14px", border:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                    <span style={{ fontWeight:700, color:T.accentSub, fontSize:"13px" }}>JSON generado</span>
                    <button style={Ts.btn("primary",true)} onClick={downloadFreeShow}><Icon name="export" size={14}/> Descargar</button>
                  </div>
                  <textarea style={{ ...Ts.textarea, minHeight:"160px", fontSize:"11px" }} value={freeshowJson} readOnly/>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Vista principal ───────────────────────────────────────────────────────
  return (
    <div style={{ background:T.bg, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {showConfig && <ConfigPanel/>}
      {showTonoPopup && <TonoPopup/>}

      {/* ── Top bar ── */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px", background:T.surface, borderBottom:`1px solid ${T.border}`, position:"sticky", top:0, zIndex:50 }}>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:T.text, padding:"4px 6px" }} onClick={onBack}>
          <Icon name="back" size={22}/>
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          {/* Título más grande */}
          <div style={{ fontWeight:800, fontSize:"22px", color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{song.titulo}</div>
          <div style={{ fontSize:"13px", color:T.textSub }}>{song.autor}</div>
        </div>
        {/* Badge de tono — toca para transponer */}
        <button
          style={{ background:T.accent, color:"#fff", borderRadius:"10px", padding:"6px 14px", fontSize:"15px", fontWeight:800, border:"none", cursor:"pointer", boxShadow:`0 2px 8px ${T.accent}66`, flexShrink:0 }}
          onClick={()=>setShowTonoPopup(v=>!v)}
          title="Toca para cambiar tono">
          {currentTono}
        </button>
        {/* Config */}
        <button style={{ background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:"10px", padding:"8px 10px", cursor:"pointer", color:T.textMid }}
          onClick={()=>setShowConfig(true)}>
          <Icon name="settings" size={18}/>
        </button>
      </div>

      {/* ── Sequence bar ── */}
      {song.secciones.length > 0 && (
        <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"8px 12px", overflowX:"auto", whiteSpace:"nowrap" }}>
          <div style={{ display:"inline-flex", gap:"6px" }}>
            {song.secciones.map((sec,idx)=>{
              const color=S.tipoColor[sec.tipo]||T.accent;
              const abr=(TIPO_ABR[sec.tipo]||sec.tipo[0])+sec.numero;
              return (
                <button key={sec.id||idx}
                  onClick={()=>{ const el=document.getElementById(`sec-${idx}`); if(el)el.scrollIntoView({behavior:"smooth",block:"start"}); }}
                  style={{ background:color, color:"#fff", border:"none", borderRadius:"50%", width:"36px", height:"36px", cursor:"pointer", fontWeight:800, fontSize:"11px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 2px 6px ${color}66` }}>
                  {abr}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Info bar ── */}
      <div style={{ display:"flex", gap:"8px", padding:"8px 12px", alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"8px", padding:"4px 10px", fontSize:"12px", color:T.textSub }}>
          ♩ {song.tempo} bpm
        </span>
        {semitones!==0 && (
          <span style={{ background:T.accent+"22", color:T.accent, border:`1px solid ${T.accent}44`, borderRadius:"8px", padding:"4px 10px", fontSize:"12px", fontWeight:700 }}>
            {semDisplay} st
          </span>
        )}
        {/* toggle acordes/letra inline */}
        <div style={{ display:"flex", background:T.surface, borderRadius:"8px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
          {[["acordes","Acordes"],["letra","Letra"]].map(([k,l])=>(
            <button key={k} style={{ padding:"4px 12px", border:"none", cursor:"pointer", fontSize:"12px", fontWeight:600,
              background:viewMode===k?T.accent:"transparent", color:viewMode===k?"#fff":T.textSub }}
              onClick={()=>setViewMode(k)}>{l}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        {song.notas && (
          <button style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"8px", padding:"4px 10px", fontSize:"12px", color:T.textSub, cursor:"pointer" }}
            onClick={()=>setActiveTab("notas")}>📝 Notas</button>
        )}
        {song.categoria.slice(0,1).map(c=>(
          <span key={c} style={{ background:"#f59e0b22", color:"#f59e0b", border:"1px solid #f59e0b44", borderRadius:"8px", padding:"4px 10px", fontSize:"12px", fontWeight:600 }}>{c}</span>
        ))}
      </div>

      {/* ── Secciones ── */}
      <div style={{ flex:1, padding:"12px" }}>
        {song.secciones.map((sec,idx)=>{
          const color=S.tipoColor[sec.tipo]||T.accent;
          const abr=(TIPO_ABR[sec.tipo]||sec.tipo[0])+sec.numero;
          return (
            <div key={sec.id} id={`sec-${idx}`}
              style={{ marginBottom:"20px", borderRadius:"16px", overflow:"hidden", boxShadow:`0 2px 12px ${color}33` }}>
              {/* Header de sección — sólido y llamativo */}
              <div style={{ background:color, padding:"12px 16px", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ background:"rgba(0,0,0,0.2)", color:"#fff", borderRadius:"50%", width:"34px", height:"34px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"12px", flexShrink:0 }}>
                  {abr}
                </div>
                <span style={{ fontWeight:800, fontSize:"16px", color:"#fff", flex:1 }}>
                  {sec.tipo.charAt(0)+sec.tipo.slice(1).toLowerCase()} {sec.numero}
                </span>
              </div>
              {/* Contenido */}
              <div style={{ background:T.surface, padding:"16px 18px", borderLeft:`3px solid ${color}` }}>
                {renderSection(sec.contenido, viewMode)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

  const currentTono = transposeChord(song.tono, semitones);
  const semDisplay = semitones > 0 ? `+${semitones}` : semitones < 0 ? `${semitones}` : "0";
  const allChordText = song.secciones.map(s=>s.contenido).join("\n");

  // Abreviatura para la barra de secuencia
  const TIPO_ABR = { VERSO:"V", CORO:"C", "PRE-CORO":"PC", PUENTE:"P", INTRO:"I", FINAL:"F", OUTRO:"O", INTERLUDIO:"IL", TAG:"T", SOLO:"S" };

  function exportFreeShow() {
    const data = songToFreeShow(song, semitones);
    setFreeshowJson(JSON.stringify(data, null, 2));
    setShowFSJson(true);
  }
  function downloadFreeShow() {
    const blob = new Blob([freeshowJson], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${song.titulo.replace(/\s/g,"_")}.json`; a.click();
  }
  function saveNotas() {
    onUpdate({ ...song, notas });
    setNotasSaved(true);
  }

  // ── Panel de configuración (tipo imagen 2) ────────────────────────────────
  const ConfigPanel = () => (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", flexDirection:"column", background:T.bg }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 16px 12px", borderBottom:`1px solid ${T.border}` }}>
        <button style={{ background:"none", border:"none", cursor:"pointer", color:T.text, padding:4 }} onClick={()=>setShowConfig(false)}>
          <Icon name="close" size={22}/>
        </button>
        <span style={{ fontWeight:800, fontSize:"18px", color:T.text }}>Preferencias</span>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
        {/* Editar canción */}
        <div style={{ background:T.surface, borderRadius:"12px", marginBottom:"16px", border:`1px solid ${T.border}` }}>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", color:T.accent }}
            onClick={()=>{ setShowConfig(false); onEdit(); }}>
            <Icon name="edit" size={18}/>
            <span style={{ flex:1, fontWeight:600, fontSize:"15px", textAlign:"left" }}>Editar canción</span>
            <Icon name="back" size={16}/>
          </button>
        </div>

        {/* Tempo + Tamaño fuente */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
          <div>
            <label style={{ ...Ts.label, marginBottom:"6px" }}>Tempo</label>
            <div style={{ background:T.surface, borderRadius:"10px", padding:"12px 14px", border:`1px solid ${T.border}`, fontSize:"15px", color:T.textSub }}>
              ♩= {song.tempo} bpm
            </div>
          </div>
          <div>
            <label style={{ ...Ts.label, marginBottom:"6px" }}>Tamaño de letra</label>
            <div style={{ background:T.surface, borderRadius:"10px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center" }}>
              <button style={{ flex:1, padding:"12px", background:"none", border:"none", cursor:"pointer", color:T.textSub, fontSize:"16px" }}
                onClick={()=>setFontSize(f=>Math.max(12,f-1))}>A−</button>
              <span style={{ color:T.text, fontWeight:700, fontSize:"15px" }}>{fontSize}px</span>
              <button style={{ flex:1, padding:"12px", background:"none", border:"none", cursor:"pointer", color:T.textSub, fontSize:"16px" }}
                onClick={()=>setFontSize(f=>Math.min(28,f+1))}>A+</button>
            </div>
          </div>
        </div>

        {/* Vista de canción */}
        <label style={{ ...Ts.label, marginBottom:"8px" }}>Vista de canción</label>
        <div style={{ display:"flex", background:T.surface, borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:"16px" }}>
          {[["acordes","Acordes"],["letra","Solo letra"]].map(([k,l])=>(
            <button key={k} style={{ flex:1, padding:"12px", border:"none", cursor:"pointer", fontWeight:600, fontSize:"14px", transition:"all 0.15s",
              background:viewMode===k?T.accent:"transparent", color:viewMode===k?"#fff":T.textMid }}
              onClick={()=>setViewMode(k)}>{l}</button>
          ))}
        </div>

        {/* Transportar */}
        <label style={{ ...Ts.label, marginBottom:"8px" }}>Transportar — Tono actual: <strong style={{color:T.accent}}>{currentTono}</strong></label>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", background:T.surface, borderRadius:"10px", padding:"10px 14px", border:`1px solid ${T.border}`, marginBottom:"16px" }}>
          <button style={{ background:T.inputBg, border:`1px solid ${T.border2}`, color:T.text, borderRadius:"8px", padding:"8px 16px", cursor:"pointer", fontSize:"18px", fontWeight:700 }}
            onClick={()=>setSemitones(s=>s-1)}>−</button>
          <span style={{ flex:1, textAlign:"center", fontWeight:800, fontSize:"20px", color:semitones===0?T.textSub:T.accent }}>{semDisplay}</span>
          <button style={{ background:T.inputBg, border:`1px solid ${T.border2}`, color:T.text, borderRadius:"8px", padding:"8px 16px", cursor:"pointer", fontSize:"18px", fontWeight:700 }}
            onClick={()=>setSemitones(s=>s+1)}>+</button>
          {semitones!==0 && (
            <button style={{ background:T.accent+"22", color:T.accent, border:`1px solid ${T.accent}44`, borderRadius:"8px", padding:"8px 12px", cursor:"pointer", fontSize:"13px", fontWeight:700 }}
              onClick={()=>setSemitones(0)}>Reset</button>
          )}
        </div>

        {/* Sección: Herramientas */}
        <label style={{ ...Ts.label, marginBottom:"8px" }}>Herramientas</label>
        <div style={{ background:T.surface, borderRadius:"12px", border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:"16px" }}>
          {[
            ["ensayo",    "🎙",  "Pistas de ensayo",      "Mezclas aumentada/disminuida por instrumento"],
            ["diagramas", "🎸",  "Diagramas de acordes",  "Guitarra y piano"],
            ["notas",     "📝",  "Notas del canto",       song.notas ? "Con notas guardadas" : "Sin notas aún"],
            ["freeshow",  "📺",  "Exportar a FreeShow",   "Genera JSON para presentación"],
          ].map(([key, icon, title, sub], i, arr)=>(
            <button key={key}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", background:"none", border:"none", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none", cursor:"pointer", textAlign:"left" }}
              onClick={()=>{ setActiveTab(key); setShowConfig(false); }}>
              <span style={{ fontSize:"20px", width:"28px", textAlign:"center" }}>{icon}</span>
              <div style={{flex:1}}>
                <div style={{ fontWeight:600, color:T.text, fontSize:"14px" }}>{title}</div>
                <div style={{ fontSize:"12px", color:T.textSub, marginTop:"1px" }}>{sub}</div>
              </div>
              <Icon name="back" size={14}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

// ─── SONG EDITOR ──────────────────────────────────────────────────────────────
function SongEditor({ song, onSave, onCancel }) {
  const [data, setData] = useState(song || {
    id: Date.now().toString(),
    titulo:"", autor:"", tono:"G", tempo:80,
    categoria:[], tags:[], secciones:[],
    ensayo:{ youtubeId:"", pistas:INSTRUMENTOS_PISTA.map(i=>({...i,url:"",volumen:100})), notas:"", bpmEnsayo:80 },
    freeshowData:null, createdAt:Date.now(),
  });
  const [secModal, setSecModal] = useState(null); // null | "new" | {index, sec}
  const [activeTab, setActiveTab] = useState("info");

  const up = (key,val) => setData(d=>({...d,[key]:val}));

  function saveSec(secData) {
    const newSec = { id: Date.now().toString(), ...secData };
    if (secModal === "new") {
      up("secciones",[...data.secciones, newSec]);
    } else {
      up("secciones", data.secciones.map((s,i)=>i===secModal.index?{...s,...secData}:s));
    }
    setSecModal(null);
  }

  function deleteSec(idx) {
    up("secciones", data.secciones.filter((_,i)=>i!==idx));
  }

  function moveSec(idx, dir) {
    const arr = [...data.secciones];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    up("secciones", arr);
  }

  function toggleCat(c) {
    up("categoria", data.categoria.includes(c) ? data.categoria.filter(x=>x!==c) : [...data.categoria, c]);
  }

  return (
    <div>
      {secModal && (
        <div style={S.backdrop}>
          <SeccionEditor
            sec={secModal === "new" ? null : secModal.sec}
            onSave={saveSec}
            onCancel={()=>setSecModal(null)}
          />
        </div>
      )}

      <div style={{ ...S.card, marginBottom:"12px" }}>
        <div style={{ ...S.between, marginBottom:"16px" }}>
          <div>
            <h2 style={S.h1}>{song ? "Editar canción" : "Nueva canción"}</h2>
          </div>
          <button style={S.btn("ghost",true)} onClick={onCancel}><Icon name="close" size={20}/></button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"4px", background:"#12121c", borderRadius:"10px", padding:"4px" }}>
          {[["info","Información"],["secciones","Secciones"],["ensayo","Ensayo"]].map(([k,l])=>(
            <button key={k} style={{ flex:1, padding:"8px", border:"none", borderRadius:"7px", cursor:"pointer", fontSize:"12px", fontWeight:600,
              background:activeTab===k?"#6366f1":"transparent", color:activeTab===k?"#fff":"#6b7280" }}
              onClick={()=>setActiveTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {activeTab === "info" && (
        <div style={S.card}>
          <div style={{ display:"grid", gap:"12px" }}>
            <div>
              <label style={S.label}>Título *</label>
              <input style={S.input} value={data.titulo} onChange={e=>up("titulo",e.target.value)} placeholder="Nombre del canto..."/>
            </div>
            <div>
              <label style={S.label}>Autor / Intérprete</label>
              <input style={S.input} value={data.autor} onChange={e=>up("autor",e.target.value)} placeholder="Marcos Witt, Danilo Montero..."/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              <div>
                <label style={S.label}>Tono original</label>
                <select style={{ ...S.select, width:"100%" }} value={data.tono} onChange={e=>up("tono",e.target.value)}>
                  {NOTAS.flatMap(n=>[n, n+"m"]).map(n=><option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Tempo (BPM) ♩=</label>
                <input style={S.input} type="number" min={40} max={240} value={data.tempo} onChange={e=>up("tempo",+e.target.value)}/>
              </div>
            </div>
            <div>
              <label style={S.label}>Categorías</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"4px" }}>
                {CATEGORIAS.map(c=>(
                  <button key={c} style={{ padding:"4px 10px", borderRadius:"20px", border:"1px solid", cursor:"pointer", fontSize:"12px", fontWeight:600, transition:"all 0.2s",
                    background: data.categoria.includes(c) ? "#6366f133" : "#2a2a4a",
                    borderColor: data.categoria.includes(c) ? "#6366f1" : "#3a3a5a",
                    color: data.categoria.includes(c) ? "#818cf8" : "#6b7280" }}
                    onClick={()=>toggleCat(c)}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "secciones" && (
        <div>
          <div style={{ ...S.between, marginBottom:"12px" }}>
            <span style={S.h3}>Secciones ({data.secciones.length})</span>
            <button style={S.btn("primary",true)} onClick={()=>setSecModal("new")}>
              <Icon name="plus" size={14}/> Agregar sección
            </button>
          </div>
          {data.secciones.length === 0 && (
            <div style={{ ...S.card, textAlign:"center", padding:"32px" }}>
              <div style={{ fontSize:"32px", marginBottom:"8px" }}>🎵</div>
              <div style={S.sub}>Agrega las secciones del canto (Verso, Coro, Puente...)</div>
            </div>
          )}
          {data.secciones.map((sec,idx)=>(
            <SeccionCard
              key={sec.id}
              sec={sec}
              semitones={0}
              onEdit={()=>setSecModal({index:idx, sec})}
              onDelete={()=>deleteSec(idx)}
              onMoveUp={()=>moveSec(idx,-1)}
              onMoveDown={()=>moveSec(idx,1)}
            />
          ))}
        </div>
      )}

      {activeTab === "ensayo" && (
        <EnsayoPanel
          ensayo={data.ensayo}
          onSave={(ensayo)=>{ up("ensayo",ensayo); }}
        />
      )}

      <div style={{ ...S.row(8), justifyContent:"flex-end", marginTop:"16px" }}>
        <button style={S.btn("secondary")} onClick={onCancel}>Cancelar</button>
        <button style={S.btn("primary")} onClick={()=>onSave(data)} disabled={!data.titulo}>
          <Icon name="save" size={16}/> {song ? "Guardar cambios" : "Crear canción"}
        </button>
      </div>
    </div>
  );
}

// ─── SONGS LIST ───────────────────────────────────────────────────────────────
function SongsList({ songs, onSelectSong, onNewSong, onEditSong, onDeleteSong, theme }) {
  const T = theme || THEMES.dark;
  const Ts = makeStyles(T);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const filtered = songs.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.titulo.toLowerCase().includes(q) || s.autor.toLowerCase().includes(q);
    const matchC = !filterCat || s.categoria.includes(filterCat);
    return matchQ && matchC;
  });

  return (
    <div>
      <div style={{ ...Ts.between, marginBottom:"16px" }}>
        <h2 style={Ts.h1}>Canciones <span style={Ts.badge(T.accent)}>{songs.length}</span></h2>
        <button style={Ts.btn("primary",true)} onClick={onNewSong}>
          <Icon name="plus" size={14}/> Nueva
        </button>
      </div>

      <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
        <div style={{ position:"relative", flex:1 }}>
          <input
            style={{ ...Ts.input, paddingLeft:"36px" }}
            placeholder="Buscar canciones..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
          <span style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:T.textSub }}>
            <Icon name="search" size={16}/>
          </span>
        </div>
        <select style={{ ...Ts.select, minWidth:"110px" }} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
          <option value="">Todas</option>
          {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 && (
        <div style={{ background:T.surface, borderRadius:"12px", padding:"40px", marginBottom:"12px", border:`1px solid ${T.border}`, textAlign:"center" }}>
          <div style={{ fontSize:"40px", marginBottom:"8px" }}>🎶</div>
          <div style={{ color:T.accent, fontWeight:700, marginBottom:"4px" }}>Sin canciones</div>
          <div style={Ts.sub}>Agrega tu primera canción con el botón "Nueva"</div>
        </div>
      )}

      {filtered.map(s => (
        <div key={s.id}
          style={{ background:T.surface, borderRadius:"12px", padding:"14px", marginBottom:"10px", border:`1px solid ${T.border}`, cursor:"pointer", transition:"border-color 0.15s" }}
          onClick={()=>onSelectSong(s)}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
          <div style={Ts.between}>
            <div style={{flex:1, minWidth:0}}>
              <div style={{ fontWeight:700, fontSize:"15px", color:T.text, marginBottom:"3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.titulo}</div>
              <div style={{ ...Ts.sub, marginBottom:"6px" }}>{s.autor}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                <span style={Ts.chip("#10b981")}>{s.tono}</span>
                <span style={Ts.chip("#6366f1")}>♩{s.tempo}</span>
                {s.categoria.slice(0,2).map(c=><span key={c} style={Ts.chip("#f59e0b")}>{c}</span>)}
                {s.secciones.length > 0 && <span style={Ts.chip(T.accentSub)}>{s.secciones.length} secc.</span>}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"4px", marginLeft:"8px" }}>
              <button style={{ ...Ts.btn("ghost",true), padding:"4px 8px" }}
                onClick={e=>{e.stopPropagation();onEditSong(s);}}>
                <Icon name="edit" size={14}/>
              </button>
              <button style={{ ...Ts.btn("ghost",true), color:"#ef4444", padding:"4px 8px" }}
                onClick={e=>{e.stopPropagation();if(confirm(`¿Eliminar "${s.titulo}"?`))onDeleteSong(s.id);}}>
                <Icon name="delete" size={14}/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SETLIST EDITOR ───────────────────────────────────────────────────────────
function SetlistEditor({ setlist, songs, onSave, onCancel, theme }) {
  const T = theme || THEMES.dark;
  const Ts = makeStyles(T);
  const [data, setData] = useState(setlist || {
    id: Date.now().toString(), nombre:"", tipo:"Domingo", fecha:"",
    cantos:[], roles:[], createdAt:Date.now(),
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("cantos");
  const up = (k,v) => setData(d=>({...d,[k]:v}));

  const addSong = (song) => {
    if (data.cantos.find(c=>c.cantoId===song.id)) return;
    up("cantos",[...data.cantos, {cantoId:song.id, tonoCustom:song.tono}]);
  };
  const removeSong = (id) => up("cantos", data.cantos.filter(c=>c.cantoId!==id));
  const moveItem = (idx,dir) => {
    const arr=[...data.cantos]; const t=idx+dir;
    if(t<0||t>=arr.length)return;
    [arr[idx],arr[t]]=[arr[t],arr[idx]]; up("cantos",arr);
  };
  const filteredSongs = songs.filter(s=>
    !data.cantos.find(c=>c.cantoId===s.id) &&
    (s.titulo.toLowerCase().includes(search.toLowerCase()) || s.autor.toLowerCase().includes(search.toLowerCase()))
  );
  function exportSetlistFreeShow() {
    const slides = data.cantos.flatMap(c => {
      const song = songs.find(s=>s.id===c.cantoId); if (!song) return [];
      const sem = NOTAS.indexOf(c.tonoCustom.replace("m","")) - NOTAS.indexOf(song.tono.replace("m",""));
      return songToFreeShow(song, sem).slides.map(sl=>({...sl, group:song.titulo+" - "+sl.group}));
    });
    const json = JSON.stringify({name:data.nombre, slides, metadata:{exportedFrom:"Alabanza PWA"}},null,2);
    const blob=new Blob([json],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`setlist_${data.nombre.replace(/\s/g,"_")}.json`; a.click();
  }

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <div style={{ ...Ts.between, marginBottom:"16px" }}>
        <h2 style={Ts.h1}>{setlist ? "Editar Setlist" : "Nuevo Setlist"}</h2>
        <button style={Ts.btn("ghost",true)} onClick={onCancel}><Icon name="close" size={20}/></button>
      </div>
      <div style={{ ...Ts.card, marginBottom:"10px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={Ts.label}>Nombre</label>
            <input style={Ts.input} value={data.nombre} onChange={e=>up("nombre",e.target.value)} placeholder="Ej: Domingo 29 Jun..."/>
          </div>
          <div><label style={Ts.label}>Tipo</label>
            <select style={{ ...Ts.select, width:"100%" }} value={data.tipo} onChange={e=>up("tipo",e.target.value)}>
              {["Domingo","Miércoles","Ayuno","Especial","Ensayo","Jóvenes","Damas","Vigilia"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={Ts.label}>Fecha</label>
            <input style={Ts.input} type="date" value={data.fecha} onChange={e=>up("fecha",e.target.value)}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:"4px", background:T.surface, borderRadius:"10px", padding:"3px", border:`1px solid ${T.border}`, marginBottom:"10px" }}>
        {[["cantos",`🎵 Cantos (${data.cantos.length})`],["roles",`👥 Músicos (${(data.roles||[]).length})`]].map(([k,l])=>(
          <button key={k} style={{ flex:1, padding:"8px", border:"none", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:600,
            background:activeTab===k?T.accent:"transparent", color:activeTab===k?"#fff":T.textSub }}
            onClick={()=>setActiveTab(k)}>{l}</button>
        ))}
      </div>
      {activeTab === "cantos" && (
        <>
          <div style={{ ...Ts.card, marginBottom:"10px" }}>
            <div style={{ ...Ts.between, marginBottom:"10px" }}>
              <span style={Ts.h3}>Orden</span>
              {data.cantos.length>0 && <button style={Ts.btn("success",true)} onClick={exportSetlistFreeShow}><Icon name="export" size={14}/> FreeShow</button>}
            </div>
            {data.cantos.length === 0
              ? <div style={{ textAlign:"center", padding:"20px", color:T.textSub }}>Busca canciones abajo para agregar</div>
              : data.cantos.map((c,idx)=>{
                  const song=songs.find(s=>s.id===c.cantoId); if(!song) return null;
                  return (
                    <div key={c.cantoId} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px", background:T.surface2, borderRadius:"8px", marginBottom:"6px", border:`1px solid ${T.border}` }}>
                      <span style={{ color:T.textSub, fontWeight:800, minWidth:"22px" }}>{idx+1}</span>
                      <div style={{flex:1}}>
                        <div style={{ fontWeight:600, fontSize:"14px", color:T.text }}>{song.titulo}</div>
                        <div style={{ fontSize:"11px", color:T.textSub }}>{song.autor}</div>
                      </div>
                      <select style={{ ...Ts.select, padding:"4px 8px", fontSize:"12px" }} value={c.tonoCustom}
                        onChange={e=>up("cantos",data.cantos.map((x,i)=>i===idx?{...x,tonoCustom:e.target.value}:x))}>
                        {NOTAS.flatMap(n=>[n,n+"m"]).map(n=><option key={n}>{n}</option>)}
                      </select>
                      <button style={Ts.btn("ghost",true)} onClick={()=>moveItem(idx,-1)}>▲</button>
                      <button style={Ts.btn("ghost",true)} onClick={()=>moveItem(idx,1)}>▼</button>
                      <button style={{ ...Ts.btn("ghost",true), color:"#ef4444" }} onClick={()=>removeSong(c.cantoId)}><Icon name="close" size={14}/></button>
                    </div>
                  );
                })
            }
          </div>
          <div style={Ts.card}>
            <span style={Ts.h3}>Agregar canciones</span>
            <input style={{ ...Ts.input, margin:"8px 0" }} placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/>
            <div style={{ maxHeight:"200px", overflowY:"auto" }}>
              {filteredSongs.slice(0,10).map(s=>(
                <div key={s.id} style={{ ...Ts.between, padding:"8px", borderBottom:`1px solid ${T.border}`, cursor:"pointer" }} onClick={()=>addSong(s)}>
                  <div><div style={{ fontSize:"13px", fontWeight:600, color:T.text }}>{s.titulo}</div><div style={Ts.sub}>{s.autor} · {s.tono}</div></div>
                  <Icon name="plus" size={16}/>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {activeTab === "roles" && (
        <div style={Ts.card}>
          <RolesPanel roles={data.roles||[]} onChange={r=>up("roles",r)} theme={T}/>
        </div>
      )}
      <div style={{ ...Ts.row(8), justifyContent:"flex-end", marginTop:"16px" }}>
        <button style={Ts.btn("secondary")} onClick={onCancel}>Cancelar</button>
        <button style={Ts.btn("primary")} onClick={()=>onSave(data)} disabled={!data.nombre}><Icon name="save" size={16}/> Guardar</button>
      </div>
    </div>
  );
}


// ─── SETLISTS ─────────────────────────────────────────────────────────────────
function SetlistsPanel({ setlists, songs, onNew, onEdit, onDelete, onSelectSetlist, theme }) {
  const T = theme || THEMES.dark;
  const Ts = makeStyles(T);
  const sorted = [...setlists].sort((a,b)=>b.fecha>a.fecha?1:-1);
  return (
    <div>
      <div style={{ ...Ts.between, marginBottom:"16px" }}>
        <h2 style={Ts.h1}>Setlists <span style={Ts.badge(T.accent)}>{setlists.length}</span></h2>
        <button style={Ts.btn("primary",true)} onClick={onNew}><Icon name="plus" size={14}/> Nuevo</button>
      </div>
      {sorted.length === 0 && (
        <div style={{ ...Ts.card, textAlign:"center", padding:"40px" }}>
          <div style={{ fontSize:"40px", marginBottom:"8px" }}>📋</div>
          <div style={{ color:T.accent, fontWeight:700 }}>Sin setlists</div>
          <div style={Ts.sub}>Crea un setlist para organizar tus canciones por servicio</div>
        </div>
      )}
      {sorted.map(sl=>(
        <div key={sl.id}
          style={{ background:T.surface, borderRadius:"12px", padding:"14px", marginBottom:"10px", border:`1px solid ${T.border}`, cursor:"pointer", transition:"border-color 0.2s" }}
          onClick={()=>onSelectSetlist(sl)}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
          <div style={Ts.between}>
            <div style={{flex:1}}>
              <div style={{ fontWeight:700, fontSize:"15px", color:T.text, marginBottom:"3px" }}>{sl.nombre}</div>
              <div style={{ ...Ts.sub, marginBottom:"8px" }}>{sl.fecha} · {sl.tipo}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                <span style={Ts.chip("#6366f1")}>{sl.cantos.length} cantos</span>
                <span style={Ts.chip("#10b981")}>{sl.tipo}</span>
                {(sl.roles||[]).length > 0 && <span style={Ts.chip("#f59e0b")}>👥 {sl.roles.length} músicos</span>}
              </div>
            </div>
            <div style={{ display:"flex", gap:"4px", marginLeft:"8px" }}>
              <button style={Ts.btn("ghost",true)} onClick={e=>{e.stopPropagation();onEdit(sl);}}>
                <Icon name="edit" size={14}/>
              </button>
              <button style={{ ...Ts.btn("ghost",true), color:"#ef4444" }}
                onClick={e=>{e.stopPropagation();if(confirm("¿Eliminar setlist?"))onDelete(sl.id);}}>
                <Icon name="delete" size={14}/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SETLIST VIEW ─────────────────────────────────────────────────────────────
function SetlistView({ setlist, songs, onBack, onEdit, onSelectSong, theme }) {
  const T = theme || THEMES.dark;
  const Ts = makeStyles(T);
  const [tab, setTab] = useState("cantos"); // cantos | roles

  function exportAll() {
    const slides = setlist.cantos.flatMap(c => {
      const song = songs.find(s=>s.id===c.cantoId); if (!song) return [];
      const sem = NOTAS.indexOf(c.tonoCustom.replace("m","")) - NOTAS.indexOf(song.tono.replace("m",""));
      return songToFreeShow(song, sem).slides.map(sl=>({...sl, group:song.titulo+" · "+sl.group}));
    });
    const json = JSON.stringify({name:setlist.nombre,slides,metadata:{exportedFrom:"Alabanza PWA"}},null,2);
    const blob=new Blob([json],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`${setlist.nombre.replace(/\s/g,"_")}.json`; a.click();
  }

  const roles = setlist.roles || [];

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${T.accent}22,${T.surface})`, borderRadius:"12px", padding:"14px", marginBottom:"10px", border:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
          <button style={Ts.btn("ghost",true)} onClick={onBack}><Icon name="back" size={18}/></button>
          <div style={{flex:1}}>
            <div style={Ts.h1}>{setlist.nombre}</div>
            <div style={Ts.sub}>{setlist.fecha} · {setlist.tipo}</div>
          </div>
          <button style={Ts.btn("ghost",true)} onClick={onEdit}><Icon name="edit" size={16}/></button>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
          <span style={Ts.chip("#10b981")}>{setlist.cantos.length} cantos</span>
          {roles.length>0 && <span style={Ts.chip("#f59e0b")}>👥 {roles.length} músicos</span>}
          <button style={Ts.btn("primary",true)} onClick={exportAll}>
            <Icon name="export" size={14}/> Exportar a FreeShow
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:"4px", background:T.surface, borderRadius:"10px", padding:"3px", border:`1px solid ${T.border}`, marginBottom:"10px" }}>
        {[["cantos","🎵 Cantos"],["roles","👥 Músicos"]].map(([k,l])=>(
          <button key={k} style={{ flex:1, padding:"8px", border:"none", borderRadius:"7px", cursor:"pointer", fontSize:"13px", fontWeight:600,
            background:tab===k?T.accent:"transparent", color:tab===k?"#fff":T.textSub }}
            onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {/* Cantos */}
      {tab === "cantos" && setlist.cantos.map((c,idx)=>{
        const song = songs.find(s=>s.id===c.cantoId); if(!song) return null;
        const sem = NOTAS.indexOf(c.tonoCustom.replace("m","")) - NOTAS.indexOf(song.tono.replace("m",""));
        return (
          <div key={c.cantoId}
            style={{ background:T.surface, borderRadius:"10px", padding:"12px 14px", marginBottom:"8px", border:`1px solid ${T.border}`, cursor:"pointer", display:"flex", alignItems:"center", gap:"12px", transition:"border-color 0.15s" }}
            onClick={()=>onSelectSong(song)}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
            onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
            <div style={{ background:T.accent+"22", color:T.accentSub, borderRadius:"8px", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"15px", flexShrink:0 }}>
              {idx+1}
            </div>
            <div style={{flex:1}}>
              <div style={{ fontWeight:700, fontSize:"15px", color:T.text, marginBottom:"2px" }}>{song.titulo}</div>
              <div style={Ts.sub}>{song.autor}</div>
            </div>
            <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
              <span style={Ts.chip("#10b981")}>{c.tonoCustom}</span>
              {sem!==0 && <span style={{ ...Ts.sub, fontSize:"10px" }}>{sem>0?`+${sem}`:sem}st</span>}
              <span style={Ts.chip("#6366f1")}>♩{song.tempo}</span>
            </div>
          </div>
        );
      })}

      {/* Roles */}
      {tab === "roles" && (
        <div style={Ts.card}>
          {roles.length === 0
            ? <div style={{ textAlign:"center", padding:"24px", color:T.textSub }}>No hay músicos asignados a este servicio</div>
            : roles.map(r=>(
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:T.accent+"33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>🎵</div>
                <div>
                  <div style={{ fontWeight:700, color:T.text }}>{r.nombre}</div>
                  <div style={{ fontSize:"12px", color:T.accentSub }}>{r.rol}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePanel({ songs, setlists, onGoSongs, onGoSetlists, onGoCalendar, onSelectSong, onSelectSetlist, theme }) {
  const T = theme || THEMES.dark;
  const Ts = makeStyles(T);
  const todayStr = new Date().toISOString().slice(0,10);
  const now = new Date();
  const dayNames = ["dom","lun","mar","mié","jue","vie","sáb"];
  const upcoming = [...setlists].filter(s=>s.fecha>=todayStr).sort((a,b)=>a.fecha>b.fecha?1:-1);
  const nextSetlist = upcoming[0];
  const recent = [...songs].sort((a,b)=>b.createdAt-a.createdAt).slice(0,3);

  // Días visibles en la mini-calendar strip (hoy y 2 siguientes)
  const dayStrip = [0,1,2].map(i=>{
    const d = new Date(now); d.setDate(d.getDate()+i);
    return { label:dayNames[d.getDay()], num:d.getDate(), isToday:i===0 };
  });

  return (
    <div>
      {/* ── Encabezado tipo OnStage ── */}
      <div style={{ marginBottom:"16px" }}>
        <h1 style={{ ...Ts.h1, fontSize:"26px", marginBottom:"2px" }}>Inicio</h1>
      </div>

      {/* ── Fila top: Equipo + Calendario ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"10px" }}>
        {/* Equipo / Nombre app */}
        <div style={{ background:T.surface, borderRadius:"14px", padding:"14px", border:`1px solid ${T.border}`, minHeight:"110px" }}>
          <div style={{ fontSize:"11px", color:T.textSub, fontWeight:700, marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
            Equipo actual
          </div>
          <div style={{ fontWeight:800, fontSize:"18px", color:T.text, lineHeight:1.2, marginBottom:"4px" }}>Dunamis Adoración</div>
          <div style={{ fontSize:"12px", color:T.textSub }}>{songs.length} canciones</div>
        </div>

        {/* Mini calendario con próximas fechas */}
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {/* Strip de 3 días */}
          <div style={{ background:T.surface, borderRadius:"14px", padding:"12px 14px", border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              {dayStrip.map((d,i)=>(
                <div key={i} style={{ textAlign:"center", flex:1 }}>
                  <div style={{ fontSize:"11px", color:T.textSub, marginBottom:"2px" }}>{d.label}</div>
                  <div style={{ fontWeight: d.isToday?800:600, fontSize: d.isToday?"22px":"16px", color: d.isToday?T.accent:T.textMid }}>
                    {d.num}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favoritos / Songs rápido */}
          <div style={{ background:T.surface, borderRadius:"14px", padding:"12px 14px", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", cursor:"pointer" }}
            onClick={onGoSongs}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"4px" }}>
                <span style={{ color:"#ef4444", fontSize:"16px" }}>♥</span>
                <span style={{ fontWeight:700, fontSize:"14px", color:T.text }}>Canciones</span>
              </div>
              <div style={{ fontWeight:800, fontSize:"24px", color:T.text }}>{songs.length}</div>
            </div>
            <div style={{ background:T.inputBg, borderRadius:"10px", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", color:T.textSub }}>
              ›
            </div>
          </div>
        </div>
      </div>

      {/* ── Próximos servicios ── */}
      <div style={{ marginBottom:"6px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <span style={{ fontWeight:700, fontSize:"16px", color:T.text }}>Próximos</span>
          <button style={{ background:"none", border:"none", color:T.accent, fontSize:"13px", cursor:"pointer", fontWeight:600 }}
            onClick={onGoCalendar}>Ver calendario →</button>
        </div>

        {upcoming.length === 0 ? (
          <div style={{ background:T.surface, borderRadius:"14px", padding:"32px 16px", border:`1px solid ${T.border}`, textAlign:"center" }}>
            <div style={{ fontSize:"36px", marginBottom:"8px" }}>📅</div>
            <div style={{ fontWeight:700, color:T.textMid, marginBottom:"4px" }}>Nada planificado todavía</div>
            <div style={{ fontSize:"12px", color:T.textSub }}>No hay setlists con fecha asignada aún</div>
            <button style={{ ...Ts.btn("primary"), marginTop:"14px", justifyContent:"center" }} onClick={onGoSetlists}>
              <Icon name="plus" size={14}/> Crear setlist
            </button>
          </div>
        ) : (
          upcoming.slice(0,4).map((sl,i)=>{
            const [yyyy,mm,dd] = sl.fecha.split("-");
            const slDate = new Date(sl.fecha+"T00:00:00");
            const dayName = dayNames[slDate.getDay()];
            const isNext = i===0;
            return (
              <div key={sl.id}
                style={{ background:T.surface, borderRadius:"14px", padding:"14px 16px", marginBottom:"8px", border:`1px solid ${isNext?T.accent+"66":T.border}`, cursor:"pointer", display:"flex", alignItems:"center", gap:"12px", transition:"border-color 0.15s" }}
                onClick={()=>onSelectSetlist(sl)}>
                {/* Fecha badge */}
                <div style={{ background:isNext?T.accent:T.inputBg, borderRadius:"10px", width:"44px", height:"44px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:"10px", color:isNext?"#fff":T.textSub, fontWeight:600, textTransform:"uppercase" }}>{dayName}</span>
                  <span style={{ fontSize:"18px", fontWeight:800, color:isNext?"#fff":T.text, lineHeight:1 }}>{dd}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{ fontWeight:700, fontSize:"15px", color:T.text, marginBottom:"2px" }}>{sl.nombre}</div>
                  <div style={{ fontSize:"12px", color:T.textSub }}>{sl.tipo} · {sl.cantos.length} cantos{(sl.roles||[]).length>0?` · ${sl.roles.length} músicos`:""}</div>
                </div>
                {isNext && (
                  <span style={{ fontSize:"11px", background:T.accent+"22", color:T.accent, borderRadius:"8px", padding:"3px 8px", fontWeight:700 }}>Próximo</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Canciones recientes ── */}
      {recent.length > 0 && (
        <div style={{ background:T.surface, borderRadius:"14px", border:`1px solid ${T.border}`, overflow:"hidden", marginTop:"8px" }}>
          <div style={{ padding:"12px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:700, fontSize:"14px", color:T.text }}>Añadidas recientemente</span>
            <button style={{ background:"none", border:"none", color:T.accent, fontSize:"12px", cursor:"pointer", fontWeight:600 }} onClick={onGoSongs}>Ver todas →</button>
          </div>
          {recent.map((s,i)=>(
            <div key={s.id}
              style={{ padding:"12px 14px", borderBottom: i<recent.length-1?`1px solid ${T.border}`:"none", display:"flex", alignItems:"center", gap:"12px", cursor:"pointer" }}
              onClick={()=>onSelectSong(s)}>
              <div style={{ background:T.accent+"22", borderRadius:"8px", width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>🎵</div>
              <div style={{flex:1}}>
                <div style={{ fontWeight:600, fontSize:"14px", color:T.text }}>{s.titulo}</div>
                <div style={{ fontSize:"11px", color:T.textSub }}>{s.autor} · {s.tono}</div>
              </div>
              <span style={{ fontSize:"11px", color:T.textSub }}>♩{s.tempo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
// ⚠️  Reemplaza estos valores con los de tu proyecto Supabase
// Supabase → Settings → API → Project URL y anon public key
const SUPABASE_URL  = "https://TU-PROYECTO.supabase.co";
const SUPABASE_KEY  = "tu-anon-key-aqui";

// Cliente Supabase mínimo sin dependencia npm (fetch directo)
// Para producción instala @supabase/supabase-js y usa el cliente oficial
const sb = {
  _headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
  _url: (table, qs="") => `${SUPABASE_URL}/rest/v1/${table}${qs}`,

  async select(table, order="titulo") {
    const r = await fetch(this._url(table, `?order=${order}&deleted=is.false`), { headers: { ...this._headers, "Prefer": "return=representation" }});
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async upsert(table, data) {
    const r = await fetch(this._url(table), {
      method: "POST",
      headers: { ...this._headers, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async softDelete(table, id) {
    const r = await fetch(this._url(table, `?id=eq.${id}`), {
      method: "PATCH",
      headers: { ...this._headers, "Prefer": "return=minimal" },
      body: JSON.stringify({ deleted: true, updated_at: new Date().toISOString() }),
    });
    if (!r.ok) throw new Error(await r.text());
  },

  // Realtime via SSE / WebSocket channel
  channel(table, callback) {
    const url = `${SUPABASE_URL}/realtime/v1/websocket?vsn=1.0.0&apikey=${SUPABASE_KEY}`;
    let ws;
    try {
      ws = new WebSocket(url.replace("https","wss").replace("http","ws"));
      ws.onopen = () => {
        ws.send(JSON.stringify({ topic:`realtime:public:${table}`, event:"phx_join", payload:{}, ref:null }));
      };
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.event === "INSERT" || msg.event === "UPDATE" || msg.event === "DELETE") {
          callback(msg.event, msg.payload?.record);
        }
      };
    } catch {}
    return { unsubscribe: () => ws?.close() };
  },
};

// ─── OFFLINE QUEUE ────────────────────────────────────────────────────────────
const Q_KEY = "alabanza_offline_queue";
function getQueue()      { try { return JSON.parse(localStorage.getItem(Q_KEY)||"[]"); } catch { return []; } }
function saveQueue(q)    { try { localStorage.setItem(Q_KEY, JSON.stringify(q)); } catch {} }
function enqueue(op)     { const q=getQueue(); q.push({...op, _id:Date.now()+Math.random()}); saveQueue(q); }
function queueSize()     { return getQueue().length; }

async function flushQueue(onProgress) {
  const q = getQueue();
  if (!q.length) return 0;
  const failed = [];
  let done = 0;
  for (const op of q) {
    try {
      if (op.type === "upsert") await sb.upsert(op.table, op.data);
      else if (op.type === "delete") await sb.softDelete(op.table, op.id);
      done++;
      onProgress?.(done, q.length);
    } catch { failed.push(op); }
  }
  saveQueue(failed);
  return done;
}

// ─── SERVICE WORKER REGISTRATION ─────────────────────────────────────────────
function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      console.log("[SW] Registrado:", reg.scope);

      // Escuchar mensaje FLUSH_QUEUE desde SW Background Sync
      navigator.serviceWorker.addEventListener("message", async (e) => {
        if (e.data?.type === "FLUSH_QUEUE") {
          await flushQueue();
          window.dispatchEvent(new Event("queue-flushed"));
        }
      });

      // Notificar actualización disponible
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.statechange === "installed" && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent("sw-update-available"));
          }
        });
      });
    } catch (e) { console.warn("[SW] No se pudo registrar:", e); }
  });
}
registerSW();

// ─── STATUS BAR ──────────────────────────────────────────────────────────────
function StatusBar({ online, syncing, pendingCount, lastSync, onSync, updateAvailable, onUpdate }) {
  if (online && pendingCount === 0 && !syncing && !updateAvailable) return null;

  return (
    <div style={{
      background: updateAvailable ? "#1e3a1e" : online ? "#1e2a1e" : "#2a1a1a",
      borderBottom: `1px solid ${updateAvailable ? "#22c55e" : online ? "#10b981" : "#ef4444"}`,
      padding: "6px 12px",
      display: "flex", alignItems: "center", gap: "8px",
      fontSize: "12px",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
        background: updateAvailable ? "#22c55e" : online ? "#10b981" : "#ef4444",
        boxShadow: `0 0 6px ${online ? "#10b981" : "#ef4444"}`,
      }}/>
      <span style={{ flex: 1, color: "#c8c8e0" }}>
        {updateAvailable
          ? "Nueva versión disponible"
          : syncing
          ? "⏳ Sincronizando..."
          : !online
          ? `Sin conexión · ${pendingCount > 0 ? `${pendingCount} cambios pendientes` : "modo local"}`
          : pendingCount > 0
          ? `${pendingCount} cambios por sincronizar`
          : `Sincronizado ${lastSync ? new Date(lastSync).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}) : ""}`
        }
      </span>
      {updateAvailable && (
        <button onClick={onUpdate} style={{ background:"#22c55e22", color:"#22c55e", border:"1px solid #22c55e44", borderRadius:"6px", padding:"2px 10px", cursor:"pointer", fontSize:"11px", fontWeight:700 }}>
          Actualizar
        </button>
      )}
      {online && pendingCount > 0 && !syncing && (
        <button onClick={onSync} style={{ background:"#10b98122", color:"#10b981", border:"1px solid #10b98144", borderRadius:"6px", padding:"2px 10px", cursor:"pointer", fontSize:"11px", fontWeight:700 }}>
          Sincronizar
        </button>
      )}
    </div>
  );
}

// ─── AUTH PANEL ──────────────────────────────────────────────────────────────
function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [skipAuth, setSkipAuth] = useState(false);

  // Permitir usar sin cuenta (modo solo local)
  if (skipAuth) { onAuth(null); return null; }

  async function handleSubmit() {
    if (!email || !pass) { setError("Completa todos los campos"); return; }
    setLoading(true); setError("");
    try {
      const endpoint = mode === "login" ? "token?grant_type=password" : "signup";
      const body = mode === "login"
        ? { email, password: pass }
        : { email, password: pass, data: { nombre } };
      const r = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error_description || data.msg || "Error de autenticación");
      // Guardar token
      localStorage.setItem("alabanza_token", data.access_token);
      localStorage.setItem("alabanza_user", JSON.stringify(data.user));
      sb._headers["Authorization"] = `Bearer ${data.access_token}`;
      onAuth(data.user);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f14", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ width:"100%", maxWidth:"360px" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ fontSize:"48px", marginBottom:"8px" }}>🎵</div>
          <h1 style={{ ...S.h1, fontSize:"24px", textAlign:"center" }}>Alabanza PWA</h1>
          <p style={{ ...S.sub, textAlign:"center" }}>Equipo de Adoración</p>
        </div>

        <div style={S.card}>
          {/* Tabs */}
          <div style={{ display:"flex", gap:"4px", background:"#12121c", borderRadius:"8px", padding:"3px", marginBottom:"16px" }}>
            {[["login","Iniciar sesión"],["register","Crear cuenta"]].map(([k,l])=>(
              <button key={k} style={{ flex:1, padding:"8px", border:"none", borderRadius:"6px", cursor:"pointer", fontSize:"13px", fontWeight:600,
                background:mode===k?"#6366f1":"transparent", color:mode===k?"#fff":"#6b7280" }}
                onClick={()=>{ setMode(k); setError(""); }}>{l}</button>
            ))}
          </div>

          <div style={{ display:"grid", gap:"10px" }}>
            {mode === "register" && (
              <div>
                <label style={S.label}>Nombre</label>
                <input style={S.input} value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre..."/>
              </div>
            )}
            <div>
              <label style={S.label}>Correo electrónico</label>
              <input style={S.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@iglesia.com"/>
            </div>
            <div>
              <label style={S.label}>Contraseña</label>
              <input style={S.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
            {error && (
              <div style={{ background:"#7f1d1d33", border:"1px solid #ef444444", borderRadius:"8px", padding:"8px 12px", color:"#fca5a5", fontSize:"12px" }}>
                {error}
              </div>
            )}
            <button style={{ ...S.btn("primary"), width:"100%", justifyContent:"center", opacity:loading?0.7:1 }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? "⏳ Procesando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </div>
        </div>

        {/* Usar sin cuenta */}
        <div style={{ textAlign:"center", marginTop:"16px" }}>
          <button style={{ ...S.btn("ghost"), color:"#6b7280", fontSize:"12px" }} onClick={()=>setSkipAuth(true)}>
            Usar sin cuenta (solo local)
          </button>
        </div>

        <div style={{ ...S.card, marginTop:"12px", borderColor:"#818cf844" }}>
          <div style={{ ...S.h3, color:"#818cf8", fontSize:"11px" }}>ℹ️ Supabase no configurado</div>
          <p style={{ ...S.sub, lineHeight:1.5, margin:0, fontSize:"11px" }}>
            Para activar sync en tiempo real, abre <code>alabanza-pwa.jsx</code> y reemplaza <code>SUPABASE_URL</code> y <code>SUPABASE_KEY</code> con los de tu proyecto.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Auth state ──────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alabanza_user")||"null"); } catch { return null; }
  });
  const [authReady, setAuthReady] = useState(false);

  // ── Theme ────────────────────────────────────────────────────────────────────
  const [themeName, setThemeName] = useStorage("pwa_theme", "dark");
  const T = THEMES[themeName] || THEMES.dark;
  const Ts = makeStyles(T);

  // ── Data state ──────────────────────────────────────────────────────────────
  const [songs, setSongs]       = useStorage("pwa_songs", DEMO_SONGS);
  const [setlists, setSetlists] = useStorage("pwa_setlists", DEMO_SETLISTS);
  const [nav, setNav]           = useState("home");
  const [view, setView]         = useState(null);

  // ── Sync state ──────────────────────────────────────────────────────────────
  const [online, setOnline]         = useState(navigator.onLine);
  const [syncing, setSyncing]       = useState(false);
  const [pendingCount, setPendingCount] = useState(queueSize);
  const [lastSync, setLastSync]     = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [toast, setToast]           = useState(null);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Restaurar token guardado
    const token = localStorage.getItem("alabanza_token");
    if (token) sb._headers["Authorization"] = `Bearer ${token}`;
    setAuthReady(true);

    // Online/offline listeners
    const goOnline  = () => { setOnline(true);  handleSync(); };
    const goOffline = () => setOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);

    // SW update available
    window.addEventListener("sw-update-available", () => setUpdateAvailable(true));

    // Queue flushed by SW background sync
    window.addEventListener("queue-flushed", () => {
      setPendingCount(queueSize());
      setLastSync(Date.now());
    });

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Cargar datos desde Supabase al autenticar
  useEffect(() => {
    if (!user || !online) return;
    loadFromSupabase();
    // Realtime
    const ch1 = sb.channel("canciones", (event, record) => {
      if (!record) return;
      if (event === "DELETE" || record.deleted) setSongs(prev => prev.filter(s=>s.id!==record.id));
      else setSongs(prev => { const idx=prev.findIndex(s=>s.id===record.id); return idx>=0?prev.map(s=>s.id===record.id?record:s):[...prev,record]; });
    });
    const ch2 = sb.channel("setlists", (event, record) => {
      if (!record) return;
      if (event === "DELETE" || record.deleted) setSetlists(prev => prev.filter(s=>s.id!==record.id));
      else setSetlists(prev => { const idx=prev.findIndex(s=>s.id===record.id); return idx>=0?prev.map(s=>s.id===record.id?record:s):[...prev,record]; });
    });
    return () => { ch1.unsubscribe(); ch2.unsubscribe(); };
  }, [user, online]);

  async function loadFromSupabase() {
    if (!online || !user) return;
    setSyncing(true);
    try {
      const [remoteSongs, remoteSetlists] = await Promise.all([
        sb.select("canciones", "titulo"),
        sb.select("setlists", "fecha"),
      ]);
      if (remoteSongs)   setSongs(remoteSongs.filter(s=>!s.deleted));
      if (remoteSetlists) setSetlists(remoteSetlists.filter(s=>!s.deleted));
      setLastSync(Date.now());
      showToast("✅ Datos sincronizados", "success");
    } catch (e) {
      console.warn("[Sync] Error al cargar:", e);
      showToast("⚠️ Sin conexión a Supabase — usando datos locales", "warn");
    } finally { setSyncing(false); }
  }

  async function handleSync() {
    if (!online || !user) return;
    setSyncing(true);
    try {
      const done = await flushQueue((d,t) => setPendingCount(t-d));
      setPendingCount(queueSize());
      await loadFromSupabase();
      if (done > 0) showToast(`✅ ${done} cambios sincronizados`, "success");
    } catch (e) { showToast("❌ Error al sincronizar", "error"); }
    finally { setSyncing(false); }
  }

  function showToast(msg, type="info") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSWUpdate() {
    navigator.serviceWorker?.controller?.postMessage({ type:"SKIP_WAITING" });
    window.location.reload();
  }

  // ── CRUD helpers con sync ───────────────────────────────────────────────────
  async function doUpsertSong(song) {
    setSongs(prev => prev.find(s=>s.id===song.id) ? prev.map(s=>s.id===song.id?song:s) : [...prev,song]);
    if (user) {
      if (!online) { enqueue({type:"upsert",table:"canciones",data:song}); setPendingCount(queueSize()); showToast("💾 Guardado localmente", "info"); }
      else { try { await sb.upsert("canciones", song); setLastSync(Date.now()); } catch { enqueue({type:"upsert",table:"canciones",data:song}); setPendingCount(queueSize()); } }
    }
    setView(null);
  }

  async function doDeleteSong(id) {
    setSongs(prev => prev.filter(s=>s.id!==id));
    setSetlists(prev => prev.map(sl=>({...sl,cantos:sl.cantos.filter(c=>c.cantoId!==id)})));
    if (user) {
      if (!online) { enqueue({type:"delete",table:"canciones",id}); setPendingCount(queueSize()); }
      else { try { await sb.softDelete("canciones", id); } catch { enqueue({type:"delete",table:"canciones",id}); setPendingCount(queueSize()); } }
    }
  }

  const updateSong = (song) => {
    setSongs(prev => prev.map(s=>s.id===song.id?song:s));
    if (user) {
      if (!online) enqueue({type:"upsert",table:"canciones",data:song});
      else sb.upsert("canciones", song).catch(() => enqueue({type:"upsert",table:"canciones",data:song}));
    }
  };

  async function doUpsertSetlist(sl) {
    setSetlists(prev => prev.find(s=>s.id===sl.id)?prev.map(s=>s.id===sl.id?sl:s):[...prev,sl]);
    if (user) {
      if (!online) { enqueue({type:"upsert",table:"setlists",data:sl}); setPendingCount(queueSize()); showToast("💾 Guardado localmente", "info"); }
      else { try { await sb.upsert("setlists", sl); setLastSync(Date.now()); } catch { enqueue({type:"upsert",table:"setlists",data:sl}); setPendingCount(queueSize()); } }
    }
    setView(null);
  }

  async function doDeleteSetlist(id) {
    setSetlists(prev => prev.filter(s=>s.id!==id));
    if (user) {
      if (!online) { enqueue({type:"delete",table:"setlists",id}); setPendingCount(queueSize()); }
      else { try { await sb.softDelete("setlists", id); } catch { enqueue({type:"delete",table:"setlists",id}); setPendingCount(queueSize()); } }
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  if (!authReady) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:T.textSub }}>⏳ Cargando...</div>
    </div>
  );

  const supabaseConfigured = SUPABASE_URL !== "https://TU-PROYECTO.supabase.co";
  if (supabaseConfigured && !user) {
    return <AuthPanel onAuth={(u) => { setUser(u); if (u) showToast("✅ Bienvenido", "success"); }} />;
  }

  // ── Props comunes de tema pasados a todos los hijos ──────────────────────
  const tp = { theme: T };

  // ── Nav items ─────────────────────────────────────────────────────────────
  const NAV_ITEMS = [
    ["home",      "home",     "Inicio"],
    ["songs",     "songs",    "Canciones"],
    ["setlists",  "setlist",  "Setlists"],
    ["calendario","calendar", "Calendario"],
  ];

  const appStyle = {
    minHeight:"100vh",
    background: T.bg,
    color: T.text,
    fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
    display:"flex", flexDirection:"column",
  };

  return (
    <div style={appStyle}>
      {/* Status bar sync */}
      <StatusBar
        online={online} syncing={syncing} pendingCount={pendingCount}
        lastSync={lastSync} onSync={handleSync}
        updateAvailable={updateAvailable} onUpdate={handleSWUpdate}
      />

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:"72px", left:"50%", transform:"translateX(-50%)", zIndex:300,
          background: T.surface, border:`1px solid ${T.border2}`, borderRadius:"10px",
          padding:"10px 20px", color:T.text, fontSize:"13px", fontWeight:600,
          boxShadow:"0 4px 20px #00000088", whiteSpace:"nowrap", pointerEvents:"none",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Views (pantallas de detalle) ── */}
      {view ? (
        <div style={{ flex:1, padding:"16px", maxWidth:"768px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
          {view.type === "viewSong" && (
            <SongView song={view.data} allSongs={songs}
              onBack={()=>setView(null)}
              onEdit={()=>setView({type:"editSong", data:view.data})}
              onUpdate={updateSong} {...tp}/>
          )}
          {view.type === "newSong" && (
            <SongEditor onSave={doUpsertSong} onCancel={()=>setView(null)} {...tp}/>
          )}
          {view.type === "editSong" && (
            <SongEditor song={view.data} onSave={doUpsertSong} onCancel={()=>setView(null)} {...tp}/>
          )}
          {view.type === "viewSetlist" && (
            <SetlistView setlist={view.data} songs={songs}
              onBack={()=>setView(null)}
              onEdit={()=>setView({type:"editSetlist", data:view.data})}
              onSelectSong={s=>setView({type:"viewSong", data:s})} {...tp}/>
          )}
          {view.type === "newSetlist" && (
            <SetlistEditor songs={songs} onSave={doUpsertSetlist} onCancel={()=>setView(null)} {...tp}/>
          )}
          {view.type === "editSetlist" && (
            <SetlistEditor setlist={view.data} songs={songs} onSave={doUpsertSetlist} onCancel={()=>setView(null)} {...tp}/>
          )}
        </div>
      ) : (
        <>
          {/* ── Bottom Navigation ── */}
          <nav style={{
            background: T.navBg,
            borderBottom: `1px solid ${T.border}`,
            display:"flex", alignItems:"center",
            padding:"0 2px", gap:"1px",
            height:"56px",
            position:"sticky", top:0, zIndex:100,
          }}>
            {NAV_ITEMS.map(([key,icon,label])=>(
              <button key={key}
                style={{
                  flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                  gap:"1px", padding:"6px 2px", border:"none", borderRadius:"8px",
                  cursor:"pointer", transition:"all 0.2s",
                  background: nav===key ? T.accent+"33" : "transparent",
                  color: nav===key ? T.accentSub : T.textSub,
                  fontSize:"9px", fontWeight: nav===key ? 700 : 500,
                }}
                onClick={()=>setNav(key)}>
                <Icon name={icon} size={20}/>
                {label}
              </button>
            ))}

            {/* Botón tema día/noche */}
            <button
              onClick={()=>setThemeName(n=>n==="dark"?"light":"dark")}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center",
                gap:"1px", padding:"6px 8px", border:"none", borderRadius:"8px",
                cursor:"pointer", background:"transparent",
                color: T.textSub, fontSize:"9px", fontWeight:500,
              }}
              title={themeName==="dark" ? "Modo día" : "Modo noche"}>
              <Icon name={themeName==="dark" ? "sun" : "moon"} size={20}/>
              {themeName==="dark" ? "Día" : "Noche"}
            </button>

            {/* Cerrar sesión */}
            {user && (
              <button
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  gap:"1px", padding:"6px 8px", border:"none", borderRadius:"8px",
                  cursor:"pointer", background:"transparent",
                  color: T.textSub, fontSize:"9px", fontWeight:500,
                }}
                onClick={()=>{
                  localStorage.removeItem("alabanza_token");
                  localStorage.removeItem("alabanza_user");
                  setUser(null);
                }}>
                <Icon name="close" size={20}/>
                Salir
              </button>
            )}
          </nav>

          {/* ── Contenido de cada tab ── */}
          <div style={{ flex:1, padding:"16px", maxWidth:"768px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
            {nav === "home" && (
              <HomePanel
                songs={songs} setlists={setlists}
                onGoSongs={()=>setNav("songs")}
                onGoSetlists={()=>setNav("setlists")}
                onGoCalendar={()=>setNav("calendario")}
                onSelectSong={s=>setView({type:"viewSong", data:s})}
                onSelectSetlist={sl=>setView({type:"viewSetlist", data:sl})}
                theme={T}
              />
            )}
            {nav === "songs" && (
              <SongsList
                songs={songs}
                onSelectSong={s=>setView({type:"viewSong", data:s})}
                onNewSong={()=>setView({type:"newSong", data:null})}
                onEditSong={s=>setView({type:"editSong", data:s})}
                onDeleteSong={doDeleteSong}
                theme={T}
              />
            )}
            {nav === "setlists" && (
              <SetlistsPanel
                setlists={setlists} songs={songs}
                onNew={()=>setView({type:"newSetlist", data:null})}
                onEdit={sl=>setView({type:"editSetlist", data:sl})}
                onDelete={doDeleteSetlist}
                onSelectSetlist={sl=>setView({type:"viewSetlist", data:sl})}
                theme={T}
              />
            )}
            {nav === "calendario" && (
              <CalendarioPanel
                setlists={setlists} songs={songs}
                onSelectSetlist={sl=>setView({type:"viewSetlist", data:sl})}
                onNewSetlist={()=>setView({type:"newSetlist", data:null})}
                theme={T}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
