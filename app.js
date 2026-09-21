// Sports Car Passport + Expert IA 100% Offline
// Base de connaissances spécialisée voitures sportives intégrée

const STORAGE_KEY = 'sportsCarPassport_v2';

// ========== OFFLINE EXPERT ENGINE ==========
const EXPERT_KB = [
  {
    keywords: ['rod bearing', 'rod bearings', 'coussinet', 'coussinets', 'bielles', 'e46', 'e39', 'e60', 's54', 's85', 's65'],
    response: `**Rod bearings (coussinets de bielles)** – problème très connu sur plusieurs BMW M :
• E46 M3 (S54) : usure prématurée fréquente. Beaucoup de propriétaires changent préventivement vers 80-100k km.
• E60/E63 M5/M6 (S85 V10) : encore plus critique. Les coussinets d’origine ont des jeux trop faibles.
• E90/E92 M3 (S65) : même famille de problèmes.

**Conseils pratiques :**
- Analyse d’huile régulière (spectro) pour détecter les particules de métal.
- Changement préventif recommandé si tu gardes la voiture longtemps.
- Utilise des coussinets aftermarket à jeu augmenté (ACL, King, etc.) + bon rodage.
- Coût typique (pièces + main d’œuvre) : 2500–4500 € selon le modèle et le garage.

Si tu as un modèle précis, dis-le-moi pour plus de détails.`
  },
  {
    keywords: ['ims', 'roulement ims', 'boxster', 'cayman', '986', '987', '996', 'm96', 'm97'],
    response: `**IMS Bearing (Intermediate Shaft Bearing)** – le point noir historique des Porsche 986/996/987/997 early :
• Concerne surtout les moteurs M96/M97 (Boxster 986/987 et 911 996/997.1).
• Défaillance = destruction du moteur (coût 15–25k€+).
• Les versions dual-row early et single-row mid sont les plus risquées. Les LN Engineering / EPS solutions sont les plus connues.

**Recommandations :**
- Si la voiture n’a pas encore eu le remplacement IMS → c’est souvent un deal-breaker ou un argument de négociation fort.
- Vérifie les factures. Un IMS changé + AOS + joints est un gros plus.
- Sur les 997.2 et après (moteurs 9A1) le problème est résolu.

Tu as le millésime exact et le numéro de moteur ?`
  },
  {
    keywords: ['problèmes courants bmw m', 'problèmes bmw m', 'défauts bmw m', 'fiabilité bmw m', 'm2', 'm3', 'm4', 'm5'],
    response: `**Problèmes courants sur les BMW M (vue d’ensemble) :**

**M2/M3/M4 (F87, F80, F82, G80/G82) :**
- B58/S55/S58 : globalement solides si entretien suivi.
- Points de vigilance : vanne de décharge turbo (wastegate rattle), radiateur/expansion tank, injecteurs sur certains millésimes, transfert case sur xDrive.
- Rod bearings beaucoup moins problématiques que sur les anciennes générations.

**M5/M6 E60/E63 (S85) :**
- Rod bearings + pompe vanos + SMG → budget entretien élevé.

**M3 E46 (S54) :**
- Rod bearings, vanos, joints de queue cover.

**Conseil général :** carnet d’entretien complet + spécialistes indépendants (moins cher que la concession, souvent meilleurs sur ces modèles). Analyse d’huile tous les 8-10k km si tu pousses fort.`
  },
  {
    keywords: ['problèmes porsche 911', 'problèmes 911', 'fiabilité 911', '911 problèmes'],
    response: `**Problèmes fréquents Porsche 911 par génération :**

• **996 (1999-2004)** : IMS bearing, AOS (Air Oil Separator), fuites joint de culasse arrière, RMS.
• **997.1** : IMS encore présent (moins critique que 996), AOS, pompe à eau, radiateurs.
• **997.2 / 991.1** : beaucoup plus fiables. Points d’attention : pompe haute pression (certains), chaînes de distribution sur quelques moteurs, électronique PCM.
• **991.2 / 992** : globalement excellents. Coûts d’entretien et de pièces restent élevés.

**Règle d’or :** un historique d’entretien Porsche ou spécialiste indépendant réputé + factures IMS/AOS sur les anciennes = énorme plus-value à la revente.`
  },
  {
    keywords: ['coût entretien amg', 'entretien amg', 'prix entretien amg', 'amg cher'],
    response: `**Coûts d’entretien typiques Mercedes-AMG (ordres de grandeur France) :**

• Vidange + filtres (selon modèle) : 400–900 €
• Freins complets (disques + plaquettes avant/arrière) : 1500–3500 € (carbone-céramique = beaucoup plus)
• Pneus (train complet performance) : 1200–2500 €
• Distribution / chaîne (si concerné) : 1500–4000 €
• Turbo / pièces performance : très variable, souvent 2000€+

Les pièces AMG sont parmi les plus chères du segment allemand. Beaucoup de propriétaires passent chez des spécialistes indépendants (économie 30-50% vs concession tout en gardant de très bons techniciens).

Tu as un modèle précis (C63, E63, GT, A45…) ?`
  },
  {
    keywords: ['assurance sportive', 'assurance sportive france', 'assurer sportive', 'prime assurance'],
    response: `**Assurance voiture sportive en France – points clés :**

• Les tarifs varient énormément selon : âge du conducteur, bonus/malus, zone, puissance fiscale, garage fermé, usage (trajet travail ou loisirs).
• Jeunes / primo-assurés : souvent très cher ou refus. Parfois besoin du Bureau Central de Tarification (BCT).
• Modifications (stage, échappement, etc.) doivent être déclarées → sinon risque de nullité en cas de sinistre.
• Usage circuit : la plupart des contrats auto classiques excluent le track. Il faut une extension ou une assurance spécifique journée.

**Astuces :**
- Comparer plusieurs assureurs spécialisés (pas seulement les grands noms).
- Garage fermé + alarme/traqueur = gros argument.
- Kilométrage limité peut faire baisser la prime.

Tu as quel profil (âge, modèle, usage) ?`
  },
  {
    keywords: ['valeur revente modifiée', 'revente modifiée', 'cote modifiée', 'stage revente', 'mod impact valeur'],
    response: `**Impact des modifications sur la valeur de revente :**

Règle générale :
- La plupart des mods ne se rentabilisent pas à 100%.
- Sur le marché « généraliste » (concessions, particuliers non passionnés) → souvent une décote.
- Sur le marché passionné (forums, groupes Facebook, sites spécialisés) → une préparation propre et documentée peut être un plus.

**Ce qui aide :**
- Factures complètes + photos avant/après
- Pièces de qualité (Akrapovic, KW, Eventuri, etc.)
- Stage réalisé par un préparateur reconnu + bande de puissance
- Possibilité de revenir à l’origine (fichier stock conservé)

**Ce qui fait fuir :**
- Mods bricolées / sans factures
- Trop extrême (bruit, look agressif)
- Non déclaré à l’assurance

Conseil : garde toujours les pièces d’origine.`
  },
  {
    keywords: ['stage 1', 'reprogrammation', 'remap', 'stage 2', 'préparation'],
    response: `**Stage / Reprogrammation – points importants :**

• Stage 1 = optimisation cartographie (généralement admission d’origine). Gain typique 30-60 ch selon moteur.
• Stage 2 = souvent downpipe + admission + map plus agressive.
• Toujours faire réaliser par un préparateur sérieux avec banc de puissance (avant/après).
• Déclare à l’assurance (sinon risque de non-couverture).
• Sur les moteurs modernes (B58, S58, AMG M177, etc.) la fiabilité reste bonne si la map est qualitative et l’entretien suivi (huile, refroidissement).

**Impact revente :** mitigé. Documenté + réversible = mieux accepté. Sinon certains acheteurs fuient.

Tu vises quel moteur / quel gain ?`
  },
  {
    keywords: ['garage spécialisé', 'spécialiste bmw', 'spécialiste porsche', 'indépendant', 'meilleur garage'],
    response: `**Trouver un bon spécialiste (BMW M / AMG / Porsche) :**

Les concessions sont chères et parfois moins expertes sur les préparations ou les modèles un peu anciens.
Les indépendants de qualité sont souvent le meilleur rapport qualité/prix.

**Comment choisir :**
- Regarde les retours sur les forums (Motorsport-Passion, Rennlist, groupes Facebook marque)
- Demande des photos d’ateliers et d’exemples de travaux
- Vérifie s’ils ont l’outillage de diagnostic constructeur (ISTA, PIWIS, Xentry…)
- Commence par une petite intervention (vidange, freins) pour tester

Un bon spécialiste te fera souvent économiser de l’argent sur le long terme et connaîtra les points faibles de ton modèle.`
  },
  {
    keywords: ['historique', 'histovec', 'carvertical', 'vérifier historique', 'arnaque occasion'],
    response: `**Vérifier l’historique d’une sportive d’occasion :**

1. **Histovec** (gratuit, officiel) → demande au vendeur de te générer le lien. Donne les changements de propriétaire, sinistres VRC, situation administrative.
2. **CarVertical / Autoviza / etc.** → payant, plus d’infos internationales + photos d’annonces, mais attention aux erreurs (UFC-Que Choisir a pointé des approximations).
3. **Contre-expertise** par un indépendant spécialisé dans la marque (150-300 €) → le plus important sur une sportive.
4. **Factures d’entretien** complètes + carnet.

Sur les sportives, un historique flou ou incomplet = risque élevé. Ne jamais acheter sans avoir croisé plusieurs sources.`
  },
  {
    keywords: ['bonjour', 'salut', 'hello', 'coucou', 'qui es-tu', 'tu es qui'],
    response: `Salut ! Je suis l’Expert IA intégré de Sports Car Passport.

Je suis spécialisé dans les voitures sportives (BMW M, Mercedes-AMG, Porsche, Audi RS, etc.).

Je fonctionne **100% offline** : toute ma base de connaissances est déjà dans l’application. Pas besoin de connexion internet.

Pose-moi des questions sur :
• Problèmes connus par modèle
• Coûts d’entretien
• Modifications / stages
• Assurance
• Valeur de revente
• Conseils d’achat occasion

Que veux-tu savoir ?`
  }
];

