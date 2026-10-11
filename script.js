/* ── Anyagtervezési (MD3) Vektoros Ikonok (24x24 standard, soha nem vágódik le) ── */
const ICONS = {
  copy: `<svg class="ci" xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 24 24" width="15" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
  expandLess: `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor"><path d="m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>`,
  expandMore: `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>`,
  lightMode: `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`,
  darkMode: `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`,
  autoMode: `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14v12c3.31 0 6-2.69 6-6s-2.69-6-6-6z"/></svg>`
};

/* ── DOM elemek gyorsítótárazása ── */
const els = {};

function initElements() {
  els.toast = document.getElementById('toast');
  els.toastMsg = document.getElementById('toastMsg');
  els.host = document.getElementById('host');
  els.mask1 = document.getElementById('mask1');
  els.mask2 = document.getElementById('mask2');
  els.calcForm = document.getElementById('calcForm');
  els.results = document.getElementById('results');
  els.resultTable = document.getElementById('resultTable');
  els.toggleBin = document.getElementById('toggleBin');
  els.subnetSection = document.getElementById('subnetSection');
  els.historySection = document.getElementById('historySection');
  els.historyList = document.getElementById('historyList');
  els.cheatTable = document.getElementById('cheatTable');
  els.cheatBody = document.getElementById('cheatBody');
  els.toggleCheat = document.getElementById('toggleCheat');
  els.clearHistory = document.getElementById('clearHistory');
  els.themeBtn = document.getElementById('themeBtn');
}

/* ── Segédfüggvények ── */
function ipToInt(ip) {
  let parts = ip.split('.');
  if (parts.length !== 4) return 0;
  return (((+parts[0] << 24) | (+parts[1] << 16) | (+parts[2] << 8) | +parts[3]) >>> 0);
}

function intToIp(n) {
  return ((n >>> 24) & 255) + '.' + ((n >>> 16) & 255) + '.' + ((n >>> 8) & 255) + '.' + (n & 255);
}

function formatBinFast(n, ml) {
  let out = '';
  for (let oct = 0; oct < 4; oct++) {
    if (oct) out += '<span class="bin-dot">.</span>';
    let shift = (3 - oct) * 8;
    let byte = (n >>> shift) & 255;
    for (let b = 7; b >= 0; b--) {
      let p = oct * 8 + (7 - b);
      let c = (byte >>> b) & 1;
      out += p < ml ? `<span class="bn">${c}</span>` : c;
    }
  }
  return out;
}

function intToBin32(n) {
  return (n >>> 0).toString(2).padStart(32, '0');
}

function getMask(s) {
  if (!s) return null;
  s = s.trim();
  if (s.indexOf('.') !== -1) {
    let m = ipToInt(s), len = 0, t = m;
    while (t & 0x80000000) { len++; t = (t << 1) >>> 0; }
    return { int: m, len };
  } else {
    let len = parseInt(s, 10);
    if (isNaN(len) || len < 0 || len > 32) return null;
    return { int: len === 0 ? 0 : ((0xFFFFFFFF << (32 - len)) >>> 0), len };
  }
}

function getClass(ip) {
  let f = (ip >>> 24) & 255;
  if (f < 128) return 'A osztály';
  if (f < 192) return 'B osztály';
  if (f < 224) return 'C osztály';
  if (f < 240) return 'D osztály';
  return 'E osztály';
}

function getType(ip) {
  let f = (ip >>> 24) & 255;
  let s2 = (ip >>> 16) & 255;
  if (f === 10) return 'private';
  if (f === 172 && s2 >= 16 && s2 <= 31) return 'private';
  if (f === 192 && s2 === 168) return 'private';
  if (f === 127) return 'loopback';
  if (f === 169 && s2 === 254) return 'link-local';
  if (f >= 224 && f < 240) return 'multicast';
  return 'public';
}

function badge(cls, txt) {
  return `<span class="badge ${cls}">${txt}</span>`;
}

/* ── Toast (MD3 Snackbar) ── */
let toastTimer = null;
function showToast(msg = 'Másolva!') {
  const t = els.toast;
  const tm = els.toastMsg;
  if (!t) return;
  if (tm) tm.textContent = msg;
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1500);
}

/* ── Másolás a vágólapra ── */
function copyText(txt) {
  if (!navigator.clipboard) {
    const el = document.createElement('textarea');
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Másolva: ' + txt);
    return;
  }
  navigator.clipboard.writeText(txt)
    .then(() => showToast('Másolva: ' + txt))
    .catch(() => showToast('Másolva!'));
}

/* ── Sorok felépítése ── */
let showBin = true;

