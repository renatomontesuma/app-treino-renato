'use strict';

/* ================= Constantes ================= */

const STORAGE_KEY = 'treino-hipertrofia-v1';
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const GRUPOS = [
  'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Antebraço', 'Trapézio',
  'Quadríceps', 'Posteriores', 'Glúteos', 'Panturrilhas', 'Abdômen'
];
// Faixa semanal de séries por grupo muscular usada como referência para hipertrofia.
const SERIES_MIN = 10;
const SERIES_MAX = 20;
// Com foco no mês: grupos em foco ganham 1 série por exercício e vão para o início do treino.
const FOCO_MIN = 12;
const MANUT_MIN = 6;
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
// up: maior é melhor para ganho de massa. down: menor é melhor.
const MEDIDAS = [
  { key: 'peso', label: 'Peso', unit: 'kg', dir: 'up' },
  { key: 'gordura', label: 'Gordura corporal', unit: '%', dir: 'down' },
  { key: 'ombros', label: 'Ombros', unit: 'cm', dir: 'up' },
  { key: 'peitoral', label: 'Peitoral', unit: 'cm', dir: 'up' },
  { key: 'cintura', label: 'Cintura', unit: 'cm', dir: 'down' },
  { key: 'abdomen', label: 'Abdômen', unit: 'cm', dir: 'down' },
  { key: 'quadril', label: 'Quadril', unit: 'cm', dir: 'up' },
  { key: 'bracoD', label: 'Braço direito', unit: 'cm', dir: 'up' },
  { key: 'bracoE', label: 'Braço esquerdo', unit: 'cm', dir: 'up' },
  { key: 'antebraco', label: 'Antebraço', unit: 'cm', dir: 'up' },
  { key: 'coxaD', label: 'Coxa direita', unit: 'cm', dir: 'up' },
  { key: 'coxaE', label: 'Coxa esquerda', unit: 'cm', dir: 'up' },
  { key: 'panturrilha', label: 'Panturrilha', unit: 'cm', dir: 'up' }
];

const uid = () => Math.random().toString(36).slice(2, 10);
const ex = (name, muscle, sets, repMin, repMax, rest) =>
  ({ id: uid(), name, muscle, sets, repMin, repMax, rest, videoUrl: '', hasVideo: false, notes: '' });

/* Plano inicial: cada grupo muscular treinado 2x por semana. Tudo é editável. */
function planoInicial() {
  const empurrar = { id: 'empurrar', name: 'Empurrar: peito, ombros e tríceps', exercises: [
    ex('Supino reto com halteres', 'Peito', 4, 6, 10, 120),
    ex('Supino inclinado com halteres', 'Peito', 3, 8, 12, 90),
    ex('Desenvolvimento com halteres', 'Ombros', 3, 8, 12, 90),
    ex('Elevação lateral', 'Ombros', 3, 12, 15, 60),
    ex('Tríceps na polia', 'Tríceps', 4, 10, 12, 60),
    ex('Tríceps francês', 'Tríceps', 3, 10, 12, 60)
  ]};
  const puxar = { id: 'puxar', name: 'Puxar: costas e bíceps', exercises: [
    ex('Puxada frontal', 'Costas', 4, 8, 12, 90),
    ex('Remada cavalinho apoiada', 'Costas', 4, 6, 10, 120),
    ex('Remada sentada articulada', 'Costas', 3, 10, 12, 90),
    ex('Crucifixo inverso', 'Ombros', 3, 12, 15, 60),
    ex('Encolhimento', 'Trapézio', 3, 10, 15, 60),
    ex('Rosca direta', 'Bíceps', 4, 8, 12, 60),
    ex('Rosca martelo', 'Bíceps', 3, 10, 12, 60)
  ]};
  const pernas = { id: 'pernas', name: 'Pernas completo', exercises: [
    ex('Agachamento livre', 'Quadríceps', 4, 6, 10, 150),
    ex('Leg press', 'Quadríceps', 3, 10, 12, 120),
    ex('Stiff', 'Posteriores', 3, 8, 12, 120),
    ex('Mesa flexora', 'Posteriores', 3, 10, 12, 60),
    ex('Elevação pélvica', 'Glúteos', 3, 8, 12, 90),
    ex('Panturrilha em pé', 'Panturrilhas', 4, 10, 15, 60)
  ]};
  const superiores = { id: 'superiores', name: 'Superiores', exercises: [
    ex('Supino reto com halteres', 'Peito', 3, 8, 12, 120),
    ex('Crucifixo na polia', 'Peito', 3, 12, 15, 60),
    ex('Barra fixa ou puxada', 'Costas', 3, 6, 10, 120),
    ex('Remada unilateral', 'Costas', 3, 10, 12, 90),
    ex('Elevação lateral na polia', 'Ombros', 3, 12, 15, 60),
    ex('Rosca simultânea sentado', 'Bíceps', 3, 10, 12, 60),
    ex('Tríceps testa', 'Tríceps', 3, 10, 12, 60)
  ]};
  const inferiores = { id: 'inferiores', name: 'Inferiores e abdômen', exercises: [
    ex('Agachamento búlgaro', 'Quadríceps', 3, 8, 12, 90),
    ex('Cadeira extensora', 'Quadríceps', 3, 12, 15, 60),
    ex('Levantamento terra romeno', 'Posteriores', 3, 8, 10, 120),
    ex('Cadeira flexora', 'Posteriores', 3, 10, 12, 60),
    ex('Abdução de quadril', 'Glúteos', 3, 12, 15, 60),
    ex('Panturrilha sentado', 'Panturrilhas', 4, 12, 15, 60),
    { ...ex('Abdominal na máquina', 'Abdômen', 5, 60, 60, 60), bodyweight: true }
  ]};
  return {
    workouts: [empurrar, puxar, pernas, superiores, inferiores],
    schedule: { 0: null, 1: 'empurrar', 2: 'puxar', 3: 'pernas', 4: null, 5: 'superiores', 6: 'inferiores' },
    logs: [],
    active: null,
    focus: {},
    measures: [],
    sources: [],
    planVersion: PLAN_VERSION
  };
}

// Padrão de séries do Renato: 3 séries de 6 a 10 reps. Abdominal na máquina: 5 × 60 sem carga.
const PLAN_VERSION = 7;

// Vídeos de referência do YouTube, em português, escolhidos pelo título e pelo canal.
const VIDEOS_INTERNET = {
  'Supino reto com halteres': '_80XeL-IBvY',
  'Supino reto com barra': 'TukK2WRI4C4',
  'Supino inclinado com halteres': 'G-i3jMIbDmo',
  'Desenvolvimento com halteres': 'IDOZyXHq7aI',
  'Elevação lateral': 'gURBTU9VSJg',
  'Tríceps na polia': 'Npv_xl76XWM',
  'Tríceps francês': 'o_mAVpMIBJs',
  'Puxada frontal': 'BOW9my4J_ek',
  'Remada curvada': 's4jeKLRghTM',
  'Remada baixa': '2YebbYuuBJQ',
  'Remada cavalinho apoiada': '1irSxCGkkpY',
  'Remada sentada articulada': 'iquR4cGPHOU',
  'Crucifixo inverso': 'r1efeCcUW-8',
  'Encolhimento': 'BrwUPSLC_hE',
  'Rosca direta': '85f7ODu2ztA',
  'Rosca martelo': 'pTyVDap5HaI',
  'Agachamento livre': 'rM6SDUdl9fs',
  'Leg press': 'itJDw9I1qu4',
  'Stiff': 'BHfY5-jGNDA',
  'Mesa flexora': '8Nat6GRiEoc',
  'Elevação pélvica': 'kvmT_ZlgVI0',
  'Panturrilha em pé': 'bZLNCtGI418',
  'Supino inclinado com barra': '7lm16JD0S08',
  'Crucifixo na polia': 'ifwx2iuv4kA',
  'Barra fixa ou puxada': '_wH1BwSL_qg',
  'Remada unilateral': 'VoGNKTI5wG8',
  'Elevação lateral na polia': 'BH9jVp2cx3w',
  'Rosca alternada': 'pdzDa9CwJ2Y',
  'Rosca simultânea sentado': 'ZyyKajRggvM',
  'Tríceps testa': 'gZ2gzw7lLQk',
  'Agachamento búlgaro': 'a3-bQbTdA_0',
  'Cadeira extensora': '--p0Ff7R-Io',
  'Levantamento terra romeno': '3YmW6SEkat0',
  'Cadeira flexora': 'E59lnzU_LE4',
  'Abdução de quadril': '50qHGus1TZk',
  'Panturrilha sentado': '7hbYg4-NZ74',
  'Abdominal na máquina': '1l0yf6eWh3Y'
};
// Preenche só exercícios sem link. Não troca links que você já colocou.
function applyVideosV3(st) {
  st.workouts.forEach(w => w.exercises.forEach(e => {
    const id = VIDEOS_INTERNET[e.name];
    if (id && !e.videoUrl) e.videoUrl = `https://www.youtube.com/watch?v=${id}`;
  }));
  st.planVersion = 3;
  return st;
}

// Renato faz os supinos com halteres. Troca as versões com barra pela versão com halteres.
const SUPINO_HALTERES = { 'Supino reto com barra': 'Supino reto com halteres', 'Supino inclinado com barra': 'Supino reto com halteres' };
// Troca um exercício por outro no mesmo lugar do treino. Mantém vídeo próprio, trecho do personal e link
// colocado à mão. Carga de um equipamento não se compara com a de outro: o histórico antigo fica separado.
function swapExercises(st, map, tag) {
  st.workouts.forEach(w => w.exercises.forEach(e => {
    const novo = map[e.name];
    if (!novo) return;
    const oldDefault = `https://www.youtube.com/watch?v=${VIDEOS_INTERNET[e.name]}`;
    (st.logs || []).forEach(l => l.entries.forEach(en => { if (en.exId === e.id) en.exId = tag + '_' + e.id; }));
    e.name = novo;
    if (!e.videoUrl || e.videoUrl === oldDefault) e.videoUrl = `https://www.youtube.com/watch?v=${VIDEOS_INTERNET[novo]}`;
  }));
}

