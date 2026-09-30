/* Mission Finder — points, niveaux, étoiles, maîtrise, records.
   Règles validées en phase 0 :
   - 10 points du premier coup, 5 au 2e essai, 0 ensuite, jamais négatif ;
   - bonus de série : +2 par réponse juste du premier coup consécutive (dès la 2e), +10 max par partie ;
   - étoiles : ★ ≥ 50 %, ★★ ≥ 75 %, ★★★ = 100 % (points de base / points maximum, bonus exclu) ;
   - maîtrise d'un objectif : % de réponses justes du premier coup sur ses 10 dernières réponses,
     « à découvrir » tant qu'il y a moins de 3 réponses. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};

  var HISTORIQUE = 10;
  var MIN_REPONSES = 3;

  function etat() { return MF.stockage.etat(); }

  function dateDuJour(d) {
    d = d || new Date();
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (j < 10 ? '0' : '') + j;
  }

  function niveauPour(points) {
    var liste = window.NIVEAUX, courant = liste[0], suivant = null;
    for (var i = 0; i < liste.length; i++) {
      if (points >= liste[i].points) { courant = liste[i]; suivant = liste[i + 1] || null; }
    }
    return { niveau: courant.niveau, nom: courant.nom, min: courant.points, suivant: suivant };
  }

  function etoilesPour(taux) {
    if (taux >= 1) return 3;
    if (taux >= 0.75) return 2;
    if (taux >= 0.5) return 1;
    return 0;
  }

  /* Enregistre une réponse terminée (après le dernier essai). */
  function enregistrerReponse(question, premierCoup, points) {
    var e = etat();
    var h = e.objectifs[question.objectif] || [];
    h.push(premierCoup ? 1 : 0);
    e.objectifs[question.objectif] = h.slice(-HISTORIQUE);

    var s = e.questions[question.id] || { vues: 0, justes1: 0, boite: 1, derniere: '' };
    s.vues += 1;
    if (premierCoup) { s.justes1 += 1; s.boite = Math.min(5, s.boite + 1); } else { s.boite = 1; }
    s.derniere = dateDuJour();
    e.questions[question.id] = s;

    e.points += Math.max(0, points);
    MF.stockage.enregistrer();
  }

  function ajouterPoints(points) {
    etat().points += Math.max(0, points);
    MF.stockage.enregistrer();
  }

  function maitriseObjectif(code) {
    var h = etat().objectifs[code] || [];
    if (h.length < MIN_REPONSES) return { n: h.length, pct: null };
    var s = 0; h.forEach(function (x) { s += x; });
    return { n: h.length, pct: Math.round(100 * s / h.length) };
  }

  /* Maîtrise d'un thème = moyenne des objectifs déjà évalués (null si aucun). */
  function maitriseTheme(theme) {
    var vals = [];
    window.OBJECTIFS.liste.forEach(function (o) {
      if (o.theme === theme) { var m = maitriseObjectif(o.code); if (m.pct !== null) vals.push(m.pct); }
    });
    if (!vals.length) return null;
    var s = 0; vals.forEach(function (v) { s += v; });
    return Math.round(s / vals.length);
  }

  /* Maîtrise moyenne sur un ensemble d'objectifs (ou tous). */
  function maitriseGlobale(codes) {
    var vals = [];
    window.OBJECTIFS.liste.forEach(function (o) {
      if (!codes || codes.indexOf(o.code) >= 0) { var m = maitriseObjectif(o.code); if (m.pct !== null) vals.push(m.pct); }
    });
    if (!vals.length) return null;
    var s = 0; vals.forEach(function (v) { s += v; });
    return Math.round(s / vals.length);
  }

  /* Fin de partie : records, étoiles, jour de révision. */
  function terminerPartie(activite, mode, total, etoiles) {
    var e = etat();
    var a = e.activites[activite] || { parties: 0, etoilesMax: 0, records: {} };
    var ancien = a.records[mode];
    var nouveauRecord = (ancien === undefined && total > 0) || (ancien !== undefined && total > ancien);
    if (ancien === undefined || total > ancien) a.records[mode] = total;
    a.parties += 1;
    a.etoilesMax = Math.max(a.etoilesMax, etoiles);
    e.activites[activite] = a;
    var jour = dateDuJour();
    if (e.jours.indexOf(jour) < 0) e.jours.push(jour);
    e.jours = e.jours.slice(-120);
    MF.stockage.enregistrer();
    return { nouveauRecord: nouveauRecord, ancienRecord: ancien === undefined ? null : ancien, record: a.records[mode] };
  }

  /* Nombre de jours de révision dans la semaine en cours (lundi → dimanche). */
  function joursCetteSemaine() {
    var auj = new Date();
    var decalage = (auj.getDay() + 6) % 7; // lundi = 0
    var lundi = new Date(auj.getFullYear(), auj.getMonth(), auj.getDate() - decalage);
    var debut = dateDuJour(lundi);
    var fin = dateDuJour(new Date(lundi.getFullYear(), lundi.getMonth(), lundi.getDate() + 6));
    return etat().jours.filter(function (j) { return j >= debut && j <= fin; }).length;
  }

  MF.progression = {
    dateDuJour: dateDuJour,
    niveauPour: niveauPour,
    etoilesPour: etoilesPour,
    enregistrerReponse: enregistrerReponse,
    ajouterPoints: ajouterPoints,
    maitriseObjectif: maitriseObjectif,
    maitriseTheme: maitriseTheme,
    maitriseGlobale: maitriseGlobale,
    terminerPartie: terminerPartie,
    joursCetteSemaine: joursCetteSemaine
  };
})();
