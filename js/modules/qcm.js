/* Mission Finder — module « Quiz express » (QCM) et « Révision du jour ».
   - 10 questions (moins si le thème en compte moins), sans doublon : d'abord celles à revoir
     et celles jamais vues (boîtes de Leitner, js/leitner.js), puis les autres, au hasard.
   - Révision du jour : 5 à 10 questions choisies par js/leitner.js, tous thèmes mélangés.
   - Ordre des questions et des propositions mélangé à chaque partie (sauf Vrai/Faux).
   - 2 essais (1 seul pour Vrai/Faux). Après une 1re erreur : la réponse choisie est marquée,
     une phrase explique pourquoi elle est fausse, sans révéler la bonne.
   - Après le dernier essai : bonne réponse visible + explication. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = function () { return MF.ui; };

  var TAILLE_PARTIE = 10;
  var partie = null;
  var resultat = null;
  var racine = null;

  function questionsDuMode(mode) {
    return window.QUESTIONS.filter(function (q) { return mode === 'melange' || ui().themeDeObjectif(q.objectif) === mode; });
  }

  function nouvellePartie(mode) {
    var tirage = mode === 'revision' ? MF.leitner.tirageRevision()
      : mode === 'examen' ? MF.examen.tirageQcm()
      : MF.leitner.entrelacer(MF.leitner.prioriser(questionsDuMode(mode)).slice(0, TAILLE_PARTIE));
    partie = {
      mode: mode,
      items: tirage.map(function (q) {
        var ordre = q.propositions.map(function (_, i) { return i; });
        if (q.type !== 'vraifaux') ui().melanger(ordre);
        return { q: q, ordre: ordre, fin: null, premierChoix: null, phrase: '' };
      }),
      index: 0,
      essai: 1,
      statut: 'attente',          // attente | reessai | termine
      selection: [],
      desactivees: [],
      pointsBase: 0,
      bonus: 0,
      serie: 0,
      justes1: 0,
      niveauAvant: MF.progression.niveauPour(MF.stockage.etat().points).niveau
    };
    resultat = null;
  }

  function courant() { return partie.items[partie.index]; }

  function memeEnsemble(a, b) {
    if (a.length !== b.length) return false;
    var x = a.slice().sort(), y = b.slice().sort();
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }

  function texteBonnes(q) {
    return q.bonnes.map(function (i) { return q.propositions[i]; }).join(' ; ');
  }

  /* ---------- Actions ---------- */

  function choisir(indice) {
    if (partie.statut === 'termine' || partie.desactivees.indexOf(indice) >= 0) return;
    var q = courant().q;
    if (q.type === 'multiple') {
      var p = partie.selection.indexOf(indice);
      if (p >= 0) partie.selection.splice(p, 1); else partie.selection.push(indice);
    } else {
      partie.selection = [indice];
    }
    rendrePartie();
  }

  function valider() {
    if (!partie.selection.length || partie.statut === 'termine') return;
    var it = courant(), q = it.q;
    var juste = memeEnsemble(partie.selection, q.bonnes);
    var T = window.TEXTES;

    if (juste) {
      var pts = partie.essai === 1 ? 10 : 5, bonus = 0;
      if (partie.essai === 1) {
        partie.serie += 1;
        partie.justes1 += 1;
        if (partie.serie >= 2 && partie.bonus < 10) bonus = Math.min(2, 10 - partie.bonus);
      } else {
        partie.serie = 0;
      }
      partie.pointsBase += pts;
      partie.bonus += bonus;
      it.fin = { juste: true, pts: pts, bonus: bonus, choix: partie.selection.slice(), premierCoup: partie.essai === 1, serie: partie.serie };
      it.phrase = ui().auHasard(T.juste);
      MF.progression.enregistrerReponse(q, partie.essai === 1, pts + bonus);
      partie.statut = 'termine';
    } else if (partie.essai === 1 && q.type !== 'vraifaux') {
      partie.serie = 0;
      partie.essai = 2;
      it.premierChoix = partie.selection.slice();
      it.phrase = ui().auHasard(T.faux);
      partie.statut = 'reessai';
      if (q.type !== 'multiple') { partie.desactivees = partie.selection.slice(); partie.selection = []; }
    } else {
      partie.serie = 0;
      it.fin = { juste: false, pts: 0, bonus: 0, choix: partie.selection.slice(), premierCoup: false, serie: 0 };
      it.phrase = ui().auHasard(T.faux);
      MF.progression.enregistrerReponse(q, false, 0);
      partie.statut = 'termine';
    }
    rendrePartie();
    var zone = racine && racine.querySelector('.retour');
    if (zone && zone.scrollIntoView) zone.scrollIntoView({ block: 'nearest' });
  }

  function suivante() {
    if (partie.index + 1 >= partie.items.length) { terminer(); return; }
    partie.index += 1;
    partie.essai = 1;
    partie.statut = 'attente';
    partie.selection = [];
    partie.desactivees = [];
    rendrePartie();
    window.scrollTo(0, 0);
    var t = racine.querySelector('.q-enonce');
    if (t) t.focus({ preventScroll: true });
  }

  function terminer() {
    var n = partie.items.length;
    var taux = n ? partie.pointsBase / (10 * n) : 0;
    var etoiles = MF.progression.etoilesPour(taux);
    var total = partie.pointsBase + partie.bonus;
    var rec = MF.progression.terminerPartie('qcm', partie.mode, total, etoiles);
    var niv = MF.progression.niveauPour(MF.stockage.etat().points);
    resultat = {
      mode: partie.mode, n: n, total: total, pointsBase: partie.pointsBase, bonus: partie.bonus,
      justes1: partie.justes1, etoiles: etoiles, record: rec, niveauAvant: partie.niveauAvant, niveau: niv,
      aRevoir: partie.items.filter(function (it) { return it.fin && !it.fin.premierCoup; }).map(function (it) {
        var fichier = it.q.figure && it.q.figure.type === 'fichier' ? ' (' + it.q.figure.nom + ')' : '';
        return { enonce: it.q.enonce + fichier, bonne: texteBonnes(it.q), explication: it.q.explication };
      })
    };
    if (partie.mode === 'examen') MF.examen.finQcm(partie.items);
    partie = null;
    ui().remplacer('#/qcm/resultat');
  }

  /* ---------- Écran de choix du thème ---------- */

  function ecranChoix(el) {
    racine = el;
    var e = MF.stockage.etat();
    var act = e.activites.qcm || { parties: 0, etoilesMax: 0, records: {} };
    var h = '<div class="page">' +
      '<p class="fil"><a href="#/accueil">‹ Accueil</a></p>' +
      '<h1>Quiz express</h1>' +
      '<p class="intro">10 questions, environ 4 minutes : d\'abord celles à revoir et celles que vous n\'avez jamais vues. Deux essais par question (un seul pour les « Vrai ou faux »).</p>';
    if (act.parties > 0) h += '<p class="petit">Meilleur résultat : ' + ui().etoiles(act.etoilesMax) + '</p>';

    if (partie) {
      h += '<div class="carte carte-reprise"><p><b>Partie en cours</b> : ' + ui().esc(ui().nomTheme(partie.mode)) +
        ', question ' + (partie.index + 1) + ' sur ' + partie.items.length + '.</p>' +
        '<button type="button" class="btn btn-bloc" data-action="reprendre">Reprendre la partie</button></div>';
    }

    var modes = ['melange'].concat(window.OBJECTIFS.themes.map(function (t) { return t.code; }));
    h += '<h2 class="titre-section">Choisissez un thème</h2><ul class="liste-modes">';
    modes.forEach(function (m) {
      var nb = questionsDuMode(m).length;
      var record = act.records[m];
      var maitrise = m === 'melange' ? MF.progression.maitriseGlobale() : MF.progression.maitriseTheme(m);
      h += '<li><button type="button" class="carte carte-mode' + (m === 'melange' ? ' carte-mode-principal' : '') + '" data-mode="' + m + '"' + (nb ? '' : ' disabled') + '>' +
        '<span class="mode-nom">' + ui().esc(ui().nomTheme(m)) + '</span>' +
        '<span class="mode-info">' + Math.min(nb, TAILLE_PARTIE) + ' question' + (Math.min(nb, TAILLE_PARTIE) > 1 ? 's' : '') +
        (record !== undefined ? ' · record : ' + ui().points(record) : '') +
        ' · maîtrise : ' + (maitrise === null ? 'à découvrir' : maitrise + ' %') + '</span>' +
        '</button></li>';
    });
    h += '</ul></div>';
    el.innerHTML = h;

    el.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () { demarrer(b.getAttribute('data-mode')); });
    });
    var r = el.querySelector('[data-action="reprendre"]');
    if (r) r.addEventListener('click', function () { ui().naviguer('#/qcm/partie'); });
  }

  /* ---------- Écran de jeu ---------- */

  function etiquette(it, i) {
    // Renvoie { classe, texte } pour l'état visuel d'une proposition.
    var q = it.q, st = partie.statut;
    var bonne = q.bonnes.indexOf(i) >= 0;
    if (st === 'termine') {
      var choisie = it.fin.choix.indexOf(i) >= 0;
      if (bonne && choisie) return { classe: 'est-juste', texte: '✓ Votre réponse : juste' };
      if (bonne) return { classe: 'est-juste', texte: '✓ Bonne réponse' };
      if (choisie) return { classe: 'est-faux', texte: '✗ Votre réponse' };
      if (q.type !== 'multiple' && it.premierChoix && it.premierChoix.indexOf(i) >= 0) return { classe: 'est-faux', texte: '✗ Votre 1re réponse' };
      return { classe: 'est-neutre', texte: '' };
    }
    if (partie.desactivees.indexOf(i) >= 0) return { classe: 'est-faux', texte: '✗ Votre 1re réponse' };
    return { classe: '', texte: '' };
  }

  function retourHTML(it) {
    var q = it.q, T = window.TEXTES, h = '';
    if (partie.statut === 'reessai') {
      var expl = '';
      if (q.type !== 'multiple' && it.premierChoix && q.erreurs && q.erreurs[it.premierChoix[0]]) expl = q.erreurs[it.premierChoix[0]] + ' ';
      if (q.type === 'multiple') expl = 'Votre sélection n\'est pas tout à fait juste : il y a ' + q.bonnes.length + ' bonnes réponses. ';
      h = '<div class="retour retour-faux"><p><span class="retour-icone" aria-hidden="true">✗</span> <b>' + ui().esc(it.phrase) + '</b> ' +
        ui().esc(expl) + ui().esc(T.reessayer) + '</p></div>';
    } else if (partie.statut === 'termine') {
      var f = it.fin;
      if (f.juste) {
        var gain = '+' + f.pts + ' points' + (f.bonus ? ' · série de ' + f.serie + ' : +' + f.bonus : '');
        h = '<div class="retour retour-juste"><p><span class="retour-icone" aria-hidden="true">✓</span> <b>' + ui().esc(it.phrase) + '</b> <span class="gain">' + gain + '</span></p>' +
          '<p>' + ui().esc(q.explication) + '</p></div>';
      } else {
        var pourquoi = '';
        if (q.type !== 'multiple' && q.erreurs && q.erreurs[f.choix[0]]) pourquoi = '<p>' + ui().esc(q.erreurs[f.choix[0]]) + '</p>';
        h = '<div class="retour retour-faux"><p><span class="retour-icone" aria-hidden="true">✗</span> <b>' + ui().esc(it.phrase) + '</b> <span class="gain">0 point</span></p>' +
          '<p><b>Bonne réponse : ' + ui().esc(texteBonnes(q)) + '</b></p>' + pourquoi +
          '<p>' + ui().esc(q.explication) + '</p></div>';
      }
    }
    return h;
  }

  function rendrePartie() {
    var el = racine;
    var it = courant(), q = it.q, n = partie.items.length;
    var multiple = q.type === 'multiple';
    var pct = Math.round(100 * partie.index / n);
    var h = '<div class="jeu-entete"><a class="jeu-quitter" href="#/qcm" aria-label="Quitter la partie (vous pourrez la reprendre)">✕ Quitter</a>' +
      '<span class="jeu-compteur">Question ' + (partie.index + 1) + ' / ' + n + '</span>' +
      '<span class="jeu-points">' + ui().points(partie.pointsBase + partie.bonus) + '</span></div>' +
      '<div class="jeu-progression" aria-hidden="true"><div style="width:' + pct + '%"></div></div>' +
      '<div class="page page-jeu">' +
      '<h1 class="sr-only">Quiz express</h1>' +
      '<p class="q-theme">' + ui().esc(ui().nomTheme(ui().themeDeObjectif(q.objectif))) + '</p>' +
      '<p class="q-enonce" tabindex="-1">' + ui().esc(q.enonce) + '</p>' +
      (multiple ? '<p class="puce puce-multiple">Plusieurs réponses possibles</p>' : '') +
      (q.type === 'vraifaux' ? '<p class="puce">Un seul essai</p>' : '') +
      MF.figures.rendre(q.figure) +
      '<div class="propositions" role="group" aria-label="Propositions">';
    it.ordre.forEach(function (i) {
      var et = etiquette(it, i);
      var choisie = partie.selection.indexOf(i) >= 0;
      var inactive = partie.statut === 'termine' || partie.desactivees.indexOf(i) >= 0;
      h += '<button type="button" class="proposition ' + et.classe + (multiple ? ' est-case' : '') + '" data-i="' + i + '" aria-pressed="' + (choisie ? 'true' : 'false') + '"' + (inactive ? ' disabled' : '') + '>' +
        '<span class="prop-marque" aria-hidden="true"></span><span class="prop-texte">' + ui().esc(q.propositions[i]) + '</span>' +
        (et.texte ? '<span class="prop-etat">' + et.texte + '</span>' : '') + '</button>';
    });
    h += '</div><div class="zone-retour" aria-live="polite">' + retourHTML(it) + '</div></div>';

    var libelle, actif = true;
    if (partie.statut === 'termine') libelle = partie.index + 1 < n ? 'Question suivante' : 'Voir le résultat';
    else { libelle = 'Valider'; actif = partie.selection.length > 0; }
    h += '<div class="barre-action"><button type="button" class="btn btn-bloc" data-action="principal"' + (actif ? '' : ' disabled') + '>' + libelle + '</button></div>';
    el.innerHTML = h;

    el.querySelectorAll('.proposition').forEach(function (b) {
      b.addEventListener('click', function () { choisir(Number(b.getAttribute('data-i'))); });
    });
    el.querySelector('[data-action="principal"]').addEventListener('click', function () {
      if (partie.statut === 'termine') suivante(); else valider();
    });
  }

  function ecranPartie(el) {
    racine = el;
    rendrePartie();
  }

  /* ---------- Écran de résultat ---------- */

  function ecranResultat(el) {
    racine = el;
    var r = resultat;
    var h = '<div class="page">' +
      '<h1>Partie terminée</h1>' +
      '<div class="carte carte-resultat">' +
      '<p class="resultat-etoiles">' + ui().etoiles(r.etoiles, 40) + '</p>' +
      '<p class="resultat-score">' + ui().points(r.total) + '</p>' +
      '<p class="petit">' + (r.bonus ? 'dont bonus de série : +' + r.bonus + ' · ' : '') + 'justes du premier coup : ' + r.justes1 + ' / ' + r.n + '</p>';
    // Pas de record pour la Révision du jour : sa longueur varie (5 à 10 questions).
    if (r.mode !== 'revision' && r.mode !== 'examen') {
      if (r.record.nouveauRecord) h += '<p class="resultat-record">Nouveau record ! ' + (r.record.ancienRecord !== null ? '(ancien : ' + ui().points(r.record.ancienRecord) + ')' : '') + '</p>';
      else h += '<p class="petit">Votre record (' + ui().esc(ui().nomTheme(r.mode)) + ') : ' + ui().points(r.record.record) + '</p>';
    }
    if (r.niveau.niveau > r.niveauAvant) h += '<p class="resultat-niveau">Vous passez au niveau ' + r.niveau.niveau + ' : ' + ui().esc(r.niveau.nom) + ' !</p>';
    if (r.mode === 'revision') {
      var reste = MF.leitner.resume().aRevoir;
      h += '<p class="petit">' + (reste ? 'Encore ' + reste + ' question' + (reste > 1 ? 's' : '') + ' à revoir aujourd\'hui.' : '✓ Plus aucune question à revoir aujourd\'hui.') + '</p>';
    }
    h += '</div>';

    if (r.aRevoir.length) {
      h += '<h2 class="titre-section">À revoir</h2><ul class="liste-revoir">';
      r.aRevoir.forEach(function (x) {
        h += '<li class="carte"><p>' + ui().esc(x.enonce) + '</p><p><b>Réponse : ' + ui().esc(x.bonne) + '</b></p><p class="petit">' + ui().esc(x.explication) + '</p></li>';
      });
      h += '</ul>';
    } else {
      h += '<p class="intro">Toutes vos réponses étaient justes du premier coup.</p>';
    }
    if (r.mode === 'examen') {
      h += '<div class="boutons-fin"><a class="btn btn-bloc" href="#/examen">Continuer l\'examen blanc</a></div></div>';
      el.innerHTML = h;
      return;
    }
    h += '<div class="boutons-fin"><button type="button" class="btn btn-bloc" data-action="rejouer">' +
      (r.mode === 'revision' ? 'Nouvelle révision' : 'Rejouer (' + ui().esc(ui().nomTheme(r.mode)) + ')') + '</button>' +
      '<a class="btn btn-secondaire btn-bloc" href="#/qcm">Choisir un autre thème</a>' +
      '<a class="btn btn-secondaire btn-bloc" href="#/accueil">Accueil</a></div></div>';
    el.innerHTML = h;
    el.querySelector('[data-action="rejouer"]').addEventListener('click', function () { demarrer(r.mode); });
  }

  /* Lance une partie (mode : « melange », code d'un thème ou « revision »). */
  function demarrer(mode) {
    nouvellePartie(mode);
    ui().naviguer('#/qcm/partie');
  }

  MF.qcm = {
    demarrer: demarrer,
    ecranChoix: ecranChoix,
    ecranPartie: ecranPartie,
    ecranResultat: ecranResultat,
    aUnePartie: function () { return !!partie; },
    aUnResultat: function () { return !!resultat; },
    /* Pour les tests automatiques uniquement. */
    _etat: function () { return partie; }
  };
})();
