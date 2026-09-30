/* Mission Finder — module « Visite du Mac » (le Bureau de macOS).
   Une partie = 10 étapes sur un Bureau simulé (recréation simplifiée, aucun logo) :
   - 3 × « Touchez … » (légende a–f du tutoriel) ;
   - 2 × « Comment s'appelle l'élément entouré ? » ;
   - 2 × « Quelle est l'application active ? » (Bureaux tirés au hasard) ;
   - 2 × « Touchez toutes les applications ouvertes » (point sous l'icône) ;
   - 1 × Spotlight : ouvrir le Finder (loupe, écrire « Finder », toucher le bon résultat).
   Deux essais par étape, mêmes points que le Quiz express (js/partie.js).
   On touche, on ne glisse jamais ; rien ne dépend du survol. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = function () { return MF.ui; };
  var B = function () { return window.BUREAU; };

  var partie = null, resultat = null, racine = null;

  /* ---------- Données ---------- */

  function element(id) { return B().elements.filter(function (e) { return e.id === id; })[0]; }
  function application(nom) {
    return B().applications.filter(function (a) { return a.nom === nom; })[0] || { nom: nom, abr: nom.slice(0, 2), couleur: '#5F6B73' };
  }

  /* Bureau tiré au hasard : le Finder + 3 applications ; le Finder et 1 ou 2 autres sont ouvertes. */
  function genererBureau(activeAutreQueFinder) {
    var autres = ui().melanger(B().applications.filter(function (a) { return a.nom !== 'Finder'; })).slice(0, 3);
    var ouvertes = ['Finder'].concat(ui().melanger(autres.slice()).slice(0, 1 + Math.floor(Math.random() * 2)).map(function (a) { return a.nom; }));
    var candidates = activeAutreQueFinder ? ouvertes.slice(1) : ouvertes;
    return { apps: [application('Finder')].concat(autres), ouvertes: ouvertes, active: ui().auHasard(candidates) };
  }

  /* Zones d'un Bureau simulé et éléments de la légende auxquels elles appartiennent. */
  var APPARTIENT = {
    pomme: ['pomme', 'barre'], barre: ['barre'], loupe: ['barre'], disque: ['disque'], fond: [],
    dock: ['dock'], app: ['dock'], depart: ['depart', 'dock'], corbeille: ['corbeille', 'dock']
  };

  function description(zone, nomApp) {
    if (zone === 'app') return 'l\'application ' + nomApp + ', dans le Dock';
    if (zone === 'loupe') return 'la loupe de Spotlight, dans la barre des menus';
    if (zone === 'fond') return 'le fond du Bureau';
    return element(zone).touche;
  }

  /* ---------- Dessins (génériques) ---------- */

  var SVG = {
    loupe: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="6" fill="none" stroke="#1d1d1f" stroke-width="2"/><path d="M14.5 14.5l5 5" stroke="#1d1d1f" stroke-width="2.4" stroke-linecap="round"/></svg>',
    disque: '<svg viewBox="0 0 48 40" width="48" height="40" aria-hidden="true" focusable="false"><rect x="3" y="6" width="42" height="28" rx="5" fill="#D5D9DE" stroke="#8C9197" stroke-width="1.5"/><rect x="3" y="23" width="42" height="11" rx="4" fill="#AEB4BB"/><circle cx="38" cy="28.5" r="2" fill="#3FA34D"/></svg>',
    depart: '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="16" fill="#2F80ED"/><ellipse cx="20" cy="20" rx="7" ry="16" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity=".85"/><path d="M4 20h32M7 12h26M7 28h26" stroke="#FFFFFF" stroke-width="1.5" opacity=".85"/></svg>',
    corbeille: '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" focusable="false"><path d="M11 12h18l-2 23H13z" fill="#EEF0F3" stroke="#7D838A" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 12h22" stroke="#7D838A" stroke-width="2" stroke-linecap="round"/><path d="M16 16v15M20 16v15M24 16v15" stroke="#A7ADB4" stroke-width="1.3"/></svg>'
  };

  function iconeApp(a, taille) {
    taille = taille || 34;
    return '<svg viewBox="0 0 36 36" width="' + taille + '" height="' + taille + '" aria-hidden="true" focusable="false">' +
      '<rect x="1" y="1" width="34" height="34" rx="8" fill="' + ui().esc(a.couleur) + '"/>' +
      '<text x="18" y="23.5" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">' + ui().esc(a.abr) + '</text></svg>';
  }

  /* Bureau simulé.
     opts : { interactif: 'tout' | 'apps' | 'aucun', marques: { zone: 'entoure' | 'juste' | 'faux' | 'choisie' },
              spotlight: { requete, marques: { nom: 'juste' | 'faux' } } | null, active: nom affiché en gras } */
  function scene(bur, opts) {
    var esc = ui().esc, m = opts.marques || {};
    function cl(zone) { return m[zone] ? ' est-marque-' + m[zone] : ''; }
    function bouton(zone, classe, label, contenu, attrs) {
      var actif = opts.interactif === 'tout' || (opts.interactif === 'apps' && zone === 'app');
      return '<button type="button" class="' + classe + '" data-zone="' + zone + '" aria-label="' + esc(label) + '"' + (attrs || '') + (actif ? '' : ' disabled tabindex="-1"') + '>' + (contenu || '') + '</button>';
    }
    var active = opts.active || bur.active;
    var menus = active === 'Finder' ? B().menusFinder : B().menusAutres;
    var h = '<div class="mac">' +
      '<div class="mac-barre' + cl('barre') + '">' +
      bouton('barre', 'mac-fond', 'Barre en haut de l\'écran') +
      bouton('pomme', 'mac-pomme' + cl('pomme'), 'Petite icône tout en haut à gauche',
        '<svg viewBox="0 0 18 22" width="17" height="20" aria-hidden="true" focusable="false">' + MF.figures.POMME + '</svg>') +
      '<span class="mac-nomapp">' + esc(active) + '</span><span class="mac-menus">' +
      menus.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</span>' +
      bouton('loupe', 'mac-loupe' + cl('loupe'), 'Loupe, en haut à droite', SVG.loupe) +
      '</div>' +
      '<div class="mac-bureau' + (opts.spotlight ? ' est-spotlight' : '') + '">' +
      bouton('fond', 'mac-fond', 'Fond du Bureau') +
      bouton('disque', 'mac-disque' + cl('disque'), 'Icône en haut à droite du Bureau', SVG.disque + '<span>DISQUE</span>');
    if (opts.spotlight) h += panneauSpotlight(opts.spotlight);
    h += '</div><div class="mac-dock' + cl('dock') + '">' + bouton('dock', 'mac-fond', 'Barre d\'icônes en bas de l\'écran');
    bur.apps.forEach(function (a) {
      var ouverte = bur.ouvertes.indexOf(a.nom) >= 0;
      h += bouton('app', 'mac-app' + cl('app:' + a.nom), 'Icône ' + a.nom + (ouverte ? ', avec un point dessous' : ''),
        iconeApp(a) + '<span class="mac-point' + (ouverte ? ' est-ouverte' : '') + '"></span><span class="mac-app-nom">' + esc(a.nom) + '</span>',
        ' data-app="' + esc(a.nom) + '" aria-pressed="' + (m['app:' + a.nom] === 'choisie') + '"');
    });
    h += '<span class="mac-sep" aria-hidden="true"></span>' +
      bouton('depart', 'mac-icone' + cl('depart'), 'Avant-dernière icône de la barre du bas', SVG.depart) +
      bouton('corbeille', 'mac-icone' + cl('corbeille'), 'Dernière icône de la barre du bas', SVG.corbeille) +
      '</div></div>';
    return h;
  }

  function resultatsSpotlight(requete) {
    var norm = function (t) { return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
    var r = norm(requete.trim());
    if (!r) return [];
    return B().spotlight.resultats.filter(function (x) { return norm(x.nom).indexOf(r) >= 0; })
      .sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); });
  }

  function listeResultats(sp) {
    var esc = ui().esc, res = resultatsSpotlight(sp.requete), h = '';
    res.forEach(function (x) {
      var icone = x.genre === 'Application' ? iconeApp(application(x.nom), 26)
        : '<span class="mac-doc">' + (x.genre === 'Dossier' ? MF.figures.mini('dossier') : MF.figures.iconeFichier(x.nom)) + '</span>';
      var marque = sp.marques && sp.marques[x.nom] ? ' est-marque-' + sp.marques[x.nom] : '';
      h += '<li><button type="button" class="mac-resultat' + marque + '" data-resultat="' + esc(x.nom) + '"' + (sp.inactif ? ' disabled' : '') + '>' + icone +
        '<span class="mac-res-texte"><b>' + esc(x.nom) + '</b><small>' + esc(x.genre) + '</small></span></button></li>';
    });
    if (!res.length && sp.requete.trim()) h = '<li class="mac-aucun">Aucun résultat</li>';
    return h;
  }

  function panneauSpotlight(sp) {
    return '<div class="mac-spotlight"><label class="mac-champ">' + SVG.loupe +
      '<span class="sr-only">Recherche</span><input type="text" id="champ-spotlight" value="' + ui().esc(sp.requete) + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go"' + (sp.inactif ? ' disabled' : '') + '></label>' +
      '<ul class="mac-resultats" aria-live="polite">' + listeResultats(sp) + '</ul></div>';
  }

  /* ---------- Partie ---------- */

  function item(type, q, extra) {
    var it = { type: type, q: q, choix: null, desactivees: [], selection: [], marques: {} };
    Object.keys(extra || {}).forEach(function (k) { it[k] = extra[k]; });
    return it;
  }

  function nouvellePartie() {
    var els = B().elements.map(function (e) { return { id: 'vis-t-' + e.id, objectif: 'BUR1', e: e }; });
    var aToucher = MF.leitner.prioriser(els).slice(0, 3).map(function (x) { return x.e; });
    var restants = B().elements.filter(function (e) { return aToucher.indexOf(e) < 0; })
      .map(function (e) { return { id: 'vis-n-' + e.id, objectif: 'BUR1', e: e }; });
    var aNommer = MF.leitner.prioriser(restants).slice(0, 2).map(function (x) { return x.e; });
    var items = [];
    aToucher.forEach(function (e) {
      items.push(item('toucher', { id: 'vis-t-' + e.id, objectif: 'BUR1', enonce: e.consigne, bonne: e.nom, explication: e.explication },
        { cible: e, bureau: genererBureau() }));
    });
    aNommer.forEach(function (e) {
      var autres = ui().melanger(B().elements.filter(function (x) { return x !== e; })).slice(0, 3);
      items.push(item('nommer', { id: 'vis-n-' + e.id, objectif: 'BUR1', enonce: 'Comment s\'appelle l\'élément entouré sur le Bureau ?', bonne: e.nom, explication: e.explication },
        { cible: e, bureau: genererBureau(), propositions: ui().melanger([e].concat(autres)) }));
    });
    for (var k = 0; k < 2; k++) {
      var b1 = genererBureau();
      items.push(item('active', { id: 'vis-actif', objectif: 'BUR2', enonce: 'Quelle est l\'application active ?', bonne: b1.active,
        explication: 'L\'application active est celle dont le nom apparaît en gras à côté du menu Pomme : ici, ' + b1.active + '.' },
        { bureau: b1, propositions: ui().melanger(b1.apps.slice()) }));
      var b2 = genererBureau();
      items.push(item('ouvertes', { id: 'vis-ouvertes', objectif: 'BUR3', enonce: 'Touchez toutes les applications ouvertes, puis « Valider ».', bonne: b2.ouvertes.join(', '),
        explication: 'Un petit point sous l\'icône indique qu\'une application est ouverte : ici, ' + b2.ouvertes.join(', ') + '.' },
        { bureau: b2 }));
    }
    items.push(item('spotlight', { id: 'vis-spotlight', objectif: 'BUR4', enonce: 'Avec Spotlight, ouvrez le Finder.',
      bonne: 'la loupe en haut à droite (ou ⌘ Espace), écrire « Finder », puis toucher l\'application Finder',
      explication: 'Spotlight s\'ouvre avec la loupe en haut à droite de l\'écran (ou ⌘ Espace) : écrivez « Finder », puis touchez l\'application dans les résultats.' },
      { bureau: genererBureau(true), etape: 'bureau', requete: '' }));
    partie = MF.partie.nouvelle('bureau', 'visite', items);
    resultat = null;
  }

  function demarrer() {
    nouvellePartie();
    ui().naviguer('#/bureau/partie');
  }

  function courant() { return MF.partie.courant(partie); }

  function apresReponse(etat) {
    rendrePartie();
    var zone = racine && racine.querySelector('.retour');
    if (zone && zone.scrollIntoView) zone.scrollIntoView({ block: 'nearest' });
    return etat;
  }

  /* L'élève touche une zone du Bureau simulé. */
  function toucherZone(zone, nomApp) {
    var it = courant();
    if (partie.statut === 'termine') return;
    if (it.type === 'toucher') {
      var juste = APPARTIENT[zone].indexOf(it.cible.id) >= 0;
      it.pourquoi = juste ? '' : 'Vous avez touché ' + description(zone, nomApp) + '.';
      it.marques = {};
      if (!juste) it.marques[zone === 'app' ? 'app:' + nomApp : zone] = 'faux';
      if (MF.partie.noter(partie, juste) === 'faux') it.marques[it.cible.id] = 'juste';
      apresReponse();
    } else if (it.type === 'ouvertes' && zone === 'app') {
      var p = it.selection.indexOf(nomApp);
      if (p >= 0) it.selection.splice(p, 1); else it.selection.push(nomApp);
      rendrePartie();
    } else if (it.type === 'spotlight' && it.etape === 'bureau') {
      it.info = '';
      if (zone === 'loupe') { it.etape = 'recherche'; rendrePartie(); focusChamp(); return; }
      if (zone === 'app' && nomApp === 'Finder') { it.info = 'Le Finder s\'ouvrirait aussi depuis le Dock, mais ici, utilisez Spotlight.'; rendrePartie(); return; }
      it.pourquoi = 'Vous avez touché ' + description(zone, nomApp) + ' : ce n\'est pas Spotlight.';
      it.marques = {}; it.marques[zone === 'app' ? 'app:' + nomApp : zone] = 'faux';
      if (MF.partie.noter(partie, false) === 'faux') { it.marques = { loupe: 'juste' }; it.etape = 'fini'; }
      apresReponse();
    }
  }

  /* Spotlight : l'élève ouvre un résultat. */
  function ouvrirResultat(nom) {
    var it = courant();
    if (partie.statut === 'termine' || it.etape !== 'recherche') return;
    var x = B().spotlight.resultats.filter(function (r) { return r.nom === nom; })[0];
    var juste = x.nom === B().spotlight.cible && x.genre === 'Application';
    it.marquesSpot = {};
    if (juste) {
      MF.partie.noter(partie, true);
      it.etape = 'fini';
      it.ouvert = true;
      it.marques = {};
    } else {
      it.pourquoi = '« ' + x.nom + ' » est ' + (x.genre === 'Document' ? 'un document' : x.genre === 'Dossier' ? 'un dossier' : 'une autre application') + ', pas l\'application Finder.';
      it.marquesSpot[x.nom] = 'faux';
      if (MF.partie.noter(partie, false) === 'faux') { it.marquesSpot[B().spotlight.cible] = 'juste'; it.etape = 'fini'; it.requete = B().spotlight.cible; }
    }
    apresReponse();
  }

  function focusChamp() {
    var c = racine.querySelector('#champ-spotlight');
    if (c) c.focus();
  }

  function valider() {
    var it = courant();
    if (partie.statut === 'termine') return;
    if (it.type === 'nommer' || it.type === 'active') {
      if (!it.choix) return;
      var bon = it.type === 'nommer' ? it.choix === it.cible : it.choix.nom === it.bureau.active;
      if (!bon) {
        if (it.type === 'nommer') it.pourquoi = it.choix.ou;
        else it.pourquoi = it.bureau.ouvertes.indexOf(it.choix.nom) >= 0
          ? '« ' + it.choix.nom + ' » est ouverte (point sous son icône), mais son nom n\'est pas en gras dans la barre des menus.'
          : '« ' + it.choix.nom + ' » n\'est pas ouverte : pas de point sous son icône.';
      } else it.pourquoi = '';
      if (MF.partie.noter(partie, bon) === 'reessai') { it.desactivees.push(it.choix); it.choix = null; }
      apresReponse();
    } else if (it.type === 'ouvertes') {
      if (!it.selection.length) return;
      var ouv = it.bureau.ouvertes;
      var enTrop = it.selection.filter(function (n) { return ouv.indexOf(n) < 0; });
      var manque = ouv.filter(function (n) { return it.selection.indexOf(n) < 0; }).length;
      var juste = !enTrop.length && !manque;
      var msg = enTrop.length ? '« ' + enTrop[0] + ' » n\'est pas ouverte : pas de point sous son icône.' : '';
      if (manque) msg += (msg ? ' ' : '') + 'Il manque ' + manque + ' application' + (manque > 1 ? 's' : '') + ' ouverte' + (manque > 1 ? 's' : '') + '.';
      it.pourquoi = juste ? '' : msg;
      MF.partie.noter(partie, juste);
      apresReponse();
    }
  }

  function suivante() {
    if (!MF.partie.suivante(partie)) { resultat = MF.partie.terminer(partie); partie = null; ui().remplacer('#/bureau/resultat'); return; }
    rendrePartie();
    window.scrollTo(0, 0);
    var t = racine.querySelector('.q-enonce');
    if (t) t.focus({ preventScroll: true });
  }

  /* ---------- Affichage ---------- */

  function propositionsHTML(it, textes, bonneIndex) {
    var fini = partie.statut === 'termine', h = '<div class="propositions" role="group" aria-label="Propositions">';
    it.propositions.forEach(function (p, i) {
      var bonne = i === bonneIndex, choisie = it.choix === p, desact = it.desactivees.indexOf(p) >= 0, classe = '', etat = '';
      if (fini) {
        if (bonne) { classe = 'est-juste'; etat = choisie ? '✓ Votre réponse : juste' : '✓ Bonne réponse'; }
        else if (choisie) { classe = 'est-faux'; etat = '✗ Votre réponse'; }
        else if (desact) { classe = 'est-faux'; etat = '✗ Votre 1re réponse'; }
        else classe = 'est-neutre';
      } else if (desact) { classe = 'est-faux'; etat = '✗ Votre 1re réponse'; }
      h += '<button type="button" class="proposition ' + classe + '" data-i="' + i + '" aria-pressed="' + choisie + '"' + (fini || desact ? ' disabled' : '') + '>' +
        '<span class="prop-marque" aria-hidden="true"></span><span class="prop-texte">' + ui().esc(textes[i]) + '</span>' +
        (etat ? '<span class="prop-etat">' + etat + '</span>' : '') + '</button>';
    });
    return h + '</div>';
  }

  function descriptionScene(bur, active) {
    return 'Bureau simulé. Barre des menus : « ' + active + ' » en gras. Dock : ' +
      bur.apps.map(function (a) { return a.nom + (bur.ouvertes.indexOf(a.nom) >= 0 ? ' (avec un point)' : ''); }).join(', ') +
      ', puis le Dossier de départ et la Corbeille. Sur le Bureau : l\'icône « DISQUE ».';
  }

  function rendrePartie() {
    var el = racine, it = courant(), esc = ui().esc;
    var fini = partie.statut === 'termine';
    var h = MF.partie.entete(partie, '#/bureau', 'Visite du Mac') + '<div class="page page-jeu">' +
      '<p class="q-theme">Le Bureau de macOS</p>' +
      '<p class="q-enonce" tabindex="-1">' + esc(it.q.enonce) + '</p>';
    var barre = '', details = { pourquoi: it.pourquoi };

    if (it.type === 'toucher') {
      h += scene(it.bureau, { interactif: fini ? 'aucun' : 'tout', marques: it.marques });
    } else if (it.type === 'nommer') {
      var m = {}; m[it.cible.id] = fini ? 'juste' : 'entoure';
      h += '<div role="img" aria-label="Bureau simulé : un élément est entouré (légende ' + it.cible.lettre + ' du tutoriel).">' +
        '<div aria-hidden="true">' + scene(it.bureau, { interactif: 'aucun', marques: m }) + '</div></div>' +
        propositionsHTML(it, it.propositions.map(function (e) { return e.nom; }), it.propositions.indexOf(it.cible));
      barre = fini ? '' : MF.partie.barreAction('Valider', !!it.choix);
    } else if (it.type === 'active') {
      h += '<div role="img" aria-label="' + esc(descriptionScene(it.bureau, it.bureau.active)) + '"><div aria-hidden="true">' +
        scene(it.bureau, { interactif: 'aucun' }) + '</div></div>' +
        propositionsHTML(it, it.propositions.map(function (a) { return a.nom; }), it.propositions.map(function (a) { return a.nom; }).indexOf(it.bureau.active));
      barre = fini ? '' : MF.partie.barreAction('Valider', !!it.choix);
    } else if (it.type === 'ouvertes') {
      var marques = {};
      it.selection.forEach(function (n) { marques['app:' + n] = 'choisie'; });
      if (fini) {
        marques = {};
        it.bureau.apps.forEach(function (a) {
          var ouverte = it.bureau.ouvertes.indexOf(a.nom) >= 0, choisie = it.selection.indexOf(a.nom) >= 0;
          if (ouverte) marques['app:' + a.nom] = 'juste'; else if (choisie) marques['app:' + a.nom] = 'faux';
        });
      }
      h += '<p class="petit">Touchez une icône pour la choisir ; touchez-la à nouveau pour annuler.</p>' +
        scene(it.bureau, { interactif: fini ? 'aucun' : 'apps', marques: marques });
      barre = fini ? '' : MF.partie.barreAction('Valider', it.selection.length > 0);
    } else if (it.type === 'spotlight') {
      var sp = it.etape === 'recherche' || (it.etape === 'fini' && it.marquesSpot && !it.ouvert)
        ? { requete: it.requete, marques: it.marquesSpot, inactif: fini } : null;
      h += scene(it.bureau, {
        interactif: fini || it.etape !== 'bureau' ? 'aucun' : 'tout',
        marques: it.etape === 'bureau' || !sp ? it.marques : {},
        spotlight: sp,
        active: it.ouvert ? 'Finder' : it.bureau.active
      });
      if (it.info) h += '<p class="info">' + esc(it.info) + '</p>';
      if (it.etape === 'recherche' && !fini) h += '<p class="petit">Écrivez dans le champ de recherche, puis touchez le bon résultat.</p>';
      if (it.ouvert) details.explication = 'Le Finder est maintenant l\'application active : son nom apparaît en gras dans la barre des menus.';
    }

    h += '<div class="zone-retour" aria-live="polite">' + MF.partie.retour(partie, details) + '</div></div>';
    if (fini) barre = MF.partie.barreAction(partie.index + 1 < partie.items.length ? 'Étape suivante' : 'Voir le résultat', true);
    h += barre;
    el.innerHTML = h;

    el.querySelectorAll('.mac [data-zone]').forEach(function (b) {
      b.addEventListener('click', function () { toucherZone(b.getAttribute('data-zone'), b.getAttribute('data-app')); });
    });
    el.querySelectorAll('.proposition').forEach(function (b) {
      b.addEventListener('click', function () { if (partie.statut !== 'termine') { it.choix = it.propositions[Number(b.getAttribute('data-i'))]; rendrePartie(); } });
    });
    var champ = el.querySelector('#champ-spotlight');
    if (champ) {
      champ.addEventListener('input', function () {
        it.requete = champ.value;
        el.querySelector('.mac-resultats').innerHTML = listeResultats({ requete: it.requete, marques: it.marquesSpot });
        brancherResultats();
      });
      champ.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); var r = resultatsSpotlight(it.requete)[0]; if (r) ouvrirResultat(r.nom); }
      });
    }
    function brancherResultats() {
      el.querySelectorAll('[data-resultat]').forEach(function (b) {
        b.addEventListener('click', function () { ouvrirResultat(b.getAttribute('data-resultat')); });
      });
    }
    brancherResultats();
    var principal = el.querySelector('[data-action="principal"]');
    if (principal) principal.addEventListener('click', function () { if (partie.statut === 'termine') suivante(); else valider(); });
  }

  /* ---------- Écrans ---------- */

  function ecranChoix(el) {
    racine = el;
    var e = MF.stockage.etat();
    var act = e.activites.bureau || { parties: 0, etoilesMax: 0, records: {} };
    var m = MF.progression.maitriseTheme('BUR');
    var h = '<div class="page">' +
      '<p class="fil"><a href="#/accueil">‹ Accueil</a></p>' +
      '<h1>Visite du Mac</h1>' +
      '<p class="intro">10 étapes sur un Bureau de Mac simulé, environ 4 minutes : touchez les éléments demandés, trouvez l\'application active et les applications ouvertes, puis ouvrez le Finder avec Spotlight.</p>' +
      '<p class="petit">' + (act.parties ? 'Meilleur résultat : ' + ui().etoiles(act.etoilesMax) + (act.records.visite !== undefined ? ' · record : ' + ui().points(act.records.visite) : '') + ' · ' : '') +
      'maîtrise du Bureau : ' + (m === null ? 'à découvrir' : m + ' %') + '</p>';
    if (partie) {
      h += '<div class="carte carte-reprise"><p><b>Partie en cours</b> : étape ' + (partie.index + 1) + ' sur ' + partie.items.length + '.</p>' +
        '<button type="button" class="btn btn-bloc" data-action="reprendre">Reprendre la partie</button></div>';
    }
    h += '<button type="button" class="btn btn-bloc" data-action="commencer">' + (partie ? 'Nouvelle partie' : 'Commencer une partie') + '</button>' +
      '<p class="petit note-simulation">Le Bureau est une recréation simplifiée : les applications sont des carrés de couleur avec une abréviation, sans logo.</p></div>';
    el.innerHTML = h;
    el.querySelector('[data-action="commencer"]').addEventListener('click', demarrer);
    var r = el.querySelector('[data-action="reprendre"]');
    if (r) r.addEventListener('click', function () { ui().naviguer('#/bureau/partie'); });
  }

  function ecranPartie(el) { racine = el; rendrePartie(); }

  function ecranResultat(el) {
    racine = el;
    MF.partie.ecranResultat(el, resultat, { titre: 'Visite du Mac', rejouer: demarrer, retour: '#/bureau', libelleRetour: 'Retour à la Visite du Mac' });
  }

  MF.bureau = {
    ecranChoix: ecranChoix,
    ecranPartie: ecranPartie,
    ecranResultat: ecranResultat,
    demarrer: demarrer,
    aUnePartie: function () { return !!partie; },
    aUnResultat: function () { return !!resultat; },
    /* Pour les tests automatiques uniquement. */
    _etat: function () { return partie; },
    _resultatsSpotlight: resultatsSpotlight
  };
})();
