# Cahier des charges — Mission Finder

> Texte d'origine rédigé par l'enseignant (phase 0). Les décisions prises ensuite sont dans
> `CLAUDE.md`, section 2, et l'emportent sur ce document en cas de contradiction.

### 0. Ton rôle et tes règles de conduite

Tu es à la fois **développeur web front-end**, **concepteur pédagogique** et **accompagnant technique** d'un enseignant.

**Qui je suis.** Je suis professeur d'informatique et de physique au Gymnase de Burier (canton de Vaud, Suisse). J'enseigne l'informatique à la classe **1C** (1re année d'école de culture générale, ECG). Mes élèves sont des **débutants complets** en informatique ; ils travaillent sur **Mac (macOS)** en classe. **Mon propre niveau en informatique est modeste** : je ne connais ni Git en ligne de commande, ni HTML/CSS/JavaScript.

**Ce que je veux.** Un **site web de révision, optimisé pour smartphone, hébergé gratuitement sur GitHub Pages**, qui prépare mes élèves au **TE1** (travail écrit) sur la gestion des fichiers et dossiers sous macOS. Le site est un **jeu** : chaque partie donne un score, et la progression de l'élève est **mémorisée dans son navigateur**.

**Règles impératives (non négociables) :**

1. **Vouvoiement systématique des élèves** dans *tous* les textes du site (consignes, feedbacks, boutons, messages d'erreur, badges). Aucun « tu ». Vérifie-le à la fin de chaque phase par une recherche automatique (`\btu\b`, `\bton\b`, `\bta\b`, `\btes\b`, `\btoi\b`, impératifs en « -e » du tutoiement comme « clique », « choisis », « essaie »…) et corrige.
2. **Rigueur absolue.** Mieux vaut écrire « je ne sais pas » ou « à vérifier par l'enseignant » que d'affirmer quelque chose de faux. Aucune question, réponse ou explication ne doit contredire les documents de cours. Si tu as un doute sur un comportement de macOS (libellé exact d'un menu, d'un critère de recherche…), **signale-le-moi** au lieu d'inventer.
3. **Rester dans le programme.** Tout le contenu provient des documents de cours (section 2 et annexe A). Tu n'ajoutes pas de notion hors programme sans me le proposer d'abord.
4. **Travail par étapes, avec validation.** Tu avances **une phase à la fois** (section 9). À la fin de chaque phase : tu me livres les fichiers, tu m'expliques quoi en faire, tu me donnes une liste de tests à faire, puis **tu t'arrêtes et attends mon « validé »** (ou mes corrections) avant de continuer.
5. **Tu crées toi-même tous les fichiers.** Je ne dois jamais écrire ni recopier de code. Tu me livres des fichiers prêts à l'emploi (et une archive .zip du site complet à chaque phase). Si un dossier de mon ordinateur est connecté, écris-y directement les fichiers, dans un sous-dossier `site-mission-finder/`.
6. **Guidage pas à pas pour moi.** Chaque manipulation que je dois faire (GitHub, test sur téléphone…) est décrite en **étapes numérotées, une action par étape**, avec le nom exact des boutons à cliquer, ce que je dois voir à l'écran, et quoi faire si ça ne se passe pas comme prévu. Pas de jargon non expliqué (si tu dois dire « dépôt », « commit », « branche », explique en une phrase).
7. **Style de tes réponses pour moi :** pas de préambule ; commence par l'action. Rappelle l'avancement à chaque message (« Phase n/N faite : … Suivant : … »). Termine chaque message par **une seule action concrète** que je peux faire en moins de 2 minutes. Estimations de temps chiffrées. En cas d'erreur : la cause, puis la correction.

---

### 1. Sources à lire en premier

Si le dossier `TE1 - Entrainement` dans "C:\Users\alexa\Claude\2026-2027\1C\TE1 - Entrainement" est connecté, **lis intégralement** ces trois fichiers avant toute chose (les PDF contiennent des captures d'écran : regarde les pages en image, pas seulement le texte extrait) :

- `3. Tutoriel gestion des fichiers et des dossiers.pdf` (4 pages) ;
- `Raccourcis_claviers.pdf` (1 page) ;
- `Énoncés des exercices.txt` (exercices 1, 2, 4 et 5).

Si tu n'y as pas accès, l'**annexe A** de ce prompt en contient une transcription fidèle, suffisante pour travailler.

Après lecture, fais-moi un **résumé en 10 lignes maximum** de ce que tu as compris du programme, puis pose-moi les **questions de la section 10** (décisions à trancher). N'écris aucun code avant mes réponses.

---

### 2. Objectifs d'apprentissage couverts (référentiel du site)

Chaque question et chaque mission du site est rattachée à **un** de ces objectifs (identifiant entre crochets). Le site calcule une **maîtrise par objectif**.

**[BUR] Environnement macOS — le Bureau**
- BUR1 : Nommer les éléments du Bureau : menu Pomme, barre des menus, disque (volume) sur le Bureau, Dock, Corbeille, etc. (légende a–f du tutoriel, page 1).
- BUR2 : Identifier l'application active (son nom apparaît en gras à côté du menu Pomme dans la barre des menus).
- BUR3 : Reconnaître une application ouverte (petit point sous son icône dans le Dock).
- BUR4 : Ouvrir le Finder ou une application via Spotlight (loupe en haut à droite, ou ⌘ Espace).

**[FIN] Gestion des fichiers et dossiers dans le Finder**
- FIN1 : Se repérer dans la barre latérale (Favoris : AirDrop, Récents, Applications, Documents, Téléchargements, Bureau ; Emplacements : OneDrive…).
- FIN2 : Changer le mode de présentation (icônes, liste, **colonnes**, galerie) et lire un chemin en présentation par colonnes.
- FIN3 : Créer un dossier, créer une arborescence imbriquée.
- FIN4 : Déplacer, copier, renommer, supprimer (Corbeille) un fichier ou un dossier.
- FIN5 : Repérer et supprimer des doublons.
- FIN6 : Donner un nom de fichier explicite (renommer les images « PIXNIO… » ou sans nom explicite ; convention `prenom-nom`, `mon_horaire_2025_2026`…).
- FIN7 : Compresser (créer une archive .zip) et décompresser.
- FIN8 : Comprendre le rôle de OneDrive (dossier synchronisé dans la barre latérale).

**[TYP] Types de fichiers**
- TYP1 : Associer une extension à son type et à son usage : DOCX, XLSX, PDF, JPG, PNG, ZIP, MP3, MP4 (définitions de l'annexe A.3, à respecter mot pour mot sur le fond).
- TYP2 : Choisir le bon dossier de rangement selon le type et le contenu (ex. : une brochure PDF → `Documents/Brochures`, une photo de montagne → `Images/Montagne`).

**[RAC] Raccourcis clavier macOS** — les 20 raccourcis retenus de la fiche (annexe A.2), dans les deux sens : raccourci → action, action → raccourci.

**[REC] Recherche de documents**
- REC1 : Spotlight (⌘ Espace) pour ouvrir un document, une application, un dossier.
- REC2 : Recherche avancée du Finder (⌘ F) : choisir l'étendue (« Ce Mac » ou le dossier courant), ajouter des critères avec le bouton **+**, combiner plusieurs critères.
- REC3 : Critères du programme : type (archive, PDF, image, vidéo…), contenu (« le contenu contient… »), nom (« le nom contient… »), date de modification (dans les N derniers jours/semaines, avant une date), auteur, extension de fichier, nombre de pages. (Exercices 4 et 5.)
- REC4 : Lire les métadonnées d'un fichier (⌘ I, « Lire les informations ») : lieu de prise de vue d'une photo, auteur, dimensions, dates.

---

### 3. Ce que dit la recherche sur la gamification — et comment en tenir compte

Tu dois appliquer les principes ci-dessous. Ils résument l'état de la recherche ; respecte-les même si un autre choix te semblerait « plus fun ».

**Ce qui fonctionne :**

- **La gamification a un effet positif mais modeste.** Méta-analyse de Sailer & Homner (2020, *Educational Psychology Review*) : effets de g = 0,49 sur les apprentissages cognitifs, 0,36 sur la motivation, 0,25 sur le comportement ; seuls les effets cognitifs restent stables dans les études rigoureuses. → **Le jeu est au service de l'apprentissage, jamais l'inverse.** Pas de fioritures qui ralentissent la révision.
- **Une fiction légère aide**, surtout pour l'engagement (même méta-analyse). → Un habillage simple : l'élève est « stagiaire au service informatique du gymnase » et accomplit des **missions** (ranger, retrouver, compresser). Une phrase de contexte par mission, pas plus.
- **L'effet test (retrieval practice)** : se tester fait mieux apprendre que relire, surtout avec **un feedback immédiat** (Karpicke, 2017 ; Butler & Roediger, 2008 : le feedback après un QCM réduit de moitié la reprise des mauvaises réponses). → **Chaque réponse est suivie immédiatement d'un feedback explicatif** (pourquoi c'est juste, pourquoi le distracteur choisi est faux), avec la bonne réponse visible.
- **Des distracteurs plausibles** rendent le QCM plus efficace (Little et al., 2012). → Les mauvaises réponses sont des **erreurs réelles d'élèves** (confondre PNG et JPG, ⌘ N et ⌘ ⇧ N, « Nom » et « Contenu » dans la recherche…), jamais des réponses absurdes.
- **La répétition espacée et l'entrelacement** battent la répétition massée (Karpicke & Roediger, 2007 ; méta-analyses sur l'espacement). → Système de **boîtes de Leitner** : une question ratée revient plus tôt ; une question réussie plusieurs fois s'espace. Un mode « Révision du jour » mélange les thèmes.
- **Autonomie et sentiment de compétence** (théorie de l'autodétermination). Li, Hew & Du (2024) : la gamification améliore la motivation intrinsèque, mais les classes gamifiées échouent souvent à soutenir le **sentiment de compétence**. → L'élève **choisit** son activité ; la difficulté est **progressive** ; la progression est visible **par objectif** (« Types de fichiers : 80 % maîtrisé ») ; des **indices** sont toujours disponibles.

**Ce qui ne fonctionne pas (à éviter) :**

- **Classements publics et badges « à collectionner »** : Hanus & Fox (2015) ont observé, sur un semestre, une baisse de la motivation, de la satisfaction et des notes d'examen dans un cours gamifié avec classement et badges, via une baisse de la motivation intrinsèque. → **Aucun classement entre élèves.** On compare l'élève **à lui-même** (record personnel, progression).
- **Récompenses sans lien avec la maîtrise** (points pour s'être connecté, loot aléatoire) : elles orientent vers le « farming » plutôt que l'apprentissage. → Les étoiles et badges récompensent **uniquement** la maîtrise démontrée.
- **Punition et pression excessives** : vies perdues qui bloquent, points négatifs, chronomètre imposé, série quotidienne qui « se casse » et culpabilise. → **Pas de points négatifs, pas de vies, chronomètre optionnel**, et une éventuelle série de jours est formulée positivement (« 3 jours de révision cette semaine »), jamais comme une perte.
- **Surcharge visuelle** : animations longues, sons automatiques, confettis à chaque clic. → Animations courtes (≤ 400 ms), sobres, désactivées si le téléphone demande de réduire les animations (`prefers-reduced-motion`). **Aucun son par défaut.**

**Traduction concrète : système de score (proposition à me faire valider en phase 0)**

- **Partie** = une série courte : 10 questions (QCM, raccourcis) ou 1 mission (Finder, recherche). Durée cible : **3 à 5 minutes**.
- **Points** : 10 points par bonne réponse du premier coup ; 5 points si correcte au 2e essai (QCM) ; 0 ensuite. **Jamais négatif.** Petit bonus de série dans une même partie (+2 par réponse consécutive juste, plafonné à +10).
- **Étoiles par partie** : ★ ≥ 50 %, ★★ ≥ 75 %, ★★★ = 100 % (ou mission réussie sans indice).
- **Indices** : gratuits en points, mais une mission réussie avec indice plafonne à ★★.
- **Record personnel** par activité, affiché à la fin de chaque partie (« Nouveau record ! » quand c'est le cas).
- **Niveau global** (1 à 10) calculé sur les points cumulés, avec un nom simple (« Stagiaire », « Assistant·e », … « Expert·e du Finder »).
- **Maîtrise par objectif** (section 2) : pourcentage de réussite sur les 10 dernières réponses de cet objectif, affiché en barres de progression.
- **Badges : 8 au maximum**, tous liés à une maîtrise (ex. « Maître des raccourcis » : 20 raccourcis réussis au moins 2 fois chacun ; « Détective » : toutes les missions de recherche réussies).

---

### 4. Contraintes techniques

**Hébergement et architecture**

- **GitHub Pages**, dépôt **public**, site statique : **HTML + CSS + JavaScript « vanilla »** (aucun framework, aucune étape de compilation, aucun `npm`). Je dois pouvoir modifier une question en éditant un fichier texte sur github.com.
- **Aucune ressource externe** : pas de CDN, pas de Google Fonts, pas de script d'analyse, pas de publicité, pas de traceur. Tout est dans le dépôt (police système du téléphone). Raison : protection des données des élèves (nLPD suisse) et fonctionnement hors ligne.
- **Chemins relatifs uniquement** (`css/style.css`, jamais `/css/style.css`) : le site sera servi sous `https://<compte>.github.io/<depot>/` et les chemins absolus casseraient tout.
- **Navigation par ancre** (`#/accueil`, `#/qcm`, `#/finder`…) dans une page unique `index.html` : pas d'erreur 404 au rechargement, bouton « retour » du téléphone fonctionnel.
- **Données de contenu dans des fichiers `.js`** (ex. `data/questions.js` qui définit `window.QUESTIONS = [...]`) et **non en `.json` chargé par `fetch`** : ainsi le site fonctionne aussi quand j'ouvre `index.html` par double-clic sur mon PC (le `fetch` de fichiers locaux est bloqué par les navigateurs).
- Ajoute un fichier vide `.nojekyll` à la racine.
- Ajoute un `manifest.webmanifest` et une icône `apple-touch-icon` (180×180 px, que tu génères toi-même) pour que les élèves puissent **ajouter le site à l'écran d'accueil**. Un service worker hors ligne est **optionnel** : propose-le seulement en phase finale, avec une explication des avantages et du risque de cache obsolète après mise à jour.

**Arborescence cible (à adapter si justifié) :**

```
index.html
.nojekyll
manifest.webmanifest
README.md                  ← guide pour l'enseignant (en français, simple)
css/style.css
js/app.js                  ← routeur, écran d'accueil, profil, score
js/storage.js              ← sauvegarde (localStorage)
js/leitner.js              ← répétition espacée
js/modules/qcm.js
js/modules/raccourcis.js
js/modules/bureau.js
js/modules/finder.js       ← atelier fichiers et dossiers
js/modules/recherche.js    ← recherche avancée + Spotlight
data/questions.js          ← banque QCM
data/raccourcis.js
data/bureau.js
data/missions-finder.js
data/missions-recherche.js
data/fichiers-virtuels.js  ← système de fichiers fictif + métadonnées
img/                       ← icônes SVG (dessinées par toi), apple-touch-icon.png
```

**Sauvegarde de la progression**

- J'ai parlé de « cookies » : utilise **`localStorage`** (même principe pour l'élève, mais ~5 Mo au lieu de 4 Ko, et rien n'est envoyé au serveur à chaque visite). Explique-moi ce choix en 3 lignes.
- Une seule clé, versionnée : `missionFinder.v1`, contenant un objet JSON avec un champ `version` pour permettre des migrations futures.
- **Toute lecture/écriture dans un `try/catch`**. Si le stockage est indisponible (navigation privée, stockage bloqué), le site fonctionne quand même en mémoire et affiche un bandeau discret : « Votre progression ne pourra pas être enregistrée sur cet appareil (navigation privée ?). »
- **Aucune donnée personnelle obligatoire.** Un prénom ou pseudo **facultatif**, stocké uniquement sur le téléphone, pour personnaliser l'accueil.
- **Limites à expliquer aux élèves dans une page « Aide »** : la progression est liée à ce téléphone et à ce navigateur ; elle disparaît si l'on efface les données du site ; sur iPhone, Safari peut effacer les données d'un site non visité pendant 7 jours d'utilisation de Safari — **ajouter le site à l'écran d'accueil** évite ce problème (procédure illustrée pour iPhone et Android).
- **Exporter / importer la progression** : un bouton génère un code texte (JSON encodé en base64) à copier, et un champ permet de le recoller sur un autre appareil. Validation du code importé (message clair si le code est invalide).
- **Réinitialiser** : bouton avec confirmation explicite.
- **Bilan à montrer à l'enseignant** : un écran « Mon bilan » (niveau, maîtrise par objectif, étoiles par activité, date) conçu pour être **capturé en une seule capture d'écran** de téléphone. Rien n'est envoyé nulle part.

**Ergonomie smartphone (priorité absolue)**

- Conception **mobile d'abord**, en portrait, largeur de référence **360 px** ; aucun défilement horizontal ; lisible et utilisable jusqu'à 320 px ; correct sur tablette et ordinateur (colonne centrale de 480 px max).
- **Zones tactiles ≥ 44 × 44 px**, espacées ; boutons principaux en bas de l'écran (zone du pouce).
- **Aucun survol (hover) nécessaire**, **aucun glisser-déposer obligatoire** (peu fiable au doigt) : on **touche** un élément pour le sélectionner, puis on choisit une action (« Déplacer vers… », « Renommer », « Placer dans la Corbeille »). Le glisser-déposer peut exister en plus sur ordinateur, jamais comme seule voie.
- Clavier virtuel : champs de saisie de taille ≥ 16 px (évite le zoom automatique d'iOS), `autocapitalize="off"` et `autocorrect="off"` pour les noms de fichiers.
- Contraste conforme **WCAG 2.1 AA** ; information jamais transmise par la seule couleur (juste/faux = couleur **+** icône **+** texte) ; mode sombre automatique (`prefers-color-scheme`).
- Textes courts : **une consigne = une phrase**, vocabulaire de débutant, termes macOS exacts en français.
- Chargement rapide : page d'accueil utilisable en < 2 s en 4G ; poids total du site < 1 Mo (hors éventuelles images).

**Fidélité à macOS**

- Les interfaces simulées (Bureau, Finder, recherche avancée, Spotlight) sont des **recréations vectorielles simplifiées** (SVG / HTML-CSS) inspirées de macOS — **pas de captures d'écran**, pas de logos Apple ni d'icônes officielles recopiées. Dessine des icônes génériques (dossier bleu, document, image, archive…).
- **Libellés en français, identiques à macOS** autant que possible (ex. : « Lire les informations », « Nouveau dossier », « Placer dans la Corbeille », « Compresser », « Présentation », « Ce Mac »). La version de référence est celle des Mac du gymnase (**macOS 15 Sequoia** d'après les PDF du cours).
- **Libellés de la recherche avancée : décision de l'enseignant.** Les critères portent **exactement les noms utilisés dans les énoncés des exercices 4 et 5** (voir section 5.5). Tu n'en ajoutes pas d'autres et tu ne les renommes pas.
- **Tout autre libellé macOS dont tu n'es pas certain** est placé dans un **fichier de libellés unique** (`data/libelles-macos.js`) et listé dans le README comme « à vérifier sur un Mac du gymnase ». Tu me le signales explicitement.

---

### 5. Les activités (modules) du site

L'écran d'accueil affiche : le prénom facultatif, le niveau, une carte **« Révision du jour »** (5 à 10 questions tirées de la file Leitner, tous thèmes mélangés), puis **5 cartes d'activités** avec leurs étoiles et leur maîtrise. Un bouton **« Examen blanc »** apparaît quand chaque activité a été jouée au moins une fois.

#### 5.1 Module QCM — « Quiz express »

- Banque d'au moins **80 questions** couvrant **tous** les objectifs de la section 2, réparties ainsi (à ajuster) : BUR 10, FIN 25, TYP 15, RAC 15, REC 15.
- Formats : choix unique (4 propositions), choix multiple (clairement signalé « Plusieurs réponses possibles »), vrai/faux justifié, **question sur image** (un mini-Finder ou un Dock dessiné en SVG : « Quelle est l'application active ? »), **« Où ranger ce fichier ? »** (TYP2).
- Chaque question contient : `id`, `objectif`, `difficulte` (1–3), `enonce`, `propositions`, `bonnes`, `explication` (2 lignes max), `source` (document et page du cours d'où elle est tirée).
- Ordre des questions **et** des propositions mélangé à chaque partie ; pas deux fois la même question dans une partie.
- Feedback immédiat après chaque réponse (voir section 3), bouton « Suivant » en bas.
- Mode d'entraînement par objectif (l'élève choisit un thème) et mode mélangé.

#### 5.2 Module Raccourcis — « Clavier secret »

- Un **clavier Mac virtuel simplifié** à l'écran avec les touches **⌘ cmd**, **⇧ maj**, **⌥ alt/option**, **esc**, **⇥ tab**, **espace** et les lettres/chiffres utiles. L'élève touche les modificateurs (ils restent « enfoncés », visuellement), puis la touche finale, puis « Valider ».
- Deux sens : « Quelle combinaison pour **Créer un nouveau dossier** ? » (composer) et « Que fait **⌘ ⇧ 4** ? » (QCM).
- Cas particulier de la fiche : **⌘ ⇧ 4 puis Espace** (capture de la fenêtre active) est une **séquence** en deux temps ; ton clavier virtuel doit la gérer.
- Les 20 raccourcis de l'annexe A.2 et **uniquement eux**, avec la formulation de la fiche. **⌘ Y est exclu** (décision de l'enseignant) : il n'apparaît nulle part sur le site, ni comme bonne réponse ni comme distracteur.

#### 5.3 Module Bureau — « Visite du Mac »

- Une **recréation vectorielle du Bureau macOS** (barre des menus avec menu Pomme et nom de l'application active, icône de disque sur le Bureau, Dock avec applications ouvertes signalées par un point, Corbeille).
- Jeu de légende : « Touchez **le Dock** », « Touchez **le menu Pomme** »… puis l'inverse (on montre un élément, l'élève choisit son nom).
- Questions « Quelle est l'application active ? » et « Citez une application ouverte » sur des bureaux générés avec des variantes (application active et applications ouvertes tirées au hasard).
- Mini-scène Spotlight : barre de recherche simulée, l'élève tape « Finder » et touche le bon résultat.

#### 5.4 Module Atelier fichiers — « Le grand rangement »

Un **mini-Finder simulé** en présentation **par colonnes** (adaptée au mobile : une colonne visible à la fois, avec un fil d'Ariane du chemin en haut, et flèche retour), avec une barre latérale repliable (Bureau, Documents, Téléchargements, OneDrive).

Actions disponibles par un bouton « ⋯ » sur l'élément sélectionné et un bouton « + » dans la barre d'outils : **Nouveau dossier, Renommer, Déplacer vers…, Copier vers…, Compresser, Décompresser (sur un .zip), Placer dans la Corbeille, Lire les informations**. Un bouton **Annuler (⌘ Z)** annule la dernière action.

**Missions** (progressives, chacune avec un court contexte narratif, un objectif clair et une vérification automatique) :

1. Créer le dossier `Exercice_finder` sur le Bureau.
2. Y créer `Documents` et `Images`.
3. Créer `Web`, `Brochures`, `Formulaires`, `Tutoriels` dans `Documents` ; `Ville`, `Montagne`, `Plage` dans `Images`.
4. Décompresser `Finder_Exercice1_2627.zip` (contenu fictif que tu inventes, cohérent avec l'exercice 1 : brochures PDF, formulaires, pages web, tutoriels, photos de ville, montagne, plage).
5. Ranger chaque fichier dans le bon dossier.
6. Supprimer les doublons (fichiers de même contenu, avec des noms comme `brochure (1).pdf` ou `copie de…`).
7. Renommer les images au nom non explicite (`IMG_4032.jpg`, `PIXNIO-123456-1200x800.jpg`) d'après leur contenu (l'élève voit un aperçu de l'image : dessin SVG simple d'une ville, d'une montagne, d'une plage).
8. Compresser les dossiers `Brochures` et `Montagne`.
9. Mission bonus inspirée du tutoriel : créer `1C/Bureautique/{1. Gestion des fichiers et dossiers, 2. Internet et Web, 3. Word, 4. Excel}`, ranger `mon_horaire_2025_2026.png`, renommer un fichier `introduction-outils-informatiques-prenom-nom.pdf`.

**Vérification** : à la demande (« Vérifier ma mission »), le site compare l'arborescence de l'élève à l'état attendu et affiche **ce qui est juste et ce qui manque**, élément par élément, sans donner directement la solution. Tolérance à définir avec moi : casse des noms (majuscules), espaces superflus, accents. Par défaut : casse et accents **exigés** pour les noms imposés par la consigne (les élèves doivent apprendre la précision), espaces de début/fin ignorés. Pour les renommages libres (images), accepte tout nom contenant un mot-clé attendu (ex. « montagne », « Cervin »…) listé dans les données.

#### 5.5 Module Recherche — « Détective du Finder »

**Partie A — Spotlight** : ouvrir un document, une application (Calculette) ou un dossier (Téléchargements) en tapant dans une barre Spotlight simulée ; résultats filtrés en direct.

**Partie B — Recherche avancée (⌘ F)**, fidèle au fonctionnement de macOS :

- Une fenêtre Finder simulée avec un champ de recherche et la barre « Rechercher : **Ce Mac** / *dossier courant* ».
- Un bouton **+** ajoute une ligne de critère. Chaque ligne = un menu **critère** + un menu **opérateur** + une **valeur** (menu ou champ).
- **Critères (liste fermée, noms repris des énoncés) : Type, Nom, Contenu, Date de modification, Auteur, Extension, Nombre de pages.** Aucun autre critère, pas de menu « Autre… ».
- **Valeurs du critère Type** (termes des énoncés) : Archive, PDF, Image, Vidéo, plus les distracteurs utiles au jeu de données : Document, Texte, Musique, Dossier, Application.
- **Opérateurs** : contient (Nom, Contenu, Auteur), est (Type, Extension), dans les derniers N jours/semaines, avant le, après le (Date de modification), est supérieur à / est inférieur à / est égal à (Nombre de pages). Un bouton **−** supprime la ligne. Les critères se combinent en **ET**.
- Les résultats s'affichent **en direct** dans la fenêtre à chaque modification, comme sur un vrai Mac.
- Critères, valeurs et opérateurs sont définis dans `data/libelles-macos.js` pour que je puisse les modifier facilement.

**Système de fichiers virtuel** (`data/fichiers-virtuels.js`) : 40 à 70 fichiers fictifs, chacun avec `nom`, `extension`, `type` (catégorie Finder), `dossier`, `dateModification`, `dateCreation`, `taille`, `auteur`, `nbPages` (PDF, documents), `motsDuContenu` (liste de mots présents dans le contenu), et pour les photos `lieu` (métadonnée de géolocalisation) et une vignette SVG. Les **dates relatives** (« modifié il y a 5 jours ») sont calculées **par rapport à la date du jour de l'élève** au chargement, pour que la mission « PDF modifiés lors des deux dernières semaines » reste valable toute l'année.

**Missions** (reprenant les exercices 4 et 5) :

1. Les documents de type archive.
2. Les documents dont le contenu contient le mot « gymnase ».
3. Les documents de type PDF modifiés lors des deux dernières semaines.
4. Les documents dont le nom contient « mystere » et qui sont de type image.
5. Les vidéos.
6. Les documents de type PDF dont le contenu contient « données ».
7. Les documents dont l'auteur est « Al Tes » et qui ont l'extension .docx.
8. Les documents modifiés avant le 1er janvier 2010.
9. Les documents de type PDF qui ont plus de 10 pages.
10. Enquête « photos mystères » : ouvrir **Lire les informations (⌘ I)** sur chaque photo mystère, lire le lieu de prise de vue, puis renommer la photo selon son contenu et son lieu.

**Vérification par ensemble de résultats** : une mission est réussie quand l'ensemble des fichiers affichés est **exactement** l'ensemble attendu (plusieurs combinaisons de critères peuvent être justes, ex. « Type = PDF » ou « Extension = pdf » : on les accepte toutes). Feedback en cas d'échec : « Il manque 2 fichiers » / « 3 fichiers affichés ne correspondent pas à la demande » + un indice ciblé (« Avez-vous combiné deux critères ? »).

**Conception du jeu de données, point critique** : pour **chaque** mission, le jeu de fichiers doit être **discriminant** : chaque critère doit être indispensable. Exemples : pour la mission 3, prévoir des PDF anciens **et** des fichiers non-PDF récents ; pour la mission 2, prévoir des fichiers dont le **nom** contient « gymnase » mais pas le contenu, et inversement ; pour la mission 9, des PDF de 10 pages pile (« plus que 10 » les exclut) et de 11 pages. Tu écris un **test automatique** qui vérifie, pour chaque mission, que la ou les solutions attendues donnent le bon ensemble **et** que les erreurs typiques (critère oublié, Nom au lieu de Contenu, ≥ au lieu de >) donnent un ensemble **différent**.

#### 5.6 Examen blanc

- 20 questions mélangées couvrant tous les objectifs + 1 mission de rangement courte + 1 mission de recherche.
- Chronomètre **affiché mais non pénalisant** (optionnel, désactivable).
- Bilan final par objectif avec recommandation : « Révisez en priorité : Raccourcis clavier (45 %) », et un bouton qui lance directement l'entraînement correspondant.

---

### 6. Contenu : règles de rédaction

- **Vouvoiement**, phrases courtes, vocabulaire macOS exact en français, guillemets français « … ».
- Chaque question a une **source** (document + page). Aucune question sans source.
- Les **distracteurs** sont plausibles et correspondent à des confusions réelles de débutants (section 3).
- Les **explications** apprennent quelque chose (« ⌘ N ouvre une nouvelle fenêtre du Finder ; pour un nouveau dossier, il faut ajouter ⇧ : ⌘ ⇧ N. »).
- Feedbacks encourageants mais sobres, variés (au moins 5 formulations pour « juste » et 5 pour « faux »), jamais moqueurs.
- Pas de questions pièges sur des détails hors programme.
- **Relecture obligatoire** : en fin de phase de contenu, tu génères un fichier imprimable `banque-questions-a-relire.pdf` (ou `.html` imprimable) avec **toutes** les questions, la bonne réponse, l'explication et la source, pour que je les valide. Je te renvoie mes corrections ; tu les appliques.

---

### 7. Qualité : ce que tu vérifies toi-même avant chaque livraison

1. **Aucune erreur dans la console** du navigateur.
2. **Test automatique en navigateur sans interface** (Playwright ou équivalent, si ton environnement le permet) aux tailles 360×800, 375×667 (iPhone SE) et 390×844 : chaque écran s'affiche sans défilement horizontal ; chaque activité peut être jouée du début à la fin ; la progression est bien sauvegardée puis relue après rechargement ; l'export/import fonctionne ; le site marche avec `localStorage` bloqué.
3. **Test de solvabilité** de chaque mission Finder et Recherche (section 5.5) et test que les erreurs typiques échouent.
4. **Validation des données** : chaque question a tous ses champs, au moins une bonne réponse, une source, un objectif valide ; pas d'`id` en double.
5. **Contrôle du vouvoiement** (règle 1 de la section 0).
6. **Chemins relatifs** : aucune référence commençant par `/` ou par `http` dans le code.
7. **Captures d'écran** des principaux écrans en taille téléphone, jointes à ta livraison pour que je voie le résultat sans installer quoi que ce soit.

Si un test ne peut pas être fait dans ton environnement, **dis-le clairement** et donne-moi la manipulation manuelle équivalente.

---

### 8. Livraison et accompagnement de l'enseignant

À chaque phase, tu me fournis :

1. Les fichiers du site (dans le dossier connecté si disponible) **et** une archive `site-mission-finder-phaseN.zip`.
2. Un paragraphe « **Ce qui a changé** » (5 lignes max).
3. Les **captures d'écran** des nouveaux écrans.
4. Une **liste de tests à faire** (5 au maximum), formulés simplement : « Ouvrez… Touchez… Vous devez voir… ».
5. Les **instructions de mise en ligne**, pas à pas.

**Publication sur GitHub — ce que tu dois m'expliquer (sans ligne de commande) :**

- Créer un compte GitHub (si besoin), puis un dépôt **public** nommé par ex. `mission-finder`, avec un README.
- Envoyer les fichiers via **github.com → mon dépôt → « Add file » → « Upload files »**, en **glissant le contenu du dossier** (les fichiers et sous-dossiers, **pas l'archive .zip** : GitHub ne décompresse pas les .zip). Puis « Commit changes » (explique : « enregistrer la modification »).
- Activer Pages : **Settings → Pages → Build and deployment → Source : « Deploy from a branch » → Branch : `main`, dossier `/ (root)` → Save**. Attendre 1 à 3 minutes, puis ouvrir `https://<compte>.github.io/mission-finder/`.
- **Mettre à jour** le site (phases suivantes) : ré-uploader les fichiers modifiés, qui remplacent les anciens ; expliquer comment vérifier que la mise à jour est en ligne (recharger, voire vider le cache sur téléphone).
- **Modifier une question moi-même** : ouvrir `data/questions.js` sur github.com, icône crayon, modifier le texte, « Commit changes ». Donne-moi un exemple commenté d'une question dans le fichier et les **3 erreurs à éviter** (virgule oubliée, guillemet non fermé, apostrophe typographique dans une chaîne).
- En cas de problème (page 404, page blanche, ancienne version affichée) : une petite **fiche de dépannage** dans le README.
- En option, alternative plus confortable pour les mises à jour : **GitHub Desktop** (application graphique) — propose-la, ne l'impose pas.

**Diffusion aux élèves** (phase finale) : tu génères un **QR code** (PNG) vers l'adresse du site et une **fiche élève d'une demi-page A4** (PDF) : adresse, QR code, comment ajouter le site à l'écran d'accueil (iPhone et Android), rappel que la progression reste sur le téléphone, vouvoiement.

> Note (phase 2) : l'enseignant utilise désormais Claude Code connecté à GitHub ; les livraisons passent
> par une branche + pull request au lieu de l'envoi manuel (voir `CLAUDE.md`, section 6).

---

### 9. Plan de travail par phases (avec arrêt et validation à chaque fin de phase)

| Phase | Contenu | Ce que je fais |
|---|---|---|
| 0 | Lecture des sources, résumé, **questions de la section 10**, proposition finale du système de score et de la charte graphique (2 propositions de couleurs, en image) | Je réponds et je valide |
| 1 | Création guidée du compte et du dépôt GitHub, activation de Pages avec une page « En construction » | Je suis tes étapes, je t'envoie l'adresse du site |
| 2 | Squelette : accueil, navigation, sauvegarde, profil, page Aide, bilan, export/import + **module QCM** avec 20 questions pilotes | Je teste sur mon téléphone, je valide |
| 3 | Banque QCM complète (≥ 80 questions) + fichier de relecture + Leitner / Révision du jour | Je relis et j'envoie mes corrections |
| 4 | Modules **Raccourcis** et **Bureau** | Je teste, je valide |
| 5 | Module **Atelier fichiers** (missions 1 à 9) | Je teste, je valide |
| 6 | Module **Recherche** (Spotlight + recherche avancée + enquête métadonnées) | Je teste, je valide |
| 7 | **Examen blanc**, badges, niveaux, finitions, accessibilité, performance ; option hors ligne | Je teste, je valide |
| 8 | QR code, fiche élève, README final, guide « modifier une question » | Je distribue aux élèves |

Estime au début de chaque phase le **temps que je devrai y consacrer** (en minutes).

---

### 10. Questions à me poser en phase 0 (avant tout code)

*(Déjà posées et tranchées : voir `CLAUDE.md`, section 2.)*

1. **Nom du site** (proposition : « Mission Finder ») et nom du dépôt GitHub.
2. **Légende du Bureau (tutoriel, page 1)** : quels sont les libellés attendus pour a, b, c, d, e, f ? (L'élément **e** pointe une icône du Dock après le séparateur : je dois te dire ce que c'est. Ne devine pas.)
4. **Tolérance sur les noms** (majuscules, accents) dans l'atelier fichiers.
5. **Chronomètre** : jamais, optionnel (recommandé), ou seulement en examen blanc.
6. **Date du TE1**, pour éventuellement afficher un compte à rebours discret.

---

### 11. Ce qu'il ne faut pas faire (récapitulatif)

- Tutoyer les élèves. Inventer un comportement de macOS. Ajouter des notions hors programme.
- Classement entre élèves, points négatifs, vies, sons automatiques, animations longues, badges à la chaîne.
- Collecter ou envoyer la moindre donnée (pas d'analytics, pas de formulaire, pas de service externe).
- Utiliser un framework, un CDN, une étape de compilation, des chemins absolus, `fetch` de fichiers JSON.
- Rendre le glisser-déposer ou le survol indispensables.
- Me demander de taper une commande dans un terminal, ou livrer une phase sans captures ni tests.
- Passer à la phase suivante sans mon « validé ».

---

### Annexe A — Transcription des documents de cours

#### A.1 Tutoriel « Découvrir les fichiers — Environnement Mac OS, gestion et types de fichiers » (Informatique 1C, 4 pages)

**Page 1.** Capture du Bureau macOS avec légende à compléter a–f : **a** = flèche vers le menu Pomme (coin supérieur gauche) ; **b** = flèche vers la barre des menus (« Finder Fichier Édition Présentation Aller Fenêtre Aide ») ; **c** = flèche vers l'icône de disque « DISQUE » sur le Bureau ; **d** = flèche vers le Dock ; **e** = flèche vers l'icône **« Dossier de départ »** dans le Dock, après le séparateur : raccourci vers l'espace de stockage personnel de l'élève sur le serveur du gymnase, qui lui permet de retrouver ses fichiers depuis n'importe quel poste ; **f** = flèche vers la Corbeille. Questions : « Quelle est l'application active ? » ; « Mentionner deux applications ouvertes ». Ouvrir le Finder depuis Spotlight (loupe en haut à droite, écrire « Finder ») ; raccourci Spotlight : Commande + Espace.

**Page 2 — Les concepts de base** (création, déplacement, copie, suppression, renommage). 1) Ouvrir le Finder et sélectionner le Bureau (barre latérale : Favoris — AirDrop, Récents, Applications, Documents, Téléchargements, Bureau ; Emplacements — l'ordinateur, OneDrive). 2) Créer les dossiers `1C/Bureautique/{1. Gestion des fichiers et dossiers, 2. Internet et Web, 3. Word, 4. Excel}` et passer en présentation par **colonnes**. 3) Ajouter toutes ses branches d'enseignement dans `1C`. 4) Installer OneDrive (un nouvel emplacement apparaît dans le Finder). 5) Déplacer les fichiers du Bureau dans OneDrive. 6) Ajouter un dossier `Perso` dans OneDrive.

**Page 3.** 7) Télécharger un fichier sur Moodle. 8) Le déplacer dans `1C` et le renommer `introduction-outils-informatiques – prenom-nom.pdf`. **Types de fichiers** (voir A.3). 9) Capture d'écran de l'horaire sur Hermes (Cmd-Shift-4). 10) Renommer le fichier `mon_horaire_2025_2026` et le copier dans `1C`.

**Page 4.** 11) Word : enregistrer `Ex_Word` dans `1C/Bureautique/Word`. 12) Excel : enregistrer `Ex_Excel` dans `1C/Bureautique/Excel`. 13) Enregistrer une image trouvée sur Internet dans `1C` et la renommer d'après la personne. 14) Compresser l'horaire et l'image sous `mon_travail_nom_prénom.zip`. 15) Déposer sur Moodle. 16) Supprimer le fichier compressé. 17) Vérifier la synchronisation OneDrive. 18–21) OneDrive en ligne (office.com), refaire 11–12 en ligne.

#### A.2 Fiche « Principaux raccourcis clavier sur Mac OS X » (20 raccourcis retenus, formulation exacte)

La fiche originale en compte 21 ; **⌘ Y « Répéter une action » est volontairement retiré** du site (décision de l'enseignant).

| Raccourci | Action effectuée — utilité |
|---|---|
| ⌘ A | Sélectionner tout (sélectionne tout un texte par ex.) |
| ⌘ N | Nouvelle fenêtre du Finder ou nouveau fichier |
| ⌘ C | Copier (copie le texte sélectionné et le mémorise) |
| ⌘ V | Coller (colle le texte sélectionné et mémorisé) |
| ⌘ O | Ouvrir un fichier |
| ⌘ P | Imprimer un document, un fichier |
| ⌘ Q | Quitter une application |
| ⌘ W | Fermer une fenêtre |
| ⌘ T | Nouvel onglet (dans le Finder ou dans un navigateur) |
| ⌘ I | Information sur un fichier (par ex. ses métadonnées) |
| ⌘ M | Diminuer la taille d'une fenêtre |
| ⌘ ⇥ (Tab) | Changer d'application parmi les applications ouvertes |
| ⌘ ⌥ esc | Forcer à quitter |
| ⌘ ⇧ 3 | Capture écran de l'ensemble du bureau (toute la fenêtre) |
| ⌘ ⇧ 4 | Capture sélective de l'écran (une partie de la fenêtre) |
| ⌘ ⇧ 4 puis espace | Capture sélective de la fenêtre active |
| ⌘ ⇧ 5 | Capture sélective de l'écran (avec options et retardateur) |
| ⌘ ⇧ N | Créer un nouveau dossier |
| ⌘ F | Rechercher un mot, une portion de texte (fichier texte ou Internet) |
| ⌘ Z | Annuler l'action ou revenir en arrière |

#### A.3 Types de fichiers (définitions du tutoriel)

- **DOCX** : format de fichier de traitement de texte utilisé par Microsoft Word.
- **XLSX** : format de feuille de calcul utilisé par Microsoft Excel.
- **PDF** (Portable Document Format) : conserve la mise en page originelle d'un document, quel que soit le logiciel.
- **JPG** : format d'image compressé utilisé pour stocker des photos et d'autres images.
- **PNG** : format d'image numérique utilisé pour stocker des images avec des transparences et des fonds transparents.
- **ZIP** : fichier compressé qui regroupe plusieurs fichiers en un seul ; utile pour économiser de l'espace ou envoyer plusieurs fichiers en un paquet ; s'ouvre avec un utilitaire comme Utilitaire d'archive sur macOS.
- **MP3** : format audio compressé pour stocker de la musique.
- **MP4** : format vidéo qui peut aussi contenir de l'audio, des sous-titres et des images.

#### A.4 Énoncés des exercices (fichier texte)

**Exercice 1 — Gestion de fichiers.** Sur le Bureau, créer `Exercice_finder` ; dedans `Documents` et `Images` ; dans `Documents` : `Web`, `Brochures`, `Formulaires`, `Tutoriels` ; dans `Images` : `Ville`, `Montagne`, `Plage`. Décompresser `Finder_Exercice1_2627.zip` et déplacer son contenu au bon endroit. Déplacer les fichiers dans les bons dossiers. Supprimer les doublons. Renommer les images sans nom explicite ou commençant par PIXNIO. Télécharger le formulaire de demande de congé depuis le site du Gymnase de Burier et le ranger dans le bon dossier. Compresser les dossiers `Brochures` et `Montagne`.

**Exercice 2 — Raccourcis clavier.** Trouver le raccourci correspondant à une action et inversement ; construire son tableau de synthèse.

**Exercice 4 — Recherche de documents.** 1) Avec Spotlight (loupe ou ⌘ Espace), ouvrir : la brochure des cours facultatifs (2026-2027), l'application Calculette, le dossier Téléchargements. 2) Avec la recherche avancée du Finder (⌘ F), afficher : les documents de type archive ; les documents dont le contenu contient « gymnase » ; les documents PDF modifiés lors des deux dernières semaines ; les documents dont le nom contient « mystere » et de type image. 3) Sur les photos mystères : trouver le lieu de prise de vue grâce aux métadonnées (à défaut, avec une recherche d'image inversée) et les renommer selon leur contenu et leur lieu. Captures d'écran des résultats, archive `Ex4_NomPrenom` déposée sur Moodle.