function getExpertResponse(userMessage) {
  const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of EXPERT_KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (msg.includes(kw.toLowerCase())) score += 2;
      const words = kw.toLowerCase().split(' ');
      words.forEach(w => { if (w.length > 3 && msg.includes(w)) score += 1; });
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return bestMatch.response;
  }

  if (msg.includes('prix') || msg.includes('coût') || msg.includes('combien')) {
    return `Pour te donner un ordre de prix précis, j’ai besoin du modèle exact et de l’intervention.\n\nExemples de fourchettes générales (France) :\n• Vidange sportive : 250–800 €\n• Train de pneus performance : 1000–2500 €\n• Freins complets : 1200–4000 €\n• Stage 1 chez un bon préparateur : 600–1500 €\n\nDis-moi le modèle et ce que tu vises.`;
  }

  if (msg.includes('fiable') || msg.includes('fiabilité')) {
    return `La fiabilité dépend énormément du modèle, de l’année et surtout de l’entretien précédent.\n\nRègle générale chez les sportives allemandes :\n• Un carnet complet + spécialistes = souvent très bon\n• Entretien négligé ou historique flou = risque élevé\n\nDonne-moi le modèle précis (ex: M2 Competition 2019, 991.2 GT3, C63 S 2017…) et je te donne les points de vigilance concrets.`;
  }

  return `Je n’ai pas une réponse ultra-précise sur ce point dans ma base actuelle.\n\nEssaie de reformuler avec le **modèle exact** (ex: « problèmes S55 », « coût freins C63 205 », « IMS 997.1 »).\n\nJe suis particulièrement fort sur :\n• BMW M (toutes générations)\n• Porsche 911 / Boxster / Cayman\n• Mercedes-AMG\n• Problèmes connus, coûts, stages, assurance, revente`;
}

