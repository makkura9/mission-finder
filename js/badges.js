/* Mission Finder — badges (phase 7) : 8 badges liés à une maîtrise démontrée.
   Textes : data/badges.js. Un badge obtenu est gardé (date dans etat.badges), même si la maîtrise baisse ensuite. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};

  function etat() { return MF.stockage.etat(); }
  function records(activite) { return (etat().activites[activite] || { records: {} }).records; }

  function objectifsDuTheme(theme) {
    var liste = window.OBJECTIFS.liste.filter(function (o) { return o.theme === theme; });
    var ok = liste.filter(function (o) { var m = MF.progression.maitriseObjectif(o.code); return m.pct !== null && m.pct >= 80; }).length;
    return { ok: ok === liste.length, progression: ok + ' objectif' + (ok > 1 ? 's' : '') + ' sur ' + liste.length + ' à 80 % ou plus' };
  }

  /* Condition de chaque badge : { ok, progression }. */
  var CONDITIONS = {
    raccourcis: function () {
      var q = etat().questions;
      var n = window.RACCOURCIS.filter(function (r) { return (q['clav-' + r.id] || {}).justes1 >= 2; }).length;
      return { ok: n === window.RACCOURCIS.length, progression: n + ' raccourcis sur ' + window.RACCOURCIS.length };
    },
    bureau: function () { return objectifsDuTheme('BUR'); },
    types: function () { return objectifsDuTheme('TYP'); },
    finder: function () { return objectifsDuTheme('FIN'); },
    rangement: function () {
      var r = records('finder'), n = window.ATELIER.missions.filter(function (m) { return r[m.id] !== undefined; }).length;
      return { ok: n === window.ATELIER.missions.length, progression: n + ' missions sur ' + window.ATELIER.missions.length };
    },
    detective: function () {
      var r = records('recherche'), n = window.RECHERCHE.missions.filter(function (m) { return r[m.id] !== undefined; }).length;
      return { ok: n === window.RECHERCHE.missions.length, progression: n + ' missions sur ' + window.RECHERCHE.missions.length };
    },
    banque: function () {
      var q = etat().questions, n = window.QUESTIONS.filter(function (x) { return (q[x.id] || {}).justes1 >= 1; }).length;
      return { ok: n === window.QUESTIONS.length, progression: n + ' questions sur ' + window.QUESTIONS.length };
    },
    examen: function () {
      var m = records('examen').blanc;
      return { ok: m >= 80, progression: m === undefined ? 'examen blanc pas encore terminé' : 'meilleur résultat : ' + m + ' %' };
    }
  };

  /* Tous les badges, avec leur état. */
  function liste() {
    var obtenus = etat().badges || {};
    return window.BADGES.map(function (b) {
      var c = CONDITIONS[b.id]();
      return { badge: b, obtenu: !!obtenus[b.id] || c.ok, date: obtenus[b.id] || null, progression: c.progression };
    });
  }

  /* Enregistre les badges nouvellement obtenus et les renvoie (pour les annoncer une fois). */
  function nouveaux() {
    var e = etat(), res = [];
    if (!e.badges) e.badges = {};
    window.BADGES.forEach(function (b) {
      if (!e.badges[b.id] && CONDITIONS[b.id]().ok) { e.badges[b.id] = MF.progression.dateDuJour(); res.push(b); }
    });
    if (res.length) MF.stockage.enregistrer();
    return res;
  }

  function compte() { return liste().filter(function (x) { return x.obtenu; }).length; }

  var MEDAILLE = '<path d="M8 2h8l-2 6h-4z" fill="currentColor" opacity=".55"/><circle cx="12" cy="14.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="currentColor"/>';
  function icone(taille) {
    return '<svg viewBox="0 0 24 24" width="' + (taille || 24) + '" height="' + (taille || 24) + '" aria-hidden="true" focusable="false">' + MEDAILLE + '</svg>';
  }

  MF.badges = { liste: liste, nouveaux: nouveaux, compte: compte, icone: icone, CONDITIONS: CONDITIONS };
})();