**Exercice 5 — Recherche de documents 2** (archive `RECHERCHE-1C.zip`). Avec ⌘ F, afficher : les vidéos ; les PDF dont le contenu contient « données » ; les documents dont l'auteur est « Al Tes » et d'extension .docx ; les documents modifiés avant le 1er janvier 2010 ; les PDF de plus de 10 pages. Captures, archive `Ex5_NomPrenom` sur Moodle.

---

### Annexe B — Références scientifiques (pour justifier les choix de conception)

- Sailer, M. & Homner, L. (2020). *The gamification of learning: A meta-analysis.* Educational Psychology Review, 32, 77–112.
- Huang, R. et al. (2020). *The impact of gamification in educational settings on student learning outcomes: a meta-analysis.* ETR&D, 68, 1875–1901.
- Li, L., Hew, K. F. & Du, J. (2024). *Gamification enhances student intrinsic motivation, perceptions of autonomy and relatedness, but minimal impact on competency.* ETR&D.
- Hanus, M. D. & Fox, J. (2015). *Assessing the effects of gamification in the classroom.* Computers & Education, 80, 152–161.
- Karpicke, J. D. (2017). *Retrieval-based learning: A decade of progress.* In Learning and Memory: A Comprehensive Reference.
- Butler, A. C. & Roediger, H. L. (2008). *Feedback enhances the positive effects and reduces the negative effects of multiple-choice testing.* Memory & Cognition, 36, 604–616.
