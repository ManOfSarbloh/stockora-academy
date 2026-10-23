---
title: "Wie eine Chart-Plattform wie TradingView funktioniert"
summary: "Ein neutraler Rundgang durch eine typische Chart-Plattform, mit TradingView als bekanntem Beispiel: Symbole, Einstellungen, Indikatoren, Zeichenwerkzeuge, Alarme, Replay, Screener, Papierhandel, Skripte, Community-Ideen und die Risiken."
translatedFrom: 2026-10-11
---

Chart-Plattformen sehen alle etwas anders aus, haben aber dieselben Bausteine. Wir nehmen **TradingView** als Beispiel, weil es weithin bekannt ist. Dieselben Konzepte gelten für die Charts in der App deines Brokers oder auf jeder anderen Plattform.

> [!NOTE] Neutrale Beschreibung, keine Empfehlung
> Die Stockora Academy hat keine Verbindung zu TradingView oder einer anderen Plattform, nutzt keine Affiliate-Links und empfiehlt keine Plattform und keinen Tarif. Funktionen und Preise ändern sich: Prüfe den aktuellen Stand auf der [offiziellen Website](https://www.tradingview.com/). Die Abbildung unten ist unsere eigene Skizze, kein Screenshot.

## Was es ist

TradingView ist eine webbasierte Plattform für Charts und Marktanalyse, mit Apps für Handy und Computer. Sie umfasst Aktien, Indizes, Währungen, Kryptowerte und Futures und hat eine soziale Seite, auf der Nutzer ihre Chartanalysen („Ideen“) veröffentlichen.

## Die Oberfläche

![Skizze einer typischen Chart-Plattform: obere Werkzeugleiste, Zeichenwerkzeuge links, Chart und Volumen in der Mitte, Fenster rechts und unten](../../../../lessons/J/img/platform-layout.svg)

- **Obere Werkzeugleiste:** Symbolsuche, Auswahl der Zeiteinheit, Charttyp, Indikatoren, Alarme, Replay, Layouts.
- **Linke Werkzeugleiste:** Zeichenwerkzeuge.
- **Chartbereich:** Kerzen, ein Volumenfenster, ein Fadenkreuz, das der Maus folgt, und die Kurs- und Zeitachse.
- **Rechtes Fenster:** Watchlists, Alarme, Nachrichten und Details zum Symbol.
- **Unteres Fenster:** Screener, Skript-Editor, Strategietester (Strategiebericht), Papierhandel und Brokeranbindungen.

## Symbole und Daten

- **Börsenpräfix:** Symbole können ein Börsenpräfix tragen, etwa `NASDAQ:AAPL`. Dasselbe Unternehmen kann an mehreren Börsen und in verschiedenen Währungen gehandelt werden, prüfe also, welche Notierung du siehst.
- **Verzögert oder in Echtzeit:** Die meisten Aktien- und Terminbörsen verlangen Gebühren für Echtzeitdaten, also sind die Daten vieler Börsen **verzögert**, außer du kaufst ein Datenpaket. TradingView sagt, dass seine bezahlten Tarife diese Börsengebühren nicht abdecken. Zahlst du bereits über einen Broker für Echtzeitdaten, lassen sich diese in manchen Fällen auf der Plattform nutzen.
- **Datenquelle:** Standardmäßig zeigt TradingView US-Aktienkurse von Cboe, die leicht von den Hauptbörsen abweichen können.

## Charteinstellungen, die du prüfen solltest

Kerzenfarben, lineare oder logarithmische Skala, Bereinigung um Splits und Dividenden, die **Zeitzone** des Charts, verlängerte Handelszeiten und Sitzungspausen. Ein Chart in der falschen Zeitzone oder mit unbereinigten Kursen kann ganz anders aussehen.

## Indikatoren und Skripte

- Eine eingebaute Bibliothek von Indikatoren (gleitende Durchschnitte, RSI, MACD, Bollinger-Bänder und viele mehr), jeder mit einstellbaren Werten wie Länge und Kursquelle.
- **Pine Script** ist die eigene Programmiersprache der Plattform für selbst gebaute Indikatoren und Strategien, geschrieben in einem Editor im unteren Fenster. Viele **Community-Skripte** werden von Nutzern veröffentlicht. Ihre Qualität ist unterschiedlich, und ein Skript ist keine Beratung.
- Der **Strategietester (Strategiebericht)** zeigt, wie eine programmierte Strategie in vergangenen Daten abgeschnitten hätte, mit allen Backtest-Fallen aus Lektion 9.

## Zeichenwerkzeuge

Trendlinien, waagrechte Linien und Strahlen, parallele Kanäle, Rechtecke für Zonen, Fibonacci-Retracements, ein Messwerkzeug, **Long-/Short-Positionswerkzeuge**, die Risiko und Chance eines geplanten Trades zeigen, Textnotizen und verankerter VWAP.

## Alarme

Alarme benachrichtigen dich, wenn eine Kurs- oder Indikatorbedingung erfüllt ist, zum Beispiel wenn ein Kurs eine Marke kreuzt. Nützlich, um nicht ständig auf den Bildschirm schauen zu müssen, aber viele Alarme können auch zu **übermäßigem Handeln und FOMO** führen.

## Replay-Modus

Das **Bar Replay** spielt vergangene Kerzen ab einem gewählten Startpunkt eine nach der anderen ab, damit du das Chartlesen üben kannst, ohne zu wissen, was als Nächstes kommt.

## Screener, Watchlists und Layouts

Watchlists, Layouts mit mehreren Charts und synchronisiertem Fadenkreuz, gespeicherte Vorlagen und ein **Screener**, der Märkte nach Kriterien wie Marktwert, KGV oder Volumen filtert. Ein Screener-Ergebnis ist eine Liste, die zu deinen Filtern passt, keine Empfehlung.

## Papierhandel und Brokeranbindungen

- **Papierhandel:** ein simuliertes Konto mit virtuellem Geld, laut TradingView für alle Nutzer verfügbar.
- **Brokeranbindungen:** Manche Broker lassen sich anbinden, sodass Orders direkt aus dem Chart aufgegeben werden. Das ist bequem, macht aber auch das Handeln sehr schnell und einfach, auch impulsive Trades. Prüfe, wer dein Broker ist, wo er beaufsichtigt wird und was er kostet (Kategorie F).

## Community-Ideen

Nutzer veröffentlichen ihre Chartanalysen als **Ideen**, die ihren Followern und Leuten, die dem Symbol folgen, gezeigt werden; beliebte steigen auf die Startseite auf. Lies sie mit Vorsicht: Beliebtheit ist keine Treffsicherheit, und soziale Feeds werden auch für **Hype, den Verkauf von „Signalen“ und Betrug** genutzt (siehe den [Betrugsschutz](/scams)).

## Tarife

Es gibt einen kostenlosen Tarif und mehrere bezahlte mit mehr Funktionen. Welcher zu dir passt, wenn überhaupt einer, ist deine Entscheidung; prüfe die aktuellen Unterschiede auf der offiziellen Website. Echtzeitdaten vieler Börsen kosten zusätzlich zu einem Tarif.

## Risiken und Grenzen

- verzögerte Daten, die für Live-Kurse gehalten werden;
- die falsche Zeitzone oder unbereinigte Kurse;
- **Repainting**-Indikatoren, die ihre vergangenen Signale umschreiben;
- überangepasste Backtests im Strategietester;
- zu viele Alarme und FOMO durch soziale Feeds.

> [!MISTAKE] „Diese Idee hat tausende Likes, also muss sie stimmen“
> Ideen sind Meinungen. Beliebte Ideen werden nicht auf Richtigkeit geprüft, und veröffentlichte Charts lassen sich im Nachhinein leicht herauspicken.

**Probier den geführten Rundgang:** Das [Chart-Labor](/charts/lab) hat dieselben Bausteine (Charttypen, Zeiteinheiten, Indikatoren, Zeichenwerkzeuge, Replay) und eine Tour „Diesen Chart Schritt für Schritt lesen“, die der Checkliste aus Lektion 9 folgt.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Chart-Plattformen haben dieselben Teile: Symbolsuche, Zeiteinheiten, Charttypen, Indikatoren, Zeichenwerkzeuge, Alarme, Replay, Screener und Fenster.
> - Prüfe Börsenpräfix, Währung, Zeitzone, Bereinigungseinstellungen und ob die Daten verzögert sind.
> - Community-Skripte und -Ideen sind keine Beratung; die Qualität ist unterschiedlich, und Hype ist häufig.
> - Replay und Papierhandel dienen dem Üben; Backtests und Alarme haben eigene Risiken.
> - Wir beschreiben TradingView nur als Beispiel; Funktionen und Preise ändern sich, prüfe also die offizielle Website.
