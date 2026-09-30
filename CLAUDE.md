# CLAUDE.md — Mission Finder

Ce fichier est lu au début de chaque session Claude Code. Il complète le cahier des charges
(`docs/cahier-des-charges.md`, à lire en entier avant toute tâche). **En cas de contradiction,
les décisions de la section 2 ci-dessous l'emportent sur le cahier des charges.**

---

## 1. Contexte en bref

- Site de révision gamifié, pour smartphone, préparant le **TE1** (fichiers et dossiers sous macOS)
  de la classe **1C** (1re année ECG, débutants complets) du Gymnase de Burier.
- Enseignant : informatique et physique, **niveau modeste en développement** (ne connaît ni Git en ligne
  de commande ni HTML/CSS/JS). Il ne tape **jamais** de commande et n'écrit **jamais** de code.
- Dépôt public `makkura9/mission-finder`, publié par GitHub Pages depuis `main`, dossier `/ (root)` :
  **https://makkura9.github.io/mission-finder/**
- Le dépôt **est** le site. `docs/` et `tests/` ne sont pas utilisés par le site (mais sont publics).

## 2. Décisions déjà prises (phase 0, validées par l'enseignant)

| Sujet | Décision |
|---|---|
| Nom | « Mission Finder », dépôt `mission-finder` |
| Légende du Bureau (tutoriel p. 1) | a Menu Pomme · b Barre des menus · c Disque (icône « DISQUE ») · d Dock · e Dossier de départ · f Corbeille |
| Tolérance des noms (atelier fichiers) | Noms imposés : **majuscules et accents exigés**, espaces de début/fin ignorés ; si seule une majuscule ou un accent diffère, message ciblé « Presque : vérifiez les majuscules et les accents de … ». Renommages libres (images) : mot-clé reconnu sans tenir compte des majuscules ni des accents |
| Chronomètre | **Jamais**, nulle part (y compris examen blanc) |
| Compte à rebours du TE1 | **Non** |
| Fichier de la mission bonus | `introduction-outils-informatiques-prenom-nom.pdf` (version sans espaces ni tiret long ; accepter tout `…-mot-mot.pdf` à la place de `prenom-nom`) |
| Horaire | `mon_horaire_2026_2027` (et non 2025_2026) |
| Formulaire de congé (ex. 1) | fichier fictif `demande_conge.pdf` dans Téléchargements, à ranger dans `Documents/Formulaires` |
| Charte graphique | « Léman » (bleu canard `#0D6B73` + corail `#C03E0A`, étoiles ambre `#B86E00`), mode sombre automatique ; jetons dans `css/style.css`, contrastes AA vérifiés |
| Système de score | Validé, implémenté dans `js/progression.js` et `js/modules/qcm.js` (voir section 4) |

## 3. Règles impératives (rappel du cahier des charges)

1. **Vouvoiement systématique** des élèves dans tous les textes (consignes, feedbacks, boutons, erreurs, badges). Vérifier avec `python3 tests/verifier_textes.py`.
2. **Rigueur absolue** : ne jamais inventer un comportement ou un libellé de macOS. En cas de doute, le signaler à l'enseignant et l'ajouter à la liste « à vérifier » du README.
3. **Rester dans le programme** (cahier des charges, section 2 et annexe A). ⌘ Y est exclu partout.
4. **Une phase à la fois**, puis arrêt et attente du « validé » de l'enseignant.
5. **Style des réponses à l'enseignant** : pas de préambule ; rappeler l'avancement (« Phase n/8 faite : … Suivant : … ») ; étapes numérotées, une action par étape, noms exacts des boutons ; listes de 5 éléments maximum ; estimations de temps chiffrées ; en cas d'erreur : la cause, puis la correction ; terminer par **une seule action** faisable en moins de 2 minutes. Expliquer tout terme technique en une phrase (branche, pull request, fusion…).
6. **Gamification sobre** : pas de classement, pas de points négatifs, pas de vies, pas de son, animations ≤ 400 ms et désactivées avec `prefers-reduced-motion`.

## 4. Architecture et conventions techniques

