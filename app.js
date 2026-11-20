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

const uid = () => Math.random().toString(36).slice(2, 10);
const ex = (name, muscle, sets, repMin, repMax, rest) =>
  ({ id: uid(), name, muscle, sets, repMin, repMax, rest, videoUrl: '', hasVideo: false, notes: '' });

/* Plano inicial: cada grupo muscular treinado 2x por semana. Tudo é editável. */
function planoInicial() {
  const empurrar = { id: 'empurrar', name: 'Empurrar: peito, ombros e tríceps', exercises: [
    ex('Supino reto com barra', 'Peito', 4, 6, 10, 120),
    ex('Supino inclinado com halteres', 'Peito', 3, 8, 12, 90),
    ex('Desenvolvimento com halteres', 'Ombros', 3, 8, 12, 90),
    ex('Elevação lateral', 'Ombros', 3, 12, 15, 60),
    ex('Tríceps na polia', 'Tríceps', 4, 10, 12, 60),
    ex('Tríceps francês', 'Tríceps', 3, 10, 12, 60)
  ]};
  const puxar = { id: 'puxar', name: 'Puxar: costas e bíceps', exercises: [
    ex('Puxada frontal', 'Costas', 4, 8, 12, 90),
    ex('Remada curvada', 'Costas', 4, 6, 10, 120),
    ex('Remada baixa', 'Costas', 3, 10, 12, 90),
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
    ex('Supino inclinado com barra', 'Peito', 3, 8, 12, 120),
    ex('Crucifixo na polia', 'Peito', 3, 12, 15, 60),
    ex('Barra fixa ou puxada', 'Costas', 3, 6, 10, 120),
    ex('Remada unilateral', 'Costas', 3, 10, 12, 90),
    ex('Elevação lateral na polia', 'Ombros', 3, 12, 15, 60),
    ex('Rosca alternada', 'Bíceps', 3, 10, 12, 60),
    ex('Tríceps testa', 'Tríceps', 3, 10, 12, 60)
  ]};
  const inferiores = { id: 'inferiores', name: 'Inferiores e abdômen', exercises: [
    ex('Agachamento búlgaro', 'Quadríceps', 3, 8, 12, 90),
    ex('Cadeira extensora', 'Quadríceps', 3, 12, 15, 60),
    ex('Levantamento terra romeno', 'Posteriores', 3, 8, 10, 120),
    ex('Cadeira flexora', 'Posteriores', 3, 10, 12, 60),
    ex('Abdução de quadril', 'Glúteos', 3, 12, 15, 60),
    ex('Panturrilha sentado', 'Panturrilhas', 4, 12, 15, 60),
    ex('Abdominal na polia', 'Abdômen', 3, 10, 15, 60),
    ex('Prancha (reps = segundos)', 'Abdômen', 3, 30, 60, 60)
  ]};
  return {
    workouts: [empurrar, puxar, pernas, superiores, inferiores],
    schedule: { 0: null, 1: 'empurrar', 2: 'puxar', 3: 'pernas', 4: null, 5: 'superiores', 6: 'inferiores' },
    logs: [],
    active: null
  };
}

/* ================= Estado ================= */

let state = load();
let tab = 'hoje';
let viewWorkoutId = null; // treino escolhido manualmente na aba Hoje

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* segue com o plano inicial */ }
  return planoInicial();
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
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = iso => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DIAS[dt.getDay()]}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
};
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