function applySupinoV4(st) {
  swapExercises(st, SUPINO_HALTERES, 'barra');
  st.workouts.forEach(w => w.exercises.forEach(e => {
    if (/halteres/i.test(e.name) && /supino/i.test(e.name) && !e.notes) e.notes = 'Registre o peso de cada halter.';
  }));
  st.planVersion = 4;
  return st;
}

// Remadas nas máquinas que o Renato usa. A cavalinho apoiada poupa a lombar em relação à remada curvada.
function applyRemadasV5(st) {
  swapExercises(st, { 'Remada curvada': 'Remada cavalinho apoiada', 'Remada baixa': 'Remada sentada articulada' }, 'remada');
  st.planVersion = 5;
  return st;
}

function applyRoscaV6(st) {
  swapExercises(st, { 'Rosca alternada': 'Rosca simultânea sentado' }, 'rosca');
  st.workouts.forEach(w => w.exercises.forEach(e => {
    if (e.name === 'Rosca simultânea sentado' && !e.notes) e.notes = 'Registre o peso de cada halter.';
  }));
  st.planVersion = 6;
  return st;
}

// Semana de 6 dias (segunda a sábado) e domingo opcional. Cada grupo continua com 2 estímulos por semana,
// com pelo menos 48 h entre eles. O sábado reforça ombros e braços, que estavam abaixo de 10 séries.
const SEMANA_ANTIGA = { 0: null, 1: 'empurrar', 2: 'puxar', 3: 'pernas', 4: null, 5: 'superiores', 6: 'inferiores' };
function exV7(name, muscle, extra = {}) {
  const id = VIDEOS_INTERNET[name];
  return { ...ex(name, muscle, 3, 6, 10, 90), videoUrl: id ? `https://www.youtube.com/watch?v=${id}` : '', ...extra };
}
function applySemanaV7(st) {
  if (!st.workouts.some(w => w.id === 'ombros-bracos')) st.workouts.push({ id: 'ombros-bracos', name: 'Ombros e braços', exercises: [
    exV7('Desenvolvimento com halteres', 'Ombros', { notes: 'Registre o peso de cada halter.' }),
    exV7('Elevação lateral', 'Ombros'),
    exV7('Rosca direta', 'Bíceps'),
    exV7('Rosca martelo', 'Bíceps'),
    exV7('Tríceps na polia', 'Tríceps'),
    exV7('Tríceps francês', 'Tríceps')
  ]});
  if (!st.workouts.some(w => w.id === 'domingo')) st.workouts.push({ id: 'domingo', name: 'Domingo opcional: abdômen e panturrilhas', exercises: [
    exV7('Abdominal na máquina', 'Abdômen', { sets: 5, repMin: 60, repMax: 60, rest: 60, bodyweight: true }),
    exV7('Panturrilha em pé', 'Panturrilhas'),
    exV7('Panturrilha sentado', 'Panturrilhas')
  ]});
  const same = Object.keys(SEMANA_ANTIGA).every(d => (st.schedule[d] ?? null) === SEMANA_ANTIGA[d]);
  if (same) st.schedule = { 0: null, 1: 'empurrar', 2: 'puxar', 3: 'pernas', 4: 'superiores', 5: 'inferiores', 6: 'ombros-bracos' };
  st.optional = { 0: 'domingo', ...(st.optional || {}) };
  st.planVersion = 7;
  return st;
}

// Exercício repetido em outro dia (mesmo nome) usa o seu vídeo, se ele ainda não tiver um.
async function shareOwnVideos() {
  const all = state.workouts.flatMap(w => w.exercises);
  let changed = false;
  for (const e of all.filter(x => !x.hasVideo)) {
    const twin = all.find(x => x.hasVideo && norm(x.name) === norm(e.name));
    if (!twin) continue;
    const blob = await videoDB.get(twin.id).catch(() => null);
    if (!blob) continue;
    try { await videoDB.put(e.id, blob); e.hasVideo = true; changed = true; } catch (err) { break; }
  }
  if (changed) { save(); render(); }
}
const isAbMachine = e => /abdominal/i.test(e.name) && /m[aá]quina|polia/i.test(e.name);
function applyPlanV2(st) {
  st.workouts.forEach(w => {
    w.exercises = w.exercises.filter(e => !/^prancha/i.test(e.name));
    w.exercises.forEach(e => {
      if (isAbMachine(e)) Object.assign(e, { name: 'Abdominal na máquina', sets: 5, repMin: 60, repMax: 60, bodyweight: true });
      else if (!e.bodyweight) Object.assign(e, { sets: 3, repMin: 6, repMax: 10 });
    });
  });
  st.planVersion = 2;
  return st;
}

/* ================= Estado ================= */

let state = load();
let tab = 'hoje';
let viewWorkoutId = null; // treino escolhido manualmente na aba Hoje

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const st = { focus: {}, measures: [], sources: [], ...JSON.parse(raw) };
      if ((st.planVersion || 1) < 2 && !st.active) applyPlanV2(st);
      if ((st.planVersion || 1) === 2) applyVideosV3(st);
      if ((st.planVersion || 1) === 3 && !st.active) applySupinoV4(st);
      if ((st.planVersion || 1) === 4 && !st.active) applyRemadasV5(st);
      if ((st.planVersion || 1) === 5 && !st.active) applyRoscaV6(st);
      if ((st.planVersion || 1) === 6) applySemanaV7(st);
      return st;
    }
  } catch (e) { /* segue com o plano inicial */ }
  return applySemanaV7(applyRoscaV6(applyRemadasV5(applySupinoV4(applyVideosV3(applyPlanV2(planoInicial()))))));
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { alert('Não consegui salvar os dados no aparelho.'); }
}

