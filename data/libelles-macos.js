/* ==========================================================================
   Mission Finder — libellés inspirés de macOS, à vérifier sur un Mac du gymnase
   (cahier des charges, section 4 : tout libellé incertain est regroupé ici).
   Pour corriger un libellé : modifier le texte entre guillemets, puis « Commit changes ».
   ========================================================================== */

window.LIBELLES_MACOS = {

  /* Atelier « Le grand rangement » : actions du menu « ⋯ ».
     Sur un vrai Mac, « Déplacer vers… » et « Copier vers… » se font en glissant les fichiers,
     et une archive se décompresse par un double-clic : ces deux libellés sont propres au site. */
  actions: {
    nouveauDossier: "Nouveau dossier",
    renommer: "Renommer",
    deplacer: "Déplacer vers…",
    copier: "Copier vers…",
    compresser: "Compresser",
    decompresser: "Décompresser",
    corbeille: "Placer dans la Corbeille",       // à vérifier : « Corbeille » avec ou sans majuscule
    informations: "Lire les informations",
    annuler: "Annuler"
  },

  /* Nom donné à un nouveau dossier (à vérifier). */
  nouveauDossierNom: "dossier sans titre",

  /* Détective du Finder : recherche avancée (⌘ F).
     Critères et valeurs du critère « Type » : noms repris des énoncés des exercices 4 et 5 (décision de l'enseignant).
     Opérateurs, « Rechercher : », « Ce Mac » : à vérifier sur un Mac du gymnase. */
  recherche: {
    rechercher: "Rechercher :",
    ceMac: "Ce Mac",
    criteres: ["Type", "Nom", "Contenu", "Date de modification", "Auteur", "Extension", "Nombre de pages"],
    operateurs: {
      "Type": ["est"],
      "Nom": ["contient"],
      "Contenu": ["contient"],
      "Auteur": ["contient"],
      "Extension": ["est"],
      "Date de modification": ["dans les derniers", "avant le", "après le"],
      "Nombre de pages": ["est supérieur à", "est inférieur à", "est égal à"]
    },
    valeursType: ["Archive", "PDF", "Image", "Vidéo", "Document", "Texte", "Musique", "Dossier", "Application"],
    unites: ["jours", "semaines"]
  },

  /* Type affiché par « Lire les informations » (à vérifier). */
  types: {
    dossier: "Dossier",
    pdf: "Document PDF",
    jpg: "Image JPEG",
    png: "Image PNG",
    zip: "Archive ZIP",
    html: "Page web (HTML)",
    autre: "Document"
  }
};
