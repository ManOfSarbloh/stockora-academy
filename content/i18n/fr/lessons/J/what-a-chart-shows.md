---
title: "Ce que montre un graphique de cours"
summary: "Le cours sur un axe, le temps sur l'autre. Types de graphiques, unités de temps, échelles linéaire et logarithmique, volume, cours ajustés et données différées, expliqués avant de lire la moindre figure."
translatedFrom: 2026-10-11
---

Un graphique est simplement une image de l'évolution d'un cours. L'axe vertical montre le **cours**, l'axe horizontal le **temps**. Tout le reste d'un graphique, des chandeliers aux indicateurs, repose sur ces deux axes.

> [!NOTE]
> L'École des graphiques vous apprend à **lire** les graphiques. Elle ne donne aucun signal d'achat ou de vente, et aucun graphique ne peut dire ce que fera un cours ensuite. Tous les graphiques d'exemple de ce site utilisent des cours **simulés**.

## Les types de graphiques

![Les mêmes 16 jours dessinés en graphique en ligne, en graphique en barres et en graphique en chandeliers](../../../../lessons/J/img/chart-types.svg)

- **Le graphique en ligne :** relie les cours de clôture. Épuré et bon pour la vue d'ensemble, mais il cache ce qui s'est passé pendant chaque période.
- **Le graphique en barres (OHLC) :** chaque période est un trait vertical allant du **plus haut** au **plus bas**, avec une petite marque horizontale à gauche pour l'**ouverture** et à droite pour la **clôture**.
- **Le graphique en chandeliers :** montre les mêmes quatre cours qu'un graphique en barres, mais l'écart entre l'ouverture et la clôture est dessiné sous forme d'un **corps** épais, coloré selon que le cours a monté ou baissé. La leçon suivante explique les chandeliers en détail.
- **Le graphique en aires :** un graphique en ligne dont la zone située en dessous est remplie.
- **Heikin Ashi :** des chandeliers lissés construits à partir de **moyennes** de la période en cours et de la précédente. Ils font paraître les tendances plus nettes, mais leurs ouverture et clôture **ne sont pas des cours réellement négociés**.
- **Renko et Kagi :** des graphiques qui ignorent le temps et ne dessinent une nouvelle brique ou un nouveau trait que lorsque le cours bouge d'un montant fixé. Vous en aurez rarement besoin en tant que débutant.

![Les mêmes 30 jours en chandeliers normaux et en chandeliers Heikin Ashi](../../../../lessons/J/img/heikin-ashi.svg)

## Les unités de temps

Chaque chandelier ou chaque barre représente une **période** : 1 minute, 5 minutes, 1 heure, 1 jour, 1 semaine ou 1 mois. Un graphique journalier a un chandelier par jour de Bourse ; un graphique hebdomadaire regroupe cinq jours en un seul chandelier.

Le même marché peut paraître complètement différent selon l'unité de temps : une forte baisse sur le graphique en 5 minutes peut n'être qu'un petit creux sur le graphique hebdomadaire. Les unités de temps longues donnent le contexte général ; les courtes montrent les détails et le bruit.

> [!EXAMPLE]
> Une action se négocie 390 minutes par jour (par exemple de 9 h 30 à 16 h). Sur un graphique en 1 heure, cette journée donne six chandeliers horaires complets plus un septième, plus court, pour les 30 dernières minutes. Sur un graphique journalier, c'est un seul chandelier.

## Échelle linéaire ou logarithmique

Sur une échelle **linéaire**, chaque graduation de l'axe des prix vaut le même nombre d'euros : de 10 à 20 occupe autant de place que de 100 à 110. Sur une échelle **logarithmique**, chaque graduation vaut le même **pourcentage** : de 10 à 20 (+100 %) occupe autant de place que de 100 à 200 (+100 %).

![Le même historique de cours sur une échelle linéaire et sur une échelle logarithmique](../../../../lessons/J/img/linear-vs-log.svg)

Pour les longues périodes et les cours qui ont beaucoup progressé, l'échelle logarithmique est généralement plus honnête : elle montre les variations en pourcentage à leur vraie taille relative.

## Le volume

La plupart des graphiques affichent le **volume** (le nombre d'actions échangées à chaque période) sous forme de barres sous le cours. Un fort mouvement de cours avec un volume élevé a impliqué beaucoup de participants ; le même mouvement avec un volume très faible en a impliqué peu. Le volume est repris dans les leçons sur les tendances et les indicateurs.

## Ce qui peut rendre un graphique trompeur

- **Cours ajustés ou non ajustés :** après une division d'actions, le cours baisse (par exemple de 100 € à 50 € après une division par deux) sans que personne ne perde d'argent. Les plateformes graphiques **ajustent** généralement les anciens cours pour que le graphique ne montre pas un faux krach. Certaines plateformes proposent aussi un ajustement des dividendes. Vérifiez le réglage avant de comparer d'anciens et de nouveaux cours.
- **Fuseaux horaires et séances :** un chandelier journalier couvre la journée de Bourse dans le fuseau horaire de la Bourse. Certaines plateformes affichent aussi des chandeliers de **pré-ouverture et d'après-Bourse** (voir la catégorie E).
- **Les gaps :** quand la période suivante ouvre loin de la clôture précédente, par exemple après une nouvelle tombée pendant la nuit, le graphique montre un espace vide : un **gap**.
- **Les données différées :** beaucoup de Bourses facturent les cours en temps réel ; les graphiques gratuits sont donc souvent **différés**, d'un délai qui dépend de la Bourse. Vérifiez si votre graphique est en direct avant de vous fier au dernier chandelier.

> [!MISTAKE] « Le graphique montre un krach, donc l'entreprise a perdu la moitié de sa valeur »
> Vérifiez d'abord s'il y a eu une division d'actions. Si le graphique n'est pas ajusté, une division par deux ressemble à une chute de 50 %, alors que les actionnaires possèdent simplement deux fois plus d'actions à moitié prix.

## À retenir

> [!TAKEAWAYS]
> - Un graphique représente le cours en fonction du temps ; les graphiques en ligne, en barres et en chandeliers sont les plus courants.
> - Les chandeliers Heikin Ashi sont des moyennes et ne montrent pas de vrais cours négociés.
> - Chaque chandelier représente une période ; l'unité de temps change ce que vous voyez.
> - Une échelle logarithmique montre les variations en pourcentage à leur vraie taille, utile sur de longues périodes.
> - Vérifiez les cours ajustés, le fuseau horaire, les séances et si les données sont différées.
