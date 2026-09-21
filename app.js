// Sports Car Passport – Premium (SF Agency level)
const KEY = 'scp_v3';

const KB = [
  { k: ['rod bearing','coussinet','bielles','e46','e60','s54','s85','s65'], r: `**Rod bearings** – point critique sur plusieurs BMW M :\n• E46 M3 (S54), E60 M5 (S85), E9x M3 (S65) : usure prématurée fréquente.\n• Analyse d’huile recommandée. Changement préventif souvent vers 80-100k km.\n• Coût typique : 2 500 – 4 500 € chez un bon indépendant.\n• Coussinets aftermarket (jeu augmenté) + bon rodage = solution durable.` },
  { k: ['ims','boxster','cayman','986','987','996','m96'], r: `**IMS Bearing** – le point noir des Porsche 986/996/997.1 :\n• Défaillance = casse moteur (15-25k€+).\n• Vérifie absolument si l’IMS a été remplacé (LN Engineering / EPS).\n• 997.2 et après : problème résolu.\n• Un IMS changé + AOS + joints = très gros plus à la revente.` },
  { k: ['problèmes bmw m','fiabilité bmw m','m2','m3','m4'], r: `**BMW M – points de vigilance :**\n• Générations récentes (S55/S58/B58) : globalement solides si entretien suivi.\n• Wastegate rattle, expansion tank, injecteurs sur certains millésimes.\n• Anciennes (S54/S85/S65) : rod bearings + vanos.\n• Privilégie carnet complet + indépendant spécialisé plutôt que concession.` },
  { k: ['problèmes 911','fiabilité 911','porsche 911'], r: `**Porsche 911 par génération :**\n• 996 : IMS + AOS + RMS.\n• 997.1 : IMS encore présent.\n• 997.2 / 991 : nettement plus fiables.\n• 992 : excellents, coûts d’entretien élevés.\nRègle d’or : historique Porsche ou spécialiste + factures = valeur.` },
  { k: ['entretien amg','coût amg','amg cher'], r: `**Coûts AMG (ordres de grandeur FR) :**\n• Vidange : 400-900 €\n• Freins complets : 1 500-3 500 € (céramique beaucoup plus)\n• Pneus : 1 200-2 500 €\n• Indépendants compétents = 30-50 % d’économie vs concession.` },
  { k: ['assurance sportive','assurer sportive'], r: `**Assurance sportive France :**\n• Très variable selon âge, bonus, zone, puissance, garage.\n• Jeunes / primo : souvent cher ou refus → BCT possible.\n• Mods à déclarer obligatoirement.\n• Circuit : exclusion quasi systématique des contrats classiques.` },
  { k: ['revente modifiée','valeur modifiée','stage revente'], r: `**Mods & revente :**\n• Sur marché généraliste → souvent décote.\n• Sur marché passionné → docs + pièces de qualité = plus.\n• Garde toujours les pièces d’origine.\n• Stage documenté + réversible = mieux accepté.` },
  { k: ['stage 1','reprogrammation','remap'], r: `**Stage / Remap :**\n• Stage 1 : +30-60 ch typique, admission d’origine.\n• Toujours chez un préparateur avec banc (avant/après).\n• Déclare à l’assurance.\n• Moteurs modernes (B58, S58, M177) tolèrent bien si map qualitative.` },
  { k: ['bonjour','salut','hello','qui es-tu'], r: `Salut. Je suis l’Expert IA de Sports Car Passport.\nSpécialisé BMW M, AMG, Porsche, Audi RS.\n100 % offline – aucune connexion nécessaire.\nPose ta question (problèmes, coûts, stages, assurance, revente…).` }
];

function expert(msg) {
  const t = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let best = null, score = 0;
  for (const e of KB) {
    let s = 0;
    e.k.forEach(k => { if (t.includes(k)) s += 2; });
    if (s > score) { score = s; best = e; }
  }
  if (best && score >= 2) return best.r;
  if (t.includes('prix') || t.includes('coût') || t.includes('combien'))
    return `Donne-moi le modèle exact + l’intervention pour un ordre de prix précis.\nExemples : vidange 250-800 € · pneus 1-2,5k € · freins 1,2-4k € · stage 1 600-1 500 €.`;
  return `Reformule avec le modèle exact (ex. « problèmes S55 », « IMS 997.1 », « freins C63 »).\nJe suis fort sur BMW M, Porsche 911, AMG, coûts, stages, assurance et revente.`;
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { cars: [], events: [] }; }
  catch { return { cars: [], events: [] }; }
}
function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—'; }

