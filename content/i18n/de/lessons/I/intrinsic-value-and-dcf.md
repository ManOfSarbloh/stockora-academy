---
title: "Innerer Wert und Discounted Cashflow (DCF)"
summary: Ein Unternehmen ist das Geld wert, das es künftig erwirtschaften kann, abgezinst auf heute. Geh ein einfaches DCF Schritt für Schritt durch, sieh, wie empfindlich es auf Annahmen reagiert, und lerne die Idee der Sicherheitsmarge.
translatedFrom: 2026-10-11
---

Kennzahlen (Lektion 7) vergleichen ein Unternehmen mit anderen Unternehmen. Die **innere Bewertung** stellt eine grundlegendere Frage: *Was ist dieses Geschäft für sich wert, gemessen an dem Geld, das es erwirtschaften wird?*

Das *Owner's Manual* von Berkshire Hathaway gibt eine einfache Definition: Der innere Wert ist **der abgezinste Wert des Geldes, das während der verbleibenden Lebensdauer aus einem Unternehmen entnommen werden kann**. Es fügt gleich hinzu, dass die Berechnung nicht einfach ist und der innere Wert eine **Schätzung statt einer genauen Zahl** ist, die sich ändern muss, wenn sich Zinsen oder Cashflow-Prognosen ändern.

Dieselbe Idee taucht in der Rechnungslegung auf: Wenn die IFRS (IAS 36) Vermögenswerte auf Wertminderung prüfen, ist ein Maßstab der „Nutzungswert“, die erwarteten künftigen Cashflows **auf den Barwert abgezinst**.

## Schritt 1: Geld heute ist mehr wert als Geld später

100 € heute können investiert werden und wachsen. Also sind 100 €, die du in einem Jahr bekommst, **weniger** wert als 100 € heute. Wie viel weniger, hängt von der Rendite ab, die du verlangst, dem **Abzinsungssatz** (Diskontierungszins).

**Barwert = künftiges Geld ÷ (1 + Abzinsungssatz)^Jahre**

> [!EXAMPLE] Eine Zahlung abzinsen
> 100 € in einem Jahr, Abzinsungssatz 8 %: 100 ÷ 1,08 = **92,59 €** heute.
> 100 € in zwei Jahren: 100 ÷ 1,08² = **85,73 €** heute.

Das ist der Zinseszins (Kategorie G) rückwärts.

## Schritt 2: ein einfaches DCF, Schritt für Schritt

Ein **Discounted-Cashflow-Modell (DCF)** prognostiziert das Geld, das ein Unternehmen erwirtschaften wird, und zinst dann jedes Jahr auf heute ab. Hier ist ein vereinfachtes Beispiel je Aktie für ein erfundenes Unternehmen. Jede Eingabe ist eine **Annahme**:

- Free Cashflow je Aktie im nächsten Jahr: **1,20 €**
- Wachstum in den nächsten fünf Jahren: **5 %** pro Jahr
- Wachstum danach, für immer: **2 %** pro Jahr
- Abzinsungssatz (die Rendite, die ein Anleger verlangt): **9 %**

**Jahre 1–5:**

| Jahr | Cashflow (€) | Abzinsungsfaktor | Barwert (€) |
|---:|---:|---:|---:|
| 1 | 1,20 | ÷ 1,09 | 1,10 |
| 2 | 1,26 | ÷ 1,09² | 1,06 |
| 3 | 1,32 | ÷ 1,09³ | 1,02 |
| 4 | 1,39 | ÷ 1,09⁴ | 0,98 |
| 5 | 1,46 | ÷ 1,09⁵ | 0,95 |
| | | **Summe** | **≈ 5,12** |

(Die Zeilen sind gerundet, also ergibt die Summe nicht genau.)

**Nach Jahr 5: der Endwert.** Niemand kann jedes Jahr bis in alle Ewigkeit prognostizieren, also unterstellt das Modell nach Jahr 5 ein gleichmäßiges Wachstum und verwendet die Formel für eine wachsende ewige Rente:

**Endwert = Cashflow in Jahr 6 ÷ (Abzinsungssatz − langfristiges Wachstum)**

> [!EXAMPLE] Endwert
> Cashflow in Jahr 6 = 1,46 × 1,02 ≈ 1,49 €.
> Endwert am Ende von Jahr 5 = 1,49 ÷ (0,09 − 0,02) ≈ **21,25 €**.
> Auf heute abgezinst: 21,25 ÷ 1,09⁵ ≈ **13,81 €**.

**Summe:** 5,12 + 13,81 ≈ **18,93 € je Aktie**.

Beachte, dass etwa **73 %** des Werts aus dem Endwert stammen: aus Cashflows, die mehr als fünf Jahre entfernt liegen und auf den gröbsten Annahmen beruhen.

