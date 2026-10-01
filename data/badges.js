/* ==========================================================================
   Mission Finder — les 8 badges (phase 7)
   Chaque badge récompense une MAÎTRISE démontrée (cahier des charges, section 3) :
   pas de badge pour s'être connecté ni pour avoir joué longtemps.
   La condition de chaque badge est programmée dans js/badges.js (même identifiant).
   ========================================================================== */

window.BADGES = [
  { id: "raccourcis", nom: "Maître des raccourcis", description: "Réussissez chacun des 20 raccourcis du premier coup, au moins 2 fois (Clavier secret)." },
  { id: "bureau", nom: "Guide du Mac", description: "Atteignez 80 % de maîtrise sur les quatre objectifs du Bureau." },
  { id: "types", nom: "Expert·e des formats", description: "Atteignez 80 % de maîtrise sur les deux objectifs des types de fichiers." },
  { id: "finder", nom: "Pro du Finder", description: "Atteignez 80 % de maîtrise sur les huit objectifs des fichiers et dossiers." },
  { id: "rangement", nom: "As du rangement", description: "Réussissez les 9 missions du Grand rangement." },
  { id: "detective", nom: "Détective", description: "Réussissez toutes les missions du Détective du Finder." },
  { id: "banque", nom: "Banque complète", description: "Réussissez chaque question du Quiz express du premier coup, au moins une fois." },
  { id: "examen", nom: "Prêt·e pour le TE1", description: "Obtenez au moins 80 % à l'examen blanc." }
];
