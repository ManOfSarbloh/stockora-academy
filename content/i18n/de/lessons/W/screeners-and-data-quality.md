---
title: "Screener und Daten: nützlich, aber prüf die Zahlen"
summary: Aktien-Screener filtern Tausende Aktien in Sekunden nach Kriterien wie KGV oder Dividendenrendite. Aber die Daten dahinter können verzögert, unbereinigt, in der falschen Währung oder schlicht falsch sein. Wie Screener funktionieren und eine Checkliste für Daten, auf die du dich verlässt.
translatedFrom: 2026-10-14
---

## Was ein Screener macht

Ein **Screener** filtert eine Liste von Wertpapieren nach Kriterien, die du wählst, zum Beispiel:

- Marktkapitalisierung über 1 Mrd. €;
- KGV unter 15 (Kategorie I);
- Dividendenrendite über 3 % (Kategorie G);
- in Europa notiert, in einer bestimmten Branche (Kategorie C).

In Sekunden werden aus Tausenden Aktien eine kurze Liste. Das ist die Stärke eines Screeners: Er spart Zeit. Seine Schwäche: Er **kennt nur die Zahlen, die man ihm gibt**, und kann dir nicht sagen, warum eine Aktie den Filter passiert.

> [!EXAMPLE] Warum eine „billige“ Aktie billig ist (erfunden)
> Ein Filter auf KGV unter 8 und Dividendenrendite über 7 % liefert ein Unternehmen. Die Berichte zeigen, dass der Gewinn des letzten Jahres einen einmaligen Ertrag aus dem Verkauf einer Sparte enthielt und die Dividende daraus bezahlt wurde. Im nächsten Jahr dürften beide Zahlen sinken. Der Filter hat eine Zahl gefunden, kein Schnäppchen (Kategorie I, Warnsignale).

## Wo Daten schiefgehen

| Problem | Was passiert | Wie du es prüfst |
|---|---|---|
| **Verzögerung** | Kurse sind Minuten oder einen Tag alt | Achte auf einen Zeitstempel oder einen Hinweis „verzögert“ (Lektion 1) |
| **Unbereinigte Historie** | Ein Split sieht aus wie ein Absturz; Renditen stimmen nicht | Prüfe, ob Splits oder Dividenden bereinigt sind (Kategorien J und V) |
| **Währung** | Zahlen in Dollar mit Euro vermischt | Prüfe die Währung jeder Zahl |
| **Falsches Wertpapier** | Daten zu einer anderen Aktiengattung oder Notiz | Gleiche die **ISIN** ab (Kategorie A) |
| **Veraltete Fundamentaldaten** | Kennzahlen auf Basis alter Berichte | Prüfe das Datum des zuletzt verwendeten Berichts |
| **Unterschiedliche Definitionen** | „KGV“ mit berichtetem oder bereinigtem Gewinn | Lies, wie der Anbieter jede Zahl definiert (Kategorie I) |

## Survivorship Bias

Viele Datenbanken enthalten nur Unternehmen, die **heute existieren**. Testest du damit eine Strategie, verschwinden die Unternehmen, die gescheitert sind oder übernommen wurden, aus der Geschichte, und die Ergebnisse sehen besser aus, als sie wirklich waren (Kategorie J).

## Eine Checkliste für Zahlen, auf die du dich verlässt

1. **Quelle:** Woher stammt die Zahl ursprünglich (Lektion 2)?
2. **Datum:** Mit welchem Stand?
3. **Definition:** Wie wird sie berechnet?
4. **Währung und Einheiten:** Euro oder Dollar, Millionen oder Milliarden?
5. **Gegenprobe:** Zeigt der eigene Bericht des Unternehmens dieselbe Zahl?

> [!TIP] Der Geschäftsbericht ist die Referenz
> Der Einsteigerleitfaden der SEC erklärt, wie man Finanzberichte direkt liest. Wirkt eine Zahl im Screener überraschend, öffne den Bericht des Unternehmens und prüfe nach.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Screener filtern viele Aktien schnell, kennen aber nur die Zahlen, mit denen sie gefüttert werden.
> - Dass eine Aktie einen Filter passiert, ist ein Ausgangspunkt für Recherche, kein Ergebnis.
> - Prüfe Verzögerung, Bereinigungen, Währung, die richtige ISIN, das Datum der Daten und die Definitionen.
> - Datenbanken mit den heutigen Unternehmen können unter Survivorship Bias leiden.
> - Gleiche wichtige Zahlen mit den eigenen Berichten des Unternehmens ab.
