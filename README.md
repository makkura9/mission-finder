# Mission Finder

Site de révision pour smartphone : fichiers et dossiers sous macOS (préparation du TE1, informatique, classe 1C).

- Site statique (HTML, CSS, JavaScript), hébergé gratuitement par GitHub Pages.
- Aucune donnée n'est envoyée : pas de compte, pas de statistiques, pas de ressource externe.
- La progression des élèves reste uniquement dans le navigateur de leur téléphone.

**État actuel : phase 2 — accueil, Quiz express (20 questions pilotes), Mon bilan, Profil, Aide.**

---

## Guide pour l'enseignant

### Vocabulaire

- **Dépôt** (*repository*) : dossier en ligne qui contient les fichiers du site et l'historique de leurs modifications.
- **Commit** (*Commit changes*) : enregistrement d'une modification, avec un court message.
- **Branche** (*branch*) : version des fichiers. `main` est la version principale, la seule utilisée ici.

L'interface de GitHub est en anglais. Les libellés ci-dessous sont ceux connus à mi-2026 ; ils peuvent légèrement varier.

### Mettre le site en ligne (première fois)

1. Créer un compte sur https://github.com/signup (le nom d'utilisateur apparaîtra dans l'adresse du site).
2. Créer un dépôt : **+** → **New repository** → nom `mission-finder` → **Public** → activer **Add README** → **Create repository**.
3. Envoyer les fichiers : **Add file** (si la fenêtre est étroite, ce bouton s'affiche comme un **+** gris à gauche du bouton vert **Code**) → **Upload files** → glisser **le contenu** du dossier extrait (pas le dossier lui-même, pas le .zip) → **Commit changes**.
4. Activer Pages : **Settings** → **Pages** → **Build and deployment** → Source : **Deploy from a branch** → Branch : **main**, dossier **/ (root)** → **Save**.
5. Attendre 1 à 3 minutes, recharger la page **Settings → Pages**, puis cliquer **Visit site**.

Adresse du site : `https://<nom-utilisateur>.github.io/mission-finder/`

### Mettre à jour le site (phases suivantes)

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
js/figures.js            illustrations des questions (barre des menus, Dock, fichier)
js/modules/qcm.js        Quiz express
js/app.js                navigation, accueil, bilan, profil, aide
data/questions.js        banque de questions (modifiable)
data/objectifs.js        objectifs d'apprentissage
data/niveaux.js          niveaux et seuils de points
data/textes.js           messages de retour, numéro de version
img/                     icônes du site
```

### Où est enregistrée la progression ?

Dans le `localStorage` du navigateur de l'élève (clé `missionFinder.v1`). Le principe est le même que celui des cookies, mais la capacité est plus grande (environ 5 Mo au lieu de 4 Ko) et rien n'est envoyé au serveur à chaque visite. La progression est donc liée à un téléphone et à un navigateur ; l'onglet **Profil** permet de la transférer par un code.

### Modifier une question

Ouvrir `data/questions.js` sur github.com, cliquer l'icône crayon, modifier le texte entre guillemets, puis **Commit changes**. Le format de chaque champ est expliqué en haut du fichier. Un guide détaillé (avec les erreurs à éviter) sera ajouté en phase 8.

### Points à vérifier sur un Mac du gymnase

| Élément | Où il apparaît | Question |
|---|---|---|
| « Par galerie » | question fin-01 | Libellé exact du menu Présentation dans macOS 15 ? |
| Menus « Fichier, Édition, Affichage » d'Excel | figure de la question bur-01 | Libellés exacts dans Excel pour Mac ? |
| Menu Pomme | figures | Représenté par une pomme stylisée générique (pas le logo Apple) : choix à valider |
| Lieu de prise de vue d'une photo | phase 6 (mission « photos mystères ») | Visible dans « Lire les informations » (⌘ I) du Finder, ou seulement dans l'inspecteur d'Aperçu ? |

### Points à vérifier sur un téléphone

| Élément | Question |
|---|---|
| iPhone : « Sur l'écran d'accueil » / « Ajouter à l'écran d'accueil » | Libellé exact dans votre version d'iOS ? |
| iPhone : progression de l'icône séparée de celle de Safari | À confirmer sur un iPhone |
| Android : « Ajouter à l'écran d'accueil » / « Installer l'application » | Libellé exact dans Chrome ? |
