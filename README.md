# Mission Finder

Site de révision pour smartphone : fichiers et dossiers sous macOS (préparation du TE1, informatique, classe 1C).

- Site statique (HTML, CSS, JavaScript), hébergé gratuitement par GitHub Pages.
- Aucune donnée n'est envoyée : pas de compte, pas de statistiques, pas de ressource externe.
- La progression des élèves reste uniquement dans le navigateur de leur téléphone.

**État actuel : phase 5 — Quiz express (90 questions), Révision du jour, Clavier secret, Visite du Mac, Le grand rangement (9 missions sur un Finder simulé), Mon bilan, Profil, Aide.**

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

### Mettre à jour le site avec Claude Code (à partir de la phase 3)

1. Dans la session Claude Code, quand le travail est prêt, cliquer **Create PR** (proposer les modifications).
2. Sur GitHub, ouvrir la *pull request*, cliquer **Merge pull request**, puis **Confirm merge** (fusionner = publier dans la version principale).
3. Attendre 1 à 3 minutes, puis vérifier le numéro de version en bas de l'accueil du site.

### Mettre à jour le site à la main (sans Claude Code)

1. **Add file** → **Upload files** → glisser le contenu du nouveau dossier extrait → **Commit changes**. Les fichiers de même nom sont remplacés.
2. Attendre 1 à 3 minutes (onglet **Actions** : la ligne *pages build and deployment* doit avoir une coche verte).
3. Ouvrir le site et vérifier le numéro de version affiché en bas de page.

### Dépannage

| Problème | Cause probable | Correction |
|---|---|---|
| Erreur 404 | Publication pas encore terminée, ou `index.html` pas à la racine du dépôt | Attendre 2 min et recharger ; vérifier que `index.html` apparaît directement dans la liste des fichiers du dépôt ; vérifier **Settings → Pages** : `main` et `/ (root)` |
| Page sans couleurs ni icône | Dossier `css` ou `img` non envoyé | Refaire **Upload files** en glissant les dossiers manquants |
| Ancienne version affichée | Cache du navigateur | Sur PC : Ctrl + F5 ; sur téléphone : attendre quelques minutes puis recharger |
| Fichier `.nojekyll` absent de la liste | Fichier vide non envoyé | **Add file** → **Create new file** → nom `.nojekyll`, contenu vide → **Commit changes** |

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
js/figures.js            illustrations des questions (barre des menus, Dock, fichier, Finder)
js/modules/qcm.js        Quiz express
js/modules/raccourcis.js Clavier secret (clavier virtuel)
js/modules/bureau.js     Visite du Mac (Bureau simulé, Spotlight)
js/modules/finder.js     Le grand rangement (écran du Finder simulé, missions)
js/app.js                navigation, accueil, bilan, profil, aide
data/questions.js        banque de questions (modifiable)
data/raccourcis.js       les 20 raccourcis de la fiche (Clavier secret)
data/bureau.js           légende du Bureau, applications du Dock, résultats Spotlight (Visite du Mac)
data/missions-finder.js  les 9 missions, les fichiers fictifs de l'exercice 1, les mots reconnus (Le grand rangement)
data/libelles-macos.js   libellés inspirés de macOS à vérifier sur un Mac du gymnase
data/objectifs.js        objectifs d'apprentissage
data/niveaux.js          niveaux et seuils de points
data/textes.js           messages de retour, numéro de version
img/                     icônes du site
CLAUDE.md                consignes lues par Claude Code à chaque session
docs/                    cahier des charges (non utilisé par le site)
tests/                   tests automatiques et page de relecture des questions (non utilisés par le site)
```

### Où est enregistrée la progression ?

Dans le `localStorage` du navigateur de l'élève (clé `missionFinder.v1`). Le principe est le même que celui des cookies, mais la capacité est plus grande (environ 5 Mo au lieu de 4 Ko) et rien n'est envoyé au serveur à chaque visite. La progression est donc liée à un téléphone et à un navigateur ; l'onglet **Profil** permet de la transférer par un code.

### Relire les questions

Ouvrir https://makkura9.github.io/mission-finder/tests/relecture.html (sur ordinateur) : toutes les questions, avec la bonne réponse, les explications et la source, puis les textes de « Visite du Mac » et de « Clavier secret ». Ce qui reste à relire porte le badge « À relire ». Pour imprimer : Ctrl + P (ou ⌘ P) → « Enregistrer au format PDF ».

### Révision du jour (répétition espacée)

Chaque question vue est rangée dans une « boîte » de 1 à 5. Juste du premier coup : boîte suivante ; sinon : retour en boîte 1. Une question revient dans la Révision du jour après 0 jour (boîte 1), 1 jour (boîte 2), 3 jours (boîte 3), 7 jours (boîte 4) ou 14 jours (boîte 5). Ces délais se modifient en haut de `js/leitner.js`.

### Modifier une question

Ouvrir `data/questions.js` sur github.com, cliquer l'icône crayon, modifier le texte entre guillemets, puis **Commit changes**. Le format de chaque champ est expliqué en haut du fichier. Un guide détaillé (avec les erreurs à éviter) sera ajouté en phase 8.

### Points à vérifier sur un Mac du gymnase

| Élément | Où il apparaît | Question |
|---|---|---|
| « Par galerie » | question fin-01 | Libellé exact du menu Présentation dans macOS 15 ? (conservé en attendant) |
| Menus « Fichier, Édition, Affichage » d'Excel | figure de la question bur-01 | Libellés exacts dans Excel pour Mac ? (conservés en attendant) |
| « Ce Mac » | question rec-07 | Libellé de l'étendue de la recherche avancée (⌘ F) |
| « Placer dans la Corbeille » | Le grand rangement (`data/libelles-macos.js`) | « Corbeille » avec ou sans majuscule dans le menu du Finder ? |
| « dossier sans titre » | Le grand rangement | Nom exact d'un nouveau dossier ? |
| Types « Document PDF », « Image JPEG », « Image PNG », « Archive ZIP », « Page web (HTML) » | « Lire les informations » de l'atelier | Libellés exacts du champ « Type » ? |
| Lieu de prise de vue d'une photo | phase 6 (mission « photos mystères ») | Visible dans « Lire les informations » (⌘ I) du Finder, ou seulement dans l'inspecteur d'Aperçu ? Aucune question ne l'affirme pour l'instant. |

### Points à vérifier sur un téléphone

| Élément | Question |
|---|---|
| iPhone : « Sur l'écran d'accueil » / « Ajouter à l'écran d'accueil » | Décidé (phase 3) : les deux libellés restent indiqués dans l'Aide |
| iPhone : progression de l'icône séparée de celle de Safari | Décidé (phase 3) : l'Aide conseille d'utiliser toujours l'icône |
| Android : « Ajouter à l'écran d'accueil » / « Installer l'application » | Décidé (phase 3) : les deux libellés restent indiqués dans l'Aide |
