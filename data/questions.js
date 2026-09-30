/* ==========================================================================
   Mission Finder — banque de questions du « Quiz express »
   Phase 3 : 90 questions (BUR 11, FIN 26, TYP 16, RAC 20, REC 17).
   Les 90 questions ont été relues et validées par l'enseignant (phases 2 et 3).
   ==========================================================================

   FORMAT D'UNE QUESTION (chaque question est entre { }, suivie d'une virgule) :

   {
     id: "typ-01",            identifiant unique (ne jamais réutiliser)
     objectif: "TYP1",        code d'objectif (voir data/objectifs.js)
     difficulte: 1,           1 = facile, 2 = moyen, 3 = difficile
     type: "unique",          "unique"   : une seule bonne réponse
                              "multiple" : plusieurs bonnes réponses
                              "vraifaux" : propositions ["Vrai", "Faux"], un seul essai
                              "ranger"   : « Où rangez-vous ce fichier ? »
     enonce: "…",             la question (vouvoiement !)
     figure: { … },           facultatif : illustration (barre des menus, Dock, fichier,
                              fenêtre en colonnes, barre latérale du Finder)
     propositions: [ … ],     les réponses proposées (mélangées à chaque partie)
     bonnes: [0],             position(s) des bonnes réponses : 0 = 1re, 1 = 2e, 2 = 3e…
     erreurs: { 1: "…" },     facultatif : pourquoi la proposition n° 1 (la 2e) est fausse
     explication: "…",        affichée après la réponse (2 lignes maximum)
     source: "…"              document et page du cours
   },

   Dans un texte entre guillemets droits "…", l'apostrophe droite ' est permise.
   Guide pas à pas et 3 erreurs à éviter : README.md, section « Modifier une question ».
   ========================================================================== */

