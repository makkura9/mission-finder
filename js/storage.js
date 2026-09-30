/* Mission Finder — sauvegarde de la progression (localStorage)
   - Une seule clé versionnée : « missionFinder.v1 ».
   - Toute lecture/écriture est protégée (try/catch) : si le stockage est
     indisponible (navigation privée, stockage bloqué), le site fonctionne
     en mémoire et un bandeau prévient l'élève.
   - Rien n'est jamais envoyé sur Internet. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};

  var CLE = 'missionFinder.v1';
  var VERSION = 1;
  var PREFIXE_CODE = 'MF1-';

  var disponible = false;
  var etat = null;
  var ecouteurs = [];

  function maintenant() { return new Date().toISOString(); }

  function etatInitial() {
    return {
      app: 'missionFinder',
      version: VERSION,
      creeLe: maintenant(),
      modifieLe: maintenant(),
      pseudo: '',
      points: 0,
      objectifs: {},   // code -> [1,0,1…] : 10 dernières réponses (1 = juste du premier coup)
      questions: {},   // id -> { vues, justes1, boite, derniere }
      activites: {},   // activité -> { parties, etoilesMax, records: { mode: points } }
      jours: []        // dates « AAAA-MM-JJ » des jours de révision
    };
  }

  function estObjet(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }
  function entierPositif(n) { return typeof n === 'number' && isFinite(n) && n >= 0 && Math.floor(n) === n; }

  /* Vérifie et nettoie un état (lu dans le stockage ou importé).
     Renvoie l'état nettoyé, ou null s'il est invalide. */
  function valider(o) {
    if (!estObjet(o) || o.app !== 'missionFinder') return null;
    if (!entierPositif(o.version) || o.version < 1 || o.version > VERSION) return null;
    if (!entierPositif(o.points)) return null;
    if (!estObjet(o.objectifs) || !estObjet(o.questions) || !estObjet(o.activites) || !Array.isArray(o.jours)) return null;

    var propre = etatInitial();
    propre.creeLe = typeof o.creeLe === 'string' ? o.creeLe : propre.creeLe;
    propre.modifieLe = typeof o.modifieLe === 'string' ? o.modifieLe : propre.modifieLe;
    propre.pseudo = typeof o.pseudo === 'string' ? o.pseudo.slice(0, 30) : '';
    propre.points = o.points;

    Object.keys(o.objectifs).forEach(function (code) {
      var h = o.objectifs[code];
      if (Array.isArray(h)) propre.objectifs[code] = h.filter(function (x) { return x === 0 || x === 1; }).slice(-10);
    });
    Object.keys(o.questions).forEach(function (id) {
      var q = o.questions[id];
      if (estObjet(q) && entierPositif(q.vues) && entierPositif(q.justes1) && entierPositif(q.boite)) {
        propre.questions[id] = { vues: q.vues, justes1: q.justes1, boite: Math.min(5, Math.max(1, q.boite)), derniere: typeof q.derniere === 'string' ? q.derniere : '' };
      }
    });
    Object.keys(o.activites).forEach(function (nom) {
      var a = o.activites[nom];
      if (!estObjet(a)) return;
      var records = {};
      if (estObjet(a.records)) Object.keys(a.records).forEach(function (m) { if (entierPositif(a.records[m])) records[m] = a.records[m]; });
      propre.activites[nom] = {
        parties: entierPositif(a.parties) ? a.parties : 0,
        etoilesMax: entierPositif(a.etoilesMax) ? Math.min(3, a.etoilesMax) : 0,
        records: records
      };
    });
    propre.jours = o.jours.filter(function (j) { return typeof j === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(j); }).slice(-120);
    return migrer(propre, o.version);
  }

  /* Migrations futures : transformer un état d'une version antérieure. */
  function migrer(e, versionLue) {
    // Version 1 : rien à migrer.
    e.version = VERSION;
    return e;
  }

  function testerStockage() {
    try {
      var cle = '__missionFinder_test__';
      window.localStorage.setItem(cle, '1');
      window.localStorage.removeItem(cle);
      return true;
    } catch (e) {
      return false;
    }
  }

  function charger() {
    disponible = testerStockage();
    var lu = null;
    if (disponible) {
      try {
        var brut = window.localStorage.getItem(CLE);
        if (brut) {
          try { lu = valider(JSON.parse(brut)); } catch (e) { lu = null; }
          if (!lu) {
            // Données illisibles : on les met de côté au lieu de les écraser.
            try { window.localStorage.setItem(CLE + '.illisible', brut); } catch (e2) { /* rien */ }
          }
        }
      } catch (e) {
        disponible = false;
      }
    }
    etat = lu || etatInitial();
    return etat;
  }

  function enregistrer() {
    etat.modifieLe = maintenant();
    if (!disponible) { signaler(); return false; }
    try {
      window.localStorage.setItem(CLE, JSON.stringify(etat));
      return true;
    } catch (e) {
      disponible = false;
      signaler();
      return false;
    }
  }

  function signaler() { ecouteurs.forEach(function (f) { try { f(disponible); } catch (e) { /* rien */ } }); }

  /* ---- Code de transfert (export / import) ---- */
  function versBase64(texte) {
    var octets = new TextEncoder().encode(texte);
    var binaire = '';
    for (var i = 0; i < octets.length; i++) binaire += String.fromCharCode(octets[i]);
    return btoa(binaire);
  }
  function depuisBase64(b64) {
    var binaire = atob(b64);
    var octets = new Uint8Array(binaire.length);
    for (var i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(octets);
  }

  function exporter() {
    return PREFIXE_CODE + versBase64(JSON.stringify(etat));
  }

  /* Analyse un code collé par l'élève. Ne modifie rien.
     Renvoie { ok: true, etat } ou { ok: false, message }. */
  function analyserCode(code) {
    var texte = String(code || '').replace(/\s+/g, '');
    if (!texte) return { ok: false, message: "Le champ est vide : collez d'abord votre code." };
    if (texte.indexOf(PREFIXE_CODE) !== 0) return { ok: false, message: "Ce code n'est pas un code Mission Finder : il doit commencer par « MF1- »." };
    var obj;
    try {
      obj = JSON.parse(depuisBase64(texte.slice(PREFIXE_CODE.length)));
    } catch (e) {
      return { ok: false, message: "Ce code est incomplet ou abîmé. Copiez-le à nouveau en entier, puis réessayez." };
    }
    var propre = valider(obj);
    if (!propre) return { ok: false, message: "Ce code ne contient pas une progression valide. Générez un nouveau code sur l'autre appareil." };
    return { ok: true, etat: propre };
  }

  function remplacer(nouvelEtat) {
    etat = nouvelEtat;
    return enregistrer();
  }

  function reinitialiser() {
    etat = etatInitial();
    return enregistrer();
  }

  MF.stockage = {
    CLE: CLE,
    charger: charger,
    etat: function () { return etat; },
    enregistrer: enregistrer,
    estDisponible: function () { return disponible; },
    surChangementDisponibilite: function (f) { ecouteurs.push(f); },
    exporter: exporter,
    analyserCode: analyserCode,
    remplacer: remplacer,
    reinitialiser: reinitialiser
  };
})();
