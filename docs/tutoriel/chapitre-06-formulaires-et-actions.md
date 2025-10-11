# Chapitre 6 · Créer, modifier et supprimer : les formulaires magiques

Une application de suivi financier doit permettre d'ajouter ou de modifier des données. Dans ce projet, tout se fait grâce à des **sheets** (panneaux qui glissent depuis le côté de l'écran) et des formulaires pilotés par React Hook Form, Zod et React Query.

## Les sheets pour les transactions

Regardons `features/transactions/components/new-transaction-sheet.tsx` :

- On utilise le hook `useNewTransaction()` pour savoir si la sheet doit être ouverte.
- On récupère les catégories et comptes disponibles via `useGetCategories()` et `useGetAccounts()`.
- On prépare des fonctions pour créer une catégorie ou un compte à la volée si l'utilisateur tape un nom qui n'existe pas encore.
- On calcule `isPending` et `isLoading` pour afficher un spinner (`Loader2`) lorsque la requête est en cours.
- On affiche le composant `TransactionForm`, qui contient les champs (montant, payee, date, compte, catégorie, notes).

Quand on soumet le formulaire, `useCreateTransaction()` envoie les données à l'API. En cas de succès, on ferme la sheet (`onClose()`) et React Query rafraîchit les données.

## Réutiliser la même logique pour comptes et catégories

Les fichiers dans `features/accounts` et `features/categories` suivent la même structure : un hook pour ouvrir/fermer la sheet, un formulaire validé par Zod, et des mutations React Query pour créer, éditer ou supprimer. Cette organisation évite de répéter du code et rend la maintenance plus simple.

## Pourquoi Zod et Drizzle Zod sont utiles

- Les schémas Zod (`insertTransactionSchema`, etc.) garantissent que les champs sont bien du bon type (par exemple, une date ou un nombre).
- `z.coerce.date()` convertit automatiquement une chaîne en objet `Date`, ce qui facilite le traitement.

En combinant ces outils, on construit des formulaires robustes qui guident l'utilisateur et protègent la base de données contre les erreurs.
