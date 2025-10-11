# Chapitre 1 · Bienvenue dans le projet

Ce projet est une application web construite avec **Next.js**, un outil qui aide à fabriquer des sites modernes avec React. Ici, on crée un tableau de bord qui affiche des comptes bancaires, des catégories de dépenses et des graphiques pour mieux comprendre son argent. L'idée du tutoriel est de t'apprendre, pas à pas, comment tout cela fonctionne, même si tu découvres ces technologies pour la première fois.

## Les super-pouvoirs que tu vas apprendre

- **React** : une bibliothèque qui te permet d'assembler des morceaux d'interface comme des briques LEGO.
- **Next.js** : la maison qui organise ces briques, gère les pages et permet de parler avec un serveur.
- **TypeScript** : une extension de JavaScript qui aide l'ordinateur à vérifier que ton code est cohérent, comme un correcteur automatique.
- **Tailwind CSS** et **shadcn/ui** : des outils pour donner du style à l'application facilement.
- **Drizzle ORM** et **PostgreSQL** : pour manipuler une base de données sans se perdre.
- **React Query** : pour récupérer des données depuis le serveur en douceur.

## À quoi ressemble le dossier

Le cœur du projet se trouve dans le dossier `app`. C'est là que Next.js lit les pages et les layouts. Tu peux déjà jeter un coup d'œil aux fichiers importants :

- `app/layout.tsx` configure l'habillage général de l'application (police, providers, etc.).
- `app/(dashboard)/page.tsx` affiche la page principale du tableau de bord.
- `components/` contient les morceaux de l'interface, comme les cartes de chiffres ou les graphiques.
- `features/` rassemble la logique métier (comptes, catégories, transactions, résumé).
- `app/api/[[...route]]/` gère les points d'entrée API, construits avec Hono et sécurisés avec Clerk.

Dans les prochains chapitres, nous irons doucement pour découvrir chaque pièce et comprendre comment tout s'assemble.