window.QUESTIONS = [

  /* ---------- BUR : le Bureau de macOS ---------- */
  {
    id: "bur-01",
    objectif: "BUR2",
    difficulte: 1,
    type: "unique",
    enonce: "Dans cette barre des menus, quelle est l'application active ?",
    figure: { type: "barreMenus", app: "Excel", menus: ["Fichier", "Édition", "Affichage"] },
    propositions: ["Excel", "Finder", "Word", "Safari"],
    bonnes: [0],
    erreurs: {
      1: "Le Finder est toujours ouvert, mais ici ce n'est pas son nom qui apparaît en gras à côté du menu Pomme.",
      2: "Le nom « Word » n'apparaît pas à côté du menu Pomme.",
      3: "Le nom « Safari » n'apparaît pas à côté du menu Pomme."
    },
    explication: "L'application active est celle dont le nom apparaît en gras à côté du menu Pomme, dans la barre des menus.",
    source: "Tutoriel « Découvrir les fichiers », p. 1"
  },
  {
    id: "bur-02",
    objectif: "BUR3",
    difficulte: 2,
    type: "multiple",
    enonce: "Dans ce Dock, quelles applications sont ouvertes ?",
    figure: {
      type: "dock",
      apps: [
        { nom: "Finder", abr: "Fi", couleur: "#2F7FD8", ouverte: true },
        { nom: "Safari", abr: "Sa", couleur: "#1FA3C4", ouverte: false },
        { nom: "Word", abr: "Wo", couleur: "#2B579A", ouverte: true },
        { nom: "Excel", abr: "Ex", couleur: "#217346", ouverte: false },
        { nom: "Calculette", abr: "Ca", couleur: "#5F6B73", ouverte: true }
      ]
    },
    propositions: ["Finder", "Word", "Calculette", "Safari", "Excel"],
    bonnes: [0, 1, 2],
    explication: "Un petit point sous l'icône indique que l'application est ouverte : ici Finder, Word et Calculette.",
    source: "Tutoriel « Découvrir les fichiers », p. 1"
  },
  {
    id: "bur-03",
    objectif: "BUR1",
    difficulte: 1,
    type: "unique",
    enonce: "Comment s'appelle la barre d'icônes en bas de l'écran, qui permet d'ouvrir les applications ?",
    propositions: ["Le Dock", "La barre des menus", "La barre latérale", "Le Finder"],
    bonnes: [0],
    erreurs: {
      1: "La barre des menus se trouve en haut de l'écran.",
      2: "La barre latérale se trouve à gauche des fenêtres du Finder.",
      3: "Le Finder est l'application qui permet de gérer les fichiers et les dossiers."
    },
    explication: "Le Dock, en bas de l'écran, contient les icônes des applications, le Dossier de départ et la Corbeille.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (légende d)"
  },

  /* Questions ajoutées en phase 3 (relues et validées) */
  {
    id: "bur-04",
    objectif: "BUR1",
    difficulte: 1,
    type: "unique",
    enonce: "Où se trouve le menu Pomme ?",
    propositions: [
      "En haut à gauche de l'écran",
      "En haut à droite de l'écran",
      "En bas de l'écran, dans le Dock",
      "Dans la barre latérale du Finder"
    ],
    bonnes: [0],
    erreurs: {
      1: "En haut à droite se trouvent notamment l'heure et la loupe de Spotlight.",
      2: "Le Dock contient les icônes des applications, le Dossier de départ et la Corbeille.",
      3: "La barre latérale du Finder contient les Favoris et les Emplacements."
    },
    explication: "Le menu Pomme est tout à gauche de la barre des menus, en haut de l'écran (légende a du tutoriel).",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (légende a)"
  },
  {
    id: "bur-05",
    objectif: "BUR1",
    difficulte: 1,
    type: "unique",
    enonce: "En haut à droite du Bureau, une icône grise porte le nom « DISQUE ». Que représente-t-elle ?",
    propositions: ["Le disque de l'ordinateur", "La Corbeille", "Le Dossier de départ", "OneDrive"],
    bonnes: [0],
    erreurs: {
      1: "La Corbeille se trouve au bout du Dock, en bas à droite de l'écran.",
      2: "Le Dossier de départ se trouve dans le Dock, après le séparateur.",
      3: "OneDrive apparaît dans la barre latérale du Finder, sous Emplacements."
    },
    explication: "L'icône « DISQUE », sur le Bureau, représente le disque de l'ordinateur (légende c du tutoriel).",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (légende c)"
  },
  {
    id: "bur-06",
    objectif: "BUR1",
    difficulte: 2,
    type: "unique",
    enonce: "Dans le Dock, après le séparateur, quelle icône donne accès à votre espace personnel sur le serveur du gymnase, depuis n'importe quel poste ?",
    propositions: ["Le Dossier de départ", "La Corbeille", "Le Finder", "L'icône « DISQUE »"],
    bonnes: [0],
    erreurs: {
      1: "La Corbeille contient les éléments que vous avez supprimés.",
      2: "Le Finder est la première icône du Dock, à gauche.",
      3: "L'icône « DISQUE » se trouve sur le Bureau, pas dans le Dock."
    },
    explication: "Le Dossier de départ (légende e) mène à votre espace personnel sur le serveur du gymnase : vous y retrouvez vos fichiers depuis n'importe quel poste.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (légende e)"
  },
  {
    id: "bur-07",
    objectif: "BUR1",
    difficulte: 2,
    type: "multiple",
    enonce: "Parmi ces éléments, lesquels se trouvent dans le Dock ?",
    propositions: [
      "La Corbeille",
      "Le Dossier de départ",
      "Le Finder",
      "Le menu Pomme",
      "L'icône « DISQUE »"
    ],
    bonnes: [0, 1, 2],
    explication: "Le Dock contient le Finder et les autres applications, puis, après le séparateur, le Dossier de départ et la Corbeille. Le menu Pomme est en haut à gauche ; « DISQUE » est sur le Bureau.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (légendes a, c, d, e, f)"
  },
  {
    id: "bur-08",
    objectif: "BUR2",
    difficulte: 1,
    type: "unique",
    enonce: "Dans cette barre des menus, quelle est l'application active ?",
    figure: { type: "barreMenus", app: "Finder", menus: ["Fichier", "Édition", "Présentation"] },
    propositions: ["Finder", "Fichier", "Présentation", "Safari"],
    bonnes: [0],
    erreurs: {
      1: "« Fichier » est un menu de l'application active, pas une application.",
      2: "« Présentation » est un menu du Finder, pas une application.",
      3: "Le nom « Safari » n'apparaît pas à côté du menu Pomme."
    },
    explication: "Le nom en gras à côté du menu Pomme est celui de l'application active : ici, le Finder, comme sur la capture du tutoriel.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (question 2a)"
  },
  {
    id: "bur-09",
    objectif: "BUR3",
    difficulte: 2,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Toutes les applications dont l'icône est dans le Dock sont ouvertes.",
    propositions: ["Vrai", "Faux"],
    bonnes: [1],
    explication: "Faux : seules les applications marquées d'un petit point sous leur icône sont ouvertes. Les autres sont seulement rangées dans le Dock.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (question 2b)"
  },
  {
    id: "bur-10",
    objectif: "BUR4",
    difficulte: 1,
    type: "multiple",
    enonce: "Comment pouvez-vous ouvrir Spotlight ?",
    propositions: [
      "En cliquant sur la loupe en haut à droite de l'écran",
      "Avec le raccourci ⌘ Espace",
      "Avec le raccourci ⌘ F",
      "En cliquant sur le menu Pomme",
      "Avec le raccourci ⌘ ⇥"
    ],
    bonnes: [0, 1],
    explication: "Spotlight s'ouvre avec la loupe en haut à droite de l'écran ou avec ⌘ Espace. ⌘ F sert à rechercher ; ⌘ ⇥ change d'application.",
    source: "Tutoriel « Découvrir les fichiers », p. 1"
  },
  {
    id: "bur-11",
    objectif: "BUR4",
    difficulte: 1,
    type: "unique",
    enonce: "Vous avez ouvert Spotlight. Comment ouvrez-vous ensuite le Finder ?",
    propositions: [
      "Vous écrivez « Finder », puis vous cliquez sur son icône dans les résultats",
      "Vous écrivez « Ce Mac »",
      "Vous appuyez sur ⌘ ⇧ N",
      "Vous écrivez « Dock »"
    ],
    bonnes: [0],
    erreurs: {
      1: "« Ce Mac » est un choix de la recherche avancée du Finder, pas le nom d'une application.",
      2: "⌘ ⇧ N crée un nouveau dossier.",
      3: "Écrivez le nom de ce que vous voulez ouvrir : ici, « Finder »."
    },
    explication: "Dans Spotlight, écrivez le nom de ce que vous cherchez (« Finder »), puis cliquez sur l'icône dans les résultats.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (« Essayez par vous-même »)"
  },

  /* ---------- FIN : fichiers et dossiers ---------- */
  {
    id: "fin-01",
    objectif: "FIN2",
    difficulte: 1,
    type: "unique",
    enonce: "Dans le Finder, quelle présentation affiche les dossiers dans des colonnes côte à côte, ce qui permet de suivre le chemin d'un fichier ?",
    propositions: ["Par colonnes", "Par icônes", "Par liste", "Par galerie"],
    bonnes: [0],
    erreurs: {
      1: "La présentation par icônes affiche le contenu d'un seul dossier, sous forme d'icônes.",
      2: "La présentation par liste affiche le contenu d'un dossier en lignes, avec des informations (date, taille…).",
      3: "La présentation par galerie affiche un grand aperçu du fichier sélectionné."
    },
    explication: "En présentation par colonnes, chaque dossier ouvert s'affiche dans une nouvelle colonne à droite : le chemin se lit de gauche à droite.",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 2)"
  },
  {
    id: "fin-02",
    objectif: "FIN3",
    difficulte: 1,
    type: "unique",
    enonce: "Dans le chemin 1C › Bureautique › 3. Word, quel dossier contient directement le dossier « 3. Word » ?",
    propositions: ["Bureautique", "1C", "Bureau", "Documents"],
    bonnes: [0],
    erreurs: {
      1: "« 1C » contient « Bureautique », qui contient à son tour « 3. Word ».",
      2: "Le dossier « 1C » est sur le Bureau, mais « 3. Word » est rangé deux niveaux plus bas.",
      3: "Le dossier « Documents » n'apparaît pas dans ce chemin."
    },
    explication: "Un chemin se lit de gauche à droite, du dossier le plus englobant au plus précis : « Bureautique » contient « 3. Word ».",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 2)"
  },
  {
    id: "fin-03",
    objectif: "FIN4",
    difficulte: 1,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Un fichier placé dans la Corbeille est immédiatement effacé du Mac.",
    propositions: ["Vrai", "Faux"],
    bonnes: [1],
    explication: "Faux : le fichier reste dans la Corbeille, d'où vous pouvez le récupérer, tant que la Corbeille n'a pas été vidée.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 (Corbeille) et p. 4 (étape 16)"
  },
  {
    id: "fin-04",
    objectif: "FIN5",
    difficulte: 2,
    type: "multiple",
    enonce: "Ce dossier contient des doublons (fichiers au contenu identique). Pour ne garder que les originaux, quels fichiers placez-vous dans la Corbeille ?",
    propositions: ["brochure_sport (1).pdf", "copie de horaire.png", "brochure_sport.pdf", "horaire.png"],
    bonnes: [0, 1],
    explication: "Les noms terminés par « (1) » ou commençant par « copie de » signalent des copies. Avant de supprimer, vérifiez que le contenu est bien identique.",
    source: "Énoncé de l'exercice 1 (supprimer les doublons)"
  },
  {
    id: "fin-05",
    objectif: "FIN6",
    difficulte: 1,
    type: "unique",
    enonce: "Une photo du Cervin s'appelle « PIXNIO-284311-1200x800.jpg ». Quel nouveau nom est le plus explicite ?",
    propositions: ["cervin_montagne.jpg", "IMG_4032.jpg", "photo.jpg", "image_1.jpg"],
    bonnes: [0],
    erreurs: {
      1: "« IMG_4032 » est un nom automatique : il ne dit rien du contenu de la photo.",
      2: "« photo » est trop vague : on ne sait pas ce que montre l'image.",
      3: "« image_1 » ne décrit pas le contenu de l'image."
    },
    explication: "Un nom explicite décrit le contenu du fichier : on sait ce que montre la photo sans l'ouvrir.",
    source: "Énoncé de l'exercice 1 (renommer les images PIXNIO)"
  },
  {
    id: "fin-06",
    objectif: "FIN7",
    difficulte: 1,
    type: "unique",
    enonce: "À quoi sert la compression d'un dossier (création d'un fichier .zip) ?",
    propositions: [
      "À regrouper son contenu en un seul fichier, facile à envoyer",
      "À supprimer les doublons qu'il contient",
      "À convertir ses fichiers en PDF",
      "À synchroniser le dossier avec OneDrive"
    ],
    bonnes: [0],
    erreurs: {
      1: "La compression ne trie pas les fichiers : les doublons restent dans l'archive.",
      2: "Les fichiers gardent leur format : la compression ne les convertit pas.",
      3: "C'est OneDrive qui synchronise les fichiers, pas la compression."
    },
    explication: "Un fichier ZIP regroupe plusieurs fichiers en un seul : utile pour économiser de l'espace ou envoyer plusieurs fichiers en un paquet.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers : ZIP) et p. 4 (étape 14)"
  },
  {
    id: "fin-07",
    objectif: "FIN8",
    difficulte: 2,
    type: "unique",
    enonce: "Vous déplacez un fichier dans OneDrive, depuis la barre latérale du Finder. Que se passe-t-il ?",
    propositions: [
      "Il est synchronisé en ligne : vous le retrouvez aussi sur office.com",
      "Il est compressé en fichier .zip",
      "Il est placé dans la Corbeille",
      "Il devient invisible dans le Finder"
    ],
    bonnes: [0],
    erreurs: {
      1: "Déplacer un fichier ne le compresse pas.",
      2: "La Corbeille et OneDrive sont deux emplacements différents.",
      3: "Le fichier reste visible dans OneDrive, dans le Finder."
    },
    explication: "OneDrive est un dossier synchronisé : son contenu est copié en ligne, et vous le retrouvez sur office.com ou sur un autre ordinateur.",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étapes 4 à 6) et p. 4 (étapes 17 et 18)"
  },

  /* Questions ajoutées en phase 3 (relues et validées) */
  {
    id: "fin-08",
    objectif: "FIN1",
    difficulte: 1,
    type: "unique",
    enonce: "Après l'installation de OneDrive, sous quel titre de la barre latérale du Finder apparaît-il ?",
    propositions: ["Emplacements", "Favoris", "Récents", "Applications"],
    bonnes: [0],
    erreurs: {
      1: "Favoris regroupe notamment AirDrop, Récents, Applications, Documents, Téléchargements et Bureau.",
      2: "« Récents » est un élément des Favoris, pas un titre.",
      3: "« Applications » est un élément des Favoris, pas un titre."
    },
    explication: "OneDrive apparaît sous Emplacements, avec l'ordinateur lui-même (tutoriel, étape 4).",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 4)"
  },
  {
    id: "fin-09",
    objectif: "FIN1",
    difficulte: 2,
    type: "multiple",
    enonce: "Sur les Mac du gymnase, quels éléments se trouvent dans les Favoris de la barre latérale du Finder ?",
    propositions: ["Bureau", "Téléchargements", "AirDrop", "OneDrive", "Corbeille"],
    bonnes: [0, 1, 2],
    explication: "Favoris : notamment AirDrop, Récents, Applications, Documents, Téléchargements, Bureau. OneDrive est sous Emplacements ; la Corbeille est dans le Dock.",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (captures du Finder)"
  },
  {
    id: "fin-10",
    objectif: "FIN1",
    difficulte: 1,
    type: "unique",
    enonce: "Vous voulez voir les fichiers posés sur le Bureau. Sur quel élément de la barre latérale cliquez-vous ?",
    figure: {
      type: "barreLaterale",
      favoris: ["AirDrop", "Récents", "Applications", "Documents", "Téléchargements", "Bureau"],
      emplacements: ["lm056341", "OneDrive"]
    },
    propositions: ["Bureau", "Documents", "Récents", "OneDrive"],
    bonnes: [0],
    erreurs: {
      1: "« Documents » est un autre dossier : il n'affiche pas le contenu du Bureau.",
      2: "« Récents » n'est pas le dossier du Bureau.",
      3: "OneDrive est un emplacement synchronisé en ligne, pas le Bureau."
    },
    explication: "Dans les Favoris, « Bureau » affiche le contenu du Bureau : c'est la 1re étape du tutoriel (p. 2).",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 1)"
  },
  {
    id: "fin-11",
    objectif: "FIN2",
    difficulte: 2,
    type: "unique",
    enonce: "Dans cette fenêtre, quel est le chemin du dossier « 3. Word » ?",
    figure: {
      type: "colonnes",
      titre: "Bureautique",
      colonnes: [
        { elements: ["1C"], choisi: "1C" },
        { elements: ["Bureautique"], choisi: "Bureautique" },
        { elements: ["1. Gestion des fichiers et dossiers", "2. Internet et Web", "3. Word", "4. Excel"] }
      ]
    },
    propositions: [
      "1C › Bureautique › 3. Word",
      "Bureautique › 1C › 3. Word",
      "3. Word › Bureautique › 1C",
      "1C › 3. Word"
    ],
    bonnes: [0],
    erreurs: {
      1: "L'ordre est inversé : c'est « 1C » qui contient « Bureautique ».",
      2: "Un chemin se lit du dossier le plus englobant au plus précis, pas l'inverse.",
      3: "Il manque un niveau : « 3. Word » est rangé dans « Bureautique »."
    },
    explication: "En présentation par colonnes, le chemin se lit de gauche à droite : 1C, puis Bureautique, puis 3. Word.",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 2)"
  },
  {
    id: "fin-12",
    objectif: "FIN2",
    difficulte: 1,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Passer une fenêtre du Finder en présentation par colonnes déplace les fichiers qu'elle contient.",
    propositions: ["Vrai", "Faux"],
    bonnes: [1],
    explication: "Faux : la présentation (icônes, liste, colonnes, galerie) change seulement l'affichage. Les fichiers restent au même endroit.",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 2)"
  },
  {
    id: "fin-13",
    objectif: "FIN3",
    difficulte: 1,
    type: "multiple",
    enonce: "Dans cette fenêtre, quels dossiers se trouvent directement dans « Bureautique » ?",
    figure: {
      type: "colonnes",
      titre: "Bureautique",
      colonnes: [
        { elements: ["1C"], choisi: "1C" },
        { elements: ["Bureautique"], choisi: "Bureautique" },
        { elements: ["1. Gestion des fichiers et dossiers", "2. Internet et Web", "3. Word", "4. Excel"] }
      ]
    },
    propositions: ["2. Internet et Web", "4. Excel", "1C", "Documents"],
    bonnes: [0, 1],
    explication: "La dernière colonne montre le contenu de « Bureautique » : les quatre dossiers numérotés. « 1C » contient « Bureautique », pas l'inverse.",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 2)"
  },
  {
    id: "fin-14",
    objectif: "FIN3",
    difficulte: 2,
    type: "unique",
    enonce: "Dans l'exercice 1, où devez-vous créer le dossier « Montagne » ?",
    propositions: [
      "Exercice_finder › Images › Montagne",
      "Exercice_finder › Documents › Montagne",
      "Exercice_finder › Montagne",
      "Images › Montagne › Exercice_finder"
    ],
    bonnes: [0],
    erreurs: {
      1: "Documents accueille Web, Brochures, Formulaires et Tutoriels ; les photos vont dans Images.",
      2: "Il manque un niveau : « Montagne » se crée dans « Images ».",
      3: "L'ordre est inversé : « Exercice_finder » contient les autres dossiers."
    },
    explication: "Ville, Montagne et Plage se créent dans Images, lui-même dans Exercice_finder, sur le Bureau.",
    source: "Énoncé de l'exercice 1"
  },
  {
    id: "fin-15",
    objectif: "FIN3",
    difficulte: 1,
    type: "multiple",
    enonce: "Dans l'exercice 1, quels dossiers créez-vous dans « Documents » ?",
    propositions: ["Web", "Brochures", "Formulaires", "Tutoriels", "Ville"],
    bonnes: [0, 1, 2, 3],
    explication: "Dans Documents : Web, Brochures, Formulaires et Tutoriels. Dans Images : Ville, Montagne et Plage.",
    source: "Énoncé de l'exercice 1"
  },
  {
    id: "fin-16",
    objectif: "FIN4",
    difficulte: 1,
    type: "unique",
    enonce: "Vous copiez un fichier du Bureau dans le dossier 1C. Où se trouve-t-il ensuite ?",
    propositions: [
      "Sur le Bureau et dans 1C",
      "Seulement dans 1C",
      "Seulement sur le Bureau",
      "Dans la Corbeille"
    ],
    bonnes: [0],
    erreurs: {
      1: "C'est le cas si vous le déplacez ; une copie laisse l'original en place.",
      2: "La copie a bien été créée dans 1C.",
      3: "Copier ne supprime rien."
    },
    explication: "Copier crée un double dans 1C et laisse l'original sur le Bureau. Déplacer, au contraire, retire le fichier du Bureau.",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (concepts de base) et p. 3 (étape 10)"
  },
  {
    id: "fin-17",
    objectif: "FIN4",
    difficulte: 1,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Pour renommer un fichier, il faut d'abord l'ouvrir dans son application.",
    propositions: ["Vrai", "Faux"],
    bonnes: [1],
    explication: "Faux : on renomme un fichier directement dans le Finder, sans l'ouvrir (tutoriel, étape 8).",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (étape 8)"
  },
  {
    id: "fin-18",
    objectif: "FIN4",
    difficulte: 2,
    type: "multiple",
    enonce: "Vous venez de placer par erreur un dossier dans la Corbeille. Comment le récupérer ?",
    propositions: [
      "Aller le chercher dans la Corbeille",
      "Appuyer tout de suite sur ⌘ Z",
      "C'est impossible : il est effacé",
      "Appuyer sur ⌘ Q"
    ],
    bonnes: [0, 1],
    explication: "Tant que la Corbeille n'est pas vidée, le dossier peut être récupéré. Juste après l'erreur, ⌘ Z annule l'action.",
    source: "Fiche « Principaux raccourcis clavier » (⌘ Z) ; tutoriel, p. 1 (Corbeille)"
  },
  {
    id: "fin-19",
    objectif: "FIN5",
    difficulte: 2,
    type: "unique",
    enonce: "Deux fichiers s'appellent « tutoriel_moodle.pdf » et « tutoriel_moodle (1).pdf ». Avant de supprimer le second, que vérifiez-vous ?",
    propositions: [
      "Qu'ils ont exactement le même contenu",
      "Qu'ils ont la même extension",
      "Qu'ils sont dans le même dossier",
      "Que le second est le plus récent"
    ],
    bonnes: [0],
    erreurs: {
      1: "Deux PDF différents ont aussi la même extension : c'est le contenu qui compte.",
      2: "Deux fichiers différents peuvent être dans le même dossier : c'est le contenu qui compte.",
      3: "La date ne dit pas si le contenu est identique."
    },
    explication: "Un doublon a le même contenu que l'original. « (1) » suggère une copie, mais vérifiez le contenu avant de supprimer.",
    source: "Énoncé de l'exercice 1 (supprimer les doublons)"
  },
  {
    id: "fin-20",
    objectif: "FIN6",
    difficulte: 1,
    type: "unique",
    enonce: "Pourquoi renommer la capture de votre horaire « mon_horaire_2026_2027 » ?",
    propositions: [
      "Pour savoir ce que contient le fichier sans l'ouvrir",
      "Pour réduire sa taille",
      "Pour le transformer en PDF",
      "Pour qu'il soit synchronisé avec OneDrive"
    ],
    bonnes: [0],
    erreurs: {
      1: "Le nom ne change pas la taille du fichier.",
      2: "Renommer ne change pas le format du fichier.",
      3: "La synchronisation dépend de l'emplacement du fichier (le dossier OneDrive), pas de son nom."
    },
    explication: "Un nom explicite décrit le contenu : vous retrouvez le fichier sans l'ouvrir, par exemple avec Spotlight.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (étape 10)"
  },
  {
    id: "fin-21",
    objectif: "FIN6",
    difficulte: 2,
    type: "multiple",
    enonce: "Dans l'exercice 1, quelles images devez-vous renommer ?",
    propositions: [
      "PIXNIO-392817-1200x800.jpg",
      "IMG_4032.jpg",
      "ville_lausanne.jpg",
      "montagne_cervin.jpg"
    ],
    bonnes: [0, 1],
    explication: "On renomme les images au nom non explicite (comme IMG_4032) ou qui commencent par PIXNIO. Les autres décrivent déjà leur contenu.",
    source: "Énoncé de l'exercice 1"
  },
  {
    id: "fin-22",
    objectif: "FIN7",
    difficulte: 1,
    type: "unique",
    enonce: "Vous recevez « Finder_Exercice1_2627.zip ». Que faites-vous pour utiliser les fichiers qu'il contient ?",
    propositions: [
      "Vous le décompressez",
      "Vous le compressez",
      "Vous le renommez en .pdf",
      "Vous le placez dans la Corbeille"
    ],
    bonnes: [0],
    erreurs: {
      1: "Il est déjà compressé : l'extension .zip l'indique.",
      2: "Changer le nom ne décompresse pas l'archive.",
      3: "Vous perdriez les fichiers de l'exercice."
    },
    explication: "Un fichier .zip regroupe plusieurs fichiers compressés : on le décompresse pour retrouver son contenu.",
    source: "Énoncé de l'exercice 1 ; tutoriel, p. 3 (ZIP)"
  },
  {
    id: "fin-23",
    objectif: "FIN7",
    difficulte: 2,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Quand vous compressez le dossier « Brochures », le dossier d'origine disparaît.",
    propositions: ["Vrai", "Faux"],
    bonnes: [1],
    explication: "Faux : la compression crée une archive .zip à côté du dossier ; le dossier d'origine reste en place.",
    source: "Énoncé de l'exercice 1 (compresser Brochures et Montagne)"
  },
  {
    id: "fin-24",
    objectif: "FIN7",
    difficulte: 2,
    type: "unique",
    enonce: "Vous compressez ensemble votre horaire et une image (tutoriel, étape 14). Qu'obtenez-vous ?",
    propositions: [
      "Un seul fichier .zip qui contient les deux fichiers",
      "Deux fichiers .zip, un par fichier",
      "Un fichier PDF qui contient les deux",
      "Un nouveau dossier dans OneDrive"
    ],
    bonnes: [0],
    erreurs: {
      1: "Compresser plusieurs fichiers ensemble crée une seule archive.",
      2: "La compression ne change pas le format des fichiers : elle les regroupe dans un .zip.",
      3: "La compression ne crée pas de dossier dans OneDrive."
    },
    explication: "Un fichier ZIP regroupe plusieurs fichiers en un seul : pratique pour déposer votre travail sur Moodle en une fois.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (ZIP) et p. 4 (étapes 14 et 15)"
  },
  {
    id: "fin-25",
    objectif: "FIN8",
    difficulte: 1,
    type: "unique",
    enonce: "Comment vérifiez-vous que vos fichiers sont bien synchronisés avec OneDrive ?",
    propositions: [
      "Avec l'icône de OneDrive (un nuage) dans la barre des menus",
      "Avec l'icône « DISQUE » sur le Bureau",
      "Avec le menu Pomme",
      "En compressant le dossier OneDrive"
    ],
    bonnes: [0],
    erreurs: {
      1: "L'icône « DISQUE » représente le disque de l'ordinateur, pas OneDrive.",
      2: "Le menu Pomme ne montre pas l'état de OneDrive.",
      3: "Compresser crée une archive .zip : cela ne vérifie rien."
    },
    explication: "Le tutoriel (étape 17) montre l'icône de OneDrive, un nuage, en haut à droite dans la barre des menus : elle indique l'état de la synchronisation.",
    source: "Tutoriel « Découvrir les fichiers », p. 4 (étape 17)"
  },
  {
    id: "fin-26",
    objectif: "FIN8",
    difficulte: 2,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Un dossier « Perso » créé dans OneDrive est lui aussi synchronisé en ligne.",
    propositions: ["Vrai", "Faux"],
    bonnes: [0],
    explication: "Vrai : tout ce que contient le dossier OneDrive est synchronisé, y compris les dossiers que vous y créez (tutoriel, étape 6).",
    source: "Tutoriel « Découvrir les fichiers », p. 2 (étape 6) et p. 4 (étape 17)"
  },

  /* ---------- TYP : types de fichiers ---------- */
  {
    id: "typ-01",
    objectif: "TYP1",
    difficulte: 1,
    type: "unique",
    enonce: "Quel format d'image permet d'avoir un fond transparent ?",
    propositions: ["PNG", "JPG", "PDF", "MP4"],
    bonnes: [0],
    erreurs: {
      1: "Le JPG est un format d'image compressé, utilisé surtout pour les photos.",
      2: "Le PDF sert à conserver la mise en page d'un document.",
      3: "Le MP4 est un format vidéo."
    },
    explication: "Le PNG est un format d'image qui permet des transparences et des fonds transparents.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-02",
    objectif: "TYP1",
    difficulte: 1,
    type: "unique",
    enonce: "Quel format conserve la mise en page d'origine d'un document, quel que soit le logiciel utilisé pour l'ouvrir ?",
    propositions: ["PDF", "DOCX", "XLSX", "ZIP"],
    bonnes: [0],
    erreurs: {
      1: "Le DOCX est le format de traitement de texte de Microsoft Word.",
      2: "Le XLSX est le format de feuille de calcul de Microsoft Excel.",
      3: "Le ZIP regroupe plusieurs fichiers compressés en un seul."
    },
    explication: "PDF signifie « Portable Document Format » : il conserve la mise en page originelle, quel que soit le logiciel.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-03",
    objectif: "TYP2",
    difficulte: 1,
    type: "ranger",
    enonce: "Où rangez-vous ce fichier ?",
    figure: { type: "fichier", nom: "brochure_cours_facultatifs_2026-2027.pdf" },
    propositions: ["Documents › Brochures", "Documents › Formulaires", "Documents › Tutoriels", "Documents › Web"],
    bonnes: [0],
    erreurs: {
      1: "Un formulaire est un document à remplir, par exemple une demande de congé.",
      2: "Un tutoriel explique pas à pas comment faire quelque chose.",
      3: "Le dossier Web accueille les pages web enregistrées."
    },
    explication: "C'est une brochure (un document de présentation) : elle va dans Documents › Brochures.",
    source: "Énoncé de l'exercice 1"
  },
  {
    id: "typ-04",
    objectif: "TYP2",
    difficulte: 1,
    type: "ranger",
    enonce: "Où rangez-vous ce fichier ?",
    figure: { type: "fichier", nom: "sommet_du_cervin.jpg" },
    propositions: ["Images › Montagne", "Images › Ville", "Images › Plage", "Documents › Brochures"],
    bonnes: [0],
    erreurs: {
      1: "Le nom indique un sommet : ce n'est pas une ville.",
      2: "Le nom indique un sommet, pas une plage.",
      3: "C'est une photo (extension .jpg) : elle va dans le dossier Images."
    },
    explication: "Le nom décrit une montagne (le Cervin) et l'extension .jpg indique une photo : Images › Montagne.",
    source: "Énoncé de l'exercice 1"
  },

  /* Questions ajoutées en phase 3 (relues et validées) */
  {
    id: "typ-05",
    objectif: "TYP1",
    difficulte: 1,
    type: "unique",
    enonce: "Quelle extension a un document de traitement de texte Microsoft Word ?",
    propositions: [".docx", ".xlsx", ".pdf", ".mp3"],
    bonnes: [0],
    erreurs: {
      1: "XLSX est le format de feuille de calcul de Microsoft Excel.",
      2: "Le PDF conserve la mise en page d'un document, quel que soit le logiciel.",
      3: "MP3 est un format audio."
    },
    explication: "DOCX : format de fichier de traitement de texte utilisé par Microsoft Word.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-06",
    objectif: "TYP1",
    difficulte: 1,
    type: "unique",
    enonce: "Quel est le format d'une feuille de calcul Microsoft Excel ?",
    propositions: ["XLSX", "DOCX", "ZIP", "PNG"],
    bonnes: [0],
    erreurs: {
      1: "DOCX est le format de traitement de texte de Microsoft Word.",
      2: "ZIP regroupe plusieurs fichiers compressés en un seul.",
      3: "PNG est un format d'image."
    },
    explication: "XLSX : format de feuille de calcul utilisé par Microsoft Excel.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-07",
    objectif: "TYP1",
    difficulte: 1,
    type: "unique",
    enonce: "Quel format audio compressé permet de stocker de la musique ?",
    propositions: ["MP3", "MP4", "JPG", "ZIP"],
    bonnes: [0],
    erreurs: {
      1: "MP4 est un format vidéo (qui peut aussi contenir de l'audio).",
      2: "JPG est un format d'image.",
      3: "ZIP regroupe des fichiers compressés ; ce n'est pas un format audio."
    },
    explication: "MP3 : format audio compressé qui permet de stocker de la musique sur un ordinateur ou un appareil portable.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-08",
    objectif: "TYP1",
    difficulte: 2,
    type: "unique",
    enonce: "Quel format vidéo peut aussi contenir de l'audio, des sous-titres et des images ?",
    propositions: ["MP4", "MP3", "PNG", "PDF"],
    bonnes: [0],
    erreurs: {
      1: "MP3 est un format audio : il ne contient pas de vidéo.",
      2: "PNG est un format d'image.",
      3: "Le PDF conserve la mise en page d'un document."
    },
    explication: "MP4 : format de fichier vidéo qui peut également contenir de l'audio, des sous-titres et des images.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-09",
    objectif: "TYP1",
    difficulte: 1,
    type: "multiple",
    enonce: "Quels formats sont des formats d'image ?",
    propositions: ["JPG", "PNG", "PDF", "MP4", "DOCX"],
    bonnes: [0, 1],
    explication: "JPG (photos) et PNG (transparences) sont des formats d'image. Le PDF conserve la mise en page d'un document ; MP4 est une vidéo ; DOCX, un texte Word.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-10",
    objectif: "TYP1",
    difficulte: 2,
    type: "unique",
    enonce: "Vous voulez envoyer 12 photos en un seul fichier. Quel format utilisez-vous ?",
    propositions: ["ZIP", "PDF", "PNG", "MP4"],
    bonnes: [0],
    erreurs: {
      1: "Le PDF sert à conserver la mise en page d'un document ; pour regrouper des fichiers, on utilise le ZIP.",
      2: "PNG est un format d'image : chaque photo resterait un fichier séparé.",
      3: "MP4 est un format vidéo."
    },
    explication: "Un fichier ZIP regroupe plusieurs fichiers en un seul : utile pour économiser de l'espace ou envoyer plusieurs fichiers en un paquet.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-11",
    objectif: "TYP1",
    difficulte: 2,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Pour une image avec un fond transparent, le format JPG convient.",
    propositions: ["Vrai", "Faux"],
    bonnes: [1],
    explication: "Faux : c'est le PNG qui permet les transparences et les fonds transparents. Le JPG est un format compressé, utilisé pour les photos.",
    source: "Tutoriel « Découvrir les fichiers », p. 3 (types de fichiers)"
  },
  {
    id: "typ-12",
    objectif: "TYP2",
    difficulte: 1,
    type: "ranger",
    enonce: "Où rangez-vous ce fichier ?",
    figure: { type: "fichier", nom: "demande_conge.pdf" },
    propositions: [
      "Documents › Formulaires",
      "Documents › Brochures",
      "Documents › Tutoriels",
      "Images › Ville"
    ],
    bonnes: [0],
    erreurs: {
      1: "Une brochure présente quelque chose (des cours, des activités) ; ici, c'est une demande à remplir.",
      2: "Un tutoriel explique pas à pas comment faire quelque chose.",
      3: "C'est un document PDF, pas une photo."
    },
    explication: "Une demande de congé est un formulaire à remplir : elle va dans Documents › Formulaires.",
    source: "Énoncé de l'exercice 1 (formulaire de demande de congé)"
  },
  {
    id: "typ-13",
    objectif: "TYP2",
    difficulte: 1,
    type: "ranger",
    enonce: "Où rangez-vous ce fichier ?",
    figure: { type: "fichier", nom: "coucher_de_soleil_plage.jpg" },
    propositions: ["Images › Plage", "Images › Montagne", "Images › Ville", "Documents › Web"],
    bonnes: [0],
    erreurs: {
      1: "Le nom indique une plage, pas une montagne.",
      2: "Le nom indique une plage, pas une ville.",
      3: "C'est une photo (extension .jpg) : elle va dans Images."
    },
    explication: "Le nom décrit une plage et l'extension .jpg indique une photo : Images › Plage.",
    source: "Énoncé de l'exercice 1"
  },
  {
    id: "typ-14",
    objectif: "TYP2",
    difficulte: 1,
    type: "ranger",
    enonce: "Où rangez-vous ce fichier ?",
    figure: { type: "fichier", nom: "tutoriel_connexion_wifi.pdf" },
    propositions: [
      "Documents › Tutoriels",
      "Documents › Brochures",
      "Documents › Formulaires",
      "Documents › Web"
    ],
    bonnes: [0],
    erreurs: {
      1: "Une brochure présente quelque chose ; ici, le nom indique un tutoriel.",
      2: "Un formulaire est un document à remplir, par exemple une demande de congé.",
      3: "Le dossier Web accueille les pages web enregistrées."
    },
    explication: "Un tutoriel explique pas à pas comment faire quelque chose : il va dans Documents › Tutoriels.",
    source: "Énoncé de l'exercice 1"
  },
  {
    id: "typ-15",
    objectif: "TYP2",
    difficulte: 1,
    type: "ranger",
    enonce: "Où rangez-vous ce fichier ?",
    figure: { type: "fichier", nom: "vue_sur_lausanne.jpg" },
    propositions: ["Images › Ville", "Images › Montagne", "Images › Plage", "Documents › Brochures"],
    bonnes: [0],
    erreurs: {
      1: "Lausanne est une ville : ce n'est pas une photo de montagne.",
      2: "Lausanne est une ville, pas une plage.",
      3: "C'est une photo (extension .jpg) : elle va dans Images."
    },
    explication: "Le nom décrit une ville (Lausanne) et l'extension .jpg indique une photo : Images › Ville.",
    source: "Énoncé de l'exercice 1"
  },
  {
    id: "typ-16",
    objectif: "TYP2",
    difficulte: 2,
    type: "ranger",
    enonce: "Où rangez-vous ce fichier ?",
    figure: { type: "fichier", nom: "brochure_camp_de_ski.pdf" },
    propositions: [
      "Documents › Brochures",
      "Images › Montagne",
      "Documents › Formulaires",
      "Documents › Tutoriels"
    ],
    bonnes: [0],
    erreurs: {
      1: "Le sujet est la montagne, mais c'est un document PDF, pas une photo : il va dans Documents.",
      2: "Un formulaire est un document à remplir ; ici, le nom indique une brochure.",
      3: "Un tutoriel explique comment faire quelque chose ; ici, le nom indique une brochure."
    },
    explication: "Rangez selon le type et le contenu : c'est une brochure en PDF, donc Documents › Brochures, même si elle parle de montagne.",
    source: "Énoncé de l'exercice 1"
  },

  /* ---------- RAC : raccourcis clavier ---------- */
  {
    id: "rac-01",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci crée un nouveau dossier ?",
    propositions: ["⌘ ⇧ N", "⌘ N", "⌘ T", "⌘ O"],
    bonnes: [0],
    erreurs: {
      1: "⌘ N ouvre une nouvelle fenêtre du Finder ou un nouveau fichier.",
      2: "⌘ T ouvre un nouvel onglet.",
      3: "⌘ O ouvre un fichier."
    },
    explication: "⌘ ⇧ N crée un nouveau dossier. Sans ⇧, ⌘ N ouvre une nouvelle fenêtre du Finder.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-02",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Que fait le raccourci ⌘ ⇧ 4 ?",
    propositions: [
      "Capture sélective de l'écran (une partie de la fenêtre)",
      "Capture écran de l'ensemble du bureau (toute la fenêtre)",
      "Capture sélective de la fenêtre active",
      "Capture sélective de l'écran (avec options et retardateur)"
    ],
    bonnes: [0],
    erreurs: {
      1: "Capturer l'ensemble du bureau, c'est ⌘ ⇧ 3.",
      2: "Capturer la fenêtre active, c'est ⌘ ⇧ 4 puis Espace.",
      3: "La capture avec options et retardateur, c'est ⌘ ⇧ 5."
    },
    explication: "⌘ ⇧ 4 permet de sélectionner une partie de l'écran. Suivi de la touche Espace, il capture la fenêtre active.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-03",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci annule la dernière action ?",
    propositions: ["⌘ Z", "⌘ Q", "⌘ W", "⌘ A"],
    bonnes: [0],
    erreurs: {
      1: "⌘ Q quitte l'application.",
      2: "⌘ W ferme la fenêtre.",
      3: "⌘ A sélectionne tout."
    },
    explication: "⌘ Z annule l'action ou revient en arrière.",
    source: "Fiche « Principaux raccourcis clavier »"
  },

  /* Questions ajoutées en phase 3 (relues et validées) */
  {
    id: "rac-04",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci permet de sélectionner tout (par exemple tout un texte) ?",
    propositions: ["⌘ A", "⌘ C", "⌘ V", "⌘ F"],
    bonnes: [0],
    erreurs: {
      1: "⌘ C copie le texte sélectionné et le mémorise.",
      2: "⌘ V colle le texte mémorisé.",
      3: "⌘ F sert à rechercher un mot ou une portion de texte."
    },
    explication: "⌘ A : sélectionner tout (sélectionne tout un texte, par exemple).",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-05",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Que fait le raccourci ⌘ N ?",
    propositions: [
      "Nouvelle fenêtre du Finder ou nouveau fichier",
      "Créer un nouveau dossier",
      "Nouvel onglet (dans le Finder ou dans un navigateur)",
      "Ouvrir un fichier"
    ],
    bonnes: [0],
    erreurs: {
      1: "Créer un nouveau dossier, c'est ⌘ ⇧ N (avec la touche ⇧).",
      2: "Un nouvel onglet, c'est ⌘ T.",
      3: "Ouvrir un fichier, c'est ⌘ O."
    },
    explication: "⌘ N ouvre une nouvelle fenêtre du Finder ou un nouveau fichier. Pour un nouveau dossier, ajoutez ⇧ : ⌘ ⇧ N.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-06",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci copie le texte sélectionné et le mémorise ?",
    propositions: ["⌘ C", "⌘ V", "⌘ A", "⌘ P"],
    bonnes: [0],
    erreurs: {
      1: "⌘ V colle le texte mémorisé.",
      2: "⌘ A sélectionne tout.",
      3: "⌘ P imprime un document, un fichier."
    },
    explication: "⌘ C : copier. Ensuite, ⌘ V colle le texte mémorisé.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-07",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Que fait le raccourci ⌘ V ?",
    propositions: [
      "Coller le texte sélectionné et mémorisé",
      "Copier le texte sélectionné",
      "Sélectionner tout",
      "Fermer une fenêtre"
    ],
    bonnes: [0],
    erreurs: {
      1: "Copier, c'est ⌘ C.",
      2: "Sélectionner tout, c'est ⌘ A.",
      3: "Fermer une fenêtre, c'est ⌘ W."
    },
    explication: "⌘ V : coller (colle le texte sélectionné et mémorisé avec ⌘ C).",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-08",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Quel raccourci permet de quitter une application ?",
    propositions: ["⌘ Q", "⌘ W", "⌘ M", "⌘ Z"],
    bonnes: [0],
    erreurs: {
      1: "⌘ W ferme une fenêtre ; pour quitter l'application, c'est ⌘ Q.",
      2: "⌘ M diminue la taille d'une fenêtre.",
      3: "⌘ Z annule l'action ou revient en arrière."
    },
    explication: "⌘ Q : quitter une application. ⌘ W ferme seulement une fenêtre.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-09",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Que fait le raccourci ⌘ W ?",
    propositions: [
      "Fermer une fenêtre",
      "Quitter une application",
      "Diminuer la taille d'une fenêtre",
      "Nouvelle fenêtre du Finder ou nouveau fichier"
    ],
    bonnes: [0],
    erreurs: {
      1: "Quitter une application, c'est ⌘ Q.",
      2: "Diminuer la taille d'une fenêtre, c'est ⌘ M.",
      3: "Une nouvelle fenêtre du Finder, c'est ⌘ N."
    },
    explication: "⌘ W : fermer une fenêtre.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-10",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci ouvre un nouvel onglet (dans le Finder ou dans un navigateur) ?",
    propositions: ["⌘ T", "⌘ N", "⌘ O", "⌘ W"],
    bonnes: [0],
    erreurs: {
      1: "⌘ N ouvre une nouvelle fenêtre du Finder ou un nouveau fichier.",
      2: "⌘ O ouvre un fichier.",
      3: "⌘ W ferme une fenêtre."
    },
    explication: "⌘ T : nouvel onglet, dans le Finder ou dans un navigateur.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-11",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci affiche les informations sur un fichier (par exemple ses métadonnées) ?",
    propositions: ["⌘ I", "⌘ F", "⌘ O", "⌘ A"],
    bonnes: [0],
    erreurs: {
      1: "⌘ F sert à rechercher un mot ou une portion de texte.",
      2: "⌘ O ouvre un fichier.",
      3: "⌘ A sélectionne tout."
    },
    explication: "⌘ I : information sur un fichier, par exemple ses métadonnées.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-12",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Que fait le raccourci ⌘ M ?",
    propositions: [
      "Diminuer la taille d'une fenêtre",
      "Fermer une fenêtre",
      "Changer d'application parmi les applications ouvertes",
      "Imprimer un document, un fichier"
    ],
    bonnes: [0],
    erreurs: {
      1: "Fermer une fenêtre, c'est ⌘ W.",
      2: "Changer d'application, c'est ⌘ ⇥.",
      3: "Imprimer, c'est ⌘ P."
    },
    explication: "⌘ M : diminuer la taille d'une fenêtre.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-13",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Quel raccourci permet de changer d'application parmi les applications ouvertes ?",
    propositions: ["⌘ ⇥", "⌘ Espace", "⌘ T", "⌘ Q"],
    bonnes: [0],
    erreurs: {
      1: "⌘ Espace ouvre Spotlight.",
      2: "⌘ T ouvre un nouvel onglet.",
      3: "⌘ Q quitte l'application."
    },
    explication: "⌘ ⇥ (touche Tab) : changer d'application parmi les applications ouvertes.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-14",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Une application ne répond plus. Quel raccourci permet de « forcer à quitter » ?",
    propositions: ["⌘ ⌥ esc", "⌘ Q", "⌘ W", "⌘ Z"],
    bonnes: [0],
    erreurs: {
      1: "⌘ Q quitte une application normalement ; « forcer à quitter », c'est ⌘ ⌥ esc.",
      2: "⌘ W ferme une fenêtre.",
      3: "⌘ Z annule l'action ou revient en arrière."
    },
    explication: "⌘ ⌥ esc : forcer à quitter (⌥ est la touche alt/option).",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-15",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci fait une capture d'écran de l'ensemble du bureau ?",
    propositions: ["⌘ ⇧ 3", "⌘ ⇧ 4", "⌘ ⇧ 5", "⌘ P"],
    bonnes: [0],
    erreurs: {
      1: "⌘ ⇧ 4 permet une capture sélective (une partie de l'écran).",
      2: "⌘ ⇧ 5 permet une capture sélective avec options et retardateur.",
      3: "⌘ P imprime un document."
    },
    explication: "⌘ ⇧ 3 : capture écran de l'ensemble du bureau (toute la fenêtre).",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-16",
    objectif: "RAC",
    difficulte: 3,
    type: "unique",
    enonce: "Quel raccourci permet une capture sélective de l'écran avec options et retardateur ?",
    propositions: ["⌘ ⇧ 5", "⌘ ⇧ 3", "⌘ ⇧ 4", "⌘ ⇧ 4 puis Espace"],
    bonnes: [0],
    erreurs: {
      1: "⌘ ⇧ 3 capture l'ensemble du bureau.",
      2: "⌘ ⇧ 4 permet une capture sélective (une partie de la fenêtre).",
      3: "⌘ ⇧ 4 puis Espace capture la fenêtre active."
    },
    explication: "⌘ ⇧ 5 : capture sélective de l'écran, avec options et retardateur.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-17",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Comment capturer seulement la fenêtre active ?",
    propositions: ["⌘ ⇧ 4 puis Espace", "⌘ ⇧ 3", "⌘ ⇧ 4", "⌘ Espace"],
    bonnes: [0],
    erreurs: {
      1: "⌘ ⇧ 3 capture l'ensemble du bureau.",
      2: "⌘ ⇧ 4 seul permet de sélectionner une partie de l'écran ; il faut ensuite appuyer sur Espace.",
      3: "⌘ Espace ouvre Spotlight : aucune capture n'est faite."
    },
    explication: "⌘ ⇧ 4, puis la touche Espace : capture sélective de la fenêtre active. C'est une séquence en deux temps.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-18",
    objectif: "RAC",
    difficulte: 2,
    type: "unique",
    enonce: "Que fait le raccourci ⌘ F ?",
    propositions: [
      "Rechercher un mot, une portion de texte",
      "Information sur un fichier",
      "Nouvelle fenêtre du Finder",
      "Ouvrir un fichier"
    ],
    bonnes: [0],
    erreurs: {
      1: "L'information sur un fichier, c'est ⌘ I.",
      2: "Une nouvelle fenêtre du Finder, c'est ⌘ N.",
      3: "Ouvrir un fichier, c'est ⌘ O."
    },
    explication: "⌘ F : rechercher un mot, une portion de texte (fichier texte ou Internet). Dans le Finder, il ouvre la recherche avancée.",
    source: "Fiche « Principaux raccourcis clavier » ; énoncés des exercices 4 et 5"
  },
  {
    id: "rac-19",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci permet d'imprimer un document, un fichier ?",
    propositions: ["⌘ P", "⌘ O", "⌘ I", "⌘ T"],
    bonnes: [0],
    erreurs: {
      1: "⌘ O ouvre un fichier.",
      2: "⌘ I affiche les informations sur un fichier.",
      3: "⌘ T ouvre un nouvel onglet."
    },
    explication: "⌘ P : imprimer un document, un fichier.",
    source: "Fiche « Principaux raccourcis clavier »"
  },
  {
    id: "rac-20",
    objectif: "RAC",
    difficulte: 1,
    type: "unique",
    enonce: "Que fait le raccourci ⌘ O ?",
    propositions: [
      "Ouvrir un fichier",
      "Fermer une fenêtre",
      "Imprimer un document",
      "Quitter une application"
    ],
    bonnes: [0],
    erreurs: {
      1: "Fermer une fenêtre, c'est ⌘ W.",
      2: "Imprimer, c'est ⌘ P.",
      3: "Quitter une application, c'est ⌘ Q."
    },
    explication: "⌘ O : ouvrir un fichier.",
    source: "Fiche « Principaux raccourcis clavier »"
  },

  /* ---------- REC : recherche de documents ---------- */
  {
    id: "rec-01",
    objectif: "REC1",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci ouvre Spotlight ?",
    propositions: ["⌘ Espace", "⌘ F", "⌘ ⇥", "⌘ I"],
    bonnes: [0],
    erreurs: {
      1: "⌘ F lance une recherche ; dans le Finder, il ouvre la recherche avancée.",
      2: "⌘ ⇥ permet de changer d'application parmi les applications ouvertes.",
      3: "⌘ I affiche les informations sur un fichier."
    },
    explication: "⌘ Espace ouvre Spotlight : tapez le nom d'un document, d'une application ou d'un dossier pour l'ouvrir.",
    source: "Tutoriel « Découvrir les fichiers », p. 1 ; énoncé de l'exercice 4"
  },
  {
    id: "rec-02",
    objectif: "REC3",
    difficulte: 2,
    type: "unique",
    enonce: "Dans la recherche avancée (⌘ F), vous cherchez les documents dont le texte contient le mot « gymnase ». Quel critère choisissez-vous ?",
    propositions: ["Contenu", "Nom", "Type", "Auteur"],
    bonnes: [0],
    erreurs: {
      1: "Le critère « Nom » cherche dans le nom du fichier, pas dans son texte.",
      2: "Le critère « Type » sert à choisir une catégorie de fichiers (PDF, image, archive…).",
      3: "Le critère « Auteur » cherche la personne qui a créé le document."
    },
    explication: "« Contenu » cherche dans le texte des documents ; « Nom » cherche seulement dans le nom du fichier.",
    source: "Énoncé de l'exercice 4"
  },
  {
    id: "rec-03",
    objectif: "REC2",
    difficulte: 1,
    type: "unique",
    enonce: "Dans la recherche avancée du Finder (⌘ F), comment ajoutez-vous un critère de recherche ?",
    propositions: ["Avec le bouton « + »", "Avec le bouton « − »", "En choisissant « Ce Mac »", "Avec le raccourci ⌘ N"],
    bonnes: [0],
    erreurs: {
      1: "Le bouton « − » supprime une ligne de critère.",
      2: "« Ce Mac » indique où chercher : dans tout l'ordinateur.",
      3: "⌘ N ouvre une nouvelle fenêtre du Finder."
    },
    explication: "Chaque clic sur « + » ajoute une ligne de critère ; les critères se combinent.",
    source: "Énoncé de l'exercice 4 (recherche avancée)"
  },

  /* Questions ajoutées en phase 3 (relues et validées) */
  {
    id: "rec-04",
    objectif: "REC1",
    difficulte: 2,
    type: "unique",
    enonce: "Vous cherchez la brochure des cours facultatifs 2026-2027, sans savoir où elle est rangée. Quel est le moyen le plus rapide de l'ouvrir ?",
    propositions: [
      "Spotlight (⌘ Espace), en tapant une partie de son nom",
      "Ouvrir chaque dossier de la barre latérale, un par un",
      "Le menu Pomme",
      "Le raccourci ⌘ N"
    ],
    bonnes: [0],
    erreurs: {
      1: "C'est possible, mais très lent : Spotlight trouve le fichier pour vous.",
      2: "Le menu Pomme ne sert pas à chercher des fichiers.",
      3: "⌘ N ouvre une nouvelle fenêtre du Finder ou un nouveau fichier."
    },
    explication: "Avec Spotlight, tapez par exemple « brochure » ou « facultatifs », puis ouvrez le bon résultat (exercice 4).",
    source: "Énoncé de l'exercice 4 (Spotlight)"
  },
  {
    id: "rec-05",
    objectif: "REC1",
    difficulte: 1,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Spotlight permet d'ouvrir une application, par exemple Calculette.",
    propositions: ["Vrai", "Faux"],
    bonnes: [0],
    explication: "Vrai : dans l'exercice 4, vous ouvrez avec Spotlight un document, une application (Calculette) et un dossier (Téléchargements).",
    source: "Énoncé de l'exercice 4 (Spotlight)"
  },
  {
    id: "rec-06",
    objectif: "REC2",
    difficulte: 1,
    type: "unique",
    enonce: "Quel raccourci ouvre la recherche avancée dans une fenêtre du Finder ?",
    propositions: ["⌘ F", "⌘ Espace", "⌘ I", "⌘ N"],
    bonnes: [0],
    erreurs: {
      1: "⌘ Espace ouvre Spotlight, pas la recherche avancée du Finder.",
      2: "⌘ I affiche les informations sur un fichier.",
      3: "⌘ N ouvre une nouvelle fenêtre du Finder ou un nouveau fichier."
    },
    explication: "Dans le Finder, ⌘ F ouvre la recherche avancée : on y ajoute des critères avec le bouton « + ».",
    source: "Énoncés des exercices 4 et 5 (CMD + F)"
  },
  {
    id: "rec-07",
    objectif: "REC2",
    difficulte: 2,
    type: "unique",
    enonce: "Dans la recherche avancée, vous voulez chercher dans tout l'ordinateur, pas seulement dans le dossier ouvert. Que choisissez-vous ?",
    propositions: ["« Ce Mac »", "Le nom du dossier ouvert", "« Récents »", "« Emplacements »"],
    bonnes: [0],
    erreurs: {
      1: "Ce choix limite la recherche au dossier ouvert.",
      2: "« Récents » est un élément de la barre latérale, pas une étendue de recherche.",
      3: "« Emplacements » est un titre de la barre latérale."
    },
    explication: "En haut de la recherche avancée, « Ce Mac » cherche dans tout l'ordinateur ; le nom du dossier limite la recherche à ce dossier.",
    source: "Énoncés des exercices 4 et 5 (recherche avancée) ; libellé « Ce Mac » : cahier des charges, objectif REC2"
  },
  {
    id: "rec-08",
    objectif: "REC2",
    difficulte: 2,
    type: "unique",
    enonce: "Vous ajoutez deux lignes de critères : le type PDF, et le contenu « données ». Quels fichiers s'affichent ?",
    propositions: [
      "Les PDF dont le contenu contient « données »",
      "Tous les PDF, et tous les fichiers qui contiennent « données »",
      "Seulement les fichiers nommés « données »",
      "Aucun : on ne peut pas combiner deux critères"
    ],
    bonnes: [0],
    erreurs: {
      1: "Les critères se combinent : un fichier doit remplir les deux conditions à la fois.",
      2: "Le critère « Contenu » cherche dans le texte du fichier, pas dans son nom.",
      3: "Le bouton « + » sert justement à ajouter et combiner des critères."
    },
    explication: "Chaque ligne ajoutée avec « + » précise la recherche : seuls les fichiers qui remplissent tous les critères s'affichent.",
    source: "Énoncé de l'exercice 5"
  },
  {
    id: "rec-09",
    objectif: "REC2",
    difficulte: 1,
    type: "unique",
    enonce: "Dans la recherche avancée, comment supprimez-vous une ligne de critère devenue inutile ?",
    propositions: [
      "Avec le bouton « − » de cette ligne",
      "Avec le bouton « + »",
      "En choisissant « Ce Mac »",
      "Avec le raccourci ⌘ W"
    ],
    bonnes: [0],
    erreurs: {
      1: "Le bouton « + » ajoute une ligne de critère.",
      2: "« Ce Mac » indique où chercher : dans tout l'ordinateur.",
      3: "⌘ W ferme toute la fenêtre."
    },
    explication: "Chaque ligne de critère a un bouton « − » pour la supprimer et un bouton « + » pour en ajouter une autre.",
    source: "Énoncés des exercices 4 et 5 (recherche avancée)"
  },
  {
    id: "rec-10",
    objectif: "REC3",
    difficulte: 1,
    type: "unique",
    enonce: "Vous cherchez les documents dont le nom contient « mystere ». Quel critère choisissez-vous ?",
    propositions: ["Nom", "Contenu", "Type", "Extension"],
    bonnes: [0],
    erreurs: {
      1: "« Contenu » cherche dans le texte du document, pas dans son nom.",
      2: "« Type » sert à choisir une catégorie (PDF, image, archive…).",
      3: "« Extension » porte sur la fin du nom (.jpg, .pdf…), pas sur un mot."
    },
    explication: "« Nom » cherche dans le nom du fichier. Pour les photos mystères, combinez-le avec le type Image (exercice 4).",
    source: "Énoncé de l'exercice 4"
  },
  {
    id: "rec-11",
    objectif: "REC3",
    difficulte: 2,
    type: "unique",
    enonce: "Pour afficher les PDF de plus de 10 pages, quels critères combinez-vous ?",
    propositions: [
      "Type (PDF) et Nombre de pages (plus de 10)",
      "Type (PDF) et Date de modification",
      "Nom (« 10 ») et Type (PDF)",
      "Extension (.pdf) seulement"
    ],
    bonnes: [0],
    erreurs: {
      1: "La date de modification ne dit rien du nombre de pages.",
      2: "Le nombre de pages n'apparaît pas forcément dans le nom du fichier.",
      3: "Il manque le critère du nombre de pages : tous les PDF s'afficheraient."
    },
    explication: "Deux conditions, deux critères : Type (PDF) et Nombre de pages (plus de 10).",
    source: "Énoncé de l'exercice 5"
  },
  {
    id: "rec-12",
    objectif: "REC3",
    difficulte: 3,
    type: "vraifaux",
    enonce: "Vrai ou faux ? Quand on cherche les PDF de « plus de 10 pages », un PDF de 10 pages exactement s'affiche.",
    propositions: ["Vrai", "Faux"],
    bonnes: [1],
    explication: "Faux : « plus de 10 pages » exclut les documents de 10 pages ; il en faut au moins 11.",
    source: "Énoncé de l'exercice 5"
  },
  {
    id: "rec-13",
    objectif: "REC3",
    difficulte: 2,
    type: "unique",
    enonce: "Pour afficher les documents dont l'auteur est « Al Tes » et qui ont l'extension .docx, quels critères utilisez-vous ?",
    propositions: [
      "Auteur (« Al Tes ») et Extension (docx)",
      "Nom (« Al Tes ») et Extension (docx)",
      "Auteur (« Al Tes ») seulement",
      "Contenu (« Al Tes ») et Type (PDF)"
    ],
    bonnes: [0],
    erreurs: {
      1: "Le nom de l'auteur n'est pas forcément dans le nom du fichier : utilisez le critère « Auteur ».",
      2: "Il manque l'extension : vous verriez aussi les autres documents d'Al Tes.",
      3: "Les documents cherchés sont des .docx, pas des PDF."
    },
    explication: "Deux conditions, deux critères : Auteur (« Al Tes ») et Extension (docx).",
    source: "Énoncé de l'exercice 5"
  },
  {
    id: "rec-14",
    objectif: "REC3",
    difficulte: 1,
    type: "unique",
    enonce: "Vous cherchez les documents modifiés avant le 1er janvier 2010. Quel critère choisissez-vous ?",
    propositions: ["Date de modification", "Nom", "Contenu", "Nombre de pages"],
    bonnes: [0],
    erreurs: {
      1: "La date n'est pas forcément dans le nom du fichier.",
      2: "« Contenu » cherche un mot dans le texte du document.",
      3: "« Nombre de pages » ne dit rien de la date."
    },
    explication: "« Date de modification » permet de chercher les fichiers modifiés avant une date, ou lors des derniers jours ou semaines.",
    source: "Énoncés des exercices 4 et 5"
  },
  {
    id: "rec-15",
    objectif: "REC3",
    difficulte: 3,
    type: "multiple",
    enonce: "Pour afficher les PDF modifiés lors des deux dernières semaines, quels critères devez-vous utiliser ?",
    propositions: [
      "Type (PDF)",
      "Date de modification (deux dernières semaines)",
      "Contenu (« PDF »)",
      "Nom (« semaine »)"
    ],
    bonnes: [0, 1],
    explication: "Il faut deux critères : Type (PDF) et Date de modification. « Contenu » ou « Nom » chercheraient un mot, pas un type ou une date.",
    source: "Énoncé de l'exercice 4"
  },
  {
    id: "rec-16",
    objectif: "REC4",
    difficulte: 1,
    type: "unique",
    enonce: "Dans l'exercice 4, où trouvez-vous le lieu de prise de vue d'une photo mystère ?",
    propositions: [
      "Dans les métadonnées du fichier",
      "Dans son extension",
      "Dans la barre latérale du Finder",
      "Dans le Dock"
    ],
    bonnes: [0],
    erreurs: {
      1: "L'extension indique seulement le format du fichier (par exemple .jpg).",
      2: "La barre latérale affiche des dossiers et des emplacements, pas des informations sur une photo.",
      3: "Le Dock contient des applications, pas des informations sur un fichier."
    },
    explication: "Le lieu de prise de vue fait partie des métadonnées : des informations enregistrées dans le fichier, en plus de l'image elle-même.",
    source: "Énoncé de l'exercice 4 (photos mystères)"
  },
  {
    id: "rec-17",
    objectif: "REC4",
    difficulte: 2,
    type: "multiple",
    enonce: "Parmi ces informations, lesquelles peuvent faire partie des métadonnées d'un fichier ?",
    propositions: [
      "Son auteur",
      "Sa date de modification",
      "Le lieu de prise de vue (pour une photo)",
      "Le nom de l'application active",
      "Le contenu de la Corbeille"
    ],
    bonnes: [0, 1, 2],
    explication: "Les métadonnées décrivent le fichier : auteur, dates, nombre de pages, lieu de prise de vue… ⌘ I affiche les informations sur un fichier, par exemple ses métadonnées.",
    source: "Fiche « Principaux raccourcis clavier » (⌘ I) ; énoncés des exercices 4 et 5"
  }

];
