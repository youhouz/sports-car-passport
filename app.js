// Sports Car Passport – Luxury Collection (Rolex box / Apple level)
const KEY = 'scp_v5';
let selectedDbCar = null;

const KB = [
  { k: ['rod bearing','coussinet','bielles','e46','e60','s54','s85','s65'], r: `**Rod bearings** – point critique BMW M (E46, E60, E9x).\nChangement préventif souvent 80-100k km. Coût 2,5-4,5k€.` },
  { k: ['ims','boxster','cayman','986','987','996'], r: `**IMS Bearing** – risque majeur 986/996/997.1.\nVérifie si remplacé. 997.2+ OK.` },
  { k: ['problèmes bmw m','m2','m3','m4'], r: `**BMW M** : générations récentes solides. Anciennes : rod bearings + vanos.` },
  { k: ['problèmes 911','porsche 911'], r: `**911** : 996 IMS/AOS. 997.1 IMS. 997.2+ nettement mieux.` },
  { k: ['entretien amg','coût amg'], r: `**AMG** : vidange 400-900€, freins 1,5-3,5k€. Indépendants = économie.` },
  { k: ['assurance sportive'], r: `**Assurance sportive FR** : mods à déclarer. Circuit souvent exclu.` },
  { k: ['bonjour','salut','hello'], r: `Salut. Expert IA sportives. 100% offline.` }
];

function expert(msg) {
  const t = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let best = null, score = 0;
  for (const e of KB) {
    let s = 0; e.k.forEach(k => { if (t.includes(k)) s += 2; });
    if (s > score) { score = s; best = e; }
  }
  if (best && score >= 2) return best.r;
  return `Reformule avec le modèle (ex. « problèmes S55 », « IMS 997 »).`;
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { cars: [], events: [] }; }
  catch { return { cars: [], events: [] }; }
}
function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—'; }

function go(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('v-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.v === name));
  if (['add','timeline','value'].includes(name)) fillSelects();
  if (name === 'dashboard') renderCollection();
  if (name === 'timeline') renderTimeline();
  if (name === 'expert') {
    const box = document.getElementById('chat-messages');
    if (box && !box.children.length) addMsg(`Salut. Expert IA sportives (BMW M, AMG, Porsche).<br><br>100 % offline.`, false);
  }
}

document.addEventListener('input', e => {
  if (e.target.id !== 'c-model') return;
  const q = e.target.value.trim().toLowerCase();
  const box = document.getElementById('ac-box');
  if (!q) { box.classList.add('hidden'); return; }
  const db = window.CARS_DB || [];
  const matches = db.filter(c =>
    (c.brand + ' ' + c.model).toLowerCase().includes(q) ||
    c.model.toLowerCase().includes(q) ||
    c.brand.toLowerCase().includes(q)
  ).slice(0, 8);
  if (!matches.length) { box.classList.add('hidden'); return; }
  box.innerHTML = matches.map(c => `
    <div class="ac-item" onclick="pickCar('${c.id}')">
      <img src="${c.img}" onerror="this.style.display='none'" />
      <div>
        <div class="text-[13px] font-medium">${esc(c.brand)} ${esc(c.model)}</div>
        <div class="text-[11px] text-zinc-500">${c.year} · ${c.power}</div>
      </div>
    </div>`).join('');
  box.classList.remove('hidden');
});

function pickCar(id) {
  const c = (window.CARS_DB || []).find(x => x.id === id);
  if (!c) return;
  selectedDbCar = c;
  document.getElementById('c-model').value = c.brand + ' ' + c.model;
  document.getElementById('c-year').value = (c.year || '').split('-')[0].replace('+','') || '';
  document.getElementById('ac-box').classList.add('hidden');
  const prev = document.getElementById('preview-car');
  document.getElementById('preview-img').src = c.img;
  document.getElementById('preview-info').textContent = c.power + ' · ~' + c.base.toLocaleString('fr-FR') + ' €';
  prev.classList.remove('hidden');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#c-model') && !e.target.closest('#ac-box'))
    document.getElementById('ac-box')?.classList.add('hidden');
});

