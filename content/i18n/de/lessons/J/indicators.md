---
title: "Indikatoren: gleitende Durchschnitte, RSI, MACD, Bollinger-Bänder und mehr"
summary: Was die gängigsten Indikatoren berechnen, wie sie üblicherweise gelesen werden und welche Grenzen eingebaut sind. Indikatoren werden aus dem Kurs abgeleitet; sie fügen keine neue Information hinzu.
translatedFrom: 2026-10-11
---

Ein **Indikator** ist eine Berechnung aus dem Kurs (und manchmal dem Volumen), die auf oder unter dem Chart gezeichnet wird. Zwei Familien:

- **Overlays** werden über den Kurs gezeichnet: gleitende Durchschnitte, Bollinger-Bänder, VWAP.
- **Oszillatoren** werden in einem eigenen Fenster gezeichnet und bewegen sich in einer festen Spanne oder um null: RSI, MACD.

![Simulierter Kurschart mit gleitenden Durchschnitten und Bollinger-Bändern, darunter RSI- und MACD-Fenster](../../../../lessons/J/img/indicators.svg)

> [!NOTE]
> Indikatoren werden **aus dem Kurs** berechnet. Sie können Muster leichter sichtbar machen, fügen aber keine neue Information über die Zukunft hinzu, und die meisten **hinken nach**: Sie reagieren, nachdem sich der Kurs bewegt hat.

## Gleitende Durchschnitte (SMA und EMA)

- **Einfacher gleitender Durchschnitt (SMA):** der durchschnittliche Schlusskurs der letzten *n* Perioden. Beispiel: Schlusskurse von 45,50, 45,25 und 46,10 ergeben einen 3-Perioden-SMA von 136,85 ÷ 3 = **45,62**.
- **Exponentieller gleitender Durchschnitt (EMA):** gewichtet jüngere Kurse stärker und reagiert deshalb schneller. Jeder neue Wert = Kurs × Multiplikator + vorheriger EMA × (1 − Multiplikator), mit Multiplikator = 2 ÷ (n + 1).
- **Übliche Längen:** 20, 50, 100 und 200 Perioden. Ein steigender Durchschnitt deutet auf einen Aufwärtstrend; das Kreuzen des Kurses mit seinem Durchschnitt beobachten viele Trader.
- **Golden Cross / Death Cross:** Kreuzt der 50-Tage-Durchschnitt den 200-Tage-Durchschnitt **nach oben**, spricht man gern von einem Golden Cross, **nach unten** von einem Death Cross. Beides passiert konstruktionsbedingt lange nach der Wende im Kurs.

## RSI (Relative-Stärke-Index)

- Vergleicht die durchschnittliche Größe der **Aufwärtsbewegungen** mit der durchschnittlichen Größe der **Abwärtsbewegungen** über einen Zeitraum (meist 14), auf einer Skala von **0 bis 100**.
- Übliche Marken: über **70** „überkauft“, unter **30** „überverkauft“.
- **Der Haken:** In einem starken Trend kann der RSI lange über 70 (oder unter 30) bleiben, während der Kurs weiterläuft. „Überkauft“ heißt nicht „wird gleich fallen“.
- **Divergenz:** Der Kurs macht ein neues Hoch, der RSI aber nicht. Trader lesen das als nachlassenden Schwung; es kann lange anhalten.

## MACD (Moving Average Convergence Divergence)

- **MACD-Linie:** der 12-Perioden-EMA minus der 26-Perioden-EMA.
- **Signallinie:** ein 9-Perioden-EMA der MACD-Linie.
- **Histogramm:** MACD-Linie minus Signallinie.
- Trader beobachten Kreuzungen von MACD- und Signallinie und das Kreuzen der Nulllinie durch die MACD-Linie. Weil er aus gleitenden Durchschnitten gebaut ist, hinkt auch der MACD nach.

## Bollinger-Bänder

Von John Bollinger entwickelt: ein 20-Perioden-Durchschnitt mit Bändern **zwei Standardabweichungen** darüber und darunter (die Standardeinstellungen). Die Bänder werden breiter, wenn die Kurse volatiler werden, und enger, wenn sie sich beruhigen. Ein enger „**Squeeze**“ zeigt ungewöhnlich geringe Volatilität; Trader achten darauf, ob sie wieder zunimmt, aber die Bänder sagen nicht, in welche Richtung.

## VWAP (volumengewichteter Durchschnittspreis)

Der Durchschnittspreis des Tages, gewichtet danach, wie viel zu jedem Preis gehandelt wurde: (Summe aus Preis × Volumen) ÷ (Gesamtvolumen). Er **beginnt jede Sitzung neu** und wird vor allem untertägig verwendet. Viele Marktteilnehmer nutzen VWAP-Ausführungsstrategien, die eine große Order nahe am VWAP des Tages kaufen oder verkaufen sollen.

## ATR (Average True Range)

Ein Maß für die **Volatilität**, nicht die Richtung: die durchschnittliche Größe der Spanne jeder Periode, einschließlich einer etwaigen Lücke zum vorigen Schluss. Eine Aktie mit einer ATR von 2 € bewegt sich typischerweise etwa 2 € am Tag. Trader nutzen sie zum Beispiel, um Stops in einem sinnvollen Abstand zu setzen.

## Fibonacci-Retracements

Linien bei **38,2 %, 50 % und 61,8 %** einer vorigen Bewegung, an denen manche Trader erwarten, dass ein Rücksetzer pausiert. Die Verhältnisse stammen aus der Fibonacci-Zahlenfolge (50 % wird aus Gewohnheit ergänzt). Fibonacci-Marken sind beliebt, aber **subjektiv**: Das Ergebnis hängt davon ab, welches Hoch und Tief du wählst, und bei mehreren nahe beieinanderliegenden Marken scheint meist eine davon zu „funktionieren“.

## Faustregeln

- **Mehr Indikatoren sind nicht besser.** Viele Indikatoren zeigen dieselbe Information auf verschiedene Weise; fünf übereinstimmende Indikatoren sind keine fünf unabhängigen Bestätigungen.
- **Standardwerte sind Konventionen,** keine Gesetze: 14 beim RSI oder 20 bei den Bollinger-Bändern sind Gewohnheiten, keine optimalen Werte.
- **Repainting:** Manche selbst gebauten Indikatoren ändern ihre vergangenen Werte, wenn neue Daten kommen, sie sehen also in der Vergangenheit perfekt aus, geben in Echtzeit aber andere Signale.

> [!MISTAKE] „Der RSI liegt über 70, also sollte ich verkaufen“
> Ein RSI über 70 sagt nur, dass die jüngsten Gewinne die jüngsten Verluste überwogen haben. In starken Aufwärtstrends kann er wochenlang dort bleiben. Ein Indikatorwert ist eine Beschreibung, keine Anweisung.

Schalte im [Chart-Labor](/charts/lab) jeden Indikator ein und aus und ändere seine Einstellungen.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Indikatoren werden aus dem Kurs (und Volumen) berechnet; sie fügen keine neue Information hinzu, und die meisten hinken nach.
> - Gleitende Durchschnitte glätten den Kurs; EMAs reagieren schneller als SMAs.
> - Der RSI und andere Oszillatoren können in starken Trends lange „überkauft“ oder „überverkauft“ bleiben.
> - Der MACD ist aus gleitenden Durchschnitten gebaut; Bollinger-Bänder und ATR messen Volatilität; der VWAP ist ein untertägiger Maßstab.
> - Fibonacci-Marken sind subjektiv; wenige, gut verstandene Indikatoren schlagen eine Indikatorflut.
