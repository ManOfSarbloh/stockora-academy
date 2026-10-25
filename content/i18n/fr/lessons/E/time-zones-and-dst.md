---
title: "Fuseaux horaires et heure d'été"
summary: "Les Bourses fonctionnent à l'heure locale, et l'Europe et les États-Unis changent d'heure à des dates différentes. Pendant quelques semaines chaque année, le marché américain ouvre une heure plus tôt à Vienne."
translatedFrom: 2026-10-11
---

Chaque Bourse fixe ses horaires en **heure locale**. Pour savoir quand un marché étranger est ouvert pour vous, il faut convertir, et deux fois par an cette conversion change à cause de l'**heure d'été**.

## Vienne et New York : l'écart habituel

New York a normalement **6 heures de retard** sur Vienne. La séance principale du NYSE, de **9 h 30 à 16 h**, heure de New York, correspond donc généralement à **15:30–22:00** à Vienne.

## Les horloges changent à des dates différentes

- **Union européenne :** l'heure d'été commence à 01:00 UTC le **dernier dimanche de mars** et se termine à 01:00 UTC le **dernier dimanche d'octobre** (directive 2000/84/CE). Tous les pays de l'UE changent d'heure au même moment.
- **États-Unis :** l'heure d'été commence à 2 h, heure locale, le **deuxième dimanche de mars** et se termine le **premier dimanche de novembre** (règles en vigueur depuis 2007).

Comme les États-Unis changent d'heure plus tôt au printemps et plus tard à l'automne, il y a quelques semaines chaque année où l'écart entre Vienne et New York n'est que de **5 heures**.

> [!EXAMPLE]
> **2026 :**
>
> | Période | Le NYSE ouvre à Vienne à | Le NYSE ferme à Vienne à |
> |---|---|---|
> | Jusqu'au 7 mars | 15:30 | 22:00 |
> | **8 mars – 28 mars** | **14:30** | **21:00** |
> | 29 mars – 24 octobre | 15:30 | 22:00 |
> | **25 octobre – 31 octobre** | **14:30** | **21:00** |
> | À partir du 1er novembre | 15:30 | 22:00 |
>
> En 2027, les semaines particulières vont du 14 au 27 mars et du 31 octobre au 6 novembre.

Ces dates ont été calculées à partir de la base de données officielle des fuseaux horaires (la base tz de l'IANA, utilisée par les ordinateurs du monde entier), et non saisies à la main.

## Les pays sans heure d'été

Beaucoup de pays, dont le Japon, la Chine et l'Inde, n'ont pas du tout d'heure d'été. Leur décalage avec Vienne change donc d'une heure quand *l'Europe* change d'heure.

> [!WARNING]
> Les erreurs de fuseau horaire sont une source classique d'erreurs : une ouverture manquée, un ordre passé alors que le marché était déjà fermé, une réaction à une nouvelle au mauvais moment. Vérifiez toujours la conversion pour la date exacte, surtout en mars, en octobre et en novembre.

> [!MISTAKE] « New York a toujours six heures de retard sur Vienne »
> Généralement oui, mais pas pendant quelques semaines en mars et en octobre-novembre, où l'écart est de cinq heures parce que les États-Unis et l'UE changent d'heure des dimanches différents.

## À retenir

> [!TAKEAWAYS]
> - Les Bourses fonctionnent à l'heure locale ; vous devez convertir dans votre propre fuseau horaire.
> - L'UE change d'heure les derniers dimanches de mars et d'octobre ; les États-Unis le deuxième dimanche de mars et le premier dimanche de novembre.
> - Pendant quelques semaines par an, le NYSE ouvre à 14:30 au lieu de 15:30, heure de Vienne.
> - Beaucoup de pays asiatiques n'ont pas d'heure d'été ; leur décalage avec l'Europe change donc quand l'Europe change d'heure.
