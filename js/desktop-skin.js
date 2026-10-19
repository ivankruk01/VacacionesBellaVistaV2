(function(){
  const LOGO = (w, h) => `<svg width="${w}" height="${h}" viewBox="0 0 120 34" fill="none"><text x="0" y="26" fill="#019DF4" font-family="'Segoe UI Variable Display','Segoe UI',Inter,Arial,sans-serif" font-weight="700" font-size="29" letter-spacing="-1.4">movistar</text></svg>`;
  document.querySelectorAll('.login-logos>svg:first-child,.brand-logos-hdr>svg:first-child').forEach(s => s.outerHTML = LOGO(150, 42));

  const IC = {
    d: '<path d="M4 20V11M10 20V4M16 20v-7M22 20H2"/>',
    p: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    a: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M17 5a3.5 3.5 0 010 7M19 14c2 1 3 3 3 6"/>',
    u: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    l: '<path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3"/>'
  };

  const item = (v, t) => `<button class="nav-i" data-nv="${v}" onclick="V='${v}';SEL=null;render()"><svg viewBox="0 0 24 24">${IC[v]}</svg>${t}</button>`;
  const sb = document.createElement('aside'); sb.id = 'sb';
  sb.innerHTML = `<div class="sb-brand">${LOGO(130, 36)}<small>Sistema de vacaciones</small></div>${item('d', 'Resumen')}${item('p', 'Planilla de carga')}${item('a', 'Técnicos')}<div class="adm"><div class="sb-grp">Administración</div>${item('u', 'Usuarios')}${item('l', 'Registro')}</div><div class="sb-foot"><b id="sb-user"></b><span id="sb-role"></span></div><div class="sb-credit">Desarrollado por<b onmouseenter="openContact()" onmouseleave="leaveContact()" onclick="openContact()" title="Contacto">Iván Javier Kruk Losada</b></div>`;
  document.body.appendChild(sb);

  const MAIL = 'ivan.kruk@tmoviles.com.ar';
  const ct = document.createElement('div'); ct.id = 'ct-modal';
  ct.innerHTML = `<div class="ct-box"><div class="ct-av">IK</div><h3>Iván Javier Kruk Losada</h3><p>Desarrollador del Sistema de Vacaciones</p><a class="ct-mail" href="mailto:${MAIL}">${MAIL}</a><div class="ct-act"><a class="ct-btn" href="mailto:${MAIL}?subject=Sistema%20de%20Vacaciones">Enviar correo</a><button onclick="closeContact()">Cerrar</button></div></div>`;
  let ctT; ct.onmouseenter = () => clearTimeout(ctT); ct.onmouseleave = () => { ctT = setTimeout(() => ct.classList.remove('open'), 250); };
  document.body.appendChild(ct);

  window.openContact = () => { clearTimeout(ctT); ct.classList.add('open'); };
  window.leaveContact = () => { ctT = setTimeout(() => ct.classList.remove('open'), 250); };
  window.closeContact = () => ct.classList.remove('open');

  const ttl = document.createElement('span'); ttl.id = 'pg-title';
  document.getElementById('main-header').prepend(ttl);

  const TT = { d: 'Resumen', p: 'Planilla de carga', a: 'Gestión de técnicos', u: 'Usuarios', l: 'Registro de actividad' };
  window.PQ = '';

  const EMO = /^[\s\u200d\ufe0f\p{Extended_Pictographic}]+/u;
  function clean(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while (n = w.nextNode()) { if (EMO.test(n.nodeValue) && n.nodeValue.trim()) { n.nodeValue = n.nodeValue.replace(EMO, ''); } }
    root.querySelectorAll('[placeholder]').forEach(i => i.placeholder = i.placeholder.replace(EMO, ''));
  }

  const _dash = dash;
  function dashD() {
    const W = wk(S.y), K = W.map(iso), offs = getFilteredOffices(), techs = getFilteredTechs();
    const calc = techs.filter(t => !isExcludedOffice(t.o)), N = calc.length || 1, u = S.u / 100;
    const tot = K.map(k => calc.filter(t => t.w.includes(k)).length);
    const sum = tot.reduce((a, b) => a + b, 0), mx = Math.max(...tot), pk = tot.indexOf(mx), over = tot.filter(x => x / N > u).length;
    const now = Date.now(), cw = W.findIndex(w => now >= w && now < w + 7 * 864e5);
    const sel = SEL != null ? SEL : (cw >= 0 ? cw : Math.max(pk, 0));
    const col = p => p > u ? 'var(--bad)' : p >= .9 * u ? 'var(--mid)' : 'var(--ok)';

    const CW = 960, CH = 150, bw = CW / 52, mxp = Math.max(u * 1.4, ...tot.map(x => x / N));
    const bars = tot.map((c, i) => {
      const p = c / N, h = Math.max(c ? 3 : 1.5, p / mxp * CH), x = 40 + i * bw;
      return `<g onclick="SEL=${i};render()" style="cursor:pointer"><rect class="hit ${i === sel ? 'on' : ''}" x="${x}" y="0" width="${bw}" height="${CH + 4}"/><rect x="${x + 2}" y="${CH - h}" width="${bw - 4}" height="${h}" rx="2" fill="${c ? col(p) : '#E3E6EB'}"><title>${lab(W[i])} · ${c} téc. (${Math.round(p * 100)}%)</title></rect></g>`;
    }).join('');

    const mon = W.map((w, i) => i === 0 || new Date(w).getUTCMonth() !== new Date(W[i - 1]).getUTCMonth() ? `<text x="${40 + i * bw}" y="${CH + 20}">${MES[new Date(w).getUTCMonth()]}</text>` : '').join('');
    const ty = CH - u / mxp * CH;
    const chart = `<svg viewBox="0 0 1000 ${CH + 28}"><line x1="40" x2="1000" y1="${CH}" y2="${CH}" stroke="#E3E6EB"/><line x1="40" x2="1000" y1="${ty}" y2="${ty}" stroke="#D13438" stroke-dasharray="4 4" opacity=".7"/><text x="34" y="${ty + 4}" text-anchor="end" style="fill:#D13438">${S.u}%</text><text x="34" y="${CH + 4}" text-anchor="end">0</text>${bars}${mon}</svg>`;

    const sp = tot[sel] / N;
    const grp = offs.map(o => { const n = techs.filter(t => t.o === o.n && t.w.includes(K[sel])); return n.length ? `<div class="dg"><b>${e(o.n)}<i>${n.length}</i></b>${n.map(t => `<span>${e(t.n)}</span>`).join('')}</div>` : ''; }).join('') || '<p class="mut">Nadie de vacaciones esta semana.</p>';
    const det = `<div class="det-h"><div><div class="mut" style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;font-weight:600">${sel === cw ? 'Semana actual' : 'Semana'}</div><b>${lab(W[sel])}</b></div><div><button ${sel <= 0 ? 'disabled' : ''} onclick="SEL=${sel - 1};render()">‹</button> <button ${sel >= 51 ? 'disabled' : ''} onclick="SEL=${sel + 1};render()">›</button></div></div><div class="det-big">${tot[sel]}<small>de ${N} técnicos · ${Math.round(sp * 100)}%</small></div><div class="pbar2"><i style="width:${Math.min(100, sp / (u * 1.4) * 100)}%;background:${col(sp)}"></i></div>${grp}`;

    const top = tot.map((c, i) => [c, i]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).slice(0, 6)
      .map(([c, i]) => `<div class="crit" onclick="SEL=${i};render()"><span>${lab(W[i])}</span><b style="color:${col(c / N)}">${c} téc. · ${Math.round(c / N * 100)}%</b></div>`).join('') || '<p class="mut">Sin vacaciones programadas.</p>';

    const rows = offs.map(o => {
      const ts = techs.filter(t => t.o === o.n), c = K.map(k => ts.filter(t => t.w.includes(k)).length);
      return `<tr><td><b>${e(o.n)}</b></td><td class="n">${ts.length}</td><td class="n">${c.reduce((a, b) => a + b, 0)}</td><td class="n">${Math.max(0, ...c)}</td><td class="n">${vs(ts).tk}</td><td class="n">${vs(ts).pd}</td><td><div class="strip">${c.map((v, i) => `<i onclick="SEL=${i};render()" title="${lab(W[i])}: ${v}" style="${v ? `background:${v >= 2 ? '#0B6BCB' : '#7CC4F7'}` : ''};${i === sel ? 'outline:1.5px solid #1A2230;outline-offset:1px' : ''}"></i>`).join('')}</div></td></tr>`;
    }).join('');

    const V0 = vs(techs);
    const vacKpis = `<div class="kpis c4"><div class="k"><small>Vacaciones tomadas</small><b>${V0.tk * 7}</b><span>días · ${V0.tk} sem.</span></div><div class="k"><small>Programadas a futuro</small><b>${V0.sc * 7}</b><span>días · ${V0.sc} sem.</span></div><div class="k"><small>Pendientes de programar</small><b>${V0.pd}</b><span>días · ≈ ${Math.floor(V0.pd / 7)} sem.</span></div><div class="k"><small>Saldo cargado</small><b>${V0.tot}</b><span>${V0.sin ? V0.sin + ' técnicos sin saldo cargado' : 'todos con saldo cargado'}</span></div></div>`;

    const doc = new DOMParser().parseFromString(_dash(), 'text/html');
    const m = [...doc.querySelectorAll('.card')].find(c => c.querySelector('h3') && c.querySelector('h3').textContent.includes('Matriz'));

    return `<div class="kpis">
     <div class="k"><small>Técnicos</small><b>${calc.length}</b><span>${offs.filter(o => !isExcludedOffice(o.n)).length} oficinas</span></div>
     <div class="k"><small>Semana actual</small><b>${cw >= 0 ? tot[cw] : '–'}</b><span>${cw >= 0 ? 'de vacaciones ahora' : 'fuera de ' + S.y}</span></div>
     <div class="k"><small>Semanas asignadas</small><b>${sum}</b><span>en ${S.y}</span></div>
     <div class="k"><small>Pico</small><b>${mx ? Math.round(mx / N * 100) + '%' : '–'}</b><span>${mx} téc. · ${pk >= 0 ? fmt(W[pk]) : ''}</span></div>
     <div class="k ${over ? 'warn' : ''}"><small>Sobre umbral</small><b>${over}</b><span>semanas &gt; ${S.u}%</span></div></div>
    ${vacKpis}<div class="dgrid"><div class="card chart"><h3>Ocupación semanal <span class="mut" style="font-weight:400;font-size:12px">tocá una barra para ver el detalle</span></h3>${chart}</div><div class="card">${det}</div></div>
    <div class="dgrid"><div class="card"><h3>Por oficina</h3><div style="overflow:auto"><table class="otab"><thead><tr><th>Oficina</th><th class="n">Téc.</th><th class="n">Sem.</th><th class="n">Pico</th><th class="n">Tomadas (sem.)</th><th class="n">Pend. (días)</th><th>Distribución anual</th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="card"><h3>Semanas críticas</h3>${top}</div></div>
    ${m ? m.outerHTML : ''}`;
  }
  dash = function() { return dashD(); };

  window.applyPQ = function() { const q = PQ.trim().toLowerCase(); document.querySelectorAll('.hm tbody tr.pl').forEach(r => r.style.display = !q || r.textContent.toLowerCase().includes(q) ? '' : 'none'); };
  window.goToday = function() { const w = document.querySelector('.wrap'), c = document.querySelector('.hm th.cur'); if (w && c) w.scrollTo({ left: c.offsetLeft - 300, behavior: 'smooth' }); };

  function markCur() {
    const W = wk(S.y), now = Date.now(), i = W.findIndex(w => now >= w && now < w + 7 * 864e5); if (i < 0) return;
    document.querySelectorAll('.hm').forEach(t => {
      const h = t.querySelectorAll('thead tr')[1]; if (h && h.children[i]) h.children[i].classList.add('cur');
      t.querySelectorAll('tbody tr,tfoot tr').forEach(r => { const c = r.children[i + 1]; if (c) c.classList.add('cur'); });
    });
  }

  function planBar() {
    const tabs = document.querySelector('#app .tabs'); if (!tabs || V !== 'p') return;
    const b = document.createElement('div'); b.className = 'pbar';
    const dt = S.d.length > 1 ? `<div class="tabs" style="margin-right:6px">${S.d.map(d => `<button class="${d === DIST ? 'on' : ''}" onclick="DIST='${e(d)}';F='ALL';render()">${e(d)}</button>`).join('')}</div>` : '';
    b.innerHTML = dt + `<input type="search" placeholder="Buscar técnico" value="${e(PQ)}" oninput="PQ=this.value;applyPQ()"><button onclick="goToday()">Ir a la semana actual</button>${currentUser && currentUser.r === 'admin' ? '<button class="ap" onclick="openAuto()">Programación automática</button>' : ''}`;
    tabs.parentNode.insertBefore(b, tabs);
  }

  getFilteredTechs = function() {
    const offs = getFilteredOffices().map(o => o.n);
    return S.t.filter(t => offs.includes(t.o)).sort((a, b) => offs.indexOf(a.o) - offs.indexOf(b.o) || a.n.localeCompare(b.n, 'es'));
  };

  function bal(t, y) {
    const b = t.b && t.b[y]; if (!b) return null;
    const used = wk(y).map(iso).filter(k => t.w.includes(k)).length * 7, p = +b.p || 0, l = +b.l || 0, up = Math.min(p, used);
    return { p, l, used, rp: p - up, rl: l - (used - up) };
  }

  window.setBal = function(id, f, v) {
    const t = S.t.find(x => x.id == id); if (!t) return;
    const n = Math.max(0, Math.round(+v) || 0);
    t.b = t.b || {}; t.b[S.y] = t.b[S.y] || { p: 0, l: 0 }; t.b[S.y][f] = n;
    logAction(`Cargó ${f === 'p' ? 'vacaciones año anterior' : 'licencia por vacaciones'} de "${t.n}" (${S.y}): ${n} días`);
    markUnsaved(); render();
  };

  const _tog = tog;
  tog = function(id, k) {
    const t = S.t.find(x => x.id == id);
    if (t && !t.w.includes(k)) {
      const y = +k.slice(0, 4), b = bal(t, y);
      if (b && b.used + 7 > b.p + b.l) { alert(`⚠️ Saldo insuficiente:\n"${t.n}" tiene ${b.rp + b.rl} días disponibles en ${y} y una semana necesita 7.\n\nCargá o corregí su saldo en Gestión de técnicos.`); return; }
    }
    _tog(id, k);
  };

  function fillCounts() {
    document.querySelectorAll('.hm tbody tr.pl').forEach(r => {
      const th = r.querySelector('th.r'), d = th && th.querySelector('div:last-child'), n = r.lastElementChild.textContent.trim();
      if (!d || d === th.firstElementChild) return;
      const td = r.querySelector('td[onclick]'), m = td && /tog\((\d+),/.exec(td.getAttribute('onclick')), t = m && S.t.find(x => x.id == m[1]), b = t && bal(t, S.y);
      d.innerHTML = '<b>' + n + '</b> ' + (n == 1 ? 'semana' : 'semanas') + (b ? ` · Ant. <b>${b.rp}</b> · Lic. <b class="${b.rl < 0 ? 'neg' : ''}">${b.rl}</b> días` : '');
    });
  }

  function linkOffices() {
    document.querySelectorAll('.hm tbody tr').forEach(r => {
      const th = r.querySelector('th.r'); if (!th || !th.firstChild) return;
      const nm = (th.firstChild.nodeValue || '').trim(), o = S.o.find(x => x.n === nm); if (!o) return;
      th.classList.add('go'); th.title = 'Abrir planilla de carga de ' + nm;
      th.onclick = () => { DIST = o.d; F = nm; V = 'p'; SEL = null; render(); };
    });
  }

  const PAL = ['#0B6BCB', '#5CB615', '#7C5CFC', '#F59E0B', '#E5484D', '#0EA5A4', '#D946A8', '#64748B'];
  const oc = n => { const i = S.o.findIndex(o => o.n === n); return PAL[(i < 0 ? 0 : i) % PAL.length]; };

  function paint() {
    document.querySelectorAll('.badge-off').forEach(b => { const c = oc(b.textContent.trim()), th = b.closest('th.r'); b.style.background = c + '1F'; b.style.color = c; if (th) th.style.boxShadow = 'inset 4px 0 0 ' + c; });
    document.querySelectorAll('.hm tbody tr:not(.pl) th.r').forEach(th => { const nm = th.firstChild && (th.firstChild.nodeValue || '').trim(); if (nm && S.o.some(o => o.n === nm)) th.style.boxShadow = 'inset 4px 0 0 ' + oc(nm); });
    document.querySelectorAll('.otab tbody tr').forEach(r => { const td = r.firstElementChild, nm = td.textContent.trim(); if (S.o.some(o => o.n === nm)) td.style.boxShadow = 'inset 4px 0 0 ' + oc(nm); });
    document.querySelectorAll('.abm-t tr.grp td').forEach(td => { const nm = td.firstChild && (td.firstChild.nodeValue || '').trim(); if (nm && S.o.some(o => o.n === nm)) td.style.boxShadow = 'inset 4px 0 0 ' + oc(nm); });
  }

  function vs(ts) {
    const y = S.y, W = wk(y), now = Date.now(); let tk = 0, sc = 0, pd = 0, tot = 0, sin = 0;
    ts.forEach(t => {
      W.filter(w => t.w.includes(iso(w))).forEach(w => { if (w + 6 * 864e5 < now) tk++; else sc++; });
      const b = bal(t, y); if (b) { tot += b.p + b.l; pd += Math.max(0, b.rp + b.rl); } else sin++;
    });
    return { tk, sc, pd, tot, sin };
  }

  window.ABT = 't'; window.TF = ''; window.TQ = '';
  window.filtRows = q => {
    TQ = q; const s = q.trim().toLowerCase(); let g = null, v = 0;
    document.querySelectorAll('.abm-t tbody tr').forEach(r => {
      if (r.classList.contains('grp')) { if (g) g.style.display = v ? '' : 'none'; g = r; v = 0; return; }
      r.style.display = !s || (r.dataset.n || '').includes(s) ? '' : 'none'; if (r.style.display !== 'none') v++;
    });
    if (g) g.style.display = v ? '' : 'none';
  };
  window.toggleAdd = () => { const b = document.querySelector('.addbox'); if (!b) return; b.classList.toggle('open'); const i = b.querySelector('input'); if (i) i.focus(); };

  function abm2() {
    const offIdx = n => { const i = S.o.findIndex(o => o.n === n); return i < 0 ? 99 : i; };
    const cnt = { t: S.t.length, o: S.o.length, d: S.d.length };
    const tabs = `<div class="tabs">${[['t', 'Técnicos'], ['o', 'Oficinas'], ['d', 'Distritos']].map(([k, l]) => `<button class="${ABT === k ? 'on' : ''}" onclick="ABT='${k}';render()">${l} <span class="cnt">${cnt[k]}</span></button>`).join('')}</div>`;
    const distOpts = sel => S.d.map(d => `<option ${d === sel ? 'selected' : ''}>${e(d)}</option>`).join('');
    const offOpts = sel => S.o.map(o => `<option ${o.n === sel ? 'selected' : ''}>${e(o.n)} (${e(o.d)})</option>`).join('');
    let body = '';
    if (ABT === 't') {
      const K = wk(S.y).map(iso);
      const list = [...S.t].filter(t => !TF || t.o === TF).sort((a, b) => offIdx(a.o) - offIdx(b.o) || a.n.localeCompare(b.n, 'es'));
      let last = null, rows = '';
      list.forEach(t => {
        if (t.o !== last) { last = t.o; rows += `<tr class="grp"><td colspan="7">${e(t.o)} <span class="cnt">${list.filter(x => x.o === t.o).length}</span></td></tr>`; }
        const b = bal(t, S.y), wn = K.filter(k => t.w.includes(k)).length;
        rows += `<tr data-n="${e(t.n.toLowerCase())}"><td><input type="text" value="${e(t.n)}" onchange="editT(${t.id},'n',this.value)"></td><td><select onchange="editT(${t.id},'o',this.value)">${offOpts(t.o)}</select></td><td class="c"><input class="num" type="number" min="0" placeholder="–" value="${b ? b.p : ''}" onchange="setBal(${t.id},'p',this.value)"></td><td class="c"><input class="num" type="number" min="0" placeholder="–" value="${b ? b.l : ''}" onchange="setBal(${t.id},'l',this.value)"></td><td class="c">${b ? `<b>${b.rp}</b> / <b class="${b.rl < 0 ? 'neg' : ''}">${b.rl}</b>` : '<span class="mut">–</span>'}</td><td class="c">${wn}</td><td class="c"><button class="del" onclick="delT(${t.id})">Eliminar</button></td></tr>`;
      });
      body = `<div class="abm-bar"><input type="search" placeholder="Buscar técnico" value="${e(TQ)}" oninput="filtRows(this.value)"><select onchange="TF=this.value;render()"><option value="">Todas las oficinas</option>${S.o.map(o => `<option ${o.n === TF ? 'selected' : ''}>${e(o.n)}</option>`).join('')}</select><span class="sp"></span><span class="mut">Saldos de ${S.y} en días</span><button class="btn" onclick="toggleAdd()">+ Nuevo técnico</button></div>
      <div class="addbox"><input id="nn" type="text" placeholder="APELLIDO, NOMBRE"><select id="no">${offOpts(S.o[0] && S.o[0].n)}</select><button class="btn" onclick="addT()">Agregar técnico</button></div>
      <div class="abm-wrap"><table class="abm-t"><thead><tr><th>Nombre</th><th>Oficina</th><th class="c">Vacaciones año anterior</th><th class="c">Licencia por vacaciones</th><th class="c">Saldo (ant. / lic.)</th><th class="c">Sem.</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="7" class="mut" style="padding:16px">No hay técnicos.</td></tr>'}</tbody></table></div>`;
    } else if (ABT === 'o') {
      body = `<div class="abm-bar"><span class="mut">${S.o.length} oficinas</span><span class="sp"></span><button class="btn" onclick="toggleAdd()">+ Nueva oficina</button></div>
      <div class="addbox"><input id="no2" type="text" placeholder="Nombre de la oficina"><select id="nd2">${distOpts(S.d[0])}</select><button class="btn" onclick="addO()">Agregar oficina</button></div>
      <div class="abm-wrap"><table class="abm-t"><thead><tr><th>Oficina</th><th>Distrito</th><th class="c">Técnicos</th><th></th></tr></thead><tbody>${S.o.map((o, i) => `<tr><td><input type="text" value="${e(o.n)}" onchange="renO(${i},this.value)"></td><td><select onchange="changeDistO(${i},this.value)">${distOpts(o.d)}</select></td><td class="c">${S.t.filter(t => t.o === o.n).length}</td><td class="c"><button class="del" onclick="delO(${i})">Eliminar</button></td></tr>`).join('')}</tbody></table></div>`;
    } else {
      body = `<div class="abm-bar"><span class="mut">${S.d.length} distritos</span><span class="sp"></span><button class="btn" onclick="toggleAdd()">+ Nuevo distrito</button></div>
      <div class="addbox"><input id="nd" type="text" placeholder="Nombre del distrito"><button class="btn" onclick="addD()">Agregar distrito</button></div>
      <div class="abm-wrap"><table class="abm-t"><thead><tr><th>Distrito</th><th class="c">Oficinas</th><th class="c">Técnicos</th><th></th></tr></thead><tbody>${S.d.map((d, i) => `<tr><td><input type="text" value="${e(d)}" onchange="renD(${i},this.value)"></td><td class="c">${S.o.filter(o => o.d === d).length}</td><td class="c">${S.t.filter(t => getTechDistrict(t) === d).length}</td><td class="c"><button class="del" onclick="delD(${i})">Eliminar</button></td></tr>`).join('')}</tbody></table></div>`;
    }
    return tabs + body;
  }
  abm = abm2;

  const as = document.createElement('div'); as.id = 'as-modal';
  as.innerHTML = `<div class="as-box"><h3>Programación automática</h3><p>Asigna al azar las vacaciones pendientes de cada técnico, respetando lo ya cargado y los límites de 2 por oficina y 9 por distrito.</p><label>Oficinas</label><select id="as-sc"></select><label>Tipo de vacaciones a programar</label><select id="as-ty"><option value="all">Año anterior y luego licencia (todo lo pendiente)</option><option value="p">Solo vacaciones año anterior</option><option value="l">Solo licencia por vacaciones</option></select><div class="as-r"><div><label>Desde la semana</label><select id="as-f"></select></div><div><label>Hasta la semana</label><select id="as-t"></select></div></div><div class="ct-act" style="justify-content:flex-end;margin-top:18px"><button onclick="document.getElementById('as-modal').classList.remove('open')">Cancelar</button><button class="btn" onclick="runAuto()">Generar</button></div></div>`;
  document.body.appendChild(as);

  window.openAuto = function() {
    if (!currentUser || currentUser.r !== 'admin') return;
    const W = wk(S.y), now = Date.now(), offs = getFilteredOffices();
    let f = W.findIndex(w => w + 6 * 864e5 >= now); if (f < 0) f = 0;
    document.getElementById('as-sc').innerHTML = '<option value="">Todas las oficinas' + (DIST === 'ALL' ? '' : ' · ' + e(DIST)) + '</option>' + offs.map(o => `<option ${o.n === F ? 'selected' : ''}>${e(o.n)}</option>`).join('');
    const opts = sel => W.map((w, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${lab(w)}</option>`).join('');
    document.getElementById('as-f').innerHTML = opts(f);
    document.getElementById('as-t').innerHTML = opts(W.length - 1);
    as.classList.add('open');
  };

  window.runAuto = function() {
    if (!currentUser || currentUser.r !== 'admin') return alert('Solo los administradores pueden usar la programación automática.');
    const W = wk(S.y), K = W.map(iso), f = +document.getElementById('as-f').value, t2 = +document.getElementById('as-t').value, sc = document.getElementById('as-sc').value;
    if (f > t2) return alert('El rango de semanas no es válido.');
    const scope = getFilteredTechs().filter(t => !sc || t.o === sc);
    const cOff = {}, cDist = {};
    S.t.forEach(t => { if (isExcludedOffice(t.o)) return; const d = getTechDistrict(t); K.forEach((k, i) => { if (t.w.includes(k)) { cOff[t.o + '|' + i] = (cOff[t.o + '|' + i] || 0) + 1; cDist[d + '|' + i] = (cDist[d + '|' + i] || 0) + 1; } }); });
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const ty = document.getElementById('as-ty').value, need = new Map(); let skipped = 0, withPrev = 0;
    scope.forEach(t => {
      const b = bal(t, S.y); if (!b) { skipped++; return; }
      let days;
      if (ty === 'p') days = b.rp;
      else if (ty === 'l') { if (b.rp > 0) { withPrev++; return; } days = b.rl; }
      else days = b.rp + b.rl;
      const n = Math.floor(Math.max(0, days) / 7); if (n > 0) need.set(t, n);
    });
    const got = new Map(), techs = [...need.keys()], maxN = Math.max(0, ...need.values());
    for (let r = 0; r < maxN; r++) {
      shuffle(techs.slice()).forEach(t => {
        const mine = got.get(t) || []; if (mine.length >= need.get(t)) return;
        const ex = isExcludedOffice(t.o), d = getTechDistrict(t);
        const cand = shuffle(K.map((_, i) => i).filter(i => i >= f && i <= t2 && !t.w.includes(K[i]) && !mine.includes(i) && (ex || ((cOff[t.o + '|' + i] || 0) < 2 && (cDist[d + '|' + i] || 0) < 9))));
        if (!cand.length) return;
        const i = cand[0]; mine.push(i); got.set(t, mine);
        if (!ex) { cOff[t.o + '|' + i] = (cOff[t.o + '|' + i] || 0) + 1; cDist[d + '|' + i] = (cDist[d + '|' + i] || 0) + 1; }
      });
    }
    let total = 0, missing = 0; got.forEach(a => total += a.length); need.forEach((n, t) => missing += n - (got.get(t) || []).length);
    if (!total) return alert('No hay semanas para asignar: los técnicos del alcance elegido no tienen saldo pendiente cargado, o no hay lugar en ese rango por los límites.');
    const msg = 'Programación automática ' + S.y + '\n\n• Tipo: ' + ({ all: 'año anterior y luego licencia', p: 'solo año anterior', l: 'solo licencia' })[ty] + '\n• Técnicos con pendientes: ' + need.size + '\n• Semanas a asignar: ' + total + '\n' + (missing ? '• Sin lugar por los límites: ' + missing + ' (probá con un rango más amplio)\n' : '') + (skipped ? '• Omitidos por no tener saldo cargado: ' + skipped + '\n' : '') + (withPrev ? '• Omitidos por tener año anterior pendiente (se usa primero): ' + withPrev + '\n' : '') + '\nSe respetan los límites de 2 por oficina y 9 por distrito.\n¿Aplicar la programación?';
    if (!confirm(msg)) return;
    got.forEach((arr, t) => { arr.forEach(i => t.w.push(K[i])); t.w.sort(); });
    logAction('Programación automática: ' + total + ' semanas asignadas a ' + need.size + ' técnicos (rango ' + lab(W[f]) + ' a ' + lab(W[t2]) + ')');
    markUnsaved(); as.classList.remove('open'); render();
  };

  const _render = render; let lv = null, savedAll = false;
  render = function() {
    if (V === 'p' && DIST === 'ALL' && S.d && S.d.length) { savedAll = true; DIST = S.d[0]; F = 'ALL'; }
    else if (V !== 'p' && savedAll) { DIST = 'ALL'; savedAll = false; }
    _render();
    const first = V !== lv; lv = V;
    if (V === 'p') { planBar(); applyPQ(); fillCounts(); }
    markCur();
    if (V === 'd') linkOffices();
    if (V === 'a' && ABT === 't' && TQ) filtRows(TQ);
    const adm = currentUser && currentUser.r === 'admin';
    sb.querySelector('.adm').style.display = adm ? '' : 'none';
    sb.querySelectorAll('.nav-i').forEach(b => b.classList.toggle('on', b.dataset.nv === V));
    ttl.textContent = (TT[V] || '') + ' · ' + S.y;
    if (currentUser) { document.getElementById('sb-user').textContent = currentUser.u; document.getElementById('sb-role').textContent = adm ? 'Administrador' : 'Usuario'; }
    paint();
    clean(document.body);
    if (first && V === 'p') setTimeout(goToday, 60);
  };

  const _sa = showAppUI; showAppUI = function() { document.body.classList.add('in-app'); _sa(); };
  const _sl = showLoginUI; showLoginUI = function() { document.body.classList.remove('in-app'); _sl(); };
})();