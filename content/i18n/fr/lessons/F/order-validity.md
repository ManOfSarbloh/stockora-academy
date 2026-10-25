---
title: "Combien de temps dure un ordre : jour, GTC, IOC et FOK"
summary: "En plus des conditions de prix, les ordres ont des conditions de durée. Elles décident si un ordre non exécuté est annulé en fin de journée, reste ouvert ou doit être exécuté immédiatement."
translatedFrom: 2026-10-11
---

Chaque ordre a une **validité** : la durée pendant laquelle il reste actif s'il n'est pas exécuté tout de suite. Se tromper sur ce point est une raison fréquente pour laquelle des ordres « disparaissent » ou, pire, s'exécutent des semaines plus tard alors qu'on ne s'y attend plus.

## Les validités courantes

| Validité | Ce qu'elle signifie |
|---|---|
| **Ordre valable jour** | Valable seulement pour le jour de Bourse où il est saisi. S'il n'est pas exécuté, il est généralement annulé à la fin de la séance normale. |
| **Valable jusqu'à révocation (GTC, good-till-cancelled)** | Reste ouvert jusqu'à son exécution ou son annulation par vous. Les courtiers fixent généralement une durée maximale ; renseignez-vous. |
| **Valable jusqu'à une date (good-till-date)** | Reste ouvert jusqu'à une date que vous choisissez. |
| **Exécuter ou annuler (IOC, immediate-or-cancel)** | Doit s'exécuter immédiatement ; la partie qui ne peut pas être exécutée tout de suite est annulée. |
| **Tout ou rien (FOK, fill-or-kill)** | Doit s'exécuter immédiatement **en totalité** ; sinon, l'ordre entier est annulé (pas d'exécution partielle). |

> [!EXAMPLE]
> Vous passez un ordre d'achat limité à **45 €**, valable jusqu'à révocation, sur une action qui s'échange à 50 €, puis vous l'oubliez. Trois mois plus tard, après une mauvaise nouvelle, le cours tombe à 45 € et votre ordre s'exécute. Vous possédez maintenant des actions que vous ne vouliez plus acheter à ce moment-là.

> [!EXAMPLE]
> Vous voulez exactement 1 000 actions, pas moins. Avec **tout ou rien**, soit les 1 000 sont achetées immédiatement, soit aucune. Avec **exécuter ou annuler**, vous pourriez en obtenir 400 tout de suite, et le reste est annulé.

## Conseils

- Vérifiez régulièrement vos **ordres ouverts**, surtout les ordres valables jusqu'à révocation.
- Sachez si la validité par défaut de votre courtier est « jour » ou « jusqu'à révocation ».
- Demandez à votre courtier ce qu'il advient de vos ordres ouverts lors d'événements comme une division d'actions.

> [!MISTAKE] « Mon ordre n'a pas été exécuté aujourd'hui, il a donc disparu »
> Pas forcément. S'il était valable jusqu'à révocation, il attend toujours sur le marché et peut s'exécuter à tout moment.

## À retenir

> [!TAKEAWAYS]
> - Les ordres valables jour expirent à la fin de la journée de Bourse ; les ordres GTC restent ouverts jusqu'à leur exécution ou leur annulation.
> - IOC exécute immédiatement ce qu'il peut et annule le reste ; FOK s'exécute en totalité tout de suite ou pas du tout.
> - Vérifiez régulièrement vos ordres ouverts pour éviter les exécutions surprises.
