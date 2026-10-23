---
title: "Stop-, Stop-Limit- und Trailing-Stop-Orders"
summary: Stop-Orders warten im Hintergrund und werden erst aktiv, wenn ein Kurs erreicht wird. Sie dienen oft dazu, Verluste zu begrenzen, sind aber keine Garantie.
translatedFrom: 2026-10-11
---

Eine **Stop-Order** ist eine Order, die schläft, bis der Kurs eine von dir gewählte Marke erreicht, den **Stoppkurs**. Dann wacht sie auf und wird zu einer gewöhnlichen Order. Stop-Orders werden oft genutzt, um Verluste zu begrenzen, deshalb heißen sie auch **Stop-Loss-Orders**.

## Stop-Order (Stop-Loss)

- Ein **Verkaufs-Stop** liegt **unter** dem aktuellen Kurs. Fällt der Kurs auf den Stoppkurs, wird er zu einer **Market Order** zum Verkauf.
- Ein **Kauf-Stop** liegt **über** dem aktuellen Kurs, zum Beispiel um Verluste bei einer Leerverkaufsposition zu begrenzen.

> [!EXAMPLE]
> Du besitzt Aktien zu **40 €** und legst einen **Verkaufs-Stop bei 36 €**.
>
> - Fällt der Kurs auf 36 €, löst dein Stop aus, und eine Market Order zum Verkauf wird geschickt. Du verkaufst vielleicht zu 35,95 € oder tiefer, wenn die Kurse schnell fallen.
> - Erreicht der Kurs nie 36 €, passiert nichts.

**Wichtig:** Der Stoppkurs ist ein Auslöser, kein garantierter Verkaufspreis. Eröffnet der Markt weit unter deinem Stop (eine **Kurslücke**), wird deine Market Order zum viel niedrigeren Kurs ausgeführt.

> [!EXAMPLE]
> Dein Verkaufs-Stop liegt bei 36 €. Über Nacht meldet das Unternehmen schlechte Nachrichten. Am nächsten Morgen eröffnet die Aktie bei **30 €**. Dein Stop löst aus, und du verkaufst bei etwa 30 €, nicht bei 36 €.

## Stop-Limit-Order

Eine **Stop-Limit-Order** hat zwei Preise: einen Stoppkurs, der sie aktiviert, und einen Limitkurs. Bei Auslösung wird sie zu einer **Limit-Order**. Das schützt dich davor, weit unter deinem Limit zu verkaufen, heißt aber, dass die Order **vielleicht gar nicht ausgeführt wird**, wenn der Kurs am Limit vorbeifällt.

> [!EXAMPLE]
> Verkaufs-Stop-Limit: Stop **36 €**, Limit **35 €**. Fällt der Kurs auf 36 €, wird eine Verkaufs-Limit-Order zu 35 € aufgegeben. Springt der Kurs auf 30 €, wird deine Order nicht ausgeführt, und du hältst die Aktien weiter, während sie weiter fallen.

## Trailing-Stop-Order

Ein **Trailing Stop** setzt den Stoppkurs mit einem festen Betrag oder Prozentsatz **unter den höchsten Kurs**, der seit Aufgabe der Order erreicht wurde. Steigt der Kurs, wandert der Stop mit nach oben; fällt der Kurs, bleibt er, wo er ist.

> [!EXAMPLE]
> Du kaufst zu **20 €** und setzt einen Trailing Stop von **1 €**. Die Aktie steigt auf **24 €**, also wandert der Stop auf **23 €**. Dann fällt der Kurs zurück: Bei 23 € löst der Stop aus, und eine Verkaufsorder wird geschickt.

## Was du prüfen solltest

Laut SEC bietet nicht jeder Broker all diese Orderarten an, und Broker können sich darin unterscheiden, was einen Stop auslöst (das letzte Geschäft oder die aktuellen Kursangebote). Kurzfristige Kursschwankungen können außerdem einen Stop auslösen und deine Aktien verkaufen, kurz bevor sich der Kurs erholt.

> [!MISTAKE] „Ein Stop-Loss garantiert, dass ich nicht mehr als 10 % verliere“
> Ein Stop-Loss begrenzt Verluste nur, wenn der Markt geordnet durch deinen Stoppkurs handelt. Kurslücken, schnelle Märkte und illiquide Aktien können zu Verkäufen weit unter deinem Stop führen, und eine Stop-Limit-Order wird vielleicht gar nicht ausgeführt.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Eine Stop-Order wird bei Erreichen des Stoppkurses zur Market Order; eine Stop-Limit-Order wird zur Limit-Order.
> - Der Stoppkurs ist ein Auslöser, kein garantierter Ausführungspreis; Kurslücken können zu viel schlechteren Preisen führen.
> - Stop-Limit-Orders schützen den Preis, werden aber vielleicht gar nicht ausgeführt.
> - Trailing Stops wandern mit dem Kurs nach oben, aber nie nach unten.
