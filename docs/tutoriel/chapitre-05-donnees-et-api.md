# Chapitre 5 · Où vont et d'où viennent les données ?

Afficher des chiffres, c'est bien, mais il faut savoir d'où ils viennent. Dans ce chapitre, tu vas découvrir le chemin parcouru par les informations, de la base de données jusqu'aux composants.

## La base de données et Drizzle ORM

Le fichier `db/schema.ts` décrit les tables :

- `accounts` : les comptes bancaires.
- `categories` : les catégories de dépenses.
- `transactions` : chaque mouvement d'argent, avec un montant, un bénéficiaire (`payee`), une date et des liens vers un compte et éventuellement une catégorie.

Drizzle génère aussi des **schémas Zod** (`insertAccountSchema`, `insertCategorySchema`, `insertTransactionSchema`) pour valider les données côté formulaire. Cela garantit qu'on n'enregistre pas d'information invalide.

## Les API routes avec Hono

Dans `app/api/[[...route]]/`, chaque fichier (`accounts.ts`, `categories.ts`, `transactions.ts`, `summary.ts`) déclare des routes HTTP avec [Hono](https://hono.dev/). Prenons `summary.ts` comme exemple :

1. On protège la route avec `clerkMiddleware()` pour vérifier que l'utilisateur est connecté.
2. On lit les paramètres `from`, `to`, `accountId` pour filtrer la période et éventuellement un compte précis.
3. On interroge la base via Drizzle pour calculer :
   - le total des revenus,
   - le total des dépenses,
   - le montant restant,
   - la répartition des dépenses par catégorie,
   - les montants par jour.
4. On assemble la réponse JSON avec toutes ces données.

## Le client Hono et React Query

Côté navigateur, `lib/hono.ts` crée un client grâce à `hc<AppType>`. Ensuite, `features/summary/api/use-get-summary.ts` utilise React Query pour appeler `client.api.summary.$get(...)`. Ce hook :

- récupère les paramètres dans l'URL avec `useSearchParams` (pour filtrer par date ou compte),
- appelle l'API,
- convertit les montants (les valeurs sont stockées en milli-unités, on les divise par 1000 pour afficher des dollars compréhensibles),
- renvoie les données aux composants (`DataGrid`, `DataCharts`).

Grâce à cette chaîne, les informations restent toujours à jour sans recharger toute la page.
