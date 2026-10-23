---
title: "Hebel und Margin: wie geliehenes Geld Ergebnisse vervielfacht"
summary: Mit Hebel kontrolliert ein kleiner Geldbetrag eine große Position. Er vervielfacht Gewinne und Verluste gleichermaßen, und Nachschussforderungen können dich im schlechtesten Moment hinausdrängen. Die Mathematik, Schritt für Schritt.
translatedFrom: 2026-10-11
---

**Hebel** (Leverage) heißt, mit geliehenem Geld oder einem Derivat eine Position zu kontrollieren, die größer ist als dein eigenes Geld. Ein Hebel von 5:1 bedeutet, dass 1.000 € eigenes Geld eine Position von 5.000 € kontrollieren.

## Gewinne und Verluste werden vervielfacht

> [!EXAMPLE] Dieselbe Bewegung um 10 %, mit und ohne Hebel
> Du hast **1.000 €**.
>
> | | Ohne Hebel | Hebel 5:1 |
> |---|---:|---:|
> | Positionsgröße | 1.000 € | 5.000 € |
> | Kurs **+10 %** | +100 € (+10 %) | +500 € (**+50 %**) |
> | Kurs **−10 %** | −100 € (−10 %) | −500 € (**−50 %**) |
> | Kurs **−20 %** | −200 € (−20 %) | −1.000 € (**−100 %**) |
>
> Mit Hebel 5:1 löscht ein Rückgang um 20 % deinen ganzen Einsatz aus. Mit 20:1 reicht ein Rückgang um 5 %.

Die Regel: **% Veränderung deines Geldes ≈ % Veränderung des Kurses × Hebel** (vor Kosten).

![Balkenpaare: Mit Hebel 5:1 verliert ein Kursrückgang um 20 % 100 % deiner 1.000 €, ein Rückgang um 10 % verliert 50 % und ein Anstieg um 10 % gewinnt 50 %, das Fünffache des Ergebnisses ohne Hebel](../../../../lessons/N/img/leverage-5-to-1.svg)

Dazu kostet geliehenes Geld **Zinsen**, die anfallen, ob der Trade gewinnt oder verliert.

## Kauf auf Margin

Investor.gov beschreibt ein **Margin-Konto** als Depot, bei dem dir der Broker Geld leiht, mit deinem Konto als Sicherheit, um Wertpapiere zu kaufen. Es erhöht deine Kaufkraft, setzt dich aber auch **größeren Verlusten** aus.

### Die Nachschussforderung

Fallen die Kurse, warnt Investor.gov, dass dein Broker verlangen kann, dass du **sofort** mehr Geld oder Wertpapiere einzahlst, oder **deine Wertpapiere verkaufen kann, ohne dich vorher zu informieren**. Der Broker entscheidet, welche Wertpapiere er verkauft. Selbst wenn er sagt, du hättest ein paar Tage Zeit, kann er schon vorher verkaufen.

> [!EXAMPLE] Am Tief hinausgedrängt
> Du kaufst Aktien um 10.000 € mit 5.000 € eigenem Geld und einem Kredit von 5.000 €. Dein Broker verlangt, dass dein Eigenkapital mindestens 30 % der Position beträgt.
> - Die Aktien fallen um 30 % auf 7.000 €. Dein Eigenkapital beträgt 7.000 − 5.000 = 2.000 €, nur **29 %** der Position.
> - Nachschussforderung: Geld einzahlen, oder der Broker verkauft. Verkauft er bei 7.000 €, bleiben dir **2.000 €**: 60 % Verlust auf dein eigenes Geld bei einem Rückgang um 30 %.
> - Erholen sich die Aktien später, gehören sie dir nicht mehr.

> [!ANIMATION] margin-call
> Ein Rückgang um 30 % lässt dein Eigenkapital von 5.000 € auf 2.000 € fallen, also 29 % der Position, unter das Minimum des Brokers von 30 %: eine Nachschussforderung.

## Margin bei Derivaten

Bei Futures und anderen Derivaten ist die **Margin** die Sicherheit, die du hinterlegst. Das Börsenlexikon der Wiener Börse unterscheidet die **Initial Margin** (Einschuss), die man zur Eröffnung einer Futures-Position hinterlegt, und die **Variation Margin**, die Gewinne und Verluste **täglich** ausgleicht. Eine Verlustposition verlangt jeden Tag frisches Geld, was dich zwingen kann, sie zu schließen.

## Hebel in der Geschichte

Federal Reserve History beschreibt, wie Aktienkäufer in den 1920er-Jahren typischerweise etwa 10 % des Preises selbst zahlten und den Rest liehen. Als die Kurse 1929 fielen, machte das geliehene Geld aus einem Rückgang einen Zusammenbruch (Kategorie K).

> [!WARNING] Hebel nimmt dir die Zeit
> Ein Anleger ohne Hebel in einem breiten Index kann auf eine Erholung warten. Ein Anleger mit Hebel wird vielleicht gezwungen zu verkaufen, bevor sie kommt. Dieser Unterschied macht aus vorübergehenden Rückgängen dauerhafte Verluste.

> [!MISTAKE] „Ich setze einen Stop-Loss, also kann ich nicht mehr verlieren als geplant“
> In schnellen Märkten können Kurse über eine Stopp-Marke springen, vor allem über Nacht oder bei der Eröffnung (Kurslücken, Kategorie J). Mit Hebel kann eine Lücke mehr kosten als geplant, und bei manchen Produkten mehr, als du investiert hast.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Hebel vervielfacht Gewinne und Verluste: % Ergebnis ≈ % Kursbewegung × Hebel.
> - Bei 5:1 löscht ein Rückgang um 20 % den ganzen Einsatz aus.
> - Investor.gov: Bei einer Nachschussforderung kann ein Broker deine Wertpapiere ohne Vorwarnung verkaufen.
> - Bei Futures kann die tägliche Variation Margin jeden Tag neues Geld verlangen.
> - Hebel kann dich zwingen, vor einer Erholung zu verkaufen.
