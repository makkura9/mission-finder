# Mission Finder

Site de révision pour smartphone : fichiers et dossiers sous macOS (préparation du TE1, informatique, classe 1C).

- Site statique (HTML, CSS, JavaScript), hébergé gratuitement par GitHub Pages.
- Aucune donnée n'est envoyée : pas de compte, pas de statistiques, pas de ressource externe.
- La progression des élèves (à partir de la phase 2) reste uniquement dans le navigateur de leur téléphone.

**État actuel : phase 1 — page « En construction ».**

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
3. Envoyer les fichiers : **Add file** → **Upload files** → glisser **le contenu** du dossier extrait (pas le dossier lui-même, pas le .zip) → **Commit changes**.
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
index.html          page du site
.nojekyll           indique à GitHub de publier les fichiers tels quels
css/style.css       couleurs et mise en page (charte « Léman », modes clair et sombre)
img/icone.svg       icône du site
README.md           ce guide
```
