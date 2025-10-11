# Chapitre 3 · Explorer la carte du projet 🗺️

Pour ne pas se perdre, découvrons où sont les choses importantes.

## 1. Dossier `app/`
Ce dossier est la maison principale de Next.js. On y trouve :
- `layout.tsx` : la décoration générale (police, fournisseurs). Nous le regarderons en détail au chapitre 4.
- `globals.css` : les styles globaux comme les couleurs et les tailles de texte.
- Les sous-dossiers `'(auth)'` et `'(dashboard)'` qui contiennent des pages. Les parenthèses indiquent des "groupes" de routes. C'est comme des pièces différentes d'un château.
- `api/` : des routes spéciales pour parler avec le serveur (API).

## 2. Dossier `components/`
Ici vivent les petites pièces réutilisables (boutons, en-têtes, graphiques). Par exemple `components/header.tsx` gère l'en-tête coloré du site.

## 3. Dossier `features/`
Chaque sous-dossier représente un pouvoir spécifique :
- `accounts/` pour gérer les comptes bancaires.
- `categories/` pour organiser les dépenses par catégorie.
- `transactions/` pour les entrées et sorties d'argent.
- `fruits/` pour un exemple ludique avec des fruits.
- `summary/` pour calculer les totaux et afficher des graphiques.
Chaque feature contient souvent `api/`, `components/` et `hooks/` pour séparer les tâches.

## 4. Dossier `db/`
On y décrit la base de données : tables, relations et scripts. Le fichier `schema.ts` est comme un plan de table où l'on décide quelles colonnes existent.

## 5. Dossier `providers/`
Ces fichiers donnent des super pouvoirs globaux à l'application (comme partager des données partout). Par exemple `query-provider.tsx` configure la bibliothèque **React Query** pour les requêtes.

## 6. Autres dossiers utiles
- `lib/` : fonctions utilitaires (ex. `utils.ts` convertit les montants d'argent).
- `public/` : images et fichiers statiques.
- `scripts/` : petites missions pour la base de données.

Maintenant que la carte est claire, visitons les pièces une par une !