function go(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('v-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.v === name);
  });
  if (['add','timeline','value','export'].includes(name)) fillSelects();
  if (name === 'dashboard') renderCars();
  if (name === 'timeline') renderTimeline();
  if (name === 'expert') {
    const box = document.getElementById('chat-messages');
    if (box && !box.children.length) {
      addMsg(`Salut. Expert IA spécialisé sportives (BMW M, AMG, Porsche…).<br><br>100 % offline. Pose ta question ou utilise les boutons.`, false);
    }
  }
}

function renderCars() {
  const d = load();
  const box = document.getElementById('cars-list');
  if (!d.cars.length) {
    box.innerHTML = `<div class="card p-8 text-center">
      <div class="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4 text-zinc-500 text-xl">+</div>
      <p class="text-zinc-300 font-medium text-[15px]">Aucune voiture</p>
      <p class="text-zinc-500 text-[13px] mt-1">Ajoute ta première sportive</p>
    </div>`;
    return;
  }
  box.innerHTML = d.cars.map(c => {
    const ev = d.events.filter(e => e.carId === c.id);
    const spent = ev.reduce((s,e) => s + (+e.cost||0), 0);
    const last = ev.sort((a,b) => new Date(b.date)-new Date(a.date))[0];
    return `<div class="card overflow-hidden">
      <div class="p-4">
        <div class="flex justify-between items-start gap-3">
          <div>
            <h3 class="font-semibold text-[15px] tracking-tight">${esc(c.model)}</h3>
            <p class="text-zinc-500 text-[12px] mt-0.5">${c.year||'—'} · ${c.km ? c.km.toLocaleString('fr-FR')+' km' : 'km ?'}</p>
          </div>
          <div class="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 text-[10px] font-bold shrink-0">SC</div>
        </div>
        <div class="flex gap-5 mt-4 text-[12px]">
          <div><span class="text-zinc-500 block">Events</span><span class="font-semibold">${ev.length}</span></div>
          <div><span class="text-zinc-500 block">Dépenses</span><span class="font-semibold">${spent.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</span></div>
          <div><span class="text-zinc-500 block">Dernier</span><span class="font-semibold">${last ? fmtDate(last.date) : '—'}</span></div>
        </div>
      </div>
      <div class="px-4 pb-4 flex gap-2">
        <button onclick="select('${c.id}','timeline')" class="btn btn-ghost flex-1 h-9 text-[12px]">Timeline</button>
        <button onclick="select('${c.id}','add')" class="btn flex-1 h-9 text-[12px] bg-rose-500/15 text-rose-400">+ Event</button>
      </div>
    </div>`;
  }).join('');
}

function select(id, view) {
  go(view);
  setTimeout(() => {
    ['e-car','t-filter','v-car','x-car'].forEach(i => {
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
  ['e-car','v-car','x-car'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { const cur = el.value; el.innerHTML = empty + opts; if (cur) el.value = cur; }
  });
  const tf = document.getElementById('t-filter');
  if (tf) { const cur = tf.value; tf.innerHTML = '<option value="all">Toutes</option>' + opts; if (cur) tf.value = cur; }
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
    createdAt: new Date().toISOString()
  });
  save(d);
  e.target.reset();
  go('dashboard');
  renderCars();
});

