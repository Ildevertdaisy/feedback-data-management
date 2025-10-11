# Chapitre 4 · Les super pouvoirs de Next.js 🧙‍♀️

Dans ce chapitre, nous regardons des fichiers qui donnent de la magie à toute l'application.

## 1. Le layout principal
Ouvre `app/layout.tsx`. Voici un extrait important :

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";

import "./globals.css";
```
- `Metadata` et `Inter` viennent de Next.js. `Inter` choisit une police d'écriture lisible.
- `ClerkProvider` s'occupe de l'authentification (connexion des utilisateurs).
- `Toaster` affiche des petits messages (notifications).
- `QueryProvider` partage les données téléchargées depuis le serveur.
- `SheetProvider` prépare des formulaires qui apparaissent dans des panneaux coulissants.
- `import "./globals.css";` ajoute les styles généraux.

La fonction `RootLayout` met tout en place :

```tsx
export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <QueryProvider>
            <SheetProvider />
            <Toaster />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};
```
- `<ClerkProvider>` entoure tout pour gérer les comptes utilisateurs.
- `<html lang="en">` et `<body>` sont la base de la page web.
- `className={inter.className}` applique la police Inter.
- `<QueryProvider>` rend React Query disponible dans toute l'application.
- `<SheetProvider />` prépare les formulaires cachés.
- `<Toaster />` place le système de messages.
- `{children}` représente la page que l'on affiche (dashboard, authentification, etc.).

## 2. Le fournisseur de requêtes
Regardons `providers/query-provider.tsx` :

```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
    },
  })
}
```
- `"use client";` indique que ce fichier s'exécute dans le navigateur (et pas seulement sur le serveur).
- `QueryClient` est un cerveau qui mémorise les données téléchargées.
- `staleTime: 60 * 1000` signifie "garde les données pendant 60 secondes avant de les rafraîchir".

Ensuite, on choisit quand créer ce cerveau :

```tsx
let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
```
- Sur le serveur (`window` absent), on crée un nouveau client à chaque fois.
- Dans le navigateur, on crée un client une seule fois pour réutiliser les données.

Enfin, on enveloppe les enfants :

```tsx
export function QueryProvider({ children }: { children: React.ReactNode; }) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
```
- On obtient le client et on fournit les données à tous les composants enfants.

## 3. Le fournisseur de panneaux
Regarde `providers/sheet-provider.tsx` :

```tsx
"use client";
import { useMountedState } from "react-use";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
// ... autres imports
```
- Encore une fois, `"use client";` indique que ce composant s'exécute dans le navigateur.
- `useMountedState()` vérifie si la page est prête côté client.
- Les composants `NewAccountSheet`, `EditCategorySheet`, etc., sont des formulaires cachés.

Le composant principal :

```tsx
export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};
```
- `isMounted` évite d'afficher des choses avant que le navigateur soit prêt.
- On retourne `null` si ce n'est pas prêt (rien n'est affiché).
- Sinon, on rend tous les formulaires. Ils ne sont pas visibles tout de suite mais prêts à apparaître quand on les appelle.

## 4. L'en-tête du tableau de bord
Enfin, jetons un coup d'œil à `components/header.tsx` :

```tsx
import { Loader2 } from "lucide-react";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMsg } from "@/components/welcome-msg";
import { Filters } from "@/components/filters";
```
- On importe des icônes (`Loader2`), des outils de connexion (`UserButton`), et plusieurs sous-composants.

Le rendu :

```tsx
export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-yellow-700 to-yellow-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-slate-400" />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  );
};
```
- `<header>` a un dégradé jaune grâce à Tailwind CSS (`bg-gradient-to-b ...`).
- `max-w-screen-2xl mx-auto` centre le contenu.
- `HeaderLogo` affiche le logo du site, `Navigation` montre les boutons de menu.
- `ClerkLoaded` affiche le bouton utilisateur quand Clerk a fini de charger.
- `ClerkLoading` montre une icône qui tourne pendant le chargement.
- `WelcomeMsg` affiche un message personnalisé, `Filters` montre les filtres du tableau de bord.

Super ! Tu connais maintenant les grands pouvoirs qui enveloppent toute l'application.
