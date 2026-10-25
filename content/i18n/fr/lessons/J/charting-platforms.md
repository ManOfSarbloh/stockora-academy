---
title: "Comment fonctionne une plateforme graphique comme TradingView"
summary: "Une visite neutre d'une plateforme graphique type, avec TradingView comme exemple connu : symboles, réglages, indicateurs, outils de dessin, alertes, mode replay, filtres d'actions, trading fictif, scripts, idées de la communauté et risques."
translatedFrom: 2026-10-11
---

Les plateformes graphiques ont toutes un aspect un peu différent, mais elles partagent les mêmes briques. Nous prenons **TradingView** comme exemple parce qu'il est très connu. Les mêmes notions s'appliquent aux graphiques de l'application de votre courtier ou de toute autre plateforme.

> [!NOTE] Description neutre, aucune recommandation
> Stockora Academy n'a aucun lien avec TradingView ni avec aucune autre plateforme, n'utilise aucun lien d'affiliation et ne recommande ni plateforme ni abonnement. Les fonctions et les prix changent : consultez le [site officiel](https://www.tradingview.com/) pour la situation actuelle. L'illustration ci-dessous est notre propre croquis, pas une capture d'écran.

## Ce que c'est

TradingView est une plateforme web de graphiques et d'analyse des marchés, avec des applications mobiles et de bureau. Elle couvre les actions, les indices, les devises, les cryptomonnaies et les contrats à terme, et comporte un volet social où les utilisateurs publient leurs analyses graphiques (des « idées »).

## L'interface

![Croquis d'une plateforme graphique type : barre d'outils en haut, outils de dessin à gauche, graphique et volume au centre, panneaux à droite et en bas](../../../../lessons/J/img/platform-layout.svg)

- **La barre d'outils du haut :** recherche de symbole, choix de l'unité de temps, type de graphique, indicateurs, alertes, replay, mises en page.
- **La barre d'outils de gauche :** les outils de dessin.
- **La zone du graphique :** les chandeliers, un panneau de volume, un réticule qui suit la souris, et les échelles de prix et de temps.
- **Le panneau de droite :** listes de suivi, alertes, actualités et détails sur le symbole.
- **Le panneau du bas :** filtre d'actions, éditeur de scripts, testeur de stratégies (rapport de stratégie), trading fictif et connexions aux courtiers.

## Symboles et données

- **Le préfixe de la Bourse :** les symboles peuvent porter un préfixe de Bourse, comme `NASDAQ:AAPL`. La même entreprise peut se négocier sur plusieurs Bourses et dans différentes devises ; vérifiez quelle cotation vous regardez.
- **Différé ou temps réel :** la plupart des Bourses d'actions et de contrats à terme facturent les données en temps réel ; les données de nombreuses Bourses sont donc **différées**, sauf si vous achetez un abonnement de données. TradingView indique que ses formules payantes ne couvrent pas ces frais de Bourse. Si vous payez déjà des données en temps réel via un courtier, elles peuvent dans certains cas être utilisées sur la plateforme.
- **La source des données :** par défaut, TradingView affiche les cours des actions américaines provenant de Cboe, qui peuvent légèrement différer de ceux des Bourses principales.

## Les réglages du graphique à vérifier

Les couleurs des chandeliers, l'échelle linéaire ou logarithmique, l'ajustement des divisions et des dividendes, le **fuseau horaire** du graphique, les séances étendues et les interruptions de séance. Un graphique dans le mauvais fuseau horaire ou avec des cours non ajustés peut avoir un aspect très différent.

## Indicateurs et scripts

- Une bibliothèque intégrée d'indicateurs (moyennes mobiles, RSI, MACD, bandes de Bollinger et bien d'autres), chacun avec des réglages modifiables comme la durée et le cours source.
- **Pine Script** est le langage de programmation propre à la plateforme pour créer des indicateurs et des stratégies personnalisés, écrits dans un éditeur du panneau du bas. Beaucoup de **scripts de la communauté** sont publiés par des utilisateurs. Leur qualité varie, et un script n'est pas un conseil.
- Le **testeur de stratégies (rapport de stratégie)** montre comment une stratégie programmée se serait comportée sur des données passées, avec tous les pièges du backtest vus dans la leçon 9.

