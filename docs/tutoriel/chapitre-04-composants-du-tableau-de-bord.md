# Chapitre 4 · Les pièces décorées : DataGrid et DataCharts

Maintenant que la maison est prête, on place les meubles ! Les composants de l'interface sont comme des meubles qui affichent des informations utiles.

## DataGrid : trois cartes pour tout voir d'un coup

`components/data-grid.tsx` est un composant client qui utilise `useGetSummary` pour récupérer des informations depuis l'API. Il affiche trois cartes :

- **Remaining** : l'argent qui reste.
- **Income** : les revenus.
- **Expenses** : les dépenses.

Quand les données mettent du temps à arriver, `DataGrid` montre des cartes fantômes (`DataCardLoading`) pour faire patienter l'utilisateur. Une fois les données reçues, il transforme les valeurs pour l'affichage et place les icônes adaptées (`FaPiggyBank`, `FaArrowTrendUp`, `FaArrowTrendDown`).

## DataCharts : un graphique et un camembert

`components/data-charts.tsx` utilise aussi `useGetSummary`. Si les données ne sont pas prêtes, il affiche des versions de chargement (`ChartLoading`, `SpendingPieLoading`). Sinon :

- `Chart` montre l'évolution quotidienne des revenus et dépenses.
- `SpendingPie` affiche la répartition des dépenses par catégorie.

## Les composants de base

Ces pièces utilisent d'autres composants réutilisables situés dans `components/` :

- `data-card.tsx` affiche un nombre et son pourcentage d'évolution.
- `chart.tsx` et les variantes (`area-variant.tsx`, `bar-variant.tsx`, etc.) dessinent les graphiques.
- `spending-pie.tsx` affiche un diagramme circulaire avec les catégories principales.

Chaque composant est écrit en TypeScript et stylé avec Tailwind CSS, ce qui permet de mélanger facilement logique et apparence.
