// Validation automatique des données de Mission Finder (node tests/valider-donnees.js)
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const SITE = path.join(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['data/objectifs.js', 'data/niveaux.js', 'data/textes.js', 'data/questions.js']) {
  vm.runInContext(fs.readFileSync(path.join(SITE, f), 'utf8'), ctx, { filename: f });
}
const { OBJECTIFS, NIVEAUX, TEXTES, QUESTIONS } = ctx.window;
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
if (erreurs.length) { console.log('ÉCHEC :\n - ' + erreurs.join('\n - ')); process.exit(1); }
console.log('Données valides : OK');
