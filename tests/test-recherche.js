// Tests du « Détective du Finder » (moteur, sans navigateur) : node tests/test-recherche.js
// Pour chaque mission : les solutions donnent l'ensemble attendu, les erreurs typiques un autre ensemble,
// et cela quel que soit le jour de l'année (dates relatives).
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const SITE = path.join(__dirname, '..');
const window = {};
const ctx = vm.createContext({ window, Date });
for (const f of ['data/fichiers-virtuels.js', 'data/libelles-macos.js', 'js/recherche-modele.js']) {
  vm.runInContext(fs.readFileSync(path.join(SITE, f), 'utf8'), ctx, { filename: f });
}
const M = window.MF.rechercheModele, R = window.RECHERCHE, L = window.LIBELLES_MACOS.recherche;
const echecs = [];
function verifier(cond, msg) { console.log((cond ? '  OK   ' : '  ÉCHEC ') + msg); if (!cond) echecs.push(msg); }
const noms = liste => liste.map(e => e.nom).join(', ');

const JOURS = [new Date(), new Date(2026, 8, 30), new Date(2027, 0, 3), new Date(2027, 5, 20)];
const recherches = R.missions.filter(m => m.solutions);

console.log('1. Solutions et erreurs typiques (4 dates différentes)');
JOURS.forEach((auj, k) => {
  recherches.forEach(m => {
    const voulu = M.ids(M.attendu(m.id, auj));
    const ok = voulu.length >= 2 && m.solutions.every(sol => JSON.stringify(M.ids(M.rechercher(sol, 'mac', auj))) === JSON.stringify(voulu));
    const erreursOk = m.erreurs.every(err => JSON.stringify(M.ids(M.rechercher(err, 'mac', auj))) !== JSON.stringify(voulu));
    const toutesLignes = m.solutions.concat(m.erreurs).every(sol => sol.every(l => L.criteres.includes(l.critere) && L.operateurs[l.critere].includes(l.operateur)));
    if (k === 0) console.log(`       ${m.id} (${m.titre}) : ${noms(M.attendu(m.id, auj))}`);
    verifier(ok && erreursOk && toutesLignes, `${m.id}, ${auj.toISOString().slice(0, 10)} : ${m.solutions.length} solution(s) justes, ${m.erreurs.length} erreur(s) typique(s) refusée(s)`);
    verifier(M.verifier(m.id, m.solutions[0], 'mac', auj).reussi, `${m.id} : la vérification accepte la solution`);
  });
});

console.log('2. Cas limites du jeu de données');
const auj = new Date();
const res = sol => M.ids(M.rechercher(sol, 'mac', auj));
verifier(!res([{ critere: 'Nombre de pages', operateur: 'est supérieur à', nombre: 10 }]).includes('k2'), '« plus que 10 pages » exclut le PDF de 10 pages exactement');
verifier(res([{ critere: 'Nombre de pages', operateur: 'est égal à', nombre: 10 }]).includes('k2'), 'le PDF de 10 pages existe (piège utile)');
verifier(!res([{ critere: 'Date de modification', operateur: 'avant le', date: '2010-01-01' }]).includes('o4'), 'avant le 1er janvier 2010 : le fichier du 2 janvier 2010 est exclu');
verifier(res([{ critere: 'Contenu', operateur: 'contient', valeur: 'donnees' }]).includes('q1'), '« donnees » sans accent trouve « données »');
verifier(res([{ critere: 'Nom', operateur: 'contient', valeur: 'MYSTÈRE' }]).length === 5, 'majuscules et accents ignorés dans « Nom contient »');
verifier(res([{ critere: 'Extension', operateur: 'est', valeur: '.PDF' }]).length === res([{ critere: 'Type', operateur: 'est', valeur: 'PDF' }]).length, 'extension « .PDF » = type PDF');
verifier(res([{ critere: 'Nom', operateur: 'contient', valeur: '' }]).length === 0, 'ligne incomplète : ignorée (aucun résultat sans critère)');
verifier(res([{ critere: 'Type', operateur: 'est', valeur: 'PDF' }, { critere: 'Nom', operateur: 'contient', valeur: '   ' }]).length === res([{ critere: 'Type', operateur: 'est', valeur: 'PDF' }]).length, 'une ligne vide n\'empêche pas les autres');
const docs = M.rechercher([{ critere: 'Type', operateur: 'est', valeur: 'Archive' }], 'Documents', auj);
verifier(docs.length > 0 && docs.every(e => e.dossier.startsWith('Documents')), 'étendue « Documents » : seulement le dossier ouvert');
verifier(R.elements.length >= 40 && R.elements.length <= 70, `${R.elements.length} éléments (40 à 70 demandés)`);

