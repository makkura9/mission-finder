/* Mission Finder — « Le grand rangement » : système de fichiers simulé (sans affichage).
   - Emplacements : Bureau, Documents, Téléchargements, OneDrive, et la Corbeille.
   - Actions : nouveau dossier, renommer, déplacer, copier, compresser, décompresser,
     placer dans la Corbeille, annuler (historique).
   - Vérification des 9 missions : ce qui est juste et ce qui manque, sans donner la solution.
   Noms imposés : majuscules et accents exigés, espaces de début et de fin ignorés ;
   « Presque » si seules les majuscules ou les accents diffèrent (décision de l'enseignant).
   Ce fichier ne touche pas à la page : il est aussi testé avec Node (tests/test-atelier.js). */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};

  var RACINES = ['Bureau', 'Documents', 'Téléchargements', 'OneDrive', 'Corbeille'];
  var EF = 'Exercice_finder';

  function A() { return window.ATELIER; }
  function fiche(ref) { return A().fichiers.filter(function (f) { return f.id === ref; })[0]; }

  /* ---------- Noms ---------- */

  function sansAccents(t) { return String(t).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function simplifie(t) { return sansAccents(t).toLowerCase().trim(); }
  function extension(nom) { var k = nom.lastIndexOf('.'); return k > 0 ? nom.slice(k + 1).toLowerCase() : ''; }

  /* ---------- État ---------- */

  function nouvelId(etat) { etat.compteur += 1; return 'n' + etat.compteur; }
  function dossier(etat, nom) { return { id: nouvelId(etat), type: 'dossier', nom: nom, enfants: [] }; }
  function fichier(etat, ref, nom) { return { id: nouvelId(etat), type: 'fichier', nom: nom || fiche(ref).nom, ref: ref }; }

  function archiveDepart(etat) {
    var z = { id: nouvelId(etat), type: 'fichier', nom: A().archive.nom, zip: true, contenu: [] };
    A().archive.contenu.forEach(function (ref) { z.contenu.push(fichier(etat, ref)); });
    return z;
  }

  function etatVide() {
    var etat = { compteur: 0, racines: {} };
    RACINES.forEach(function (r) { etat.racines[r] = dossier(etat, r); });
    Object.keys(A().depart).forEach(function (r) {
      A().depart[r].forEach(function (ref) { etat.racines[r].enfants.push(ref === 'archive' ? archiveDepart(etat) : fichier(etat, ref)); });
    });
    return etat;
  }

  function copieProfonde(etat, n) {
    var c = JSON.parse(JSON.stringify(n));
    (function renumeroter(x) {
      x.id = nouvelId(etat);
      (x.enfants || []).forEach(renumeroter);
      (x.contenu || []).forEach(renumeroter);
    })(c);
    return c;
  }

  /* ---------- Parcours ---------- */

  function parId(etat, id) {
    var trouve = null;
    RACINES.forEach(function (r) { (function cherche(n) { if (trouve) return; if (n.id === id) trouve = n; (n.enfants || []).forEach(cherche); })(etat.racines[r]); });
    return trouve;
  }

  function parent(etat, noeud) {
    var trouve = null;
    RACINES.forEach(function (r) {
      (function cherche(n) { if (trouve || !n.enfants) return; if (n.enfants.indexOf(noeud) >= 0) trouve = n; n.enfants.forEach(cherche); })(etat.racines[r]);
    });
    return trouve;
  }

  function chemin(etat, noeud) {
    var noms = [noeud.nom], p = parent(etat, noeud);
    while (p) { noms.unshift(p.nom); p = parent(etat, p); }
    return noms;
  }

  function estRacine(etat, n) { return RACINES.some(function (r) { return etat.racines[r] === n; }); }
  function contient(n, cible) { return n === cible || (n.enfants || []).some(function (e) { return contient(e, cible); }); }
  function enfantNomme(d, nom) { return (d && d.enfants || []).filter(function (e) { return e.nom === nom; })[0] || null; }
  function sousDossier(d, nom) { var e = enfantNomme(d, nom); return e && e.type === 'dossier' ? e : null; }
  function tousLesDossiers(etat, sauf) {
    var l = [];
    RACINES.forEach(function (r) {
      if (r === 'Corbeille') return;
      (function parcours(n, niveau) {
        if (n.type !== 'dossier' || n === sauf) return;
        l.push({ noeud: n, niveau: niveau });
        n.enfants.forEach(function (e) { parcours(e, niveau + 1); });
      })(etat.racines[r], 0);
    });
    return l;
  }
  /* Tous les nœuds sous un dossier (lui exclu). */
  function descendants(n) { var l = []; (n.enfants || []).forEach(function (e) { l.push(e); l = l.concat(descendants(e)); }); return l; }

  function trier(enfants) { return enfants.slice().sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base', numeric: true }); }); }

  /* ---------- Actions (renvoient { ok, message, noeud }) ---------- */

  function nomLibre(d, nom, sauf) {
    // Comme sur un Mac : « Photos » et « photos » ne peuvent pas cohabiter dans un même dossier.
    return !d.enfants.some(function (e) { return e !== sauf && e.nom.toLowerCase() === nom.toLowerCase(); });
  }

  function nouveauDossier(etat, d) {
    var L = window.LIBELLES_MACOS, base = L.nouveauDossierNom, nom = base, k = 2;
    while (!nomLibre(d, nom)) { nom = base + ' ' + k; k += 1; }
    var n = dossier(etat, nom);
    d.enfants.push(n);
    return { ok: true, noeud: n };
  }

  function renommer(etat, n, nom) {
    nom = String(nom || '').trim();
    var d = parent(etat, n);
    if (!nom) return { ok: false, message: 'Le nom ne peut pas être vide.' };
    if (/[\/:]/.test(nom)) return { ok: false, message: 'Évitez les signes « / » et « : » dans un nom.' };
    if (nom.charAt(0) === '.') return { ok: false, message: 'Un nom ne doit pas commencer par un point.' };
    if (n.type === 'fichier' && extension(n.nom) && extension(nom) !== extension(n.nom)) {
      return { ok: false, message: 'Gardez l\'extension « .' + extension(n.nom) + ' » à la fin du nom : elle indique le type du fichier.' };
    }
    if (!nomLibre(d, nom, n)) return { ok: false, message: 'Un élément nommé « ' + nom + ' » existe déjà dans ce dossier.' };
    n.nom = nom;
    return { ok: true, noeud: n };
  }

  function deplacer(etat, n, dest) {
    var d = parent(etat, n);
    if (dest === d) return { ok: false, message: '« ' + n.nom + ' » est déjà dans « ' + dest.nom + ' ».' };
    if (n.type === 'dossier' && contient(n, dest)) return { ok: false, message: 'Impossible de déplacer un dossier dans lui-même.' };
    if (dest !== etat.racines.Corbeille && !nomLibre(dest, n.nom)) return { ok: false, message: 'Un élément nommé « ' + n.nom + ' » existe déjà dans « ' + dest.nom + ' ».' };
    d.enfants.splice(d.enfants.indexOf(n), 1);
    if (dest === etat.racines.Corbeille) n.origine = d.id; else delete n.origine;
    dest.enfants.push(n);
    return { ok: true, noeud: n };
  }

  function copier(etat, n, dest) {
    if (dest === parent(etat, n)) return { ok: false, message: 'Choisissez un autre dossier que celui où se trouve déjà « ' + n.nom + ' ».' };
    if (!nomLibre(dest, n.nom)) return { ok: false, message: 'Un élément nommé « ' + n.nom + ' » existe déjà dans « ' + dest.nom + ' ».' };
    var c = copieProfonde(etat, n);
    delete c.origine;
    dest.enfants.push(c);
    return { ok: true, noeud: c };
  }

  function corbeille(etat, n) { return deplacer(etat, n, etat.racines.Corbeille); }

  function compresser(etat, n) {
    var d = parent(etat, n), nom = n.nom + '.zip';
    if (!nomLibre(d, nom)) return { ok: false, message: 'Une archive « ' + nom + ' » existe déjà dans ce dossier.' };
    var z = { id: nouvelId(etat), type: 'fichier', nom: nom, zip: true, source: n.nom, contenu: [copieProfonde(etat, n)] };
    d.enfants.push(z);
    return { ok: true, noeud: z };
  }

  function decompresser(etat, z) {
    var d = parent(etat, z);
    if (!z.zip) return { ok: false, message: 'Seule une archive .zip peut être décompressée.' };
    var n;
    if (z.contenu.length === 1) {
      n = copieProfonde(etat, z.contenu[0]);
    } else {
      n = dossier(etat, z.nom.replace(/\.zip$/i, ''));
      z.contenu.forEach(function (c) { n.enfants.push(copieProfonde(etat, c)); });
    }
    if (!nomLibre(d, n.nom)) return { ok: false, message: 'Un élément nommé « ' + n.nom + ' » existe déjà : l\'archive a sans doute déjà été décompressée.' };
    d.enfants.push(n);
    return { ok: true, noeud: n };
  }

  /* ---------- Informations ---------- */

  function typeDe(n) {
    var T = window.LIBELLES_MACOS.types;
    if (n.type === 'dossier') return T.dossier;
    return T[extension(n.nom)] || T.autre;
  }
  function tailleKo(n) {
    if (n.type === 'dossier') return n.enfants.reduce(function (s, e) { return s + tailleKo(e); }, 0);
    if (n.zip) return Math.round(0.9 * n.contenu.reduce(function (s, e) { return s + tailleKo(e); }, 0));
    return n.ref ? fiche(n.ref).taille : 0;
  }
  function tailleTexte(ko) {
    if (ko >= 1000) return (Math.round(ko / 100) / 10).toFixed(1).replace('.', ',') + ' Mo';
    return ko + ' Ko';
  }
  function apercu(n) { return n.ref ? fiche(n.ref).apercu || null : null; }

  /* ---------- Vérification des missions ---------- */

  function ligne(ok, texte) { return { ok: ok, texte: texte }; }

  /* Tous les nœuds hors Corbeille. */
  function horsCorbeille(etat) {
    var l = [];
    RACINES.forEach(function (r) { if (r !== 'Corbeille') l = l.concat(descendants(etat.racines[r])); });
    return l;
  }

  /* Dossier au nom imposé attendu dans « parentDossier ». */
  function verifDossier(etat, parentDossier, nom, lieu) {
    if (!parentDossier) return ligne(false, '« ' + nom + ' » : créez d\'abord « ' + lieu + ' ».');
    if (sousDossier(parentDossier, nom)) return ligne(true, '« ' + nom + ' » est bien dans « ' + lieu + ' ».');
    var proche = parentDossier.enfants.filter(function (e) { return e.type === 'dossier' && simplifie(e.nom) === simplifie(nom); })[0];
    if (proche) return ligne(false, 'Presque : vérifiez les majuscules et les accents de « ' + proche.nom + ' ».');
    var ailleurs = horsCorbeille(etat).some(function (e) { return e.type === 'dossier' && simplifie(e.nom) === simplifie(nom); });
    if (ailleurs) return ligne(false, '« ' + nom + ' » existe, mais pas au bon endroit : il doit être dans « ' + lieu + ' ».');
    return ligne(false, '« ' + nom + ' » manque dans « ' + lieu + ' ».');
  }

  function dossiersEF(etat) {
    var ef = sousDossier(etat.racines.Bureau, EF);
    var doc = ef && sousDossier(ef, 'Documents'), img = ef && sousDossier(ef, 'Images');
    var cat = {};
    ['Web', 'Brochures', 'Formulaires', 'Tutoriels'].forEach(function (c) { cat[c] = doc && sousDossier(doc, c); });
    ['Ville', 'Montagne', 'Plage'].forEach(function (c) { cat[c] = img && sousDossier(img, c); });
    return { ef: ef, doc: doc, img: img, cat: cat };
  }

  var CATEGORIES = ['Web', 'Brochures', 'Formulaires', 'Tutoriels', 'Ville', 'Montagne', 'Plage'];
  function fichiersDeCategorie(c, avecDoublons) {
    return A().fichiers.filter(function (f) { return f.categorie === c && (avecDoublons || !f.doublonDe); }).map(function (f) { return f.id; });
  }
  function contenuDe(ref) { var f = fiche(ref); return f.doublonDe || f.id; }
  function s(n, mot) { return n + ' ' + mot + (n > 1 ? 's' : ''); }

  var VERIFS = {
    m1: function (etat) { return [verifDossier(etat, etat.racines.Bureau, EF, 'Bureau')]; },
    m2: function (etat) {
      var d = dossiersEF(etat);
      return [verifDossier(etat, d.ef, 'Documents', EF), verifDossier(etat, d.ef, 'Images', EF)];
    },
    m3: function (etat) {
      var d = dossiersEF(etat), l = [];
      ['Web', 'Brochures', 'Formulaires', 'Tutoriels'].forEach(function (c) { l.push(verifDossier(etat, d.doc, c, 'Documents')); });
      ['Ville', 'Montagne', 'Plage'].forEach(function (c) { l.push(verifDossier(etat, d.img, c, 'Images')); });
      return l;
    },
    m4: function (etat) {
      var nom = A().archive.nom.replace(/\.zip$/i, '');
      var ok = horsCorbeille(etat).some(function (e) {
        return e.type === 'dossier' && e.nom === nom && A().archive.contenu.every(function (ref) { return e.enfants.some(function (x) { return x.ref === ref; }); });
      });
      return [ok ? ligne(true, 'L\'archive est décompressée : le dossier « ' + nom + ' » contient ses ' + A().archive.contenu.length + ' fichiers.')
                 : ligne(false, 'L\'archive « ' + A().archive.nom + ' » n\'est pas encore décompressée.')];
    },
    m5: function (etat) {
      var d = dossiersEF(etat), l = [], dansCorbeille = descendants(etat.racines.Corbeille);
      CATEGORIES.forEach(function (c) {
        var dos = d.cat[c];
        if (!dos) { l.push(ligne(false, 'Le dossier « ' + c + ' » manque (mission 3).')); return; }
        var attendus = fichiersDeCategorie(c, true);
        var manque = attendus.filter(function (ref) {
          var ici = dos.enfants.some(function (e) { return e.ref === ref; });
          var doublonJete = fiche(ref).doublonDe && dansCorbeille.some(function (e) { return e.ref === ref; });
          return !ici && !doublonJete;
        }).length;
        var intrus = dos.enfants.filter(function (e) { return e.type === 'fichier' && !e.zip && e.ref && fiche(e.ref).categorie !== c; }).length;
        if (!manque && !intrus) l.push(ligne(true, c + ' : ' + s(attendus.length, 'fichier') + ', tous bien rangés.'));
        else {
          if (manque) l.push(ligne(false, c + ' : il manque ' + s(manque, 'fichier') + '.'));
          if (intrus) l.push(ligne(false, c + ' : ' + s(intrus, 'fichier') + ' n\'' + (intrus > 1 ? 'ont' : 'a') + ' rien à faire ici.'));
        }
      });
      return l;
    },
    m6: function (etat) {
      var d = dossiersEF(etat);
      if (!d.ef) return [ligne(false, 'Le dossier « ' + EF + ' » manque.')];
      var fichiers = descendants(d.ef).filter(function (e) { return e.type === 'fichier' && !e.zip && e.ref; });
      var compte = {};
      fichiers.forEach(function (e) { var k = contenuDe(e.ref); compte[k] = (compte[k] || 0) + 1; });
      var originaux = A().archive.contenu.filter(function (ref) { return !fiche(ref).doublonDe; }).concat(['c1']);
      var restants = 0, perdus = 0, inverses = 0;
      originaux.forEach(function (ref) {
        if (!compte[ref]) { perdus += 1; return; }
        restants += compte[ref] - 1;
        var gardeOriginal = fichiers.some(function (e) { return e.ref === ref; });
        if (!gardeOriginal && compte[ref] === 1) inverses += 1;
      });
      var l = [];
      if (inverses) l.push(ligne(false, 'Pour ' + s(inverses, 'fichier') + ', vous avez gardé la copie et jeté l\'original : gardez le fichier dont le nom n\'a ni « (1) » ni « copie de ».'));
      l.push(restants ? ligne(false, 'Il reste ' + s(restants, 'doublon') + ' dans « ' + EF + ' ».') : ligne(true, 'Plus aucun doublon dans « ' + EF + ' ».'));
      l.push(perdus ? ligne(false, s(perdus, 'fichier') + ' qui ' + (perdus > 1 ? 'n\'étaient' : 'n\'était') + ' pas des doublons ' + (perdus > 1 ? 'ont' : 'a') + ' disparu : récupérez-' + (perdus > 1 ? 'les' : 'le') + ' dans la Corbeille.')
                    : ligne(true, 'Tous les originaux sont conservés.'));
      return l;
    },
    m7: function (etat) {
      var d = dossiersEF(etat), l = [], MOTS = A().motsCles;
      A().fichiers.filter(function (f) { return f.aRenommer; }).forEach(function (f) {
        var dos = d.cat[f.categorie];
        var n = dos && dos.enfants.filter(function (e) { return e.ref === f.id; })[0];
        if (!n) { l.push(ligne(false, f.categorie + ' : l\'image à renommer n\'est plus dans ce dossier.')); return; }
        var nom = simplifie(n.nom);
        if (/^(pixnio|img_)/.test(nom)) l.push(ligne(false, f.categorie + ' : une image porte encore un nom automatique.'));
        else if (!MOTS[f.categorie].some(function (m) { return nom.indexOf(m) >= 0; })) l.push(ligne(false, f.categorie + ' : « ' + n.nom + ' » ne décrit pas ce que montre l\'image.'));
        else l.push(ligne(true, f.categorie + ' : « ' + n.nom + ' » est un nom explicite.'));
      });
      return l;
    },
    m8: function (etat) {
      var d = dossiersEF(etat);
      return [['Brochures', d.doc], ['Montagne', d.img]].map(function (x) {
        var z = x[1] && x[1].enfants.filter(function (e) { return e.zip && e.source === x[0]; })[0];
        return z ? ligne(true, '« ' + x[0] + ' » est compressé (' + z.nom + ').') : ligne(false, '« ' + x[0] + ' » n\'est pas encore compressé.');
      });
    },
    m9: function (etat) {
      var un = sousDossier(etat.racines.Bureau, '1C'), bu = un && sousDossier(un, 'Bureautique'), l = [];
      l.push(verifDossier(etat, etat.racines.Bureau, '1C', 'Bureau'));
      l.push(verifDossier(etat, un, 'Bureautique', '1C'));
      ['1. Gestion des fichiers et dossiers', '2. Internet et Web', '3. Word', '4. Excel'].forEach(function (c) { l.push(verifDossier(etat, bu, c, 'Bureautique')); });
      var horaire = un && un.enfants.some(function (e) { return e.ref === 'h1' && e.nom === 'mon_horaire_2026_2027.png'; });
      l.push(horaire ? ligne(true, '« mon_horaire_2026_2027.png » est dans « 1C ».') : ligne(false, '« mon_horaire_2026_2027.png » n\'est pas dans « 1C ».'));
      var pdf = un && un.enfants.filter(function (e) { return e.ref === 'n1'; })[0];
      var modele = /^introduction-outils-informatiques-[\p{L}]+-[\p{L}]+\.pdf$/u;
      if (!pdf) l.push(ligne(false, 'Le PDF « introduction-outils-informatiques » n\'est pas dans « 1C ».'));
      else if (modele.test(pdf.nom)) l.push(ligne(true, '« ' + pdf.nom + ' » est bien nommé et bien rangé.'));
      else if (modele.test(simplifie(pdf.nom))) l.push(ligne(false, 'Presque : vérifiez les majuscules et les accents de « ' + pdf.nom + ' ».'));
      else if (/\s|–/.test(pdf.nom)) l.push(ligne(false, 'Le nom « ' + pdf.nom + ' » contient une espace ou un tiret long : écrivez tout avec des tirets courts, sans espace.'));
      else l.push(ligne(false, 'Le nom « ' + pdf.nom + ' » ne suit pas le modèle « introduction-outils-informatiques-prenom-nom.pdf ».'));
      return l;
    }
  };

  function verifier(etat, id) {
    var lignes = VERIFS[id](etat);
    return { reussi: lignes.every(function (x) { return x.ok; }), lignes: lignes };
  }

  /* ---------- Solutions (départ des missions suivantes, et tests) ---------- */

  function aller(etat, noms) {
    var n = etat.racines[noms[0]];
    for (var i = 1; i < noms.length; i++) n = enfantNomme(n, noms[i]);
    return n;
  }
  function creer(etat, noms, nom) { var r = nouveauDossier(etat, aller(etat, noms)); renommer(etat, r.noeud, nom); return r.noeud; }

  var SOLUTIONS = {
    m1: function (e) { creer(e, ['Bureau'], EF); },
    m2: function (e) { creer(e, ['Bureau', EF], 'Documents'); creer(e, ['Bureau', EF], 'Images'); },
    m3: function (e) {
      ['Web', 'Brochures', 'Formulaires', 'Tutoriels'].forEach(function (c) { creer(e, ['Bureau', EF, 'Documents'], c); });
      ['Ville', 'Montagne', 'Plage'].forEach(function (c) { creer(e, ['Bureau', EF, 'Images'], c); });
    },
    m4: function (e) { decompresser(e, aller(e, ['Téléchargements', A().archive.nom])); },
    m5: function (e) {
      var src = aller(e, ['Téléchargements', A().archive.nom.replace(/\.zip$/i, '')]);
      src.enfants.slice().concat([aller(e, ['Téléchargements', fiche('c1').nom])]).forEach(function (n) {
        var c = fiche(n.ref).categorie, dos = ['Ville', 'Montagne', 'Plage'].indexOf(c) >= 0 ? 'Images' : 'Documents';
        deplacer(e, n, aller(e, ['Bureau', EF, dos, c]));
      });
    },
    m6: function (e) { horsCorbeille(e).filter(function (n) { return n.ref && fiche(n.ref).doublonDe; }).forEach(function (n) { corbeille(e, n); }); },
    m7: function (e) {
      var noms = { i2: 'vue_de_la_ville.jpg', i5: 'montagne_enneigee.jpg', i7: 'plage_au_soleil.jpg' };
      horsCorbeille(e).filter(function (n) { return noms[n.ref]; }).forEach(function (n) { renommer(e, n, noms[n.ref]); });
    },
    m8: function (e) { compresser(e, aller(e, ['Bureau', EF, 'Documents', 'Brochures'])); compresser(e, aller(e, ['Bureau', EF, 'Images', 'Montagne'])); },
    m9: function (e) {
      creer(e, ['Bureau'], '1C'); creer(e, ['Bureau', '1C'], 'Bureautique');
      ['1. Gestion des fichiers et dossiers', '2. Internet et Web', '3. Word', '4. Excel'].forEach(function (c) { creer(e, ['Bureau', '1C', 'Bureautique'], c); });
      copier(e, aller(e, ['Bureau', 'mon_horaire_2026_2027.png']), aller(e, ['Bureau', '1C']));
      var pdf = aller(e, ['Téléchargements', 'introduction-outils-informatiques.pdf']);
      deplacer(e, pdf, aller(e, ['Bureau', '1C']));
      renommer(e, pdf, 'introduction-outils-informatiques-lea-dupont.pdf');
    }
  };

  /* Situation de départ de la mission n° k (0 = mission 1) : départ + solutions des missions précédentes. */
  function depart(k) {
    var etat = etatVide();
    A().missions.slice(0, k).forEach(function (m) { SOLUTIONS[m.id](etat); });
    return etat;
  }

  MF.atelierModele = {
    RACINES: RACINES,
    depart: depart,
    etatVide: etatVide,
    parId: parId, parent: parent, chemin: chemin, estRacine: estRacine, trier: trier,
    tousLesDossiers: tousLesDossiers, contient: contient, aller: aller,
    nouveauDossier: nouveauDossier, renommer: renommer, deplacer: deplacer, copier: copier,
    corbeille: corbeille, compresser: compresser, decompresser: decompresser,
    typeDe: typeDe, tailleKo: tailleKo, tailleTexte: tailleTexte, apercu: apercu, extension: extension,
    verifier: verifier,
    solutions: SOLUTIONS,
    copieEtat: function (etat) { return JSON.parse(JSON.stringify(etat)); }
  };
})();