const getWorkout = id => state.workouts.find(w => w.id === id);
const findExercise = id => {
  for (const w of state.workouts) {
    const e = w.exercises.find(x => x.id === id);
    if (e) return { workout: w, exercise: e };
  }
  return null;
};
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const monthKey = (iso = todayISO()) => iso.slice(0, 7);
const monthLabel = key => { const [y, m] = key.split('-'); return `${MESES[Number(m) - 1]} de ${y}`; };
const focusNow = () => state.focus[monthKey()] || [];
const isFocus = e => focusNow().includes(e.muscle);
const effSets = e => isFocus(e) ? Math.min(Number(e.sets) + 1, 6) : Number(e.sets);
// Grupos em foco primeiro: o músculo trabalhado no início da sessão rende mais.
const ordered = w => [...w.exercises].sort((a, b) => isFocus(b) - isFocus(a));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = iso => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DIAS[dt.getDay()]}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
};
const fmtSet = (e, s) => e?.bodyweight ? `${s.reps || 0} reps` : `${s.kg || 0}kg×${s.reps || 0}`;
const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.abs(s % 60)).padStart(2, '0')}`;
const num = v => {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

/* ================= Vídeos (IndexedDB) ================= */

const videoDB = (() => {
  let dbp;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const req = indexedDB.open('treino-videos', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('videos');
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  }));
  const tx = async (mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction('videos', mode);
      const r = fn(t.objectStore('videos'));
      t.oncomplete = () => res(r && r.result);
      t.onerror = () => rej(t.error);
    });
  };
  return {
    put: (key, blob) => tx('readwrite', s => s.put(blob, key)),
    get: key => tx('readonly', s => s.get(key)),
    del: key => tx('readwrite', s => s.delete(key))
  };
})();

const hasAnyVideo = e => !!(e.hasVideo || e.videoUrl || e.videoSrc);
const isVideoFile = url => /\.(mp4|mov|m4v|webm)(\?|$)/i.test(url) || url.startsWith('videos/');

function youtubeId(url) {
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

/* ================= Progressão ================= */

function lastPerformance(exId) {
  for (let i = state.logs.length - 1; i >= 0; i--) {
    const entry = state.logs[i].entries.find(e => e.exId === exId);
    if (entry && entry.sets.some(s => s.done)) return { date: state.logs[i].date, sets: entry.sets.filter(s => s.done) };
  }
  return null;
}

// Fórmula de Epley: estimativa de 1 repetição máxima a partir de carga e reps.
const e1rm = (kg, reps) => reps > 0 ? kg * (1 + reps / 30) : 0;
const fmtKg = v => (Math.round(v * 10) / 10).toLocaleString('pt-BR');

function exerciseHistory(exId) {
  const out = [];
  state.logs.forEach(l => l.entries.forEach(en => {
    if (en.exId !== exId) return;
    const sets = en.sets.filter(s => s.done && num(s.kg) > 0);
    if (!sets.length) return;
    out.push({
      date: l.date, logId: l.id, manual: !!l.manual, sets,
      top: Math.max(...sets.map(s => num(s.kg))),
      e1rm: Math.max(...sets.map(s => e1rm(num(s.kg), num(s.reps)))),
      volume: sets.reduce((a, s) => a + num(s.kg) * num(s.reps), 0)
    });
  }));
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

const bestTop = exId => Math.max(0, ...exerciseHistory(exId).map(h => h.top));

// Dupla progressão: bateu o topo da faixa em todas as séries, sobe a carga.
function suggestion(exercise, last) {
  if (exercise.bodyweight) {
    const hit = last && last.sets.length >= Number(exercise.sets) && last.sets.every(s => num(s.reps) >= exercise.repMax);
    return { type: hit ? 'up' : 'keep', text: hit
      ? `Sem carga. Você completou ${exercise.sets} × ${exercise.repMax}. Mantenha o ritmo e controle a descida.`
      : `Sem carga. Meta: ${exercise.sets} séries de ${exercise.repMax} repetições.` };
  }
  if (!last) return { type: 'keep', text: 'Primeira vez: escolha uma carga que deixe 1 a 2 repetições na reserva.' };
  const allTop = last.sets.length >= Number(exercise.sets) && last.sets.every(s => num(s.reps) >= exercise.repMax);
  const maxKg = Math.max(...last.sets.map(s => num(s.kg)));
  if (allTop && maxKg > 0) {
    const inc = maxKg < 20 ? 1 : 2.5;
    return { type: 'up', kg: maxKg + inc, text: `Você bateu ${exercise.repMax} reps em todas as séries. Suba para ${maxKg + inc} kg.` };
  }
  return { type: 'keep', text: `Mantenha a carga e busque ${exercise.repMax} reps em todas as séries.` };
}

/* ================= Sessão ativa ================= */

function startSession(workoutId) {
  const w = getWorkout(workoutId);
  if (!w) return;
  state.active = {
    workoutId, date: todayISO(), startedAt: Date.now(),
    entries: ordered(w).map(e => {
      const last = lastPerformance(e.id);
      const sug = suggestion(e, last);
      return {
        exId: e.id,
        sets: Array.from({ length: effSets(e) }, (_, i) => ({
          kg: sug.kg ?? (last?.sets[i]?.kg ?? last?.sets.at(-1)?.kg ?? ''),
          reps: '', done: false
        }))
      };
    })
  };
  save();
}

function finishSession() {
  const a = state.active;
  const w = getWorkout(a.workoutId);
  const entries = a.entries.map(en => {
    const e = w.exercises.find(x => x.id === en.exId);
    return { exId: en.exId, name: e?.name ?? '', muscle: e?.muscle ?? '', sets: en.sets };
  }).filter(en => en.sets.some(s => s.done));
  if (!entries.length) {
    if (!confirm('Nenhuma série marcada. Descartar este treino?')) return;
    state.active = null;
  } else {
    state.logs.push({
      id: uid(), date: a.date, workoutId: a.workoutId, workoutName: w?.name ?? '',
      minutes: Math.round((Date.now() - a.startedAt) / 60000), entries
    });
    state.active = null;
  }
  save();
  stopTimer();
  render();
}

/* ================= Timer de descanso ================= */

let timerEnd = 0;
let timerInt = null;
let beeped = false;

function startTimer(seconds) {
  timerEnd = Date.now() + seconds * 1000;
  beeped = false;
  document.getElementById('timer').classList.remove('hidden');
  clearInterval(timerInt);
  timerInt = setInterval(tickTimer, 250);
  tickTimer();
}
function tickTimer() {
  const left = Math.round((timerEnd - Date.now()) / 1000);
  const el = document.getElementById('timer');
  document.getElementById('timer-value').textContent = left >= 0 ? fmtTime(left) : '+' + fmtTime(-left);
  el.classList.toggle('over', left < 0);
  if (left <= 0 && !beeped) {
    beeped = true;
    beep();
    if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
  }
}
function stopTimer() {
  clearInterval(timerInt);
  document.getElementById('timer').classList.add('hidden');
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach(t => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.2;
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.15);
    });
  } catch (e) { /* sem áudio */ }
}

/* ================= Renderização ================= */

const view = document.getElementById('view');
const setHeader = (t, s = '') => {
  document.getElementById('title').textContent = t;
  document.getElementById('subtitle').textContent = s;
};

function render() {
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  ({ hoje: renderHoje, semana: renderSemana, treinos: renderTreinos, medidas: renderMedidas, historico: renderHistorico })[tab]();
}

function workoutOptions(selected, withRest) {
  return (withRest ? `<option value="">Descanso</option>` : '') +
    state.workouts.map(w => `<option value="${w.id}" ${w.id === selected ? 'selected' : ''}>${esc(w.name)}</option>`).join('');
}

function renderHoje() {
  const dow = new Date().getDay();
  setHeader('Hoje', fmtDate(todayISO()));

  if (state.active) return renderSessao();

  const scheduled = state.schedule[dow];
  const wid = viewWorkoutId ?? scheduled;
  const w = getWorkout(wid);

  let html = `<div class="card">
    <div class="muted">Programado para ${DIAS[dow].toLowerCase()}</div>
    <h2>${scheduled ? esc(getWorkout(scheduled)?.name) : 'Descanso'}</h2>
    <label>Treinar outro hoje</label>
    <select class="field" data-action="pick-workout">${workoutOptions(wid, true)}</select>
  </div>`;

  const opt = getWorkout(state.optional?.[dow]);
  if (!w && opt) {
    html += `<div class="card"><h3>Treino opcional</h3>
      <div class="muted">Hoje é descanso. Se quiser treinar, faça ${esc(opt.name.split(':').pop().trim())}: não atrapalha a recuperação dos grupos da semana.</div>
      <button class="btn block" style="margin-top:10px" data-action="start" data-id="${opt.id}">Iniciar treino opcional</button></div>`;
  }
  if (!w) {
    html += `<div class="card empty">Dia de descanso. O músculo cresce na recuperação: durma bem e bata sua meta de proteína.</div>`;
    view.innerHTML = html;
    return;
  }

  const totalSets = w.exercises.reduce((a, e) => a + effSets(e), 0);
  const foco = focusNow();
  if (foco.length) html += `<div class="hint up">Foco de ${MESES[new Date().getMonth()]}: ${foco.join(', ')}. Esses exercícios vêm primeiro e ganham 1 série.</div>`;
  html += `<button class="btn primary block" data-action="start" data-id="${w.id}">Iniciar treino (${w.exercises.length} exercícios, ${totalSets} séries)</button><div style="height:12px"></div>`;
  html += ordered(w).map(e => {
    const last = lastPerformance(e.id);
    return `<div class="card">
      <div class="row between">
        <div class="grow"><h3>${esc(e.name)} ${isFocus(e) ? '<span class="tag ok">foco</span>' : ''} ${e.hasVideo ? '' : '<span class="tag warn">gravar</span>'}</h3>
          <div class="muted">${esc(e.muscle)} · ${effSets(e)} × ${e.repMin}–${e.repMax} · ${e.rest}s</div></div>
        ${videoButton(e)}
      </div>
      ${last ? `<div class="muted" style="margin-top:6px">Última vez: ${last.sets.map(s => fmtSet(e, s)).join(', ')}</div>` : ''}
    </div>`;
  }).join('');
  view.innerHTML = html;
}

function videoButton(e) {
  return hasAnyVideo(e)
    ? `<button class="btn small video-btn" data-action="play" data-id="${e.id}">▶ Vídeo</button>`
    : `<button class="btn small" data-action="edit-ex" data-id="${e.id}">+ Vídeo</button>`;
}

function renderSessao() {
  const a = state.active;
  const w = getWorkout(a.workoutId);
  if (!w) { state.active = null; save(); return renderHoje(); }

  const all = a.entries.flatMap(en => en.sets);
  const done = all.filter(s => s.done).length;
  setHeader(w.name, `${done} de ${all.length} séries`);

  let html = `<div class="card">
    <div class="row between"><strong>Progresso</strong><span class="muted">${Math.round(done / all.length * 100)}%</span></div>
    <div class="progress"><div style="width:${done / all.length * 100}%"></div></div>
  </div>`;

  html += a.entries.map((en, ei) => {
    const e = w.exercises.find(x => x.id === en.exId);
    if (!e) return '';
    const last = lastPerformance(e.id);
    const sug = suggestion(e, last);
    const complete = en.sets.every(s => s.done);
    const prev = bestTop(e.id);
    return `<div class="card">
      <div class="row between">
        <div class="grow"><h3>${esc(e.name)} ${isFocus(e) ? '<span class="tag ok">foco</span>' : ''} ${complete ? '<span class="tag ok">feito</span>' : ''}</h3>
          <div class="muted">${esc(e.muscle)} · alvo ${e.repMin}–${e.repMax} reps · descanso ${e.rest}s</div></div>
        ${videoButton(e)}
      </div>
      ${e.notes ? `<div class="muted" style="margin-top:6px">${esc(e.notes)}</div>` : ''}
      ${last ? `<div class="muted" style="margin-top:6px">Última vez: ${last.sets.map(s => fmtSet(e, s)).join(', ')}</div>` : ''}
      <div class="hint ${sug.type}">${esc(sug.text)}</div>
      ${en.sets.some(s => s.done && prev > 0 && num(s.kg) > prev) ? `<div class="hint up">🏆 Recorde de carga: acima dos ${fmtKg(prev)} kg anteriores.</div>` : ''}
      <div class="sets">
        <div class="set head"><span class="num">#</span><span>Carga (kg)</span><span>Reps</span><span></span></div>
        ${en.sets.map((s, si) => `<div class="set ${s.done ? 'done' : ''}">
          <span class="num">${s.done && prev > 0 && num(s.kg) > prev ? '🏆' : si + 1}</span>
          ${e.bodyweight ? '<span class="num">sem carga</span>' : `<input inputmode="decimal" value="${esc(s.kg)}" placeholder="kg" data-action="set-input" data-field="kg" data-e="${ei}" data-s="${si}">`}
          <input inputmode="numeric" value="${esc(s.reps)}" placeholder="${e.repMin}–${e.repMax}" data-action="set-input" data-field="reps" data-e="${ei}" data-s="${si}">
          <button class="check" data-action="toggle-set" data-e="${ei}" data-s="${si}">✓</button>
        </div>`).join('')}
      </div>
      <div class="row" style="margin-top:8px">
        <button class="btn small" data-action="add-set" data-e="${ei}">+ série</button>
        ${en.sets.length > 1 ? `<button class="btn small" data-action="remove-set" data-e="${ei}">− série</button>` : ''}
      </div>
    </div>`;
  }).join('');

  html += `<button class="btn primary block" data-action="finish">Finalizar e salvar treino</button>
    <div style="height:8px"></div>
    <button class="btn danger block" data-action="cancel-session">Cancelar treino</button>`;
  view.innerHTML = html;
}

function weeklyVolume() {
  const vol = Object.fromEntries(GRUPOS.map(g => [g, 0]));
  Object.values(state.schedule).forEach(wid => {
    const w = getWorkout(wid);
    if (w) w.exercises.forEach(e => { vol[e.muscle] = (vol[e.muscle] || 0) + effSets(e); });
  });
  return vol;
}

function renderSemana() {
  setHeader('Semana', 'Defina o treino de cada dia');
  const today = new Date().getDay();
  const order = [1, 2, 3, 4, 5, 6, 0];
  let html = `<div class="card">` + order.map(d => `<div class="list-item">
      <strong class="grow">${DIAS[d]} ${d === today ? '<span class="tag ok">hoje</span>' : ''}</strong>
      <select class="field" style="max-width:62%" data-action="schedule" data-day="${d}">${workoutOptions(state.schedule[d], true)}</select>
    </div>`).join('') + `</div>`;

  const foco = focusNow();
  const mk = monthKey();
  const past = Object.keys(state.focus).filter(k => k !== mk && state.focus[k].length).sort().reverse();
  const focusCard = `<div class="card"><h3>Foco de ${monthLabel(mk)}</h3>
    <div class="muted">Escolha 1 a 3 grupos para priorizar. Eles ganham 1 série por exercício e abrem o treino. Os demais seguem com as séries atuais e a mesma carga, o que preserva o que você já ganhou.</div>
    <div class="chips">${GRUPOS.map(g => `<button class="chip ${foco.includes(g) ? 'on' : ''}" data-action="toggle-focus" data-g="${g}">${g}</button>`).join('')}</div>
    ${foco.length > 3 ? '<div class="hint keep">Mais de 3 grupos em foco dilui o efeito. Prefira 2 ou 3.</div>' : ''}
    ${past.length ? `<div class="muted" style="margin-top:10px">Meses anteriores: ${past.slice(0, 6).map(k => `${monthLabel(k)}: ${state.focus[k].join(', ')}`).join(' · ')}</div>` : ''}
  </div>`;
  html = focusCard + html;

  html += renderDayLists();

  const vol = weeklyVolume();
  const ref = foco.length
    ? `Grupos em foco: ${FOCO_MIN} a ${SERIES_MAX + 2} séries. Demais grupos: mínimo de ${MANUT_MIN} séries para manutenção.`
    : `Referência para hipertrofia: ${SERIES_MIN} a ${SERIES_MAX} séries semanais por grupo.`;
  html += `<div class="card"><h3>Séries por grupo muscular na semana</h3>
    <div class="muted" style="margin-bottom:8px">${ref}</div>` +
    GRUPOS.map(g => {
      const v = vol[g] || 0;
      const f = foco.includes(g);
      const min = !foco.length ? SERIES_MIN : f ? FOCO_MIN : MANUT_MIN;
      const max = f ? SERIES_MAX + 2 : SERIES_MAX;
      const color = v === 0 ? 'var(--line)' : v < min ? 'var(--warn)' : v > max ? 'var(--danger)' : 'var(--accent)';
      const okLabel = !foco.length ? 'ok' : f ? 'foco' : 'manutenção';
      const tag = v === 0 ? '' : v < min ? '<span class="tag warn">abaixo</span>' : v > max ? '<span class="tag warn">acima</span>' : `<span class="tag ok">${okLabel}</span>`;
      return `<div style="margin:8px 0">
        <div class="row between"><span>${g}</span><span class="muted">${v} séries ${tag}</span></div>
        <div class="bar"><div style="width:${Math.min(v / 25, 1) * 100}%;background:${color}"></div></div>
      </div>`;
    }).join('') + `</div>`;
  view.innerHTML = html;
}

// Exercícios sem vídeo seu, agrupados pelo primeiro dia da semana em que aparecem.
function renderToRecord() {
  const done = new Set(state.workouts.flatMap(w => w.exercises).filter(e => e.hasVideo).map(e => norm(e.name)));
  const seen = new Set();
  const days = [1, 2, 3, 4, 5, 6, 0];
  const groups = days.map(d => {
    const w = getWorkout(state.schedule[d]) || (d === 0 ? getWorkout(state.optional?.[0]) : null);
    if (!w) return null;
    const items = w.exercises.filter(e => { const k = norm(e.name); if (done.has(k) || seen.has(k)) return false; seen.add(k); return true; });
    return items.length ? { d, w, items } : null;
  }).filter(Boolean);
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  if (!total) return '<div class="hint up" style="margin-top:10px">Todos os exercícios têm vídeo seu.</div>';
  return `<details style="margin-top:10px"><summary style="cursor:pointer"><strong>Falta gravar: ${total} exercício(s)</strong></summary>
    <div class="muted" style="margin:6px 0">Cada exercício aparece no primeiro dia da semana em que você o faz. Um vídeo serve para todos os dias.</div>
    ${groups.map(g => `<div style="margin-top:8px"><strong>${DIAS[g.d]}${g.d === 0 ? ' (opcional)' : ''}</strong> <span class="muted">· ${esc(g.w.name)}</span>
      <div class="muted">${g.items.map(e => esc(e.name)).join(' · ')}</div></div>`).join('')}
  </details>`;
}

// Lista completa de cada dia, na ordem do treino, com a situação do seu vídeo em cada exercício.
function renderDayLists() {
  const today = new Date().getDay();
  const days = [1, 2, 3, 4, 5, 6, 0];
  const rows = days.map(d => {
    const w = getWorkout(state.schedule[d]) || (d === 0 ? getWorkout(state.optional?.[0]) : null);
    if (!w) return `<div class="list-item"><strong class="grow">${DIAS[d]}</strong><span class="muted">Descanso</span></div>`;
    const missing = w.exercises.filter(e => !e.hasVideo).length;
    const optional = !state.schedule[d];
    return `<details class="day" ${d === today ? 'open' : ''}>
      <summary class="row between">
        <span class="grow"><strong>${DIAS[d]}</strong>${optional ? ' <span class="tag">opcional</span>' : ''}${d === today ? ' <span class="tag ok">hoje</span>' : ''}
          <span class="muted" style="display:block">${esc(w.name)} · ${w.exercises.length} exercícios</span></span>
        ${missing ? `<span class="tag warn">${missing} a gravar</span>` : '<span class="tag ok">vídeos ok</span>'}
      </summary>
      ${ordered(w).map((e, i) => `<div class="list-item">
        <span class="num" style="width:20px">${i + 1}</span>
        <div class="grow"><div>${esc(e.name)}</div>
          <div class="muted">${esc(e.muscle)} · ${effSets(e)} × ${e.repMin === e.repMax ? e.repMax : e.repMin + '–' + e.repMax}${e.bodyweight ? ' sem carga' : ''}</div></div>
        ${e.hasVideo
          ? `<button class="btn small video-btn" data-action="play" data-id="${e.id}">▶ Meu vídeo</button>`
          : `${hasAnyVideo(e) ? `<button class="btn small" data-action="play" data-id="${e.id}" aria-label="Ver vídeo de referência">▶</button>` : ''}
             <button class="btn small" data-action="edit-ex" data-id="${e.id}">Gravar</button>`}
      </div>`).join('')}
    </details>`;
  }).join('');
  return `<div class="card"><h3>Exercícios de cada dia</h3>
    <div class="muted" style="margin-bottom:6px">Na ordem do treino. "Gravar" abre o envio do seu vídeo daquele exercício. ▶ mostra o vídeo de referência.</div>
    ${rows}</div>`;
}

function renderTreinos() {
  setHeader('Treinos', 'Exercícios, séries e vídeos');
  const allEx = state.workouts.flatMap(w => w.exercises);
  const withVideo = allEx.filter(hasAnyVideo).length;
  const own = allEx.filter(e => e.hasVideo).length, pers = allEx.filter(e => e.videoSrc).length, net = allEx.filter(e => e.videoUrl).length;
  let html = `<div class="card"><h3>Vídeos dos exercícios</h3>
    <div class="muted">${withVideo} de ${allEx.length} exercícios com vídeo. Seus: ${own} · personal: ${pers} · internet: ${net}.</div>
    <div class="muted" style="margin-top:6px">Envie seus vídeos de uma vez: o app liga cada arquivo ao exercício pelo nome e você confere antes de salvar.</div>
    <label class="btn primary block" style="margin-top:10px;text-align:center;color:var(--accent-ink);font-size:16px">Enviar meus vídeos
      <input type="file" accept="video/*" multiple data-action="bulk-videos" hidden></label>
    ${renderToRecord()}
  </div>
  <div class="card"><h3>Vídeo longo da galeria</h3>
    <div class="muted">Para gravações de tela com vários exercícios. Envie o vídeo uma vez e marque o início e o fim de cada exercício. O app toca só o trecho, em repetição.</div>
    ${state.sources.map(src => {
      const n = allEx.filter(e => e.videoSrc === src.id).length;
      return `<div class="list-item"><div class="grow"><div>${esc(src.name)}</div>
        <div class="muted">${Math.round(src.size / 1048576)} MB · ${n} trecho(s) marcado(s)</div></div>
        <button class="btn small primary" data-action="open-marker" data-id="${src.id}">Marcar</button>
        <button class="btn small danger" data-action="delete-source" data-id="${src.id}">×</button></div>`;
    }).join('')}
    <label class="btn block" style="margin-top:10px;text-align:center;color:var(--text);font-size:16px">Adicionar vídeo longo
      <input type="file" accept="video/*" data-action="add-source" hidden></label>
  </div>`;
  html += state.workouts.map(w => `<div class="card">
    <div class="row between">
      <input class="field grow" value="${esc(w.name)}" data-action="rename-workout" data-id="${w.id}">
      <button class="btn small danger" data-action="delete-workout" data-id="${w.id}">Excluir</button>
    </div>
    <div style="margin-top:8px">
      ${w.exercises.map((e, i) => `<div class="list-item">
        <div class="grow"><div>${esc(e.name)}</div>
          <div class="muted">${esc(e.muscle)} · ${e.sets} × ${e.repMin === e.repMax ? e.repMax : e.repMin + '–' + e.repMax}${e.bodyweight ? ' sem carga' : ''} · ${e.rest}s ${hasAnyVideo(e) ? '· 🎬' : ''}</div></div>
        <button class="btn small" data-action="move-ex" data-w="${w.id}" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>↑</button>
        <button class="btn small" data-action="move-ex" data-w="${w.id}" data-i="${i}" data-dir="1" ${i === w.exercises.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="btn small" data-action="edit-ex" data-id="${e.id}">Editar</button>
      </div>`).join('')}
    </div>
    <button class="btn small" style="margin-top:8px" data-action="new-ex" data-w="${w.id}">+ Exercício</button>
  </div>`).join('');
  html += `<button class="btn block" data-action="new-workout">+ Novo treino</button>`;
  view.innerHTML = html;
}

function renderHistorico() {
  const sessions = state.logs.filter(l => !l.manual);
  setHeader('Histórico', `${sessions.length} treinos registrados`);
  const logs = [...state.logs].reverse();
  let html = '';

  if (logs.length) {
    const since = Date.now() - 7 * 864e5;
    const week = sessions.filter(l => new Date(l.date + 'T12:00').getTime() >= since).length;
    html += `<div class="card row between"><div><div class="muted">Últimos 7 dias</div><h2>${week} treinos</h2></div>
      <div style="text-align:right"><div class="muted">Total</div><h2>${sessions.length}</h2></div></div>`;
  }
  html += renderLoadEvolution();
  if (!logs.length) {
    html += `<div class="card empty">Nenhum treino salvo ainda. Finalize um treino na aba Hoje para ver seu progresso aqui.</div>`;
  }

  html += logs.map(l => {
    const sets = l.entries.flatMap(e => e.sets.filter(s => s.done));
    const volume = sets.reduce((a, s) => a + num(s.kg) * num(s.reps), 0);
    return `<details class="card">
      <summary class="row between" style="list-style:none;cursor:pointer">
        <div class="grow"><strong>${esc(l.workoutName)}</strong><div class="muted">${fmtDate(l.date)}${l.manual ? '' : ` · ${l.minutes} min`}</div></div>
        <div style="text-align:right"><div>${sets.length} séries</div><div class="muted">${Math.round(volume).toLocaleString('pt-BR')} kg</div></div>
      </summary>
      ${l.entries.map(e => `<div class="list-item"><div class="grow">${esc(e.name)}</div>
        <div class="muted">${e.sets.filter(s => s.done).map(s => `${s.kg || 0}×${s.reps || 0}`).join(' · ')}</div></div>`).join('')}
      <button class="btn small danger" style="margin-top:8px" data-action="delete-log" data-id="${l.id}">Apagar registro</button>
    </details>`;
  }).join('');

  html += `<div class="card"><h3>Backup</h3>
    <div class="muted">Os dados ficam só neste aparelho. Exporte de tempos em tempos. Vídeos enviados do aparelho não entram no backup.</div>
    <div class="row wrap" style="margin-top:10px">
      <button class="btn small" data-action="export">Exportar backup</button>
      <label class="btn small" style="margin:0;color:var(--text);font-size:14px">Importar backup
        <input type="file" accept="application/json" data-action="import" hidden></label>
      <button class="btn small danger" data-action="reset">Restaurar plano inicial</button>
    </div></div>`;
  view.innerHTML = html;
}

/* ================= Medidas ================= */

// Uma medida por mês: vale o último registro de cada mês.
function monthlyMeasures() {
  const byMonth = {};
  [...state.measures].sort((a, b) => a.date.localeCompare(b.date)).forEach(m => {
    const k = monthKey(m.date);
    byMonth[k] = { date: m.date, values: { ...(byMonth[k]?.values || {}), ...m.values } };
  });
  return Object.keys(byMonth).sort().map(k => ({ month: k, ...byMonth[k] }));
}

function sparkline(vals) {
  if (vals.length < 2) return '';
  const min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${28 - ((v - min) / span) * 24}`).join(' ');
  return `<svg viewBox="0 0 100 30" preserveAspectRatio="none" class="spark"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}

function delta(m, cur, prev) {
  if (prev == null) return '';
  const d = Math.round((cur - prev) * 10) / 10;
  if (d === 0) return '<span class="muted">=</span>';
  const good = (d > 0) === (m.dir === 'up');
  return `<span style="color:${good ? 'var(--accent)' : 'var(--warn)'}">${d > 0 ? '+' : ''}${String(d).replace('.', ',')} ${m.unit}</span>`;
}

function renderMedidas() {
  setHeader('Medidas', 'Evolução mês a mês');
  const months = monthlyMeasures();
  const mk = monthKey();
  const hasThisMonth = months.some(m => m.month === mk);
  let html = `<div class="card">
    ${hasThisMonth
      ? `<div class="muted">Medidas de ${monthLabel(mk)} registradas.</div>`
      : `<div class="hint keep">Você ainda não registrou as medidas de ${monthLabel(mk)}.</div>`}
    <button class="btn primary block" style="margin-top:8px" data-action="new-measure">Registrar medidas</button>
    <div class="muted" style="margin-top:8px">Meça sempre no mesmo horário, em jejum, com a fita sem apertar a pele.</div>
  </div>`;

  if (!months.length) {
    view.innerHTML = html + `<div class="card empty">Registre suas primeiras medidas para acompanhar a evolução.</div>`;
    return;
  }

  html += `<div class="card"><h3>Evolução</h3><div class="muted" style="margin-bottom:6px">Atual · vs mês anterior · vs início (${monthLabel(months[0].month)})</div>` +
    MEDIDAS.map(m => {
      const series = months.filter(x => x.values[m.key] != null && x.values[m.key] !== '').map(x => num(x.values[m.key]));
      if (!series.length) return '';
      const cur = series.at(-1);
      return `<div class="list-item">
        <div class="grow"><div>${m.label}</div>
          <div class="muted">${String(cur).replace('.', ',')} ${m.unit} · ${delta(m, cur, series.length > 1 ? series.at(-2) : null) || '—'} · ${delta(m, cur, series.length > 1 ? series[0] : null) || '—'}</div></div>
        <div style="width:90px">${sparkline(series)}</div>
      </div>`;
    }).join('') + `</div>`;

  html += `<div class="card"><h3>Registros</h3>` + [...state.measures].sort((a, b) => b.date.localeCompare(a.date)).map(r => {
    const foco = state.focus[monthKey(r.date)];
    return `<details class="list-item" style="display:block">
      <summary class="row between" style="cursor:pointer"><span>${fmtDate(r.date)}</span><span class="muted">${Object.keys(r.values).length} medidas</span></summary>
      ${foco?.length ? `<div class="muted">Foco do mês: ${foco.join(', ')}</div>` : ''}
      <div class="muted" style="margin:6px 0">${MEDIDAS.filter(m => r.values[m.key] != null).map(m => `${m.label}: ${String(r.values[m.key]).replace('.', ',')} ${m.unit}`).join(' · ')}</div>
      <div class="row"><button class="btn small" data-action="edit-measure" data-id="${r.id}">Editar</button>
      <button class="btn small danger" data-action="delete-measure" data-id="${r.id}">Apagar</button></div>
    </details>`;
  }).join('') + `</div>`;
  view.innerHTML = html;
}

function editMeasure(id) {
  const rec = id ? state.measures.find(m => m.id === id) : null;
  const months = monthlyMeasures();
  const last = months.at(-1)?.values || {};
  openModal(`<h3>${rec ? 'Editar medidas' : 'Registrar medidas'}</h3>
    <form id="m-form">
      <label>Data</label>
      <input class="field" type="date" name="date" value="${rec ? rec.date : todayISO()}" required>
      <div class="grid-2">${MEDIDAS.map(m => `<div><label>${m.label} (${m.unit})</label>
        <input class="field" name="${m.key}" inputmode="decimal" value="${esc(rec?.values[m.key] ?? '')}" placeholder="${last[m.key] != null ? 'último: ' + String(last[m.key]).replace('.', ',') : ''}"></div>`).join('')}</div>
      <button class="btn primary block" style="margin-top:14px" type="submit">Salvar</button>
    </form>`);
  document.getElementById('m-form').onsubmit = ev => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const values = {};
    MEDIDAS.forEach(m => { const v = String(f.get(m.key)).trim(); if (v) values[m.key] = num(v); });
    if (!Object.keys(values).length) { alert('Preencha ao menos uma medida.'); return; }
    if (rec) Object.assign(rec, { date: f.get('date'), values });
    else state.measures.push({ id: uid(), date: f.get('date'), values });
    save(); closeModal(); render();
  };
}

/* ================= Vídeos em lote ================= */

const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, ' ').trim();

function bestMatch(fileName, list) {
  const words = new Set(norm(fileName).split(' ').filter(w => w.length > 2));
  let best = null, bestScore = 0;
  list.forEach(e => {
    const ew = norm(e.name).split(' ').filter(w => w.length > 2);
    if (!ew.length) return;
    const hits = ew.filter(w => words.has(w)).length;
    const score = hits / ew.length + (e.hasVideo ? 0 : 0.01);
    if (hits && score > bestScore) { best = e; bestScore = score; }
  });
  return best;
}

let pendingFiles = [];
function bulkVideos(files) {
  pendingFiles = [...files];
  const list = state.workouts.flatMap(w => w.exercises.map(e => ({ ...e, wname: w.name })));
  const opts = sel => `<option value="">Não usar</option>` + list.map(e =>
    `<option value="${e.id}" ${sel === e.id ? 'selected' : ''}>${esc(e.name)} (${esc(e.wname.split(':')[0])})${e.hasVideo ? ' ✓' : ''}</option>`).join('');
  openModal(`<h3>Ligar vídeos aos exercícios</h3>
    <div class="muted">Confira cada vídeo. ✓ indica exercício que já tem vídeo (será substituído).</div>
    ${pendingFiles.map((f, i) => `<label>${esc(f.name)} <span class="muted">(${Math.round(f.size / 1048576)} MB)</span></label>
      <select class="field" data-bulk="${i}">${opts(bestMatch(f.name, list)?.id)}</select>`).join('')}
    <button class="btn primary block" style="margin-top:14px" data-action="save-bulk">Salvar vídeos</button>`);
}

async function saveBulk(btn) {
  btn.disabled = true;
  btn.textContent = 'Salvando...';
  let ok = 0;
  for (const sel of document.querySelectorAll('[data-bulk]')) {
    if (!sel.value) continue;
    const e = findExercise(sel.value)?.exercise;
    if (!e) continue;
    // O mesmo exercício em outro dia (mesmo nome) recebe o vídeo também, se ainda não tiver o seu.
    const twins = state.workouts.flatMap(w => w.exercises).filter(x => x.id !== e.id && norm(x.name) === norm(e.name) && !x.hasVideo);
    try {
      for (const x of [e, ...twins]) { await videoDB.put(x.id, pendingFiles[sel.dataset.bulk]); x.hasVideo = true; }
      ok++;
    }
    catch (err) { alert(`Não consegui salvar ${pendingFiles[sel.dataset.bulk].name}. O aparelho pode estar sem espaço.`); break; }
  }
  pendingFiles = [];
  save(); closeModal(); render();
  if (ok) alert(`${ok} vídeo(s) salvo(s).`);
}

/* ================= Evolução das cargas ================= */

function renderLoadEvolution() {
  const rows = state.workouts.map(w => {
    const items = w.exercises.map(e => ({ e, h: exerciseHistory(e.id) })).filter(x => x.h.length);
    if (!items.length) return '';
    return `<div class="muted" style="margin-top:12px;font-weight:600">${esc(w.name)}</div>` + items.map(({ e, h }) => {
      const first = h[0].top, cur = h.at(-1).top, best = Math.max(...h.map(x => x.top));
      const pct = first > 0 ? Math.round((cur - first) / first * 100) : 0;
      return `<div class="list-item" data-action="load-detail" data-id="${e.id}" style="cursor:pointer">
        <div class="grow"><div>${esc(e.name)} ${cur === best && h.length > 1 && cur > first ? '<span class="tag ok">recorde</span>' : ''}</div>
          <div class="muted">${fmtKg(cur)} kg · início ${fmtKg(first)} kg · <span style="color:${pct > 0 ? 'var(--accent)' : pct < 0 ? 'var(--warn)' : 'var(--muted)'}">${pct > 0 ? '+' : ''}${pct}%</span></div></div>
        <div style="width:80px">${sparkline(h.map(x => x.top))}</div>
      </div>`;
    }).join('');
  }).join('');
  return `<div class="card"><h3>Evolução das cargas</h3>
    <div class="muted">Maior carga por treino em cada exercício. Toque para ver o detalhe.</div>
    ${rows || '<div class="muted" style="margin-top:8px">Ainda sem cargas registradas.</div>'}
    <button class="btn small block" style="margin-top:10px" data-action="manual-load">+ Registrar carga manualmente</button>
  </div>`;
}

function bigChart(h) {
  if (h.length < 2) return '';
  const vals = h.map(x => x.top);
  const min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1;
  const X = i => 30 + (i / (h.length - 1)) * 260, Y = v => 110 - ((v - min) / span) * 90;
  return `<svg viewBox="0 0 300 130" class="chart">
    <text x="0" y="${Y(max) + 4}" class="axis">${fmtKg(max)}</text>
    <text x="0" y="${Y(min) + 4}" class="axis">${fmtKg(min)}</text>
    <polyline points="${vals.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
    ${vals.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="var(--accent)"/>`).join('')}
    <text x="30" y="126" class="axis">${h[0].date.slice(8, 10)}/${h[0].date.slice(5, 7)}</text>
    <text x="290" y="126" class="axis" text-anchor="end">${h.at(-1).date.slice(8, 10)}/${h.at(-1).date.slice(5, 7)}</text>
  </svg>`;
}

