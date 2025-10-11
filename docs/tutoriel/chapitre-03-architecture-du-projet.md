# Chapitre 3 · Comment la maison est construite

Pour comprendre une maison, on observe son plan, ses murs et les pièces qui s'imbriquent. Ici, la maison est notre application Next.js. Découvrons ses fondations.

## Le layout principal

Le fichier `app/layout.tsx` enveloppe toutes les pages. Il définit la police `Inter`, ajoute des fournisseurs (providers) utiles et affiche les enfants (`children`). C'est comme si l'on préparait l'électricité et l'eau avant d'installer les meubles :

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
}
```

- **ClerkProvider** gère l'authentification (qui est connecté ?).
- **QueryProvider** partage un client React Query pour toutes les requêtes de données.
- **SheetProvider** prépare des fenêtres latérales (sheets) pour créer ou modifier des éléments.
- **Toaster** montre des messages toast (petites notifications).

## La page du tableau de bord

Dans `app/(dashboard)/page.tsx`, on trouve le cœur visuel :

```tsx
export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  );
}
```

`DataGrid` affiche les cartes de chiffres (revenu, dépenses, reste) et `DataCharts` montre un graphique et un camembert.

## Les fournisseurs (providers)

- `providers/query-provider.tsx` crée un **QueryClient** unique et le partage grâce à `QueryClientProvider`. Cela évite de télécharger les mêmes données plusieurs fois.
- `providers/sheet-provider.tsx` affiche plusieurs composants `Sheet` (pour les comptes, catégories, transactions). Le hook `useMountedState` garantit que ces feuilles ne s'affichent qu'après le montage côté client, ce qui évite des erreurs de rendu.

En comprenant ces éléments, tu sais maintenant comment l'application prépare son environnement avant d'afficher du contenu.
