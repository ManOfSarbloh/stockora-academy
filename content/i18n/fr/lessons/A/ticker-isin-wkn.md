---
title: "Ticker, ISIN et WKN : comment une action est identifiée"
summary: "Chaque action a des codes qui l'identifient. Savoir quel code signifie quoi vous évite d'acheter le mauvais titre."
translatedFrom: 2026-10-11
---

Les noms d'entreprise ne sont pas assez précis pour négocier : beaucoup d'entreprises ont des noms proches, une même entreprise peut avoir plusieurs sortes d'actions, et la même action peut se négocier à plusieurs endroits. Les valeurs mobilières sont donc identifiées par des codes. Vous en rencontrerez trois.

## Le symbole boursier (ticker)

Un **ticker** (ou symbole boursier) est un code court, généralement de quelques lettres, qu'une Bourse utilise pour une action cotée. C'est ce que vous voyez sur les écrans de cours et les graphiques.

Les tickers sont pratiques mais **pas uniques dans le monde** : chaque Bourse attribue les siens, si bien que la même entreprise peut avoir des tickers différents selon les Bourses, et que les mêmes lettres peuvent désigner des entreprises différentes sur des Bourses différentes. Les plateformes de graphiques affichent donc souvent la Bourse devant le ticker, sous la forme `BOURSE:TICKER` (plus de détails dans l'École des graphiques).

## L'ISIN : l'identifiant international

L'**ISIN** (International Securities Identification Number) identifie une valeur mobilière précise dans le monde entier. Selon l'agence autrichienne de codification OeKB, toutes les valeurs négociées en Bourse ont besoin d'un ISIN. Il compte toujours **12 caractères**, en trois parties :

| Partie | Longueur | Signification |
|---|---|---|
| Code pays | 2 lettres | Le pays de l'agence nationale qui a attribué l'ISIN, par ex. `AT` pour l'Autriche, `DE` pour l'Allemagne, `US` pour les États-Unis |
| Numéro de base | 9 caractères | Des lettres et des chiffres choisis par cette agence |
| Clé de contrôle | 1 chiffre | Calculée à partir des 11 autres caractères, pour détecter les fautes de frappe |

L'ISIN d'une action autrichienne se compose donc de `AT` + neuf caractères + une clé de contrôle. Le format ISIN est une norme internationale (ISO 6166), et chaque pays a une agence nationale de codification qui les attribue.

> [!AUSTRIA]
> En Autriche, les ISIN sont attribués par l'**Oesterreichische Kontrollbank (OeKB)**. Les valeurs autrichiennes ont donc généralement un ISIN qui commence par `AT`.

## Le WKN : le code allemand

Le **WKN** (Wertpapierkennnummer, « numéro d'identification des titres ») est un code allemand à six caractères. Il est plus ancien que l'ISIN, qui l'a largement remplacé, mais vous le verrez encore très souvent chez les banques et les courtiers des pays germanophones, dont l'Autriche. Pour les titres enregistrés en Allemagne, le WKN fait partie de l'ISIN.

## Pourquoi c'est important pour vous

Une même entreprise peut avoir plusieurs titres différents : actions ordinaires et de préférence, actions cotées dans différents pays, obligations, et produits émis par des banques qui se contentent de *suivre* l'action de l'entreprise. Leurs noms peuvent sembler presque identiques, mais chacun a son propre ISIN.

> [!EXAMPLE]
> Vous voulez acheter des actions d'une entreprise et tapez son nom dans l'application de votre courtier. Cinq résultats apparaissent : deux catégories d'actions, une obligation et deux produits bancaires qui parient sur le cours de l'action.
>
> Si vous comparez l'**ISIN** avec celui indiqué sur la page relations investisseurs de l'entreprise, vous savez exactement lequel est l'action ordinaire que vous cherchiez.

> [!MISTAKE] « Je cherche par nom et je prends le premier résultat »
> C'est ainsi que des gens achètent par erreur une autre catégorie d'actions, un produit dans une autre devise ou un produit bancaire à effet de levier. Vérifiez toujours l'ISIN (ainsi que la Bourse et la devise) avant de passer un ordre.

## À retenir

> [!TAKEAWAYS]
> - Un ticker est un code boursier court ; il n'est pas unique d'une Bourse à l'autre.
> - L'ISIN est l'identifiant international unique : 12 caractères (pays, numéro de base, clé de contrôle).
> - En Autriche, c'est l'OeKB qui attribue les ISIN.
> - Le WKN est un code allemand à six caractères, encore très utilisé dans les pays germanophones.
> - Vérifiez l'ISIN avant d'acheter, pour obtenir exactement le titre voulu.
