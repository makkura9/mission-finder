// Tests de l'atelier « Le grand rangement » (modèle, sans navigateur) : node tests/test-atelier.js
// Pour chaque mission : la solution réussit, la situation de départ échoue, et les erreurs typiques échouent.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const SITE = path.join(__dirname, '..');
const window = {};
const ctx = vm.createContext({ window });
for (const f of ['data/missions-finder.js', 'data/libelles-macos.js', 'js/atelier-modele.js']) {
  vm.runInContext(fs.readFileSync(path.join(SITE, f), 'utf8'), ctx, { filename: f });
}
const M = window.MF.atelierModele, A = window.ATELIER;
const echecs = [];
function verifier(cond, msg) { console.log((cond ? '  OK   ' : '  ÉCHEC ') + msg); if (!cond) echecs.push(msg); }
const texte = r => r.lignes.map(l => (l.ok ? '✓ ' : '✗ ') + l.texte).join(' | ');
const aller = (e, ...noms) => M.aller(e, noms);

console.log('1. Chaque mission : départ non réussi, solution réussie');
A.missions.forEach((m, k) => {
  const e = M.depart(k);
  verifier(!M.verifier(e, m.id).reussi, `${m.id} : pas réussie au départ`);
  M.solutions[m.id](e);
  const r = M.verifier(e, m.id);
  verifier(r.reussi, `${m.id} : réussie avec la solution (${texte(r)})`);
});
verifier(A.missions.length === 9, '9 missions');

