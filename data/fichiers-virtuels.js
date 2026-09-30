/* ==========================================================================
   Mission Finder — « Détective du Finder » : système de fichiers fictif et missions de recherche
   Source : énoncés des exercices 4 et 5 (Spotlight, recherche avancée ⌘ F, photos mystères).
   Le jeu de fichiers est « discriminant » : pour chaque mission, chaque critère est indispensable
   (vérifié par node tests/test-recherche.js).
   ==========================================================================

   FORMAT D'UN ÉLÉMENT :
   { id, nom, genre: "fichier" | "dossier" | "application", type (catégorie du critère « Type »),
     dossier (emplacement), jours (modifié il y a N jours, par rapport au jour de l'élève)
     ou date ("AAAA-MM-JJ", date fixe), auteur, pages, mots (mots présents dans le contenu),
     et pour les photos : apercu ("ville" | "montagne" | "plage"), lieu (métadonnée). }
   ========================================================================== */

window.RECHERCHE = {

  elements: [
    /* Dossiers et applications */
    { id: "D1", nom: "Documents", genre: "dossier", type: "Dossier", dossier: "", jours: 1 },
    { id: "D2", nom: "Téléchargements", genre: "dossier", type: "Dossier", dossier: "", jours: 2 },
    { id: "D3", nom: "RECHERCHE-1C", genre: "dossier", type: "Dossier", dossier: "Documents", jours: 2 },
    { id: "D4", nom: "Images", genre: "dossier", type: "Dossier", dossier: "", jours: 6 },
    { id: "X1", nom: "Calculette", genre: "application", type: "Application", dossier: "Applications", date: "2024-09-16" },
    { id: "X2", nom: "Safari", genre: "application", type: "Application", dossier: "Applications", date: "2024-09-16" },
    { id: "X3", nom: "Word", genre: "application", type: "Application", dossier: "Applications", date: "2025-03-11" },

    /* Mission 1 : les archives */
    { id: "a1", nom: "Finder_Exercice1_2627.zip", type: "Archive", dossier: "Téléchargements", jours: 30 },
    { id: "a2", nom: "RECHERCHE-1C.zip", type: "Archive", dossier: "Téléchargements", jours: 2 },
    { id: "a3", nom: "photos_camp_de_ski.zip", type: "Archive", dossier: "Documents", jours: 60 },
    { id: "a4", nom: "Brochures.zip", type: "Archive", dossier: "Documents", jours: 45 },
    { id: "d1", nom: "archive_des_notes.docx", type: "Document", dossier: "Documents/RECHERCHE-1C", jours: 120, auteur: "Léa Martin", pages: 3, mots: ["notes", "trimestre"] },
    { id: "d2", nom: "archives_gymnase.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 400, auteur: "Direction", pages: 6, mots: ["archives", "gymnase", "bibliothèque"] },

    /* Mission 2 : le contenu contient « gymnase » */
    { id: "g1", nom: "reglement_interne.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 90, auteur: "Direction", pages: 12, mots: ["gymnase", "règlement", "élèves"] },
    { id: "g2", nom: "lettre_aux_parents.docx", type: "Document", dossier: "Documents/RECHERCHE-1C", jours: 25, auteur: "Al Tes", pages: 2, mots: ["gymnase", "parents", "rentrée"] },
    { id: "g3", nom: "horaire_bus.txt", type: "Texte", dossier: "Documents", jours: 200, mots: ["bus", "gymnase", "arrêt"] },
    { id: "g4", nom: "brochure_cours_facultatifs_2026-2027.pdf", type: "PDF", dossier: "Téléchargements", jours: 10, auteur: "Direction", pages: 16, mots: ["cours", "facultatifs", "gymnase", "inscription"] },
    { id: "n1", nom: "plan_du_gymnase.png", type: "Image", dossier: "Images", jours: 300 },
    { id: "n2", nom: "gymnase_menu_cafeteria.xlsx", type: "Document", dossier: "Documents", jours: 8, auteur: "Cafétéria", mots: ["menu", "repas", "prix"] },

    /* Mission 3 : PDF modifiés lors des deux dernières semaines */
    { id: "p1", nom: "rapport_de_stage.pdf", type: "PDF", dossier: "Documents", jours: 3, auteur: "Léa Martin", pages: 9, mots: ["stage", "rapport"] },
    { id: "p2", nom: "tutoriel_imprimante.pdf", type: "PDF", dossier: "Téléchargements", jours: 13, auteur: "Service informatique", pages: 4, mots: ["imprimante", "impression"] },
    { id: "p3", nom: "menu_semaine.pdf", type: "PDF", dossier: "Téléchargements", jours: 20, auteur: "Cafétéria", pages: 2, mots: ["menu", "repas"] },
    { id: "p4", nom: "ancienne_brochure.pdf", type: "PDF", dossier: "Documents", jours: 40, auteur: "Direction", pages: 8, mots: ["brochure", "cours"] },
    { id: "r1", nom: "notes_de_cours.docx", type: "Document", dossier: "Documents", jours: 5, auteur: "Léa Martin", pages: 4, mots: ["cours", "notes", "finder"] },
    { id: "r2", nom: "photo_recente.jpg", type: "Image", dossier: "Images", jours: 1, apercu: "ville", lieu: "Vevey, Suisse" },

    /* Mission 4 : nom contient « mystere » et de type image ; mission 10 : les photos mystères */
    { id: "m1", nom: "photo_mystere_1.jpg", type: "Image", dossier: "Documents/RECHERCHE-1C", jours: 70, apercu: "montagne", lieu: "Zermatt, Suisse" },
    { id: "m2", nom: "photo_mystere_2.jpg", type: "Image", dossier: "Documents/RECHERCHE-1C", jours: 70, apercu: "plage", lieu: "Biarritz, France" },
    { id: "m3", nom: "photo_mystere_3.jpg", type: "Image", dossier: "Documents/RECHERCHE-1C", jours: 70, apercu: "ville", lieu: "Lausanne, Suisse" },
    { id: "m4", nom: "enquete_mystere.docx", type: "Document", dossier: "Documents/RECHERCHE-1C", jours: 70, auteur: "Léa Martin", pages: 1, mots: ["enquête", "photos"] },
    { id: "m5", nom: "mystere_solution.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 70, auteur: "Al Tes", pages: 2, mots: ["solution", "lieux"] },
    { id: "m6", nom: "photo_lac.jpg", type: "Image", dossier: "Images", jours: 150, apercu: "plage", lieu: "Montreux, Suisse" },

    /* Mission 5 : les vidéos */
    { id: "v1", nom: "visite_du_gymnase.mp4", type: "Vidéo", dossier: "Documents/RECHERCHE-1C", jours: 80 },
    { id: "v2", nom: "tutoriel_finder.mov", type: "Vidéo", dossier: "Téléchargements", jours: 15 },
    { id: "v3", nom: "clip_journee_sportive.mp4", type: "Vidéo", dossier: "Documents", jours: 33 },
    { id: "v4", nom: "musique_bal.mp3", type: "Musique", dossier: "Documents", jours: 50 },
    { id: "v5", nom: "video_explications.pdf", type: "PDF", dossier: "Téléchargements", jours: 18, auteur: "Service informatique", pages: 3, mots: ["vidéo", "explications"] },

    /* Mission 6 : PDF dont le contenu contient « données » */
    { id: "q1", nom: "protection_des_donnees.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 100, auteur: "Direction", pages: 5, mots: ["données", "protection", "élèves"] },
    { id: "q2", nom: "statistiques_classe.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 22, auteur: "Al Tes", pages: 7, mots: ["données", "graphique", "moyenne"] },
    { id: "q3", nom: "tableur_mesures.xlsx", type: "Document", dossier: "Documents/RECHERCHE-1C", jours: 22, auteur: "Al Tes", mots: ["données", "mesures"] },
    { id: "q4", nom: "donnees_personnelles.pdf", type: "PDF", dossier: "Téléchargements", jours: 35, auteur: "Direction", pages: 3, mots: ["formulaire", "confidentialité"] },

    /* Mission 7 : auteur « Al Tes » et extension .docx */
    { id: "t1", nom: "exercices_word.docx", type: "Document", dossier: "Documents/RECHERCHE-1C", jours: 12, auteur: "Al Tes", pages: 3, mots: ["exercices", "word"] },
    { id: "t2", nom: "planning_projet.xlsx", type: "Document", dossier: "Documents/RECHERCHE-1C", jours: 12, auteur: "Al Tes", mots: ["planning", "projet"] },
    { id: "t3", nom: "correction.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 12, auteur: "Al Tes", pages: 2, mots: ["correction"] },
    { id: "t4", nom: "CV Al Tes.docx", type: "Document", dossier: "Téléchargements", jours: 300, auteur: "Léa Martin", pages: 1, mots: ["cv", "expérience"] },

    /* Mission 8 : modifiés avant le 1er janvier 2010 */
    { id: "o1", nom: "ancien_reglement.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", date: "2008-05-14", auteur: "Direction", pages: 11, mots: ["règlement"] },
    { id: "o2", nom: "photo_classe_2009.jpg", type: "Image", dossier: "Images", date: "2009-12-30", apercu: "ville", lieu: "La Tour-de-Peilz, Suisse" },
    { id: "o3", nom: "inventaire.xlsx", type: "Document", dossier: "Documents/RECHERCHE-1C", date: "2007-11-02", auteur: "Direction", mots: ["inventaire", "matériel"] },
    { id: "o4", nom: "archives_2010.docx", type: "Document", dossier: "Documents/RECHERCHE-1C", date: "2010-01-02", auteur: "Direction", pages: 5, mots: ["archives"] },
    { id: "o5", nom: "notes_2012.txt", type: "Texte", dossier: "Documents", date: "2012-03-10", mots: ["notes"] },

    /* Mission 9 : PDF de plus de 10 pages */
    { id: "k1", nom: "manuel_eleve.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 250, auteur: "Direction", pages: 24, mots: ["manuel", "élève"] },
    { id: "k2", nom: "guide_rapide.pdf", type: "PDF", dossier: "Documents/RECHERCHE-1C", jours: 250, auteur: "Service informatique", pages: 10, mots: ["guide"] },
    { id: "k3", nom: "memoire.docx", type: "Document", dossier: "Documents", jours: 180, auteur: "Léa Martin", pages: 30, mots: ["mémoire", "recherche"] }
  ],

  /* Partie A : Spotlight (exercice 4, question 1). */
  spotlight: [
    { id: "g4", consigne: "Ouvrez la brochure des cours facultatifs (2026-2027)." },
    { id: "X1", consigne: "Ouvrez l'application Calculette." },
    { id: "D2", consigne: "Ouvrez le dossier Téléchargements." }
  ],

  /* Missions de recherche avancée (exercices 4 et 5).
     solutions : recherches acceptées (toute recherche qui affiche exactement le même ensemble est acceptée) ;
     erreurs : erreurs typiques, qui doivent donner un autre ensemble (vérifié par les tests) ;
     criteres : nombre de critères nécessaires (pour l'indice « Avez-vous combiné… ? »). */
  missions: [
    { id: "s0", objectif: "REC1", titre: "Spotlight", partieA: true,
      consigne: "Avec Spotlight, ouvrez la brochure des cours facultatifs (2026-2027), l'application Calculette, puis le dossier Téléchargements.",
      indices: ["Écrivez une partie du nom dans le champ, puis touchez le bon résultat.", "Écrivez « facultatifs », puis « calcul », puis « télé ». Regardez le genre sous chaque résultat : document, application ou dossier."] },
    { id: "s1", objectif: "REC2", titre: "Les archives", criteres: 1,
      consigne: "Affichez les documents de type archive.",
      solutions: [[{ critere: "Type", operateur: "est", valeur: "Archive" }], [{ critere: "Extension", operateur: "est", valeur: "zip" }]],
      erreurs: [[{ critere: "Nom", operateur: "contient", valeur: "archive" }]],
      indices: ["Le critère « Type » permet de choisir une catégorie de fichiers.", "Touchez « + », choisissez « Type », puis « Archive ». Le mot « archive » dans le nom ne suffit pas."] },
    { id: "s2", objectif: "REC3", titre: "Le mot « gymnase »", criteres: 1,
      consigne: "Affichez les documents dont le contenu contient le mot « gymnase ».",
      solutions: [[{ critere: "Contenu", operateur: "contient", valeur: "gymnase" }]],
      erreurs: [[{ critere: "Nom", operateur: "contient", valeur: "gymnase" }]],
      indices: ["« Nom » cherche dans le nom du fichier ; « Contenu » cherche dans son texte.", "Un seul critère : « Contenu », « contient », « gymnase »."] },
    { id: "s3", objectif: "REC3", titre: "PDF récents", criteres: 2,
      consigne: "Affichez les documents de type PDF qui ont été modifiés lors des deux dernières semaines.",
      solutions: [[{ critere: "Type", operateur: "est", valeur: "PDF" }, { critere: "Date de modification", operateur: "dans les derniers", nombre: 2, unite: "semaines" }],
                  [{ critere: "Extension", operateur: "est", valeur: "pdf" }, { critere: "Date de modification", operateur: "dans les derniers", nombre: 14, unite: "jours" }]],
      erreurs: [[{ critere: "Type", operateur: "est", valeur: "PDF" }],
                [{ critere: "Date de modification", operateur: "dans les derniers", nombre: 2, unite: "semaines" }]],
      indices: ["Deux conditions, deux lignes de critères : touchez « + » une deuxième fois.", "Ligne 1 : « Type » est « PDF ». Ligne 2 : « Date de modification », « dans les derniers », 2 semaines."] },
    { id: "s4", objectif: "REC3", titre: "Mystère en images", criteres: 2,
      consigne: "Affichez les documents dont le nom contient le mot « mystere » et qui sont de type image.",
      solutions: [[{ critere: "Nom", operateur: "contient", valeur: "mystere" }, { critere: "Type", operateur: "est", valeur: "Image" }]],
      erreurs: [[{ critere: "Nom", operateur: "contient", valeur: "mystere" }], [{ critere: "Type", operateur: "est", valeur: "Image" }]],
      indices: ["Deux conditions : une sur le nom, une sur le type.", "Ligne 1 : « Nom » contient « mystere ». Ligne 2 : « Type » est « Image »."] },
    { id: "s5", objectif: "REC2", titre: "Les vidéos", criteres: 1,
      consigne: "Affichez les vidéos.",
      solutions: [[{ critere: "Type", operateur: "est", valeur: "Vidéo" }]],
      erreurs: [[{ critere: "Nom", operateur: "contient", valeur: "video" }], [{ critere: "Extension", operateur: "est", valeur: "mp4" }]],
      indices: ["Les vidéos n'ont pas toutes la même extension : utilisez le critère « Type ».", "« Type » est « Vidéo »."] },
    { id: "s6", objectif: "REC3", titre: "Des données en PDF", criteres: 2,
      consigne: "Affichez les documents de type PDF dont le contenu contient le mot « données ».",
      solutions: [[{ critere: "Type", operateur: "est", valeur: "PDF" }, { critere: "Contenu", operateur: "contient", valeur: "données" }],
                  [{ critere: "Extension", operateur: "est", valeur: "pdf" }, { critere: "Contenu", operateur: "contient", valeur: "données" }]],
      erreurs: [[{ critere: "Contenu", operateur: "contient", valeur: "données" }],
                [{ critere: "Type", operateur: "est", valeur: "PDF" }, { critere: "Nom", operateur: "contient", valeur: "donnees" }]],
      indices: ["Deux conditions : le type et le contenu (pas le nom).", "Ligne 1 : « Type » est « PDF ». Ligne 2 : « Contenu » contient « données »."] },
    { id: "s7", objectif: "REC3", titre: "Les documents d'Al Tes", criteres: 2,
      consigne: "Affichez les documents dont l'auteur est Al Tes et qui ont l'extension .docx.",
      solutions: [[{ critere: "Auteur", operateur: "contient", valeur: "Al Tes" }, { critere: "Extension", operateur: "est", valeur: "docx" }]],
      erreurs: [[{ critere: "Auteur", operateur: "contient", valeur: "Al Tes" }], [{ critere: "Nom", operateur: "contient", valeur: "Al Tes" }, { critere: "Extension", operateur: "est", valeur: "docx" }]],
      indices: ["L'auteur n'est pas forcément écrit dans le nom du fichier : utilisez le critère « Auteur ».", "Ligne 1 : « Auteur » contient « Al Tes ». Ligne 2 : « Extension » est « docx »."] },
    { id: "s8", objectif: "REC3", titre: "Avant 2010", criteres: 1,
      consigne: "Affichez les documents qui ont été modifiés avant le 1er janvier 2010.",
      solutions: [[{ critere: "Date de modification", operateur: "avant le", date: "2010-01-01" }]],
      erreurs: [[{ critere: "Date de modification", operateur: "après le", date: "2010-01-01" }], [{ critere: "Nom", operateur: "contient", valeur: "2009" }]],
      indices: ["Le critère « Date de modification » propose « avant le ».", "« Date de modification », « avant le », puis la date du 1er janvier 2010."] },
    { id: "s9", objectif: "REC3", titre: "Les gros PDF", criteres: 2,
      consigne: "Affichez les documents de type PDF qui ont plus que 10 pages.",
      solutions: [[{ critere: "Type", operateur: "est", valeur: "PDF" }, { critere: "Nombre de pages", operateur: "est supérieur à", nombre: 10 }]],
      erreurs: [[{ critere: "Nombre de pages", operateur: "est supérieur à", nombre: 10 }],
                [{ critere: "Type", operateur: "est", valeur: "PDF" }, { critere: "Nombre de pages", operateur: "est supérieur à", nombre: 9 }]],
      indices: ["Deux conditions : le type, et le nombre de pages. « Plus que 10 » exclut les documents de 10 pages.", "Ligne 1 : « Type » est « PDF ». Ligne 2 : « Nombre de pages », « est supérieur à », 10."] },
    { id: "s10", objectif: "REC4", titre: "Enquête : photos mystères", photos: ["m1", "m2", "m3"],
      consigne: "Pour chaque photo mystère, lisez le lieu de prise de vue dans ses métadonnées, puis renommez-la selon son contenu et son lieu.",
      indices: ["Touchez une photo : ses métadonnées indiquent le lieu de prise de vue.", "Un bon nom contient ce que montre la photo et le lieu, par exemple « montagne_zermatt.jpg »."] }
  ],

  /* Mission 10 : mots reconnus pour le contenu (sans tenir compte des majuscules ni des accents). */
  motsContenu: {
    montagne: ["montagne", "cervin", "sommet", "alpes", "pic", "neige", "glacier"],
    plage: ["plage", "mer", "sable", "ocean", "vague", "cote"],
    ville: ["ville", "immeuble", "rue", "batiment", "quartier", "cathedrale", "centre"]
  }
};
