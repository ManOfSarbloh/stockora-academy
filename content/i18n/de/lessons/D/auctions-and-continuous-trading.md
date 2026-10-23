---
title: Auktionen und fortlaufender Handel
summary: Börsen kombinieren den fortlaufenden Handel während des Tages mit Auktionen zur Eröffnung, manchmal zu Mittag und zum Schluss. Auktionen sammeln Orders und finden einen einzigen Preis für alle.
translatedFrom: 2026-10-11
---

Es gibt zwei grundlegende Arten, wie eine Börse Orders zusammenführen kann: **fortlaufend**, ein Geschäft nach dem anderen, sobald Orders eintreffen, oder in einer **Auktion**, bei der Orders eine Zeit lang gesammelt und dann auf einmal zu einem einzigen Preis zusammengeführt werden. Die meisten Börsen mit liquiden Aktien nutzen beides.

## Fortlaufender Handel

Im fortlaufenden Handel wird jede eingehende Order sofort mit dem Orderbuch abgeglichen. Lässt sie sich zusammenführen, wird sie sofort gehandelt; sonst wartet sie im Buch. Kurse können sich mit jedem Geschäft ändern.

## Auktionen

Eine Auktion hat zwei Schritte:

1. **Aufrufphase:** Orders werden gesammelt. Teilnehmer können Orders eingeben, ändern oder löschen, aber noch wird nichts gehandelt. Meist wird ein *indikativer* Preis angezeigt, damit alle sehen, wo die Auktion gerade enden würde. An der Wiener Börse endet die Aufrufphase nach einer Mindestdauer zu einem zufälligen Zeitpunkt, was es schwerer macht, das Ergebnis zu manipulieren.
2. **Preisfeststellung:** Das System berechnet den einen Preis, zu dem die **größte Zahl an Aktien** gehandelt werden kann, und führt alle passenden Orders zu diesem Preis aus.

> [!EXAMPLE]
> In einer Eröffnungsauktion wurden diese Orders gesammelt:
>
> | Preis | Aktien, die Käufer zu diesem Preis kaufen würden | Aktien, die Verkäufer zu diesem Preis verkaufen würden |
> |---|---|---|
> | 20,20 € | 300 | 1.500 |
> | 20,10 € | 700 | 1.000 |
> | 20,00 € | 1.000 | 800 |
> | 19,90 € | 1.600 | 400 |
>
> Bei **20,00 €** wollen Käufer 1.000 und Verkäufer bieten 800, also können **800 Aktien** gehandelt werden. Bei 20,10 € könnten nur 700 gehandelt werden (begrenzt durch die Käufer), bei 19,90 € nur 400 (begrenzt durch die Verkäufer). Der Auktionspreis ist also **20,00 €**, und 800 Aktien wechseln zu diesem einen Preis den Besitzer.

> [!ANIMATION] opening-auction
> Dieselbe Auktion als Balken: zu jedem Preis, wie viel Käufer kaufen und Verkäufer verkaufen würden. Bei 20,00 € können die meisten Aktien gehandelt werden (800), also handeln alle zu 20,00 €.

## Warum Auktionen zur Eröffnung und zum Schluss eingesetzt werden

- **Eröffnungsauktion:** Über Nacht haben sich Nachrichten angesammelt. Zuerst Orders zu sammeln und einen fairen Eröffnungskurs zu finden, vermeidet einen chaotischen Start.
- **Schlussauktion:** Viele Anleger und Fonds wollen zum offiziellen **Schlusskurs** handeln, der auch zur Bewertung von Portfolios und zur Berechnung von Indizes dient. Eine Auktion bündelt ihre Orders zu einem robusten Preis.
- **Untertägige Auktion:** Manche Märkte fügen in der Mitte des Tages eine kurze Auktion ein, um Liquidität zu bündeln.

> [!AUSTRIA]
> An der Wiener Börse werden Aktien aus dem ATX an einem normalen Tag so gehandelt: **Eröffnungsauktion 08:55–09:00**, fortlaufender Handel **09:00–12:00**, untertägige Auktion **12:00–12:03**, fortlaufender Handel **12:03–17:30**, **Schlussauktion 17:30–17:35**, danach „Trade at Close“ bis 17:45, wo Orders zum Schlusskurs ausgeführt werden können. Weniger liquide Aktien werden vielleicht nur in Auktionen gehandelt.

> [!VERIFY]
> Handelszeiten und -phasen ändern sich von Zeit zu Zeit und unterscheiden sich je nach Segment. Prüfe die offizielle Handelszeiten-Seite der Börse, bevor du dich auf genaue Zeiten verlässt. Der Bereich Handelszeiten dieser Website zeigt live, ob eine Börse offen oder geschlossen ist.

> [!MISTAKE] „Meine Order um 08:56 wird sofort ausgeführt“
> In der Aufrufphase einer Auktion werden Orders nur gesammelt. Deine Order wird (wenn überhaupt) bei der Feststellung des Auktionspreises ausgeführt, zum Auktionspreis, nicht in dem Moment, in dem du sie abgeschickt hast.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Im fortlaufenden Handel werden Orders sofort beim Eintreffen zusammengeführt.
> - Auktionen sammeln Orders in einer Aufrufphase und handeln sie dann alle zu einem Preis.
> - Der Auktionspreis ist der, zu dem die meisten Aktien gehandelt werden können.
> - Eröffnungs- und Schlussauktionen schaffen faire, robuste Kurse zu Beginn und am Ende des Tages.
