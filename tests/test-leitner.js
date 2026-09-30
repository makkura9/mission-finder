// Tests de la répétition espacée (boîtes de Leitner) et de la Révision du jour : node tests/test-leitner.js
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const SITE = path.join(__dirname, '..');

function nouveauSite() {
  const memoire = {};
  const window = {
    localStorage: {
      getItem: k => (k in memoire ? memoire[k] : null),
      setItem: (k, v) => { memoire[k] = String(v); },
      removeItem: k => { delete memoire[k]; }
    }
  };
  const ctx = vm.createContext({ window, Date, Math, JSON, Object, Array, String, Number, isFinite });
  for (const f of ['data/objectifs.js', 'data/niveaux.js', 'data/textes.js', 'data/questions.js',
                   'js/ui.js', 'js/storage.js', 'js/progression.js', 'js/leitner.js']) {
    vm.runInContext(fs.readFileSync(path.join(SITE, f), 'utf8'), ctx, { filename: f });
  }
  window.MF.stockage.charger();
  return window;
}

const echecs = [];
function verifier(cond, msg) { console.log((cond ? '  OK   ' : '  ÉCHEC ') + msg); if (!cond) echecs.push(msg); }
function dateIlYa(jours) {
  const d = new Date(); d.setDate(d.getDate() - jours);
  const m = d.getMonth() + 1, j = d.getDate();
  return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (j < 10 ? '0' : '') + j;
}

// 1. Premier lancement
console.log('1. Premier lancement');
let W = nouveauSite(), MF = W.MF, Q = W.QUESTIONS;
let r = MF.leitner.resume();
verifier(r.aRevoir === 0 && r.vues === 0 && r.nouvelles === Q.length, `rien à revoir, ${Q.length} questions nouvelles`);
let t = MF.leitner.tirageRevision();
verifier(t.length === 5, `Révision du jour : 5 questions nouvelles (obtenu : ${t.length})`);
verifier(new Set(t.map(q => q.id)).size === t.length, 'aucune question en double');
verifier(new Set(t.map(q => MF.ui.themeDeObjectif(q.objectif))).size === 5, 'les 5 thèmes sont représentés');

// 2. Boîtes et délais
console.log('2. Boîtes et délais');
const q0 = Q[0], q1 = Q[1];
MF.progression.enregistrerReponse(q0, false, 0);
verifier(W.MF.stockage.etat().questions[q0.id].boite === 1, 'réponse fausse : boîte 1');
verifier(MF.leitner.estARevoir(q0), 'question ratée : à revoir tout de suite');
MF.progression.enregistrerReponse(q1, true, 10);
verifier(W.MF.stockage.etat().questions[q1.id].boite === 2, 'juste du premier coup : boîte 2');
verifier(!MF.leitner.estARevoir(q1), 'boîte 2 : pas à revoir le jour même');
W.MF.stockage.etat().questions[q1.id].derniere = dateIlYa(1);
verifier(MF.leitner.estARevoir(q1), 'boîte 2 : à revoir le lendemain');
const attendus = { 3: 3, 4: 7, 5: 14 };
Object.keys(attendus).forEach(b => {
  const s = W.MF.stockage.etat().questions[q1.id];
  s.boite = Number(b);
  s.derniere = dateIlYa(attendus[b] - 1);
  const avant = MF.leitner.estARevoir(q1);
  s.derniere = dateIlYa(attendus[b]);
  verifier(!avant && MF.leitner.estARevoir(q1), `boîte ${b} : revient après ${attendus[b]} jours, pas avant`);
});
for (let k = 0; k < 6; k++) MF.progression.enregistrerReponse(q1, true, 10);
verifier(W.MF.stockage.etat().questions[q1.id].boite === 5, 'la boîte ne dépasse pas 5');
MF.progression.enregistrerReponse(q1, false, 0);
verifier(W.MF.stockage.etat().questions[q1.id].boite === 1, 'une erreur renvoie en boîte 1');
verifier(MF.leitner.joursDepuis('') === Infinity && MF.leitner.joursDepuis('abc') === Infinity, 'date absente ou illisible : question considérée comme à revoir');

