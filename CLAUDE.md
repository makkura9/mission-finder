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
| Menu Pomme (figures) | Pomme générique dessinée : **validé** (phase 3) |
| Libellés iPhone / Android (Aide) | Délégué à Claude (phase 3) : l'Aide garde les deux variantes (« Sur l'écran d'accueil » ou « Ajouter à l'écran d'accueil » ; « Ajouter à l'écran d'accueil » ou « Installer l'application ») |
| Mode hors ligne (service worker) | **Non** (phase 7) : le site demande une connexion ; ne pas en ajouter |
| Répétition espacée (phase 3) | Boîtes 1 à 5 ; retour après 0, 1, 3, 7, 14 jours (`js/leitner.js`) ; Révision du jour = 5 à 10 questions, d'abord les ratées, complétées par des nouvelles, thèmes entrelacés ; Quiz express = d'abord questions à revoir ou jamais vues |

## 3. Règles impératives (rappel du cahier des charges)

1. **Vouvoiement systématique** des élèves dans tous les textes (consignes, feedbacks, boutons, erreurs, badges). Vérifier avec `python3 tests/verifier_textes.py`.
2. **Rigueur absolue** : ne jamais inventer un comportement ou un libellé de macOS. En cas de doute, le signaler à l'enseignant et l'ajouter à la liste « à vérifier » du README.
3. **Rester dans le programme** (cahier des charges, section 2 et annexe A). ⌘ Y est exclu partout.
4. **Une phase à la fois**, puis arrêt et attente du « validé » de l'enseignant.
5. **Style des réponses à l'enseignant** : pas de préambule ; rappeler l'avancement (« Phase n/8 faite : … Suivant : … ») ; étapes numérotées, une action par étape, noms exacts des boutons ; listes de 5 éléments maximum ; estimations de temps chiffrées ; en cas d'erreur : la cause, puis la correction ; terminer par **une seule action** faisable en moins de 2 minutes. Expliquer tout terme technique en une phrase (branche, pull request, fusion…).
6. **Gamification sobre** : pas de classement, pas de points négatifs, pas de vies, pas de son, animations ≤ 400 ms et désactivées avec `prefers-reduced-motion`.

## 4. Architecture et conventions techniques

