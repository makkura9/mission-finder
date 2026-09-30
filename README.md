# Mission Finder

Site de révision pour smartphone : fichiers et dossiers sous macOS (préparation du TE1, informatique, classe 1C).

- Site statique (HTML, CSS, JavaScript), hébergé gratuitement par GitHub Pages.
- Aucune donnée n'est envoyée : pas de compte, pas de statistiques, pas de ressource externe.
- La progression des élèves reste uniquement dans le navigateur de leur téléphone.

**Adresse : https://makkura9.github.io/mission-finder/**

**État : terminé (phase 8).** Cinq activités — Quiz express (90 questions) et Révision du jour, Clavier secret, Visite du Mac, Le grand rangement (9 missions), Détective du Finder (Spotlight, recherche avancée, photos mystères) — puis un examen blanc (sans chronomètre), 8 badges, Mon bilan, Profil, Aide.

## Diffusion aux élèves

| Fichier | Usage |
|---|---|
| `diffusion/fiche-eleve.pdf` | Page A4 avec **deux fiches d'une demi-page** (à imprimer puis découper) : adresse, QR code, ajout à l'écran d'accueil (iPhone et Android), progression gardée sur le téléphone |
| `diffusion/qr-code-mission-finder.png` | QR code seul, à projeter ou à coller dans un document (vers https://makkura9.github.io/mission-finder/) |

Pour télécharger un de ces fichiers depuis github.com : ouvrir le dossier `diffusion`, cliquer le fichier, puis l'icône **Download raw file** (flèche vers le bas, en haut à droite du fichier).

---

## Guide pour l'enseignant

### Vocabulaire

- **Dépôt** (*repository*) : dossier en ligne qui contient les fichiers du site et l'historique de leurs modifications.
- **Commit** (*Commit changes*) : enregistrement d'une modification, avec un court message.
- **Branche** (*branch*) : version des fichiers. `main` est la version principale, celle que publie GitHub Pages ; Claude Code travaille sur une branche à part.
- **Pull request** : demande de fusion d'une branche dans `main`. **Fusionner** (*merge*) = publier les modifications dans la version principale.

L'interface de GitHub est en anglais. Les libellés ci-dessous sont ceux connus à mi-2026 ; ils peuvent légèrement varier.

### Mettre le site en ligne (première fois)

1. Créer un compte sur https://github.com/signup (le nom d'utilisateur apparaîtra dans l'adresse du site).
2. Créer un dépôt : **+** → **New repository** → nom `mission-finder` → **Public** → activer **Add README** → **Create repository**.
3. Envoyer les fichiers : **Add file** (si la fenêtre est étroite, ce bouton s'affiche comme un **+** gris à gauche du bouton vert **Code**) → **Upload files** → glisser **le contenu** du dossier extrait (pas le dossier lui-même, pas le .zip) → **Commit changes**.
4. Activer Pages : **Settings** → **Pages** → **Build and deployment** → Source : **Deploy from a branch** → Branch : **main**, dossier **/ (root)** → **Save**.
5. Attendre 1 à 3 minutes, recharger la page **Settings → Pages**, puis cliquer **Visit site**.

Adresse du site : `https://<nom-utilisateur>.github.io/mission-finder/`

### Mettre à jour le site avec Claude Code

1. Ouvrir le lien de comparaison donné par Claude (ou, dans la session, cliquer **Create PR** s'il est proposé).
2. Cliquer **Create pull request** (deux fois : une pour ouvrir le formulaire, une pour le valider).
3. Cliquer **Merge pull request**, puis **Confirm merge** (fusionner = publier dans la version principale).
4. Attendre 1 à 3 minutes, puis vérifier le numéro de version en bas de l'accueil du site.

### Mettre à jour le site à la main (sans Claude Code)

1. **Add file** → **Upload files** → glisser le contenu du nouveau dossier extrait → **Commit changes**. Les fichiers de même nom sont remplacés.
2. Attendre 1 à 3 minutes (onglet **Actions** : la ligne *pages build and deployment* doit avoir une coche verte).
3. Ouvrir le site et vérifier le numéro de version affiché en bas de page.

### En option : GitHub Desktop

Pour ceux qui préfèrent travailler avec des fichiers sur leur ordinateur, l'application gratuite **GitHub Desktop** (https://desktop.github.com) évite les envois par le navigateur. Ce n'est pas nécessaire.

1. Installer GitHub Desktop et se connecter avec son compte GitHub.
2. **File** → **Clone repository** → choisir `mission-finder` → **Clone** (copie le dépôt dans un dossier de l'ordinateur).
3. Modifier les fichiers de ce dossier avec un éditeur de texte simple (TextEdit en mode « texte brut », ou Visual Studio Code).
4. Dans GitHub Desktop : écrire un court résumé en bas à gauche → **Commit to main** → **Push origin** (envoyer sur GitHub).

### Dépannage

| Problème | Cause probable | Correction |
|---|---|---|
| Erreur 404 | Publication pas encore terminée, ou `index.html` pas à la racine du dépôt | Attendre 2 min et recharger ; vérifier que `index.html` apparaît directement dans la liste des fichiers du dépôt ; vérifier **Settings → Pages** : `main` et `/ (root)` |
| Page sans couleurs ni icône | Dossier `css` ou `img` non envoyé | Refaire **Upload files** en glissant les dossiers manquants |
| Ancienne version affichée | Cache du navigateur | Sur PC : Ctrl + F5 ; sur téléphone : attendre quelques minutes puis recharger |
| Fichier `.nojekyll` absent de la liste | Fichier vide non envoyé | **Add file** → **Create new file** → nom `.nojekyll`, contenu vide → **Commit changes** |
| « Site momentanément indisponible » | Erreur de frappe dans un fichier de `data/` (souvent après une modification à la main) | Le message nomme le fichier et la ligne : voir « Modifier une question » ci-dessous, les 3 erreurs à éviter |
| Page blanche | Fichier `js/…` manquant ou abîmé | Onglet **Code** → **History** (historique) : repérer la dernière modification, puis refaire l'envoi du fichier d'origine |
| Un élève a perdu sa progression | Données du navigateur effacées, autre navigateur, ou Safari au lieu de l'icône | Rien ne peut être récupéré sans code de transfert (Profil → « Copier le code ») ; conseiller d'utiliser toujours l'icône |

### Structure des fichiers

```
index.html               page unique du site
.nojekyll                indique à GitHub de publier les fichiers tels quels
manifest.webmanifest     ajout à l'écran d'accueil (nom, icônes, couleurs)
css/style.css            couleurs et mise en page (charte « Léman », modes clair et sombre)
js/ui.js                 petits outils d'affichage
js/storage.js            sauvegarde de la progression (localStorage)
js/progression.js        points, niveaux, étoiles, maîtrise, records
js/leitner.js            répétition espacée (boîtes de Leitner), Révision du jour
js/partie.js             règles communes des parties (points, série, étoiles, écran de résultat)
js/atelier-modele.js     Finder simulé : dossiers, actions, vérification des 9 missions
js/recherche-modele.js   recherche simulée : critères, dates relatives, vérification des missions
js/figures.js            illustrations des questions (barre des menus, Dock, fichier, Finder)
js/modules/qcm.js        Quiz express
js/modules/raccourcis.js Clavier secret (clavier virtuel)
js/modules/bureau.js     Visite du Mac (Bureau simulé, Spotlight)
js/modules/finder.js     Le grand rangement (écran du Finder simulé, missions)
js/modules/recherche.js  Détective du Finder (Spotlight, recherche avancée, photos mystères)
js/modules/examen.js     Examen blanc (20 questions + 2 missions, bilan par thème)
js/badges.js             conditions des 8 badges
js/app.js                navigation, accueil, bilan, profil, aide
data/questions.js        banque de questions (modifiable)
data/raccourcis.js       les 20 raccourcis de la fiche (Clavier secret)
data/bureau.js           légende du Bureau, applications du Dock, résultats Spotlight (Visite du Mac)
data/missions-finder.js  les 9 missions, les fichiers fictifs de l'exercice 1, les mots reconnus (Le grand rangement)
data/fichiers-virtuels.js les fichiers fictifs et les missions de recherche (exercices 4 et 5)
data/libelles-macos.js   libellés inspirés de macOS à vérifier sur un Mac du gymnase
data/badges.js           noms et textes des 8 badges
data/objectifs.js        objectifs d'apprentissage
data/niveaux.js          niveaux et seuils de points
data/textes.js           messages de retour, numéro de version
img/                     icônes du site
CLAUDE.md                consignes lues par Claude Code à chaque session
diffusion/               fiche élève (PDF) et QR code (non utilisés par le site)
docs/                    cahier des charges (non utilisé par le site)
tests/                   tests automatiques, page de relecture, générateur de la fiche élève (non utilisés par le site)
```

### Où est enregistrée la progression ?

Dans le `localStorage` du navigateur de l'élève (clé `missionFinder.v1`). Le principe est le même que celui des cookies, mais la capacité est plus grande (environ 5 Mo au lieu de 4 Ko) et rien n'est envoyé au serveur à chaque visite. La progression est donc liée à un téléphone et à un navigateur ; l'onglet **Profil** permet de la transférer par un code.

### Relire les questions

Ouvrir https://makkura9.github.io/mission-finder/tests/relecture.html (sur ordinateur) : toutes les questions, avec la bonne réponse, les explications et la source, puis les textes de « Visite du Mac » et de « Clavier secret ». Ce qui reste à relire porte le badge « À relire ». Pour imprimer : Ctrl + P (ou ⌘ P) → « Enregistrer au format PDF ».

### Révision du jour (répétition espacée)

Chaque question vue est rangée dans une « boîte » de 1 à 5. Juste du premier coup : boîte suivante ; sinon : retour en boîte 1. Une question revient dans la Révision du jour après 0 jour (boîte 1), 1 jour (boîte 2), 3 jours (boîte 3), 7 jours (boîte 4) ou 14 jours (boîte 5). Ces délais se modifient en haut de `js/leitner.js`.

### Modifier une question

Durée : 5 minutes. Le site est mis à jour 1 à 3 minutes après l'enregistrement.

1. Sur github.com, ouvrir le dépôt `mission-finder`, puis le dossier `data`, puis le fichier `questions.js`.
2. Repérer la question grâce à son `id` : touche **Ctrl + F** (ou **⌘ F**), taper par exemple `bur-01`.
3. Cliquer l'icône **crayon** (*Edit this file*) en haut à droite du fichier.
4. Modifier **seulement le texte entre les guillemets droits** `"…"`.
5. Cliquer **Commit changes…**, laisser **Commit directly to the main branch**, puis cliquer **Commit changes**.

#### Une question, commentée

```js
  {
    id: "bur-01",                  // identifiant : ne pas le changer (il relie la question à la progression des élèves)
    objectif: "BUR2",              // code d'objectif (liste dans data/objectifs.js)
    difficulte: 1,                 // 1 facile, 2 moyen, 3 difficile (un nombre : pas de guillemets)
    type: "unique",                // "unique", "multiple", "vraifaux" ou "ranger"
    enonce: "Dans cette barre des menus, quelle est l'application active ?",
    figure: { type: "barreMenus", app: "Excel", menus: ["Fichier", "Édition", "Affichage"] },
    propositions: ["Excel", "Finder", "Word", "Safari"],   // les réponses (mélangées à l'affichage)
    bonnes: [0],                   // position de la bonne réponse : 0 = la 1re, 1 = la 2e, 2 = la 3e…
    erreurs: {                     // pourquoi une réponse est fausse (affiché après la 1re erreur)
      1: "Le Finder est toujours ouvert, mais ici ce n'est pas son nom qui apparaît en gras à côté du menu Pomme.",
      2: "Le nom « Word » n'apparaît pas à côté du menu Pomme.",
      3: "Le nom « Safari » n'apparaît pas à côté du menu Pomme."   // n° 1 = « Finder », 2 = « Word », 3 = « Safari »
    },
    explication: "L'application active est celle dont le nom apparaît en gras à côté du menu Pomme, dans la barre des menus.",
    source: "Tutoriel « Découvrir les fichiers », p. 1"     // pas de virgule après le dernier champ
  },                               // virgule entre deux questions
```

Les commentaires `// …` ci-dessus servent d'explication : ils ne figurent pas dans le fichier.

#### Les 3 erreurs à éviter

| Erreur | Faux | Juste |
|---|---|---|
| **Virgule oubliée** à la fin d'une ligne ou entre deux questions | `enonce: "Quel raccourci…"` ↵ `propositions: […]` | `enonce: "Quel raccourci…",` ↵ `propositions: […]` |
| **Guillemet non fermé** | `enonce: "Quel raccourci ?,` | `enonce: "Quel raccourci ?",` |
| **Guillemets typographiques** autour du texte (souvent après un copier-coller depuis Word) | `enonce: “Quel raccourci ?”,` | `enonce: "Quel raccourci ?",` |

- **À l'intérieur** d'un texte, l'apostrophe droite `'` et l'apostrophe typographique `’` sont toutes deux permises, de même que les guillemets « … ». En revanche, un guillemet droit `"` à l'intérieur du texte le coupe : écrire « Documents » et non "Documents".
- Écrire directement sur github.com plutôt que de copier depuis Word : Word remplace `"` par `“ ”`.

#### Si le site affiche « Site momentanément indisponible »

1. Lire le nom du fichier et le numéro de ligne indiqués dans le message.
2. Ouvrir ce fichier sur github.com, cliquer le **crayon** : les numéros de ligne sont à gauche.
3. Chercher l'erreur **sur cette ligne ou juste au-dessus** (une virgule oubliée est signalée à la ligne suivante).
4. Corriger, puis **Commit changes** ; recharger le site 1 à 3 minutes plus tard.

En cas de doute, demander à Claude Code : « Vérifiez data/questions.js et corrigez l'erreur ».

#### Ajouter une question

Copier une question entière (de `{` à `},`), la coller juste après, puis changer son `id` (un `id` jamais utilisé, par exemple `fin-27`) et ses textes. Si une question a une figure, supprimer la ligne `figure` ou demander à Claude Code de l'adapter.

### Points à vérifier sur un Mac du gymnase

| Élément | Où il apparaît | Question |
|---|---|---|
| « Par galerie » | question fin-01 | Libellé exact du menu Présentation dans macOS 15 ? (conservé en attendant) |
| Menus « Fichier, Édition, Affichage » d'Excel | figure de la question bur-01 | Libellés exacts dans Excel pour Mac ? (conservés en attendant) |
| « Ce Mac » | question rec-07 | Libellé de l'étendue de la recherche avancée (⌘ F) |
| « Placer dans la Corbeille » | Le grand rangement (`data/libelles-macos.js`) | « Corbeille » avec ou sans majuscule dans le menu du Finder ? |
| « dossier sans titre » | Le grand rangement | Nom exact d'un nouveau dossier ? |
| Types « Document PDF », « Image JPEG », « Image PNG », « Archive ZIP », « Page web (HTML) » | « Lire les informations » de l'atelier | Libellés exacts du champ « Type » ? |
| Lieu de prise de vue d'une photo | mission « photos mystères » | Décidé (choix 1) : panneau « Métadonnées de la photo », sans nommer l'outil de macOS |
| Recherche avancée : « Rechercher : », « Ce Mac », opérateurs (« dans les derniers », « avant le », « est supérieur à »…) | Détective du Finder (`data/libelles-macos.js`) | Libellés exacts dans macOS 15 ? |
| Critère « Type » : un PDF compte-t-il aussi comme « Document » ? | Détective du Finder | Dans le site : non (une seule catégorie par fichier) |

### Points à vérifier sur un téléphone

| Élément | Question |
|---|---|
| iPhone : « Sur l'écran d'accueil » / « Ajouter à l'écran d'accueil » | Décidé (phase 3) : les deux libellés restent indiqués dans l'Aide |
| iPhone : progression de l'icône séparée de celle de Safari | Décidé (phase 3) : l'Aide conseille d'utiliser toujours l'icône |
| Android : « Ajouter à l'écran d'accueil » / « Installer l'application » | Décidé (phase 3) : les deux libellés restent indiqués dans l'Aide et sur la fiche élève |

---

## Pour Claude Code et les développeurs

- Consignes : `CLAUDE.md` (décisions, architecture, conventions) et `docs/cahier-des-charges.md`.
- Tests à lancer avant chaque livraison : liste dans `CLAUDE.md`, section 5.
- Fiche élève et QR code : `python3 tests/generer_diffusion.py` (nécessite `segno` et Playwright) les régénère dans `diffusion/`.
- Hors ligne (service worker) : écarté par l'enseignant (phase 7).
