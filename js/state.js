const $ = s => document.querySelector(s);
const e = s => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const isExcludedOffice = o => {
  const s = String(o || '').trim().toLowerCase();
  return s === 'supervisores' || s.startsWith('ms');
};

let S = JSON.parse(JSON.stringify(SEED));
let V = 'd', F = 'ALL', DIST = 'ALL', SEL = null, nid = 45;
let currentUser = null;
let hasUnsavedChanges = false;

function markUnsaved() {
  hasUnsavedChanges = true;
  updateSaveButtonUI();
}

function updateSaveButtonUI() {
  const btn = $('#btn-save');
  if (!btn) return;
  if (hasUnsavedChanges) {
    btn.classList.add('unsaved-active');
    btn.innerHTML = '⚠️ Guardar Cambios';
  } else {
    btn.classList.remove('unsaved-active');
    btn.innerHTML = '💾 Guardado';
  }
}

function logAction(act) {
  if (!Array.isArray(S.logs)) S.logs = [];
  const d = new Date();
  const timestamp = d.toLocaleDateString('es-AR') + ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  S.logs.unshift({
    u: currentUser ? currentUser.u : 'Sistema',
    a: act,
    t: timestamp
  });
  if (S.logs.length > 300) S.logs.pop();
}

function normalizeData() {
  if (!S.d || !Array.isArray(S.d) || S.d.length === 0) S.d = ["Bella Vista"];
  if (!Array.isArray(S.users) || S.users.length === 0) {
    S.users = [{ u: "kruki", p: "", r: "admin" }];
  } else if (!S.users.some(x => x.u.toLowerCase() === 'kruki')) {
    S.users.push({ u: "kruki", p: "", r: "admin" });
  }
  if (!Array.isArray(S.logs)) S.logs = [];
  if (!S.alertEmails) S.alertEmails = "";
  if (Array.isArray(S.o)) {
    S.o = S.o.map(of => typeof of === 'string' ? { n: of, d: "Bella Vista" } : of);
  } else {
    S.o = [];
  }
  if (!Array.isArray(S.t)) S.t = [];
}

const wk = y => {
  let d = Date.UTC(y, 0, 1);
  while (new Date(d).getUTCDay() != 1) d += 864e5;
  return [...Array(52)].map((_, i) => d + i * 6048e5);
};
const iso = t => new Date(t).toISOString().slice(0, 10);
const p2 = n => String(n).padStart(2, '0');
const fmt = t => { const d = new Date(t); return p2(d.getUTCDate()) + '/' + p2(d.getUTCMonth() + 1); };
const lab = t => fmt(t) + ' – ' + fmt(t + 6 * 864e5);

function getFilteredOffices() {
  return DIST === 'ALL' ? S.o : S.o.filter(o => o.d === DIST);
}

function getFilteredTechs() {
  const offices = getFilteredOffices().map(o => o.n);
  return S.t.filter(t => offices.includes(t.o));
}

function getTechDistrict(tech) {
  const off = S.o.find(o => o.n === tech.o);
  return off ? off.d : (S.d[0] || 'Bella Vista');
}