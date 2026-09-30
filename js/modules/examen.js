/* Mission Finder — « Examen blanc » (phase 7). Sans chronomètre (décision de l'enseignant).
   Trois parties, dans l'ordre voulu par l'élève :
   1. 20 questions du Quiz express : au moins une par objectif (19), plus une au hasard ;
   2. une mission courte du Grand rangement (doublons, noms explicites ou compression) ;
   3. une mission du Détective du Finder (recherche à deux critères).
   Bilan final par thème, avec une recommandation et un bouton vers l'entraînement correspondant.
   Note : question juste du premier coup = 1 ; mission réussie sans indice = 1, avec indice = 0,5 ; sinon 0. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = function () { return MF.ui; };

  var MISSIONS_RANGEMENT = ['m6', 'm7', 'm8'];
  var MISSIONS_RECHERCHE = ['s3', 's4', 's6', 's7', 's9'];
  var ACTIVITE_DU_THEME = { BUR: ['#/bureau', 'Visite du Mac'], RAC: ['#/clavier', 'Clavier secret'], FIN: ['#/atelier', 'Le grand rangement'], REC: ['#/recherche', 'Détective du Finder'] };

  var examen = null;

  function nouveau() {
    var kR = window.ATELIER.missions.map(function (m) { return m.id; }).indexOf(ui().auHasard(MISSIONS_RANGEMENT));
    var kD = window.RECHERCHE.missions.map(function (m) { return m.id; }).indexOf(ui().auHasard(MISSIONS_RECHERCHE));
    examen = { qcm: null, rangement: null, recherche: null, kRangement: kR, kRecherche: kD, bilan: null };
  }

  /* L'examen blanc apparaît quand chaque activité a été jouée au moins une fois. */
  function activitesJouees() {
    var a = MF.stockage.etat().activites;
    return ['qcm', 'raccourcis', 'bureau', 'finder', 'recherche'].filter(function (x) { return a[x] && a[x].parties > 0; }).length;
  }
  function disponible() { return activitesJouees() === 5; }

  /* ---------- Liens avec les autres modules ---------- */

  function tirageQcm() {
    var choix = [];
    window.OBJECTIFS.liste.forEach(function (o) {
      var qs = window.QUESTIONS.filter(function (q) { return q.objectif === o.code; });
      if (qs.length) choix.push(ui().auHasard(qs));
    });
    var reste = ui().melanger(window.QUESTIONS.filter(function (q) { return choix.indexOf(q) < 0; }));
    while (choix.length < 20 && reste.length) choix.push(reste.shift());
    return MF.leitner.entrelacer(choix);
  }

  function finQcm(items) {
    if (!examen) nouveau();
    examen.qcm = items.map(function (it) { return { objectif: it.q.objectif, juste: it.fin && it.fin.premierCoup ? 1 : 0 }; });
  }

  function finMission(partie, res) {
    if (!examen) return;
    examen[partie] = { reussi: res.reussi, indices: res.indices || 0 };
  }

  function note(m) { return !m || !m.reussi ? 0 : m.indices ? 0.5 : 1; }

  /* ---------- Bilan ---------- */

  function calculerBilan() {
    var par = {};
    window.OBJECTIFS.themes.forEach(function (t) { par[t.code] = { s: 0, n: 0 }; });
    examen.qcm.forEach(function (x) { var t = ui().themeDeObjectif(x.objectif); par[t].s += x.juste; par[t].n += 1; });
    par.FIN.s += note(examen.rangement); par.FIN.n += 1;
    par.REC.s += note(examen.recherche); par.REC.n += 1;
    var total = 0, n = 0, themes = [];
    Object.keys(par).forEach(function (c) {
      total += par[c].s; n += par[c].n;
      themes.push({ code: c, pct: par[c].n ? Math.round(100 * par[c].s / par[c].n) : null });
    });
    var pct = Math.round(100 * total / n);
    var faible = themes.filter(function (t) { return t.pct !== null; }).sort(function (a, b) { return a.pct - b.pct; })[0];
    var etoiles = MF.progression.etoilesPour(pct / 100);
    var rec = MF.progression.terminerPartie('examen', 'blanc', pct, etoiles);
    return { pct: pct, etoiles: etoiles, themes: themes, faible: faible, record: rec };
  }

  /* ---------- Écrans ---------- */

  function statut(partie) {
    var e = examen;
    if (partie === 'qcm') {
      if (e.qcm) return '✓ Fait : ' + e.qcm.reduce(function (s, x) { return s + x.juste; }, 0) + ' / ' + e.qcm.length + ' justes du premier coup';
      return MF.qcm.aUnePartie() && MF.qcm._etat().mode === 'examen' ? 'En cours' : 'À faire';
    }
    var r = e[partie];
    if (r) return r.reussi ? '✓ Mission réussie' + (r.indices ? ' (avec indice)' : ' (sans indice)') : '✗ Mission passée';
    var s = partie === 'rangement' ? MF.atelier._session() : MF.recherche._session();
    return s && s.examen ? 'En cours' : 'À faire';
  }

  function ecranAccueil(el) {
    if (!examen) nouveau();
    var esc = ui().esc, e = examen;
    var mR = window.ATELIER.missions[e.kRangement], mD = window.RECHERCHE.missions[e.kRecherche];
    var act = MF.stockage.etat().activites.examen;
    var h = '<div class="page">' +
      '<p class="fil"><a href="#/accueil">‹ Accueil</a></p>' +
      '<h1>Examen blanc</h1>' +
      '<p class="intro">Trois parties, comme une répétition du TE1 : 20 questions sur tous les objectifs, une mission de rangement et une mission de recherche. Pas de chronomètre : prenez votre temps (environ 20 minutes).</p>' +
      (act && act.records.blanc !== undefined ? '<p class="petit">Votre meilleur résultat : ' + act.records.blanc + ' %</p>' : '');
    if (!disponible()) {
      h += '<div class="carte est-inactive"><p>Jouez d\'abord au moins une fois chaque activité (' + activitesJouees() + ' sur 5) : l\'examen blanc s\'ouvrira ensuite.</p></div></div>';
      el.innerHTML = h;
      return;
    }
    var parties = [
      ['qcm', '1. Vingt questions', 'Au moins une question par objectif.'],
      ['rangement', '2. Mission de rangement', mR.titre + ' : ' + mR.consigne],
      ['recherche', '3. Mission de recherche', mD.titre + ' : ' + mD.consigne]
    ];
    h += '<ol class="liste-missions">';
    parties.forEach(function (p) {
      var fait = !!e[p[0]], st = statut(p[0]);
      h += '<li class="carte carte-examen"><p class="q-theme">' + esc(p[1]) + '</p><p class="petit">' + esc(p[2]) + '</p><p class="examen-statut"><b>' + esc(st) + '</b></p>';
      if (!fait) {
        h += '<div class="feuille-rangee">' + (p[0] !== 'qcm' ? '<button type="button" class="btn btn-secondaire" data-passer="' + p[0] + '">Passer</button>' : '') +
          '<button type="button" class="btn" data-lancer="' + p[0] + '">' + (st === 'En cours' ? 'Reprendre' : 'Commencer') + '</button></div>';
      }
      h += '</li>';
    });
    h += '</ol>';
    if (e.qcm && e.rangement && e.recherche) h += '<button type="button" class="btn btn-bloc" data-action="bilan">Voir mon bilan d\'examen</button>';
    h += '<button type="button" class="btn btn-secondaire btn-bloc" data-action="recommencer">Recommencer un nouvel examen</button></div>';
    el.innerHTML = h;

    el.querySelectorAll('[data-lancer]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-lancer');
        if (p === 'qcm') {
          if (MF.qcm.aUnePartie() && MF.qcm._etat().mode === 'examen') ui().naviguer('#/qcm/partie'); else MF.qcm.demarrer('examen');
        } else if (p === 'rangement') {
          var s = MF.atelier._session();
          if (s && s.examen && !s.reussie) ui().naviguer('#/atelier/mission'); else MF.atelier.commencer(e.kRangement, { examen: true });
        } else {
          var r = MF.recherche._session();
          if (r && r.examen && !r.reussie) ui().naviguer('#/recherche/mission'); else MF.recherche.commencer(e.kRecherche, { examen: true });
        }
      });
    });
    el.querySelectorAll('[data-passer]').forEach(function (b) {
      b.addEventListener('click', function () { examen[b.getAttribute('data-passer')] = { reussi: false, indices: 0 }; ecranAccueil(el); });
    });
    var bil = el.querySelector('[data-action="bilan"]');
    if (bil) bil.addEventListener('click', function () { examen.bilan = calculerBilan(); ui().naviguer('#/examen/bilan'); });
    el.querySelector('[data-action="recommencer"]').addEventListener('click', function () { nouveau(); ecranAccueil(el); });
  }

  function ecranBilan(el) {
    var b = examen.bilan, esc = ui().esc;
    var h = '<div class="page"><h1>Bilan de l\'examen blanc</h1>' +
      '<div class="carte carte-resultat"><p class="resultat-etoiles">' + ui().etoiles(b.etoiles, 40) + '</p>' +
      '<p class="resultat-score">' + b.pct + ' %</p><p class="petit">Questions justes du premier coup et missions réussies sans indice.</p>' +
      (b.record.nouveauRecord ? '<p class="resultat-record">Nouveau record personnel !</p>' : '<p class="petit">Votre meilleur résultat : ' + b.record.record + ' %</p>') + '</div>' +
      '<h2 class="titre-section">Par thème</h2><div class="carte">';
    b.themes.forEach(function (t) {
      h += '<div class="bilan-ligne examen-theme"><span>' + esc(ui().nomTheme(t.code)) + '</span></div>' + ui().barre(t.pct, ui().nomTheme(t.code));
    });
    h += '</div>';
    if (b.faible && b.faible.pct < 80) {
      var a = ACTIVITE_DU_THEME[b.faible.code];
      h += '<div class="carte carte-reprise"><p><b>Révisez en priorité : ' + esc(ui().nomTheme(b.faible.code)) + ' (' + b.faible.pct + ' %)</b></p>' +
        '<button type="button" class="btn btn-bloc" data-action="entrainer">Quiz express : ' + esc(ui().nomTheme(b.faible.code)) + '</button>' +
        (a ? '<a class="btn btn-secondaire btn-bloc" href="' + a[0] + '">' + esc(a[1]) + '</a>' : '') + '</div>';
    } else {
      h += '<p class="intro">Bravo : tous les thèmes sont à 80 % ou plus. Continuez la Révision du jour pour garder vos acquis.</p>';
    }
    h += '<div class="boutons-fin"><a class="btn btn-secondaire btn-bloc" href="#/accueil">Accueil</a></div></div>';
    el.innerHTML = h;
    var ent = el.querySelector('[data-action="entrainer"]');
    if (ent) ent.addEventListener('click', function () { MF.qcm.demarrer(b.faible.code); });
    examen = null;
  }

  MF.examen = {
    disponible: disponible,
    activitesJouees: activitesJouees,
    tirageQcm: tirageQcm,
    finQcm: finQcm,
    finMission: finMission,
    ecranAccueil: ecranAccueil,
    ecranBilan: ecranBilan,
    aUnBilan: function () { return !!(examen && examen.bilan); },
    /* Pour les tests automatiques uniquement. */
    _etat: function () { return examen; }
  };
})();
