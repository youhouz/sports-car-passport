// Sports Car Passport – High level 3D collection + full car dashboard
const KEY = 'scp_v6';
let selectedDbCar = null;

const KB = [
  { k: ['rod bearing','coussinet','bielles'], r: `**Rod bearings** – critique sur BMW M (E46/E60/E9x). Prévention 80-100k km. Coût 2,5-4,5k€.` },
  { k: ['ims','boxster','cayman','996'], r: `**IMS** – risque 986/996/997.1. Vérifie remplacement. 997.2+ OK.` },
  { k: ['problèmes bmw m','m2','m3','m4'], r: `**BMW M** : récentes solides. Anciennes : rod bearings + vanos.` },
  { k: ['problèmes 911','porsche'], r: `**911** : 996 IMS. 997.1 IMS. 997.2+ bien meilleurs.` },
  { k: ['entretien amg','coût amg'], r: `**AMG** : vidange 400-900€, freins 1,5-3,5k€.` },
  { k: ['assurance'], r: `**Assurance sportive** : déclarer les mods. Circuit souvent exclu.` },
  { k: ['bonjour','salut'], r: `Salut. Expert IA sportives. 100% offline.` }
];

function expert(msg) {
  const t = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let best = null, score = 0;
  for (const e of KB) {
    let s = 0; e.k.forEach(k => { if (t.includes(k)) s += 2; });
    if (s > score) { score = s; best = e; }
  }
  return (best && score >= 2) ? best.r : `Donne le modèle exact (ex. « problèmes S55 »).`;
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
  const titles = { dashboard:'Collection', 'add-car':'Ajouter', detail:'Dashboard', add:'Événement', timeline:'Carnet', value:'Valeur', expert:'Expert IA' };
  const ht = document.getElementById('header-title');
  if (ht) ht.textContent = titles[name] || 'Collection';
  if (['add','timeline','value'].includes(name)) fillSelects();
  if (name === 'dashboard') renderCollection();
  if (name === 'timeline') renderTimeline();
  if (name === 'expert') {
    const box = document.getElementById('chat-messages');
    if (box && !box.children.length) addMsg(`Expert IA sportives · 100% offline.`, false);
  }
}

