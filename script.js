/* ── Segédfüggvények ── */
function ipToInt(ip) {
  return ip.split('.').reduce((n, o) => (n << 8) + parseInt(o, 10), 0) >>> 0;
}
function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}
function intToBin32(n) {
  let b = n.toString(2);
  return '0'.repeat(32 - b.length) + b;
}
function formatBin(bin, ml) {
  let out = '';
  for (let oct = 0; oct < 4; oct++) {
    if (oct) out += '<span style="color:rgba(255,255,255,0.12)">.</span>';
    for (let b = 0; b < 8; b++) {
      let p = oct * 8 + b, c = bin[p];
      out += p < ml ? `<span class="bn">${c}</span>` : c;
    }
  }
  return out;
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
  let s = intToIp(ip), f = (ip >>> 24) & 255;
  if (s.startsWith('10.')) return 'private';
  if (s.startsWith('172.')) { let x = parseInt(s.split('.')[1]); if (x >= 16 && x <= 31) return 'private'; }
  if (s.startsWith('192.168.')) return 'private';
  if (s.startsWith('127.')) return 'loopback';
  if (s.startsWith('169.254.')) return 'link-local';
  if (f >= 224 && f < 240) return 'multicast';
  return 'public';
}
function badge(cls, txt) { return `<span class="badge ${cls}">${txt}</span>`; }

/* ── Toast ── */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1500);
}

/* ── Másolás ── */
function copyText(txt) {
  navigator.clipboard.writeText(txt).then(() => showToast('Másolva!'));
}

/* ── Sorok felépítése ── */
let showBin = true;

function row(label, ipInt, cidr, metaHtml, netSec) {
  let ip = intToIp(ipInt);
  let disp = ip;
  if (label === 'Hálózati maszk') disp = ip + ' = /' + cidr;
  if (label === 'Hálózat') disp = ip + '/' + cidr;
  let bin = formatBin(intToBin32(ipInt), cidr);
  let binRaw = intToBin32(ipInt);
  return `<tr class="${netSec ? 'net-section' : ''}">
    <td class="lbl">${label}</td>
    <td class="val">
      <span class="copy-wrap" onclick="copyText('${disp}')" title="Másolás">
        ${disp}<span class="ci"><i class="fa-regular fa-copy"></i></span>
      </span>
    </td>
    <td class="bin-col" onclick="copyText('${binRaw}')" title="Bináris másolása" style="display:${showBin ? '' : 'none'}">${bin}</td>
    <td class="meta">${metaHtml || ''}</td>
  </tr>`;
}

function hostsRow(hosts) {
  return `<tr class="net-section">
    <td class="lbl">Hostok/Háló</td>
    <td class="val">
      <span class="copy-wrap" onclick="copyText('${hosts}')" title="Másolás">
        ${hosts.toLocaleString('hu-HU')}<span class="ci"><i class="fa-regular fa-copy"></i></span>
      </span>
    </td>
    <td class="bin-col" style="display:${showBin ? '' : 'none'}"></td>
    <td class="meta"></td>
  </tr>`;
}

