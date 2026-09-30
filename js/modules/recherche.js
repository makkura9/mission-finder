/* Mission Finder — module « Détective du Finder » (recherche de documents), affichage.
   - Partie A : Spotlight (ouvrir un document, une application, un dossier) ; résultats filtrés en direct.
   - Missions 1 à 9 : recherche avancée (⌘ F) — « Rechercher : Ce Mac / dossier ouvert », lignes de critères
     (critère + opérateur + valeur), « + » pour ajouter, « − » pour supprimer ; résultats en direct ; critères en ET.
   - Mission 10 : photos mystères — métadonnées (lieu de prise de vue), puis renommer (décision de l'enseignant :
     panneau « Métadonnées de la photo », sans dire dans quel outil de macOS le lieu apparaît).
   Moteur : js/recherche-modele.js. Données : data/fichiers-virtuels.js. Libellés : data/libelles-macos.js.
   Points et étoiles comme « Le grand rangement » : 100 points à la première réussite, étoiles 3/2/1 selon les indices. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = function () { return MF.ui; };
  var M = function () { return MF.rechercheModele; };
  var L = function () { return window.LIBELLES_MACOS.recherche; };
  var DOSSIER_OUVERT = 'Documents';

  var session = null;
  var racine = null;

  function missions() { return window.RECHERCHE.missions; }
  function stats() { return MF.stockage.etat().activites.recherche || { parties: 0, etoilesMax: 0, records: {} }; }
  function esc(t) { return ui().esc(t); }
  function pluriel(n, mot) { return n + ' ' + mot + (n > 1 ? 's' : ''); }
  function aujourdhui() { return new Date(); }
  function dateSuisse(ms) { var d = new Date(ms); return ('0' + d.getUTCDate()).slice(-2) + '.' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '.' + d.getUTCFullYear(); }

  function icone(el) {
    if (el.genre === 'dossier') return '<span class="fx-icone fx-icone-dossier">' + MF.figures.mini('dossier') + '</span>';
    if (el.genre === 'application') return '<span class="fx-icone"><svg viewBox="0 0 36 36" width="28" height="28" aria-hidden="true" focusable="false"><rect x="1" y="1" width="34" height="34" rx="8" fill="#5F6B73"/><text x="18" y="23.5" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF" font-family="system-ui,sans-serif">' + esc(el.nom.slice(0, 2)) + '</text></svg></span>';
    return '<span class="fx-icone">' + MF.figures.iconeFichier(el.nom) + '</span>';
  }

  /* ---------- Session ---------- */

  function commencer(k) {
    var m = missions()[k];
    session = { k: k, mission: m, lignes: [], portee: 'mac', indices: 0, reussie: false, gain: null, verif: null, message: '', feuille: null,
      requete: '', faits: [], noms: {} };
    (m.photos || []).forEach(function (id) { session.noms[id] = M().element(id).nom; });
    ui().naviguer('#/recherche/mission');
  }

  function marquerReussite() {
    var m = session.mission;
    session.reussie = true;
    var etoiles = session.indices === 0 ? 3 : session.indices === 1 ? 2 : 1;
    var ancien = stats().records[m.id], premiere = ancien === undefined;
    MF.progression.enregistrerReponse({ id: 'recherche-' + m.id, objectif: m.objectif }, session.indices === 0, premiere ? 100 : 0);
    MF.progression.terminerPartie('recherche', m.id, etoiles, etoiles);
    session.gain = { etoiles: etoiles, premiere: premiere, ameliore: !premiere && etoiles > ancien };
  }

  function verifier() {
    var m = session.mission;
    var r = m.photos ? M().verifierPhotos(session.noms) : M().verifier(m.id, session.lignes, session.portee, aujourdhui());
    session.verif = r;
    if (r.reussi && !session.reussie) marquerReussite();
    rendre();
    var z = racine.querySelector('.retour');
    if (z && z.scrollIntoView) z.scrollIntoView({ block: 'nearest' });
  }

  function indice() {
    if (session.indices >= session.mission.indices.length || session.reussie) return;
    session.indices += 1;
    rendre();
  }

  /* ---------- Partie A : Spotlight ---------- */

  function etapeSpotlight() { return window.RECHERCHE.spotlight[session.faits.length]; }

  function resultatsSpotlightHTML() {
    var res = M().spotlight(session.requete), h = '';
    res.forEach(function (el) {
      h += '<li><button type="button" class="fx-dest rs-resultat" data-ouvrir="' + el.id + '">' + icone(el) +
        '<span class="rs-texte"><b>' + esc(el.nom) + '</b><small>' + esc(M().genreTexte(el)) + (el.dossier ? ' · ' + esc(el.dossier.replace(/\//g, ' › ')) : '') + '</small></span></button></li>';
    });
    if (!res.length && session.requete.trim()) h = '<li class="fx-vide">Aucun résultat</li>';
    return h;
  }

  function ouvrirSpotlight(id) {
    var etape = etapeSpotlight();
    if (!etape) return;
    var el = M().element(id);
    if (id === etape.id) {
      session.faits.push(id);
      session.message = '✓ « ' + el.nom + ' » est ouvert.';
      session.requete = '';
      if (!etapeSpotlight()) { session.verif = { reussi: true, lignes: window.RECHERCHE.spotlight.map(function (e) { return { ok: true, texte: e.consigne }; }) }; marquerReussite(); }
    } else {
      session.message = '✗ « ' + el.nom + ' » est ' + (el.genre === 'dossier' ? 'un dossier' : el.genre === 'application' ? 'une application' : 'un document') + ' : ce n\'est pas ce qui est demandé.';
    }
    rendre();
  }

  function spotlightHTML() {
    var etapes = window.RECHERCHE.spotlight, h = '<ol class="rs-etapes">';
    etapes.forEach(function (e, i) {
      var fait = i < session.faits.length, actuel = i === session.faits.length;
      h += '<li class="' + (fait ? 'est-fait' : actuel ? 'est-actuel' : '') + '">' + (fait ? '<span aria-hidden="true">✓</span> ' : '') + esc(e.consigne) + (fait ? '<span class="sr-only"> (fait)</span>' : '') + '</li>';
    });
    h += '</ol>';
    if (etapeSpotlight()) {
      h += '<div class="rs-spotlight"><label class="mac-champ"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.5 14.5l5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
        '<span class="sr-only">Recherche Spotlight</span><input type="text" id="champ-spotlight" value="' + esc(session.requete) + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go"></label>' +
        '<ul class="rs-liste" aria-live="polite">' + resultatsSpotlightHTML() + '</ul></div>';
    }
    return h + '<p class="fx-message" role="status">' + esc(session.message) + '</p>';
  }

  /* ---------- Missions 1 à 9 : recherche avancée ---------- */

  function nouvelleLigne(critere) {
    critere = critere || L().criteres[0];
    return { critere: critere, operateur: L().operateurs[critere][0], valeur: '', nombre: null, unite: L().unites[0], date: '' };
  }

  function options(liste, choisi, vide) {
    return (vide ? '<option value="">' + esc(vide) + '</option>' : '') + liste.map(function (x) {
      return '<option value="' + esc(x) + '"' + (x === choisi ? ' selected' : '') + '>' + esc(x) + '</option>';
    }).join('');
  }

  function ligneHTML(l, i) {
    var h = '<li class="rs-ligne' + (l.critere === 'Date de modification' ? ' rs-ligne-date' : '') + '" data-ligne="' + i + '"><div class="rs-ligne-haut">' +
      '<label class="sr-only" for="crit-' + i + '">Critère de la ligne ' + (i + 1) + '</label>' +
      '<select id="crit-' + i + '" class="champ" data-champ="critere">' + options(L().criteres, l.critere) + '</select>' +
      '<button type="button" class="rs-moins" data-moins="' + i + '" aria-label="Supprimer la ligne ' + (i + 1) + '">−</button></div><div class="rs-ligne-bas">' +
      '<label class="sr-only" for="op-' + i + '">Opérateur</label>' +
      '<select id="op-' + i + '" class="champ" data-champ="operateur">' + options(L().operateurs[l.critere], l.operateur) + '</select>';
    var id = 'val-' + i;
    if (l.critere === 'Type') {
      h += '<label class="sr-only" for="' + id + '">Type</label><select id="' + id + '" class="champ" data-champ="valeur">' + options(L().valeursType, l.valeur, '— choisir —') + '</select>';
    } else if (l.critere === 'Date de modification' && l.operateur === 'dans les derniers') {
      h += '<label class="sr-only" for="' + id + '">Nombre</label><input id="' + id + '" class="champ rs-nombre" type="number" inputmode="numeric" min="1" data-champ="nombre" value="' + (l.nombre === null ? '' : l.nombre) + '">' +
        '<label class="sr-only" for="unite-' + i + '">Unité</label><select id="unite-' + i + '" class="champ" data-champ="unite">' + options(L().unites, l.unite) + '</select>';
    } else if (l.critere === 'Date de modification') {
      h += '<label class="sr-only" for="' + id + '">Date</label><input id="' + id + '" class="champ" type="date" data-champ="date" value="' + esc(l.date) + '">';
    } else if (l.critere === 'Nombre de pages') {
      h += '<label class="sr-only" for="' + id + '">Nombre de pages</label><input id="' + id + '" class="champ rs-nombre" type="number" inputmode="numeric" min="0" data-champ="nombre" value="' + (l.nombre === null ? '' : l.nombre) + '">';
    } else {
      h += '<label class="sr-only" for="' + id + '">Valeur</label><input id="' + id + '" class="champ" type="text" data-champ="valeur" value="' + esc(l.valeur) + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">';
    }
    return h + '</div>' + (M().complete(l) ? '' : '<p class="petit rs-incomplete">Ligne incomplète : elle ne compte pas encore.</p>') + '</li>';
  }

  function resultatsHTML() {
    var res = M().rechercher(session.lignes, session.portee, aujourdhui());
    var actives = session.lignes.filter(M().complete).length;
    var h = '<p class="rs-compte">' + (actives ? pluriel(res.length, 'résultat') : 'Ajoutez un critère pour lancer la recherche.') + '</p><ul class="rs-liste">';
    res.forEach(function (el) {
      h += '<li class="rs-item">' + icone(el) + '<span class="rs-texte"><b>' + esc(el.nom) + '</b><small>' + esc((el.dossier || '—').replace(/\//g, ' › ')) +
        ' · modifié le ' + dateSuisse(M().dateDe(el, aujourdhui())) + '</small></span></li>';
    });
    return h + '</ul>';
  }

  function rechercheHTML() {
    var R = L();
    var h = '<div class="fx rs-fenetre"><div class="rs-portee"><span>' + esc(R.rechercher) + '</span>' +
      '<button type="button" class="rs-choix" data-portee="mac" aria-pressed="' + (session.portee === 'mac') + '">' + esc(R.ceMac) + '</button>' +
      '<button type="button" class="rs-choix" data-portee="' + DOSSIER_OUVERT + '" aria-pressed="' + (session.portee === DOSSIER_OUVERT) + '">« ' + DOSSIER_OUVERT + ' »</button></div>' +
      '<ul class="rs-lignes">' + session.lignes.map(ligneHTML).join('') + '</ul>' +
      '<button type="button" class="btn btn-secondaire rs-plus" data-action="ajouter"' + (session.reussie ? ' disabled' : '') + '>+ Ajouter un critère</button>' +
      '<div class="rs-resultats" aria-live="polite">' + resultatsHTML() + '</div></div>';
    return h;
  }

  function rafraichirResultats() {
    var z = racine.querySelector('.rs-resultats');
    if (z) z.innerHTML = resultatsHTML();
    if (!session.reussie && session.verif) { session.verif = null; var r = racine.querySelector('.zone-retour'); if (r) r.innerHTML = retourHTML(); }
  }

  /* ---------- Mission 10 : photos mystères ---------- */

  function photosHTML() {
    var h = '<ul class="rs-photos">';
    session.mission.photos.forEach(function (id) {
      var el = M().element(id);
      h += '<li class="carte rs-photo">' + MF.atelier.apercuSVG(el.apercu) + '<p class="rs-photo-nom"><b>' + esc(session.noms[id]) + '</b></p>' +
        '<div class="feuille-rangee"><button type="button" class="btn btn-secondaire" data-meta="' + id + '">Métadonnées</button>' +
        '<button type="button" class="btn btn-secondaire" data-renommer="' + id + '"' + (session.reussie ? ' disabled' : '') + '>Renommer</button></div></li>';
    });
    return h + '</ul><p class="fx-message" role="status">' + esc(session.message) + '</p>';
  }

  function feuilleHTML() {
    var f = session.feuille;
    if (!f) return '';
    var el = M().element(f.id), h;
    if (f.type === 'meta') {
      h = '<h2 id="feuille-titre">Métadonnées de la photo</h2>' + MF.atelier.apercuSVG(el.apercu) +
        '<dl class="fx-infos"><dt>Nom</dt><dd>' + esc(session.noms[f.id]) + '</dd><dt>Type</dt><dd>' + esc(window.LIBELLES_MACOS.types.jpg) + '</dd>' +
        '<dt>Lieu de prise de vue</dt><dd><b>' + esc(el.lieu) + '</b></dd></dl>' +
        '<p class="petit">Les métadonnées sont des informations enregistrées dans le fichier, en plus de l\'image.</p>' +
        '<button type="button" class="btn btn-secondaire btn-bloc" data-feuille="fermer">Fermer</button>';
    } else {
      var valeur = f.valeur !== undefined ? f.valeur : session.noms[f.id];
      h = '<h2 id="feuille-titre">Renommer « ' + esc(session.noms[f.id]) + ' »</h2>' +
        '<label class="etiquette" for="champ-nom">Nouveau nom</label>' +
        '<input id="champ-nom" class="champ" type="text" value="' + esc(valeur) + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done">' +
        (f.erreur ? '<p class="message message-faux" role="alert">✗ ' + esc(f.erreur) + '</p>' : '') +
        '<div class="feuille-rangee"><button type="button" class="btn btn-secondaire" data-feuille="fermer">Annuler</button><button type="button" class="btn" data-feuille="ok">OK</button></div>';
    }
    return '<div class="feuille-fond" data-feuille="fermer"></div><div class="feuille" role="dialog" aria-modal="true" aria-labelledby="feuille-titre">' + h + '</div>';
  }

  function validerNom(valeur) {
    var f = session.feuille, ancien = session.noms[f.id];
    var r = M().renommerPhoto(session.noms, f.id, valeur);
    if (!r.ok) { f.erreur = r.message; f.valeur = valeur; rendre(); return; }
    session.message = '✓ « ' + ancien + ' » s\'appelle maintenant « ' + session.noms[f.id] + ' ».';
    session.feuille = null;
    session.verif = null;
    rendre();
  }

  /* ---------- Écran de mission ---------- */

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
      h += '<div class="retour retour-faux"><p><span class="retour-icone" aria-hidden="true">✗</span> <b>Pas encore.</b> Modifiez votre recherche, puis vérifiez à nouveau. Rien n\'est perdu.</p>' + lignes + '</div>';
    }
    return h;
  }

  function rendre() {
    var el = racine, m = session.mission, k = session.k;
    var reste = m.indices.length - session.indices;
    var h = '<div class="jeu-entete"><a class="jeu-quitter" href="#/recherche" aria-label="Quitter la mission (vous pourrez la reprendre)">✕ Quitter</a>' +
      '<span class="jeu-compteur">' + (m.partieA ? 'Spotlight' : 'Mission ' + k + ' / ' + (missions().length - 1)) + '</span>' +
      '<span class="jeu-points">' + (session.indices ? pluriel(session.indices, 'indice') : '') + '</span></div>' +
      '<div class="page page-jeu"><h1 class="sr-only">Détective du Finder : ' + esc(m.titre) + '</h1>' +
      '<div class="carte carte-consigne"><p class="q-theme">' + esc(m.titre) + '</p><p class="consigne">' + esc(m.consigne) + '</p></div>' +
      (m.partieA ? spotlightHTML() : m.photos ? photosHTML() : rechercheHTML()) +
      '<div class="zone-retour" aria-live="polite">' + retourHTML() + '</div></div>';
    if (session.reussie) {
      h += '<div class="barre-action"><div class="barre-action-rangee"><a class="btn btn-secondaire" href="#/recherche">Missions</a>' +
        (k + 1 < missions().length ? '<button type="button" class="btn btn-bloc" data-action="suivante">Mission suivante</button>' : '<a class="btn btn-bloc" href="#/accueil">Accueil</a>') + '</div></div>';
    } else {
      h += '<div class="barre-action"><div class="barre-action-rangee">' +
        '<button type="button" class="btn btn-secondaire" data-action="indice"' + (reste ? '' : ' disabled') + '>' + (reste ? 'Indice (' + reste + ')' : 'Plus d\'indice') + '</button>' +
        (m.partieA ? '<span class="rs-attente btn-bloc">Touchez le bon résultat</span>' : '<button type="button" class="btn btn-bloc" data-action="verifier">' + (m.photos ? 'Vérifier les noms' : 'Vérifier ma recherche') + '</button>') + '</div></div>';
    }
    h += feuilleHTML();
    el.innerHTML = h;
    brancher(el);
  }

  function brancher(el) {
    function sur(sel, f) { el.querySelectorAll(sel).forEach(function (b) { b.addEventListener('click', function () { f(b); }); }); }
    sur('[data-action="verifier"]', verifier);
    sur('[data-action="indice"]', indice);
    sur('[data-action="suivante"]', function () { commencer(session.k + 1); });
    sur('[data-action="ajouter"]', function () {
      session.lignes.push(nouvelleLigne()); rendre();
      var s = el.querySelector('#crit-' + (session.lignes.length - 1)); if (s) s.focus();
    });
    sur('[data-moins]', function (b) { session.lignes.splice(Number(b.getAttribute('data-moins')), 1); session.verif = null; rendre(); });
    sur('[data-portee]', function (b) { session.portee = b.getAttribute('data-portee'); session.verif = null; rendre(); });
    sur('[data-ouvrir]', function (b) { ouvrirSpotlight(b.getAttribute('data-ouvrir')); });
    sur('[data-meta]', function (b) { session.feuille = { type: 'meta', id: b.getAttribute('data-meta') }; rendre(); });
    sur('[data-renommer]', function (b) { session.feuille = { type: 'nom', id: b.getAttribute('data-renommer') }; rendre(); });
    sur('[data-feuille="fermer"]', function () { session.feuille = null; rendre(); });
    sur('[data-feuille="ok"]', function () { validerNom(el.querySelector('#champ-nom').value); });

    el.querySelectorAll('.rs-ligne').forEach(function (li) {
      var l = session.lignes[Number(li.getAttribute('data-ligne'))];
      li.querySelectorAll('[data-champ]').forEach(function (c) {
        var champ = c.getAttribute('data-champ');
        var evenement = c.tagName === 'SELECT' ? 'change' : 'input';
        c.addEventListener(evenement, function () {
          if (champ === 'critere') { var n = nouvelleLigne(c.value); Object.keys(n).forEach(function (x) { l[x] = n[x]; }); rendre(); var s = el.querySelector('#' + c.id); if (s) s.focus(); return; }
          if (champ === 'operateur') { l.operateur = c.value; rendre(); var o = el.querySelector('#' + c.id); if (o) o.focus(); return; }
          l[champ] = champ === 'nombre' ? (c.value === '' ? null : Number(c.value)) : c.value;
          var p = li.querySelector('.rs-incomplete');
          if (M().complete(l) && p) p.remove();
          rafraichirResultats();
        });
      });
    });

    var spot = el.querySelector('#champ-spotlight');
    if (spot) {
      spot.addEventListener('input', function () {
        session.requete = spot.value;
        el.querySelector('.rs-liste').innerHTML = resultatsSpotlightHTML();
        el.querySelectorAll('[data-ouvrir]').forEach(function (b) { b.addEventListener('click', function () { ouvrirSpotlight(b.getAttribute('data-ouvrir')); }); });
      });
      spot.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); var r = M().spotlight(session.requete)[0]; if (r) ouvrirSpotlight(r.id); }
      });
    }
    var champ = el.querySelector('#champ-nom');
    if (champ) {
      champ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); validerNom(champ.value); } });
      champ.focus();
      if (session.feuille.valeur === undefined) champ.setSelectionRange(0, champ.value.lastIndexOf('.'));
    } else if (session.feuille) {
      var premier = el.querySelector('.feuille button'); if (premier) premier.focus();
    }
    var feuille = el.querySelector('.feuille');
    if (feuille) feuille.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { session.feuille = null; rendre(); } });
  }

  /* ---------- Liste des missions ---------- */

  function ecranChoix(el) {
    racine = el;
    var st = stats(), m = MF.progression.maitriseTheme('REC');
    var h = '<div class="page">' +
      '<p class="fil"><a href="#/accueil">‹ Accueil</a></p>' +
      '<h1>Détective du Finder</h1>' +
      '<p class="intro">Retrouvez des documents comme dans les exercices 4 et 5 : Spotlight, puis la recherche avancée du Finder (⌘ F) et l\'enquête des photos mystères.</p>' +
      '<p class="petit">La recherche avancée est une recréation simplifiée : les critères portent les noms des énoncés. Maîtrise de la recherche : ' + (m === null ? 'à découvrir' : m + ' %') + '.</p>';
    if (session && !session.reussie) {
      h += '<div class="carte carte-reprise"><p><b>Mission en cours</b> : ' + esc(session.mission.titre) + '.</p>' +
        '<button type="button" class="btn btn-bloc" data-action="reprendre">Reprendre la mission</button></div>';
    }
    h += '<ol class="liste-missions">';
    missions().forEach(function (mi, k) {
      var etoiles = st.records[mi.id];
      h += '<li><button type="button" class="carte carte-mission" data-mission="' + k + '">' +
        '<span class="mission-num" aria-hidden="true">' + (mi.partieA ? 'A' : k) + '</span>' +
        '<span class="mission-corps"><b>' + esc(mi.titre) + '</b><span class="petit">' + esc(mi.consigne) + '</span></span>' +
        '<span class="mission-etat">' + (etoiles === undefined ? '<span class="petit">À faire</span>' : ui().etoiles(etoiles, 14)) + '</span></button></li>';
    });
    h += '</ol><p class="petit">Étoiles : ★★★ sans indice, ★★ avec un indice, ★ avec le dernier indice. 100 points la première fois qu\'une mission est réussie.</p></div>';
    el.innerHTML = h;
    el.querySelectorAll('[data-mission]').forEach(function (b) { b.addEventListener('click', function () { commencer(Number(b.getAttribute('data-mission'))); }); });
    var r = el.querySelector('[data-action="reprendre"]');
    if (r) r.addEventListener('click', function () { ui().naviguer('#/recherche/mission'); });
  }

  function ecranMission(el) { racine = el; rendre(); }

  MF.recherche = {
    ecranChoix: ecranChoix,
    ecranMission: ecranMission,
    aUneMission: function () { return !!session; },
    /* Pour les tests automatiques uniquement. */
    _session: function () { return session; },
    _commencer: commencer
  };
})();
