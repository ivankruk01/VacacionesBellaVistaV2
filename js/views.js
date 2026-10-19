const mh = W => {
  let h = '', i = 0;
  while (i < W.length) {
    const m = new Date(W[i]).getUTCMonth(); let j = i;
    while (j < W.length && new Date(W[j]).getUTCMonth() == m) j++;
    h += `<th colspan=${j - i} class=m>${MES[m]}</th>`; i = j;
  }
  return h;
};

const heat = (p) => {
  const u = S.u / 100;
  if (p <= 0) return ['#F4F7FB', '#64748B'];
  if (p < .9 * u) return ['#CFEFFF', '#00577A'];
  if (p <= u) return ['#FFE9A8', '#8A4B00'];
  return ['#FFC9CB', '#B3171C'];
};

const cell = (c, n, tt, i, isDistrict = false) => {
  const p = n ? c / n : 0, [bg, fg] = heat(p);
  const extraClass = isDistrict ? 'font-weight:bold;' : '';
  return `<td style="background:${bg};color:${fg};${extraClass}" title="${e(tt)}" class="${SEL == i ? 'sel' : ''}" ${i >= 0 ? `onclick="SEL=${i};render()"` : ''}>${c || ''}</td>`;
};

function dash() {
  const W = wk(S.y), K = W.map(iso);
  const activeOffices = getFilteredOffices();
  const activeTechs = getFilteredTechs();

  const calcTechs = activeTechs.filter(t => !isExcludedOffice(t.o));
  const calcOffices = activeOffices.filter(o => !isExcludedOffice(o.n));
  const N = calcTechs.length || 1, u = S.u / 100;

  const R = activeOffices.map(o => {
    const ts = activeTechs.filter(t => t.o === o.n);
    return { o: o.n, d: o.d, n: ts.length, c: K.map(k => ts.filter(t => t.w.includes(k)).length) };
  });

  const tot = K.map((_, i) => R.reduce((a, r) => isExcludedOffice(r.o) ? a : a + r.c[i], 0));
  const mx = Math.max(...tot), pk = tot.indexOf(mx), sum = tot.reduce((a, b) => a + b, 0);
  const over = tot.filter(x => x / N > u).length;

  const top = tot.map((c, i) => [c, i]).filter(x => x[0]).sort((a, b) => b[0] - a[0]).slice(0, 6)
    .map(([c, i]) => `<li onclick="SEL=${i};render()"><b>Semana del ${lab(W[i])}</b><br><span style="color:var(--pers-blue);font-weight:700">${c} técnicos</span> (${Math.round(c / N * 100)}% del total)</li>`).join('')
    || '<li>Sin vacaciones programadas en este año.</li>';

  const det = SEL == null ? '' : `<div class="card tech-detail" style="margin:0"><h3>Detalle Semana ${lab(W[SEL])} (${DIST === 'ALL' ? 'Todos los Distritos' : 'Distrito ' + e(DIST)})</h3>${
    activeOffices.map(o => {
      const n = activeTechs.filter(t => t.o === o.n && t.w.includes(K[SEL]));
      return n.length ? `<p style="margin:4px 0"><b>${e(o.n)}</b> [${e(o.d)}] (${n.length}):${n.map(t => `<span class="wk-chip">${e(t.n)}</span>`).join(' ')}</p>` : '';
    }).join('') || '<p>Sin personal de vacaciones esta semana.</p>'
  }</div>`;

  return `
  <div class="card" style="background: linear-gradient(135deg, #0B132B 0%, #0052FF 100%); color:#fff;">
    <h2 style="margin:0 0 6px; font-size:20px; font-weight:800;">
      Resumen ${DIST === 'ALL' ? 'General Consolidado' : 'Distrito ' + e(DIST)} (${S.y})
    </h2>
    <p style="margin:0; opacity:0.9;">Monitoreo de ausentismo y dotación por oficina técnica.</p>
  </div>

  <div class="kp district">
    <div class="card"><b>${calcTechs.length}</b><span>Técnicos Totales (Cálculo)</span></div>
    <div class="card"><b>${calcOffices.length}</b><span>Oficinas Técnicas</span></div>
    <div class="card"><b>${sum}</b><span>Semanas Asignadas (${S.y})</span></div>
    <div class="card"><b>${mx ? Math.round(mx / N * 100) + '%' : '-'}</b><span>Pico Max: ${mx} téc. (${pk >= 0 ? fmt(W[pk]) : ''})</span></div>
    <div class="card" style="border-left-color:${over ? 'var(--danger)' : 'var(--pers-cyan)'}"><b>${over}</b><span>Semanas s/ umbral (${S.u}%)</span></div>
  </div>

  <div class="card">
    <h3>Matriz de Ausentismo por Oficina (${S.y})</h3>
    <div class="wrap">
      <table class="hm">
        <thead>
          <tr><th class="r" rowspan="2">Oficina / Distrito</th>${mh(W)}<th class="m" rowspan="2">Σ Total</th></tr>
          <tr>${W.map(t => `<th title="${lab(t)}">${fmt(t)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${R.map(r => `
            <tr>
              <th class="r">
                ${e(r.o)}${DIST === 'ALL' ? `<span class="badge-dist">${e(r.d)}</span>` : ''}
                <small>${r.n} téc.</small>
              </th>
              ${r.c.map((c, i) => cell(c, r.n, `${r.o} [${r.d}]: ${c}/${r.n} téc. (${r.n ? Math.round(c / r.n * 100) : 0}%) · ${lab(W[i])}`, -1)).join('')}
              <th>${r.c.reduce((a, b) => a + b, 0)}</th>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="district-total">
            <th class="r" style="background:var(--pers-navy); color:#fff">TOTAL TÉCNICOS <small style="color:#A5B4FC">${calcTechs.length}</small></th>
            ${tot.map((c, i) => cell(c, N, `Total: ${c}/${N} (${Math.round(c / N * 100)}\%) ·${lab(W[i])}`, i, true)).join('')}
            <th style="background:var(--pers-navy); color:#fff">${sum}</th>
          </tr>
          <tr>
            <th class="r">% Ausentismo</th>
            ${tot.map(v => {
              if (!v) return '<td></td>';
              const p = v / N;
              const [bg, fg] = heat(p);
              return `<td style="background:${bg};color:${fg};font-weight:700">${Math.round(p * 100)}%</td>`;
            }).join('')}
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="lg">
      <span><i style="background:#CFEFFF; border:1px solid #00577A"></i>Bajo (&lt;${Math.round(S.u * .9)}%)</span>
      <span><i style="background:#FFE9A8; border:1px solid #8A4B00"></i>Cerca del Umbral</span>
      <span><i style="background:#FFC9CB; border:1px solid #B3171C"></i>Alerta (&gt;${S.u}%)</span>
      <span>Haz clic en cualquier celda de la fila TOTAL TÉCNICOS para ver el detalle de la semana.</span>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-top: 16px;">
    <div class="card" style="margin:0">
      <h3>Semanas con Mayor Salida</h3>
      <ol>${top}</ol>
    </div>
    ${det ? det : `<div class="card" style="margin:0; display:flex; flex-direction:column; justify-content:center; color:var(--pers-muted);">
      <h3 style="color:var(--pers-navy)">Detalle de Semana Seleccionada</h3>
      <p style="margin:0">Haz clic en la fila de <b>TOTAL TÉCNICOS</b> en la tabla para ver qué técnicos están de vacaciones en esa semana específica.</p>
    </div>`}
  </div>`;
}

function plan() {
  const W = wk(S.y), K = W.map(iso);
  const activeOffices = getFilteredOffices();
  const activeTechs = getFilteredTechs();

  if (F !== 'ALL' && !activeOffices.some(o => o.n === F)) F = 'ALL';

  const ts = (F === 'ALL') ? activeTechs : activeTechs.filter(t => t.o === F);
  const calcTs = (F === 'ALL') ? ts.filter(t => !isExcludedOffice(t.o)) : ts;
  const n = calcTs.length || 1;
  const c = K.map(k => calcTs.filter(t => t.w.includes(k)).length);

  return `
  <div class="tabs">
    <button class="${F === 'ALL' ? 'on' : ''}" onclick="F='ALL';render()">🌐 TODAS LAS OFICINAS (${DIST === 'ALL' ? 'TODOS LOS DISTRITOS' : e(DIST)})</button>
    ${activeOffices.map(o => `<button class="${o.n === F ? 'on' : ''}" onclick="F='${e(o.n)}';render()">${e(o.n)}</button>`).join('')}
  </div>

  <div class="card">
    <h3>
      <span>${F === 'ALL' ? 'Vista General - ' + (DIST === 'ALL' ? 'Todos los Distritos' : 'Distrito ' + e(DIST)) : 'Oficina: ' + e(F)} (${S.y})</span>
      <span style="font-size:12px; font-weight:400; color:var(--pers-muted)">Haz clic en cualquier celda para activar/desactivar la semana</span>
    </h3>

    <div class="wrap">
      <table class="hm">
        <thead>
          <tr>
            <th class="r" rowspan="2">Técnico / Dotación</th>
            ${mh(W)}
            <th class="m" rowspan="2">Semanas</th>
          </tr>
          <tr>${W.map(t => `<th title="${lab(t)}">${fmt(t)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${ts.map(t => {
            const userWeeks = W.filter((_, idx) => t.w.includes(K[idx])).map(t => fmt(t));
            const distName = getTechDistrict(t);
            return `
            <tr class="pl">
              <th class="r">
                <div style="font-weight:700">${e(t.n)}</div>
                <span class="badge-off">${e(t.o)}</span>${DIST === 'ALL' ? `<span class="badge-dist">${e(distName)}</span>` : ''}
                <div style="font-weight:400; font-size:10px; color:var(--pers-muted); margin-top:2px;">
                  ${userWeeks.length ? userWeeks.map(w => `<span class="wk-chip">${w}</span>`).join('') : 'Sin semanas programadas'}
                </div>
              </th>
              ${K.map((k, i) => {
                const h = t.w.includes(k);
                return `<td class="${h ? 'x' : ''}" title="${e(t.n)} · Semana ${lab(W[i])}" onclick="tog(${t.id},'${k}')">${h ? '✓' : ''}</td>`;
              }).join('')}
              <th style="background:#F1F5F9">${K.filter(k => t.w.includes(k)).length}</th>
            </tr>`;
          }).join('') || '<tr><td colspan="55">No hay técnicos asignados en esta vista.</td></tr>'}
        </tbody>
        <tfoot>
          <tr>
            <th class="r">Técnicos de Vacaciones<small>${calcTs.length} total</small></th>
            ${c.map((v, i) => cell(v, calcTs.length, `${v}/${calcTs.length} téc. · ${lab(W[i])}`, -1)).join('')}
            <th>${c.reduce((a, b) => a + b, 0)}</th>
          </tr>
          <tr>
            <th class="r">% Ausentismo</th>
            ${c.map(v => {
              if (!v) return '<td></td>';
              const p = v / n;
              const [bg, fg] = heat(p);
              return `<td style="background:${bg};color:${fg};font-weight:700">${Math.round(p * 100)}%</td>`;
            }).join('')}
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>`;
}

function abm() {
  const ts = [...S.t].sort((a, b) => a.o.localeCompare(b.o) || a.n.localeCompare(b.n));
  const K = wk(S.y).map(iso);

  const distOpts = (sel) => S.d.map(d => `<option ${d === sel ? 'selected' : ''}>${e(d)}</option>`).join('');
  const offOpts = (sel) => S.o.map(o => `<option ${o.n === sel ? 'selected' : ''}>${e(o.n)} (${e(o.d)})</option>`).join('');

  return `
  <div class="card">
    <h3>Alta de Nuevo Técnico</h3>
    <div class="f">
      <input id="nn" type="text" placeholder="APELLIDO, NOMBRE" style="width:280px">
      <label>Oficina:</label>
      <select id="no">${offOpts(S.o[0]?.n)}</select>
      <button class="btn" onclick="addT()">➕ Agregar Técnico</button>
    </div>
  </div>

  <div class="card">
    <h3>Nómina de Técnicos (${S.t.length})</h3>
    <table class="tb">
      <thead>
        <tr><th>Nombre Completo</th><th>Oficina / Distrito</th><th>Semanas ${S.y}</th><th>Semanas Programadas</th><th>Acción</th></tr>
      </thead>
      <tbody>
        ${ts.map(t => {
          const assigned = wk(S.y).filter((_, idx) => t.w.includes(K[idx])).map(w => lab(w));
          return `
          <tr>
            <td><input type="text" value="${e(t.n)}" onchange="editT(${t.id},'n',this.value)"></td>
            <td><select onchange="editT(${t.id},'o',this.value)">${offOpts(t.o)}</select></td>
            <td><b>${K.filter(k => t.w.includes(k)).length}</b> sem.</td>
            <td>${assigned.length ? assigned.map(a => `<span class="wk-chip">${a}</span>`).join(' ') : '<i>Ninguna</i>'}</td>
            <td><button class="del" onclick="delT(${t.id})">Eliminar</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="card">
    <h3>Gestión de Distritos</h3>
    ${S.d.map((d, i) => `
      <div class="item-box">
        <input type="text" value="${e(d)}" onchange="renD(${i},this.value)">
        <span style="color:var(--pers-muted)">${S.o.filter(o => o.d === d).length} oficinas asignadas</span>
        <button class="del" onclick="delD(${i})">Eliminar Distrito</button>
      </div>
    `).join('')}
    <div class="f" style="margin-top:14px">
      <input id="nd" type="text" placeholder="Nombre nuevo distrito (ej: Distrito Norte)">
      <button class="btn" onclick="addD()">➕ Agregar Distrito</button>
    </div>
  </div>

  <div class="card">
    <h3>Gestión de Oficinas Técnicas</h3>
    ${S.o.map((o, i) => `
      <div class="item-box">
        <input type="text" value="${e(o.n)}" onchange="renO(${i},this.value)" placeholder="Nombre Oficina">
        <label style="margin-left:10px">Distrito:</label>
        <select onchange="changeDistO(${i},this.value)">${distOpts(o.d)}</select>
        <span style="color:var(--pers-muted); margin-left:10px;">${S.t.filter(t => t.o === o.n).length} técnicos</span>
        <button class="del" onclick="delO(${i})" style="margin-left:auto">Eliminar Oficina</button>
      </div>
    `).join('')}
    <div class="f" style="margin-top:14px">
      <input id="no2" type="text" placeholder="Nombre nueva oficina">
      <label>Asignar a Distrito:</label>
      <select id="nd2">${distOpts(S.d[0])}</select>
      <button class="btn" onclick="addO()">➕ Agregar Oficina</button>
    </div>
  </div>`;
}

function usersAbm() {
  if (!currentUser || currentUser.r !== 'admin') {
    return `<div class="card"><p style="color:var(--danger)">⚠️ Acceso denegado. Solamente los administradores pueden gestionar usuarios.</p></div>`;
  }

  return `
  <div class="card">
    <h3>Gestión de Usuarios de Acceso al Sistema</h3>
    <p style="color:var(--pers-muted); margin-top:-8px; margin-bottom:16px;">
      Creá y administrá las cuentas de los usuarios que pueden ingresar al sistema y asignales permisos de Administrador o Usuario.
    </p>

    <div class="f" style="margin-bottom:20px; background:#F8FAFC; padding:12px; border-radius:10px;">
      <input id="nu-u" type="text" placeholder="Nombre de Usuario (ej: jperez)" style="width:180px">
      <input id="nu-p" type="text" placeholder="Contraseña (opcional)" style="width:220px">
      <label>Rol:</label>
      <select id="nu-r">
        <option value="user">Usuario (User)</option>
        <option value="admin">Administrador (Admin)</option>
      </select>
      <button class="btn" onclick="addUser()">➕ Crear Usuario</button>
    </div>

    <table class="tb">
      <thead>
        <tr><th>Usuario</th><th>Contraseña</th><th>Rol / Atributo</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        ${S.users.map((u, idx) => `
          <tr>
            <td><b>${e(u.u)}</b>${u.u === currentUser.u ? '<span class="wk-chip">Tu sesión</span>' : ''}</td>
            <td><input type="text" value="${e(u.p)}" placeholder="(Sin contraseña)" onchange="editUser(${idx},'p',this.value)" style="width:200px"></td>
            <td>
              <select onchange="editUser(${idx},'r',this.value)">
                <option value="user" ${u.r === 'user' ? 'selected' : ''}>Usuario (User)</option>
                <option value="admin" ${u.r === 'admin' ? 'selected' : ''}>Administrador (Admin)</option>
              </select>
            </td>
            <td>
              ${u.u === currentUser.u 
                ? '<i style="color:var(--pers-muted)">Sesión activa</i>' 
                : `<button class="del" onclick="delUser(${idx})">Eliminar</button>`
              }
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="card" style="margin-top:16px;">
    <h3>📧 Configuración de Alertas por Correo Electrónico (Solo Admin)</h3>
    <p style="color:var(--pers-muted); font-size:12px; margin-bottom:12px;">
      Cuando el ausentismo global distrital alcance o supere el % de umbral, se enviará un correo automático a las casillas indicadas.
    </p>
    <div class="f" style="flex-direction:column; align-items:flex-start; gap:10px;">
      <div style="width:100%;">
        <label style="display:block; font-weight:700; font-size:11px; margin-bottom:4px;">Correos Destinatarios (separados por coma):</label>
        <input id="cfg-emails" type="text" style="width:100%;" placeholder="ejemplo@telecom.com, jefe@telecom.com" value="${e(S.alertEmails || '')}">
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <label style="font-weight:700; font-size:11px;">Umbral de Disparo (%):</label>
        <input id="cfg-threshold" type="number" min="1" max="100" style="width:70px;" value="${S.u || 20}">
        <button class="btn" onclick="saveEmailSettings()">💾 Guardar Configuración de Correo</button>
      </div>
    </div>
  </div>`;
}

function logView() {
  if (!currentUser || currentUser.r !== 'admin') {
    return `<div class="card"><p style="color:var(--danger)">⚠️ Acceso denegado. Solamente los administradores pueden ver el log de auditoría.</p></div>`;
  }
  const logs = S.logs || [];
  const filterInput = $('#log-filter');
  const filterTerm = filterInput ? filterInput.value.trim().toLowerCase() : '';

  const filtered = logs.filter(l => 
    l.u.toLowerCase().includes(filterTerm) || 
    l.a.toLowerCase().includes(filterTerm) || 
    l.t.includes(filterTerm)
  );

  return `
  <div class="card">
    <h3>
      <span>📋 Historial de Actividad y Auditoría (${logs.length} registros)</span>
      <button class="del" onclick="clearLogs()">🗑 Limpiar Historial</button>
    </h3>
    <p style="color:var(--pers-muted); margin-top:-8px; margin-bottom:16px;">
      Registro de auditoría en tiempo real de todas las acciones, asignaciones y modificaciones realizadas por los usuarios.
    </p>

    <div class="f" style="margin-bottom:14px;">
      <input id="log-filter" type="text" placeholder="🔍 Buscar por usuario, acción o fecha..." value="${e(filterTerm)}" oninput="render()" style="width:340px;">
    </div>

    <table class="tb">
      <thead>
        <tr><th style="width:170px">Fecha y Hora</th><th style="width:140px">Usuario</th><th>Acción / Evento Registrado</th></tr>
      </thead>
      <tbody>
        ${filtered.map(l => `
          <tr>
            <td><span style="font-family:monospace; font-size:11px; color:var(--pers-muted)">${e(l.t)}</span></td>
            <td><b>${e(l.u)}</b></td>
            <td>${e(l.a)}</td>
          </tr>
        `).join('') || '<tr><td colspan="3">No se encontraron registros en el historial.</td></tr>'}
      </tbody>
    </table>
  </div>`;
}