function renderCollection() {
  const d = load();
  const list = document.getElementById('cars-list');
  const empty = document.getElementById('empty-state');
  if (!d.cars.length) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = d.cars.map(c => {
    const ev = d.events.filter(e => e.carId === c.id);
    const spent = ev.reduce((s,e) => s + (+e.cost||0), 0);
    const img = c.img || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
    return `
    <div class="trophy" onclick="openDetail('${c.id}')">
      <div class="trophy-img-wrap">
        <img src="${img}" class="trophy-img" alt="${esc(c.model)}" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'" />
        <div class="trophy-light"></div>
        <div class="trophy-glow"></div>
      </div>
      <div class="trophy-body">
        <div class="trophy-name">${esc(c.model)}</div>
        <div class="trophy-meta">${c.year || '—'} · ${c.km ? c.km.toLocaleString('fr-FR') + ' km' : '—'}</div>
        <div class="flex gap-4 mt-3 text-[11px] text-zinc-500">
          <span>${ev.length} événement${ev.length !== 1 ? 's' : ''}</span>
          <span>${spent > 0 ? spent.toLocaleString('fr-FR',{style:'currency',currency:'EUR'}) : '—'}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openDetail(id) {
  const d = load();
  const car = d.cars.find(c => c.id === id);
  if (!car) return;
  const ev = d.events.filter(e => e.carId === id).sort((a,b) => new Date(b.date) - new Date(a.date));
  const spent = ev.reduce((s,e) => s + (+e.cost||0), 0);
  const img = car.img || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';

  let base = car.baseValue || 35000;
  const age = 2026 - (+car.year || 2018);
  base *= Math.max(0.45, 1 - age * 0.05);
  if (car.km > 80000) base *= 0.9;
  if (car.km > 120000) base *= 0.82;
  const est = Math.round(base / 100) * 100;

  document.getElementById('detail-content').innerHTML = `
    <div class="trophy overflow-hidden mb-5">
      <div class="trophy-img-wrap" style="height:200px">
        <img src="${img}" class="trophy-img" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'" />
        <div class="trophy-light"></div>
        <div class="trophy-glow"></div>
      </div>
      <div class="p-5">
        <h2 class="text-[20px] font-semibold tracking-tight">${esc(car.model)}</h2>
        <p class="text-zinc-500 text-[13px] mt-1">${car.year || '—'} · ${car.km ? car.km.toLocaleString('fr-FR') + ' km' : ''}</p>
        ${car.plate ? `<p class="text-[12px] text-zinc-400 mt-1.5 font-mono tracking-wide">${esc(car.plate)}</p>` : ''}
        ${car.notes ? `<p class="text-[13px] text-zinc-400 mt-3 leading-relaxed">${esc(car.notes)}</p>` : ''}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-5">
      <div class="detail-stat">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Valeur estimée</div>
        <div class="text-[17px] font-semibold">${est.toLocaleString('fr-FR')} €</div>
      </div>
      <div class="detail-stat">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Dépenses</div>
        <div class="text-[17px] font-semibold">${spent.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</div>
      </div>
    </div>

    <div class="trophy p-4 mb-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Carnet d’entretien</div>
        <button onclick="select('${id}','add')" class="text-[12px] text-zinc-300">+ Ajouter</button>
      </div>
      ${ev.length ? ev.slice(0,6).map(e => `
        <div class="flex justify-between items-start py-2.5 border-b border-white/[0.04] last:border-0">
          <div>
            <div class="text-[13px] font-medium">${esc(e.title)}</div>
            <div class="text-[11px] text-zinc-500 mt-0.5">${fmtDate(e.date)}${e.provider ? ' · ' + esc(e.provider) : ''}</div>
          </div>
          ${e.cost ? `<div class="text-[13px] text-zinc-300 tabular-nums">${(+e.cost).toLocaleString('fr-FR')} €</div>` : ''}
        </div>
      `).join('') : '<p class="text-zinc-500 text-[13px] py-4 text-center">Aucun événement pour le moment</p>'}
    </div>

    <div class="flex gap-2">
      <button onclick="select('${id}','add')" class="btn btn-primary flex-1 h-11 text-[13px]">+ Événement</button>
      <button onclick="select('${id}','timeline')" class="btn btn-ghost flex-1 h-11 text-[13px]">Tout le carnet</button>
    </div>
  `;
  go('detail');
}

document.getElementById('form-car')?.addEventListener('submit', e => {
  e.preventDefault();
  const d = load();
  d.cars.push({
    id: uid(),
    model: document.getElementById('c-model').value.trim(),
    year: document.getElementById('c-year').value || null,
    km: +document.getElementById('c-km').value || null,
    vin: document.getElementById('c-vin').value.trim() || null,
    plate: document.getElementById('c-plate').value.trim() || null,
    notes: document.getElementById('c-notes').value.trim() || null,
    img: selectedDbCar?.img || null,
    baseValue: selectedDbCar?.base || null,
    createdAt: new Date().toISOString()
  });
  save(d);
  e.target.reset();
  selectedDbCar = null;
  document.getElementById('preview-car').classList.add('hidden');
  go('dashboard');
  renderCollection();
});

document.getElementById('form-event')?.addEventListener('submit', e => {
  e.preventDefault();
  const d = load();
  const ev = {
    id: uid(),
    carId: document.getElementById('e-car').value,
    type: document.getElementById('e-type').value,
    date: document.getElementById('e-date').value,
    km: +document.getElementById('e-km').value || null,
    title: document.getElementById('e-title').value.trim(),
    cost: +document.getElementById('e-cost').value || 0,
    provider: document.getElementById('e-provider').value.trim() || null,
    notes: document.getElementById('e-notes').value.trim() || null
  };
  const car = d.cars.find(c => c.id === ev.carId);
  if (car && ev.km && (!car.km || ev.km > car.km)) car.km = ev.km;
  d.events.push(ev);
  save(d);
  e.target.reset();
  go('timeline');
  renderTimeline();
});

function select(id, view) {
  go(view);
  setTimeout(() => {
    ['e-car','t-filter','v-car'].forEach(i => {
      const el = document.getElementById(i);
      if (el) el.value = id;
    });
    if (view === 'timeline') renderTimeline();
    if (view === 'value') estimateValue();
  }, 40);
}

function fillSelects() {
  const d = load();
  const opts = d.cars.map(c => `<option value="${c.id}">${esc(c.model)} ${c.year||''}</option>`).join('');
  const empty = '<option value="">— Choisir —</option>';
  ['e-car','v-car'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { const cur = el.value; el.innerHTML = empty + opts; if (cur) el.value = cur; }
  });
  const tf = document.getElementById('t-filter');
  if (tf) { const cur = tf.value; tf.innerHTML = '<option value="all">Toutes</option>' + opts; if (cur) tf.value = cur; }
}

function renderTimeline() {
  const d = load();
  const filter = document.getElementById('t-filter')?.value || 'all';
  let list = filter === 'all' ? d.events : d.events.filter(e => e.carId === filter);
  list = list.sort((a,b) => new Date(b.date) - new Date(a.date));
  const box = document.getElementById('timeline-list');
  if (!list.length) {
    box.innerHTML = '<p class="text-zinc-500 text-center py-16 text-[13px]">Aucun événement</p>';
    return;
  }
  const labels = {entretien:'Entretien',reparation:'Réparation',mod:'Mod',pneus:'Pneus',facture:'Facture',ct:'CT',assurance:'Assurance',autre:'Autre'};
  box.innerHTML = list.map(ev => {
    const car = d.cars.find(c => c.id === ev.carId);
    return `<div class="flex gap-3 pb-5">
      <div class="flex flex-col items-center">
        <div class="w-2 h-2 rounded-full bg-white/40 mt-1.5 shrink-0"></div>
        <div class="w-px flex-1 bg-white/[0.06] mt-1"></div>
      </div>
      <div class="flex-1">
        <div class="text-[11px] text-zinc-500">${fmtDate(ev.date)}</div>
        <div class="font-medium text-[14px] mt-0.5">${esc(ev.title)}</div>
        <div class="text-[12px] text-zinc-500">${labels[ev.type]||ev.type}${car ? ' · '+esc(car.model) : ''}</div>
        ${ev.cost ? `<div class="text-[13px] text-zinc-300 mt-0.5">${(+ev.cost).toLocaleString('fr-FR')} €</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function estimateValue() {
  const d = load();
  const id = document.getElementById('v-car')?.value;
  const box = document.getElementById('value-box');
  if (!id) { box.classList.add('hidden'); return; }
  const car = d.cars.find(c => c.id === id);
  if (!car) return;
  let base = car.baseValue || 35000;
  const age = 2026 - (+car.year || 2018);
  base *= Math.max(0.45, 1 - age * 0.05);
  if (car.km > 80000) base *= 0.9;
  if (car.km > 120000) base *= 0.82;
  const est = Math.round(base / 100) * 100;
  document.getElementById('value-amount').textContent = est.toLocaleString('fr-FR') + ' €';
  document.getElementById('value-details').textContent = 'Estimation indicative';
  box.classList.remove('hidden');
}

function addMsg(html, user) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${user ? 'bg-white/10 ml-auto' : 'bg-white/[0.04]'}`;
  div.innerHTML = html.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function sendChat() {
  const input = document.getElementById('chat-input');
  const t = input.value.trim();
  if (!t) return;
  addMsg(esc(t), true);
  input.value = '';
  setTimeout(() => addMsg(expert(t), false), 220);
}
function ask(q) { document.getElementById('chat-input').value = q; sendChat(); }

document.addEventListener('DOMContentLoaded', () => {
  const di = document.getElementById('e-date');
  if (di) di.valueAsDate = new Date();
  go('dashboard');
  renderCollection();
  fillSelects();
});
