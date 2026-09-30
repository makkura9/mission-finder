/* Mission Finder — moteur commun des parties « Clavier secret » et « Visite du Mac ».
   Mêmes règles que le Quiz express (validées en phase 0) :
   - 10 points du premier coup, 5 au 2e essai, 0 ensuite, jamais négatif ;
   - bonus de série : +2 par réponse juste du premier coup consécutive (dès la 2e), +10 max par partie ;
   - étoiles : ★ ≥ 50 %, ★★ ≥ 75 %, ★★★ = 100 % des points de base (bonus exclu).
   Chaque élément d'une partie : { q: { id, objectif, enonce, bonne, explication }, … }
   (« bonne » et « explication » sont repris dans la liste « À revoir » du résultat). */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = function () { return MF.ui; };

  function nouvelle(activite, mode, items) {
    return {
      activite: activite, mode: mode, items: items,
      index: 0, essai: 1, statut: 'attente',       // attente | reessai | termine
      pointsBase: 0, bonus: 0, serie: 0, justes1: 0,
      niveauAvant: MF.progression.niveauPour(MF.stockage.etat().points).niveau
    };
  }

  function courant(p) { return p.items[p.index]; }

  /* Note la réponse à l'élément courant : renvoie « juste », « reessai » (2e essai accordé) ou « faux ». */
  function noter(p, juste) {
    var it = courant(p), T = window.TEXTES;
    if (juste) {
      var pts = p.essai === 1 ? 10 : 5, bonus = 0;
      if (p.essai === 1) {
        p.serie += 1;
        p.justes1 += 1;
        if (p.serie >= 2 && p.bonus < 10) bonus = Math.min(2, 10 - p.bonus);
      } else {
        p.serie = 0;
      }
      p.pointsBase += pts;
      p.bonus += bonus;
      it.fin = { juste: true, pts: pts, bonus: bonus, premierCoup: p.essai === 1, serie: p.serie };
      it.phrase = ui().auHasard(T.juste);
      MF.progression.enregistrerReponse(it.q, p.essai === 1, pts + bonus);
      p.statut = 'termine';
      return 'juste';
    }
    p.serie = 0;
    it.phrase = ui().auHasard(T.faux);
    if (p.essai === 1) { p.essai = 2; p.statut = 'reessai'; return 'reessai'; }
    it.fin = { juste: false, pts: 0, bonus: 0, premierCoup: false, serie: 0 };
    MF.progression.enregistrerReponse(it.q, false, 0);
    p.statut = 'termine';
    return 'faux';
  }

  function suivante(p) {
    if (p.index + 1 >= p.items.length) return false;
    p.index += 1;
    p.essai = 1;
    p.statut = 'attente';
    return true;
  }

  function terminer(p) {
    var n = p.items.length;
    var etoiles = MF.progression.etoilesPour(n ? p.pointsBase / (10 * n) : 0);
    var total = p.pointsBase + p.bonus;
    var rec = MF.progression.terminerPartie(p.activite, p.mode, total, etoiles);
    return {
      activite: p.activite, mode: p.mode, n: n, total: total, bonus: p.bonus, justes1: p.justes1, etoiles: etoiles,
      record: rec, niveauAvant: p.niveauAvant, niveau: MF.progression.niveauPour(MF.stockage.etat().points),
      aRevoir: p.items.filter(function (it) { return it.fin && !it.fin.premierCoup; }).map(function (it) {
        return { enonce: it.q.enonce, bonne: it.q.bonne, explication: it.q.explication };
      })
    };
  }

  /* ---------- Morceaux d'affichage ---------- */

  function entete(p, retour, titre) {
    var n = p.items.length;
    return '<div class="jeu-entete"><a class="jeu-quitter" href="' + retour + '" aria-label="Quitter la partie (vous pourrez la reprendre)">✕ Quitter</a>' +
      '<span class="jeu-compteur">' + (p.index + 1) + ' / ' + n + '</span>' +
      '<span class="jeu-points">' + ui().points(p.pointsBase + p.bonus) + '</span></div>' +
      '<div class="jeu-progression" aria-hidden="true"><div style="width:' + Math.round(100 * p.index / n) + '%"></div></div>' +
      '<h1 class="sr-only">' + ui().esc(titre) + '</h1>';
  }

  /* Retour après une réponse. details : { pourquoi, bonne, explication } (textes simples, échappés ici). */
  function retour(p, details) {
    var it = courant(p), T = window.TEXTES, esc = ui().esc;
    details = details || {};
    if (p.statut === 'reessai') {
      return '<div class="retour retour-faux"><p><span class="retour-icone" aria-hidden="true">✗</span> <b>' + esc(it.phrase) + '</b> ' +
        (details.pourquoi ? esc(details.pourquoi) + ' ' : '') + esc(T.reessayer) + '</p></div>';
    }
    if (p.statut !== 'termine') return '';
    var f = it.fin;
    if (f.juste) {
      var gain = '+' + f.pts + ' points' + (f.bonus ? ' · série de ' + f.serie + ' : +' + f.bonus : '');
      return '<div class="retour retour-juste"><p><span class="retour-icone" aria-hidden="true">✓</span> <b>' + esc(it.phrase) + '</b> <span class="gain">' + gain + '</span></p>' +
        '<p>' + esc(details.explication || it.q.explication) + '</p></div>';
    }
    return '<div class="retour retour-faux"><p><span class="retour-icone" aria-hidden="true">✗</span> <b>' + esc(it.phrase) + '</b> <span class="gain">0 point</span></p>' +
      '<p><b>Bonne réponse : ' + esc(details.bonne || it.q.bonne) + '</b></p>' +
      (details.pourquoi ? '<p>' + esc(details.pourquoi) + '</p>' : '') +
      '<p>' + esc(details.explication || it.q.explication) + '</p></div>';
  }

  /* Écran de résultat. opts : { titre, rejouer: function, retour: '#/…', libelleRetour } */
  function ecranResultat(el, r, opts) {
    var esc = ui().esc;
    var h = '<div class="page">' +
      '<h1>' + esc(opts.titre) + ' : partie terminée</h1>' +
      '<div class="carte carte-resultat">' +
      '<p class="resultat-etoiles">' + ui().etoiles(r.etoiles, 40) + '</p>' +
      '<p class="resultat-score">' + ui().points(r.total) + '</p>' +
      '<p class="petit">' + (r.bonus ? 'dont bonus de série : +' + r.bonus + ' · ' : '') + 'justes du premier coup : ' + r.justes1 + ' / ' + r.n + '</p>';
    if (r.record.nouveauRecord) h += '<p class="resultat-record">Nouveau record ! ' + (r.record.ancienRecord !== null ? '(ancien : ' + ui().points(r.record.ancienRecord) + ')' : '') + '</p>';
    else h += '<p class="petit">Votre record : ' + ui().points(r.record.record) + '</p>';
    if (r.niveau.niveau > r.niveauAvant) h += '<p class="resultat-niveau">Vous passez au niveau ' + r.niveau.niveau + ' : ' + esc(r.niveau.nom) + ' !</p>';
    h += '</div>';
    if (r.aRevoir.length) {
      h += '<h2 class="titre-section">À revoir</h2><ul class="liste-revoir">';
      r.aRevoir.forEach(function (x) {
        h += '<li class="carte"><p>' + esc(x.enonce) + '</p><p><b>Réponse : ' + esc(x.bonne) + '</b></p><p class="petit">' + esc(x.explication) + '</p></li>';
      });
      h += '</ul>';
    } else {
      h += '<p class="intro">Toutes vos réponses étaient justes du premier coup.</p>';
    }
    h += '<div class="boutons-fin"><button type="button" class="btn btn-bloc" data-action="rejouer">Rejouer</button>' +
      '<a class="btn btn-secondaire btn-bloc" href="' + opts.retour + '">' + esc(opts.libelleRetour || 'Retour') + '</a>' +
      '<a class="btn btn-secondaire btn-bloc" href="#/accueil">Accueil</a></div></div>';
    el.innerHTML = h;
    el.querySelector('[data-action="rejouer"]').addEventListener('click', opts.rejouer);
  }

  /* Barre d'action fixée en bas de l'écran (zone du pouce). */
  function barreAction(libelle, actif, secondaire) {
    var principal = '<button type="button" class="btn btn-bloc" data-action="principal"' + (actif ? '' : ' disabled') + '>' + ui().esc(libelle) + '</button>';
    return '<div class="barre-action">' + (secondaire ? '<div class="barre-action-rangee">' + secondaire + principal + '</div>' : principal) + '</div>';
  }

  MF.partie = {
    nouvelle: nouvelle,
    courant: courant,
    noter: noter,
    suivante: suivante,
    terminer: terminer,
    entete: entete,
    retour: retour,
    barreAction: barreAction,
    ecranResultat: ecranResultat
  };
})();
