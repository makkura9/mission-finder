/* Mission Finder — répétition espacée (boîtes de Leitner) et « Révision du jour ».
   - Chaque question vue est dans une boîte de 1 à 5 (etat.questions[id].boite) :
     juste du premier coup → boîte suivante ; sinon → retour en boîte 1 (js/progression.js).
   - Une question revient quand le délai de sa boîte est écoulé depuis sa dernière réponse :
     une question ratée revient tout de suite, une question réussie plusieurs fois s'espace.
   - Révision du jour : 5 à 10 questions, d'abord celles à revoir, tous thèmes mélangés. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};

  /* Délai (en jours) avant le retour d'une question, selon sa boîte. */
  var DELAI = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };
  var MIN_REVISION = 5;
  var MAX_REVISION = 10;

  function stats() { return MF.stockage.etat().questions; }

  /* Nombre de jours entre une date « AAAA-MM-JJ » et aujourd'hui (Infinity si inconnue). */
  function joursDepuis(texte) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texte || '');
    if (!m) return Infinity;
    var auj = new Date();
    var a = Date.UTC(auj.getFullYear(), auj.getMonth(), auj.getDate());
    var d = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Math.round((a - d) / 86400000);
  }

  function estVue(q) { return !!stats()[q.id]; }

  function estARevoir(q) {
    var s = stats()[q.id];
    return !!s && joursDepuis(s.derniere) >= DELAI[s.boite];
  }

  /* Ordre de priorité : boîte la plus basse, puis réponse la plus ancienne (hasard à égalité). */
  function parPriorite(liste) {
    var s = stats();
    return MF.ui.melanger(liste.slice()).sort(function (a, b) {
      var sa = s[a.id], sb = s[b.id];
      if (sa.boite !== sb.boite) return sa.boite - sb.boite;
      return (sa.derniere || '') < (sb.derniere || '') ? -1 : (sa.derniere || '') > (sb.derniere || '') ? 1 : 0;
    });
  }

  /* Mélange en évitant, autant que possible, deux questions du même thème à la suite :
     à chaque étape, on prend une question du thème qui en a le plus en réserve
     (autre que le thème précédent). */
  function entrelacer(liste) {
    var parTheme = {}, res = [], precedent = null;
    MF.ui.melanger(liste.slice()).forEach(function (q) {
      var t = MF.ui.themeDeObjectif(q.objectif);
      (parTheme[t] = parTheme[t] || []).push(q);
    });
    while (res.length < liste.length) {
      var choix = null;
      MF.ui.melanger(Object.keys(parTheme)).forEach(function (t) {
        if (!parTheme[t].length) return;
        if (choix === null || (choix === precedent && t !== precedent) ||
            (t !== precedent && parTheme[t].length > parTheme[choix].length)) choix = t;
      });
      res.push(parTheme[choix].shift());
      precedent = choix;
    }
    return res;
  }

  /* Questions nouvelles, choisies à tour de rôle dans chaque thème. */
  function nouvellesVariees(n) {
    var parTheme = {};
    MF.ui.melanger(window.QUESTIONS.filter(function (q) { return !estVue(q); })).forEach(function (q) {
      var t = MF.ui.themeDeObjectif(q.objectif);
      (parTheme[t] = parTheme[t] || []).push(q);
    });
    var themes = MF.ui.melanger(Object.keys(parTheme)), res = [];
    while (res.length < n && themes.some(function (t) { return parTheme[t].length; })) {
      themes.forEach(function (t) { if (res.length < n && parTheme[t].length) res.push(parTheme[t].shift()); });
    }
    return res;
  }

  function aRevoir() { return window.QUESTIONS.filter(estARevoir); }

  /* Tirage de la Révision du jour. */
  function tirageRevision() {
    var choix = parPriorite(aRevoir()).slice(0, MAX_REVISION);
    if (choix.length < MIN_REVISION) choix = choix.concat(nouvellesVariees(MIN_REVISION - choix.length));
    if (choix.length < MIN_REVISION) {
      // Tout a été vu et rien n'est à revoir : les questions qui reviendront le plus tôt.
      var autres = window.QUESTIONS.filter(function (q) { return estVue(q) && choix.indexOf(q) < 0; });
      choix = choix.concat(parPriorite(autres).slice(0, MIN_REVISION - choix.length));
    }
    return entrelacer(choix);
  }

  /* Quiz express : d'abord les questions à revoir et jamais vues, puis les autres. */
  function prioriser(liste) {
    var prioritaires = [], autres = [];
    liste.forEach(function (q) { (estARevoir(q) || !estVue(q) ? prioritaires : autres).push(q); });
    return MF.ui.melanger(prioritaires).concat(MF.ui.melanger(autres));
  }

  function resume() {
    var vues = window.QUESTIONS.filter(estVue).length;
    return { aRevoir: aRevoir().length, vues: vues, nouvelles: window.QUESTIONS.length - vues };
  }

  MF.leitner = {
    DELAI: DELAI,
    joursDepuis: joursDepuis,
    estARevoir: estARevoir,
    tirageRevision: tirageRevision,
    prioriser: prioriser,
    entrelacer: entrelacer,
    resume: resume
  };
})();
