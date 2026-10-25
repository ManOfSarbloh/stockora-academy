---
title: "Les options : calls, puts et le prix d'un droit"
summary: "Une option donne le droit, mais non le devoir, d'acheter ou de vendre à un prix fixé. Les acheteurs peuvent perdre la prime ; les vendeurs peuvent perdre bien plus. Découvrez les calls, les puts, les gains à l'échéance, l'effet de levier et le piège de l'érosion du temps."
translatedFrom: 2026-10-11
---

Un **dérivé** est un instrument financier dont la valeur dépend d'un actif sous-jacent, comme une action ou un indice (Investor.gov). Les **options** font partie des dérivés les plus anciens et les plus négociés.

## L'idée de base

Investor.gov définit les options comme des contrats donnant à l'acheteur **le droit, mais pas le devoir**, d'acheter ou de vendre un titre à un prix fixé pendant une période déterminée. Le lexique de la Wiener Börse ajoute les termes clés :

- L'acheteur paie une **prime** pour ce droit.
- Le prix fixé est le **prix d'exercice** (strike).
- Un **call** est le droit d'**acheter** ; un **put** est le droit de **vendre**.
- Les options **à l'américaine** peuvent être exercées pendant toute leur durée, les options **à l'européenne** seulement à la fin.
- Le **vendeur** (émetteur, *Stillhalter*) reçoit la prime et prend l'**engagement** de livrer le sous-jacent (call) ou de l'acheter (put) si l'acheteur exerce.

Le lexique note qu'un call qui n'est pas exercé **expire sans valeur**.

## Les gains à l'échéance

> [!EXAMPLE] Acheter un call
> Une action cote 100 €. Vous achetez un call de prix d'exercice 100 € pour une prime de **5 €** par action, à échéance de trois mois.
>
> | Cours de l'action à l'échéance | Valeur du call | Votre résultat |
> |---:|---:|---:|
> | 80 € | 0 € | −5 € (−100 %) |
> | 100 € | 0 € | −5 € (−100 %) |
> | 105 € | 5 € | 0 € |
> | 120 € | 20 € | +15 € (+300 %) |
>
> L'action doit monter au-dessus de **105 €** (prix d'exercice + prime) rien que pour atteindre l'équilibre. Le maximum que vous pouvez perdre est la prime.

> [!EXAMPLE] Acheter un put
> Même action à 100 €. Un put de prix d'exercice 100 € coûte **4 €**.
> - À l'échéance, l'action est à 80 € : le put vaut 20 €, votre résultat est de **+16 €**.
> - À l'échéance, l'action est à 100 € ou plus : le put expire sans valeur, résultat **−4 €**.
>
> Certains investisseurs achètent des puts comme **assurance** contre la baisse d'actions qu'ils détiennent, en payant la prime comme une cotisation d'assurance.

## L'effet de levier

Le lexique de la Wiener Börse explique l'**effet de levier** (*Hebel*) des options : leurs prix varient d'un pourcentage bien plus grand que le sous-jacent, si bien qu'il faut beaucoup moins de capital pour participer à une variation de cours. Dans l'exemple du call, une hausse de 20 % de l'action s'est transformée en gain de **300 %**, mais un cours inchangé a signifié une perte de **100 %**.

## Le temps joue contre l'acheteur

Une option a une durée de vie limitée. Une partie de son prix reflète le **temps** qui reste au sous-jacent pour bouger. À l'approche de l'échéance, cette valeur temps diminue : une option achetée peut donc perdre de la valeur même si le cours de l'action ne bouge pas, et elle expire sans valeur si le cours n'a pas assez bougé à l'échéance.

## Vendre (émettre) des options

L'émetteur encaisse la prime, ce qui ressemble à un revenu régulier. Mais :

- L'émetteur d'un call qui ne détient pas les actions (un **call non couvert**) s'expose, en théorie, à des **pertes illimitées** si le cours s'envole.
- L'émetteur de puts peut devoir acheter des actions bien au-dessus de leur prix de marché lors d'un krach.
- Les émetteurs doivent déposer une **marge** (leçon 3) ; le lexique de la Wiener Börse note que, pour les options, une marge est exigée sur les positions vendeuses.

> [!WARNING] De petits gains réguliers et de rares pertes énormes
> Vendre des options produit souvent de nombreux petits gains suivis d'une perte occasionnelle très importante. Des stratégies qui « ont toujours marché » peuvent anéantir un compte en un seul choc de marché.

> [!AUSTRIA] L'accès
> Les options sont des dérivés, qui ne figurent pas parmi les instruments « non complexes » énumérés à l'article 25, paragraphe 4, de MiFID II. Une entreprise qui se contente d'exécuter vos ordres doit donc en général évaluer s'ils vous sont **appropriés**, en fonction de vos connaissances et de votre expérience (catégorie F). Les titres de type option émis par des banques s'appellent des **warrants** (*Optionsscheine*, leçon 9).

## À retenir

> [!TAKEAWAYS]
> - Une option est un droit, et non un devoir, d'acheter (call) ou de vendre (put) au prix d'exercice.
> - Les acheteurs paient une prime et peuvent en perdre 100 % ; beaucoup d'options expirent sans valeur.
> - Les options ont un fort effet de levier : de petites variations de l'action entraînent de grandes variations de l'option.
> - La valeur temps diminue à l'approche de l'échéance.
> - Les émetteurs d'options reçoivent la prime mais peuvent subir des pertes très importantes, voire illimitées.