console.log('2. Noms imposés : majuscules, accents, espaces, emplacement');
let e = M.depart(0), r;
r = M.nouveauDossier(e, e.racines.Bureau);
verifier(r.noeud.nom === 'dossier sans titre', 'nouveau dossier : « dossier sans titre »');
verifier(M.nouveauDossier(e, e.racines.Bureau).noeud.nom === 'dossier sans titre 2', 'deuxième nouveau dossier : « dossier sans titre 2 »');
M.renommer(e, r.noeud, 'exercice_finder');
r = M.verifier(e, 'm1');
verifier(!r.reussi && /Presque : vérifiez les majuscules et les accents de « exercice_finder »/.test(texte(r)), 'minuscule : « Presque… »');
M.renommer(e, aller(e, 'Bureau', 'exercice_finder'), '  Exercice_finder  ');
verifier(M.verifier(e, 'm1').reussi, 'espaces de début et de fin ignorés');
e = M.depart(0); r = M.nouveauDossier(e, e.racines.Documents); M.renommer(e, r.noeud, 'Exercice_finder');
verifier(/pas au bon endroit/.test(texte(M.verifier(e, 'm1'))), 'dossier créé dans Documents : « pas au bon endroit »');
e = M.depart(1); r = M.nouveauDossier(e, e.racines.Documents); M.renommer(e, r.noeud, 'Images');
r = M.nouveauDossier(e, aller(e, 'Bureau', 'Exercice_finder')); M.renommer(e, r.noeud, 'Documents');
r = M.verifier(e, 'm2');
verifier(!r.reussi && /« Images » existe, mais pas au bon endroit/.test(texte(r)), 'mission 2 : « Images » dans les Documents de la barre latérale refusé');
e = M.depart(2); M.solutions.m3(e); M.renommer(e, aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Plage'), 'Plages');
verifier(!M.verifier(e, 'm3').reussi, 'mission 3 : « Plages » au lieu de « Plage » refusé');

console.log('3. Actions');
e = M.depart(4);
const ef = aller(e, 'Bureau', 'Exercice_finder');
verifier(!M.deplacer(e, ef, aller(e, 'Bureau', 'Exercice_finder', 'Images')).ok, 'déplacer un dossier dans lui-même : refusé');
verifier(!M.decompresser(e, aller(e, 'Téléchargements', 'Finder_Exercice1_2627.zip')).ok, 'décompresser deux fois : refusé (le dossier existe déjà)');
const img = aller(e, 'Téléchargements', 'Finder_Exercice1_2627', 'IMG_4032.jpg');
r = M.renommer(e, img, 'montagne');
verifier(!r.ok && /extension « \.jpg »/.test(r.message), 'renommer sans l\'extension : refusé avec explication');
verifier(!M.renommer(e, img, 'sommet_du_cervin.jpg').ok, 'nom déjà utilisé dans le dossier : refusé');
verifier(!M.renommer(e, img, 'SOMMET_du_Cervin.jpg').ok, 'même nom avec d\'autres majuscules : refusé (comme sur un Mac)');
verifier(!M.renommer(e, img, '   ').ok && !M.renommer(e, img, 'a/b.jpg').ok, 'nom vide ou avec « / » : refusé');
verifier(!M.copier(e, img, M.parent(e, img)).ok, 'copier dans le même dossier : refusé');
r = M.compresser(e, aller(e, 'Téléchargements', 'demande_conge.pdf'));
verifier(r.ok && r.noeud.nom === 'demande_conge.pdf.zip', 'compresser un fichier : « demande_conge.pdf.zip »');
M.corbeille(e, aller(e, 'Téléchargements', 'demande_conge.pdf'));
r = M.decompresser(e, aller(e, 'Téléchargements', 'demande_conge.pdf.zip'));
verifier(r.ok && r.noeud.nom === 'demande_conge.pdf', 'décompresser une archive d\'un seul fichier : le fichier revient');
verifier(M.tailleTexte(2105) === '2,1 Mo' && M.tailleTexte(845) === '845 Ko', 'tailles : « 2,1 Mo », « 845 Ko »');
verifier(M.typeDe(img) === 'Image JPEG' && M.typeDe(ef) === 'Dossier', 'types affichés');

console.log('4. Missions 4 à 8 : erreurs typiques');
e = M.depart(4); M.solutions.m5(e);
M.deplacer(e, aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Plage', 'PIXNIO-592014-1200x800.jpg'), aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Ville'));
r = M.verifier(e, 'm5');
verifier(!r.reussi && /Plage : il manque 1 fichier/.test(texte(r)) && /Ville : 1 fichier n'a rien à faire ici/.test(texte(r)), 'photo de plage dans Ville : « il manque » + « rien à faire ici »');
verifier(!/PIXNIO/.test(texte(r)), 'la vérification ne donne pas le nom du fichier mal rangé');
e = M.depart(4); M.solutions.m5(e); M.corbeille(e, aller(e, 'Bureau', 'Exercice_finder', 'Documents', 'Brochures', 'brochure_journee_sportive (1).pdf'));
verifier(M.verifier(e, 'm5').reussi, 'mission 5 : un doublon déjà dans la Corbeille est accepté');
e = M.depart(4); M.solutions.m5(e);
M.copier(e, aller(e, 'Téléchargements', 'Finder_Exercice1_2627'), e.racines.Documents);
verifier(M.verifier(e, 'm5').reussi, 'mission 5 : ce qui reste ailleurs ne compte pas');
e = M.depart(5); M.corbeille(e, aller(e, 'Bureau', 'Exercice_finder', 'Documents', 'Brochures', 'brochure_journee_sportive.pdf'));
M.corbeille(e, aller(e, 'Bureau', 'Exercice_finder', 'Documents', 'Formulaires', 'copie de formulaire_inscription_cours_facultatif.pdf'));
M.corbeille(e, aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Montagne', 'sommet_du_cervin (1).jpg'));
r = M.verifier(e, 'm6');
verifier(!r.reussi && /vous avez gardé la copie et jeté l'original/.test(texte(r)), 'mission 6 : original jeté, copie « (1) » gardée → refusé avec explication');
M.corbeille(e, aller(e, 'Bureau', 'Exercice_finder', 'Documents', 'Brochures', 'brochure_journee_sportive (1).pdf'));
r = M.verifier(e, 'm6');
verifier(!r.reussi && /1 fichier qui n'était pas des doublons a disparu/.test(texte(r)), 'mission 6 : les deux exemplaires jetés → « a disparu »');
e = M.depart(5); M.solutions.m6(e);
M.copier(e, aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Ville', 'vue_sur_lausanne.jpg'), aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Plage'));
r = M.verifier(e, 'm6');
verifier(!r.reussi && /Il reste 1 doublon/.test(texte(r)), 'mission 6 : une copie créée par l\'élève compte comme doublon');
e = M.depart(6); M.renommer(e, aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Ville', 'PIXNIO-284311-1200x800.jpg'), 'photo.jpg');
M.renommer(e, aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Montagne', 'IMG_4032.jpg'), 'Montagne_Enneigée.jpg');
r = M.verifier(e, 'm7');
verifier(!r.reussi && /« photo\.jpg » ne décrit pas/.test(texte(r)) && /Montagne : « Montagne_Enneigée\.jpg » est un nom explicite/.test(texte(r)) && /Plage : une image porte encore un nom automatique/.test(texte(r)),
  'mission 7 : « photo.jpg » refusé, majuscules et accents libres, nom automatique signalé');
e = M.depart(7); M.compresser(e, aller(e, 'Bureau', 'Exercice_finder', 'Documents', 'Brochures', 'brochure_camp_de_ski.pdf'));
M.compresser(e, aller(e, 'Bureau', 'Exercice_finder', 'Images', 'Montagne'));
r = M.verifier(e, 'm8');
verifier(!r.reussi && /« Brochures » n'est pas encore compressé/.test(texte(r)), 'mission 8 : compresser un fichier de Brochures au lieu du dossier : refusé');

console.log('5. Mission bonus : nom du PDF');
const essais = [
  ['introduction-outils-informatiques-prenom-nom.pdf', true], ['introduction-outils-informatiques-léa-dupont.pdf', true],
  ['introduction-outils-informatiques – prenom-nom.pdf', false], ['Introduction-outils-informatiques-lea-dupont.pdf', false],
  ['introduction-outils-informatiques-dupont.pdf', false], ['introduction_outils_informatiques_lea_dupont.pdf', false]
];
essais.forEach(([nom, attendu]) => {
  const x = M.depart(8); M.solutions.m9(x);
  M.renommer(x, aller(x, 'Bureau', '1C', 'introduction-outils-informatiques-lea-dupont.pdf'), nom);
  const rr = M.verifier(x, 'm9');
  verifier(rr.reussi === attendu, `« ${nom} » : ${attendu ? 'accepté' : 'refusé'}${attendu ? '' : ' (' + rr.lignes.filter(l => !l.ok).map(l => l.texte).join(' ') + ')'}`);
});
const x = M.depart(8); M.solutions.m9(x);
M.deplacer(x, aller(x, 'Bureau', '1C', 'mon_horaire_2026_2027.png'), x.racines.Documents);
verifier(!M.verifier(x, 'm9').reussi, 'mission 9 : horaire absent de « 1C » : refusé');
const y = M.depart(8); M.solutions.m9(y); M.corbeille(y, aller(y, 'Bureau', 'mon_horaire_2026_2027.png'));
verifier(M.verifier(y, 'm9').reussi, 'mission 9 : horaire déplacé (au lieu de copié) : accepté');

console.log(echecs.length ? `\n${echecs.length} ÉCHEC(S)` : '\nAtelier : TOUS LES TESTS RÉUSSIS');
process.exit(echecs.length ? 1 : 0);
