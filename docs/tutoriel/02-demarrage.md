# Chapitre 2 · Préparer ton terrain de jeu 🛠️

Dans ce chapitre, nous allons installer tout ce qu'il faut pour que le projet fonctionne sur ton ordinateur.

## 1. Installer les outils
- **Node.js** : c'est comme l'électricité qui alimente ton atelier. Télécharge la version LTS (Long Term Support) sur [nodejs.org](https://nodejs.org).
- **Un gestionnaire de paquets** : `npm` arrive avec Node.js. Tu peux aussi utiliser `yarn`, `pnpm` ou `bun`. Dans ce cours, nous utiliserons `npm` car il est prêt tout de suite.

## 2. Récupérer le projet
1. Ouvre ton terminal (une fenêtre noire pleine de magie 🪄).
2. Va dans le dossier où tu veux ranger le projet.
3. Tape `git clone ...` si tu as un lien Git. Sinon copie le dossier fourni.
4. Entre dans le dossier avec `cd feedback-data-management`.

## 3. Installer les dépendances
Les "dépendances" sont des amis super doués qui aident notre projet.
```bash
npm install
```
Cette commande lit le fichier `package.json` et installe tout ce qui se trouve dans la partie `"dependencies"` et `"devDependencies"`.

## 4. Démarrer le serveur de développement
Dans `package.json`, le script `"dev": "next dev"` lance Next.js en mode construction.
```bash
npm run dev
```
Ensuite, ouvre ton navigateur sur [http://localhost:3000](http://localhost:3000). Tu devrais voir la page d'accueil.

## 5. Les autres scripts utiles
- `npm run build` : prépare le site pour la mise en ligne.
- `npm run start` : lance le site prêt pour le public.
- `npm run lint` : vérifie que le code suit les règles.
- `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, `npm run db:studio` : ces commandes aident à gérer la base de données grâce à l'outil **Drizzle**. Nous en reparlerons plus tard.

Bravo, ton terrain de jeu est prêt ! 🎉 Dans le chapitre suivant, nous allons regarder comment tout est rangé.