function loadDetail(exId) {
  const e = findExercise(exId)?.exercise;
  if (!e) return;
  const h = exerciseHistory(exId);
  const best = h.reduce((a, x) => x.top > a.top ? x : a, h[0]);
  const bestE = Math.max(...h.map(x => x.e1rm));
  openModal(`<h3 style="margin-right:30px">${esc(e.name)}</h3>
    <div class="muted">${esc(e.muscle)} · ${h.length} registro(s)</div>
    <div class="grid-2" style="gap:8px;margin:10px 0">
      <div class="card" style="margin:0"><div class="muted">Maior carga</div><h2>${fmtKg(best.top)} kg</h2><div class="muted">${fmtDate(best.date)}</div></div>
      <div class="card" style="margin:0"><div class="muted">1RM estimado</div><h2>${fmtKg(bestE)} kg</h2><div class="muted">fórmula de Epley</div></div>
    </div>
    ${bigChart(h)}
    ${[...h].reverse().map(x => `<div class="list-item"><div class="grow"><div>${fmtDate(x.date)} ${x.manual ? '<span class="tag">manual</span>' : ''}</div>
      <div class="muted">${x.sets.map(s => `${fmtKg(num(s.kg))}×${s.reps || 0}`).join(' · ')}</div></div>
      <div class="muted" style="text-align:right">${fmtKg(x.top)} kg</div></div>`).join('')}
    <button class="btn block" style="margin-top:12px" data-action="manual-load" data-id="${e.id}">+ Registrar carga deste exercício</button>`);
}

