---
title: "Les indicateurs : moyennes mobiles, RSI, MACD, bandes de Bollinger et autres"
summary: "Ce que calculent les indicateurs les plus courants, comment on les lit habituellement, et leurs limites intrinsèques. Les indicateurs sont dérivés du cours ; ils n'apportent pas d'information nouvelle."
translatedFrom: 2026-10-11
---

Un **indicateur** est un calcul fondé sur le cours (et parfois sur le volume), affiché sur le graphique ou en dessous. Il en existe deux familles :

- **Les indicateurs superposés** sont dessinés par-dessus le cours : moyennes mobiles, bandes de Bollinger, VWAP.
- **Les oscillateurs** sont dessinés dans un panneau séparé et évoluent dans une plage fixe ou autour de zéro : RSI, MACD.

![Graphique de cours simulé avec des moyennes mobiles et des bandes de Bollinger, et des panneaux RSI et MACD en dessous](../../../../lessons/J/img/indicators.svg)

> [!NOTE]
> Les indicateurs sont calculés **à partir du cours**. Ils peuvent rendre certaines configurations plus visibles, mais ils n'apportent aucune information nouvelle sur l'avenir, et la plupart sont **en retard** : ils réagissent après le mouvement du cours.

## Les moyennes mobiles (MMS et MME)

- **La moyenne mobile simple (MMS, ou SMA) :** la moyenne des cours de clôture des *n* dernières périodes. Exemple : des clôtures de 45,50, 45,25 et 46,10 donnent une MMS sur 3 périodes de 136,85 ÷ 3 = **45,62**.
- **La moyenne mobile exponentielle (MME, ou EMA) :** donne plus de poids aux cours récents, elle réagit donc plus vite. Chaque nouvelle valeur = cours × multiplicateur + MME précédente × (1 − multiplicateur), avec multiplicateur = 2 ÷ (n + 1).
- **Les durées courantes :** 20, 50, 100 et 200 périodes. Une moyenne en hausse suggère une tendance haussière ; le franchissement de sa moyenne par le cours est surveillé par beaucoup de traders.
- **La croix dorée et la croix de la mort :** quand la moyenne à 50 jours passe **au-dessus** de celle à 200 jours, on parle couramment de croix dorée (golden cross) ; quand elle passe **en dessous**, de croix de la mort (death cross). Les deux surviennent bien après le retournement du cours, par construction.

## Le RSI (Relative Strength Index)

- Compare la taille moyenne des **hausses** à la taille moyenne des **baisses** sur une période (souvent 14), sur une échelle de **0 à 100**.
- Niveaux conventionnels : au-dessus de **70**, « suracheté » ; en dessous de **30**, « survendu ».
- **Le piège :** dans une forte tendance, le RSI peut rester longtemps au-dessus de 70 (ou en dessous de 30) pendant que le cours continue. « Suracheté » ne veut pas dire « sur le point de baisser ».
- **La divergence :** le cours fait un nouveau plus haut, mais pas le RSI. Les traders y voient un essoufflement ; cela peut durer longtemps.

## Le MACD (Moving Average Convergence Divergence)

- **La ligne MACD :** la MME sur 12 périodes moins la MME sur 26 périodes.
- **La ligne de signal :** une MME sur 9 périodes de la ligne MACD.
- **L'histogramme :** la ligne MACD moins la ligne de signal.
- Les traders surveillent les croisements de la ligne MACD et de la ligne de signal, ainsi que le passage de la ligne MACD par zéro. Comme il est construit à partir de moyennes mobiles, le MACD est lui aussi en retard.

## Les bandes de Bollinger

Conçues par John Bollinger : une moyenne mobile sur 20 périodes, avec des bandes situées à **deux écarts-types** au-dessus et en dessous (les réglages par défaut). Les bandes s'élargissent quand les cours deviennent plus volatils et se resserrent quand ils se calment. Un fort resserrement (« squeeze ») montre une volatilité inhabituellement faible ; les traders guettent le retour de la volatilité, mais les bandes ne disent pas dans quelle direction.

## Le VWAP (prix moyen pondéré par les volumes)

Le prix moyen de la journée, pondéré par les quantités échangées à chaque prix : (somme des prix × volumes) ÷ (volume total). Il **repart à zéro à chaque séance** et sert surtout en intrajournalier. Beaucoup d'acteurs du marché utilisent des stratégies d'exécution au VWAP, qui visent à acheter ou vendre un gros ordre au plus près du VWAP du jour.

## L'ATR (Average True Range)

Une mesure de la **volatilité**, pas de la direction : la taille moyenne de l'amplitude de chaque période, y compris un éventuel gap par rapport à la clôture précédente. Une action avec un ATR de 2 € bouge généralement d'environ 2 € par jour. Les traders s'en servent, par exemple, pour placer leurs stops à une distance raisonnable.

## Les retracements de Fibonacci

Des lignes tracées à **38,2 %, 50 % et 61,8 %** d'un mouvement précédent, où certains traders s'attendent à ce qu'un repli marque une pause. Les ratios proviennent de la suite de Fibonacci (le 50 % est ajouté par convention). Les niveaux de Fibonacci sont populaires mais **subjectifs** : le résultat dépend du plus haut et du plus bas choisis, et avec plusieurs niveaux proches, l'un d'eux semblera presque toujours « fonctionner ».

## Règles empiriques

- **Plus d'indicateurs n'est pas mieux.** Beaucoup d'indicateurs montrent la même information de différentes façons ; cinq indicateurs qui concordent ne sont pas cinq confirmations indépendantes.
- **Les réglages par défaut sont des conventions,** pas des lois : 14 pour le RSI ou 20 pour les bandes de Bollinger sont des habitudes, pas des valeurs optimales.
- **Le repainting :** certains indicateurs personnalisés modifient leurs valeurs passées quand de nouvelles données arrivent ; ils paraissent parfaits sur l'historique mais donnent d'autres signaux en temps réel.

> [!MISTAKE] « Le RSI est au-dessus de 70, je dois donc vendre »
> Un RSI au-dessus de 70 dit seulement que les hausses récentes l'ont emporté sur les baisses récentes. Dans les fortes tendances haussières, il peut y rester des semaines. La lecture d'un indicateur est une description, pas une instruction.

Activez et désactivez chaque indicateur, et modifiez ses réglages, dans le [Labo graphique](/charts/lab).

## À retenir

> [!TAKEAWAYS]
> - Les indicateurs sont calculés à partir du cours (et du volume) ; ils n'apportent pas d'information nouvelle et la plupart sont en retard.
> - Les moyennes mobiles lissent le cours ; les MME réagissent plus vite que les MMS.
> - Le RSI et les autres oscillateurs peuvent rester longtemps « surachetés » ou « survendus » dans les fortes tendances.
> - Le MACD est construit à partir de moyennes mobiles ; les bandes de Bollinger et l'ATR mesurent la volatilité ; le VWAP est une référence intrajournalière.
> - Les niveaux de Fibonacci sont subjectifs ; mieux vaut peu d'indicateurs bien compris qu'une surcharge d'indicateurs.
