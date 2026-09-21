// Sports Car Passport – Premium Collection Showcase
const KEY = 'scp_v4';
let selectedDbCar = null;

const KB = [
  { k: ['rod bearing','coussinet','bielles','e46','e60','s54','s85','s65'], r: `**Rod bearings** – point critique BMW M (E46, E60, E9x).\nChangement préventif souvent 80-100k km. Coût 2,5-4,5k€.` },
  { k: ['ims','boxster','cayman','986','987','996'], r: `**IMS Bearing** – risque majeur 986/996/997.1.\nVérifie si remplacé (LN Engineering). 997.2+ OK.` },
  { k: ['problèmes bmw m','m2','m3','m4'], r: `**BMW M** : générations récentes solides. Points de vigilance wastegate, expansion tank. Anciennes : rod bearings + vanos.` },
  { k: ['problèmes 911','porsche 911'], r: `**911** : 996 IMS/AOS. 997.1 IMS. 997.2+ nettement mieux. Historique complet = valeur.` },
  { k: ['entretien amg','coût amg'], r: `**AMG** : vidange 400-900€, freins 1,5-3,5k€, pneus 1,2-2,5k€. Indépendants = grosse économie.` },
  { k: ['assurance sportive'], r: `**Assurance sportive FR** : très variable. Mods à déclarer. Circuit souvent exclu.` },
  { k: ['bonjour','salut','hello'], r: `Salut. Expert IA spécialisé sportives (BMW M, AMG, Porsche). 100% offline.` }
];