## Les outils de dessin

Lignes de tendance, lignes et demi-droites horizontales, canaux parallèles, rectangles pour les zones, retracements de Fibonacci, outil de mesure, **outils de position longue ou courte** qui montrent le risque et le gain prévus d'une transaction, notes de texte et VWAP ancré.

## Les alertes

Les alertes vous envoient une notification quand une condition de cours ou d'indicateur est remplie, par exemple un cours qui franchit un niveau. Pratique pour ne pas devoir surveiller l'écran, mais de nombreuses alertes peuvent aussi mener au **surtrading et au FOMO**.

## Le mode replay

Le **bar replay** rejoue les chandeliers passés un par un à partir d'un point de départ que vous choisissez, pour vous entraîner à lire les graphiques sans savoir ce qui vient ensuite.

## Filtre d'actions, listes de suivi et mises en page

Listes de suivi, mises en page multigraphiques avec un réticule synchronisé, modèles enregistrés, et un **filtre d'actions** (screener) qui trie les marchés selon des critères comme la valeur de marché, le PER ou le volume. Un résultat de filtre est une liste qui correspond à vos critères, pas une recommandation.

## Trading fictif et connexions aux courtiers

- **Le trading fictif (paper trading) :** un compte simulé avec de l'argent virtuel, disponible pour tous les utilisateurs selon TradingView.
- **Les connexions aux courtiers :** certains courtiers peuvent être connectés pour passer des ordres depuis le graphique. C'est pratique, mais cela rend aussi la négociation très rapide et facile, y compris les transactions impulsives. Vérifiez qui est votre courtier, où il est réglementé et ce qu'il coûte (catégorie F).

## Les idées de la communauté

Les utilisateurs publient leurs analyses graphiques sous forme d'**idées**, montrées à leurs abonnés et aux personnes qui suivent le symbole ; les plus populaires remontent en page d'accueil. Lisez-les avec prudence : la popularité n'est pas l'exactitude, et les fils sociaux servent aussi au **battage médiatique, à la vente de « signaux » et aux arnaques** (voir l'[Anti-arnaques](/scams)).

## Les formules

Il existe une formule gratuite et plusieurs formules payantes avec davantage de fonctions. Laquelle vous convient, s'il y en a une, c'est votre décision ; consultez le site officiel pour les différences actuelles. Les données en temps réel de nombreuses Bourses coûtent un supplément en plus d'une formule.

## Risques et limites

- des données différées prises pour des cours en direct ;
- le mauvais fuseau horaire ou des cours non ajustés ;
- des indicateurs qui font du **repainting** et réécrivent leurs signaux passés ;
- des backtests surajustés dans le testeur de stratégies ;
- trop d'alertes et le FOMO des fils sociaux.

> [!MISTAKE] « Cette idée a des milliers de j'aime, elle doit donc être juste »
> Les idées sont des opinions. Les idées populaires ne sont pas vérifiées, et les graphiques publiés sont faciles à sélectionner après coup.

**Essayez la visite guidée :** le [Labo graphique](/charts/lab) dispose des mêmes briques (types de graphiques, unités de temps, indicateurs, outils de dessin, replay) et d'une visite « lire ce graphique pas à pas » qui suit la liste de la leçon 9.

## À retenir

> [!TAKEAWAYS]
> - Les plateformes graphiques partagent les mêmes éléments : recherche de symbole, unités de temps, types de graphiques, indicateurs, outils de dessin, alertes, replay, filtre d'actions et panneaux.
> - Vérifiez le préfixe de la Bourse, la devise, le fuseau horaire, les réglages d'ajustement et si les données sont différées.
> - Les scripts et les idées de la communauté ne sont pas des conseils ; leur qualité varie et le battage est fréquent.
> - Le replay et le trading fictif servent à s'entraîner ; les backtests et les alertes ont leurs propres risques.
> - Nous décrivons TradingView seulement à titre d'exemple ; les fonctions et les prix changent, consultez le site officiel.