- HTML + CSS + JavaScript « vanilla », **sans module ES** (`<script type="module">` est bloqué en `file://`), sans framework, sans compilation, sans `npm` pour le site, **sans aucune ressource externe** (CDN, polices web, analytics).
- Scripts classiques chargés dans l'ordre par `index.html` ; espace de noms global `window.MF` (`MF.ui`, `MF.stockage`, `MF.progression`, `MF.leitner`, `MF.figures`, `MF.partie`, `MF.qcm`, `MF.clavier`, `MF.bureau`, `MF.atelierModele`, `MF.atelier`, `MF.rechercheModele`, `MF.recherche`, `MF.badges`, `MF.examen`).
- Données dans `data/*.js` (`window.QUESTIONS`, `window.OBJECTIFS`, `window.NIVEAUX`, `window.TEXTES`, `window.RACCOURCIS`, `window.BUREAU`, `window.ATELIER`, `window.LIBELLES_MACOS`, `window.RECHERCHE`, `window.BADGES`), **jamais** de `fetch` de JSON : le site doit marcher ouvert par double-clic.
- **Chemins relatifs uniquement** (`css/style.css`, jamais `/css/…`).
- Navigation par ancre : `#/accueil`, `#/qcm`, `#/qcm/partie`, `#/qcm/resultat`, `#/clavier`, `#/clavier/partie`, `#/clavier/resultat`, `#/bureau`, `#/bureau/partie`, `#/bureau/resultat`, `#/atelier`, `#/atelier/mission`, `#/recherche`, `#/recherche/mission`, `#/examen`, `#/examen/bilan`, `#/badges`, `#/bilan`, `#/profil`, `#/aide` (routeur dans `js/app.js`).
- Le manifeste n'est déclaré qu'en `http(s)` (petit script dans `<head>`) pour éviter une erreur console en `file://`.
- Sauvegarde : `localStorage`, clé unique `missionFinder.v1`, objet avec `app` et `version` (migrations dans `js/storage.js`) ; toute lecture/écriture en `try/catch` ; repli en mémoire + bandeau si stockage indisponible ; export/import par code `MF1-` + base64 (UTF-8).
- Score : 10 points du premier coup, 5 au 2e essai, 0 ensuite ; bonus de série +2 par réponse juste **du premier coup** consécutive (dès la 2e), +10 max par partie ; étoiles sur points de base / (10 × n) : ★ ≥ 50 %, ★★ ≥ 75 %, ★★★ = 100 % ; missions (phases 5-6) : 100 points, ★★★ sans indice, ★★ avec indice, ★ avec le dernier indice. Maîtrise d'un objectif : % de justes du premier coup sur les 10 dernières réponses, « à découvrir » sous 3 réponses ; maîtrise d'un thème = moyenne des objectifs évalués. Niveaux dans `data/niveaux.js`.
- QCM : 1re erreur → réponse marquée ✗ + explication ciblée (`erreurs[i]`), bonne réponse **non** révélée, 2e essai ; vrai/faux : un seul essai ; ensuite bonne réponse + explication. Les points sont ajoutés à chaque réponse (rien n'est perdu si l'élève quitte).
- Illustrations : recréations vectorielles simplifiées (`js/figures.js` : `barreMenus`, `dock`, `fichier`, `colonnes`, `barreLaterale`), aucun logo : menu Pomme = pomme générique, applications = carrés de couleur avec abréviation.
- Révision du jour : pas de nouvelle route ; `MF.qcm.demarrer('revision')` lance une partie du Quiz express en mode « revision ».
- Clavier secret et Visite du Mac (phase 4) : moteur commun `js/partie.js` (mêmes points, série, étoiles que le QCM ; 2 essais par étape).
  Clavier secret : 10 raccourcis par partie (6 à composer, 4 « Que fait… ? »), clavier virtuel à touches utiles en ordre alphabétique
  (⌘ ⇧ ⌥ restent enfoncés ; « puis Espace » en touchant Espace après la touche finale), suivi `etat.questions['clav-<id>']`
  (sert au futur badge « Maître des raccourcis » : `justes1` ≥ 2). Visite du Mac : 3 « Touchez… », 2 « Comment s'appelle… ? »,
  2 application active, 2 applications ouvertes, 1 Spotlight ; Dock = Finder + 3 applications tirées au hasard ; suivi `vis-…`.
