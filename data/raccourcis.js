/* ==========================================================================
   Mission Finder — les 20 raccourcis clavier du « Clavier secret »
   Source : fiche « Principaux raccourcis clavier sur Mac OS X » (Gymnase de Burier,
   septembre 2025), formulation exacte. La 21e ligne de la fiche (« Répéter une action »)
   est exclue du site (décision de l'enseignant).
   ==========================================================================

   FORMAT D'UN RACCOURCI :
   {
     id: "cmd-n",               identifiant unique (ne jamais réutiliser)
     touches: ["⌘", "N"],       touches à presser ensemble : modificateurs (⌘ ⇧ ⌥) puis la touche finale
     puis: "Espace",            facultatif : touche à presser ensuite (séquence en deux temps)
     action: "…",               texte de la fiche
     precision: "…",            facultatif : texte entre parenthèses sur la fiche
     proches: ["cmd-maj-n"]     raccourcis souvent confondus avec celui-ci (distracteurs)
   },
   Touches finales possibles : A C F I M N O P Q T V W Z 3 4 5 esc ⇥ (Tab).
   ========================================================================== */

window.RACCOURCIS = [
  { id: "cmd-a", touches: ["⌘", "A"], action: "Sélectionner tout", precision: "sélectionne tout un texte par ex.",
    proches: ["cmd-c", "cmd-v", "cmd-z", "cmd-f"] },
  { id: "cmd-n", touches: ["⌘", "N"], action: "Nouvelle fenêtre du Finder ou nouveau fichier",
    proches: ["cmd-maj-n", "cmd-t", "cmd-o", "cmd-w"] },
  { id: "cmd-c", touches: ["⌘", "C"], action: "Copier", precision: "copie le texte sélectionné et le mémorise",
    proches: ["cmd-v", "cmd-a", "cmd-z"] },
  { id: "cmd-v", touches: ["⌘", "V"], action: "Coller", precision: "colle le texte sélectionné et mémorisé",
    proches: ["cmd-c", "cmd-a", "cmd-z"] },
  { id: "cmd-o", touches: ["⌘", "O"], action: "Ouvrir un fichier",
    proches: ["cmd-n", "cmd-p", "cmd-i", "cmd-f"] },
  { id: "cmd-p", touches: ["⌘", "P"], action: "Imprimer un document, un fichier",
    proches: ["cmd-o", "cmd-i", "cmd-f"] },
  { id: "cmd-q", touches: ["⌘", "Q"], action: "Quitter une application",
    proches: ["cmd-w", "cmd-alt-esc", "cmd-m"] },
  { id: "cmd-w", touches: ["⌘", "W"], action: "Fermer une fenêtre",
    proches: ["cmd-q", "cmd-m", "cmd-n"] },
  { id: "cmd-t", touches: ["⌘", "T"], action: "Nouvel onglet", precision: "dans le Finder ou dans un navigateur",
    proches: ["cmd-n", "cmd-maj-n", "cmd-tab"] },
  { id: "cmd-i", touches: ["⌘", "I"], action: "Information sur un fichier", precision: "par ex. ses métadonnées",
    proches: ["cmd-f", "cmd-o", "cmd-p"] },
  { id: "cmd-m", touches: ["⌘", "M"], action: "Diminuer la taille d'une fenêtre",
    proches: ["cmd-w", "cmd-q", "cmd-tab"] },
  /* Sur la fiche, cette ligne se termine par « (cmd + Tab.) » : retiré ici, car cela donne la réponse. */
  { id: "cmd-tab", touches: ["⌘", "⇥"], action: "Changer d'application parmi les applications ouvertes",
    proches: ["cmd-t", "cmd-q", "cmd-m"] },
  { id: "cmd-alt-esc", touches: ["⌘", "⌥", "esc"], action: "Forcer à quitter",
    proches: ["cmd-q", "cmd-w", "cmd-z"] },
  { id: "cmd-maj-3", touches: ["⌘", "⇧", "3"], action: "Capture écran de l'ensemble du bureau", precision: "toute la fenêtre",
    proches: ["cmd-maj-4", "cmd-maj-5", "cmd-maj-4-espace"] },
  { id: "cmd-maj-4", touches: ["⌘", "⇧", "4"], action: "Capture sélective de l'écran", precision: "une partie de la fenêtre",
    proches: ["cmd-maj-3", "cmd-maj-5", "cmd-maj-4-espace"] },
  { id: "cmd-maj-4-espace", touches: ["⌘", "⇧", "4"], puis: "Espace", action: "Capture sélective de la fenêtre active",
    proches: ["cmd-maj-4", "cmd-maj-3", "cmd-maj-5"] },
  { id: "cmd-maj-5", touches: ["⌘", "⇧", "5"], action: "Capture sélective de l'écran", precision: "avec options et retardateur",
    proches: ["cmd-maj-4", "cmd-maj-3", "cmd-maj-4-espace"] },
  { id: "cmd-maj-n", touches: ["⌘", "⇧", "N"], action: "Créer un nouveau dossier",
    proches: ["cmd-n", "cmd-t", "cmd-o"] },
  { id: "cmd-f", touches: ["⌘", "F"], action: "Rechercher un mot, une portion de texte", precision: "fichier texte ou Internet",
    proches: ["cmd-i", "cmd-o", "cmd-a"] },
  { id: "cmd-z", touches: ["⌘", "Z"], action: "Annuler l'action ou revenir en arrière",
    proches: ["cmd-q", "cmd-w", "cmd-c"] }
];