console.log('3. Messages de la vérification');
let v = M.verifier('s2', [{ critere: 'Nom', operateur: 'contient', valeur: 'gymnase' }], 'mac', auj);
verifier(!v.reussi && v.lignes.some(l => /Il manque/.test(l.texte)) && v.lignes.some(l => /« Nom » cherche dans le nom/.test(l.texte)), 'Nom au lieu de Contenu : « Il manque… » + indice ciblé');
v = M.verifier('s3', [{ critere: 'Type', operateur: 'est', valeur: 'PDF' }], 'mac', auj);
verifier(!v.reussi && v.lignes.some(l => /ne correspondent pas/.test(l.texte)) && v.lignes.some(l => /combiné 2 critères/.test(l.texte)), 'un seul critère : « … ne correspondent pas » + « Avez-vous combiné 2 critères ? »');
v = M.verifier('s1', [{ critere: 'Type', operateur: 'est', valeur: 'Archive' }], 'Documents', auj);
verifier(!v.reussi && v.lignes.some(l => /Ce Mac/.test(l.texte)), 'mauvaise étendue : « Cherchez-vous bien dans « Ce Mac » ? »');
verifier(M.verifier('s1', [], 'mac', auj).lignes[0].texte.includes('« + »'), 'aucun critère : « Ajoutez au moins un critère »');
verifier(!M.verifier('s3', [{ critere: 'Type', operateur: 'est', valeur: 'PDF' }], 'mac', auj).lignes.some(l => /rapport_de_stage/.test(l.texte)), 'la vérification ne nomme pas les fichiers');

console.log('4. Spotlight et photos mystères');
verifier(M.spotlight('facultatifs').some(e => e.id === 'g4') && M.spotlight('CALCUL').some(e => e.id === 'X1') && M.spotlight('telech').some(e => e.id === 'D2'), 'Spotlight trouve la brochure, Calculette, Téléchargements');
verifier(M.spotlight('brochure').length >= 2, 'Spotlight « brochure » : plusieurs résultats (il faut choisir)');
const photos = { m1: 'photo_mystere_1.jpg', m2: 'photo_mystere_2.jpg', m3: 'photo_mystere_3.jpg' };
verifier(!M.renommerPhoto(photos, 'm1', 'montagne_zermatt').ok, 'renommer sans .jpg : refusé');
verifier(!M.renommerPhoto(photos, 'm1', 'photo_mystere_2.jpg').ok, 'nom d\'une autre photo : refusé');
M.renommerPhoto(photos, 'm1', 'Montagne_Zermatt.jpg'); M.renommerPhoto(photos, 'm2', 'plage_biarritz.jpg'); M.renommerPhoto(photos, 'm3', 'lausanne.jpg');
v = M.verifierPhotos(photos);
verifier(!v.reussi && v.lignes[0].ok && v.lignes[1].ok && /ce que montre la photo/.test(v.lignes[2].texte), 'photos : contenu + lieu exigés, majuscules libres');
M.renommerPhoto(photos, 'm3', 'ville_de_Lausanne.jpg');
verifier(M.verifierPhotos(photos).reussi, 'photos : les trois noms explicites acceptés');

console.log(echecs.length ? `\n${echecs.length} ÉCHEC(S)` : '\nRecherche : TOUS LES TESTS RÉUSSIS');
process.exit(echecs.length ? 1 : 0);
