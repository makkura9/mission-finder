/* ==========================================================================
   Mission Finder — données de « Visite du Mac » (le Bureau de macOS)
   Source : tutoriel « Découvrir les fichiers », p. 1 (légende a–f, questions 2a et 2b,
   ouverture du Finder avec Spotlight). Légende validée par l'enseignant en phase 0.
   ========================================================================== */

window.BUREAU = {

  /* Les six éléments de la légende du tutoriel (p. 1).
     consigne : phrase du jeu « Touchez… » ; touche : ce qu'on dit quand l'élève touche cet élément ;
     ou : rappel de sa position (affiché si l'élève le confond avec un autre). */
  elements: [
    { id: "pomme", lettre: "a", nom: "Menu Pomme", consigne: "Touchez le menu Pomme.", touche: "le menu Pomme",
      ou: "Le menu Pomme est tout à gauche de la barre des menus.",
      explication: "Le menu Pomme est tout à gauche de la barre des menus, en haut de l'écran." },
    { id: "barre", lettre: "b", nom: "Barre des menus", consigne: "Touchez la barre des menus.", touche: "la barre des menus",
      ou: "La barre des menus occupe tout le haut de l'écran.",
      explication: "La barre des menus, en haut de l'écran, affiche le menu Pomme, puis le nom de l'application active en gras et ses menus." },
    { id: "disque", lettre: "c", nom: "Disque (icône « DISQUE »)", consigne: "Touchez le disque de l'ordinateur.", touche: "le disque de l'ordinateur (icône « DISQUE »)",
      ou: "L'icône « DISQUE » se trouve sur le Bureau, en haut à droite.",
      explication: "L'icône « DISQUE », sur le Bureau, représente le disque de l'ordinateur." },
    { id: "dock", lettre: "d", nom: "Dock", consigne: "Touchez le Dock.", touche: "le Dock",
      ou: "Le Dock est la barre d'icônes en bas de l'écran.",
      explication: "Le Dock, en bas de l'écran, contient les icônes des applications, le Dossier de départ et la Corbeille." },
    { id: "depart", lettre: "e", nom: "Dossier de départ", consigne: "Touchez le Dossier de départ.", touche: "le Dossier de départ",
      ou: "Le Dossier de départ est dans le Dock, juste après le séparateur.",
      explication: "Le Dossier de départ, dans le Dock après le séparateur, mène à votre espace personnel sur le serveur du gymnase." },
    { id: "corbeille", lettre: "f", nom: "Corbeille", consigne: "Touchez la Corbeille.", touche: "la Corbeille",
      ou: "La Corbeille est la dernière icône du Dock.",
      explication: "La Corbeille, au bout du Dock, contient les éléments supprimés." }
  ],

  /* Applications du Dock simulé : carrés de couleur avec abréviation (aucun logo).
     Le Finder est toujours présent et toujours ouvert ; 3 autres sont tirées au hasard. */
  applications: [
    { nom: "Finder", abr: "Fi", couleur: "#2F7FD8" },
    { nom: "Safari", abr: "Sa", couleur: "#177E9C" },
    { nom: "Mail", abr: "Ma", couleur: "#2F66D0" },
    { nom: "Notes", abr: "No", couleur: "#8A6100" },
    { nom: "Photos", abr: "Ph", couleur: "#B0275E" },
    { nom: "Word", abr: "Wo", couleur: "#2B579A" },
    { nom: "Excel", abr: "Ex", couleur: "#217346" }
  ],

  /* Menus affichés dans la barre des menus : ceux du Finder (capture du tutoriel, p. 1) ;
     pour les autres applications, seulement « Fichier » et « Édition », présents partout. */
  menusFinder: ["Fichier", "Édition", "Présentation", "Aller", "Fenêtre", "Aide"],
  menusAutres: ["Fichier", "Édition"],

  /* Mini-scène Spotlight : ouvrir le Finder (tutoriel, p. 1). Résultats possibles de la recherche. */
  spotlight: {
    cible: "Finder",
    resultats: [
      { nom: "Finder", genre: "Application" },
      { nom: "Calculette", genre: "Application" },
      { nom: "Safari", genre: "Application" },
      { nom: "Word", genre: "Application" },
      { nom: "Finder_Exercice1_2627.zip", genre: "Document" },
      { nom: "tutoriel_finder.pdf", genre: "Document" },
      { nom: "brochure_cours_facultatifs_2026-2027.pdf", genre: "Document" },
      { nom: "Téléchargements", genre: "Dossier" },
      { nom: "Documents", genre: "Dossier" }
    ]
  },

  source: "Tutoriel « Découvrir les fichiers », p. 1"
};