## Schritt 3: Wie empfindlich ist das Ergebnis?

Ändere nur den Abzinsungssatz und das langfristige Wachstum und sieh, was passiert:

| Abzinsungssatz ↓ / langfristiges Wachstum → | 1 % | 2 % | 3 % |
|---|---:|---:|---:|
| **8 %** | 19,58 € | 22,13 € | 25,71 € |
| **9 %** | 17,08 € | 18,93 € | 21,39 € |
| **10 %** | 15,14 € | 16,53 € | 18,31 € |

Kleine Änderungen um einen Prozentpunkt bewegen den „Wert“ von etwa 15 € auf fast 26 €. Ein DCF ist keine Messung. Es ist eine strukturierte Art, deine Annahmen sichtbar zu machen.

> [!WARNING] Müll rein, Müll raus
> Ein DCF lässt sich so einstellen, dass fast jede Zahl herauskommt. Sei am skeptischsten bei Modellen, die viele Jahre hohes Wachstum unterstellen, ein langfristiges Wachstum über dem langfristigen Wachstum der Wirtschaft oder einen Abzinsungssatz, der für das Risiko niedrig wirkt.

## Umgekehrtes DCF: Was nimmt der Markt an?

Statt einen Wert zu schätzen, kannst du fragen, welche Annahmen der **aktuelle Kurs** unterstellt. Mit dem einfachsten Modell, einer einzigen wachsenden ewigen Rente:

**Kurs = Cashflow im nächsten Jahr ÷ (Abzinsungssatz − Wachstum)**, also **Wachstum = Abzinsungssatz − Cashflow ÷ Kurs**

> [!EXAMPLE] Was ein Kurs von 24 € unterstellt
> Cashflow im nächsten Jahr 1,20 €, verlangte Rendite 9 %, Kurs 24 €:
> Unterstelltes Wachstum = 9 % − 1,20 ÷ 24 = 9 % − 5 % = **4 % pro Jahr, für immer**.
>
> Die Frage lautet dann: Sind 4 % Wachstum für immer für dieses Geschäft realistisch? Darüber lässt sich leichter diskutieren als über einen abstrakten „fairen Wert“.

## Die Sicherheitsmarge

Weil der innere Wert nur eine Schätzung ist, bauen vorsichtige Anleger einen Puffer ein. In seinem Brief von 1992 schrieb Warren Buffett, dass Berkshire beim Kaufpreis auf einer **Sicherheitsmarge** besteht: Liegt der berechnete Wert einer Aktie nur leicht über ihrem Kurs, sind sie nicht interessiert. Er nennt dieses Prinzip, das Benjamin Graham stark betont hat, den Eckstein des Anlageerfolgs.

> [!EXAMPLE] Eine Sicherheitsmarge in Zahlen
> Geschätzter Wert 18,93 €. Wer eine Sicherheitsmarge von 25 % verlangt, würde nur Kurse bei oder unter 18,93 × 0,75 ≈ **14,20 €** in Betracht ziehen.

Das ist eine Denkweise über Schätzfehler, keine Empfehlung, irgendetwas zu irgendeinem Preis zu kaufen.

## Woher der Abzinsungssatz kommt

Profis leiten ihn meist aus den Zinsen plus einem Aufschlag für das Risiko von Aktien (der **Aktienrisikoprämie**) und dem besonderen Risiko des Unternehmens ab. Aswath Damodaran an der NYU Stern veröffentlicht regelmäßig aktualisierte Schätzungen solcher Eingaben, darunter implizite Aktienrisikoprämien. Zum Lernen ist der Kernpunkt einfacher: **Je höher das Risiko, desto höher der Abzinsungssatz und desto niedriger der Wert heute.** Steigende Zinsen treiben auch die Abzinsungssätze nach oben, ein Grund, warum Aktienkurse, vor allem von Unternehmen, deren Cashflows weit in der Zukunft liegen, oft fallen, wenn die Zinsen steigen.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Innerer Wert = der abgezinste Wert des Geldes, das ein Unternehmen über seine Lebensdauer erwirtschaften kann; er ist immer eine Schätzung.
> - Barwert = künftiges Geld ÷ (1 + Abzinsungssatz)^Jahre.
> - Ein einfaches DCF: ein paar Jahre prognostizieren, einen Endwert dazurechnen, alles auf heute abzinsen.
> - Der Endwert dominiert oft, und kleine Änderungen der Annahmen bewegen das Ergebnis stark.
> - Ein umgekehrtes DCF zeigt, welches Wachstum der aktuelle Kurs unterstellt; eine Sicherheitsmarge berücksichtigt Fehler.
