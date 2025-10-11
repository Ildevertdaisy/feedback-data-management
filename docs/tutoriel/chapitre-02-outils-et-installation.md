# Chapitre 2 · Préparer ton terrain de jeu

Avant de plonger dans le code, il faut préparer les outils. Imagine que tu veux cuisiner : il te faut un plan de travail propre, les bons ingrédients et des ustensiles faciles à manier. Ici, notre recette numérique a besoin de :

1. **Node.js** (version 18 ou plus) pour exécuter le code JavaScript sur ton ordinateur.
2. **Un gestionnaire de paquets** comme `npm` (fourni avec Node), `yarn`, `pnpm` ou `bun` pour installer les bibliothèques.
3. **Un éditeur de code** tel que VS Code, qui colore le code et propose des astuces.
4. **Git** pour sauvegarder l'historique du projet et collaborer avec d'autres personnes.

## Installer et lancer l'application

Quand tout est prêt, ouvre un terminal dans le dossier du projet et lance :

```bash
npm install
npm run dev
```

La commande `npm install` télécharge toutes les bibliothèques indiquées dans `package.json`. Ensuite, `npm run dev` démarre un serveur qui affiche l'application sur <http://localhost:3000>. Dès que tu modifies un fichier, la page se recharge automatiquement. C'est un peu comme un carnet magique qui se met à jour tout seul.

## Comprendre Next.js en deux minutes

- Next.js utilise des **routes** basées sur les dossiers. Le fichier `app/(dashboard)/page.tsx` correspond à l'URL `/` du tableau de bord.
- Les fichiers `layout.tsx` définissent des coquilles qui entourent les pages (header, police, providers...).
- Les mots `"use client"` en haut d'un fichier indiquent qu'il s'agit d'un composant React qui s'exécute dans le navigateur (on peut y utiliser `useState`, `useEffect`, etc.).

Garde ces idées en tête : elles te guideront dans les chapitres suivants.