function manualLoad(exId) {
  const list = state.workouts.flatMap(w => w.exercises.map(e => ({ e, w })));
  const sel = exId || list[0]?.e.id;
  const e0 = findExercise(sel)?.exercise;
  const last = e0 ? lastPerformance(e0.id) : null;
  const n = Math.max(e0?.sets || 3, last?.sets.length || 0);
  openModal(`<h3>Registrar carga</h3>
    <div class="muted">Use para lançar cargas de treinos feitos sem o app ou para registrar sua carga atual.</div>
    <form id="load-form">
      <label>Exercício</label>
      <select class="field" name="ex">${state.workouts.map(w => `<optgroup label="${esc(w.name)}">${w.exercises.map(e =>
        `<option value="${e.id}" ${e.id === sel ? 'selected' : ''}>${esc(e.name)}</option>`).join('')}</optgroup>`).join('')}</select>
      <label>Data</label>
      <input class="field" type="date" name="date" value="${todayISO()}" max="${todayISO()}" required>
      <div class="sets">
        <div class="set head" style="grid-template-columns:28px 1fr 1fr"><span class="num">#</span><span>Carga (kg)</span><span>Reps</span></div>
        ${Array.from({ length: n }, (_, i) => `<div class="set" style="grid-template-columns:28px 1fr 1fr"><span class="num">${i + 1}</span>
          <input name="kg${i}" inputmode="decimal" placeholder="kg" value="${esc(last?.sets[i]?.kg ?? '')}">
          <input name="reps${i}" inputmode="numeric" placeholder="reps"></div>`).join('')}
      </div>
      <div class="muted" style="margin-top:6px">Séries sem carga ou sem reps ficam de fora.</div>
      <button class="btn primary block" style="margin-top:12px" type="submit">Salvar</button>
    </form>`);
  const form = document.getElementById('load-form');
  form.ex.onchange = () => manualLoad(form.ex.value);
  form.onsubmit = ev => {
    ev.preventDefault();
    const f = new FormData(form);
    const found = findExercise(f.get('ex'));
    const sets = [];
    for (let i = 0; i < n; i++) {
      const kg = String(f.get('kg' + i)).trim(), reps = String(f.get('reps' + i)).trim();
      if (num(kg) > 0 && num(reps) > 0) sets.push({ kg, reps, done: true });
    }
    if (!sets.length) { alert('Preencha carga e reps de ao menos uma série.'); return; }
    state.logs.push({
      id: uid(), date: f.get('date'), workoutId: found.workout.id, workoutName: `Registro manual: ${found.exercise.name}`,
      minutes: 0, manual: true,
      entries: [{ exId: found.exercise.id, name: found.exercise.name, muscle: found.exercise.muscle, sets }]
    });
    // Mantém a ordem cronológica: a sugestão de carga usa o registro mais recente.
    state.logs.sort((a, b) => a.date.localeCompare(b.date));
    save(); closeModal(); render();
  };
}

