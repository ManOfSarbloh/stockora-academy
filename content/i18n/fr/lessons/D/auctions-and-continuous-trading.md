---
title: "Enchères et négociation continue"
summary: "Les Bourses combinent la négociation continue en journée et des enchères (fixings) à l'ouverture, parfois à la mi-journée, et à la clôture. Les enchères recueillent les ordres et trouvent un prix unique pour tous."
translatedFrom: 2026-10-11
---

Une Bourse peut rapprocher les ordres de deux façons : **en continu**, une transaction après l'autre à mesure que les ordres arrivent, ou par **enchère** (fixing), où les ordres sont recueillis pendant un moment puis exécutés tous ensemble à un prix unique. La plupart des Bourses où se négocient des actions liquides utilisent les deux.

## La négociation continue

Pendant la négociation continue, chaque ordre entrant est immédiatement confronté au carnet d'ordres. S'il peut être exécuté, la transaction a lieu tout de suite ; sinon, il attend dans le carnet. Les cours peuvent changer à chaque transaction.

## Les enchères

Une enchère se déroule en deux étapes :

1. **La phase d'appel :** les ordres sont recueillis. Les participants peuvent saisir, modifier ou supprimer des ordres, mais rien ne s'échange encore. Un prix *indicatif* est généralement affiché, pour que chacun voie où l'enchère aboutirait à cet instant. À la Bourse de Vienne, la phase d'appel se termine à un moment aléatoire après une durée minimale, ce qui rend la manipulation du résultat plus difficile.
2. **La détermination du prix :** le système calcule le prix unique auquel le **plus grand nombre d'actions** peut s'échanger, et exécute tous les ordres compatibles à ce prix.

> [!EXAMPLE]
> Lors d'une enchère d'ouverture, ces ordres ont été recueillis :
>
> | Prix | Actions que les acheteurs achèteraient à ce prix | Actions que les vendeurs vendraient à ce prix |
> |---|---|---|
> | 20,20 € | 300 | 1 500 |
> | 20,10 € | 700 | 1 000 |
> | 20,00 € | 1 000 | 800 |
> | 19,90 € | 1 600 | 400 |
>
> À **20,00 €**, les acheteurs veulent 1 000 actions et les vendeurs en proposent 800 : **800 actions** peuvent donc s'échanger. À 20,10 €, seules 700 pourraient s'échanger (limité par les acheteurs), à 19,90 € seulement 400 (limité par les vendeurs). Le prix de l'enchère est donc **20,00 €**, et 800 actions changent de mains à ce prix unique.

> [!ANIMATION] opening-auction
> La même enchère sous forme de barres : à chaque prix, combien les acheteurs achèteraient et combien les vendeurs vendraient. C'est à 20,00 € que le plus d'actions peuvent s'échanger (800), donc tout le monde négocie à 20,00 €.

## Pourquoi des enchères à l'ouverture et à la clôture

- **L'enchère d'ouverture :** pendant la nuit, les nouvelles se sont accumulées. Recueillir d'abord les ordres et trouver un seul prix d'ouverture équitable évite un démarrage chaotique.
- **L'enchère de clôture :** beaucoup d'investisseurs et de fonds veulent négocier au **cours de clôture** officiel, qui sert aussi à valoriser les portefeuilles et à calculer les indices. Une enchère concentre leurs ordres en un prix robuste.
- **L'enchère intrajournalière :** certains marchés ajoutent une courte enchère en milieu de journée pour regrouper la liquidité.

> [!AUSTRIA]
> À la Bourse de Vienne, les actions de l'indice ATX se négocient ainsi un jour normal : **enchère d'ouverture 08:55–09:00**, négociation continue **09:00–12:00**, enchère intrajournalière **12:00–12:03**, négociation continue **12:03–17:30**, **enchère de clôture 17:30–17:35**, puis « trade at close » jusqu'à 17:45, où des ordres peuvent être exécutés au cours de clôture. Les actions moins liquides peuvent ne se négocier que par enchères.

> [!VERIFY]
> Les horaires et les phases de négociation changent de temps en temps et diffèrent selon les segments. Consultez la page officielle des horaires de la Bourse avant de vous fier à des heures précises. La rubrique Horaires de ce site indique en direct si une Bourse est ouverte ou fermée.

> [!MISTAKE] « Mon ordre de 08:56 sera exécuté immédiatement »
> Pendant la phase d'appel d'une enchère, les ordres sont seulement recueillis. Votre ordre est exécuté (s'il l'est) au moment de la détermination du prix de l'enchère, au prix de l'enchère, et non au moment où vous l'avez envoyé.

## À retenir

> [!TAKEAWAYS]
> - La négociation continue exécute les ordres immédiatement, à mesure qu'ils arrivent.
> - Les enchères recueillent les ordres pendant une phase d'appel, puis les exécutent tous à un prix unique.
> - Le prix de l'enchère est celui auquel le plus d'actions peuvent s'échanger.
> - Les enchères d'ouverture et de clôture créent des prix équitables et robustes en début et en fin de journée.
