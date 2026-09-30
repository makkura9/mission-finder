// Validation automatique des données de Mission Finder (node tests/valider-donnees.js)
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const SITE = path.join(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['data/objectifs.js', 'data/niveaux.js', 'data/textes.js', 'data/questions.js', 'data/raccourcis.js', 'data/bureau.js']) {
  vm.runInContext(fs.readFileSync(path.join(SITE, f), 'utf8'), ctx, { filename: f });
}
const { OBJECTIFS, NIVEAUX, TEXTES, QUESTIONS, RACCOURCIS: FICHE, BUREAU } = ctx.window;
const erreurs = [];
const codes = new Set(OBJECTIFS.liste.map(o => o.code));
const themes = new Set(OBJECTIFS.themes.map(t => t.code));
OBJECTIFS.liste.forEach(o => { if (!themes.has(o.theme)) erreurs.push(`objectif ${o.code} : thème inconnu`); });
const ids = new Set();
const TYPES = ['unique', 'multiple', 'vraifaux', 'ranger'];
const FIGURES = ['barreMenus', 'dock', 'fichier', 'colonnes', 'barreLaterale'];
const RACCOURCIS = ['⌘ A', '⌘ N', '⌘ C', '⌘ V', '⌘ O', '⌘ P', '⌘ Q', '⌘ W', '⌘ T', '⌘ I', '⌘ M', '⌘ ⇥', '⌘ ⌥ esc',
  '⌘ ⇧ 3', '⌘ ⇧ 4', '⌘ ⇧ 4 puis Espace', '⌘ ⇧ 5', '⌘ ⇧ N', '⌘ F', '⌘ Z', '⌘ Espace'];