/* ── Alhálózat vizualizáció ── */
function renderSubnet(netInt, m1, m2) {
  let sec = document.getElementById('subnetSection');
  if (!m2 || m2.len <= m1.len || m2.len > 32) { sec.style.display = 'none'; return; }
  let diff = m2.len - m1.len;
  let numSub = Math.pow(2, diff);
  let hps = m2.len < 31 ? Math.pow(2, 32 - m2.len) - 2 : (m2.len === 31 ? 2 : 1);
  let blockSize = Math.pow(2, 32 - m2.len);
  let cols = ['#0099d5', '#22c578', '#f0a04a', '#ff6b6b', '#b07ef7', '#4adfe0', '#e0a04a', '#d54f6b'];
  let maxShow = Math.min(numSub, 8);
  let segs = '';
  for (let i = 0; i < maxShow; i++) {
    let sn = (netInt + i * blockSize) >>> 0;
    let ip = intToIp(sn);
    let col = cols[i % cols.length];
    let pct = 100 / maxShow;
    let lbl = numSub <= 8 ? ip : (i < maxShow - 1 ? ip : '…');
    segs += `<div class="subnet-seg" style="width:${pct}%;background:${col}18;border-right:1px solid ${col}30;color:${col}" title="${ip}/${m2.len}">${lbl}</div>`;
  }
  sec.style.display = 'block';
  sec.innerHTML = `<div class="subnet-card">
    <div class="results-header">
      <span class="section-label">Alhálózat vizualizáció — /${m2.len} a /${m1.len}-en belül</span>
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
  let sec = document.getElementById('historySection');
  let list = document.getElementById('historyList');
  if (!calcHistory.length) { sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  list.innerHTML = calcHistory.map(h => `<div class="history-item" onclick="loadHistory('${h}')">${h}</div>`).join('');
}

function loadHistory(e) {
  let [ip, cidr] = e.split('/');
  document.getElementById('host').value = ip;
  document.getElementById('mask1').value = cidr;
  document.getElementById('mask2').value = '';
  calculate();
}

/* ── URL szinkron ── */
function updateUrl(ip, mask, mask2) {
  let params = new URLSearchParams();
  params.set('ip', ip);
  params.set('mask', mask);
  if (mask2) params.set('mask2', mask2);
  window.history.replaceState({}, '', '?' + params.toString());
}

function loadFromUrl() {
  let p = new URLSearchParams(window.location.search);
  if (p.get('ip')) {
    document.getElementById('host').value = p.get('ip');
    if (p.get('mask')) document.getElementById('mask1').value = p.get('mask');
    if (p.get('mask2')) document.getElementById('mask2').value = p.get('mask2');
    return true;
  }
  return false;
}

/* ── Fő számítás ── */
function calculate() {
  let hi = document.getElementById('host').value.trim();
  let mi = document.getElementById('mask1').value.trim() || '24';
  let m2i = document.getElementById('mask2').value.trim();
  if (!hi) return;
  let parts = hi.split('/');
  if (parts.length === 2) {
    hi = parts[0].trim();
    mi = parts[1].trim();
    document.getElementById('mask1').value = mi;
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
  let html = '';
  html += row('Cím',            ipInt,   cidr, '', false);
  html += row('Hálózati maszk', mInt,    cidr, '', false);
  html += row('Wildcard',       wildInt, cidr, '', false);
  html += `<tr><td class="divider" colspan="4"></td></tr>`;
  html += row('Hálózat',        netInt,  cidr, `<div class="badges">${clsBadge}${typeBadge}</div>`, true);
  html += row('Broadcast',      bcInt,   cidr, '', false);
  html += row('Host min',       hMinInt, cidr, '', false);
  html += row('Host max',       hMaxInt, cidr, '', false);
  html += hostsRow(hosts);
  document.getElementById('resultTable').innerHTML = html;
  document.getElementById('results').classList.add('visible');
  updateBin();
  renderSubnet(netInt, m1, m2);
  let entry = `${intToIp(ipInt)}/${cidr}`;
  calcHistory = [entry, ...calcHistory.filter(h => h !== entry)].slice(0, 8);
  try { localStorage.setItem('ipcalc_h', JSON.stringify(calcHistory)); } catch (e) { }
  renderHistory();
  updateUrl(intToIp(ipInt), cidr, m2i || '');
}

/* ── Bináris kapcsoló ── */
function updateBin() {
  document.querySelectorAll('.bin-col').forEach(td => { td.style.display = showBin ? '' : 'none'; });
  document.getElementById('toggleBin').classList.toggle('active', showBin);
}

/* ── Téma ── */
const THEME_KEY = 'ipcalc_theme';

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyThemeValue(value) {
  document.documentElement.setAttribute('data-theme', value);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = value === 'light'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
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
    applyThemeValue(getSystemPreference());
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
    applyThemeValue(getSystemPreference());
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      let current = null;
      try { current = localStorage.getItem(THEME_KEY); } catch (err) { }
      if (current === null) applyThemeValue(e.matches ? 'light' : 'dark');
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
  document.getElementById('cheatBody').style.display = cheatVisible ? '' : 'none';
  document.getElementById('toggleCheat').innerHTML = cheatVisible
    ? '<i class="fa-solid fa-chevron-up"></i>'
    : '<i class="fa-solid fa-chevron-down"></i>';
}

function buildCheat() {
  let html = '';
  for (let [cidr, mask, hosts, note] of MASKS) {
    let noteHtml = note ? `<span class="badge badge-class" style="font-size:9px;padding:2px 7px">${note}</span>` : '';
    html += `<tr>
      <td class="lbl" style="color:var(--accent);font-size:13px;font-weight:600;width:50px">/${cidr}</td>
      <td class="val" style="font-weight:400">
        <span class="copy-wrap" onclick="copyText('${mask}')" title="Maszk másolása">
          ${mask}<span class="ci"><i class="fa-regular fa-copy"></i></span>
        </span>
      </td>
      <td class="val" style="color:var(--fg-subtle);font-weight:400;font-size:12px">
        <span class="copy-wrap" onclick="copyText('${cidr}')" title="CIDR prefix másolása">
          /${cidr}<span class="ci"><i class="fa-regular fa-copy"></i></span>
        </span>
      </td>
      <td class="val" style="color:var(--fg-muted);font-size:12px">${hosts.toLocaleString('hu-HU')} host</td>
      <td class="meta">${noteHtml}</td>
    </tr>`;
  }
  document.getElementById('cheatTable').innerHTML = html;
}

/* ── Inicializálás ── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  buildCheat();
  renderHistory();

  document.getElementById('calcForm').addEventListener('submit', e => { e.preventDefault(); calculate(); });
  ['host', 'mask1', 'mask2'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); calculate(); } });
  });
  document.getElementById('toggleBin').addEventListener('click', () => { showBin = !showBin; updateBin(); });
  document.getElementById('clearHistory').addEventListener('click', () => {
    calcHistory = [];
    try { localStorage.removeItem('ipcalc_h'); } catch (e) { }
    renderHistory();
  });

  if (!loadFromUrl()) calculate(); else calculate();
});
