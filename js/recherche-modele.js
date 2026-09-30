/* Mission Finder — « Détective du Finder » : moteur de recherche simulé (sans affichage).
   - Critères de la recherche avancée (⌘ F), combinés en ET ; une ligne incomplète est ignorée.
   - Majuscules et accents ignorés dans « contient » (« donnees » trouve « données »).
   - Dates « il y a N jours » calculées par rapport au jour de l'élève : les missions restent valables toute l'année.
   - Une mission est réussie quand l'ensemble affiché est exactement l'ensemble attendu
     (toute combinaison de critères qui donne cet ensemble est acceptée).
   Aussi testé avec Node : tests/test-recherche.js. */

(function () {
  'use strict';
  var MF = window.MF = window.MF || {};
  var R = function () { return window.RECHERCHE; };
  var JOUR = 86400000;

  function normalise(t) { return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function extension(nom) { var k = nom.lastIndexOf('.'); return k > 0 ? nom.slice(k + 1).toLowerCase() : ''; }
  function jourUTC(d) { return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); }
  function dateTexte(t) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t || ''); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null; }

  /* Date de modification (en ms, minuit UTC) d'un élément, par rapport à « aujourdhui » (Date). */
  function dateDe(el, aujourdhui) { return el.date ? dateTexte(el.date) : jourUTC(aujourdhui) - el.jours * JOUR; }

  function complete(l) {
    if (!l || !l.critere) return false;
    if (l.critere === 'Date de modification') {
      if (l.operateur === 'dans les derniers') return l.nombre > 0 && !!l.unite;
      return dateTexte(l.date) !== null;
    }
    if (l.critere === 'Nombre de pages') return typeof l.nombre === 'number' && isFinite(l.nombre) && l.nombre >= 0;
    return normalise(l.valeur) !== '';
  }

  function correspond(el, l, aujourdhui) {
    var v = normalise(l.valeur);
    switch (l.critere) {
      case 'Type': return el.type === l.valeur;
      case 'Nom': return normalise(el.nom).indexOf(v) >= 0;
      case 'Contenu': return (el.mots || []).some(function (m) { return normalise(m).indexOf(v) >= 0; });
      case 'Auteur': return !!el.auteur && normalise(el.auteur).indexOf(v) >= 0;
      case 'Extension': return el.genre === undefined && extension(el.nom) === v.replace(/^\./, '');
      case 'Date de modification':
        var d = dateDe(el, aujourdhui);
        if (l.operateur === 'dans les derniers') {
          var age = Math.round((jourUTC(aujourdhui) - d) / JOUR);
          return age >= 0 && age <= l.nombre * (l.unite === 'semaines' ? 7 : 1);
        }
        return l.operateur === 'avant le' ? d < dateTexte(l.date) : d > dateTexte(l.date);
      case 'Nombre de pages':
        if (typeof el.pages !== 'number') return false;
        return l.operateur === 'est supérieur à' ? el.pages > l.nombre : l.operateur === 'est inférieur à' ? el.pages < l.nombre : el.pages === l.nombre;
    }
    return false;
  }

  /* portee : « mac » (Ce Mac) ou le nom du dossier ouvert (« Documents »). */
  function dansPortee(el, portee) {
    return portee === 'mac' || el.dossier === portee || el.dossier.indexOf(portee + '/') === 0;
  }

  function rechercher(lignes, portee, aujourdhui) {
    var actives = (lignes || []).filter(complete);
    if (!actives.length) return [];
    return R().elements.filter(function (el) {
      return dansPortee(el, portee || 'mac') && actives.every(function (l) { return correspond(el, l, aujourdhui); });
    });
  }

  function mission(id) { return R().missions.filter(function (m) { return m.id === id; })[0]; }
  function ids(liste) { return liste.map(function (e) { return e.id; }).sort(); }
  function attendu(id, aujourdhui) { return rechercher(mission(id).solutions[0], 'mac', aujourdhui); }
  function s(n, mot) { return n + ' ' + mot + (n > 1 ? 's' : ''); }

  /* Vérifie la recherche de l'élève : { reussi, lignes: [{ ok, texte }] } (sans donner la solution). */
  function verifier(id, lignes, portee, aujourdhui) {
    var m = mission(id), actives = (lignes || []).filter(complete);
    if (!actives.length) return { reussi: false, lignes: [{ ok: false, texte: 'Ajoutez au moins un critère avec le bouton « + ».' }] };
    var obtenu = ids(rechercher(lignes, portee, aujourdhui)), voulu = ids(attendu(id, aujourdhui));
    var manque = voulu.filter(function (x) { return obtenu.indexOf(x) < 0; }).length;
    var enTrop = obtenu.filter(function (x) { return voulu.indexOf(x) < 0; }).length;
    if (!manque && !enTrop) return { reussi: true, lignes: [{ ok: true, texte: 'Exactement les ' + s(voulu.length, 'élément') + ' demandés.' }] };
    var res = [];
    if (manque) res.push({ ok: false, texte: 'Il manque ' + s(manque, 'fichier') + '.' });
    if (enTrop) res.push({ ok: false, texte: s(enTrop, 'fichier') + ' ' + (enTrop > 1 ? 'affichés ne correspondent' : 'affiché ne correspond') + ' pas à la demande.' });
    var utiliseContenu = m.solutions.some(function (sol) { return sol.some(function (l) { return l.critere === 'Contenu'; }); });
    if (portee !== 'mac') res.push({ ok: false, texte: 'Cherchez-vous bien dans « Ce Mac » ? Le dossier ouvert ne contient pas tous les fichiers.' });
    else if (utiliseContenu && actives.some(function (l) { return l.critere === 'Nom'; })) res.push({ ok: false, texte: '« Nom » cherche dans le nom du fichier ; ici, il faut chercher dans son texte.' });
    else if (actives.length < m.criteres) res.push({ ok: false, texte: 'Avez-vous combiné ' + m.criteres + ' critères ? Touchez « + » pour ajouter une ligne.' });
    else res.push({ ok: false, texte: 'Relisez la consigne : chaque mot compte (type, contenu, nom, date, nombre de pages…).' });
    return { reussi: false, lignes: res };
  }

  /* Spotlight : éléments dont le nom contient ce qui est écrit (majuscules et accents ignorés). */
  function spotlight(requete) {
    var r = normalise(requete);
    if (!r) return [];
    return R().elements.filter(function (el) { return normalise(el.nom).indexOf(r) >= 0; })
      .sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); });
  }

  function element(id) { return R().elements.filter(function (e) { return e.id === id; })[0]; }
  function genreTexte(el) { return el.genre === 'dossier' ? 'Dossier' : el.genre === 'application' ? 'Application' : 'Document'; }

  /* ---------- Mission 10 : photos mystères ---------- */

  function lieuCle(el) { return normalise(el.lieu.split(',')[0]); }

  function renommerPhoto(noms, id, nouveau) {
    var el = element(id);
    nouveau = String(nouveau || '').trim();
    if (!nouveau) return { ok: false, message: 'Le nom ne peut pas être vide.' };
    if (/[\/:]/.test(nouveau)) return { ok: false, message: 'Évitez les signes « / » et « : » dans un nom.' };
    if (extension(nouveau) !== extension(el.nom)) return { ok: false, message: 'Gardez l\'extension « .' + extension(el.nom) + ' » à la fin du nom : elle indique le type du fichier.' };
    var pris = Object.keys(noms).some(function (k) { return k !== id && noms[k].toLowerCase() === nouveau.toLowerCase(); });
    if (pris) return { ok: false, message: 'Une autre photo porte déjà ce nom.' };
    noms[id] = nouveau;
    return { ok: true };
  }

  function verifierPhotos(noms) {
    var res = mission('s10').photos.map(function (id) {
      var el = element(id), nom = normalise(noms[id]);
      var contenu = R().motsContenu[el.apercu].some(function (mot) { return nom.indexOf(mot) >= 0; });
      var lieu = nom.indexOf(lieuCle(el)) >= 0;
      if (contenu && lieu) return { ok: true, texte: '« ' + noms[id] + ' » dit ce que montre la photo et où elle a été prise.' };
      if (!contenu && !lieu) return { ok: false, texte: '« ' + noms[id] + ' » ne dit ni ce que montre la photo, ni où elle a été prise.' };
      return { ok: false, texte: '« ' + noms[id] + ' » ne dit pas ' + (contenu ? 'où la photo a été prise (lisez ses métadonnées).' : 'ce que montre la photo.') };
    });
    return { reussi: res.every(function (x) { return x.ok; }), lignes: res };
  }

  MF.rechercheModele = {
    normalise: normalise, extension: extension, dateDe: dateDe, complete: complete, correspond: correspond,
    rechercher: rechercher, attendu: attendu, verifier: verifier, mission: mission, ids: ids,
    spotlight: spotlight, element: element, genreTexte: genreTexte,
    renommerPhoto: renommerPhoto, verifierPhotos: verifierPhotos, lieuCle: lieuCle
  };
})();