document.addEventListener('input', e => {
  if (e.target.id !== 'c-model') return;
  const q = e.target.value.trim().toLowerCase();
  const box = document.getElementById('ac-box');
  if (!q) { box.classList.add('hidden'); return; }
  const matches = (window.CARS_DB||[]).filter(c =>
    (c.brand+' '+c.model).toLowerCase().includes(q) || c.model.toLowerCase().includes(q)
  ).slice(0,8);
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
  const c = (window.CARS_DB||[]).find(x => x.id === id);
  if (!c) return;
  selectedDbCar = c;
  document.getElementById('c-model').value = c.brand + ' ' + c.model;
  document.getElementById('c-year').value = (c.year||'').split('-')[0].replace('+','') || '';
  document.getElementById('ac-box').classList.add('hidden');
  document.getElementById('preview-img').src = c.img;
  document.getElementById('preview-info').textContent = c.power + ' · ~' + c.base.toLocaleString('fr-FR') + ' €';
  document.getElementById('preview-car').classList.remove('hidden');
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
    <div class="car-3d" onclick="openDetail('${c.id}')">
      <img src="${img}" class="car-3d-img" alt="${esc(c.model)}" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'" />
      <div class="car-3d-floor"></div>
      <div class="car-3d-reflection"></div>
      <div class="car-3d-info">
        <div class="text-[15px] font-semibold tracking-tight">${esc(c.model)}</div>
        <div class="text-[12px] text-zinc-500 mt-0.5">${c.year||'—'} · ${c.km ? c.km.toLocaleString('fr-FR')+' km' : '—'}</div>
        <div class="flex gap-4 mt-2.5 text-[11px] text-zinc-500">
          <span>${ev.length} events</span>
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

  const lastService = ev.find(e => e.type === 'entretien' || e.type === 'reparation');
  let nextService = 'À planifier';
  if (lastService) {
    const last = new Date(lastService.date);
    last.setMonth(last.getMonth() + 12);
    nextService = fmtDate(last.toISOString().slice(0,10));
  }

  let base = car.baseValue || 35000;
  const age = 2026 - (+car.year || 2018);
  base *= Math.max(0.45, 1 - age * 0.05);
  if (car.km > 80000) base *= 0.9;
  if (car.km > 120000) base *= 0.82;
  const est = Math.round(base / 100) * 100;

  const invoices = ev.filter(e => e.photo || e.type === 'facture' || e.cost > 0);

  document.getElementById('detail-content').innerHTML = `
    <div class="car-3d mb-5">
      <img src="${img}" class="car-3d-img" style="height:200px" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'" />
      <div class="car-3d-floor"></div>
      <div class="car-3d-reflection"></div>
      <div class="car-3d-info">
        <div class="text-[20px] font-semibold tracking-tight">${esc(car.model)}</div>
        <div class="text-[13px] text-zinc-500 mt-1">${car.year||'—'} · ${car.km ? car.km.toLocaleString('fr-FR')+' km' : ''}</div>
        ${car.plate ? `<div class="text-[12px] text-zinc-400 mt-1 font-mono">${esc(car.plate)}</div>` : ''}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="dash-card">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Valeur</div>
        <div class="dash-num">${est.toLocaleString('fr-FR')} €</div>
      </div>
      <div class="dash-card">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Dépenses</div>
        <div class="dash-num">${spent.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</div>
      </div>
      <div class="dash-card">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Événements</div>
        <div class="dash-num">${ev.length}</div>
      </div>
      <div class="dash-card">
        <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Prochain entretien</div>
        <div class="text-[14px] font-semibold mt-1">${nextService}</div>
      </div>
    </div>

    <div class="dash-card mb-4">
      <div class="flex justify-between items-center mb-3">
        <div class="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Carnet d’entretien</div>
        <button onclick="select('${id}','add')" class="text-[12px] text-white">+ Ajouter</button>
      </div>
      ${ev.length ? ev.slice(0,5).map(e => `
        <div class="flex justify-between py-2.5 border-b border-white/5 last:border-0">
          <div>
            <div class="text-[13px] font-medium">${esc(e.title)}</div>
            <div class="text-[11px] text-zinc-500">${fmtDate(e.date)}${e.provider ? ' · '+esc(e.provider) : ''}</div>
          </div>
          ${e.cost ? `<div class="text-[13px] tabular-nums">${(+e.cost).toLocaleString('fr-FR')} €</div>` : ''}
        </div>
      `).join('') : '<p class="text-zinc-500 text-[13px] text-center py-4">Aucun événement</p>'}
      ${ev.length > 5 ? `<button onclick="select('${id}','timeline')" class="text-[12px] text-zinc-400 mt-2">Voir tout →</button>` : ''}
    </div>

    <div class="dash-card mb-4">
      <div class="text-[12px] font-medium text-zinc-400 uppercase tracking-wider mb-3">Documents & factures</div>
      ${invoices.length ? invoices.slice(0,4).map(e => `
        <div class="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
          <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[11px]">PDF</div>
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-medium truncate">${esc(e.title)}</div>
            <div class="text-[11px] text-zinc-500">${fmtDate(e.date)}</div>
          </div>
          ${e.cost ? `<div class="text-[12px]">${(+e.cost).toLocaleString('fr-FR')} €</div>` : ''}
        </div>
      `).join('') : '<p class="text-zinc-500 text-[13px] text-center py-3">Aucune facture</p>'}
    </div>

    <div class="flex gap-2">
      <button onclick="select('${id}','add')" class="btn btn-white flex-1 h-11 text-[13px]">+ Événement</button>
      <button onclick="exportCarPDF('${id}')" class="btn btn-dark flex-1 h-11 text-[13px]">Export PDF</button>
    </div>
  `;
  go('detail');
}

function exportCarPDF(id) {
  const d = load();
  const car = d.cars.find(c => c.id === id);
  if (!car) return;
  const list = d.events.filter(e => e.carId === id).sort((a,b) => new Date(a.date)-new Date(b.date));
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(16); doc.text('SPORTS CAR PASSPORT', 20, y); y += 10;
  doc.setFontSize(12); doc.text(car.model, 20, y); y += 6;
  doc.setFontSize(9); doc.setTextColor(100);
  if (car.year) { doc.text('Année : '+car.year, 20, y); y+=4; }
  if (car.km) { doc.text('Km : '+car.km.toLocaleString('fr-FR'), 20, y); y+=4; }
  if (car.plate) { doc.text('Immat. : '+car.plate, 20, y); y+=4; }
  y += 6; doc.setTextColor(0); doc.setFontSize(11); doc.text('Historique', 20, y); y+=7;
  doc.setFontSize(8);
  list.forEach(ev => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(fmtDate(ev.date)+' – '+ev.title+(ev.cost?' – '+ev.cost+'€':''), 20, y); y+=5;
  });
  doc.save('Passeport_'+car.model.replace(/\s+/g,'_')+'.pdf');
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
    baseValue: selectedDbCar?.base || null
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
  let photo = null;
  const f = document.getElementById('e-photo')?.files?.[0];
  if (f) photo = await new Promise(r => { const rd = new FileReader(); rd.onload = () => r(rd.result); rd.readAsDataURL(f); });
  const ev = {
    id: uid(),
    carId: document.getElementById('e-car').value,
    type: document.getElementById('e-type').value,
    date: document.getElementById('e-date').value,
    km: +document.getElementById('e-km').value || null,
    title: document.getElementById('e-title').value.trim(),
    cost: +document.getElementById('e-cost').value || 0,
    provider: document.getElementById('e-provider').value.trim() || null,
    notes: document.getElementById('e-notes').value.trim() || null,
    photo
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
    ['e-car','t-filter','v-car'].forEach(i => { const el = document.getElementById(i); if (el) el.value = id; });
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
  box.innerHTML = list.map(ev => {
    const car = d.cars.find(c => c.id === ev.carId);
    return `<div class="flex gap-3 pb-4">
      <div class="w-2 h-2 rounded-full bg-white/30 mt-1.5 shrink-0"></div>
      <div class="flex-1">
        <div class="text-[11px] text-zinc-500">${fmtDate(ev.date)}</div>
        <div class="font-medium text-[14px]">${esc(ev.title)}</div>
        <div class="text-[12px] text-zinc-500">${car ? esc(car.model) : ''}${ev.cost ? ' · '+(+ev.cost).toLocaleString('fr-FR')+' €' : ''}</div>
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
  const est = Math.round(base / 100) * 100;
  document.getElementById('value-amount').textContent = est.toLocaleString('fr-FR') + ' €';
  document.getElementById('value-details').textContent = 'Estimation indicative';
  box.classList.remove('hidden');
}

function addMsg(html, user) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `max-w-[85%] px-3 py-2 rounded-xl text-[13px] ${user ? 'bg-white/15 ml-auto' : 'bg-white/5'}`;
  div.innerHTML = html.replace(/\n/g,'<br>');
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function sendChat() {
  const input = document.getElementById('chat-input');
  const t = input.value.trim();
  if (!t) return;
  addMsg(esc(t), true);
  input.value = '';
  setTimeout(() => addMsg(expert(t), false), 200);
}

document.addEventListener('DOMContentLoaded', () => {
  const di = document.getElementById('e-date');
  if (di) di.valueAsDate = new Date();
  go('dashboard');
  renderCollection();
});