function expert(msg) {
  const t = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let best = null, score = 0;
  for (const e of KB) {
    let s = 0; e.k.forEach(k => { if (t.includes(k)) s += 2; });
    if (s > score) { score = s; best = e; }
  }
  if (best && score >= 2) return best.r;
  return `Reformule avec le modèle (ex. « problèmes S55 », « IMS 997 »). Je couvre BMW M, Porsche, AMG, coûts, stages.`;
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

const modelInput = () => document.getElementById('c-model');
const acBox = () => document.getElementById('ac-box');

document.addEventListener('input', e => {
  if (e.target.id !== 'c-model') return;
  const q = e.target.value.trim().toLowerCase();
  const box = acBox();
  if (!q || q.length < 1) { box.classList.add('hidden'); return; }
  const db = window.CARS_DB || [];
  const matches = db.filter(c => 
    (c.brand + ' ' + c.model).toLowerCase().includes(q) || 
    c.model.toLowerCase().includes(q) ||
    c.brand.toLowerCase().includes(q)
  ).slice(0, 8);
  if (!matches.length) { box.classList.add('hidden'); return; }
  box.innerHTML = matches.map(c => `
    <div class="ac-item" onclick="pickCar('${c.id}')">
      <img src="${c.img}" alt="" onerror="this.style.display='none'" />
      <div>
        <div class="text-[13px] font-medium">${esc(c.brand)} ${esc(c.model)}</div>
        <div class="text-[11px] text-zinc-500">${c.year} · ${c.power}</div>
      </div>
    </div>
  `).join('');
  box.classList.remove('hidden');
});

function pickCar(id) {
  const c = (window.CARS_DB || []).find(x => x.id === id);
  if (!c) return;
  selectedDbCar = c;
  modelInput().value = c.brand + ' ' + c.model;
  document.getElementById('c-year').value = c.year.split('-')[0].replace('+','') || '';
  acBox().classList.add('hidden');
  const prev = document.getElementById('preview-car');
  document.getElementById('preview-img').src = c.img;
  document.getElementById('preview-info').textContent = c.power + ' · valeur base ~' + c.base.toLocaleString('fr-FR') + ' €';
  prev.classList.remove('hidden');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#c-model') && !e.target.closest('#ac-box')) {
    acBox()?.classList.add('hidden');
  }
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
    <div class="showcase-card relative" onclick="openDetail('${c.id}')">
      <div class="showcase-glow"></div>
      <div class="relative overflow-hidden">
        <img src="${img}" class="car-img" alt="${esc(c.model)}" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'" />
        <div class="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#1c1c1f] to-transparent"></div>
      </div>
      <div class="p-4 pt-2">
        <h3 class="font-semibold text-[15px] tracking-tight">${esc(c.model)}</h3>
        <p class="text-zinc-500 text-[12px] mt-0.5">${c.year || '—'} · ${c.km ? c.km.toLocaleString('fr-FR') + ' km' : 'km ?'}</p>
        <div class="flex gap-4 mt-3 text-[11px] text-zinc-400">
          <span>${ev.length} events</span>
          <span>${spent.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</span>
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
  const est = Math.round(base / 100) * 100;

  document.getElementById('detail-content').innerHTML = `
    <div class="showcase-card overflow-hidden mb-5">
      <img src="${img}" class="w-full h-48 object-cover" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'" />
      <div class="p-5">
        <h2 class="text-[20px] font-bold tracking-tight">${esc(car.model)}</h2>
        <p class="text-zinc-500 text-[13px] mt-1">${car.year || '—'} · ${car.km ? car.km.toLocaleString('fr-FR') + ' km' : ''}</p>
        ${car.plate ? `<p class="text-[12px] text-zinc-400 mt-1 font-mono">${esc(car.plate)}</p>` : ''}
        ${car.notes ? `<p class="text-[13px] text-zinc-400 mt-3">${esc(car.notes)}</p>` : ''}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mb-5">
      <div class="card p-4 text-center">
        <div class="text-[11px] text-zinc-500 mb-1">Valeur estimée</div>
        <div class="text-[18px] font-bold text-rose-400">${est.toLocaleString('fr-FR')} €</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-[11px] text-zinc-500 mb-1">Dépenses trackées</div>
        <div class="text-[18px] font-bold">${spent.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</div>
      </div>
    </div>
    <div class="card p-4 mb-5">
      <div class="text-[12px] font-medium text-zinc-400 mb-3">Derniers événements</div>
      ${ev.length ? ev.slice(0,5).map(e => `
        <div class="flex justify-between items-start py-2 border-b border-white/[0.04] last:border-0">
          <div>
            <div class="text-[13px] font-medium">${esc(e.title)}</div>
            <div class="text-[11px] text-zinc-500">${fmtDate(e.date)}</div>
          </div>
          ${e.cost ? `<div class="text-[13px] text-zinc-300">${e.cost.toLocaleString('fr-FR')} €</div>` : ''}
        </div>
      `).join('') : '<p class="text-zinc-500 text-[13px]">Aucun événement</p>'}
    </div>
    <div class="flex gap-2">
      <button onclick="select('${id}','add')" class="btn btn-primary flex-1 h-11 text-[13px]">+ Event</button>
      <button onclick="select('${id}','timeline')" class="btn btn-ghost flex-1 h-11 text-[13px]">Timeline</button>
    </div>
  `;
  go('detail');
}

document.getElementById('form-car')?.addEventListener('submit', e => {
  e.preventDefault();
  const d = load();
  const model = document.getElementById('c-model').value.trim();
  d.cars.push({
    id: uid(),
    model,
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

document.getElementById('form-event')?.addEventListener('submit', async e => {
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
  }, 30);
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
    box.innerHTML = '<p class="text-zinc-500 text-center py-12 text-[13px]">Aucun événement</p>';
    return;
  }
  const labels = {entretien:'Entretien',reparation:'Réparation',mod:'Mod',pneus:'Pneus',facture:'Facture',ct:'CT',assurance:'Assurance',autre:'Autre'};
  box.innerHTML = list.map(ev => {
    const car = d.cars.find(c => c.id === ev.carId);
    return `<div class="flex gap-3 pb-5">
      <div class="flex flex-col items-center">
        <div class="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
        <div class="w-px flex-1 bg-white/[0.06] mt-1"></div>
      </div>
      <div class="flex-1">
        <div class="text-[11px] text-zinc-500">${fmtDate(ev.date)}</div>
        <div class="font-medium text-[14px] mt-0.5">${esc(ev.title)}</div>
        <div class="text-[12px] text-zinc-500">${labels[ev.type]||ev.type}${car ? ' · '+esc(car.model) : ''}</div>
        ${ev.cost ? `<div class="text-[13px] text-zinc-300 mt-0.5">${ev.cost.toLocaleString('fr-FR')} €</div>` : ''}
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
  if (car.km > 120000) base *= 0.8;
  const est = Math.round(base / 100) * 100;
  document.getElementById('value-amount').textContent = est.toLocaleString('fr-FR') + ' €';
  document.getElementById('value-details').innerHTML = `<p class="text-[12px] text-zinc-500">Estimation indicative</p>`;
  box.classList.remove('hidden');
}

function addMsg(html, user) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${user ? 'bg-rose-500/20 text-rose-50 ml-auto' : 'bg-white/[0.05] text-zinc-200'}`;
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
  setTimeout(() => addMsg(expert(t), false), 250);
}
function ask(q) { document.getElementById('chat-input').value = q; sendChat(); }

document.addEventListener('DOMContentLoaded', () => {
  const di = document.getElementById('e-date');
  if (di) di.valueAsDate = new Date();
  go('dashboard');
  renderCollection();
  fillSelects();
});