function row(label, ipInt, cidr, metaHtml, netSec) {
  let ip = intToIp(ipInt);
  let disp = ip;
  let copyVal = ip;
  if (label === 'Hálózati maszk') { disp = ip + ' = /' + cidr; copyVal = ip; }
  if (label === 'Hálózat') { disp = ip + '/' + cidr; copyVal = ip + '/' + cidr; }
  let bin = formatBinFast(ipInt, cidr);
  let binRaw = intToBin32(ipInt);
  return `<tr class="${netSec ? 'net-section' : ''}">
    <td class="lbl">${label}</td>
    <td class="val">
      <span class="copy-wrap" data-copy="${copyVal}" title="Másolás vágólapra">
        ${disp}${ICONS.copy}
      </span>
    </td>
    <td class="bin-col" data-copy="${binRaw}" title="Bináris másolása">${bin}</td>
    <td class="meta">${metaHtml || ''}</td>
  </tr>`;
}

function hostsRow(hosts) {
  return `<tr class="net-section">
    <td class="lbl">Hostok/Háló</td>
    <td class="val">
      <span class="copy-wrap" data-copy="${hosts}" title="Másolás vágólapra">
        ${hosts.toLocaleString('hu-HU')}${ICONS.copy}
      </span>
    </td>
    <td class="bin-col"></td>
    <td class="meta"></td>
  </tr>`;
}

/* ── Alhálózat vizualizáció ── */
function renderSubnet(netInt, m1, m2) {
  let sec = els.subnetSection;
  if (!m2 || m2.len <= m1.len || m2.len > 32) { sec.style.display = 'none'; return; }
  let diff = m2.len - m1.len;
  let numSub = Math.pow(2, diff);
  let hps = m2.len < 31 ? Math.pow(2, 32 - m2.len) - 2 : (m2.len === 31 ? 2 : 1);
  let blockSize = Math.pow(2, 32 - m2.len);
  let cols = ['#0b57d0', '#146c2e', '#e37400', '#b3261e', '#7c3aed', '#0284c7', '#d97706', '#db2777'];
  let maxShow = Math.min(numSub, 8);
  let segs = '';
  for (let i = 0; i < maxShow; i++) {
    let sn = (netInt + i * blockSize) >>> 0;
    let ip = intToIp(sn);
    let col = cols[i % cols.length];
    let pct = 100 / maxShow;
    let lbl = numSub <= 8 ? ip : (i < maxShow - 1 ? ip : '…');
    segs += `<div class="subnet-seg" style="width:${pct}%;background:${col}20;border-right:1px solid ${col}40;color:${col}" title="${ip}/${m2.len}">${lbl}</div>`;
  }
  sec.style.display = 'block';
  sec.innerHTML = `<div class="subnet-card">
    <div class="subnet-card-header">
      Alhálózat vizualizáció — /${m2.len} maszk a /${m1.len}-en belül
    </div>
    <div class="subnet-bar">${segs}</div>
    <div class="subnet-info">
      <span>${numSub.toLocaleString('hu-HU')}</span> alhálózat &nbsp;·&nbsp;
      <span>${hps.toLocaleString('hu-HU')}</span> host/alhálózat &nbsp;·&nbsp;
      összesen <span>${(numSub * hps).toLocaleString('hu-HU')}</span> host
    </div>
  </div>`;
}

/* ── Előzmények ── */
let calcHistory = [];
try { calcHistory = JSON.parse(localStorage.getItem('ipcalc_h') || '[]'); } catch (e) { }