/* ================= Modais ================= */

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
let modalUrl = null;

function openModal(html) { modalBody.innerHTML = html; modal.classList.remove('hidden'); }
function closeModal() {
  const wasMarking = !!mk;
  mk = null;
  modal.classList.add('hidden');
  modalBody.innerHTML = '';
  if (modalUrl) { URL.revokeObjectURL(modalUrl); modalUrl = null; }
  if (wasMarking) render();
}

// Fontes de vídeo de um exercício, na ordem de prioridade: seu vídeo, trecho do personal, internet.
const videoSources = e => [
  e.hasVideo && { key: 'meu', label: 'Meu vídeo' },
  e.videoSrc && { key: 'personal', label: 'Personal' },
  e.videoUrl && { key: 'internet', label: 'Internet' }
].filter(Boolean);

async function playVideo(exId, which) {
  const found = findExercise(exId);
  if (!found) return;
  const e = found.exercise;
  if (modalUrl) { URL.revokeObjectURL(modalUrl); modalUrl = null; }
  const srcs = videoSources(e);
  const cur = srcs.find(x => x.key === which)?.key || srcs[0]?.key;
  let player = '';
  let clip = false;
  if (cur === 'meu') {
    const blob = await videoDB.get(e.id).catch(() => null);
    if (blob) { modalUrl = URL.createObjectURL(blob); player = `<video src="${modalUrl}" controls playsinline autoplay muted loop></video>`; }
  }
  if (cur === 'personal') {
    const blob = await videoDB.get(e.videoSrc).catch(() => null);
    if (blob) {
      modalUrl = URL.createObjectURL(blob);
      player = `<video id="clip" src="${modalUrl}#t=${e.videoStart},${e.videoEnd}" controls playsinline autoplay muted></video>
        <div class="muted" style="margin-top:6px">Trecho ${fmtTime(Math.round(e.videoStart))} a ${fmtTime(Math.round(e.videoEnd))}, em repetição.</div>`;
      clip = true;
    }
  }
  if (cur === 'internet') {
    const yt = youtubeId(e.videoUrl);
    const host = (e.videoUrl.match(/^https?:\/\/(?:www\.)?([^/]+)/) || [])[1] || 'link';
    player = yt
      ? `<iframe src="https://www.youtube.com/embed/${yt}?rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
         <div class="muted" style="margin-top:6px">Precisa de internet. <a href="https://www.youtube.com/watch?v=${yt}" target="_blank" rel="noopener" style="color:var(--accent)">Abrir no YouTube</a></div>`
      : isVideoFile(e.videoUrl)
        ? `<video src="${esc(e.videoUrl)}" controls playsinline></video>`
        : `<a class="btn primary block" style="text-align:center;text-decoration:none" href="${esc(e.videoUrl)}" target="_blank" rel="noopener">Abrir vídeo ${host.includes('instagram') ? 'no Instagram' : 'em ' + esc(host)}</a>`;
  }
  if (!player) player = `<div class="empty">Vídeo não encontrado neste aparelho. Envie o arquivo de novo em Treinos > Editar.</div>`;
  const tabs = srcs.length > 1
    ? `<div class="chips" style="margin:0 0 10px">${srcs.map(x =>
        `<button class="chip ${x.key === cur ? 'on' : ''}" data-action="play-src" data-id="${e.id}" data-src="${x.key}">${x.label}</button>`).join('')}</div>`
    : '';
  openModal(`<h3 style="margin-right:30px">${esc(e.name)}</h3>
    <div class="muted" style="margin-bottom:10px">${esc(e.muscle)} · ${e.sets} × ${e.repMin === e.repMax ? e.repMax : e.repMin + '–' + e.repMax}${e.bodyweight ? ' sem carga' : ''}</div>
    ${tabs}
    ${player}
    ${e.notes ? `<p class="muted">${esc(e.notes)}</p>` : ''}
    ${!e.hasVideo ? `<button class="btn small block" style="margin-top:10px" data-action="edit-ex" data-id="${e.id}">+ Enviar meu vídeo deste exercício</button>` : ''}`);
  if (clip) loopClip(document.getElementById('clip'), e.videoStart, e.videoEnd);
}

