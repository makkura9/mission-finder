/* Mission Finder — petits outils d'affichage partagés. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};

  var esc = function (t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  function melanger(tab) {
    for (var i = tab.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = tab[i]; tab[i] = tab[j]; tab[j] = t;
    }
    return tab;
  }

  function auHasard(tab) { return tab[Math.floor(Math.random() * tab.length)]; }

  var CHEMIN_ETOILE = 'M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z';

  /* Étoiles : n pleines sur 3, avec un texte pour les lecteurs d'écran. */
  function etoiles(n, taille) {
    taille = taille || 18;
    var s = '<span class="etoiles" role="img" aria-label="' + n + ' étoile' + (n > 1 ? 's' : '') + ' sur 3">';
    for (var i = 0; i < 3; i++) {
      s += '<svg viewBox="0 0 24 24" width="' + taille + '" height="' + taille + '" aria-hidden="true" focusable="false"><path d="' + CHEMIN_ETOILE + '" class="' + (i < n ? 'etoile-pleine' : 'etoile-vide') + '"/></svg>';
    }
    return s + '</span>';
  }

  /* Barre de progression avec pourcentage écrit (jamais la couleur seule). */
  function barre(pct, libelle) {
    return '<div class="barre-ligne"><div class="barre" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"' +
      (libelle ? ' aria-label="' + esc(libelle) + '"' : '') + '><div class="barre-remplie" style="width:' + pct + '%"></div></div>' +
      '<span class="barre-pct">' + pct + ' %</span></div>';
  }

  function naviguer(hash) { if (location.hash === hash) { window.dispatchEvent(new HashChangeEvent('hashchange')); } else { location.hash = hash; } }
  function remplacer(hash) { location.replace(hash); }

  function dateSuisse(d) {
    d = d || new Date();
    var j = d.getDate(), m = d.getMonth() + 1;
    return (j < 10 ? '0' : '') + j + '.' + (m < 10 ? '0' : '') + m + '.' + d.getFullYear();
  }

  function points(n) { return n + (n > 1 ? ' points' : ' point'); }

  function nomTheme(code) {
    if (code === 'melange') return 'Tous les thèmes';
    var t = window.OBJECTIFS.themes.filter(function (x) { return x.code === code; })[0];
    return t ? t.nom : code;
  }

  function themeDeObjectif(code) {
    var o = window.OBJECTIFS.liste.filter(function (x) { return x.code === code; })[0];
    return o ? o.theme : null;
  }

  var ICONES = {
    quiz: '<path d="M5 4h14v16H5z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.8"/>',
    clavier: '<rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 10h1M10 10h1M13.5 10h1M17 10h.5M8 14h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    ecran: '<rect x="3" y="4" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 20h6M12 16v4" stroke="currentColor" stroke-width="1.8"/>',
    dossier: '<path d="M3 7a1 1 0 011-1h5l2 2h9a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    loupe: '<circle cx="10.5" cy="10.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    revision: '<path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  function icone(nom, taille) {
    taille = taille || 24;
    return '<svg viewBox="0 0 24 24" width="' + taille + '" height="' + taille + '" aria-hidden="true" focusable="false">' + (ICONES[nom] || '') + '</svg>';
  }

  MF.ui = {
    esc: esc, melanger: melanger, auHasard: auHasard, etoiles: etoiles, barre: barre,
    naviguer: naviguer, remplacer: remplacer, dateSuisse: dateSuisse, points: points,
    nomTheme: nomTheme, themeDeObjectif: themeDeObjectif, icone: icone
  };
})();
