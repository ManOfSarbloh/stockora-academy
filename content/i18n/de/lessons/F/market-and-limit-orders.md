---
title: Market Orders und Limit-Orders
summary: Die zwei grundlegenden Orderarten. Eine Market Order garantiert die Ausführung, aber nicht den Preis; eine Limit-Order garantiert den Preis (oder besser), aber nicht die Ausführung.
translatedFrom: 2026-10-11
---

Wenn du eine Aktie kaufst oder verkaufst, sagst du nicht einfach „kaufen“. Du wählst eine **Orderart**, die dem Markt sagt, wie deine Order ausgeführt werden soll. Die zwei wichtigsten sind die **Market Order** (Bestens- bzw. Billigst-Order) und die **Limit-Order**.

## Market Order

Eine **Market Order** sagt: „Kaufe (oder verkaufe) jetzt, zum besten derzeit verfügbaren Preis.“

- **Die Ausführung ist (fast) garantiert**, solange es Verkäufer oder Käufer gibt.
- **Der Preis ist nicht garantiert.** Eine Kauf-Market-Order wird meist rund um den aktuellen **Briefkurs** ausgeführt, eine Verkaufs-Market-Order rund um den aktuellen **Geldkurs**, aber der Preis, den du bekommst, kann vom zuletzt gesehenen Kurs abweichen, vor allem wenn sich Kurse schnell bewegen oder das Orderbuch dünn ist.

Die Differenz zwischen dem erwarteten und dem tatsächlich erzielten Preis heißt **Slippage**.

> [!EXAMPLE]
> Du siehst einen letzten Kurs von **20,00 €** und schickst eine Market Order zum Kauf von **500 Aktien**. Im Orderbuch werden 200 Aktien zu 20,02 € und 300 zu 20,10 € angeboten.
>
> Du kaufst 200 × 20,02 € + 300 × 20,10 € = 4.004 € + 6.030 € = **10.034 €**, im Schnitt etwa **20,07 €** je Aktie, nicht 20,00 €. Die Slippage hat dich etwa 34 € gekostet.

> [!ANIMATION] market-order-fill
> Eine Market Order über 500 Aktien nimmt die 200 Aktien zu 20,02 €, dann die 300 zu 20,10 €: insgesamt 10.034 €, etwa 20,07 € je Aktie statt 20,00 €.

## Limit-Order

Eine **Limit-Order** sagt: „Kaufe zu diesem Preis **oder günstiger**“ (oder „verkaufe zu diesem Preis **oder teurer**“).

- **Der Preis ist geschützt:** Ein Kauflimit bei 50 € kann nur zu 50 € oder darunter ausgeführt werden.
- **Die Ausführung ist nicht garantiert:** Erreicht der Markt dein Limit nie, passiert nichts.

> [!EXAMPLE]
> Eine Aktie notiert bei **52 €**. Du gibst eine **Kauf-Limit-Order zu 50 €** auf.
>
> - Fällt der Kurs auf 50 € oder darunter und gibt es Verkäufer, wird deine Order zu 50 € oder weniger ausgeführt.
> - Fällt der Kurs nie so weit, bleibt deine Order unausgeführt, und du „verpasst“ vielleicht einen Anstieg auf 60 €.

> [!ANIMATION] limit-order
> Dasselbe Kauflimit bei 50 €, zwei mögliche Verläufe: Der Kurs fällt auf dein Limit, und die Order wird ausgeführt, oder er kommt nie dorthin, und die Order wartet, während der Kurs auf 60 € steigt.

## Teilausführungen

Orders können **teilweise ausgeführt** werden: Willst du 1.000 Aktien mit einem Limit von 50 €, aber zu diesem Preis werden nur 300 angeboten, kaufst du vielleicht jetzt 300 und die restlichen 700 später oder nie. Manche Broker verlangen für jede Teilausführung eine Gebühr, prüfe also deine Preisliste.

## Welche nehmen?

| | Market Order | Limit-Order |
|---|---|---|
| Garantiert die Ausführung? | Meist ja | Nein |
| Garantiert den Preis? | Nein | Ja (Limit oder besser) |
| Gut für | Sehr liquide Aktien, kleine Orders, wenn es schnell gehen muss | Weniger liquide Aktien, größere Orders, unruhige Momente, außerhalb der regulären Zeiten |

> [!MISTAKE] „Eine Market Order wird zum Kurs auf meinem Bildschirm ausgeführt“
> Der Kurs auf deinem Bildschirm ist das letzte Geschäft. Eine Market Order wird zum besten Preis ausgeführt, der verfügbar ist, wenn sie den Markt erreicht, und der kann spürbar abweichen, vor allem bei der Eröffnung, in dünnen Märkten oder wenn Nachrichten kommen.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Market Orders garantieren die Ausführung, nicht den Preis; Limit-Orders garantieren den Preis, nicht die Ausführung.
> - Slippage ist die Lücke zwischen dem erwarteten und dem erzielten Preis.
> - Große Orders können zu mehreren Preisen oder nur teilweise ausgeführt werden.
> - Limit-Orders schützen dich in illiquiden oder schnellen Märkten.