function renderHistory() {
  let sec = els.historySection;
  let list = els.historyList;
  if (!calcHistory.length) { sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  list.innerHTML = calcHistory.map(h => `<button type="button" class="history-item" data-history="${h}" title="Betöltés">${h}</button>`).join('');
}

function loadHistory(e) {
  let [ip, cidr] = e.split('/');
  els.host.value = ip;
  els.mask1.value = cidr;
  els.mask2.value = '';
  calculate();
}

/* ── URL szinkronizáció ── */
function updateUrl(ip, mask, mask2) {
  let params = new URLSearchParams();
  params.set('ip', ip);
  params.set('mask', mask);
  if (mask2) params.set('mask2', mask2);
  window.history.replaceState({}, '', '?' + params.toString());
}

function loadFromUrl() {
  let p = new URLSearchParams(window.location.search);
  let ip = p.get('ip');
  if (ip) {
    els.host.value = ip;
    let m = p.get('mask');
    if (m) els.mask1.value = m;
    let m2 = p.get('mask2');
    if (m2) els.mask2.value = m2;
    return true;
  }
  return false;
}

/* ── Fő számítás ── */
function calculate() {
  let hi = els.host.value.trim();
  let mi = els.mask1.value.trim() || '24';
  let m2i = els.mask2.value.trim();
  if (!hi) return;
  let parts = hi.split('/');
  if (parts.length === 2) {
    hi = parts[0].trim();
    mi = parts[1].trim();
    els.mask1.value = mi;
    els.host.value = hi;
  }
  let ipInt = ipToInt(hi);
  let m1 = getMask(mi); if (!m1) return;
  let m2 = m2i ? getMask(m2i) : null;
  let mInt = m1.int, cidr = m1.len;
  let netInt = (ipInt & mInt) >>> 0;
  let wildInt = (~mInt) >>> 0;
  let bcInt = (netInt | wildInt) >>> 0;
  let hMinInt = cidr < 31 ? (netInt + 1) >>> 0 : netInt;
  let hMaxInt = cidr < 31 ? (bcInt - 1) >>> 0 : bcInt;
  let hosts = cidr < 31 ? Math.max(0, bcInt - netInt - 1) : (cidr === 31 ? 2 : 1);
  let cls = getClass(netInt);
  let type = getType(ipInt);
  let clsBadge = badge('badge-class', cls);
  let typeBadge = '';
  if (type === 'private')    typeBadge = badge('badge-priv', 'Privát');
  if (type === 'public')     typeBadge = badge('badge-pub', 'Publikus');
  if (type === 'multicast')  typeBadge = badge('badge-mc', 'Multicast');
  if (type === 'loopback')   typeBadge = badge('badge-class', 'Loopback');
  if (type === 'link-local') typeBadge = badge('badge-class', 'Link-local');

  // Táblázat fejléc és sorok összeállítása
  // Sorrend: Hálózat -> Host min -> Host max -> Broadcast
  let thead = `<thead>
    <tr>
      <th style="width:120px">Paraméter</th>
      <th>Érték</th>
      <th class="bin-col-header">Bináris reprezentáció</th>
      <th style="width:110px">Információ</th>
    </tr>
  </thead>`;

  let tbody = '<tbody>';
  tbody += row('Cím',            ipInt,   cidr, '', false);
  tbody += row('Hálózati maszk', mInt,    cidr, '', false);
  tbody += row('Wildcard',       wildInt, cidr, '', false);
  tbody += `<tr><td colspan="4" class="table-divider"></td></tr>`;
  tbody += row('Hálózat',        netInt,  cidr, `<div class="badges">${clsBadge}${typeBadge}</div>`, true);
  tbody += row('Host min',       hMinInt, cidr, '', false);
  tbody += row('Host max',       hMaxInt, cidr, '', false);
  tbody += row('Broadcast',      bcInt,   cidr, '', false);
  tbody += hostsRow(hosts);
  tbody += '</tbody>';

  els.resultTable.innerHTML = thead + tbody;
  updateBin();
  renderSubnet(netInt, m1, m2);

  let entry = `${intToIp(ipInt)}/${cidr}`;
  calcHistory = [entry, ...calcHistory.filter(h => h !== entry)].slice(0, 10);
  try { localStorage.setItem('ipcalc_h', JSON.stringify(calcHistory)); } catch (e) { }
  renderHistory();
  updateUrl(intToIp(ipInt), cidr, m2i || '');
}

/* ── Bináris nézet kapcsoló ── */
function updateBin() {
  const resultCard = els.resultTable?.closest('.result-card');
  if (resultCard) {
    resultCard.classList.toggle('hide-bin', !showBin);
  }
  if (els.toggleBin) {
    els.toggleBin.classList.toggle('active', showBin);
  }
}

function initBinaryPreference() {
  try {
    const saved = localStorage.getItem('ipcalc_bin');
    if (saved !== null) showBin = JSON.parse(saved);
  } catch (e) { }
  updateBin();
}

function saveBinaryPreference() {
  try { localStorage.setItem('ipcalc_bin', JSON.stringify(showBin)); } catch (e) { }
}

/* ── Témakezelés (MD3) ── */
const THEME_KEY = 'ipcalc_theme';

function applyThemeValue(value) {
  const btn = els.themeBtn || document.getElementById('themeBtn');
  if (value === 'system') {
    document.documentElement.removeAttribute('data-theme');
    if (btn) btn.innerHTML = ICONS.autoMode;
  } else {
    document.documentElement.setAttribute('data-theme', value);
    if (btn) btn.innerHTML = value === 'light' ? ICONS.lightMode : ICONS.darkMode;
  }
}

function cycleTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { }
  let next;
  if (saved === null) next = 'light';
  else if (saved === 'light') next = 'dark';
  else { next = null; }

  if (next === null) {
    try { localStorage.removeItem(THEME_KEY); } catch (e) { }
    applyThemeValue('system');
  } else {
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { }
    applyThemeValue(next);
  }
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { }
  if (saved === 'light' || saved === 'dark') {
    applyThemeValue(saved);
  } else {
    applyThemeValue('system');
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      let current = null;
      try { current = localStorage.getItem(THEME_KEY); } catch (err) { }
      if (current === null) applyThemeValue('system');
    });
  }
}

