---
title: "Ordres stop, stop limite et stop suiveur"
summary: "Les ordres stop attendent en arrière-plan et ne deviennent actifs que lorsqu'un cours est atteint. On les utilise souvent pour limiter les pertes, mais ils ne sont pas une garantie."
translatedFrom: 2026-10-11
---

Un **ordre stop** est un ordre qui dort jusqu'à ce que le cours atteigne un niveau que vous choisissez, le **seuil de déclenchement** (stop). Il se réveille alors et devient un ordre ordinaire. Les ordres stop servent souvent à limiter les pertes, d'où leur autre nom : **ordres stop-loss**.

## L'ordre stop (stop-loss)

- Un **stop de vente** se place **sous** le cours actuel. Si le cours tombe au seuil de déclenchement, il devient un **ordre au marché** de vente.
- Un **stop d'achat** se place **au-dessus** du cours actuel, par exemple pour limiter les pertes sur une position vendeuse.

> [!EXAMPLE]
> Vous détenez des actions à **40 €** et placez un **stop de vente à 36 €**.
>
> - Si le cours tombe à 36 €, votre stop se déclenche et un ordre de vente au marché est envoyé. Vous pourriez vendre à 35,95 €, ou plus bas si les cours chutent vite.
> - Si le cours n'atteint jamais 36 €, rien ne se passe.

**Important :** le seuil de déclenchement est un déclencheur, pas un prix de vente garanti. Si le marché ouvre bien en dessous de votre stop (un **gap**), votre ordre au marché s'exécute au prix beaucoup plus bas.

> [!EXAMPLE]
> Votre stop de vente est à 36 €. Pendant la nuit, l'entreprise annonce une mauvaise nouvelle. Le lendemain matin, l'action ouvre à **30 €**. Votre stop se déclenche, et vous vendez autour de 30 €, pas à 36 €.

## L'ordre stop limite

Un **ordre stop limite** a deux prix : un seuil de déclenchement qui l'active, et un prix limite. Une fois déclenché, il devient un **ordre à cours limité**. Cela vous évite de vendre bien en dessous de votre limite, mais l'ordre **peut ne pas s'exécuter du tout** si le cours passe sous la limite.

> [!EXAMPLE]
> Stop limite de vente : seuil **36 €**, limite **35 €**. Si le cours tombe à 36 €, un ordre de vente limité à 35 € est placé. Si le cours fait un gap jusqu'à 30 €, votre ordre ne s'exécute pas, et vous gardez les actions pendant qu'elles continuent de baisser.

## L'ordre stop suiveur

Un **stop suiveur** (trailing stop) fixe le seuil de déclenchement à un montant ou un pourcentage fixe **sous le plus haut cours** atteint depuis le passage de l'ordre. Quand le cours monte, le stop monte ; quand le cours baisse, il reste où il est.

> [!EXAMPLE]
> Vous achetez à **20 €** et fixez un stop suiveur de **1 €**. L'action monte à **24 €** ; le stop remonte donc à **23 €**. Puis le cours redescend : à 23 €, le stop se déclenche et un ordre de vente est envoyé.

## Ce qu'il faut vérifier

Selon la SEC, tous les courtiers ne proposent pas tous ces types d'ordres, et ils peuvent différer sur ce qui déclenche un stop (la dernière transaction ou les cotations actuelles). Des variations de cours de courte durée peuvent aussi déclencher un stop et vendre vos actions juste avant que le cours se redresse.

> [!MISTAKE] « Un stop-loss garantit que je ne peux pas perdre plus de 10 % »
> Un stop-loss ne limite les pertes que si le marché traverse votre seuil de façon ordonnée. Les gaps, les marchés rapides et les actions peu liquides peuvent mener à des ventes bien en dessous de votre stop, et un ordre stop limite peut ne pas s'exécuter du tout.

## À retenir

> [!TAKEAWAYS]
> - Un ordre stop devient un ordre au marché quand le seuil est atteint ; un stop limite devient un ordre à cours limité.
> - Le seuil de déclenchement est un déclencheur, pas un prix d'exécution garanti ; les gaps peuvent mener à des prix bien pires.
> - Les ordres stop limite protègent le prix, mais peuvent ne pas s'exécuter du tout.
> - Les stops suiveurs montent avec le cours, mais ne redescendent jamais.
