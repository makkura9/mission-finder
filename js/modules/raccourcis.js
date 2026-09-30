/* Mission Finder — module « Clavier secret » (raccourcis clavier).
   - 10 raccourcis de la fiche par partie (d'abord ceux à revoir ou jamais vus, js/leitner.js).
   - Deux sens : composer la combinaison sur un clavier virtuel (6 questions),
     ou dire ce que fait une combinaison (4 questions à choix).
   - Clavier virtuel : les touches ⌘ ⇧ ⌥ restent « enfoncées » quand on les touche ;
     puis on touche la touche finale ; « ⌘ ⇧ 4 puis Espace » se compose en touchant
     Espace après la touche 4. Aucun glisser-déposer, aucun survol.
   - Deux essais par question, mêmes points que le Quiz express (js/partie.js). */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = function () { return MF.ui; };

  var TAILLE_PARTIE = 10;
  var NB_COMPOSER = 6;
  var MODIFICATEURS = ['⌘', '⇧', '⌥'];
  var NOMS_TOUCHES = { '⌘': 'cmd', '⇧': 'maj', '⌥': 'alt', '⇥': 'tab' };
  var CLAVIER = [
    ['esc', '⇥', '3', '4', '5', 'Z'],
    ['A', 'C', 'F', 'I', 'M', 'N'],
    ['O', 'P', 'Q', 'T', 'V', 'W'],
    ['⇧', '⌥', '⌘', 'Espace']
  ];

  var partie = null, resultat = null, racine = null;
  var saisie = null;   // { mods: [...], cle: 'N' | null, puis: 'Espace' | null }

  /* ---------- Outils ---------- */

  function texte(r) { return r.action + (r.precision ? ' (' + r.precision + ')' : ''); }
  function combinaison(r) { return r.touches.join(' ') + (r.puis ? ' puis ' + r.puis : ''); }
  function ordonner(mods) { return MODIFICATEURS.filter(function (m) { return mods.indexOf(m) >= 0; }); }
  function signature(mods, cle, puis) { return ordonner(mods).join('') + '|' + cle + '|' + (puis || ''); }
  function signatureRaccourci(r) { return signature(r.touches.slice(0, -1), r.touches[r.touches.length - 1], r.puis); }
  function texteSaisie(s) { return ordonner(s.mods).concat([s.cle]).join(' ') + (s.puis ? ' puis ' + s.puis : ''); }
  function parId(id) { return window.RACCOURCIS.filter(function (r) { return r.id === id; })[0]; }
  function saisieVide() { return { mods: [], cle: null, puis: null }; }

  function kbd(t) {
    return '<kbd>' + ui().esc(t) + (NOMS_TOUCHES[t] ? '<small>' + NOMS_TOUCHES[t] + '</small>' : '') + '</kbd>';
  }
  function touchesHTML(touches, puis) {
    return touches.map(kbd).join(' ') + (puis ? ' <span class="puis">puis</span> ' + kbd(puis) : '');
  }

  /* ---------- Partie ---------- */

  function construire(r, sens) {
    var q = {
      id: 'clav-' + r.id,
      objectif: 'RAC',
      enonce: sens === 'composer' ? 'Quelle combinaison pour « ' + texte(r) + ' » ?' : 'Que fait ' + combinaison(r) + ' ?',
      bonne: sens === 'composer' ? combinaison(r) : texte(r),
      explication: combinaison(r) + ' : ' + texte(r) + '.'
    };
    var it = { q: q, r: r, sens: sens };
    if (sens === 'quefait') {
      var distracteurs = ui().melanger(r.proches.map(parId)).slice(0, 3);
      var autres = ui().melanger(window.RACCOURCIS.filter(function (x) { return x !== r && distracteurs.indexOf(x) < 0; }));
      while (distracteurs.length < 3) distracteurs.push(autres.shift());
      it.propositions = ui().melanger([r].concat(distracteurs));
      it.desactivees = [];
      it.choix = null;
    }
    return it;
  }

  function nouvellePartie() {
    var candidats = window.RACCOURCIS.map(function (r) { return { id: 'clav-' + r.id, objectif: 'RAC', r: r }; });
    var choisis = ui().melanger(MF.leitner.prioriser(candidats).slice(0, TAILLE_PARTIE));
    var items = choisis.map(function (c, k) { return construire(c.r, k < NB_COMPOSER ? 'composer' : 'quefait'); });
    partie = MF.partie.nouvelle('raccourcis', 'partie', ui().melanger(items));
    saisie = saisieVide();
    resultat = null;
  }

  function demarrer() {
    nouvellePartie();
    ui().naviguer('#/clavier/partie');
  }

  /* Explication ciblée d'une combinaison fausse, sans donner la réponse. */
  function diagnostic(s, r) {
    var sig = signature(s.mods, s.cle, s.puis);
    var autre = window.RACCOURCIS.filter(function (x) { return signatureRaccourci(x) === sig; })[0];
    var compose = texteSaisie(s);
    var msg;
    if (autre) msg = 'Vous avez composé ' + compose + ' : « ' + texte(autre) + ' ».';
    else if (sig === '⌘|Espace|') msg = 'Vous avez composé ⌘ Espace : cette combinaison ouvre Spotlight.';
    else msg = 'Vous avez composé ' + compose + ' : cette combinaison n\'est pas sur la fiche.';
    var modsR = ordonner(r.touches.slice(0, -1)).join(''), cleR = r.touches[r.touches.length - 1];
    var memesMods = ordonner(s.mods).join('') === modsR;
    var indice = '';
    if (s.mods.indexOf('⌘') < 0) indice = 'Tous les raccourcis de la fiche commencent par ⌘.';
    else if (memesMods && s.cle === cleR && r.puis && !s.puis) indice = 'Presque : cette capture se fait en deux temps.';
    else if (memesMods && s.cle === cleR && !r.puis && s.puis) indice = 'Presque : ici, une seule étape suffit.';
    else if (s.cle === cleR) indice = 'La touche finale est juste ; vérifiez les touches de modification (⌘, ⇧, ⌥).';
    else if (memesMods) indice = 'Les touches de modification sont justes ; changez la touche finale.';
    return msg + (indice ? ' ' + indice : '');
  }

  function toucher(t) {
    if (partie.statut === 'termine') return;
    if (MODIFICATEURS.indexOf(t) >= 0) {
      var k = saisie.mods.indexOf(t);
      if (k >= 0) saisie.mods.splice(k, 1); else saisie.mods.push(t);
    } else if (saisie.cle === null) {
      saisie.cle = t;
    } else if (t === 'Espace' && !saisie.puis) {
      saisie.puis = 'Espace';
    } else {
      saisie.cle = t;
      saisie.puis = null;
    }
    rendrePartie();
  }

  function effacer() {
    if (partie.statut === 'termine') return;
    saisie = saisieVide();
    rendrePartie();
  }

  function valider() {
    var it = MF.partie.courant(partie);
    if (partie.statut === 'termine') return;
    if (it.sens === 'composer') {
      if (!saisie.cle) return;
      var juste = signature(saisie.mods, saisie.cle, saisie.puis) === signatureRaccourci(it.r);
      it.pourquoi = juste ? '' : diagnostic(saisie, it.r);
      it.derniere = texteSaisie(saisie);
      var etat = MF.partie.noter(partie, juste);
      if (etat === 'reessai') saisie = saisieVide();
    } else {
      if (!it.choix) return;
      var bon = it.choix === it.r;
      it.pourquoi = bon ? '' : '« ' + texte(it.choix) + ' », c\'est ' + combinaison(it.choix) + '.';
      if (MF.partie.noter(partie, bon) === 'reessai') { it.desactivees.push(it.choix); it.choix = null; }
    }
    rendrePartie();
    var zone = racine && racine.querySelector('.retour');
    if (zone && zone.scrollIntoView) zone.scrollIntoView({ block: 'nearest' });
  }

  function suivante() {
    if (!MF.partie.suivante(partie)) { resultat = MF.partie.terminer(partie); partie = null; ui().remplacer('#/clavier/resultat'); return; }
    saisie = saisieVide();
    rendrePartie();
    window.scrollTo(0, 0);
    var t = racine.querySelector('.q-enonce');
    if (t) t.focus({ preventScroll: true });
  }

  /* ---------- Affichage ---------- */

  function clavierHTML(inactif) {
    var h = '<div class="clavier" role="group" aria-label="Clavier">';
    CLAVIER.forEach(function (rangee) {
      h += '<div class="clavier-rangee">';
      rangee.forEach(function (t) {
        var enfoncee = MODIFICATEURS.indexOf(t) >= 0 ? saisie.mods.indexOf(t) >= 0 : (saisie.cle === t || saisie.puis === t);
        var classe = 'touche' + (MODIFICATEURS.indexOf(t) >= 0 ? ' touche-mod' : '') + (t === 'Espace' ? ' touche-espace' : '');
        var libelle = t === 'Espace' ? 'espace' : ui().esc(t);
        h += '<button type="button" class="' + classe + '" data-touche="' + ui().esc(t) + '" aria-pressed="' + enfoncee + '"' + (inactif ? ' disabled' : '') + '>' +
          libelle + (NOMS_TOUCHES[t] ? '<small>' + NOMS_TOUCHES[t] + '</small>' : '') + '</button>';
      });
      h += '</div>';
    });
    return h + '</div>';
  }

  function rendrePartie() {
    var el = racine, it = MF.partie.courant(partie), esc = ui().esc;
    var fini = partie.statut === 'termine';
    var h = MF.partie.entete(partie, '#/clavier', 'Clavier secret') + '<div class="page page-jeu">' +
      '<p class="q-theme">Raccourcis clavier</p>';
    var actif;
    if (it.sens === 'composer') {
      h += '<p class="q-enonce" tabindex="-1">Quelle combinaison pour :</p>' +
        '<p class="q-action">« ' + esc(texte(it.r)) + ' »</p>' +
        '<div class="saisie" aria-live="polite"><span class="saisie-lib">Votre combinaison :</span> ' +
        (saisie.cle || saisie.mods.length ? '<span class="saisie-touches">' + touchesHTML(ordonner(saisie.mods).concat(saisie.cle ? [saisie.cle] : []), saisie.puis) + '</span>' : '<span class="petit">touchez les touches ci-dessous</span>') +
        '</div>' + clavierHTML(fini);
      actif = !!saisie.cle;
    } else {
      h += '<p class="q-enonce" tabindex="-1">Que fait cette combinaison ?</p>' +
        '<p class="touches-grandes">' + touchesHTML(it.r.touches, it.r.puis) + '</p>' +
        '<div class="propositions" role="group" aria-label="Propositions">';
      it.propositions.forEach(function (p, i) {
        var bonne = p === it.r, choisie = it.choix === p, desact = it.desactivees.indexOf(p) >= 0;
        var classe = '', etat = '';
        if (fini) {
          if (bonne) { classe = 'est-juste'; etat = choisie || (it.fin && it.fin.juste) ? '✓ Votre réponse : juste' : '✓ Bonne réponse'; }
          else if (choisie || desact) { classe = 'est-faux'; etat = choisie ? '✗ Votre réponse' : '✗ Votre 1re réponse'; }
          else classe = 'est-neutre';
        } else if (desact) { classe = 'est-faux'; etat = '✗ Votre 1re réponse'; }
        h += '<button type="button" class="proposition ' + classe + '" data-i="' + i + '" aria-pressed="' + choisie + '"' + (fini || desact ? ' disabled' : '') + '>' +
          '<span class="prop-marque" aria-hidden="true"></span><span class="prop-texte">' + esc(texte(p)) + '</span>' +
          (etat ? '<span class="prop-etat">' + etat + '</span>' : '') + '</button>';
      });
      h += '</div>';
      actif = !!it.choix;
    }
    var details = { pourquoi: it.pourquoi };
    h += '<div class="zone-retour" aria-live="polite">' + MF.partie.retour(partie, details) + '</div></div>';
    if (fini) h += MF.partie.barreAction(partie.index + 1 < partie.items.length ? 'Question suivante' : 'Voir le résultat', true);
    else h += MF.partie.barreAction('Valider', actif, it.sens === 'composer' ? '<button type="button" class="btn btn-secondaire" data-action="effacer">Effacer</button>' : '');
    el.innerHTML = h;

    el.querySelectorAll('[data-touche]').forEach(function (b) {
      b.addEventListener('click', function () { toucher(b.getAttribute('data-touche')); });
    });
    el.querySelectorAll('.proposition').forEach(function (b) {
      b.addEventListener('click', function () { if (partie.statut !== 'termine') { it.choix = it.propositions[Number(b.getAttribute('data-i'))]; rendrePartie(); } });
    });
    var ef = el.querySelector('[data-action="effacer"]');
    if (ef) ef.addEventListener('click', effacer);
    el.querySelector('[data-action="principal"]').addEventListener('click', function () {
      if (partie.statut === 'termine') suivante(); else valider();
    });
  }

  /* ---------- Écrans ---------- */

  function ecranChoix(el) {
    racine = el;
    var e = MF.stockage.etat(), esc = ui().esc;
    var act = e.activites.raccourcis || { parties: 0, etoilesMax: 0, records: {} };
    var m = MF.progression.maitriseTheme('RAC');
    var h = '<div class="page">' +
      '<p class="fil"><a href="#/accueil">‹ Accueil</a></p>' +
      '<h1>Clavier secret</h1>' +
      '<p class="intro">10 raccourcis de la fiche, environ 4 minutes : composez la combinaison sur le clavier, ou dites ce que fait un raccourci. Deux essais par question.</p>' +
      '<p class="petit">' + (act.parties ? 'Meilleur résultat : ' + ui().etoiles(act.etoilesMax) + (act.records.partie !== undefined ? ' · record : ' + ui().points(act.records.partie) : '') + ' · ' : '') +
      'maîtrise des raccourcis : ' + (m === null ? 'à découvrir' : m + ' %') + '</p>';
    if (partie) {
      h += '<div class="carte carte-reprise"><p><b>Partie en cours</b> : question ' + (partie.index + 1) + ' sur ' + partie.items.length + '.</p>' +
        '<button type="button" class="btn btn-bloc" data-action="reprendre">Reprendre la partie</button></div>';
    }
    h += '<button type="button" class="btn btn-bloc" data-action="commencer">' + (partie ? 'Nouvelle partie' : 'Commencer une partie') + '</button>' +
      '<details class="carte"><summary>La fiche des 20 raccourcis</summary><table class="fiche"><thead><tr><th scope="col">Raccourci</th><th scope="col">Action</th></tr></thead><tbody>';
    window.RACCOURCIS.forEach(function (r) {
      h += '<tr><td><b>' + esc(combinaison(r)) + '</b></td><td>' + esc(texte(r)) + '</td></tr>';
    });
    h += '</tbody></table><p class="petit">Source : fiche « Principaux raccourcis clavier sur Mac OS X ».</p></details></div>';
    el.innerHTML = h;
    el.querySelector('[data-action="commencer"]').addEventListener('click', demarrer);
    var r = el.querySelector('[data-action="reprendre"]');
    if (r) r.addEventListener('click', function () { ui().naviguer('#/clavier/partie'); });
  }

  function ecranPartie(el) { racine = el; rendrePartie(); }

  function ecranResultat(el) {
    racine = el;
    MF.partie.ecranResultat(el, resultat, { titre: 'Clavier secret', rejouer: demarrer, retour: '#/clavier', libelleRetour: 'Retour au Clavier secret' });
  }

  MF.clavier = {
    ecranChoix: ecranChoix,
    ecranPartie: ecranPartie,
    ecranResultat: ecranResultat,
    demarrer: demarrer,
    aUnePartie: function () { return !!partie; },
    aUnResultat: function () { return !!resultat; },
    /* Pour les tests automatiques uniquement. */
    _etat: function () { return partie; },
    _saisie: function () { return saisie; },
    _signature: signatureRaccourci
  };
})();