/* ── Alhálózat referencia táblázat ── */
const MASKS = [
  [32, '255.255.255.255', 1,        'Host útvonal'],
  [31, '255.255.255.254', 2,        'P2P kapcsolat'],
  [30, '255.255.255.252', 2,        'P2P (használható)'],
  [29, '255.255.255.248', 6,        ''],
  [28, '255.255.255.240', 14,       ''],
  [27, '255.255.255.224', 30,       ''],
  [26, '255.255.255.192', 62,       ''],
  [25, '255.255.255.128', 126,      ''],
  [24, '255.255.255.0',   254,      'C osztály'],
  [23, '255.255.254.0',   510,      ''],
  [22, '255.255.252.0',   1022,     ''],
  [21, '255.255.248.0',   2046,     ''],
  [20, '255.255.240.0',   4094,     ''],
  [19, '255.255.224.0',   8190,     ''],
  [18, '255.255.192.0',   16382,    ''],
  [17, '255.255.128.0',   32766,    ''],
  [16, '255.255.0.0',     65534,    'B osztály'],
  [15, '255.254.0.0',     131070,   ''],
  [14, '255.252.0.0',     262142,   ''],
  [13, '255.248.0.0',     524286,   ''],
  [12, '255.240.0.0',     1048574,  ''],
  [11, '255.224.0.0',     2097150,  ''],
  [10, '255.192.0.0',     4194302,  ''],
  [9,  '255.128.0.0',     8388606,  ''],
  [8,  '255.0.0.0',       16777214, 'A osztály'],
];

let cheatVisible = true;
function toggleCheat() {
  cheatVisible = !cheatVisible;
  if (els.cheatBody) els.cheatBody.style.display = cheatVisible ? '' : 'none';
  if (els.toggleCheat) {
    els.toggleCheat.innerHTML = cheatVisible ? ICONS.expandLess : ICONS.expandMore;
  }
}

function buildCheat() {
  let thead = `<thead>
    <tr>
      <th style="width:60px">Prefix</th>
      <th>Alhálózati maszk</th>
      <th>CIDR</th>
      <th>Használható host</th>
      <th>Megjegyzés</th>
    </tr>
  </thead>`;

  let tbody = '<tbody>';
  for (let [cidr, mask, hosts, note] of MASKS) {
    let noteHtml = note ? `<span class="badge badge-class">${note}</span>` : '';
    tbody += `<tr>
      <td class="lbl" style="color:var(--md-sys-color-primary);font-family:var(--font-mono);font-size:0.85rem">/${cidr}</td>
      <td class="val">
        <span class="copy-wrap" data-copy="${mask}" title="Maszk másolása">
          ${mask}${ICONS.copy}
        </span>
      </td>
      <td class="val" style="color:var(--md-sys-color-on-surface-variant)">
        <span class="copy-wrap" data-copy="/${cidr}" title="Prefix másolása">
          /${cidr}${ICONS.copy}
        </span>
      </td>
      <td class="val">${hosts.toLocaleString('hu-HU')} host</td>
      <td class="meta">${noteHtml}</td>
    </tr>`;
  }
  tbody += '</tbody>';

  if (els.cheatTable) els.cheatTable.innerHTML = thead + tbody;
  if (els.toggleCheat) els.toggleCheat.innerHTML = ICONS.expandLess;
}

/* ── Service Worker a háttérbeli teljes offline működéshez ── */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('Service Worker regisztrációs hiba:', err);
      });
    });
  }
}

/* ── Inicializálás ── */
document.addEventListener('DOMContentLoaded', () => {
  initElements();
  initTheme();
  initBinaryPreference();
  buildCheat();
  renderHistory();
  initServiceWorker();

  // Másolás és előzmények delegált eseménykezelése
  document.addEventListener('click', e => {
    const copyTarget = e.target.closest('[data-copy]');
    if (copyTarget) {
      copyText(copyTarget.dataset.copy);
      return;
    }

    const historyTarget = e.target.closest('[data-history]');
    if (historyTarget) {
      loadHistory(historyTarget.dataset.history);
      return;
    }
  });

  els.calcForm?.addEventListener('submit', e => {
    e.preventDefault();
    calculate();
  });

  [els.host, els.mask1, els.mask2].forEach(el => {
    el?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      }
    });
  });

  els.toggleBin?.addEventListener('click', () => {
    showBin = !showBin;
    updateBin();
    saveBinaryPreference();
  });

  els.clearHistory?.addEventListener('click', () => {
    calcHistory = [];
    try { localStorage.removeItem('ipcalc_h'); } catch (err) { }
    renderHistory();
    showToast('Előzmények törölve');
  });

  if (!loadFromUrl()) calculate();
});
