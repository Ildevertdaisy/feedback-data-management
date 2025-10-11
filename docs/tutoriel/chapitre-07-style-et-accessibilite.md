# Chapitre 7 · Donner du style et penser aux utilisateurs

Une interface agréable rend l'application plus plaisante à utiliser. Dans ce projet, plusieurs outils aident à construire une interface propre, accessible et cohérente.

## Tailwind CSS

Le fichier `app/globals.css` importe les styles de base et les variables. Ensuite, les classes Tailwind (comme `max-w-screen-2xl`, `grid`, `gap-8`) sont utilisées directement dans les composants. Cela permet de décrire le design avec des mots simples, sans écrire beaucoup de CSS.

## shadcn/ui

Les composants UI tels que `Sheet`, `Button`, `Input` viennent de shadcn/ui. Ils offrent :

- un design moderne,
- une accessibilité déjà gérée (navigation au clavier, attributs ARIA),
- une personnalisation via les classes Tailwind.

Par exemple, `Sheet` est utilisé dans les providers pour créer des panneaux coulissants prêts à l'emploi.

## Icônes et animations

- Les icônes proviennent de `lucide-react` ou `react-icons`, ce qui donne un aspect visuel clair.
- Le composant `Loader2` affiche une roue qui tourne pour indiquer qu'une action est en cours (`animate-spin`).

## Accessibilité et expérience utilisateur

- Les loaders évitent que l'utilisateur ne se demande si l'application est bloquée.
- Les toasts (`Toaster`) confirment les actions réussies ou signalent les erreurs.
- Les formulaires valident les données avant de les envoyer, ce qui évite des messages d'erreur techniques incompréhensibles.

En combinant ces éléments, le projet reste agréable à regarder et facile à utiliser, même pour quelqu'un qui découvre le web.