// ========== CHAT UI ==========
function addMessage(text, isUser = false) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `p-3 rounded-lg text-sm max-w-[90%] ${isUser ? 'bg-red-100 ml-auto' : 'bg-gray-100'}`;
  div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  setTimeout(() => {
    const response = getExpertResponse(text);
    addMessage(response, false);
  }, 300 + Math.random() * 400);
}

function askQuick(text) {
  document.getElementById('chat-input').value = text;
  sendChat();
}

// ========== DATA LAYER ==========
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cars: [], events: [] };
    return JSON.parse(raw);
  } catch (e) {
    return { cars: [], events: [] };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ========== VIEWS ==========
function showView(viewName) {
  document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById('view-' + viewName);
  if (target) target.classList.remove('hidden');

  if (['add', 'timeline', 'value', 'export'].includes(viewName)) populateCarSelects();
  if (viewName === 'dashboard') renderCars();
  if (viewName === 'timeline') renderTimeline();
  if (viewName === 'expert') {
    const container = document.getElementById('chat-messages');
    if (container && container.children.length === 0) {
      addMessage(`Salut ! Je suis l’Expert IA intégré, spécialisé voitures sportives (BMW M, AMG, Porsche, Audi RS…).<br><br>Je tourne <strong>100% offline</strong> – aucune connexion nécessaire.<br><br>Pose ta question ou utilise les boutons rapides en bas.`, false);
    }
  }
}

// ========== RENDER CARS ==========
function renderCars() {
  const data = loadData();
  const container = document.getElementById('cars-list');
  if (!data.cars.length) {
    container.innerHTML = `<div class="col-span-full bg-white rounded-xl shadow p-8 text-center text-gray-500">
      <p class="mb-2">Aucune voiture enregistrée.</p>
      <p class="text-sm">Ajoute ta première sportive pour commencer.</p>
    </div>`;
    return;
  }

  container.innerHTML = data.cars.map(car => {
    const events = data.events.filter(e => e.carId === car.id);
    const totalSpent = events.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
    const lastEvent = events.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return `<div class="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition">
      <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
        <h3 class="font-bold">${escapeHtml(car.model)}</h3>
        <p class="text-sm text-gray-300">${car.year || '—'} • ${car.km ? car.km.toLocaleString('fr-FR') + ' km' : 'km ?'}</p>
      </div>
      <div class="p-4 space-y-1.5 text-sm">
        <div class="flex justify-between"><span class="text-gray-500">Événements</span><span class="font-medium">${events.length}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Dépenses</span><span class="font-medium">${totalSpent.toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Dernier</span><span class="font-medium">${lastEvent ? formatDate(lastEvent.date) : '—'}</span></div>
      </div>
      <div class="px-4 pb-4 flex gap-2">
        <button onclick="selectCarAndShow('${car.id}', 'timeline')" class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 py-2 rounded-lg">Timeline</button>
        <button onclick="selectCarAndShow('${car.id}', 'add')" class="flex-1 text-sm bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-lg">+ Event</button>
      </div>
    </div>`;
  }).join('');
}

function selectCarAndShow(carId, view) {
  showView(view);
  setTimeout(() => {
    ['event-car', 'timeline-car-filter', 'value-car', 'export-car'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = carId;
    });
    if (view === 'timeline') renderTimeline();
    if (view === 'value') estimateValue();
  }, 50);
}

