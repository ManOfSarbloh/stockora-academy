---
title: "Ordres au marché et ordres à cours limité"
summary: "Les deux types d'ordre de base. Un ordre au marché garantit l'exécution mais pas le prix ; un ordre à cours limité garantit le prix (ou mieux) mais pas l'exécution."
translatedFrom: 2026-10-11
---

Quand vous achetez ou vendez une action, vous ne dites pas seulement « achète ». Vous choisissez un **type d'ordre** qui indique au marché comment exécuter votre ordre. Les deux plus importants sont l'**ordre au marché** et l'**ordre à cours limité**.

## L'ordre au marché

Un **ordre au marché** dit : « achète (ou vends) maintenant, au meilleur prix disponible ».

- **L'exécution est (presque) garantie**, tant qu'il y a des vendeurs ou des acheteurs.
- **Le prix n'est pas garanti.** Un ordre d'achat au marché s'exécute généralement autour du **prix vendeur** actuel, un ordre de vente au marché autour du **prix acheteur** actuel, mais le prix obtenu peut différer du dernier cours que vous avez vu, surtout si les cours bougent vite ou si le carnet d'ordres est mince.

L'écart entre le prix attendu et le prix obtenu s'appelle le **glissement de prix** (slippage).

> [!EXAMPLE]
> Vous voyez un dernier cours de **20,00 €** et envoyez un ordre au marché pour acheter **500 actions**. Le carnet d'ordres propose 200 actions à 20,02 € et 300 à 20,10 €.
>
> Vous achetez 200 × 20,02 € + 300 × 20,10 € = 4 004 € + 6 030 € = **10 034 €**, soit une moyenne d'environ **20,07 €** par action, et non 20,00 €. Le glissement vous a coûté environ 34 €.

> [!ANIMATION] market-order-fill
> Un ordre au marché de 500 actions prend les 200 actions proposées à 20,02 €, puis les 300 à 20,10 € : 10 034 € au total, soit environ 20,07 € par action au lieu de 20,00 €.

## L'ordre à cours limité

Un **ordre à cours limité** dit : « achète à ce prix **ou moins** » (ou « vends à ce prix **ou plus** »).

- **Le prix est protégé :** un ordre d'achat limité à 50 € ne peut s'exécuter qu'à 50 € ou moins.
- **L'exécution n'est pas garantie :** si le marché n'atteint jamais votre limite, rien ne se passe.

> [!EXAMPLE]
> Une action s'échange à **52 €**. Vous passez un **ordre d'achat limité à 50 €**.
>
> - Si le cours baisse à 50 € ou moins et qu'il y a des vendeurs, votre ordre s'exécute à 50 € ou moins.
> - Si le cours ne baisse jamais autant, votre ordre reste non exécuté, et vous pourriez « rater » une hausse à 60 €.

> [!ANIMATION] limit-order
> Le même ordre d'achat limité à 50 €, deux scénarios possibles : le cours descend jusqu'à votre limite et l'ordre est exécuté, ou il ne l'atteint jamais et l'ordre attend pendant que le cours monte à 60 €.

## Les exécutions partielles

Les ordres peuvent être **partiellement exécutés** : si vous voulez 1 000 actions avec une limite à 50 € mais que seules 300 sont proposées à ce prix, vous pouvez en acheter 300 maintenant et les 700 restantes plus tard, ou jamais. Certains courtiers facturent des frais pour chaque exécution partielle ; vérifiez leur grille tarifaire.

## Lequel utiliser ?

| | Ordre au marché | Ordre à cours limité |
|---|---|---|
| Garantit l'exécution ? | Généralement oui | Non |
| Garantit le prix ? | Non | Oui (la limite ou mieux) |
| Adapté pour | Les actions très liquides, les petits ordres, quand la vitesse compte | Les actions moins liquides, les gros ordres, les moments volatils, en dehors des heures normales |

> [!MISTAKE] « Un ordre au marché s'exécute au prix affiché sur mon écran »
> Le prix affiché à l'écran est celui de la dernière transaction. Un ordre au marché s'exécute au meilleur prix disponible au moment où il arrive sur le marché, qui peut être sensiblement différent, surtout à l'ouverture, sur des marchés peu actifs ou quand une nouvelle tombe.

## À retenir

> [!TAKEAWAYS]
> - Les ordres au marché garantissent l'exécution, pas le prix ; les ordres à cours limité garantissent le prix, pas l'exécution.
> - Le glissement de prix est l'écart entre le prix attendu et le prix obtenu.
> - Les gros ordres peuvent être exécutés à plusieurs prix ou seulement en partie.
> - Les ordres à cours limité vous protègent sur les marchés peu liquides ou agités.
