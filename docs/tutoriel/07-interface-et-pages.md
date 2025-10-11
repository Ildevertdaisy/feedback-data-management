# Chapitre 7 · Construire les pages et les widgets 🧩

Maintenant que tu connais les données, voyons comment l'écran du tableau de bord assemble tout.

## 1. La page du tableau de bord
Dans `app/(dashboard)/page.tsx` :

```tsx
import { DataGrid } from "@/components/data-grid";
import { DataCharts } from "@/components/data-charts";

export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  );
};
```
- On importe deux grands blocs : `DataGrid` et `DataCharts`.
- `max-w-screen-2xl mx-auto` centre le contenu sur un grand écran.
- `pb-10` ajoute un espace en bas, `-mt-24` remonte la page pour se placer sous l'en-tête.

## 2. Le composant `DataGrid`
Regardons `components/data-grid.tsx` :

```tsx
import { FaPiggyBank } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { DataCard, DataCardLoading } from "@/components/data-card";
```
- On importe des icônes rigolotes pour illustrer les cartes.
- `useSearchParams` lit la période choisie.
- `useGetSummary` récupère les montants et variations.
- `DataCard` est la carte stylée qui affiche les valeurs.

La logique :

```tsx
export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });
```
- On télécharge les données.
- On lit les dates et on fabrique une étiquette lisible avec `formatDateRange`.

Pendant le chargement :

```tsx
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )
  }
```
- On affiche des `DataCardLoading` (squelettes gris) pour patienter.

Quand les données sont prêtes :

```tsx
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard title="Remaining" value={data?.remainingAmount} percentageChange={data?.remainingChange} icon={FaPiggyBank} dateRange={dateRangeLabel} />
      <DataCard title="Income" value={data?.incomeAmount} percentageChange={data?.incomeChange} icon={FaArrowTrendUp} dateRange={dateRangeLabel} />
      <DataCard title="Expenses" value={data?.expensesAmount} percentageChange={data?.expensesChange} icon={FaArrowTrendDown} dateRange={dateRangeLabel} />
    </div>
  );
};
```
- On place trois cartes dans une grille.
- Chaque carte reçoit un titre, une valeur, la variation et une icône différente.

## 3. Le composant `DataCard`
Dans `components/data-card.tsx` :

```tsx
const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    }
  },
  defaultVariants: { variant: "default" },
});
```
- `cva` (Class Variance Authority) choisit des classes Tailwind selon un paramètre `variant`.
- Ici, le fond de l'icône change de couleur (bleu, vert, rouge, jaune).

```tsx
export const DataCard = ({ icon: Icon, title, value = 0, variant, dateRange, percentageChange = 0 }: DataCardProps) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp1">{dateRange}</CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
          <CountUp preserveValue start={0} end={value} decimals={2} decimalPlaces={2} formattingFn={formatCurrency} />
        </h1>
        <p className={cn("text-muted-foreground text-sm line-clamp-1", percentageChange > 0 && "text-emerald-500", percentageChange < 0 && "text-rose-500")}> 
          {formatPercentage(percentageChange, { addPrefix: true })} from last period
        </p>
      </CardContent>
    </Card>
  );
};
```
- `icon: Icon` permet d'utiliser une icône comme composant.
- `CardHeader` affiche le titre et la période.
- `cn` assemble les classes CSS.
- `CountUp` anime le nombre de 0 jusqu'à la valeur finale.
- Le texte du bas devient vert si la variation est positive, rouge si elle est négative.

La version de chargement :

```tsx
export const DataCardLoading = () => {
  return (
    <Card className="borer-none drop-shadow-sm h-[192px]">
      <CardHeader className="flex flex-row items-center jsutify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mb-2" />
        <Skeleton className="shrink-0 h-4 w-40" />
      </CardContent>
    </Card>
  );
};
```
- `Skeleton` affiche des blocs gris pour simuler le contenu en attente.

## 4. Les graphiques
Dans `components/data-charts.tsx` :

```tsx
"use client";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { Chart, ChartLoading } from "@/components/chart";
import { SpendingPie, SpendingPieLoading } from "@/components/spending-pie";
```
- On réutilise le hook `useGetSummary` pour obtenir les données des graphiques.
- `Chart` affiche les revenus/dépenses par jour.
- `SpendingPie` montre la répartition par catégorie.

Logique de rendu :

```tsx
export const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    );
  }
```
- On affiche des versions "loading" pendant le téléchargement.

Sinon :

```tsx
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};
```
- On place les deux graphiques dans une grille responsive.
- `Chart` reçoit la liste des jours, `SpendingPie` les catégories avec les montants.

Et voilà, le tableau de bord prend vie avec des cartes et des graphiques colorés ! 🎨
