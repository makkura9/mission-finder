/* Mission Finder — module « Le grand rangement » (atelier fichiers et dossiers), affichage.
   Mini-Finder en présentation par colonnes adaptée au téléphone : une colonne à la fois,
   fil du chemin en haut, flèche retour, emplacements repliables (Bureau, Documents,
   Téléchargements, OneDrive, Corbeille). « + » crée un dossier ; « ⋯ » ouvre les actions
   d'un élément ; « ↶ » annule la dernière action (⌘ Z). Aucun glisser-déposer.
   Logique et vérification : js/atelier-modele.js. Missions : data/missions-finder.js.
   Missions : 100 points la première réussite ; ★★★ sans indice, ★★ avec un indice, ★ avec le dernier. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = function () { return MF.ui; };
  var M = function () { return MF.atelierModele; };
  var L = function () { return window.LIBELLES_MACOS.actions; };

  var session = null;
  var racine = null;

  function missions() { return window.ATELIER.missions; }
  function stats() { return MF.stockage.etat().activites.finder || { parties: 0, etoilesMax: 0, records: {} }; }
  function esc(t) { return ui().esc(t); }
  function pluriel(n, mot) { return n + ' ' + mot + (n > 1 ? 's' : ''); }

  /* ---------- Dessins ---------- */

  var APERCUS = {
    ville: '<rect width="160" height="100" fill="#BFDDF2"/><rect x="10" y="40" width="26" height="60" fill="#7A8A99"/><rect x="40" y="22" width="30" height="78" fill="#5E6E7D"/><rect x="74" y="50" width="22" height="50" fill="#8C9BA8"/><rect x="100" y="30" width="28" height="70" fill="#6B7B8A"/><rect x="131" y="55" width="22" height="45" fill="#7F8E9B"/><g fill="#F6E7A1"><rect x="45" y="30" width="6" height="7"/><rect x="58" y="30" width="6" height="7"/><rect x="45" y="44" width="6" height="7"/><rect x="58" y="58" width="6" height="7"/><rect x="106" y="38" width="6" height="7"/><rect x="118" y="52" width="6" height="7"/><rect x="16" y="50" width="5" height="6"/><rect x="26" y="64" width="5" height="6"/></g>',
    montagne: '<rect width="160" height="100" fill="#CFE6F7"/><path d="M0 100 L52 30 L78 62 L104 18 L160 100 Z" fill="#6F7F74"/><path d="M40 46 L52 30 L62 43 L55 40 L48 47 Z M93 34 L104 18 L117 37 L108 33 L100 39 Z" fill="#FFFFFF"/><rect y="88" width="160" height="12" fill="#5E8C4E"/>',
    plage: '<rect width="160" height="60" fill="#9FD3F0"/><circle cx="128" cy="22" r="11" fill="#F6C343"/><rect y="52" width="160" height="22" fill="#2C7FB8"/><path d="M0 56 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#FFFFFF" stroke-width="2"/><rect y="74" width="160" height="26" fill="#EBD39A"/>',
    horaire: '<rect width="160" height="100" fill="#FFFFFF"/><rect width="160" height="14" fill="#0D6B73"/><g stroke="#C9CDD2"><path d="M0 34h160M0 54h160M0 74h160M32 14v86M64 14v86M96 14v86M128 14v86"/></g><g fill="#E1F0F0"><rect x="33" y="15" width="30" height="18"/><rect x="97" y="35" width="30" height="18"/><rect x="65" y="55" width="30" height="18"/><rect x="129" y="75" width="31" height="18"/></g>'
  };
  var CORBEILLE = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M4.5 4.5h7l-.8 9h-5.4z" fill="none" stroke="#5F6B73" stroke-width="1.2" stroke-linejoin="round"/><path d="M3.5 4.5h9M6.5 3h3" stroke="#5F6B73" stroke-width="1.2" stroke-linecap="round"/></svg>';
  function apercuSVG(nom) {
    return APERCUS[nom] ? '<svg class="fx-apercu" viewBox="0 0 160 100" width="100%" role="img" aria-label="Aperçu de l\'image">' + APERCUS[nom] + '</svg>' : '';
  }
  function icone(n) {
    if (n.type === 'dossier') return '<span class="fx-icone fx-icone-dossier">' + MF.figures.mini('dossier') + '</span>';
    return '<span class="fx-icone">' + MF.figures.iconeFichier(n.nom) + '</span>';
  }

  /* ---------- Session ---------- */

  function commencer(k) {
    var etat = M().depart(k);
    session = { k: k, mission: missions()[k], etat: etat, historique: [], dossierId: etat.racines.Bureau.id,
      emplacements: false, feuille: null, message: '', verif: null, indices: 0, reussie: false, gain: null };
    ui().naviguer('#/atelier/mission');
  }

  function dossierCourant() {
    return M().parId(session.etat, session.dossierId) || session.etat.racines.Bureau;
  }
  function noeud(id) { return M().parId(session.etat, id); }

  /* Toute action passe par ici : sauvegarde pour « Annuler », puis message. */
  function agir(fn, succes) {
    var avant = JSON.stringify(session.etat);
    var r = fn();
    if (r.ok) {
      session.historique.push(avant);
      if (session.historique.length > 40) session.historique.shift();
      session.verif = null;
      session.message = '✓ ' + succes(r);
    }
    return r;
  }

  function annuler() {
    if (!session.historique.length) { session.message = 'Rien à annuler.'; rendre(); return; }
    session.etat = JSON.parse(session.historique.pop());
    if (!M().parId(session.etat, session.dossierId)) session.dossierId = session.etat.racines.Bureau.id;
    session.verif = null;
    session.message = '↶ Dernière action annulée.';
    rendre();
  }

  function ouvrirDossier(id) {
    session.dossierId = id;
    session.emplacements = false;
    session.message = '';
    rendre();
  }

  /* ---------- Feuilles (actions, renommer, destination, informations) ---------- */

  function ouvrirFeuille(f) { session.feuille = f; rendre(); }
  function fermerFeuille() { session.feuille = null; rendre(); }

  function lancer(action, id) {
    var n = noeud(id), E = session.etat;
    if (action === 'infos') return ouvrirFeuille({ type: 'infos', id: id });
    if (action === 'renommer') return ouvrirFeuille({ type: 'renommer', id: id });
    if (action === 'deplacer' || action === 'copier') return ouvrirFeuille({ type: 'destination', id: id, action: action });
    var r;
    if (action === 'compresser') r = agir(function () { return M().compresser(E, n); }, function (x) { return 'Archive « ' + x.noeud.nom + ' » créée.'; });
    if (action === 'decompresser') r = agir(function () { return M().decompresser(E, n); }, function (x) { return '« ' + x.noeud.nom + ' » est apparu à côté de l\'archive.'; });
    if (action === 'corbeille') r = agir(function () { return M().corbeille(E, n); }, function () { return '« ' + n.nom + ' » est dans la Corbeille.'; });
    session.feuille = null;
    if (r && !r.ok) session.message = '✗ ' + r.message;
    rendre();
  }

  function nouveauDossier() {
    var d = dossierCourant();
    var r = agir(function () { return M().nouveauDossier(session.etat, d); }, function (x) { return 'Dossier « ' + x.noeud.nom + ' » créé.'; });
    session.feuille = { type: 'renommer', id: r.noeud.id, nouveau: true };
    rendre();
  }

  function validerNom(id, valeur) {
    var n = noeud(id), ancien = n.nom;
    var r = agir(function () { return M().renommer(session.etat, n, valeur); }, function (x) { return ancien === x.noeud.nom ? 'Nom inchangé.' : '« ' + ancien + ' » s\'appelle maintenant « ' + x.noeud.nom + ' ».'; });
    if (!r.ok) { session.feuille.erreur = r.message; session.feuille.valeur = valeur; rendre(); return; }
    session.feuille = null;
    rendre();
  }

  function choisirDestination(id, destId, action) {
    var n = noeud(id), dest = noeud(destId), E = session.etat;
    var r = agir(function () { return action === 'copier' ? M().copier(E, n, dest) : M().deplacer(E, n, dest); },
      function () { return '« ' + n.nom + ' » ' + (action === 'copier' ? 'copié' : 'déplacé') + ' dans « ' + dest.nom + ' ».'; });
    if (!r.ok) { session.feuille.erreur = r.message; rendre(); return; }
    session.feuille = null;
    rendre();
  }

  function feuilleHTML() {
    var f = session.feuille, E = session.etat, A = L();
    if (!f) return '';
    var n = noeud(f.id), h = '';
    if (!n) { session.feuille = null; return ''; }
    var dansCorbeille = M().chemin(E, n)[0] === 'Corbeille';
    if (f.type === 'actions') {
      h = '<h2 id="feuille-titre">' + icone(n) + '<span>' + esc(n.nom) + '</span></h2><div class="feuille-actions">';
      var liste = [['infos', A.informations], ['renommer', A.renommer], ['deplacer', A.deplacer], ['copier', A.copier], ['compresser', A.compresser]];
      if (n.zip) liste.push(['decompresser', A.decompresser]);
      if (!dansCorbeille) liste.push(['corbeille', A.corbeille]);
      if (dansCorbeille) liste = [['infos', A.informations], ['deplacer', A.deplacer]];
      liste.forEach(function (a) {
        h += '<button type="button" class="btn btn-secondaire btn-bloc' + (a[0] === 'corbeille' ? ' btn-danger' : '') + '" data-lancer="' + a[0] + '">' + esc(a[1]) + '</button>';
      });
      h += '<button type="button" class="btn btn-bloc btn-fermer" data-feuille="fermer">Fermer</button></div>';
    } else if (f.type === 'renommer') {
      var valeur = f.valeur !== undefined ? f.valeur : n.nom;
      h = '<h2 id="feuille-titre">' + (f.nouveau ? 'Nommer le nouveau dossier' : esc(A.renommer) + ' « ' + esc(n.nom) + ' »') + '</h2>' +
        '<label class="etiquette" for="champ-nom">Nouveau nom</label>' +
        '<input id="champ-nom" class="champ" type="text" value="' + esc(valeur) + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done">' +
        (f.erreur ? '<p class="message message-faux" role="alert">✗ ' + esc(f.erreur) + '</p>' : '') +
        '<div class="feuille-rangee"><button type="button" class="btn btn-secondaire" data-feuille="fermer">' + esc(A.annuler) + '</button>' +
        '<button type="button" class="btn" data-feuille="ok">OK</button></div>';
    } else if (f.type === 'destination') {
      var parentId = M().parent(E, n).id;
      h = '<h2 id="feuille-titre">' + esc(f.action === 'copier' ? A.copier : A.deplacer) + ' « ' + esc(n.nom) + ' »</h2>' +
        '<p class="petit">Touchez le dossier de destination.</p>' +
        (f.erreur ? '<p class="message message-faux" role="alert">✗ ' + esc(f.erreur) + '</p>' : '') + '<ul class="feuille-dossiers">';
      M().tousLesDossiers(E, f.action === 'deplacer' && n.type === 'dossier' ? n : null).forEach(function (x) {
        h += '<li><button type="button" class="fx-dest" data-dest="' + x.noeud.id + '" style="padding-left:' + (8 + 16 * x.niveau) + 'px">' +
          icone(x.noeud) + '<span>' + esc(x.noeud.nom) + (x.noeud.id === parentId ? ' <small>(dossier actuel)</small>' : '') + '</span></button></li>';
      });
      h += '</ul><button type="button" class="btn btn-secondaire btn-bloc" data-feuille="fermer">' + esc(A.annuler) + '</button>';
    } else if (f.type === 'infos') {
      var ch = M().chemin(E, n);
      h = '<h2 id="feuille-titre">' + esc(A.informations) + '</h2>' + apercuSVG(M().apercu(n)) +
        '<dl class="fx-infos"><dt>Nom</dt><dd>' + esc(n.nom) + '</dd>' +
        '<dt>Type</dt><dd>' + esc(M().typeDe(n)) + '</dd>' +
        '<dt>Taille</dt><dd>' + esc(M().tailleTexte(M().tailleKo(n))) + (n.type === 'dossier' ? ' · ' + pluriel(n.enfants.length, 'élément') : '') + '</dd>' +
        '<dt>Emplacement</dt><dd>' + esc(ch.slice(0, -1).join(' › ')) + '</dd></dl>' +
        '<button type="button" class="btn btn-secondaire btn-bloc" data-feuille="fermer">Fermer</button>';
    }
    return '<div class="feuille-fond" data-feuille="fermer"></div><div class="feuille" role="dialog" aria-modal="true" aria-labelledby="feuille-titre">' + h + '</div>';
  }

  /* ---------- Finder simulé ---------- */

  function finderHTML() {
    var E = session.etat, d = dossierCourant(), ch = M().chemin(E, d);
    var estRacine = M().estRacine(E, d), estCorbeille = ch[0] === 'Corbeille';
    var h = '<div class="fx">' +
      '<div class="fx-barre">' +
      '<button type="button" class="fx-btn" data-fx="emplacements" aria-expanded="' + session.emplacements + '" aria-label="Emplacements">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 4v16" stroke="currentColor" stroke-width="1.8"/></svg></button>' +
      '<button type="button" class="fx-btn" data-fx="retour" aria-label="Dossier parent"' + (estRacine ? ' disabled' : '') + '>‹</button>' +
      '<span class="fx-titre">' + esc(d.nom) + '</span>' +
      '<button type="button" class="fx-btn" data-fx="nouveau" aria-label="' + esc(L().nouveauDossier) + '"' + (estCorbeille ? ' disabled' : '') + '>+</button>' +
      '<button type="button" class="fx-btn" data-fx="annuler" aria-label="Annuler la dernière action (⌘ Z)"' + (session.historique.length ? '' : ' disabled') + '>↶</button>' +
      '</div>';
    if (session.emplacements) {
      h += '<ul class="fx-emplacements" aria-label="Emplacements">';
      M().RACINES.forEach(function (r) {
        var n = E.racines[r];
        h += '<li><button type="button" class="fx-dest' + (ch[0] === r ? ' est-actuel' : '') + '" data-aller="' + n.id + '">' +
          (r === 'Corbeille' ? '<span class="fx-icone fx-icone-dossier">' + CORBEILLE + '</span>' : icone(n)) + '<span>' + esc(r) + '</span></button></li>';
      });
      h += '</ul>';
    }
    h += '<nav class="fx-fil" aria-label="Chemin du dossier ouvert">';
    var n = d, segments = [];
    while (n) { segments.unshift(n); n = M().parent(E, n); }
    segments.forEach(function (x, i) {
      h += (i ? '<span class="fx-sep" aria-hidden="true">›</span>' : '') +
        '<button type="button" class="fx-seg" data-aller="' + x.id + '"' + (i === segments.length - 1 ? ' aria-current="page"' : '') + '>' + esc(x.nom) + '</button>';
    });
    h += '</nav><ul class="fx-liste">';
    var enfants = M().trier(d.enfants);
    if (!enfants.length) h += '<li class="fx-vide">' + (estCorbeille ? 'La Corbeille est vide.' : 'Dossier vide.') + '</li>';
    enfants.forEach(function (e) {
      var meta = e.type === 'dossier' ? pluriel(e.enfants.length, 'élément') : M().tailleTexte(M().tailleKo(e));
      h += '<li class="fx-ligne"><button type="button" class="fx-el" data-el="' + e.id + '">' + icone(e) +
        '<span class="fx-nom">' + esc(e.nom) + '</span><span class="fx-meta">' + esc(meta) + '</span></button>' +
        '<button type="button" class="fx-plus" data-plus="' + e.id + '" aria-label="Actions pour « ' + esc(e.nom) + ' »">⋯</button></li>';
    });
    h += '</ul><p class="fx-message" role="status">' + esc(session.message) + '</p></div>';
    return h;
  }

  /* ---------- Vérification et indices ---------- */

  function verifier() {
    var m = session.mission;
    var r = M().verifier(session.etat, m.id);
    session.verif = r;
    if (r.reussi && !session.reussie) {
      session.reussie = true;
      var etoiles = session.indices === 0 ? 3 : session.indices === 1 ? 2 : 1;
      var premiere = stats().records[m.id] === undefined;
      var points = premiere ? 100 : 0;
      MF.progression.enregistrerReponse({ id: 'atelier-' + m.id, objectif: m.objectif }, session.indices === 0, points);
      var ancien = stats().records[m.id];
      MF.progression.terminerPartie('finder', m.id, etoiles, etoiles);
      session.gain = { etoiles: etoiles, points: points, premiere: premiere, ameliore: !premiere && etoiles > ancien };
    }
    rendre();
    var z = racine.querySelector('.retour');
    if (z && z.scrollIntoView) z.scrollIntoView({ block: 'nearest' });
  }

  function indice() {
    if (session.indices >= session.mission.indices.length || session.reussie) return;
    session.indices += 1;
    rendre();
    var z = racine.querySelector('.indices');
    if (z && z.scrollIntoView) z.scrollIntoView({ block: 'nearest' });
  }

  function retourHTML() {
    var h = '', m = session.mission;
    if (session.indices) {
      h += '<div class="indices carte">';
      m.indices.slice(0, session.indices).forEach(function (t, i) { h += '<p><b>Indice ' + (i + 1) + ' :</b> ' + esc(t) + '</p>'; });
      h += '</div>';
    }
    var r = session.verif;
    if (!r) return h;
    var lignes = '<ul class="verif">' + r.lignes.map(function (l) {
      return '<li class="' + (l.ok ? 'verif-ok' : 'verif-ko') + '"><span aria-hidden="true">' + (l.ok ? '✓' : '✗') + '</span> ' + esc(l.texte) + '</li>';
    }).join('') + '</ul>';
    if (r.reussi) {
      var g = session.gain || { etoiles: 0 };
      h += '<div class="retour retour-juste"><p><span class="retour-icone" aria-hidden="true">✓</span> <b>Mission réussie !</b> ' + ui().etoiles(g.etoiles) + '</p>' +
        '<p>' + (g.premiere ? '<span class="gain">+100 points</span>' : 'Mission déjà réussie : pas de nouveaux points.' + (g.ameliore ? ' Nouveau record d\'étoiles !' : '')) + '</p>' + lignes + '</div>';
    } else {
      h += '<div class="retour retour-faux"><p><span class="retour-icone" aria-hidden="true">✗</span> <b>Pas encore.</b> Corrigez ce qui est marqué ✗, puis vérifiez à nouveau. Rien n\'est perdu.</p>' + lignes + '</div>';
    }
    return h;
  }

  /* ---------- Écran de mission ---------- */

  function rendre() {
    var el = racine, m = session.mission, k = session.k;
    var reste = m.indices.length - session.indices;
    var h = '<div class="jeu-entete"><a class="jeu-quitter" href="#/atelier" aria-label="Quitter la mission (vous pourrez la reprendre)">✕ Quitter</a>' +
      '<span class="jeu-compteur">Mission ' + (k + 1) + ' / ' + missions().length + '</span>' +
      '<span class="jeu-points">' + (session.indices ? pluriel(session.indices, 'indice') : '') + '</span></div>' +
      '<div class="page page-jeu"><h1 class="sr-only">Le grand rangement, mission ' + (k + 1) + '</h1>' +
      '<div class="carte carte-consigne"><p class="q-theme">' + esc(m.titre) + '</p><p class="petit">' + esc(m.contexte) + '</p>' +
      '<p class="consigne">' + esc(m.consigne) + '</p></div>' +
      finderHTML() +
      '<div class="zone-retour" aria-live="polite">' + retourHTML() + '</div></div>';
    if (session.reussie) {
      h += '<div class="barre-action"><div class="barre-action-rangee"><a class="btn btn-secondaire" href="#/atelier">Missions</a>' +
        (k + 1 < missions().length ? '<button type="button" class="btn btn-bloc" data-action="suivante">Mission suivante</button>' : '<a class="btn btn-bloc" href="#/accueil">Accueil</a>') + '</div></div>';
    } else {
      h += '<div class="barre-action"><div class="barre-action-rangee">' +
        '<button type="button" class="btn btn-secondaire" data-action="indice"' + (reste ? '' : ' disabled') + '>' + (reste ? 'Indice (' + reste + ')' : 'Plus d\'indice') + '</button>' +
        '<button type="button" class="btn btn-bloc" data-action="verifier">Vérifier ma mission</button></div></div>';
    }
    h += feuilleHTML();
    el.innerHTML = h;
    brancher(el);
  }

  function brancher(el) {
    function sur(sel, f) { el.querySelectorAll(sel).forEach(function (b) { b.addEventListener('click', function () { f(b); }); }); }
    sur('[data-fx="emplacements"]', function () { session.emplacements = !session.emplacements; rendre(); });
    sur('[data-fx="retour"]', function () { var p = M().parent(session.etat, dossierCourant()); if (p) ouvrirDossier(p.id); });
    sur('[data-fx="nouveau"]', nouveauDossier);
    sur('[data-fx="annuler"]', annuler);
    sur('[data-aller]', function (b) { ouvrirDossier(b.getAttribute('data-aller')); });
    sur('[data-el]', function (b) {
      var n = noeud(b.getAttribute('data-el'));
      if (n.type === 'dossier') ouvrirDossier(n.id); else ouvrirFeuille({ type: 'infos', id: n.id });
    });
    sur('[data-plus]', function (b) { ouvrirFeuille({ type: 'actions', id: b.getAttribute('data-plus') }); });
    sur('[data-lancer]', function (b) { lancer(b.getAttribute('data-lancer'), session.feuille.id); });
    sur('[data-dest]', function (b) { choisirDestination(session.feuille.id, b.getAttribute('data-dest'), session.feuille.action); });
    sur('[data-feuille="fermer"]', fermerFeuille);
    sur('[data-feuille="ok"]', function () { validerNom(session.feuille.id, el.querySelector('#champ-nom').value); });
    sur('[data-action="verifier"]', verifier);
    sur('[data-action="indice"]', indice);
    sur('[data-action="suivante"]', function () { commencer(session.k + 1); });
    var champ = el.querySelector('#champ-nom');
    if (champ) {
      champ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); validerNom(session.feuille.id, champ.value); } });
      champ.focus();
      if (session.feuille && session.feuille.valeur === undefined) {
        var n = noeud(session.feuille.id), ext = M().extension(n.nom);
        champ.setSelectionRange(0, n.type === 'fichier' && ext ? n.nom.length - ext.length - 1 : n.nom.length);
      }
    } else if (session.feuille) {
      var premier = el.querySelector('.feuille button');
      if (premier) premier.focus();
    }
    var feuille = el.querySelector('.feuille');
    if (feuille) feuille.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') fermerFeuille(); });
  }

  /* ---------- Liste des missions ---------- */

  function ecranChoix(el) {
    racine = el;
    var st = stats(), m = MF.progression.maitriseTheme('FIN');
    var h = '<div class="page">' +
      '<p class="fil"><a href="#/accueil">‹ Accueil</a></p>' +
      '<h1>Le grand rangement</h1>' +
      '<p class="intro">9 missions sur un Finder simulé, d\'après l\'exercice 1 : créer, ranger, renommer, compresser. Vérifiez quand vous pensez avoir fini : rien n\'est perdu en cas d\'erreur.</p>' +
      '<p class="petit">Sur un vrai Mac, on déplace les fichiers en les glissant et on décompresse une archive par un double-clic ; ici, tout se fait avec les boutons « + » et « ⋯ ». Maîtrise des fichiers et dossiers : ' + (m === null ? 'à découvrir' : m + ' %') + '.</p>';
    if (session && !session.reussie) {
      h += '<div class="carte carte-reprise"><p><b>Mission en cours</b> : ' + esc(session.mission.titre) + '.</p>' +
        '<button type="button" class="btn btn-bloc" data-action="reprendre">Reprendre la mission</button></div>';
    }
    h += '<ol class="liste-missions">';
    missions().forEach(function (mi, k) {
      var etoiles = st.records[mi.id];
      h += '<li><button type="button" class="carte carte-mission" data-mission="' + k + '">' +
        '<span class="mission-num" aria-hidden="true">' + (k + 1) + '</span>' +
        '<span class="mission-corps"><b>' + esc(mi.titre) + '</b><span class="petit">' + esc(mi.consigne) + '</span></span>' +
        '<span class="mission-etat">' + (etoiles === undefined ? '<span class="petit">À faire</span>' : ui().etoiles(etoiles, 14)) + '</span></button></li>';
    });
    h += '</ol><p class="petit">Étoiles : ★★★ sans indice, ★★ avec un indice, ★ avec le dernier indice. 100 points la première fois qu\'une mission est réussie.</p></div>';
    el.innerHTML = h;
    el.querySelectorAll('[data-mission]').forEach(function (b) { b.addEventListener('click', function () { commencer(Number(b.getAttribute('data-mission'))); }); });
    var r = el.querySelector('[data-action="reprendre"]');
    if (r) r.addEventListener('click', function () { ui().naviguer('#/atelier/mission'); });
  }

  function ecranMission(el) { racine = el; rendre(); }

  MF.atelier = {
    apercuSVG: apercuSVG,
    ecranChoix: ecranChoix,
    ecranMission: ecranMission,
    aUneMission: function () { return !!session; },
    /* Pour les tests automatiques uniquement. */
    _session: function () { return session; },
    _commencer: commencer
  };
})();