function populateCarSelects() {
  const data = loadData();
  const options = data.cars.map(c => `<option value="${c.id}">${escapeHtml(c.model)} ${c.year || ''}</option>`).join('');
  const empty = '<option value="">— Choisir —</option>';
  ['event-car', 'timeline-car-filter', 'value-car', 'export-car'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const current = el.value;
      el.innerHTML = (id === 'timeline-car-filter' ? '<option value="all">Toutes</option>' : empty) + options;
      if (current) el.value = current;
    }
  });
}

// ========== FORMS ==========
document.getElementById('add-car-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = loadData();
  data.cars.push({
    id: generateId(),
    model: document.getElementById('car-model').value.trim(),
    year: document.getElementById('car-year').value || null,
    km: parseInt(document.getElementById('car-km').value) || null,
    vin: document.getElementById('car-vin').value.trim() || null,
    plate: document.getElementById('car-plate').value.trim() || null,
    notes: document.getElementById('car-notes').value.trim() || null,
    createdAt: new Date().toISOString()
  });
  saveData(data);
  this.reset();
  showView('dashboard');
  renderCars();
});

document.getElementById('add-event-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const data = loadData();
  let photoData = null;
  const fileInput = document.getElementById('event-photo');
  if (fileInput.files?.[0]) {
    photoData = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(fileInput.files[0]);
    });
  }

  const event = {
    id: generateId(),
    carId: document.getElementById('event-car').value,
    type: document.getElementById('event-type').value,
    date: document.getElementById('event-date').value,
    km: parseInt(document.getElementById('event-km').value) || null,
    title: document.getElementById('event-title').value.trim(),
    cost: parseFloat(document.getElementById('event-cost').value) || 0,
    provider: document.getElementById('event-provider').value.trim() || null,
    notes: document.getElementById('event-notes').value.trim() || null,
    photo: photoData,
    createdAt: new Date().toISOString()
  };

  const car = data.cars.find(c => c.id === event.carId);
  if (car && event.km && (!car.km || event.km > car.km)) car.km = event.km;

  data.events.push(event);
  saveData(data);
  this.reset();
  showView('timeline');
  renderTimeline();
});

