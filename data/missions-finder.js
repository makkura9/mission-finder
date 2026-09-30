/* ==========================================================================
   Mission Finder — « Le grand rangement » (atelier fichiers et dossiers)
   Source : énoncé de l'exercice 1 et tutoriel « Découvrir les fichiers » (p. 2 à 4).
   Contenu du .zip : fictif, cohérent avec l'exercice 1 (cahier des charges, 5.4).
   ========================================================================== */

window.ATELIER = {

  /* Fichiers fictifs. categorie : dossier de rangement attendu ; doublonDe : fichier au même contenu ;
     apercu : dessin affiché par « Lire les informations » (images). Tailles en Ko. */
  fichiers: [
    { id: "b1", nom: "brochure_cours_facultatifs_2026-2027.pdf", categorie: "Brochures", taille: 2310 },
    { id: "b2", nom: "brochure_journee_sportive.pdf", categorie: "Brochures", taille: 845 },
    { id: "b3", nom: "brochure_journee_sportive (1).pdf", categorie: "Brochures", taille: 845, doublonDe: "b2" },
    { id: "b4", nom: "brochure_camp_de_ski.pdf", categorie: "Brochures", taille: 1270 },
    { id: "f1", nom: "formulaire_inscription_cours_facultatif.pdf", categorie: "Formulaires", taille: 188 },
    { id: "f2", nom: "copie de formulaire_inscription_cours_facultatif.pdf", categorie: "Formulaires", taille: 188, doublonDe: "f1" },
    { id: "t1", nom: "tutoriel_connexion_wifi.pdf", categorie: "Tutoriels", taille: 530 },
    { id: "t2", nom: "tutoriel_imprimer_un_document.pdf", categorie: "Tutoriels", taille: 412 },
    { id: "w1", nom: "page_accueil_gymnase.html", categorie: "Web", taille: 96 },
    { id: "w2", nom: "horaires_bus_gymnase.html", categorie: "Web", taille: 64 },
    { id: "i1", nom: "vue_sur_lausanne.jpg", categorie: "Ville", taille: 1840, apercu: "ville" },
    { id: "i2", nom: "PIXNIO-284311-1200x800.jpg", categorie: "Ville", taille: 1520, apercu: "ville", aRenommer: true },
    { id: "i3", nom: "sommet_du_cervin.jpg", categorie: "Montagne", taille: 2105, apercu: "montagne" },
    { id: "i4", nom: "sommet_du_cervin (1).jpg", categorie: "Montagne", taille: 2105, apercu: "montagne", doublonDe: "i3" },
    { id: "i5", nom: "IMG_4032.jpg", categorie: "Montagne", taille: 2380, apercu: "montagne", aRenommer: true },
    { id: "i6", nom: "coucher_de_soleil_plage.jpg", categorie: "Plage", taille: 1675, apercu: "plage" },
    { id: "i7", nom: "PIXNIO-592014-1200x800.jpg", categorie: "Plage", taille: 1490, apercu: "plage", aRenommer: true },
    /* Hors archive */
    { id: "c1", nom: "demande_conge.pdf", categorie: "Formulaires", taille: 120 },
    { id: "h1", nom: "mon_horaire_2026_2027.png", taille: 310, apercu: "horaire" },
    { id: "n1", nom: "introduction-outils-informatiques.pdf", taille: 760 }
  ],

  /* L'archive de l'exercice 1 (dans Téléchargements) et ce qu'elle contient. */
  archive: { nom: "Finder_Exercice1_2627.zip", contenu: ["b1", "b2", "b3", "b4", "f1", "f2", "t1", "t2", "w1", "w2", "i1", "i2", "i3", "i4", "i5", "i6", "i7"] },

  /* Situation de départ de la mission 1 (les missions suivantes partent de la solution des précédentes). */
  depart: {
    Bureau: ["h1"],
    Documents: [],
    "Téléchargements": ["archive", "c1", "n1"],
    OneDrive: []
  },

  /* Mots reconnus pour renommer les images selon leur contenu (sans tenir compte des majuscules ni des accents). */
  motsCles: {
    Ville: ["ville", "lausanne", "immeuble", "immeubles", "rue", "batiment", "batiments", "quartier", "cite", "maison", "maisons"],
    Montagne: ["montagne", "montagnes", "cervin", "sommet", "alpes", "pic", "neige", "glacier", "alpe"],
    Plage: ["plage", "mer", "sable", "ocean", "vague", "vagues", "cote", "littoral", "bord_de_mer"]
  },

  /* Les 9 missions. contexte : une phrase ; consigne : ce qu'il faut faire ; indices : du plus vague au plus précis. */
  missions: [
    { id: "m1", objectif: "FIN3", titre: "Un dossier pour l'exercice",
      contexte: "Premier jour de stage au service informatique : on vous confie le rangement des fichiers de l'exercice 1.",
      consigne: "Créez le dossier « Exercice_finder » sur le Bureau.",
      indices: ["Ouvrez le Bureau (bouton « Emplacements »), puis touchez « + ».",
                "Touchez « + » → « Nouveau dossier », puis nommez-le exactement « Exercice_finder » : E majuscule, trait de soulignement entre les deux mots."] },
    { id: "m2", objectif: "FIN3", titre: "Deux grands tiroirs",
      contexte: "Pour s'y retrouver, les documents et les images seront séparés.",
      consigne: "Dans « Exercice_finder », créez les dossiers « Documents » et « Images ».",
      indices: ["Ouvrez d'abord le dossier « Exercice_finder » : les nouveaux dossiers se créent dans le dossier ouvert.",
                "Le fil en haut doit afficher « Bureau › Exercice_finder » avant de toucher « + ». Attention : « Documents » des Emplacements est un autre dossier."] },
    { id: "m3", objectif: "FIN3", titre: "Des sous-dossiers",
      contexte: "Chaque type de document et chaque genre de photo aura sa place.",
      consigne: "Créez « Web », « Brochures », « Formulaires » et « Tutoriels » dans « Documents », puis « Ville », « Montagne » et « Plage » dans « Images ».",
      indices: ["Ouvrez « Exercice_finder › Documents » pour les quatre premiers dossiers, puis « Exercice_finder › Images » pour les trois autres.",
                "Vérifiez l'orthographe exacte : une majuscule au début, pas d'espace, pas de « s » en trop."] },
    { id: "m4", objectif: "FIN7", titre: "Ouvrir le colis",
      contexte: "Les fichiers de l'exercice sont arrivés dans une archive compressée.",
      consigne: "Décompressez « Finder_Exercice1_2627.zip » (dans Téléchargements).",
      indices: ["L'archive est dans Téléchargements. Touchez « ⋯ » à côté de son nom.",
                "Choisissez « Décompresser » : un dossier « Finder_Exercice1_2627 » apparaît à côté de l'archive."] },
    { id: "m5", objectif: "TYP2", titre: "Chaque fichier à sa place",
      contexte: "Le dossier décompressé déborde : il faut tout ranger, sans oublier le formulaire de congé téléchargé.",
      consigne: "Déplacez chaque fichier du dossier décompressé, ainsi que « demande_conge.pdf » (Téléchargements), dans le bon dossier d'« Exercice_finder ».",
      indices: ["Le nom et l'extension aident : .html = page web, .jpg = photo. Pour une photo au nom peu clair, touchez-la : son aperçu s'affiche.",
                "Utilisez « ⋯ » → « Déplacer vers… ». Les doublons se rangent aussi pour l'instant : on les supprimera à la mission suivante."] },
    { id: "m6", objectif: "FIN5", titre: "Chasse aux doublons",
      contexte: "Certains fichiers ont été téléchargés deux fois.",
      consigne: "Placez les doublons dans la Corbeille, en gardant les originaux.",
      indices: ["Un doublon a le même contenu : même taille, même aperçu. Les noms avec « (1) » ou « copie de » sont suspects.",
                "Il y a trois doublons : un dans Brochures, un dans Formulaires, un dans Montagne. Vérifiez avec « Lire les informations » avant de supprimer."] },
    { id: "m7", objectif: "FIN6", titre: "Des noms qui parlent",
      contexte: "Des photos portent des noms automatiques qui ne disent rien de leur contenu.",
      consigne: "Renommez les images au nom non explicite (« IMG_… », « PIXNIO… ») d'après ce qu'elles montrent.",
      indices: ["Touchez une image pour voir son aperçu, puis « ⋯ » → « Renommer ».",
                "Il y en a une dans Ville, une dans Montagne, une dans Plage. Gardez l'extension .jpg, par exemple « montagne_enneigee.jpg »."] },
    { id: "m8", objectif: "FIN7", titre: "Prêt à envoyer",
      contexte: "Votre responsable veut recevoir les brochures et les photos de montagne en un seul fichier chacun.",
      consigne: "Compressez les dossiers « Brochures » et « Montagne ».",
      indices: ["Touchez « ⋯ » à côté du dossier lui-même (pas de son contenu).",
                "« ⋯ » → « Compresser » crée « Brochures.zip » à côté du dossier « Brochures » ; faites de même pour « Montagne »."] },
    { id: "m9", objectif: "FIN4", titre: "Mission bonus : votre dossier 1C",
      contexte: "Comme dans le tutoriel, organisez maintenant votre propre dossier de cours.",
      consigne: "Créez « 1C › Bureautique › 1. Gestion des fichiers et dossiers, 2. Internet et Web, 3. Word, 4. Excel » sur le Bureau ; copiez « mon_horaire_2026_2027.png » dans « 1C » ; déplacez « introduction-outils-informatiques.pdf » (Téléchargements) dans « 1C » et renommez-le « introduction-outils-informatiques-prenom-nom.pdf » avec vos prénom et nom.",
      indices: ["Commencez par « 1C » sur le Bureau, puis « Bureautique » dedans, puis les quatre dossiers numérotés dans « Bureautique ».",
                "Noms exacts : « 1. Gestion des fichiers et dossiers » (point et espace après le chiffre). Pour le PDF : « introduction-outils-informatiques-lea-dupont.pdf », sans espace."] }
  ]
};