document.getElementById('form-event')?.addEventListener('submit', async e => {
  e.preventDefault();
  const d = load();
  let photo = null;
  const f = document.getElementById('e-photo').files?.[0];
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
      <div class="flex-1 pb-1">
        <div class="text-[11px] text-zinc-500 mb-0.5">${fmtDate(ev.date)}${ev.km ? ' · '+ev.km.toLocaleString('fr-FR')+' km' : ''}</div>
        <div class="flex items-center gap-2 mb-0.5">
          <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400">${labels[ev.type]||ev.type}</span>
          ${car ? `<span class="text-[11px] text-zinc-500">${esc(car.model)}</span>` : ''}
        </div>
        <div class="font-medium text-[14px]">${esc(ev.title)}</div>
        <div class="text-[12px] text-zinc-500 mt-0.5 space-y-0.5">
          ${ev.provider ? `<div>${esc(ev.provider)}</div>` : ''}
          ${ev.cost ? `<div class="text-zinc-300 font-medium">${ev.cost.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</div>` : ''}
          ${ev.notes ? `<div>${esc(ev.notes)}</div>` : ''}
        </div>
        ${ev.photo ? `<img src="${ev.photo}" class="mt-2 max-h-24 rounded-lg border border-white/10" onclick="window.open(this.src)">` : ''}
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
  const ev = d.events.filter(e => e.carId === id);
  const spent = ev.reduce((s,e) => s+(+e.cost||0),0);
  const mods = ev.filter(e => e.type==='mod').length;
  const maint = ev.filter(e => ['entretien','reparation'].includes(e.type)).length;

  let base = 28000;
  const m = (car.model||'').toLowerCase();
  if (m.includes('porsche')||m.includes('911')) base = 72000;
  else if (m.includes('m3')||m.includes('m4')||m.includes('m2')) base = 48000;
  else if (m.includes('amg')||m.includes('c63')||m.includes('e63')) base = 52000;
  else if (m.includes('rs')) base = 42000;
  else if (m.includes('supra')||m.includes('gtr')) base = 56000;
  else if (m.includes('ferrari')||m.includes('lambo')||m.includes('mclaren')) base = 160000;

  const age = 2026 - (+car.year||2018);
  base *= Math.max(0.4, 1 - age*0.055);
  const km = car.km||60000;
  if (km>80000) base*=0.88;
  if (km>120000) base*=0.78;
  let bonus = 1;
  if (maint>=3) bonus+=0.04;
  if (ev.length>=5) bonus+=0.03;
  if (spent>2000) bonus+=0.02;
  let modF = mods ? Math.min(1.05, 0.96 + mods*0.02) : 1;
  if (mods>3) modF = 0.92;
  const est = Math.round(base*bonus*modF/100)*100;

  document.getElementById('value-amount').textContent = est.toLocaleString('fr-FR')+' €';
  document.getElementById('value-details').innerHTML = `
    <p>Base : ~${Math.round(base).toLocaleString('fr-FR')} €</p>
    <p>Bonus historique : +${Math.round((bonus-1)*100)}%</p>
    <p>Mods : ×${modF.toFixed(2)}</p>
    <p class="text-[11px] text-zinc-500 mt-2">${ev.length} événements · ${spent.toLocaleString('fr-FR',{style:'currency',currency:'EUR'})} trackés</p>
    <p class="text-[11px] text-rose-400/80 mt-1">Estimation indicative uniquement</p>`;
  box.classList.remove('hidden');
}

function addMsg(html, user) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${user ? 'bg-rose-500/20 text-rose-50 ml-auto rounded-br-md' : 'bg-white/[0.05] text-zinc-200 rounded-bl-md'}`;
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
  setTimeout(() => addMsg(expert(t), false), 280 + Math.random()*200);
}
function ask(q) { document.getElementById('chat-input').value = q; sendChat(); }

function exportPDF() {
  const d = load();
  const id = document.getElementById('x-car')?.value;
  if (!id) return alert('Choisis une voiture');
  const car = d.cars.find(c => c.id === id);
  if (!car) return;
  const list = d.events.filter(e => e.carId === id).sort((a,b) => new Date(a.date)-new Date(b.date));
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(16); doc.setTextColor(190,20,60);
  doc.text('SPORTS CAR PASSPORT', 20, y); y += 8;
  doc.setFontSize(10); doc.setTextColor(100);
  doc.text('Généré le ' + new Date().toLocaleDateString('fr-FR'), 20, y); y += 12;
  doc.setFontSize(13); doc.setTextColor(0);
  doc.text(car.model, 20, y); y += 6;
  doc.setFontSize(9); doc.setTextColor(80);
  if (car.year) { doc.text('Année : '+car.year, 20, y); y+=4; }
  if (car.km) { doc.text('Km : '+car.km.toLocaleString('fr-FR'), 20, y); y+=4; }
  if (car.plate) { doc.text('Immat. : '+car.plate, 20, y); y+=4; }
  y += 6;
  doc.setFontSize(11); doc.setTextColor(0);
  doc.text('Historique', 20, y); y += 7;
  doc.setFontSize(8);
  list.forEach(ev => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont(undefined,'bold'); doc.text(fmtDate(ev.date)+' – '+ev.type, 20, y); y+=3.5;
    doc.setFont(undefined,'normal'); doc.text(ev.title, 25, y); y+=3.5;
    if (ev.provider) { doc.text(ev.provider, 25, y); y+=3.5; }
    if (ev.cost) { doc.text(ev.cost+' €', 25, y); y+=3.5; }
    y += 3;
  });
  doc.save('Passeport_'+car.model.replace(/\s+/g,'_')+'.pdf');
}

document.addEventListener('DOMContentLoaded', () => {
  const di = document.getElementById('e-date');
  if (di) di.valueAsDate = new Date();
  go('dashboard');
  renderCars();
  fillSelects();
});