// Dupla progressão: bateu o topo da faixa em todas as séries, sobe a carga.
function suggestion(exercise, last) {
  if (!last) return { type: 'keep', text: 'Primeira vez: escolha uma carga que deixe 1 a 2 repetições na reserva.' };
  const allTop = last.sets.length >= exercise.sets && last.sets.every(s => num(s.reps) >= exercise.repMax);
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
    entries: w.exercises.map(e => {
      const last = lastPerformance(e.id);
      const sug = suggestion(e, last);
      return {
        exId: e.id,
        sets: Array.from({ length: e.sets }, (_, i) => ({
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
  ({ hoje: renderHoje, semana: renderSemana, treinos: renderTreinos, historico: renderHistorico })[tab]();
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

  if (!w) {
    html += `<div class="card empty">Dia de descanso. O músculo cresce na recuperação: durma bem e bata sua meta de proteína.</div>`;
    view.innerHTML = html;
    return;
  }

  const totalSets = w.exercises.reduce((a, e) => a + Number(e.sets), 0);
  html += `<button class="btn primary block" data-action="start" data-id="${w.id}">Iniciar treino (${w.exercises.length} exercícios, ${totalSets} séries)</button><div style="height:12px"></div>`;
  html += w.exercises.map(e => {
    const last = lastPerformance(e.id);
    return `<div class="card">
      <div class="row between">
        <div class="grow"><h3>${esc(e.name)}</h3>
          <div class="muted">${esc(e.muscle)} · ${e.sets} × ${e.repMin}–${e.repMax} · ${e.rest}s</div></div>
        ${videoButton(e)}
      </div>
      ${last ? `<div class="muted" style="margin-top:6px">Última vez: ${last.sets.map(s => `${s.kg || 0}kg×${s.reps || 0}`).join(', ')}</div>` : ''}
    </div>`;
  }).join('');
  view.innerHTML = html;
}

function videoButton(e) {
  return (e.hasVideo || e.videoUrl)
    ? `<button class="btn small" data-action="play" data-id="${e.id}">▶ Vídeo</button>`
    : '';
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
    return `<div class="card">
      <div class="row between">
        <div class="grow"><h3>${esc(e.name)} ${complete ? '<span class="tag ok">feito</span>' : ''}</h3>
          <div class="muted">${esc(e.muscle)} · alvo ${e.repMin}–${e.repMax} reps · descanso ${e.rest}s</div></div>
        ${videoButton(e)}
      </div>
      ${e.notes ? `<div class="muted" style="margin-top:6px">${esc(e.notes)}</div>` : ''}
      ${last ? `<div class="muted" style="margin-top:6px">Última vez: ${last.sets.map(s => `${s.kg || 0}kg×${s.reps || 0}`).join(', ')}</div>` : ''}
      <div class="hint ${sug.type}">${esc(sug.text)}</div>
      <div class="sets">
        <div class="set head"><span class="num">#</span><span>Carga (kg)</span><span>Reps</span><span></span></div>
        ${en.sets.map((s, si) => `<div class="set ${s.done ? 'done' : ''}">
          <span class="num">${si + 1}</span>
          <input inputmode="decimal" value="${esc(s.kg)}" placeholder="kg" data-action="set-input" data-field="kg" data-e="${ei}" data-s="${si}">
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
    if (w) w.exercises.forEach(e => { vol[e.muscle] = (vol[e.muscle] || 0) + Number(e.sets); });
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

  const vol = weeklyVolume();
  html += `<div class="card"><h3>Séries por grupo muscular na semana</h3>
    <div class="muted" style="margin-bottom:8px">Referência para hipertrofia: ${SERIES_MIN} a ${SERIES_MAX} séries semanais por grupo.</div>` +
    GRUPOS.map(g => {
      const v = vol[g] || 0;
      const color = v === 0 ? 'var(--line)' : v < SERIES_MIN ? 'var(--warn)' : v > SERIES_MAX ? 'var(--danger)' : 'var(--accent)';
      const tag = v === 0 ? '' : v < SERIES_MIN ? '<span class="tag warn">abaixo</span>' : v > SERIES_MAX ? '<span class="tag warn">acima</span>' : '<span class="tag ok">ok</span>';
      return `<div style="margin:8px 0">
        <div class="row between"><span>${g}</span><span class="muted">${v} séries ${tag}</span></div>
        <div class="bar"><div style="width:${Math.min(v / 25, 1) * 100}%;background:${color}"></div></div>
      </div>`;
    }).join('') + `</div>`;
  view.innerHTML = html;
}

function renderTreinos() {
  setHeader('Treinos', 'Exercícios, séries e vídeos');
  let html = state.workouts.map(w => `<div class="card">
    <div class="row between">
      <input class="field grow" value="${esc(w.name)}" data-action="rename-workout" data-id="${w.id}">
      <button class="btn small danger" data-action="delete-workout" data-id="${w.id}">Excluir</button>
    </div>
    <div style="margin-top:8px">
      ${w.exercises.map((e, i) => `<div class="list-item">
        <div class="grow"><div>${esc(e.name)}</div>
          <div class="muted">${esc(e.muscle)} · ${e.sets} × ${e.repMin}–${e.repMax} · ${e.rest}s ${(e.hasVideo || e.videoUrl) ? '· 🎬' : ''}</div></div>
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
  setHeader('Histórico', `${state.logs.length} treinos registrados`);
  const logs = [...state.logs].reverse();
  let html = '';

  if (logs.length) {
    const since = Date.now() - 7 * 864e5;
    const week = state.logs.filter(l => new Date(l.date + 'T12:00').getTime() >= since).length;
    html += `<div class="card row between"><div><div class="muted">Últimos 7 dias</div><h2>${week} treinos</h2></div>
      <div style="text-align:right"><div class="muted">Total</div><h2>${state.logs.length}</h2></div></div>`;
  } else {
    html += `<div class="card empty">Nenhum treino salvo ainda. Finalize um treino na aba Hoje para ver seu progresso aqui.</div>`;
  }

  html += logs.map(l => {
    const sets = l.entries.flatMap(e => e.sets.filter(s => s.done));
    const volume = sets.reduce((a, s) => a + num(s.kg) * num(s.reps), 0);
    return `<details class="card">
      <summary class="row between" style="list-style:none;cursor:pointer">
        <div class="grow"><strong>${esc(l.workoutName)}</strong><div class="muted">${fmtDate(l.date)} · ${l.minutes} min</div></div>
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

/* ================= Modais ================= */

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
let modalUrl = null;

function openModal(html) { modalBody.innerHTML = html; modal.classList.remove('hidden'); }
function closeModal() {
  modal.classList.add('hidden');
  modalBody.innerHTML = '';
  if (modalUrl) { URL.revokeObjectURL(modalUrl); modalUrl = null; }
}

async function playVideo(exId) {
  const found = findExercise(exId);
  if (!found) return;
  const e = found.exercise;
  let player = '';
  if (e.hasVideo) {
    const blob = await videoDB.get(e.id).catch(() => null);
    if (blob) { modalUrl = URL.createObjectURL(blob); player = `<video src="${modalUrl}" controls playsinline autoplay></video>`; }
  }
  if (!player && e.videoUrl) {
    const yt = youtubeId(e.videoUrl);
    player = yt
      ? `<iframe src="https://www.youtube.com/embed/${yt}?rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<video src="${esc(e.videoUrl)}" controls playsinline></video>
         <p><a href="${esc(e.videoUrl)}" target="_blank" rel="noopener" style="color:var(--accent)">Abrir link do vídeo</a></p>`;
  }
  if (!player) player = `<div class="empty">Vídeo não encontrado neste aparelho. Envie o arquivo de novo em Treinos > Editar.</div>`;
  openModal(`<h3 style="margin-right:30px">${esc(e.name)}</h3>
    <div class="muted" style="margin-bottom:10px">${esc(e.muscle)} · ${e.sets} × ${e.repMin}–${e.repMax}</div>
    ${player}
    ${e.notes ? `<p class="muted">${esc(e.notes)}</p>` : ''}`);
}

function editExercise(exId, workoutId) {
  const isNew = !exId;
  const e = isNew ? ex('', 'Peito', 3, 8, 12, 90) : findExercise(exId).exercise;
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
      <label>Descanso entre séries (segundos)</label>
      <input class="field" name="rest" type="number" min="0" step="15" value="${e.rest}">
      <label>Vídeo do aparelho ${e.hasVideo ? '<span class="tag ok">salvo</span>' : ''}</label>
      <input class="field" name="file" type="file" accept="video/*">
      ${e.hasVideo ? `<button type="button" class="btn small danger" style="margin-top:6px" data-action="remove-video" data-id="${e.id}">Remover vídeo salvo</button>` : ''}
      <label>Ou link do vídeo (YouTube, Google Drive, etc.)</label>
      <input class="field" name="videoUrl" type="url" placeholder="https://" value="${esc(e.videoUrl)}">
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
      videoUrl: f.get('videoUrl').trim(),
      notes: f.get('notes').trim()
    });
    const file = f.get('file');
    if (file && file.size) {
      try { await videoDB.put(e.id, file); e.hasVideo = true; }
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
    case 'timer-add': timerEnd += 15000; beeped = false; tickTimer(); break;
    case 'timer-stop': stopTimer(); break;
    case 'play': playVideo(id); break;
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
        state = planoInicial();
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
    case 'import': {
      const file = t.files[0];
      if (!file) break;
      file.text().then(txt => {
        const data = JSON.parse(txt);
        if (!Array.isArray(data.workouts) || !data.schedule) throw new Error();
        state = { logs: [], active: null, ...data };
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
