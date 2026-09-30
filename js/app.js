/* Mission Finder — application : routeur, accueil, bilan, profil, aide.
   Navigation par ancre (#/accueil, #/qcm…) : pas d'erreur 404 au rechargement,
   bouton « retour » du téléphone fonctionnel. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var ui = MF.ui;

  var ACTIVITES = [
    { id: 'qcm', nom: 'Quiz express', sous: 'Questions à choix · 5 thèmes', icone: 'quiz', route: '#/qcm', actif: true },
    { id: 'raccourcis', nom: 'Clavier secret', sous: 'Raccourcis clavier', icone: 'clavier', actif: false },
    { id: 'bureau', nom: 'Visite du Mac', sous: 'Le Bureau de macOS', icone: 'ecran', actif: false },
    { id: 'finder', nom: 'Le grand rangement', sous: 'Atelier fichiers et dossiers', icone: 'dossier', actif: false },
    { id: 'recherche', nom: 'Détective du Finder', sous: 'Spotlight et recherche avancée', icone: 'loupe', actif: false }
  ];

  function etat() { return MF.stockage.etat(); }

  function blocNiveau() {
    var e = etat(), n = MF.progression.niveauPour(e.points);
    var h = '<div class="niveau"><p class="niveau-titre"><span class="puce">Niveau ' + n.niveau + ' · ' + ui.esc(n.nom) + '</span></p>';
    if (n.suivant) {
      var pct = Math.round(100 * (e.points - n.min) / (n.suivant.points - n.min));
      h += '<div class="barre" aria-hidden="true"><div class="barre-remplie" style="width:' + pct + '%"></div></div>' +
        '<p class="petit">' + ui.points(e.points) + ' · niveau ' + n.suivant.niveau + ' à ' + n.suivant.points + ' points</p>';
    } else {
      h += '<p class="petit">' + ui.points(e.points) + ' · niveau maximal atteint</p>';
    }
    return h + '</div>';
  }

  /* ---------- Accueil ---------- */
  function ecranAccueil(el) {
    var e = etat();
    var jours = MF.progression.joursCetteSemaine();
    var h = '<div class="page">' +
      '<p class="marque">Mission Finder</p>' +
      '<h1>Bonjour' + (e.pseudo ? ' ' + ui.esc(e.pseudo) : '') + ' !</h1>' +
      '<p class="intro">Révisez le TE1 : fichiers et dossiers sous macOS.</p>' +
      blocNiveau() +
      (jours > 0 ? '<p class="semaine">✓ ' + jours + ' jour' + (jours > 1 ? 's' : '') + ' de révision cette semaine</p>' : '') +
      '<div class="carte carte-revision est-inactive"><p class="revision-titre">' + ui.icone('revision', 22) + ' Révision du jour</p>' +
      '<p class="petit">Les questions à revoir, tous thèmes mélangés.</p><p><span class="puce puce-bientot">Bientôt disponible</span></p></div>' +
      '<h2 class="titre-section">Activités</h2><ul class="liste-activites">';
    ACTIVITES.forEach(function (a) {
      var st = e.activites[a.id];
      var info;
      if (!a.actif) info = '<span class="puce puce-bientot">Bientôt disponible</span>';
      else if (!st || !st.parties) info = '<span class="petit">Pas encore joué</span>';
      else {
        var m = MF.progression.maitriseGlobale();
        info = m === null ? '<span class="petit">Maîtrise : à découvrir</span>' : ui.barre(m, 'Maîtrise moyenne');
      }
      var contenu = '<span class="act-icone">' + ui.icone(a.icone) + '</span><span class="act-corps"><span class="act-tete"><b>' + ui.esc(a.nom) + '</b>' +
        (a.actif ? ui.etoiles(st ? st.etoilesMax : 0) : '') + '</span><span class="petit">' + ui.esc(a.sous) + '</span>' + info + '</span>';
      h += '<li>' + (a.actif
        ? '<a class="carte carte-activite" href="' + a.route + '">' + contenu + '<span class="chevron" aria-hidden="true">›</span></a>'
        : '<div class="carte carte-activite est-inactive">' + contenu + '</div>') + '</li>';
    });
    h += '</ul><p class="version">Version : ' + ui.esc(window.TEXTES.version) + '</p></div>';
    el.innerHTML = h;
  }

  /* ---------- Mon bilan (conçu pour tenir sur une capture d'écran) ---------- */
  function ecranBilan(el) {
    var e = etat(), n = MF.progression.niveauPour(e.points);
    var h = '<div class="page page-bilan">' +
      '<h1>Mon bilan' + (e.pseudo ? ' · ' + ui.esc(e.pseudo) : '') + '</h1>' +
      '<p class="bilan-entete">' + ui.dateSuisse() + ' · Niveau ' + n.niveau + ' · ' + ui.esc(n.nom) + ' · ' + ui.points(e.points) + '</p>' +
      '<h2 class="titre-section">Étoiles par activité</h2><div class="bilan-activites">';
    ACTIVITES.forEach(function (a) {
      var st = e.activites[a.id];
      h += '<div class="bilan-ligne"><span>' + ui.esc(a.nom) + '</span>' +
        (a.actif ? ui.etoiles(st ? st.etoilesMax : 0, 14) : '<span class="petit">bientôt</span>') + '</div>';
    });
    h += '</div><h2 class="titre-section">Maîtrise par objectif</h2>';
    window.OBJECTIFS.themes.forEach(function (t) {
      var mt = MF.progression.maitriseTheme(t.code);
      var objs = window.OBJECTIFS.liste.filter(function (o) { return o.theme === t.code; });
      h += '<div class="bilan-theme"><div class="bilan-ligne"><b>' + ui.esc(t.nom) + '</b><span class="bilan-val">' +
        (mt === null ? '<span class="petit">—</span>' : '<span class="barre" aria-hidden="true"><span class="barre-remplie" style="width:' + mt + '%"></span></span><b>' + mt + ' %</b>') +
        '</span></div>';
      if (objs.length > 1) {
        h += '<p class="bilan-sous">';
        objs.forEach(function (o) {
          var m = MF.progression.maitriseObjectif(o.code);
          h += '<span class="bilan-obj">' + ui.esc(o.court) + ' <b>' + (m.pct === null ? '—' : m.pct + ' %') + '</b></span> ';
        });
        h += '</p>';
      }
      h += '</div>';
    });
    h += '<p class="bilan-note">« — » : à découvrir (moins de 3 réponses). Maîtrise : réponses justes du premier coup parmi les 10 dernières.</p></div>';
    el.innerHTML = h;
  }

  /* ---------- Profil : pseudo, transfert, réinitialisation ---------- */
  function ecranProfil(el) {
    var e = etat();
    var h = '<div class="page">' +
      '<h1>Profil</h1>' +
      '<section class="carte"><h2>Personnaliser l\'accueil</h2>' +
      '<label class="etiquette" for="champ-pseudo">Prénom ou pseudo (facultatif)</label>' +
      '<p class="petit">Il reste uniquement sur ce téléphone.</p>' +
      '<input id="champ-pseudo" class="champ" type="text" maxlength="20" autocomplete="off" autocapitalize="words" spellcheck="false" value="' + ui.esc(e.pseudo) + '">' +
      '<button type="button" class="btn btn-bloc" data-action="pseudo">Enregistrer</button>' +
      '<p class="message" data-message="pseudo" role="status"></p></section>' +

      '<section class="carte"><h2>Changer de téléphone</h2>' +
      '<p class="petit">1. Sur l\'ancien appareil, générez votre code et copiez-le. 2. Sur le nouvel appareil, collez-le ci-dessous.</p>' +
      '<button type="button" class="btn btn-secondaire btn-bloc" data-action="exporter">Générer mon code</button>' +
      '<div data-zone="export" hidden><label class="etiquette" for="champ-export">Votre code</label>' +
      '<textarea id="champ-export" class="champ champ-code" readonly rows="4"></textarea>' +
      '<button type="button" class="btn btn-bloc" data-action="copier">Copier le code</button>' +
      '<p class="message" data-message="export" role="status"></p></div>' +
      '<label class="etiquette" for="champ-import">Coller un code</label>' +
      '<textarea id="champ-import" class="champ champ-code" rows="3" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="MF1-…"></textarea>' +
      '<button type="button" class="btn btn-secondaire btn-bloc" data-action="importer">Importer ce code</button>' +
      '<p class="message" data-message="import" role="status"></p>' +
      '<div data-zone="confirmer-import" class="confirmation" hidden></div></section>' +

      '<section class="carte"><h2>Recommencer à zéro</h2>' +
      '<button type="button" class="btn btn-danger btn-bloc" data-action="reinitialiser">Effacer ma progression…</button>' +
      '<div data-zone="confirmer-reset" class="confirmation" hidden>' +
      '<p><b>Toute votre progression</b> (points, niveau, étoiles, maîtrise) sera effacée de ce téléphone. Cette action est définitive.</p>' +
      '<p class="petit">Conseil : générez d\'abord votre code pour pouvoir la récupérer.</p>' +
      '<button type="button" class="btn btn-danger-plein btn-bloc" data-action="reset-oui">Effacer définitivement</button>' +
      '<button type="button" class="btn btn-secondaire btn-bloc" data-action="reset-non">Annuler</button></div>' +
      '<p class="message" data-message="reset" role="status"></p></section></div>';
    el.innerHTML = h;

    function msg(nom, texte, type) {
      var m = el.querySelector('[data-message="' + nom + '"]');
      m.textContent = texte;
      m.className = 'message' + (type ? ' message-' + type : '');
    }
    function action(nom, f) { el.querySelector('[data-action="' + nom + '"]').addEventListener('click', f); }

    action('pseudo', function () {
      etat().pseudo = el.querySelector('#champ-pseudo').value.trim().slice(0, 20);
      MF.stockage.enregistrer();
      msg('pseudo', '✓ Enregistré.', 'juste');
    });

    action('exporter', function () {
      el.querySelector('[data-zone="export"]').hidden = false;
      el.querySelector('#champ-export').value = MF.stockage.exporter();
      msg('export', '');
    });

    action('copier', function () {
      var zone = el.querySelector('#champ-export');
      function repli() {
        zone.focus(); zone.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        msg('export', ok ? '✓ Code copié.' : 'Sélectionnez le code, puis copiez-le.', ok ? 'juste' : null);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(zone.value).then(function () { msg('export', '✓ Code copié.', 'juste'); }, repli);
      } else {
        repli();
      }
    });

    action('importer', function () {
      var zoneConf = el.querySelector('[data-zone="confirmer-import"]');
      zoneConf.hidden = true;
      var r = MF.stockage.analyserCode(el.querySelector('#champ-import').value);
      if (!r.ok) { msg('import', '✗ ' + r.message, 'faux'); return; }
      msg('import', '');
      var nNouv = MF.progression.niveauPour(r.etat.points), nAct = MF.progression.niveauPour(etat().points);
      zoneConf.innerHTML = '<p>Ce code contient une progression de <b>niveau ' + nNouv.niveau + '</b> (' + ui.points(r.etat.points) + ').</p>' +
        '<p>Elle remplacera la progression actuelle de ce téléphone (niveau ' + nAct.niveau + ', ' + ui.points(etat().points) + ').</p>' +
        '<button type="button" class="btn btn-bloc" data-conf="oui">Remplacer ma progression</button>' +
        '<button type="button" class="btn btn-secondaire btn-bloc" data-conf="non">Annuler</button>';
      zoneConf.hidden = false;
      zoneConf.querySelector('[data-conf="oui"]').addEventListener('click', function () {
        MF.stockage.remplacer(r.etat);
        zoneConf.hidden = true;
        el.querySelector('#champ-import').value = '';
        el.querySelector('#champ-pseudo').value = etat().pseudo;
        msg('import', '✓ Progression importée.', 'juste');
      });
      zoneConf.querySelector('[data-conf="non"]').addEventListener('click', function () {
        zoneConf.hidden = true; msg('import', 'Import annulé.');
      });
    });

    action('reinitialiser', function () { el.querySelector('[data-zone="confirmer-reset"]').hidden = false; msg('reset', ''); });
    action('reset-non', function () { el.querySelector('[data-zone="confirmer-reset"]').hidden = true; msg('reset', 'Rien n\'a été effacé.'); });
    action('reset-oui', function () {
      MF.stockage.reinitialiser();
      el.querySelector('[data-zone="confirmer-reset"]').hidden = true;
      el.querySelector('#champ-pseudo').value = '';
      msg('reset', '✓ Progression effacée.', 'juste');
    });
  }

  /* ---------- Aide ---------- */
  var PARTAGER_IOS = '<svg class="ico-inline" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M8 9H6v11h12V9h-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 3v11M8.5 6.5L12 3l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MENU_ANDROID = '<svg class="ico-inline" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="12" cy="5" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="19" r="1.8" fill="currentColor"/></svg>';

  function ecranAide(el) {
    var h = '<div class="page">' +
      '<h1>Aide</h1>' +
      '<details class="carte" open><summary>Comment fonctionne le jeu ?</summary>' +
      '<ul class="liste-puces">' +
      '<li>Chaque question juste du premier coup rapporte <b>10 points</b> ; au 2e essai, <b>5 points</b>. Vous ne perdez jamais de points.</li>' +
      '<li>Plusieurs réponses justes du premier coup à la suite : bonus de série (+2 à chaque fois, jusqu\'à +10 par partie).</li>' +
      '<li>Étoiles d\'une partie : ★ dès 50 % des points possibles, ★★ dès 75 %, ★★★ à 100 % (tout juste du premier coup).</li>' +
      '<li>La <b>maîtrise</b> d\'un objectif compte vos réponses justes du premier coup parmi les 10 dernières.</li>' +
      '<li>Pas de chronomètre : prenez le temps de lire les explications.</li></ul></details>' +

      '<details class="carte"><summary>Où est enregistrée ma progression ?</summary>' +
      '<ul class="liste-puces">' +
      '<li>Uniquement <b>sur ce téléphone, dans ce navigateur</b>. Rien n\'est envoyé sur Internet.</li>' +
      '<li>Elle disparaît si vous effacez les données du site ou de l\'historique.</li>' +
      '<li>Sur iPhone, Safari peut effacer les données d\'un site que vous n\'avez pas ouvert pendant 7 jours d\'utilisation de Safari. <b>Ajoutez le site à l\'écran d\'accueil</b> pour éviter ce problème.</li>' +
      '<li>Sur iPhone, l\'icône de l\'écran d\'accueil garde sa propre progression, séparée de Safari : utilisez toujours l\'icône.</li>' +
      '<li>Pour changer de téléphone, utilisez le code de transfert (onglet <a href="#/profil">Profil</a>).</li></ul></details>' +

      '<details class="carte"><summary>Ajouter le site à l\'écran d\'accueil</summary>' +
      '<h3>iPhone (Safari)</h3><ol class="liste-etapes">' +
      '<li>Ouvrez le site dans Safari.</li>' +
      '<li>Touchez le bouton Partager ' + PARTAGER_IOS + ' (selon la version d\'iOS, il se trouve parfois dans le menu « ⋯ »).</li>' +
      '<li>Touchez « Sur l\'écran d\'accueil » (ou « Ajouter à l\'écran d\'accueil »).</li>' +
      '<li>Touchez « Ajouter ». Ouvrez ensuite toujours le site avec cette icône.</li></ol>' +
      '<h3>Android (Chrome)</h3><ol class="liste-etapes">' +
      '<li>Ouvrez le site dans Chrome.</li>' +
      '<li>Touchez le menu ' + MENU_ANDROID + ' en haut à droite.</li>' +
      '<li>Touchez « Ajouter à l\'écran d\'accueil » (ou « Installer l\'application »).</li>' +
      '<li>Confirmez. Ouvrez ensuite le site avec cette icône.</li></ol></details>' +

      '<details class="carte"><summary>Montrer mon bilan à l\'enseignant</summary>' +
      '<p>Ouvrez l\'onglet <a href="#/bilan">Mon bilan</a> et faites une capture d\'écran : tout tient sur un seul écran.</p></details>' +

      '<details class="carte"><summary>Confidentialité</summary>' +
      '<p>Ce site ne collecte aucune donnée : pas de compte, pas de statistiques, pas de publicité. Le prénom ou pseudo est facultatif et reste sur votre téléphone.</p></details>' +
      '<p class="version">Version : ' + ui.esc(window.TEXTES.version) + '</p></div>';
    el.innerHTML = h;
  }

  /* ---------- Routeur ---------- */
  var ROUTES = {
    'accueil': { f: ecranAccueil, titre: 'Accueil', nav: 'accueil' },
    'qcm': { f: function (el) { MF.qcm.ecranChoix(el); }, titre: 'Quiz express', nav: 'accueil' },
    'qcm/partie': { f: function (el) { MF.qcm.ecranPartie(el); }, titre: 'Quiz express', jeu: true },
    'qcm/resultat': { f: function (el) { MF.qcm.ecranResultat(el); }, titre: 'Résultat', nav: 'accueil' },
    'bilan': { f: ecranBilan, titre: 'Mon bilan', nav: 'bilan' },
    'profil': { f: ecranProfil, titre: 'Profil', nav: 'profil' },
    'aide': { f: ecranAide, titre: 'Aide', nav: 'aide' }
  };

  function router() {
    var cle = location.hash.replace(/^#\/?/, '') || 'accueil';
    var r = ROUTES[cle];
    if (!r) { ui.remplacer('#/accueil'); return; }
    if (cle === 'qcm/partie' && !MF.qcm.aUnePartie()) { ui.remplacer('#/qcm'); return; }
    if (cle === 'qcm/resultat' && !MF.qcm.aUnResultat()) { ui.remplacer('#/qcm'); return; }

    var app = document.getElementById('app');
    document.body.classList.toggle('en-jeu', !!r.jeu);
    document.querySelectorAll('#nav a').forEach(function (a) {
      if (a.getAttribute('data-nav') === r.nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = r.titre + ' — Mission Finder';
    app.innerHTML = '';
    r.f(app);
    window.scrollTo(0, 0);
    var t = app.querySelector('h1');
    if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }

  function majBandeau() {
    var b = document.getElementById('bandeau-stockage');
    b.textContent = window.TEXTES.stockageIndisponible;
    b.hidden = MF.stockage.estDisponible();
  }

  function demarrer() {
    MF.stockage.charger();
    majBandeau();
    MF.stockage.surChangementDisponibilite(majBandeau);
    window.addEventListener('hashchange', router);
    router();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