// 3. Révision du jour : priorités
console.log('3. Révision du jour');
W = nouveauSite(); MF = W.MF; Q = W.QUESTIONS;
const etat = W.MF.stockage.etat();
Q.slice(0, 14).forEach((q, k) => { etat.questions[q.id] = { vues: 1, justes1: 0, boite: k < 4 ? 1 : 3, derniere: dateIlYa(k < 4 ? 0 : 5) }; });
Q.slice(14, 20).forEach(q => { etat.questions[q.id] = { vues: 1, justes1: 1, boite: 4, derniere: dateIlYa(1) }; });
r = MF.leitner.resume();
verifier(r.aRevoir === 14, `14 questions à revoir (obtenu : ${r.aRevoir})`);
t = MF.leitner.tirageRevision();
verifier(t.length === 10, `au plus 10 questions (obtenu : ${t.length})`);
verifier(Q.slice(0, 4).every(q => t.includes(q)), 'les questions ratées (boîte 1) sont toutes prises en premier');
verifier(t.every(q => MF.leitner.estARevoir(q)), 'uniquement des questions à revoir');
let consecutifs = 0;
for (let k = 1; k < t.length; k++) if (MF.ui.themeDeObjectif(t[k].objectif) === MF.ui.themeDeObjectif(t[k - 1].objectif)) consecutifs++;
const themesT = new Set(t.map(q => MF.ui.themeDeObjectif(q.objectif))).size;
verifier(themesT === 1 || consecutifs <= t.length - themesT, `thèmes entrelacés (${consecutifs} paire(s) consécutive(s) du même thème)`);

// Entrelacement : 10 questions, 2 par thème → jamais deux fois le même thème à la suite (100 essais)
const deuxParTheme = ['BUR', 'FIN', 'TYP', 'RAC', 'REC'].flatMap(th => Q.filter(q => MF.ui.themeDeObjectif(q.objectif) === th).slice(0, 2));
let pire = 0;
for (let essai = 0; essai < 100; essai++) {
  const m = MF.leitner.entrelacer(deuxParTheme);
  let c = 0; for (let k = 1; k < m.length; k++) if (MF.ui.themeDeObjectif(m[k].objectif) === MF.ui.themeDeObjectif(m[k - 1].objectif)) c++;
  pire = Math.max(pire, c);
  if (m.length !== 10 || new Set(m).size !== 10) pire = 99;
}
verifier(pire === 0, `mélange des thèmes : jamais deux questions du même thème à la suite (pire cas : ${pire})`);

// 4. Peu de questions à revoir : complément avec des questions nouvelles
W = nouveauSite(); MF = W.MF; Q = W.QUESTIONS;
W.MF.stockage.etat().questions[Q[0].id] = { vues: 1, justes1: 0, boite: 1, derniere: dateIlYa(0) };
t = MF.leitner.tirageRevision();
verifier(t.length === 5 && t.includes(Q[0]), '1 question à revoir + 4 nouvelles = 5 questions');

// 5. Tout vu, rien à revoir : les questions qui reviendront le plus tôt
W = nouveauSite(); MF = W.MF; Q = W.QUESTIONS;
Q.forEach(q => { W.MF.stockage.etat().questions[q.id] = { vues: 1, justes1: 1, boite: 5, derniere: dateIlYa(0) }; });
W.MF.stockage.etat().questions[Q[7].id].boite = 2;
t = MF.leitner.tirageRevision();
verifier(t.length === 5 && t.includes(Q[7]), 'rien à revoir : 5 questions quand même, la boîte la plus basse en premier');

// 6. Quiz express : d'abord les questions à revoir ou jamais vues
W = nouveauSite(); MF = W.MF; Q = W.QUESTIONS;
const typ = Q.filter(q => MF.ui.themeDeObjectif(q.objectif) === 'TYP');
typ.forEach((q, k) => { if (k >= 3) W.MF.stockage.etat().questions[q.id] = { vues: 1, justes1: 1, boite: 5, derniere: dateIlYa(0) }; });
const ordre = MF.leitner.prioriser(typ);
verifier(ordre.length === typ.length, 'aucune question perdue');
verifier(ordre.slice(0, 3).every(q => typ.indexOf(q) < 3), 'les 3 questions jamais vues passent en premier');

console.log(echecs.length ? `\n${echecs.length} ÉCHEC(S)` : '\nLeitner : TOUS LES TESTS RÉUSSIS');
process.exit(echecs.length ? 1 : 0);