- Le grand rangement (phase 5) : logique pure dans `js/atelier-modele.js` (testée par Node), écran dans `js/modules/finder.js`.
  Chaque mission part de la solution des précédentes (toutes jouables, dans l'ordre conseillé). Actions par « + » et « ⋯ »
  (« Déplacer vers… », « Copier vers… », « Décompresser » sont propres au site ; sur un Mac on glisse / double-clique : c'est écrit
  dans l'intro). Refus pédagogiques : extension modifiée, nom déjà pris (sans tenir compte des majuscules), dossier dans lui-même.
  Points : 100 à la **première** réussite d'une mission (0 ensuite, anti-« farming ») ; étoiles 3/2/1 selon les indices ;
  `activites.finder.records[mX]` = meilleures étoiles ; maîtrise : 1 réponse par réussite (1 si sans indice).
  Libellés incertains dans `data/libelles-macos.js` (listés dans le README).
- Détective du Finder (phase 6) : moteur `js/recherche-modele.js` (testé par Node sur 4 dates), écran `js/modules/recherche.js`,
  données `data/fichiers-virtuels.js` (51 éléments ; `jours` = modifié il y a N jours par rapport au jour de l'élève, ou `date` fixe).
  Partie A Spotlight (3 étapes) + missions 1-9 (⌘ F : « Ce Mac » / « Documents », lignes critère-opérateur-valeur en ET, ligne
  incomplète ignorée, majuscules et accents ignorés) + mission 10 photos mystères (panneau « Métadonnées de la photo », choix 1).
  Réussite = ensemble affiché exactement égal à l'attendu (toute combinaison acceptée). Pas de champ de recherche libre.
  Mêmes points et étoiles que l'atelier ; `activites.recherche.records[sX]`.
- Examen blanc (phase 7, `js/modules/examen.js`) : ouvert quand les 5 activités ont `parties ≥ 1` ; 20 questions (QCM mode « examen » :
  une par objectif + 1), 1 mission m6/m7/m8, 1 mission s3/s4/s6/s7/s9 (via `commencer(k, { examen: true })`, « Passer » possible) ;
  note : juste du 1er coup = 1, mission sans indice = 1, avec indice = 0,5 ; `activites.examen.records.blanc` = meilleur % ;
  recommandation si le thème le plus faible est < 80 %. Pas de chronomètre.
- Badges (phase 7) : 8, tous liés à une maîtrise (`data/badges.js` textes, `js/badges.js` conditions) ; `etat.badges[id]` = date
  d'obtention (champ facultatif : les anciens états se chargent) ; annoncés une fois sur l'accueil ; écran `#/badges`.
- Mobile d'abord : 360 px de référence, colonne 480 px max, cibles tactiles ≥ 44 px, champs ≥ 16 px, aucun survol ni glisser-déposer indispensable.
- Numéro de version affiché en bas de l'accueil et de l'aide : `window.TEXTES.version` dans `data/textes.js` — **le mettre à jour à chaque phase** (l'enseignant s'en sert pour vérifier la mise en ligne).

## 5. Tests (à lancer avant chaque livraison)

```
node tests/valider-donnees.js          # champs, id uniques, objectifs, ⌘ Y exclu, raccourcis de la fiche, ≥ 80 questions…
node tests/test-leitner.js             # boîtes de Leitner, délais, Révision du jour, entrelacement des thèmes
python3 tests/verifier_textes.py       # vouvoiement, chemins absolus, ressources externes, poids
python3 tests/test_phase2.py           # Playwright : partie complète, sauvegarde, export/import, stockage bloqué, file://, 4 tailles
python3 tests/test_phase3.py           # Playwright : Révision du jour de bout en bout, les 90 questions à 320 et 390 px
python3 tests/test_phase4.py           # Playwright : Clavier secret et Visite du Mac (parties, erreurs, Spotlight, 4 tailles, file://)
node tests/test-atelier.js             # Le grand rangement : 9 missions solubles, erreurs typiques refusées, actions
python3 tests/test_phase5.py           # Playwright : atelier (nouveau dossier, Presque, annuler, décompresser, déplacer, Corbeille, indices, 4 tailles)
node tests/test-recherche.js           # Détective : jeu discriminant (solutions justes, erreurs typiques refusées, 4 dates), messages
python3 tests/test_phase6.py           # Playwright : Spotlight, recherche avancée, photos mystères, 4 tailles, file://
python3 tests/test_phase7.py           # Playwright : examen blanc complet, badges, ancien état sans badges, 4 tailles, file://
python3 tests/test_bilan_rempli.py     # « Mon bilan » rempli : aucun débordement, ≤ 600 px de haut dès 360 px
python3 tests/test_phase8.py           # message clair si data/questions.js est cassé (3 erreurs du guide), fiche élève, QR code
```

Diffusion (phase 8) : `python3 tests/generer_diffusion.py` régénère `diffusion/qr-code-mission-finder.png`, `fiche-eleve.html`
et `fiche-eleve.pdf` (A4, deux demi-pages) ; nécessite `pip install segno` (et `opencv-python-headless` pour relire le QR code).
Si un fichier `data/*.js` ne se charge pas, `index.html` affiche « Site momentanément indisponible » avec le fichier et la ligne.

Environnement cloud (vérifié en phase 3) : Chromium est préinstallé (`/opt/pw-browsers`, révision 1194).
Installer la version de Playwright correspondante : `pip install playwright==1.56.0` (la dernière version
cherche un autre Chromium ; ne pas lancer `playwright install`). Si le navigateur ne peut pas être lancé,
le dire clairement à l'enseignant et lui donner les vérifications manuelles équivalentes.
`tests/relecture.html` produit le document de relecture des questions (en ligne :
https://makkura9.github.io/mission-finder/tests/relecture.html ; imprimer en PDF).

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
| 2 Squelette + Quiz express (20 questions pilotes) | ✅ validée (20 questions relues : toutes OK) |
| 3 Banque QCM (90 questions) + fichier de relecture + Leitner / Révision du jour + bilan compacté | ✅ validée (90 questions relues : toutes OK ; tests sur téléphone OK) |
| 4 Raccourcis (Clavier secret) + Bureau (Visite du Mac) | ✅ validée (textes relus, tests sur téléphone OK) |
| 5 Atelier fichiers (Le grand rangement) | ✅ validée (relecture et tests sur téléphone OK) |
| 6 Recherche (Détective du Finder) | ✅ validée (relecture et tests sur téléphone OK) |
| 7 Examen blanc, badges, finitions | ✅ validée (relecture et tests sur téléphone OK ; hors ligne : non) |
| 8 QR code, fiche élève, README final | livrée sur une branche ; **en attente** : impression d'essai de la fiche, scan du QR code, « validé » |

## 8. Points ouverts (réponses attendues de l'enseignant)

L'enseignant n'est pas au gymnase (phase 3) : « faire au mieux ». Les libellés ci-dessous sont conservés
et restent dans la liste « à vérifier » du README ; aucune nouvelle question ne repose sur un libellé incertain.

1. Libellé « Par galerie » (menu Présentation, macOS 15) — question fin-01.
2. Menus « Fichier, Édition, Affichage » d'Excel pour Mac — figure de bur-01.
3. Lieu de prise de vue d'une photo (⌘ I du Finder ou Aperçu ?) : **décidé en phase 6** (choix 1 de l'enseignant) — le site affiche un panneau « Métadonnées de la photo » sans nommer l'outil macOS ; rien n'affirme où le lieu apparaît sur un vrai Mac.

## 9. Sources du cours (PDF lus en phase 3)

Les trois documents (tutoriel 4 pages, fiche des raccourcis, énoncés) ont été lus en phase 3, captures
comprises. L'annexe A du cahier des charges est fidèle. Constats :

1. Tutoriel p. 1 : la capture du Bureau a le fond d'écran de macOS Catalina ; les captures du Finder (p. 2-3) ont le style des versions récentes. Aucun PDF n'indique « macOS 15 ».
2. Tutoriel p. 1 : ouverts (point sous l'icône) = Finder, Safari, Word, une application à jumelles (non identifiée), PowerPoint ; application active = Finder. Une icône « Homedir » (non légendée) est aussi sur le Bureau.
3. Tutoriel p. 2 : barre latérale = Favoris (AirDrop, Récents, Applications, Documents, « Optimisation de rec… », Téléchargements, Bureau), Emplacements (lm056341, OneDrive), Tags.
4. Tutoriel p. 3 : l'utilitaire ZIP est nommé « Archive Utility » (nom anglais) ; horaire « mon_horaire_2025_2026 » (le site suit la décision 2026_2027). Tutoriel p. 4 : chemins écrits « 1C\Bureautique\Word » ; icône OneDrive (nuage) dans la barre des menus pour vérifier la synchronisation.
5. Fiche des raccourcis : « Mac OS X », septembre 2025 ; ⌘ Y (« Répéter une action ») y figure mais reste exclu du site.
