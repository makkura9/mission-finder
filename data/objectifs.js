/* Mission Finder — objectifs d'apprentissage (section 2 du cahier des charges).
   Chaque question est rattachée à UN code d'objectif ci-dessous.
   « court » : libellé affiché dans « Mon bilan » ; « long » : description complète. */

window.OBJECTIFS = {
  themes: [
    { code: "BUR", nom: "Le Bureau de macOS" },
    { code: "FIN", nom: "Fichiers et dossiers" },
    { code: "TYP", nom: "Types de fichiers" },
    { code: "RAC", nom: "Raccourcis clavier" },
    { code: "REC", nom: "Recherche de documents" }
  ],
  liste: [
    { code: "BUR1", theme: "BUR", court: "Éléments du Bureau", long: "Nommer les éléments du Bureau : menu Pomme, barre des menus, disque, Dock, Dossier de départ, Corbeille." },
    { code: "BUR2", theme: "BUR", court: "Application active", long: "Identifier l'application active (son nom en gras à côté du menu Pomme)." },
    { code: "BUR3", theme: "BUR", court: "Applications ouvertes", long: "Reconnaître une application ouverte (petit point sous son icône dans le Dock)." },
    { code: "BUR4", theme: "BUR", court: "Ouvrir avec Spotlight", long: "Ouvrir le Finder ou une application avec Spotlight (loupe ou ⌘ Espace)." },

    { code: "FIN1", theme: "FIN", court: "Barre latérale", long: "Se repérer dans la barre latérale du Finder (Favoris, Emplacements, OneDrive)." },
    { code: "FIN2", theme: "FIN", court: "Présentations", long: "Changer de présentation et lire un chemin en présentation par colonnes." },
    { code: "FIN3", theme: "FIN", court: "Créer des dossiers", long: "Créer un dossier et une arborescence imbriquée." },
    { code: "FIN4", theme: "FIN", court: "Déplacer, renommer…", long: "Déplacer, copier, renommer, supprimer un fichier ou un dossier." },
    { code: "FIN5", theme: "FIN", court: "Doublons", long: "Repérer et supprimer des doublons." },
    { code: "FIN6", theme: "FIN", court: "Noms explicites", long: "Donner un nom de fichier explicite." },
    { code: "FIN7", theme: "FIN", court: "Compresser", long: "Compresser (archive .zip) et décompresser." },
    { code: "FIN8", theme: "FIN", court: "OneDrive", long: "Comprendre le rôle de OneDrive (dossier synchronisé)." },

    { code: "TYP1", theme: "TYP", court: "Extensions", long: "Associer une extension à son type et à son usage (DOCX, XLSX, PDF, JPG, PNG, ZIP, MP3, MP4)." },
    { code: "TYP2", theme: "TYP", court: "Où ranger ?", long: "Choisir le bon dossier de rangement selon le type et le contenu." },

    { code: "RAC",  theme: "RAC", court: "Raccourcis", long: "Les 20 raccourcis clavier de la fiche, dans les deux sens." },

    { code: "REC1", theme: "REC", court: "Spotlight", long: "Ouvrir un document, une application ou un dossier avec Spotlight (⌘ Espace)." },
    { code: "REC2", theme: "REC", court: "Recherche avancée", long: "Utiliser la recherche avancée du Finder (⌘ F) : étendue, bouton +." },
    { code: "REC3", theme: "REC", court: "Critères", long: "Choisir et combiner les critères de recherche." },
    { code: "REC4", theme: "REC", court: "Métadonnées", long: "Lire les métadonnées d'un fichier (⌘ I, « Lire les informations »)." }
  ]
};