// ========== TIMELINE ==========
function renderTimeline() {
  const data = loadData();
  const filter = document.getElementById('timeline-car-filter')?.value || 'all';
  let events = filter === 'all' ? data.events : data.events.filter(e => e.carId === filter);
  events = events.sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById('timeline-container');
  if (!events.length) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Aucun événement.</p>';
    return;
  }

  const typeLabels = {entretien:'Entretien', reparation:'Réparation', mod:'Modification', pneus:'Pneus', facture:'Facture', ct:'CT', assurance:'Assurance', autre:'Autre'};
  const typeColors = {entretien:'bg-blue-100 text-blue-800', reparation:'bg-orange-100 text-orange-800', mod:'bg-purple-100 text-purple-800', pneus:'bg-green-100 text-green-800', facture:'bg-gray-100 text-gray-800', ct:'bg-yellow-100 text-yellow-800', assurance:'bg-indigo-100 text-indigo-800', autre:'bg-gray-100 text-gray-600'};

  container.innerHTML = events.map((ev, idx) => {
    const car = data.cars.find(c => c.id === ev.carId);
    const isLast = idx === events.length - 1;
    return `<div class="relative pb-8 ${isLast ? '' : 'timeline-item'}">
      ${!isLast ? '<div class="timeline-line"></div>' : ''}
      <div class="flex flex-col sm:flex-row sm:items-start gap-2">
        <div class="text-sm text-gray-500 whitespace-nowrap pt-0.5 w-28">${formatDate(ev.date)}</div>
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="text-xs font-medium px-2 py-0.5 rounded ${typeColors[ev.type] || typeColors.autre}">${typeLabels[ev.type] || ev.type}</span>
            ${car ? `<span class="text-xs text-gray-400">${escapeHtml(car.model)}</span>` : ''}
            ${ev.km ? `<span class="text-xs text-gray-400">${ev.km.toLocaleString('fr-FR')} km</span>` : ''}
          </div>
          <h4 class="font-semibold">${escapeHtml(ev.title)}</h4>
          <div class="text-sm text-gray-600 mt-1 space-y-0.5">
            ${ev.provider ? `<div>Chez : ${escapeHtml(ev.provider)}</div>` : ''}
            ${ev.cost ? `<div class="font-medium">${ev.cost.toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</div>` : ''}
            ${ev.notes ? `<div class="text-gray-500">${escapeHtml(ev.notes)}</div>` : ''}
          </div>
          ${ev.photo ? `<img src="${ev.photo}" class="mt-2 max-h-28 rounded border cursor-pointer" onclick="window.open(this.src)">` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ========== VALUE ==========
function estimateValue() {
  const data = loadData();
  const carId = document.getElementById('value-car')?.value;
  const resultEl = document.getElementById('value-result');
  if (!carId) { resultEl.classList.add('hidden'); return; }
  const car = data.cars.find(c => c.id === carId);
  if (!car) return;

  const events = data.events.filter(e => e.carId === carId);
  const totalSpent = events.reduce((s, e) => s + (parseFloat(e.cost) || 0), 0);
  const modEvents = events.filter(e => e.type === 'mod');
  const entretienCount = events.filter(e => ['entretien','reparation'].includes(e.type)).length;

  let base = 25000;
  const m = (car.model || '').toLowerCase();
  if (m.includes('porsche') || m.includes('911')) base = 70000;
  else if (m.includes('m3') || m.includes('m4') || m.includes('m2')) base = 45000;
  else if (m.includes('amg') || m.includes('c63') || m.includes('e63')) base = 50000;
  else if (m.includes('rs3') || m.includes('rs5') || m.includes('rs')) base = 40000;
  else if (m.includes('supra') || m.includes('gt-r') || m.includes('gtr')) base = 55000;
  else if (m.includes('ferrari') || m.includes('lambo') || m.includes('mclaren')) base = 150000;

  const year = parseInt(car.year) || 2018;
  const age = 2026 - year;
  base *= Math.max(0.4, 1 - age * 0.06);

  const km = car.km || 60000;
  if (km > 80000) base *= 0.85;
  if (km > 120000) base *= 0.75;

  let historyBonus = 1;
  if (entretienCount >= 3) historyBonus += 0.05;
  if (events.length >= 5) historyBonus += 0.03;
  if (totalSpent > 2000) historyBonus += 0.02;

  let modFactor = 1;
  if (modEvents.length > 0) {
    modFactor = 0.95 + (modEvents.length * 0.02);
    if (modEvents.length > 3) modFactor = 0.9;
  }

  const estimated = Math.round(base * historyBonus * modFactor / 100) * 100;

  document.getElementById('value-amount').textContent = estimated.toLocaleString('fr-FR') + ' €';
  document.getElementById('value-details').innerHTML = `
    <p>Base indicative : ~${Math.round(base).toLocaleString('fr-FR')} €</p>
    <p>Bonus historique : +${Math.round((historyBonus-1)*100)}%</p>
    <p>Facteur mods : ×${modFactor.toFixed(2)}</p>
    <p class="mt-2 text-xs">Événements : ${events.length} • Dépenses trackées : ${totalSpent.toLocaleString('fr-FR', {style:'currency', currency:'EUR'})}</p>
    <p class="text-xs text-orange-600 mt-1">⚠ Estimation purement indicative pour ce MVP.</p>`;
  resultEl.classList.remove('hidden');
}

// ========== PDF ==========
function exportPDF() {
  const data = loadData();
  const carId = document.getElementById('export-car')?.value;
  if (!carId) { alert('Choisis une voiture'); return; }
  const car = data.cars.find(c => c.id === carId);
  if (!car) return;

  const events = data.events.filter(e => e.carId === carId).sort((a, b) => new Date(a.date) - new Date(b.date));
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18); doc.setTextColor(180, 0, 0);
  doc.text('SPORTS CAR PASSPORT', 20, y); y += 8;
  doc.setFontSize(10); doc.setTextColor(80);
  doc.text('Historique documenté – ' + new Date().toLocaleDateString('fr-FR'), 20, y); y += 12;

  doc.setFontSize(13); doc.setTextColor(0);
  doc.text(car.model, 20, y); y += 6;
  doc.setFontSize(9); doc.setTextColor(60);
  if (car.year) { doc.text('Année : ' + car.year, 20, y); y += 4; }
  if (car.km) { doc.text('Km : ' + car.km.toLocaleString('fr-FR'), 20, y); y += 4; }
  if (car.plate) { doc.text('Immat. : ' + car.plate, 20, y); y += 4; }
  if (car.vin) { doc.text('VIN : ' + car.vin, 20, y); y += 4; }
  y += 6;

  doc.setFontSize(11); doc.setTextColor(0);
  doc.text('Historique des événements', 20, y); y += 7;

  doc.setFontSize(8);
  events.forEach(ev => {
    if (y > 270) { doc.addPage(); y = 20; }
    const typeLabel = {entretien:'Entretien', reparation:'Réparation', mod:'Modification', pneus:'Pneus', facture:'Facture', ct:'CT', assurance:'Assurance', autre:'Autre'}[ev.type] || ev.type;
    doc.setFont(undefined, 'bold'); doc.setTextColor(0);
    doc.text(formatDate(ev.date) + ' – ' + typeLabel, 20, y); y += 3.5;
    doc.setFont(undefined, 'normal'); doc.setTextColor(40);
    doc.text(ev.title, 25, y); y += 3.5;
    if (ev.provider) { doc.text('Prestataire : ' + ev.provider, 25, y); y += 3.5; }
    if (ev.cost) { doc.text('Coût : ' + ev.cost.toLocaleString('fr-FR') + ' €', 25, y); y += 3.5; }
    if (ev.km) { doc.text('Km : ' + ev.km.toLocaleString('fr-FR'), 25, y); y += 3.5; }
    y += 3;
  });

  doc.save('Passeport_' + car.model.replace(/\s+/g, '_') + '_' + new Date().toISOString().slice(0,10) + '.pdf');
}

// ========== HELPERS ==========
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('event-date');
  if (dateInput) dateInput.valueAsDate = new Date();
  showView('dashboard');
  renderCars();
  populateCarSelects();
});
