# Chapitre 5 · Les pouvoirs du tableau de bord 📊

Le tableau de bord affiche les informations importantes : totaux, graphiques et listes. Découvrons comment cela marche.

## 1. Récupérer le résumé
Ouvre `features/summary/api/use-get-summary.ts` :

```tsx
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
```
- `useQuery` lance une requête pour télécharger des données.
- `useSearchParams` lit les paramètres `from`, `to` et `accountId` dans l'URL.
- `client` est un petit robot (Hono) qui parle au serveur.
- `convertAmountFromMiliunits` transforme des montants en dollars lisibles.

La fonction principale :

```tsx
export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";
```
- On lit les filtres de l'URL. S'ils sont absents, on utilise une chaîne vide.

```tsx
  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: { from, to, accountId },
      });
```
- `queryKey` est comme un nom pour mémoriser la requête.
- `queryFn` décrit comment chercher les données auprès du serveur (`client.api.summary.$get`).

```tsx
      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const { data } = await response.json();
      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        }))
      }
    },
  });

  return query;
};
```
- Si le serveur répond mal, on lance une erreur.
- Sinon, on lit le JSON et on convertit chaque montant pour passer de milli-unités à des nombres lisibles.
- On renvoie l'objet `query` contenant `data`, `isLoading`, etc. Les composants peuvent l'utiliser pour afficher les informations.

## 2. Afficher un formulaire de catégorie
Ouvre `features/categories/components/category-form.tsx` :

```tsx
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
```
- `zod` sert à vérifier les données (comme un professeur qui contrôle les devoirs).
- `Trash` est une icône de poubelle.
- `useForm` vient de `react-hook-form` pour contrôler le formulaire.
- `zodResolver` relie `zod` et `react-hook-form`.

```tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
```
- On récupère des composants prêts à l'emploi pour les champs de formulaire.
- `insertCategorySchema` décrit comment une catégorie doit être écrite (par exemple, un nom obligatoire).

On limite le formulaire à un seul champ :

```tsx
const formSchema = insertCategorySchema.pick({
  name: true,
});
```
- `pick` crée un schéma avec uniquement le champ `name`.

Le composant complet :

```tsx
export const CategoryForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
```
- `useForm` initialise le formulaire et relie le schéma de validation.
- `defaultValues` remplit le formulaire si on modifie une catégorie existante.

```tsx
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };
```
- `handleSubmit` transmet les valeurs au parent.
- `handleDelete` appelle `onDelete` seulement s'il existe (`?.`).

L'affichage :

```tsx
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="e.g. Food, Travel, etc." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create category"}
        </Button>
        {!!id && (
          <Button type="button" disabled={disabled} onClick={handleDelete} className="w-full" variant="outline">
            <Trash className="size-4 mr-2" />
            Delete category
          </Button>
        )}
      </form>
    </Form>
  )
};
```
- `Form` relie `react-hook-form` aux composants UI.
- `FormField` relie le champ `name` au formulaire.
- `Input` affiche la zone de texte ; `disabled` bloque le champ si nécessaire.
- Le bouton principal change de texte selon que `id` existe ou non.
- Si `id` existe, on affiche un bouton pour supprimer avec l'icône `Trash`.

## 3. Charger la liste des comptes
Dans `features/accounts/api/use-get-accounts.ts` :

```tsx
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await client.api.accounts.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
```
- `queryKey` vaut `"accounts"` pour mémoriser la liste.
- `client.api.accounts.$get()` va chercher les comptes sur l'API.
- En cas d'erreur, on lance une exception.
- Sinon, on renvoie les données.

Ces hooks sont ensuite utilisés dans les composants du dashboard pour afficher les cartes, les tableaux et les graphiques.

Tu vois maintenant comment les données voyagent du serveur jusqu'à l'écran ! 🚀
