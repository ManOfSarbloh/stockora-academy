---
title: "La corrélation : pourquoi un mélange peut être moins risqué que ses composantes"
summary: "La corrélation mesure si des placements évoluent ensemble. Combiner des actifs qui ne bougent pas au même rythme réduit la volatilité du portefeuille. Les calculs, des données réelles et la mise en garde : les corrélations changent."
translatedFrom: 2026-10-12
---

Le guide de la SEC pour débutants explique pourquoi la diversification fonctionne : les rendements des grandes catégories d'actifs n'ont historiquement **pas monté et baissé en même temps**. La **corrélation** traduit cette idée en un chiffre.

## Ce que signifie la corrélation

La corrélation mesure à quel point deux placements évoluent ensemble, sur une échelle de **−1 à +1** :

| Corrélation | Signification |
|---:|---|
| +1 | Ils évoluent toujours dans le même sens, proportionnellement. Aucun bénéfice de diversification. |
| 0 | Aucune relation régulière. |
| −1 | Ils évoluent toujours en sens opposé. |

Plus la corrélation est faible, plus leur combinaison réduit le risque.

## Pourquoi un mélange est moins volatil

Si deux placements ne sont pas parfaitement corrélés, la volatilité du mélange est **inférieure à la moyenne pondérée** de leurs volatilités.

> [!EXAMPLE] Actions et obligations, 1928–2025
> D'après les données annuelles américaines de Damodaran (calcul propre) :
> - Volatilité du S&P 500 : **19,4 %**. Volatilité des obligations du Trésor à 10 ans : **7,9 %**.
> - Moyenne pondérée pour un mélange 60/40 : 0,6 × 19,4 % + 0,4 × 7,9 % = **14,8 %**.
> - Volatilité réelle d'un mélange 60/40 rééquilibré chaque année : **12,1 %**.
>
> Sur l'ensemble de la période, la corrélation entre les rendements annuels des actions et des obligations était proche de **zéro (0,02)**, si bien que le mélange était bien plus régulier que ses composantes.

La formule pour deux actifs, pour les amateurs de mathématiques :

**σ²(portefeuille) = w₁²σ₁² + w₂²σ₂² + 2·w₁·w₂·ρ·σ₁·σ₂**

où w sont les pondérations, σ les volatilités et ρ la corrélation. Avec ρ inférieur à 1, le dernier terme diminue, et le risque du portefeuille aussi.

## Les corrélations changent

La corrélation n'est pas une loi immuable de la nature. Dans les mêmes données :

- 1928–1999 : corrélation actions–obligations d'environ **+0,15**.
- 2000–2025 : environ **−0,36** : les obligations ont souvent monté quand les actions baissaient, comme en 2008 (+20,1 % contre −36,6 %).
- Pourtant, en **2022**, les deux ont baissé d'environ 18 % (catégorie K).

La FMA fait une remarque voisine à propos du biais domestique : les placements d'un même marché national ont tendance à être plus corrélés entre eux que des placements diversifiés à l'international (catégorie O).

> [!WARNING] Dans une panique, les corrélations peuvent bondir
> Lors de crises graves, de nombreux actifs risqués ont tendance à baisser ensemble. Un portefeuille d'actions de nombreux secteurs baisse quand même lors d'un krach de l'ensemble du marché. Seuls des actifs qui se comportent réellement différemment, comme les obligations d'État de haute qualité ou les liquidités, ont eu tendance à amortir de telles baisses, et pas toujours.

## Utilisation pratique

- Quand vous ajoutez un placement, demandez-vous : se comporte-t-il **différemment** de ce que je détiens déjà ? Un autre fonds d'actions de grandes capitalisations, probablement pas.
- **Les liquidités et les obligations de haute qualité** sont les diversificateurs classiques des portefeuilles d'actions.
- Les corrélations estimées sur de courtes périodes ne sont pas fiables ; privilégiez de longs historiques et attendez-vous à des surprises.

## À retenir

> [!TAKEAWAYS]
> - La corrélation (de −1 à +1) mesure à quel point des placements évoluent ensemble.
> - Avec une corrélation inférieure à +1, un mélange est moins volatil que la moyenne pondérée de ses composantes.
> - Données américaines 1928–2025 : actions 19,4 %, obligations 7,9 %, mélange 60/40 seulement 12,1 % de volatilité.
> - Les corrélations changent avec le temps : négatives en moyenne depuis 2000, mais actions et obligations ont baissé ensemble en 2022.
> - En période de crise, les actifs risqués baissent souvent ensemble.
