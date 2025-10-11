# Chapitre 6 · Les trésors de la base de données 💾

Le projet enregistre des informations dans une base de données PostgreSQL grâce à **Drizzle ORM**. Découvrons les tables et quelques helpers.

## 1. Les tables principales (`db/schema.ts`)
Regardons le début du fichier :

```ts
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
```
- `pgTable`, `text`, `integer`, `timestamp` décrivent les colonnes.
- `relations` explique les liens entre les tables.
- `createInsertSchema` fabrique des schémas `zod` pour vérifier les données.

### Table `accounts`
```ts
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});
```
- `pgTable("accounts", {...})` crée la table.
- `id` est la clé primaire (identifiant unique).
- `plaidId` peut contenir un identifiant externe.
- `name` est obligatoire (`notNull()`), tout comme `userId` qui relie le compte à l'utilisateur connecté.

On ajoute aussi les relations et le schéma d'insertion :

```ts
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);
```
- `relations` dit qu'un compte peut avoir plusieurs `transactions`.
- `createInsertSchema` permet de valider un objet avant de l'ajouter.

### Table `categories`
La table est similaire :

```ts
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});
```
- Chaque catégorie a un nom et un utilisateur propriétaire.
- Les relations permettent de retrouver toutes les transactions liées à une catégorie.

### Table `transactions`
```ts
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "cascade" }).notNull(),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
});
```
- `amount` est un nombre entier en milli-unités (ex : 12345 = 12,345 $).
- `payee` est le bénéficiaire (magasin, personne, etc.).
- `notes` est optionnel.
- `date` enregistre la date de la transaction.
- `accountId` relie la transaction à un compte. Si le compte est supprimé, les transactions associées sont aussi supprimées (`onDelete: "cascade"`).
- `categoryId` relie à une catégorie. Si la catégorie disparaît, on garde la transaction mais sans catégorie (`set null`).

Les relations pour `transactions` :

```ts
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
```
- `one(accounts, ...)` indique qu'une transaction appartient à un seul compte.
- `one(categories, ...)` relie éventuellement à une catégorie.

Enfin, on crée un schéma d'insertion :

```ts
export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
```
- `z.coerce.date()` transforme automatiquement des chaînes en objets Date lors de la validation.

## 2. Les fonctions utilitaires (`lib/utils.ts`)
Quelques fonctions facilitent la vie :

```ts
export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
};
```
- Divise par 1000 pour afficher des montants lisibles.

```ts
export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
};
```
- Multiplie par 1000 pour stocker un montant avec plus de précision.

```ts
export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};
```
- Formate un nombre en dollars (ex : 12.5 devient `$12.50`).

```ts
export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
};
```
- Calcule la variation en pourcentage entre deux montants.

```ts
export function fillMissingDays(activeDays, startDate, endDate) {
  // ...
}
```
- Crée une liste de jours complets pour les graphiques, en remplissant les jours sans transactions avec des zéros.

```ts
export function formatDateRange(period?) {
  // ...
}
```
- Affiche une période comme `Apr 01 - Apr 30, 2024`.

```ts
export function formatPercentage(value: number, options = { addPrefix: false }) {
  const result = new Intl.NumberFormat("en-US", { style: "percent" }).format(value / 100);
  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }
  return result;
};
```
- Formate un pourcentage et ajoute `+` si on le demande.

Avec ces outils, l'application peut stocker, transformer et afficher les données financières en toute sécurité.
