function setSyncStatus(state, msg) {
  const dot = $('#sync-dot'), txt = $('#sync-text');
  if (!dot || !txt) return;
  dot.className = 'sync-dot ' + (state === 'busy' ? 'busy' : state === 'err' ? 'err' : '');
  txt.textContent = msg;
}

async function loadData(manual = false) {
  if (manual && hasUnsavedChanges) {
    if (!confirm('⚠️ Tenés cambios sin guardar en tu pantalla.\n\nSi recargás desde la nube perderás los cambios no guardados. ¿Deseás continuar?')) return;
  }

  setSyncStatus('busy', manual ? 'Actualizando...' : 'Conectando...');
  try {
    const res = await fetch(API_URL + '/latest', { headers: { 'X-Master-Key': MASTER_KEY } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data.record) {
      S = data.record;
      normalizeData();
    } else {
      S = JSON.parse(JSON.stringify(SEED));
    }
    nid = Math.max(0, ...S.t.map(t => t.id));
    hasUnsavedChanges = false;
    updateSaveButtonUI();
    setSyncStatus('ok', 'Sincronizado');
  } catch(err) {
    console.error('Error al cargar de JSONBin:', err);
    normalizeData();
    setSyncStatus('err', 'Sin conexión');
  }
  
  if (currentUser) render();
}

async function saveData() {
  setSyncStatus('busy', 'Guardando...');
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
      body: JSON.stringify(S)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    hasUnsavedChanges = false;
    updateSaveButtonUI();
    setSyncStatus('ok', 'Guardado en Nube');
    setTimeout(() => setSyncStatus('ok', 'Sincronizado'), 2000);
  } catch(err) {
    console.error('Error al guardar en JSONBin:', err);
    setSyncStatus('err', 'Error al guardar');
    alert('❌ Ocurrió un error al intentar guardar en la nube. Revisa tu conexión a internet.');
  }
}

function checkSavedSession() {
  const savedUserJson = sessionStorage.getItem('vacations_user');
  if (savedUserJson) {
    try {
      const uSaved = JSON.parse(savedUserJson);
      normalizeData();
      const found = S.users.find(x => x.u.toLowerCase() === uSaved.u.toLowerCase());
      if (found) {
        currentUser = found;
        showAppUI();
        loadData();
        return;
      }
    } catch(e) {}
  }
  showLoginUI();
  loadData();
}

function showAppUI() {
  $('#login-screen').style.display = 'none';
  $('#main-header').style.display = 'flex';
  $('#app').style.display = 'block';
  render();
}

function showLoginUI() {
  $('#login-screen').style.display = 'flex';
  $('#main-header').style.display = 'none';
  $('#app').style.display = 'none';
}

function doLogin(evt) {
  evt.preventDefault();
  const uInput = $('#l-user').value.trim().toLowerCase();
  const pInput = $('#l-pass').value.trim();

  normalizeData();
  const found = S.users.find(x => x.u.toLowerCase() === uInput);

  if (found && (found.p || '') === pInput) {
    currentUser = found;
    sessionStorage.setItem('vacations_user', JSON.stringify({ u: found.u }));
    logAction('Inició sesión en el sistema');
    $('#l-err').style.display = 'none';
    showAppUI();
  } else {
    $('#l-err').style.display = 'block';
  }
}

function doLogout() {
  if (hasUnsavedChanges) {
    if (!confirm('⚠️ Tenés cambios pendientes que NO fueron guardados en la nube.\n\n¿Estás seguro de cerrar sesión y perder los cambios no guardados?')) return;
  }
  if (currentUser) logAction('Cerró sesión');
  sessionStorage.removeItem('vacations_user');
  currentUser = null;
  hasUnsavedChanges = false;
  $('#l-user').value = '';
  $('#l-pass').value = '';
  showLoginUI();
}

window.addEventListener('beforeunload', function (e) {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = 'Tenés cambios sin guardar en el sistema. ¿Deseás salir de todas formas?';
    return e.returnValue;
  }
});

function openChangePwdModal() {
  $('#pwd-old').value = '';
  $('#pwd-new').value = '';
  $('#pwd-confirm').value = '';
  $('#pwd-err').style.display = 'none';
  $('#pwd-modal').style.display = 'flex';
}

