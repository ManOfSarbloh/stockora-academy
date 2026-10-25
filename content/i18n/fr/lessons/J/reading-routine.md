---
title: "Une routine de lecture des graphiques, l'analyse multi-unités de temps et le backtest"
summary: "Une liste pas à pas pour lire n'importe quel graphique, de l'hebdomadaire à l'horaire, plus les pièges du backtest et pourquoi s'entraîner avec de l'argent fictif passe en premier."
translatedFrom: 2026-10-11
---

Vous connaissez maintenant les briques de base. Cette leçon les réunit dans une routine utilisable sur n'importe quel graphique, et explique pourquoi tester des idées sur des données passées est plus difficile qu'il n'y paraît.

## Du général au particulier

Regardez le même marché sur plusieurs unités de temps, en commençant par la plus longue :

1. **L'hebdomadaire :** quelle est la tendance de long terme ? Où sont les grands plus hauts et plus bas ?
2. **Le journalier :** la structure de moyen terme concorde-t-elle avec la vue hebdomadaire ? Où sont les zones de support et de résistance les plus proches ?
3. **L'horaire (ou plus court) :** seulement si votre plan en a besoin, pour les détails autour d'un niveau précis.

L'unité de temps la plus longue donne le contexte ; la plus courte montre les détails. Un signal d'achat sur le graphique en 5 minutes à contre-courant d'une nette tendance baissière hebdomadaire est une situation très différente d'un signal dans le sens de la tendance hebdomadaire.

## Une liste de vérification pour débutants

> [!TIP] Neuf étapes pour lire un graphique
> 1. **Vérifiez ce que vous regardez :** symbole, Bourse, devise, et données en temps réel ou différées.
> 2. **Choisissez l'unité de temps** adaptée à votre objectif (un investisseur de long terme n'a pas besoin de chandeliers d'une minute).
> 3. **Lisez la structure de la tendance :** plus hauts et plus bas de plus en plus élevés, de plus en plus bas, ou un trading range ?
> 4. **Repérez les zones de support et de résistance.**
> 5. **Regardez les derniers chandeliers** dans ce contexte.
> 6. **Vérifiez le volume :** un mouvement s'appuie-t-il sur une activité inhabituelle ?
> 7. **Ajoutez au plus un ou deux indicateurs**, et sachez ce qu'ils mesurent.
> 8. **Notez ce qui prouverait que vous avez tort :** le cours auquel votre lecture ne tient plus.
> 9. **Acceptez que « ne rien faire » soit une décision valable.** La plupart du temps, un graphique n'offre pas d'image claire.

## Le backtest et ses pièges

Le **backtest** consiste à vérifier comment un ensemble de règles se serait comporté sur des données passées. Il est utile pour écarter les mauvaises idées, mais il produit facilement des résultats qui paraissent meilleurs que la réalité :

- **Le surajustement (curve fitting) :** retoucher les règles jusqu'à ce qu'elles collent parfaitement au passé. Ces règles échouent généralement sur de nouvelles données.
- **Le data snooping :** tester de nombreuses règles et ne garder que la meilleure. Park et Irwin (2007) citent le data snooping et le choix des règles après avoir vu les résultats comme des problèmes fréquents dans la recherche sur l'analyse technique.
- **Le biais du survivant :** ne tester que les entreprises qui existent encore aujourd'hui ignore celles qui ont fait faillite ou ont été radiées de la cote, ce qui embellit les résultats.
- **L'oubli des frais :** les commissions, les fourchettes, le glissement de prix et les impôts peuvent transformer un petit avantage en perte (catégorie G).
- **Le biais d'anticipation :** utiliser par erreur une information qui n'était pas disponible à l'époque (par exemple un cours de clôture avant la clôture).

## S'entraîner d'abord : replay et trading fictif

Beaucoup de plateformes graphiques proposent un **mode replay** qui rejoue les chandeliers passés un par un, et le **trading fictif** : un compte simulé avec de l'argent virtuel. Les deux permettent de s'entraîner à lire les graphiques et à suivre ses règles sans risquer d'argent. Les résultats d'entraînement sont toutefois flatteurs : il n'y a pas de vraies émotions, et les exécutions simulées peuvent être meilleures que les réelles.

> [!MISTAKE] « Mon backtest a rapporté 300 % par an, donc la stratégie fonctionne »
> Des backtests spectaculaires sont presque toujours le signe d'un surajustement, d'un biais du survivant ou de frais oubliés. Testez sur des données que les règles n'ont jamais vues, incluez des frais réalistes, et attendez-vous à des résultats réels moins bons.

Entraînez-vous à cette routine dans le [Labo graphique](/charts/lab) : changez d'unité de temps, utilisez le mode replay et jouez à « dévoiler le chandelier suivant ».

## À retenir

> [!TAKEAWAYS]
> - Lisez les graphiques du général au particulier : l'hebdomadaire pour le contexte, le journalier pour la structure, les unités plus courtes seulement pour les détails.
> - Suivez une liste de vérification et notez ce qui prouverait que vous avez tort ; « ne rien faire » est une issue valable.
> - Les backtests souffrent du surajustement, du data snooping, du biais du survivant, du biais d'anticipation et de l'oubli des frais.
> - Entraînez-vous avec le replay et le trading fictif avant de risquer de l'argent réel, et attendez-vous à des résultats réels moins bons.
