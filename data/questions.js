/* ==========================================================================
   Mission Finder — banque de questions du « Quiz express »
   Phase 2 : 20 questions pilotes (BUR 3, FIN 7, TYP 4, RAC 3, REC 3).
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
     figure: { … },           facultatif : illustration (barre des menus, Dock, fichier)
     propositions: [ … ],     les réponses proposées (mélangées à chaque partie)
     bonnes: [0],             position(s) des bonnes réponses : 0 = 1re, 1 = 2e, 2 = 3e…
     erreurs: { 1: "…" },     facultatif : pourquoi la proposition n° 1 (la 2e) est fausse
     explication: "…",        affichée après la réponse (2 lignes maximum)
     source: "…"              document et page du cours
   },

   Dans un texte entre guillemets droits "…", l'apostrophe droite ' est permise.
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
  }

];