function saveNewPwd(evt) {
  evt.preventDefault();
  const oldP = $('#pwd-old').value.trim();
  const newP = $('#pwd-new').value.trim();
  const confP = $('#pwd-confirm').value.trim();
  const errDiv = $('#pwd-err');

  if (currentUser.p && oldP !== currentUser.p) {
    errDiv.textContent = 'La contraseña actual no es correcta.';
    errDiv.style.display = 'block';
    return;
  }
  if (!newP) {
    errDiv.textContent = 'La nueva contraseña no puede estar vacía.';
    errDiv.style.display = 'block';
    return;
  }
  if (newP !== confP) {
    errDiv.textContent = 'Las nuevas contraseñas no coinciden.';
    errDiv.style.display = 'block';
    return;
  }

  currentUser.p = newP;
  const uObj = S.users.find(x => x.u.toLowerCase() === currentUser.u.toLowerCase());
  if (uObj) uObj.p = newP;

  logAction('Cambió su propia contraseña');
  markUnsaved();
  $('#pwd-modal').style.display = 'none';
  alert('✅ Contraseña actualizada correctamente. No olvides presionar "Guardar Cambios".');
}

function tog(id, k) {
  const t = S.t.find(t => t.id == id);
  if (!t) return;
  const i = t.w.indexOf(k);

  const W = wk(S.y);
  const K = W.map(iso);
  const weekIndex = K.indexOf(k);
  const weekLabel = weekIndex >= 0 ? lab(W[weekIndex]) : k;

  if (i < 0) {
    if (!isExcludedOffice(t.o)) {
      const officeCount = S.t.filter(x => x.o === t.o && x.w.includes(k)).length;
      if (officeCount >= 2) {
        alert(`⚠️ Límite por Oficina Alcanzado:\nLa oficina "${t.o}" ya tiene 2 técnicos en vacaciones en esta semana.`);
        return;
      }

      const globalCount = S.t.filter(x => !isExcludedOffice(x.o) && getTechDistrict(x) === getTechDistrict(t) && x.w.includes(k)).length;
      if (globalCount >= 9) {
        alert(`⚠️ Límite General Alcanzado:\nSe ha alcanzado el cupo máximo de 9 técnicos simultáneos en vacaciones en el distrito para esta semana (excluyendo Supervisores y MS).`);
        return;
      }
    }
    t.w.push(k);
    logAction(`Asignó vacaciones a "${t.n}" (${t.o}) - Semana: ${weekLabel}`);

    const techDistrict = getTechDistrict(t);
    const globalDistrictTechs = S.t.filter(x => !isExcludedOffice(x.o) && getTechDistrict(x) === techDistrict);
    const absentDistrictTechs = globalDistrictTechs.filter(x => x.w.includes(k));
    const globalPercent = globalDistrictTechs.length ? (absentDistrictTechs.length / globalDistrictTechs.length) : 0;

    if (globalPercent >= (S.u / 100)) {
      const absentNames = absentDistrictTechs.map(x => `${x.n} (${x.o})`);
      sendThresholdAlert(techDistrict, weekLabel, globalPercent, S.u, absentNames);
    }
  } else {
    t.w.splice(i, 1);
    logAction(`Quitó vacaciones a "${t.n}" (${t.o}) - Semana: ${weekLabel}`);
  }

  markUnsaved();
  render();
}

function renderHeaderSelects() {
  $('#ds').innerHTML = `<option value="ALL">🌐 TODOS LOS DISTRITOS</option>` + S.d.map(d => `<option value="${e(d)}" ${d === DIST ? 'selected' : ''}>${e(d)}</option>`).join('');
  $('#ys').innerHTML = [2026, 2027, 2028, 2029, 2030].map(y => `<option ${y == S.y ? 'selected' : ''}>${y}</option>`).join('');
  $('#u').value = S.u;

  if (currentUser) {
    const isAdm = currentUser.r === 'admin';
    $('#u-badge').innerHTML = `👤 ${e(currentUser.u)} <span class="role-chip">${e(currentUser.r)}</span>`;
    $('#btn-u-nav').style.display = isAdm ? 'inline-flex' : 'none';
    $('#btn-l-nav').style.display = isAdm ? 'inline-flex' : 'none';
    $('#btn-admin-csv').style.display = isAdm ? 'inline-flex' : 'none';
    $('#btn-admin-backup').style.display = isAdm ? 'inline-flex' : 'none';
    $('#btn-admin-load').style.display = isAdm ? 'inline-flex' : 'none';
  }
  updateSaveButtonUI();
}