// Mantém o vídeo dentro do trecho do exercício.
function loopClip(v, start, end) {
  if (!v) return;
  v.addEventListener('loadedmetadata', () => { v.currentTime = start; v.play().catch(() => {}); });
  v.addEventListener('timeupdate', () => {
    if (v.currentTime >= end || v.currentTime < start - 1) { v.currentTime = start; v.play().catch(() => {}); }
  });
}

/* ================= Marcação de trechos ================= */

let mk = null; // { src, start, end, previewEnd }

async function addSource(file) {
  const id = 'src_' + uid();
  try { await videoDB.put(id, file); }
  catch (err) { alert('Não consegui salvar o vídeo. Libere espaço no aparelho e tente de novo.'); return; }
  state.sources.push({ id, name: file.name || 'Vídeo da galeria', size: file.size, date: todayISO() });
  save(); render();
  openMarker(id);
}

async function openMarker(srcId) {
  const blob = await videoDB.get(srcId).catch(() => null);
  if (!blob) { alert('Vídeo não encontrado neste aparelho.'); return; }
  modalUrl = URL.createObjectURL(blob);
  mk = { src: srcId, start: null, end: null, previewEnd: null };
  openModal(`<h3>Marcar exercícios</h3>
    <div class="muted" style="margin-bottom:8px">1. Escolha o exercício. 2. Pare o vídeo onde ele começa e toque em Início. 3. Pare onde termina e toque em Fim. 4. Salve.</div>
    <video id="mk-video" src="${modalUrl}" controls playsinline muted></video>
    <div class="row wrap" style="margin:8px 0">
      <button class="btn small" data-action="mk-seek" data-d="-10">−10s</button>
      <button class="btn small" data-action="mk-seek" data-d="-2">−2s</button>
      <button class="btn small" data-action="mk-seek" data-d="2">+2s</button>
      <button class="btn small" data-action="mk-seek" data-d="10">+10s</button>
      <button class="btn small" data-action="mk-speed" id="mk-speed">Velocidade 1x</button>
    </div>
    <div id="mk-panel"></div>`);
  const v = document.getElementById('mk-video');
  v.addEventListener('timeupdate', () => {
    if (mk && mk.previewEnd != null && v.currentTime >= mk.previewEnd) { v.pause(); mk.previewEnd = null; }
  });
  renderMarkerPanel();
}

function renderMarkerPanel(selected) {
  const panel = document.getElementById('mk-panel');
  if (!panel || !mk) return;
  const list = state.workouts.flatMap(w => w.exercises.map(e => ({ e, w })));
  const marked = list.filter(x => x.e.videoSrc === mk.src).sort((a, b) => a.e.videoStart - b.e.videoStart);
  const sel = selected ?? list.find(x => !x.e.videoSrc && !x.e.hasVideo)?.e.id ?? list[0]?.e.id;
  const t = v => v == null ? '--:--' : fmtTime(Math.round(v));
  panel.innerHTML = `
    <label>Exercício</label>
    <select class="field" id="mk-ex">${state.workouts.map(w => `<optgroup label="${esc(w.name)}">${w.exercises.map(e =>
      `<option value="${e.id}" ${e.id === sel ? 'selected' : ''}>${esc(e.name)}${e.videoSrc || e.hasVideo ? ' ✓' : ''}</option>`).join('')}</optgroup>`).join('')}</select>
    <div class="muted" style="margin-top:4px">✓ = já tem trecho do personal ou vídeo seu.</div>
    <div class="grid-2" style="margin-top:8px;gap:8px">
      <button class="btn" data-action="mk-start">Início: <strong>${t(mk.start)}</strong></button>
      <button class="btn" data-action="mk-end">Fim: <strong>${t(mk.end)}</strong></button>
    </div>
    <div class="row" style="margin-top:8px">
      <button class="btn grow" data-action="mk-preview" ${mk.start == null || mk.end == null ? 'disabled' : ''}>Ver trecho</button>
      <button class="btn primary grow" data-action="mk-save" ${mk.start == null || mk.end == null ? 'disabled' : ''}>Salvar trecho</button>
    </div>
    <h3 style="margin-top:16px">Trechos marcados (${marked.length})</h3>
    ${marked.length ? marked.map(({ e }) => `<div class="list-item"><div class="grow"><div>${esc(e.name)}</div>
      <div class="muted">${esc(e.muscle)} · ${t(e.videoStart)} a ${t(e.videoEnd)}</div></div>
      <button class="btn small" data-action="mk-goto" data-id="${e.id}">Ver</button>
      <button class="btn small danger" data-action="mk-remove" data-id="${e.id}">×</button></div>`).join('')
      : '<div class="muted">Nenhum trecho ainda.</div>'}`;
}

function markerAction(action, t) {
  const v = document.getElementById('mk-video');
  if (!v || !mk) return;
  const exSel = document.getElementById('mk-ex')?.value;
  switch (action) {
    case 'mk-seek': v.currentTime = Math.max(0, v.currentTime + Number(t.dataset.d)); return;
    case 'mk-speed': {
      const speeds = [1, 2, 4];
      v.playbackRate = speeds[(speeds.indexOf(v.playbackRate) + 1) % speeds.length];
      t.textContent = `Velocidade ${v.playbackRate}x`;
      return;
    }
    case 'mk-start': mk.start = v.currentTime; if (mk.end != null && mk.end <= mk.start) mk.end = null; break;
    case 'mk-end':
      if (mk.start != null && v.currentTime <= mk.start) { alert('O fim precisa vir depois do início.'); return; }
      mk.end = v.currentTime; v.pause(); break;
    case 'mk-preview': v.currentTime = mk.start; mk.previewEnd = mk.end; v.playbackRate = 1; v.play().catch(() => {}); return;
    case 'mk-save': {
      const e = findExercise(exSel)?.exercise;
      if (!e) return;
      Object.assign(e, { videoSrc: mk.src, videoStart: Math.round(mk.start * 10) / 10, videoEnd: Math.round(mk.end * 10) / 10 });
      save();
      mk.start = mk.end = null;
      renderMarkerPanel(null);
      return;
    }
    case 'mk-goto': {
      const e = findExercise(t.dataset.id)?.exercise;
      if (e) { v.currentTime = e.videoStart; mk.previewEnd = e.videoEnd; v.play().catch(() => {}); }
      return;
    }
    case 'mk-remove': {
      const e = findExercise(t.dataset.id)?.exercise;
      if (e) { delete e.videoSrc; delete e.videoStart; delete e.videoEnd; save(); }
      break;
    }
  }
  renderMarkerPanel(exSel);
}

