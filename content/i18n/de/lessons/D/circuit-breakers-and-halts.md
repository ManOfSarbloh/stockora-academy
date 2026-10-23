---
title: Circuit Breaker, Volatilitätsunterbrechungen und Handelsaussetzungen
summary: Bewegen sich Kurse zu weit, zu schnell, unterbrechen Börsen den Handel, damit alle durchatmen können. So machen es Wien und die USA.
translatedFrom: 2026-10-11
---

Manchmal bewegen sich Kurse heftig: nach schockierenden Nachrichten, einer Fehlorder oder in Panik. Börsen haben eingebaute „Bremsen“, die den Handel unterbrechen, wenn sich Kurse zu weit, zu schnell bewegen. Die Idee ist nicht, Kurse am Fallen zu hindern, sondern allen Zeit zu geben, Informationen zu verarbeiten und genug Orders für einen fairen Preis zu sammeln.

## Volatilitätsunterbrechungen in Wien

Die Wiener Börse prüft jeden möglichen Kurs gegen zwei **Preiskorridore**:

- einen **dynamischen Korridor** um den letzten Handelskurs und
- einen **statischen Korridor** um den letzten Auktionskurs.

Läge der nächste Kurs **außerhalb** eines Korridors, wird er nicht ausgeführt. Stattdessen wechselt der Handel in eine kurze **Auktion** (eine Volatilitätsunterbrechung), im fortlaufenden Handel zum Beispiel **2 Minuten**, damit Orders gesammelt und der Kurs geordnet festgestellt werden kann. Die Korridore werden für jedes Wertpapier einzeln festgelegt, abhängig von Faktoren wie Art, Liquidität und Volatilität, und mindestens monatlich überprüft.

> [!EXAMPLE]
> Eine Aktie wurde zuletzt bei **30,00 €** gehandelt, und ihr dynamischer Korridor beträgt ±2 % (29,40 € bis 30,60 €). Eine große Verkaufsorder kommt, die zu **28,90 €** handeln würde.
>
> Statt zu 28,90 € zu handeln, startet das System eine kurze Auktion. Käufer, die den Einbruch sehen, können Orders eingeben; die Auktion findet dann einen Preis. Der liegt vielleicht bei 29,20 € oder tiefer, wenn es wirklich keine Käufer gibt, aber er wird kontrolliert gefunden, statt dass eine einzige Order durch ein leeres Buch fegt.

## Circuit Breaker in den USA

Die USA haben zwei Schutzebenen:

**1. Marktweite Circuit Breaker**, ausgelöst durch einen Rückgang des S&P-500-Index an einem Tag:

| Stufe | Rückgang des S&P 500 | Was passiert |
|---|---|---|
| Stufe 1 | 7 % | 15 Minuten Pause für den gesamten Handel, wenn es vor 15:25 Uhr New Yorker Zeit passiert |
| Stufe 2 | 13 % | Weitere 15 Minuten Pause, wenn vor 15:25 Uhr |
| Stufe 3 | 20 % | Handel für den Rest des Tages ausgesetzt |

**2. Limit Up–Limit Down (LULD)** für einzelne Aktien: Jede Aktie hat Preisbänder; bewegt sie sich aus ihrem Band und kommt nicht schnell zurück, pausiert der Handel in dieser Aktie für einige Minuten.

## Handelsunterbrechungen und -aussetzungen

Neben diesen automatischen Mechanismen kann der Handel in einer einzelnen Aktie auch **unterbrochen oder ausgesetzt** werden, etwa wenn eine wichtige Nachricht bevorsteht und der Markt Zeit braucht, sie aufzunehmen. Deine Orders bleiben dann vielleicht unausgeführt, bis der Handel wieder beginnt.

> [!MISTAKE] „Ein Circuit Breaker schützt mich vor Verlusten“
> Er unterbricht nur den Handel. Geht der Handel weiter, kann der Kurs trotzdem viel tiefer liegen. Circuit Breaker sollen geordnete Märkte sichern, nicht Kurse am Fallen hindern.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Börsen unterbrechen den Handel, wenn sich Kurse zu weit, zu schnell bewegen.
> - In Wien lösen Kurse außerhalb eines dynamischen oder statischen Korridors eine kurze Auktion aus (Volatilitätsunterbrechung).
> - In den USA lösen marktweite Circuit Breaker bei Rückgängen des S&P 500 um 7 %, 13 % und 20 % aus; LULD pausiert einzelne Aktien.
> - Pausen helfen, Kurse geordnet zu bilden; sie verhindern keine Verluste.