- HTML + CSS + JavaScript « vanilla », **sans module ES** (`<script type="module">` est bloqué en `file://`), sans framework, sans compilation, sans `npm` pour le site, **sans aucune ressource externe** (CDN, polices web, analytics).
- Scripts classiques chargés dans l'ordre par `index.html` ; espace de noms global `window.MF` (`MF.ui`, `MF.stockage`, `MF.progression`, `MF.figures`, `MF.qcm`).
- Données dans `data/*.js` (`window.QUESTIONS`, `window.OBJECTIFS`, `window.NIVEAUX`, `window.TEXTES`), **jamais** de `fetch` de JSON : le site doit marcher ouvert par double-clic.
- **Chemins relatifs uniquement** (`css/style.css`, jamais `/css/…`).
- Navigation par ancre : `#/accueil`, `#/qcm`, `#/qcm/partie`, `#/qcm/resultat`, `#/bilan`, `#/profil`, `#/aide` (routeur dans `js/app.js`).
- Le manifeste n'est déclaré qu'en `http(s)` (petit script dans `<head>`) pour éviter une erreur console en `file://`.
- Sauvegarde : `localStorage`, clé unique `missionFinder.v1`, objet avec `app` et `version` (migrations dans `js/storage.js`) ; toute lecture/écriture en `try/catch` ; repli en mémoire + bandeau si stockage indisponible ; export/import par code `MF1-` + base64 (UTF-8).
- Score : 10 points du premier coup, 5 au 2e essai, 0 ensuite ; bonus de série +2 par réponse juste **du premier coup** consécutive (dès la 2e), +10 max par partie ; étoiles sur points de base / (10 × n) : ★ ≥ 50 %, ★★ ≥ 75 %, ★★★ = 100 % ; missions (phases 5-6) : 100 points, ★★★ sans indice, ★★ avec indice, ★ avec le dernier indice. Maîtrise d'un objectif : % de justes du premier coup sur les 10 dernières réponses, « à découvrir » sous 3 réponses ; maîtrise d'un thème = moyenne des objectifs évalués. Niveaux dans `data/niveaux.js`.
- QCM : 1re erreur → réponse marquée ✗ + explication ciblée (`erreurs[i]`), bonne réponse **non** révélée, 2e essai ; vrai/faux : un seul essai ; ensuite bonne réponse + explication. Les points sont ajoutés à chaque réponse (rien n'est perdu si l'élève quitte).
- Illustrations : recréations vectorielles simplifiées (`js/figures.js`), aucun logo : menu Pomme = pomme générique, applications = carrés de couleur avec abréviation.
- Mobile d'abord : 360 px de référence, colonne 480 px max, cibles tactiles ≥ 44 px, champs ≥ 16 px, aucun survol ni glisser-déposer indispensable.
- Numéro de version affiché en bas de l'accueil et de l'aide : `window.TEXTES.version` dans `data/textes.js` — **le mettre à jour à chaque phase** (l'enseignant s'en sert pour vérifier la mise en ligne).

## 5. Tests (à lancer avant chaque livraison)

```
node tests/valider-donnees.js          # champs, id uniques, objectifs, ⌘ Y exclu…
python3 tests/verifier_textes.py       # vouvoiement, chemins absolus, ressources externes, poids
python3 tests/test_phase2.py           # Playwright : partie complète, sauvegarde, export/import, stockage bloqué, file://, 4 tailles
python3 tests/test_bilan_rempli.py     # « Mon bilan » rempli : aucun débordement
```

Les tests Playwright ont besoin de `pip install playwright` et d'un Chromium. **Non vérifié** dans
l'environnement cloud par défaut : si le navigateur ne peut pas être installé, le dire clairement à
l'enseignant et lui donner les vérifications manuelles équivalentes. `tests/relecture.html` produit le
document de relecture des questions (ouvrir dans Chromium, imprimer en PDF).

## 6. Livraison à l'enseignant (nouveau flux avec Claude Code)

1. Travailler sur une branche, lancer les tests, pousser la branche.
2. Dire à l'enseignant de cliquer **Create PR**, puis sur GitHub **Merge pull request** → **Confirm merge** (expliquer : « fusionner = publier les modifications dans la version principale »).
3. Attendre 1 à 3 minutes, puis vérifier le numéro de version en bas de l'accueil du site.
4. Fournir : « Ce qui a changé » (5 lignes max), captures si possible, 5 tests maximum à faire sur téléphone.

## 7. État d'avancement

| Phase | État |
|---|---|
| 0 Cadrage | ✅ validée |
| 1 GitHub + Pages | ✅ validée |
| 2 Squelette + Quiz express (20 questions pilotes) | ✅ en ligne ; **en attente** : relecture des 20 questions par l'enseignant et réponses aux points ouverts ci-dessous |
| 3 Banque QCM ≥ 80 questions + fichier de relecture + Leitner / Révision du jour | à faire (les boîtes de Leitner sont déjà mises à jour dans `etat.questions[id].boite`, 1 à 5) |
| 4 Raccourcis + Bureau | à faire |
| 5 Atelier fichiers | à faire |
| 6 Recherche | à faire (créer `data/libelles-macos.js`) |
| 7 Examen blanc, badges, finitions | à faire (examen blanc **sans** chronomètre) |
| 8 QR code, fiche élève, README final | à faire |

## 8. Points ouverts (réponses attendues de l'enseignant)

1. Libellé « Par galerie » (menu Présentation, macOS 15) — question fin-01.
2. Menus « Fichier, Édition, Affichage » d'Excel pour Mac — figure de bur-01.
3. Menu Pomme dessiné comme une pomme générique : choix à confirmer.
4. iPhone : progression de l'icône de l'écran d'accueil séparée de celle de Safari (écrit dans l'Aide, à confirmer) ; libellés exacts « Sur l'écran d'accueil » (iOS) et « Ajouter à l'écran d'accueil / Installer l'application » (Android).
5. Phase 6 : le lieu de prise de vue d'une photo s'affiche-t-il dans « Lire les informations » (⌘ I) du Finder, ou seulement dans l'inspecteur d'Aperçu ?
6. Sources non lues directement : les PDF du cours n'ont jamais été lus (seulement la transcription de l'annexe A). Signaler toute incertitude qui en découle.