function editExercise(exId, workoutId) {
  const isNew = !exId;
  const e = isNew ? ex('', 'Peito', 3, 6, 10, 90) : findExercise(exId).exercise;
  const wid = isNew ? workoutId : findExercise(exId).workout.id;
  openModal(`<h3>${isNew ? 'Novo exercício' : 'Editar exercício'}</h3>
    <form id="ex-form">
      <label>Nome</label>
      <input class="field" name="name" value="${esc(e.name)}" required>
      <label>Grupo muscular</label>
      <select class="field" name="muscle">${GRUPOS.map(g => `<option ${g === e.muscle ? 'selected' : ''}>${g}</option>`).join('')}</select>
      <div class="grid-3">
        <div><label>Séries</label><input class="field" name="sets" type="number" min="1" max="10" value="${e.sets}"></div>
        <div><label>Reps mín.</label><input class="field" name="repMin" type="number" min="1" value="${e.repMin}"></div>
        <div><label>Reps máx.</label><input class="field" name="repMax" type="number" min="1" value="${e.repMax}"></div>
      </div>
      <label class="row" style="color:var(--text);font-size:15px"><input type="checkbox" name="bodyweight" ${e.bodyweight ? 'checked' : ''}> Sem carga (peso do corpo)</label>
      <label>Descanso entre séries (segundos)</label>
      <input class="field" name="rest" type="number" min="0" step="15" value="${e.rest}">
      <label>Vídeo do aparelho ${e.hasVideo ? '<span class="tag ok">salvo</span>' : ''}</label>
      <input class="field" name="file" type="file" accept="video/*">
      ${e.hasVideo ? `<button type="button" class="btn small danger" style="margin-top:6px" data-action="remove-video" data-id="${e.id}">Remover vídeo salvo</button>` : ''}
      ${e.videoSrc ? `<div class="hint up">Trecho do vídeo longo: ${fmtTime(Math.round(e.videoStart))} a ${fmtTime(Math.round(e.videoEnd))}. Para mudar, use Treinos > Vídeo longo > Marcar.</div>` : ''}
      <label>Ou link do vídeo (YouTube, Google Drive ou videos/arquivo.mp4 do repositório)</label>
      <input class="field" name="videoUrl" type="text" inputmode="url" placeholder="https://" value="${esc(e.videoUrl)}">
      <label>Observações de execução</label>
      <textarea class="field" name="notes" rows="2">${esc(e.notes)}</textarea>
      <div class="row" style="margin-top:14px">
        <button class="btn primary grow" type="submit">Salvar</button>
        ${isNew ? '' : `<button type="button" class="btn danger" data-action="delete-ex" data-id="${e.id}">Excluir</button>`}
      </div>
    </form>`);

  document.getElementById('ex-form').onsubmit = async ev => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const repMin = Math.max(1, parseInt(f.get('repMin')) || 1);
    Object.assign(e, {
      name: f.get('name').trim(),
      muscle: f.get('muscle'),
      sets: Math.max(1, parseInt(f.get('sets')) || 1),
      repMin,
      repMax: Math.max(repMin, parseInt(f.get('repMax')) || repMin),
      rest: Math.max(0, parseInt(f.get('rest')) || 0),
      bodyweight: f.get('bodyweight') === 'on',
      videoUrl: f.get('videoUrl').trim(),
      notes: f.get('notes').trim()
    });
    const file = f.get('file');
    if (file && file.size) {
      try { await videoDB.put(e.id, file); e.hasVideo = true; save(); shareOwnVideos(); }
      catch (err) { alert('Não consegui salvar o vídeo. O aparelho pode estar sem espaço.'); }
    }
    if (isNew) getWorkout(wid).exercises.push(e);
    save();
    closeModal();
    render();
  };
}

/* ================= Eventos ================= */

document.querySelector('.tabbar').addEventListener('click', ev => {
  const b = ev.target.closest('button[data-tab]');
  if (!b) return;
  tab = b.dataset.tab;
  render();
  window.scrollTo(0, 0);
});

document.addEventListener('click', async ev => {
  const t = ev.target.closest('[data-action]');
  if (!t || t.tagName === 'SELECT' || t.tagName === 'INPUT') {
    if (ev.target === modal) closeModal();
    return;
  }
  const { action, id } = t.dataset;
  const a = state.active;

  switch (action) {
    case 'start':
      startSession(id); render(); window.scrollTo(0, 0); break;
    case 'toggle-set': {
      const en = a.entries[t.dataset.e];
      const s = en.sets[t.dataset.s];
      s.done = !s.done;
      save();
      if (s.done) {
        en.sets.forEach(o => { if (!o.done && o.kg === '') o.kg = s.kg; });
        const e = findExercise(en.exId)?.exercise;
        if (e && e.rest > 0) startTimer(e.rest);
      }
      const y = window.scrollY; render(); window.scrollTo(0, y);
      break;
    }
    case 'add-set': {
      const sets = a.entries[t.dataset.e].sets;
      sets.push({ kg: sets.at(-1)?.kg ?? '', reps: '', done: false });
      save(); { const y = window.scrollY; render(); window.scrollTo(0, y); }
      break;
    }
    case 'remove-set':
      a.entries[t.dataset.e].sets.pop();
      save(); { const y = window.scrollY; render(); window.scrollTo(0, y); }
      break;
    case 'finish': finishSession(); window.scrollTo(0, 0); break;
    case 'cancel-session':
      if (confirm('Cancelar o treino? As séries marcadas serão perdidas.')) { state.active = null; save(); stopTimer(); render(); }
      break;
    case 'toggle-focus': {
      const mk = monthKey();
      const cur = new Set(state.focus[mk] || []);
      cur.has(t.dataset.g) ? cur.delete(t.dataset.g) : cur.add(t.dataset.g);
      state.focus[mk] = GRUPOS.filter(g => cur.has(g));
      save(); { const y = window.scrollY; render(); window.scrollTo(0, y); }
      break;
    }
    case 'new-measure': editMeasure(null); break;
    case 'edit-measure': editMeasure(id); break;
    case 'delete-measure':
      if (confirm('Apagar este registro de medidas?')) { state.measures = state.measures.filter(m => m.id !== id); save(); render(); }
      break;
    case 'save-bulk': saveBulk(t); break;
    case 'load-detail': loadDetail(id); break;
    case 'manual-load': manualLoad(id); break;
    case 'open-marker': openMarker(id); break;
    case 'delete-source': {
      if (!confirm('Apagar este vídeo longo? Os trechos marcados nele deixam de funcionar.')) break;
      await videoDB.del(id).catch(() => {});
      state.sources = state.sources.filter(x => x.id !== id);
      state.workouts.forEach(w => w.exercises.forEach(e => { if (e.videoSrc === id) { delete e.videoSrc; delete e.videoStart; delete e.videoEnd; } }));
      save(); render();
      break;
    }
    case 'mk-seek': case 'mk-speed': case 'mk-start': case 'mk-end': case 'mk-preview':
    case 'mk-save': case 'mk-goto': case 'mk-remove':
      markerAction(action, t); break;
    case 'timer-add': timerEnd += 15000; beeped = false; tickTimer(); break;
    case 'timer-stop': stopTimer(); break;
    case 'play': playVideo(id); break;
    case 'play-src': playVideo(id, t.dataset.src); break;
    case 'close-modal': closeModal(); break;
    case 'edit-ex': editExercise(id); break;
    case 'new-ex': editExercise(null, t.dataset.w); break;
    case 'delete-ex': {
      if (!confirm('Excluir este exercício?')) break;
      const found = findExercise(id);
      found.workout.exercises = found.workout.exercises.filter(x => x.id !== id);
      videoDB.del(id).catch(() => {});
      save(); closeModal(); render();
      break;
    }
    case 'remove-video': {
      const e = findExercise(id).exercise;
      await videoDB.del(id).catch(() => {});
      e.hasVideo = false; save();
      t.remove();
      break;
    }
    case 'move-ex': {
      const list = getWorkout(t.dataset.w).exercises;
      const i = Number(t.dataset.i), j = i + Number(t.dataset.dir);
      [list[i], list[j]] = [list[j], list[i]];
      save(); render();
      break;
    }
    case 'new-workout':
      state.workouts.push({ id: uid(), name: 'Novo treino', exercises: [] });
      save(); render(); window.scrollTo(0, document.body.scrollHeight);
      break;
    case 'delete-workout': {
      const w = getWorkout(id);
      if (!confirm(`Excluir o treino "${w.name}"?`)) break;
      w.exercises.forEach(e => videoDB.del(e.id).catch(() => {}));
      state.workouts = state.workouts.filter(x => x.id !== id);
      Object.keys(state.schedule).forEach(d => { if (state.schedule[d] === id) state.schedule[d] = null; });
      if (a && a.workoutId === id) state.active = null;
      save(); render();
      break;
    }
    case 'delete-log':
      if (confirm('Apagar este registro?')) { state.logs = state.logs.filter(l => l.id !== id); save(); render(); }
      break;
    case 'export': {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `treino-backup-${todayISO()}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      break;
    }
    case 'reset':
      if (confirm('Restaurar o plano inicial? Seus treinos editados serão substituídos. O histórico é mantido.')) {
        const logs = state.logs;
        state = applySemanaV7(applyRoscaV6(applyRemadasV5(applySupinoV4(applyVideosV3(applyPlanV2(planoInicial()))))));
        state.logs = logs;
        save(); render();
      }
      break;
  }
});

document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.dataset.action === 'set-input') {
    state.active.entries[t.dataset.e].sets[t.dataset.s][t.dataset.field] = t.value;
    save();
  }
});

document.addEventListener('change', ev => {
  const t = ev.target;
  switch (t.dataset.action) {
    case 'pick-workout': viewWorkoutId = t.value || null; render(); break;
    case 'schedule': state.schedule[t.dataset.day] = t.value || null; save(); render(); break;
    case 'rename-workout': getWorkout(t.dataset.id).name = t.value.trim() || 'Treino'; save(); break;
    case 'add-source':
      if (t.files[0]) addSource(t.files[0]);
      t.value = '';
      break;
    case 'bulk-videos':
      if (t.files.length) bulkVideos(t.files);
      t.value = '';
      break;
    case 'import': {
      const file = t.files[0];
      if (!file) break;
      file.text().then(txt => {
        const data = JSON.parse(txt);
        if (!Array.isArray(data.workouts) || !data.schedule) throw new Error();
        state = { logs: [], active: null, focus: {}, measures: [], sources: [], ...data };
        save(); render();
        alert('Backup importado.');
      }).catch(() => alert('Arquivo de backup inválido.'));
      break;
    }
  }
});

/* ================= Início ================= */

render();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
shareOwnVideos();
// Pede ao navegador para não apagar os vídeos salvos quando faltar espaço.
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
