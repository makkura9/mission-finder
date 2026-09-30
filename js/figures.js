/* Mission Finder — illustrations des questions (recréations vectorielles simplifiées).
   Aucune capture d'écran, aucun logo : le menu Pomme est une pomme stylisée générique,
   les icônes d'applications sont des carrés de couleur avec une abréviation. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var POMME = '<path d="M11 8.2c-.9 0-1.6.5-2.3.5-.8 0-1.5-.5-2.4-.5C4.4 8.2 3 9.9 3 12.6c0 3 2 6.4 3.7 6.4.8 0 1.2-.5 2.1-.5s1.3.5 2.1.5C12.6 19 14.5 15.6 14.5 12.6c0-2.7-1.5-4.4-3.5-4.4z" fill="#1d1d1f"/><path d="M8.8 8.3c0-1.8.8-3.1 2.1-3.7" fill="none" stroke="#1d1d1f" stroke-width="1.3" stroke-linecap="round"/>';
  var LOUPE = '<circle cx="0" cy="0" r="4.6" fill="none" stroke="#1d1d1f" stroke-width="1.6"/><path d="M3.4 3.4l3.6 3.6" stroke="#1d1d1f" stroke-width="1.8" stroke-linecap="round"/>';

  /* Barre des menus : { type:"barreMenus", app:"Excel", menus:[…] } */
  function barreMenus(f) {
    var tspans = '<tspan font-weight="700">' + esc(f.app) + '</tspan>';
    (f.menus || []).forEach(function (m) { tspans += '<tspan dx="14">' + esc(m) + '</tspan>'; });
    var desc = 'Barre des menus : menu Pomme, puis « ' + f.app + ' » en gras, puis ' + (f.menus || []).join(', ') + ' ; loupe de Spotlight à droite.';
    return '<figure class="figure" role="img" aria-label="' + esc(desc) + '">' +
      '<svg class="fig-barre" viewBox="0 0 340 28" width="100%" aria-hidden="true" focusable="false">' +
      '<rect width="340" height="28" fill="#ECECEE"/><rect y="27" width="340" height="1" fill="#C9C9CE"/>' +
      '<g transform="translate(4 2)">' + POMME + '</g>' +
      '<text x="26" y="18.5" font-size="12.5" fill="#1d1d1f" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">' + tspans + '</text>' +
      '<g transform="translate(318 12.5)">' + LOUPE + '</g>' +
      '</svg><figcaption>Barre des menus, en haut de l\'écran.</figcaption></figure>';
  }

  function iconeApp(app) {
    return '<svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true" focusable="false">' +
      '<rect x="1" y="1" width="34" height="34" rx="8" fill="' + esc(app.couleur || '#5F6B73') + '"/>' +
      '<text x="18" y="23.5" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">' + esc(app.abr || app.nom.slice(0, 2)) + '</text></svg>';
  }

  /* Extrait du Dock : { type:"dock", apps:[{nom, abr, couleur, ouverte}] } */
  function dock(f) {
    var ouvertes = f.apps.filter(function (a) { return a.ouverte; }).map(function (a) { return a.nom; });
    var desc = 'Extrait du Dock avec les applications ' + f.apps.map(function (a) { return a.nom; }).join(', ') +
      '. Un point est affiché sous : ' + (ouvertes.join(', ') || 'aucune') + '.';
    var html = '<figure class="figure" role="img" aria-label="' + esc(desc) + '"><div class="fig-dock" aria-hidden="true">';
    f.apps.forEach(function (a) {
      html += '<div class="fig-dock-app">' + iconeApp(a) +
        '<span class="fig-dock-point' + (a.ouverte ? ' est-ouverte' : '') + '"></span>' +
        '<span class="fig-dock-nom">' + esc(a.nom) + '</span></div>';
    });
    html += '</div><figcaption>Extrait du Dock (les noms sont ajoutés pour l\'exercice).</figcaption></figure>';
    return html;
  }

  var COULEURS_EXT = {
    pdf: '#C62828', docx: '#2B579A', xlsx: '#217346', zip: '#6D6D72',
    jpg: '#2E7D5B', jpeg: '#2E7D5B', png: '#1565C0', mp3: '#8E24AA', mp4: '#AD1457'
  };

  function iconeFichier(nom) {
    var ext = (nom.split('.').pop() || '').toLowerCase();
    var coul = COULEURS_EXT[ext] || '#5F6B73';
    var estImage = ext === 'jpg' || ext === 'jpeg' || ext === 'png';
    var dessin = estImage
      ? '<path d="M9 36l8-10 6 7 4-4 8 7z" fill="' + coul + '" opacity=".85"/><circle cx="30" cy="20" r="3" fill="' + coul + '"/>'
      : '<path d="M10 16h24M10 21h24M10 26h18" stroke="#B8BCC2" stroke-width="2"/>';
    return '<svg viewBox="0 0 44 54" width="44" height="54" aria-hidden="true" focusable="false">' +
      '<path d="M3 2h28l10 10v40H3z" fill="#FFFFFF" stroke="#9AA0A6" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M31 2v10h10" fill="#E8EAED" stroke="#9AA0A6" stroke-width="1.5" stroke-linejoin="round"/>' + dessin +
      '<rect x="3" y="40" width="38" height="12" fill="' + coul + '"/>' +
      '<text x="22" y="49.5" text-anchor="middle" font-size="9" font-weight="700" fill="#FFFFFF" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">' + esc(ext.toUpperCase()) + '</text></svg>';
  }

  /* Fichier à ranger : { type:"fichier", nom:"…" } */
  function fichier(f) {
    return '<figure class="figure fig-fichier" aria-label="Fichier ' + esc(f.nom) + '">' + iconeFichier(f.nom) +
      '<span class="fig-fichier-nom">' + esc(f.nom) + '</span></figure>';
  }

  MF.figures = {
    esc: esc,
    iconeFichier: iconeFichier,
    rendre: function (f) {
      if (!f) return '';
      if (f.type === 'barreMenus') return barreMenus(f);
      if (f.type === 'dock') return dock(f);
      if (f.type === 'fichier') return fichier(f);
      return '';
    }
  };
})();
