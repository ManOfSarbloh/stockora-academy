---
title: Das Orderbuch und wie Orders zusammengeführt werden
summary: Jede Börse führt ein Orderbuch mit Kauf- und Verkaufsorders, sortiert nach Preis und Zeit. Wer es versteht, versteht Geld, Brief, Spread und wie Geschäfte zustande kommen.
translatedFrom: 2026-10-11
---

Im Zentrum jeder elektronischen Börse steht das **Orderbuch**: eine Liste aller Kauf- und Verkaufsorders, die auf ihre Ausführung warten. Die Wiener Börse nennt es das Herz der Computerbörse.

## Geld und Brief

- **Geld** (englisch: bid) ist eine Order zum **Kaufen**: „Ich zahle bis zu diesem Preis.“
- **Brief** (englisch: ask oder offer) ist eine Order zum **Verkaufen**: „Ich verkaufe für mindestens diesen Preis.“

Das höchste Kaufgebot ist der **beste Geldkurs**; das niedrigste Verkaufsangebot der **beste Briefkurs**. Die Differenz dazwischen ist der **Spread**.

![Orderbuch: Verkäufer zu 10,04 € (300 Aktien), 10,03 € (500), 10,02 € (200); Käufer zu 10,00 € (400), 9,99 € (600), 9,98 € (1.000). Der Spread zwischen dem besten Geldkurs 10,00 € und dem besten Briefkurs 10,02 € beträgt 0,02 €](../../../../lessons/D/order-book.svg)

## Preis-Zeit-Priorität

Die Orders im Buch werden nach zwei Regeln sortiert:

1. **Zuerst der Preis:** Der beste Preis kommt zuerst. Für Käufer ist das das höchste Gebot, für Verkäufer das niedrigste Angebot.
2. **Dann die Zeit:** Unter Orders mit demselben Preis kommt die zuerst eingegangene zuerst.

Das nennt man **Preis-Zeit-Priorität**. Sie belohnt, wer den besten Preis bietet, und bei gleichem Preis, wer zuerst da war.

## Wie ein Geschäft zustande kommt

Solange der beste Geldkurs unter dem besten Briefkurs liegt, passiert nichts: Käufer und Verkäufer sind sich nicht einig. Ein Geschäft kommt zustande, wenn eine neue Order den Spread **überbrückt**.

> [!EXAMPLE]
> Das Buch sieht aus wie im Bild oben: bester Geldkurs 10,00 €, bester Briefkurs 10,02 €.
>
> Du schickst eine **Kauforder über 300 Aktien zu höchstens 10,03 €**. Die Matching Engine:
>
> 1. Nimmt zuerst das günstigste Angebot: **200 Aktien zu 10,02 €**.
> 2. Dann das nächste: **100 Aktien zu 10,03 €** (von den 500, die dort angeboten werden).
>
> Du hast 300 Aktien um 200 × 10,02 € + 100 × 10,03 € = 2.004 € + 1.003 € = **3.007 €** gekauft, im Schnitt etwa 10,023 € je Aktie. Im Buch stehen jetzt noch 400 Aktien zu 10,03 €, und der letzte Kurs ist 10,03 €.

Eine große Order „läuft“ also durch mehrere Preisstufen, deshalb können große Orders den Kurs bewegen.

## Was der Spread verrät

- Ein **enger Spread** (z. B. 10,00 € / 10,01 €) bedeutet meist viele aktive Käufer und Verkäufer: Die Aktie ist **liquide**.
- Ein **weiter Spread** (z. B. 4,80 € / 5,20 €) bedeutet wenige Teilnehmer: Handeln ist teurer, weil man beim sofortigen Kauf zum Brief- und Verkauf zum Geldkurs den Spread verliert.

> [!EXAMPLE]
> Geld 4,80 €, Brief 5,20 €. Kaufst du 100 Aktien zu 5,20 € und verkaufst sie sofort zu 4,80 €, verlierst du 100 × 0,40 € = **40 €**, vor allen Gebühren. Das sind die Kosten des Spreads.

> [!MISTAKE] „Der angezeigte Kurs ist der Preis, den ich bekomme“
> Der „letzte Kurs“ ist der Preis des letzten Geschäfts. Kaufst du jetzt, zahlst du meist den aktuellen **Briefkurs**; verkaufst du, bekommst du den aktuellen **Geldkurs**. Und eine große Order wird vielleicht nur teilweise zum besten Preis ausgeführt.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Das Orderbuch sammelt alle wartenden Kauforders (Geld) und Verkaufsorders (Brief).
> - Orders werden nach Preis-Zeit-Priorität sortiert: bester Preis zuerst, dann die früheste.
> - Ein Geschäft kommt zustande, wenn eine Order den Spread überbrückt; große Orders können mehrere Preisstufen nehmen.
> - Der Spread ist ein Kostenfaktor des Handels; enge Spreads bedeuten meist eine liquide Aktie.