function render() {
  renderHeaderSelects();
  const w = $('.wrap'), s = w && [w.scrollLeft, w.scrollTop];$('#app').innerHTML = V === 'd' ? dash() : V === 'p' ? plan() : V === 'u' ? usersAbm() : V === 'l' ? logView() : abm();
  document.querySelectorAll('header button[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === V));
  const w2 = $('.wrap'); if (s && w2) { w2.scrollLeft = s[0]; w2.scrollTop = s[1]; }
}

function saveEmailSettings() {
  const emails = $('#cfg-emails').value.trim();
  const threshold = +$('#cfg-threshold').value || 20;

  S.alertEmails = emails;
  S.u = threshold;

  logAction(`Actualizó la configuración de e-mails (${S.u}%, Destinos: ${S.alertEmails})`);
  markUnsaved();
  saveData();
  alert('✅ Configuración de alertas por correo guardada correctamente.');
}

function addUser() {
  const uVal = $('#nu-u').value.trim().toLowerCase();
  const pVal = $('#nu-p').value.trim();
  const rVal = $('#nu-r').value;

  if (!uVal) return alert('Debes ingresar un nombre de usuario.');
  if (S.users.some(x => x.u.toLowerCase() === uVal)) return alert('Ya existe un usuario con ese nombre.');

  S.users.push({ u: uVal, p: pVal, r: rVal });
  logAction(`Creó al usuario "${uVal}" con rol [${rVal}]`);
  markUnsaved();
  $('#nu-u').value = ''; $('#nu-p').value = '';
  render();
}

function editUser(idx, field, value) {
  if (S.users[idx]) {
    const target = S.users[idx];
    if (field === 'p') {
      target.p = value.trim();
      logAction(`Cambió la contraseña del usuario "${target.u}"`);
    }
    if (field === 'r') {
      target.r = value;
      logAction(`Cambió el rol del usuario "${target.u}" a [${value}]`);
    }
    markUnsaved();
    render();
  }
}

function delUser(idx) {
  const target = S.users[idx];
  if (!target) return;
  if (target.u === currentUser.u) return alert('No podés eliminar tu propio usuario en uso.');

  if (confirm(`¿Eliminar al usuario "${target.u}"?`)) {
    S.users.splice(idx, 1);
    logAction(`Eliminó al usuario "${target.u}"`);
    markUnsaved();
    render();
  }
}

function clearLogs() {
  if (confirm('¿Estás seguro de vaciar todo el log de auditoría del sistema?')) {
    S.logs = [];
    logAction('Limpió todo el historial de auditoría');
    markUnsaved();
    render();
  }
}

function addT() {
  const n = $('#nn').value.trim().toUpperCase();
  if (!n || !S.o.length) return alert('Debes cargar un nombre e ingresar una oficina válida.');
  const selectedOff = $('#no').value.split(' (')[0];
  S.t.push({ id: ++nid, n, o: selectedOff, w: [] });
  logAction(`Agregó nuevo técnico "${n}" en oficina "${selectedOff}"`);
  markUnsaved();
  $('#nn').value = '';
  render();
}

function delT(id) {
  const t = S.t.find(x => x.id == id);
  if (!t) return;
  if (confirm(`¿Eliminar técnico "${t.n}" y sus semanas de vacaciones?`)) {
    S.t = S.t.filter(x => x.id != id);
    logAction(`Eliminó al técnico "${t.n}" (${t.o})`);
    markUnsaved();
    render();
  }
}

function editT(id, f, v) {
  const t = S.t.find(t => t.id == id);
  if (!t) return;
  if (f === 'n') {
    const oldName = t.n;
    t.n = v.trim().toUpperCase();
    logAction(`Cambió nombre de técnico "${oldName}" a "${t.n}"`);
  }
  if (f === 'o') {
    const oldOff = t.o;
    t.o = v.split(' (')[0];
    logAction(`Reasignó técnico "${t.n}" de "${oldOff}" a "${t.o}"`);
  }
  markUnsaved();
  render();
}

function addD() {
  const n = $('#nd').value.trim();
  if (!n) return;
  if (S.d.includes(n)) return alert('El distrito ya existe.');
  S.d.push(n);
  logAction(`Creó el distrito "${n}"`);
  markUnsaved();
  $('#nd').value = '';
  render();
}

function renD(i, v) {
  v = v.trim();
  if (!v || S.d.includes(v)) return render();
  const old = S.d[i];
  S.d[i] = v;
  S.o.forEach(o => { if (o.d === old) o.d = v; });
  if (DIST === old) DIST = v;
  logAction(`Renombró el distrito "${old}" a "${v}"`);
  markUnsaved();
  render();
}

function delD(i) {
  const distName = S.d[i];
  if (S.o.some(o => o.d === distName)) return alert('No puedes eliminar un distrito que tiene oficinas asociadas.');
  if (S.d.length <= 1) return alert('Debe existir al menos un distrito.');
  if (confirm(`¿Eliminar el distrito "${distName}"?`)) {
    S.d.splice(i, 1);
    if (DIST === distName) DIST = 'ALL';
    logAction(`Eliminó el distrito "${distName}"`);
    markUnsaved();
    render();
  }
}

function addO() {
  const n = $('#no2').value.trim();
  const d = $('#nd2').value;
  if (!n) return;
  if (S.o.some(o => o.n === n)) return alert('Ya existe una oficina con ese nombre.');
  S.o.push({ n, d });
  logAction(`Creó la oficina "${n}" en el distrito "${d}"`);
  markUnsaved();
  $('#no2').value = '';
  render();
}

function renO(i, v) {
  v = v.trim();
  if (!v) return render();
  const old = S.o[i].n;
  if (S.o.some((o, idx) => idx !== i && o.n === v)) return alert('Ya existe otra oficina con ese nombre.');
  S.o[i].n = v;
  S.t.forEach(t => { if (t.o === old) t.o = v; });
  if (F === old) F = v;
  logAction(`Renombró la oficina "${old}" a "${v}"`);
  markUnsaved();
  render();
}

function changeDistO(i, v) {
  const off = S.o[i];
  const oldD = off.d;
  off.d = v;
  logAction(`Cambió oficina "${off.n}" del distrito "${oldD}" al distrito "${v}"`);
  markUnsaved();
  render();
}

function delO(i) {
  const offName = S.o[i].n;
  if (S.t.some(t => t.o === offName)) return alert('Debes reasignar o eliminar los técnicos de esta oficina primero.');
  if (confirm(`¿Eliminar la oficina "${offName}"?`)) {
    S.o.splice(i, 1);
    if (F === offName) F = 'ALL';
    logAction(`Eliminó la oficina "${offName}"`);
    markUnsaved();
    render();
  }
}

function dl(n, x, t) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([x], { type: t }));
  a.download = n; a.click();
}

function csv() {
  const W = wk(S.y), K = W.map(iso);
  const activeTechs = getFilteredTechs();
  logAction(`Exportó la planilla de vacaciones a CSV`);
  dl('vacaciones-personal-' + S.y + '.csv', '\ufeff' + [
    ['Técnico', 'Oficina', 'Distrito', ...W.map(lab)].join(';'),
    ...activeTechs.map(t => [t.n, t.o, getTechDistrict(t), ...K.map(k => t.w.includes(k) ? 'X' : '')].join(';'))
  ].join('\n'), 'text/csv');
}

function imp(i) {
  const r = new FileReader();
  r.onload = async () => {
    try {
      const d = JSON.parse(r.result);
      S = d; normalizeData(); nid = Math.max(0, ...S.t.map(t => t.id)); F = 'ALL'; DIST = 'ALL';
      logAction(`Restauró una copia de seguridad JSON`);
      markUnsaved();
      render();
    } catch (x) { alert('Archivo de backup no válido.'); }
  };
  r.readAsText(i.files[0]); i.value = '';
}

window.onload = function() {
  checkSavedSession();
};