// Un raccourci écrit dans un texte : ⌘ suivi de touches (⇧, ⌥, ⇥, esc, Espace, une lettre ou un chiffre)
const RE_RACCOURCI = /⌘(?: (?:⇧|⌥|⇥|esc|Espace|[A-Z0-9])(?![A-Za-zÀ-ÿ]))+(?: puis Espace)?/g;
QUESTIONS.forEach((q, i) => {
  const ref = q.id || `#${i}`;
  const tout = JSON.stringify(q);
  for (const c of ['id', 'objectif', 'difficulte', 'type', 'enonce', 'propositions', 'bonnes', 'explication', 'source']) {
    if (q[c] === undefined || q[c] === '' ) erreurs.push(`${ref} : champ « ${c} » manquant`);
  }
  if (ids.has(q.id)) erreurs.push(`${ref} : id en double`); ids.add(q.id);
  if (!codes.has(q.objectif)) erreurs.push(`${ref} : objectif « ${q.objectif} » inconnu`);
  if (![1, 2, 3].includes(q.difficulte)) erreurs.push(`${ref} : difficulté invalide`);
  if (!TYPES.includes(q.type)) erreurs.push(`${ref} : type invalide`);
  if (!Array.isArray(q.propositions) || q.propositions.length < 2) erreurs.push(`${ref} : propositions insuffisantes`);
  if (new Set(q.propositions).size !== q.propositions.length) erreurs.push(`${ref} : propositions en double`);
  if (!Array.isArray(q.bonnes) || q.bonnes.length < 1) erreurs.push(`${ref} : aucune bonne réponse`);
  (q.bonnes || []).forEach(b => { if (!(Number.isInteger(b) && b >= 0 && b < q.propositions.length)) erreurs.push(`${ref} : indice de bonne réponse ${b} invalide`); });
  if (new Set(q.bonnes).size !== q.bonnes.length) erreurs.push(`${ref} : bonne réponse en double`);
  if (q.type === 'unique' || q.type === 'ranger') {
    if (q.bonnes.length !== 1) erreurs.push(`${ref} : type ${q.type} mais ${q.bonnes.length} bonnes réponses`);
    if (q.propositions.length !== 4) erreurs.push(`${ref} : ${q.propositions.length} propositions au lieu de 4`);
  }
  if (q.type === 'multiple' && q.bonnes.length < 2) erreurs.push(`${ref} : « multiple » avec moins de 2 bonnes réponses`);
  if (q.type === 'multiple' && q.bonnes.length === q.propositions.length) erreurs.push(`${ref} : toutes les propositions sont justes`);
  if (q.type === 'vraifaux' && JSON.stringify(q.propositions) !== '["Vrai","Faux"]') erreurs.push(`${ref} : vrai/faux doit proposer ["Vrai","Faux"]`);
  if (q.type === 'vraifaux' && q.bonnes.length !== 1) erreurs.push(`${ref} : vrai/faux avec plusieurs bonnes réponses`);
  if (q.type === 'ranger' && !(q.figure && q.figure.type === 'fichier')) erreurs.push(`${ref} : « ranger » sans figure de fichier`);
  if (q.erreurs) Object.keys(q.erreurs).forEach(k => {
    const n = Number(k);
    if (!(n >= 0 && n < q.propositions.length)) erreurs.push(`${ref} : erreurs[${k}] hors limites`);
    if (q.bonnes.includes(n)) erreurs.push(`${ref} : erreurs[${k}] explique une BONNE réponse`);
  });
  if (q.type === 'unique' || q.type === 'ranger') {
    for (let k = 0; k < q.propositions.length; k++) if (!q.bonnes.includes(k) && !(q.erreurs && q.erreurs[k])) erreurs.push(`${ref} : pas d'explication pour le distracteur ${k}`);
  }
  if (q.explication && q.explication.length > 220) erreurs.push(`${ref} : explication trop longue (${q.explication.length} car.)`);
  if (q.figure && !FIGURES.includes(q.figure.type)) erreurs.push(`${ref} : figure inconnue`);
  if (q.figure && q.figure.type === 'colonnes') (q.figure.colonnes || []).forEach((c, k) => {
    if (!Array.isArray(c.elements) || !c.elements.length) erreurs.push(`${ref} : colonne ${k + 1} vide`);
    if (c.choisi && !c.elements.includes(c.choisi)) erreurs.push(`${ref} : colonne ${k + 1}, « ${c.choisi} » absent de la colonne`);
  });
  if (q.figure && q.figure.type === 'barreLaterale' && !(Array.isArray(q.figure.favoris) && Array.isArray(q.figure.emplacements))) erreurs.push(`${ref} : barre latérale incomplète`);
  // Raccourcis : uniquement ceux de la fiche (20) et ⌘ Espace (Spotlight, tutoriel p. 1)
  (tout.match(RE_RACCOURCI) || []).forEach(r => {
    if (!RACCOURCIS.includes(r)) erreurs.push(`${ref} : raccourci « ${r} » absent de la fiche`);
  });
  if (/⌘\s*Y\b/.test(tout)) erreurs.push(`${ref} : ⌘ Y est exclu du site`);
});
// Niveaux croissants
for (let i = 1; i < NIVEAUX.length; i++) if (NIVEAUX[i].points <= NIVEAUX[i - 1].points) erreurs.push(`niveau ${i + 1} : seuil non croissant`);
if (TEXTES.juste.length < 5 || TEXTES.faux.length < 5) erreurs.push('au moins 5 formulations « juste » et 5 « faux » requises');
// Répartition
const rep = {};
QUESTIONS.forEach(q => { const t = OBJECTIFS.liste.find(o => o.code === q.objectif)?.theme; rep[t] = (rep[t] || 0) + 1; });
const types = {}; QUESTIONS.forEach(q => { types[q.type] = (types[q.type] || 0) + 1; });
console.log(`${QUESTIONS.length} questions — par thème :`, JSON.stringify(rep), '— par type :', JSON.stringify(types));
// Phase 3 : au moins 80 questions, réparties selon le cahier des charges, chaque objectif couvert
if (QUESTIONS.length < 80) erreurs.push(`seulement ${QUESTIONS.length} questions (80 au minimum)`);
const MINIMUM = { BUR: 10, FIN: 25, TYP: 15, RAC: 15, REC: 15 };
Object.keys(MINIMUM).forEach(t => { if ((rep[t] || 0) < MINIMUM[t]) erreurs.push(`thème ${t} : ${rep[t] || 0} questions (minimum ${MINIMUM[t]})`); });
OBJECTIFS.liste.forEach(o => {
  const n = QUESTIONS.filter(q => q.objectif === o.code).length;
  if (n < 2) erreurs.push(`objectif ${o.code} : ${n} question(s) (minimum 2)`);
});
// Les 20 raccourcis de la fiche apparaissent chacun dans au moins une bonne réponse ou un énoncé RAC
RACCOURCIS.filter(r => r !== '⌘ Espace').forEach(r => {
  const present = QUESTIONS.some(q => q.objectif === 'RAC' && (q.enonce.includes(r) || q.bonnes.some(b => q.propositions[b] === r)));
  if (!present) erreurs.push(`raccourci ${r} : aucune question RAC`);
});
// Clavier secret (data/raccourcis.js) : les 20 raccourcis de la fiche, et eux seuls
const TOUCHES_FINALES = ['A', 'C', 'F', 'I', 'M', 'N', 'O', 'P', 'Q', 'T', 'V', 'W', 'Z', '3', '4', '5', 'esc', '⇥'];
const idsFiche = new Set();
if (FICHE.length !== 20) erreurs.push(`raccourcis.js : ${FICHE.length} raccourcis au lieu de 20`);
FICHE.forEach(r => {
  if (idsFiche.has(r.id)) erreurs.push(`raccourcis.js : id ${r.id} en double`); idsFiche.add(r.id);
  const combi = r.touches.join(' ') + (r.puis ? ' puis ' + r.puis : '');
  if (!RACCOURCIS.includes(combi)) erreurs.push(`raccourcis.js : ${combi} absent de la fiche`);
  if (r.touches[0] !== '⌘') erreurs.push(`raccourcis.js : ${r.id} ne commence pas par ⌘`);
  if (!TOUCHES_FINALES.includes(r.touches[r.touches.length - 1])) erreurs.push(`raccourcis.js : ${r.id}, touche finale absente du clavier virtuel`);
  if (r.puis && r.puis !== 'Espace') erreurs.push(`raccourcis.js : ${r.id}, « puis » doit valoir Espace`);
  if (!r.action) erreurs.push(`raccourcis.js : ${r.id} sans action`);
  if (/⌘\s*Y\b/.test(JSON.stringify(r))) erreurs.push(`raccourcis.js : ⌘ Y est exclu du site`);
});
const combis = FICHE.map(r => r.touches.join(' ') + (r.puis ? ' puis ' + r.puis : ''));
if (new Set(combis).size !== combis.length) erreurs.push('raccourcis.js : combinaison en double');
const textes = FICHE.map(r => r.action + (r.precision ? ' (' + r.precision + ')' : ''));
if (new Set(textes).size !== textes.length) erreurs.push('raccourcis.js : deux raccourcis ont le même texte');
FICHE.forEach(r => (r.proches || []).forEach(p => {
  if (!idsFiche.has(p) || p === r.id) erreurs.push(`raccourcis.js : ${r.id}, proche « ${p} » invalide`);
}));
// Visite du Mac (data/bureau.js) : légende a–f validée en phase 0
const LEGENDE = { pomme: 'a', barre: 'b', disque: 'c', dock: 'd', depart: 'e', corbeille: 'f' };
if (BUREAU.elements.length !== 6) erreurs.push('bureau.js : il faut les 6 éléments de la légende');
BUREAU.elements.forEach(e => {
  if (LEGENDE[e.id] !== e.lettre) erreurs.push(`bureau.js : ${e.id}, lettre ${e.lettre} (attendu ${LEGENDE[e.id]})`);
  for (const c of ['nom', 'consigne', 'touche', 'ou', 'explication']) if (!e[c]) erreurs.push(`bureau.js : ${e.id} sans « ${c} »`);
});
const noms = BUREAU.applications.map(a => a.nom), abrs = BUREAU.applications.map(a => a.abr);
if (noms[0] !== 'Finder') erreurs.push('bureau.js : le Finder doit être la première application');
if (new Set(noms).size !== noms.length || new Set(abrs).size !== abrs.length) erreurs.push('bureau.js : application ou abréviation en double');
if (BUREAU.applications.length < 4) erreurs.push('bureau.js : au moins 4 applications (Finder + 3)');
if (JSON.stringify(BUREAU.menusFinder) !== JSON.stringify(['Fichier', 'Édition', 'Présentation', 'Aller', 'Fenêtre', 'Aide'])) erreurs.push('bureau.js : menus du Finder différents de la capture du tutoriel');
if (!BUREAU.spotlight.resultats.some(x => x.nom === BUREAU.spotlight.cible && x.genre === 'Application')) erreurs.push('bureau.js : la cible Spotlight doit être une application des résultats');
BUREAU.spotlight.resultats.forEach(x => { if (!['Application', 'Document', 'Dossier'].includes(x.genre)) erreurs.push(`bureau.js : genre inconnu pour ${x.nom}`); });
console.log(`Clavier secret : ${FICHE.length} raccourcis — Visite du Mac : ${BUREAU.elements.length} éléments, ${BUREAU.applications.length} applications`);
if (erreurs.length) { console.log('ÉCHEC :\n - ' + erreurs.join('\n - ')); process.exit(1); }
console.log('Données valides : OK');
