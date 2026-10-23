---
title: "Optionen: Calls, Puts und der Preis eines Rechts"
summary: Eine Option gibt das Recht, aber nicht die Pflicht, zu einem festen Preis zu kaufen oder zu verkaufen. Käufer können die Prämie verlieren; Verkäufer viel mehr. Lerne Calls, Puts, Auszahlungen bei Verfall, Hebel und die Falle des Zeitwertverfalls.
translatedFrom: 2026-10-11
---

Ein **Derivat** ist ein Finanzinstrument, dessen Wert sich von einem Basiswert ableitet, etwa einer Aktie oder einem Index (Investor.gov). **Optionen** gehören zu den ältesten und meistgehandelten Derivaten.

## Die Grundidee

Investor.gov definiert Optionen als Verträge, die dem Käufer **das Recht, aber nicht die Pflicht** geben, ein Wertpapier innerhalb eines bestimmten Zeitraums zu einem festen Preis zu kaufen oder zu verkaufen. Das Börsenlexikon der Wiener Börse ergänzt die wichtigsten Begriffe:

- Der Käufer zahlt für dieses Recht eine **Prämie**.
- Der feste Preis ist der **Ausübungspreis** (Strike).
- Ein **Call** ist das Recht zu **kaufen**; ein **Put** das Recht zu **verkaufen**.
- **Amerikanische** Optionen können während der ganzen Laufzeit ausgeübt werden, **europäische** nur am Ende.
- Der **Verkäufer** (Stillhalter) bekommt die Prämie und übernimmt die **Pflicht**: den Basiswert zu liefern (Call) oder ihn zu kaufen (Put), wenn der Käufer ausübt.

Das Lexikon merkt an, dass ein Call, der nicht ausgeübt wird, **wertlos verfällt**.

## Auszahlungen bei Verfall

> [!EXAMPLE] Einen Call kaufen
> Eine Aktie notiert bei 100 €. Du kaufst einen Call mit Ausübungspreis 100 € für eine Prämie von **5 €** je Aktie, Verfall in drei Monaten.
>
> | Aktienkurs bei Verfall | Wert des Calls | Dein Ergebnis |
> |---:|---:|---:|
> | 80 € | 0 € | −5 € (−100 %) |
> | 100 € | 0 € | −5 € (−100 %) |
> | 105 € | 5 € | 0 € |
> | 120 € | 20 € | +15 € (+300 %) |
>
> Die Aktie muss über **105 €** (Ausübungspreis + Prämie) steigen, nur damit du bei null bist. Mehr als die Prämie kannst du nicht verlieren.

> [!EXAMPLE] Einen Put kaufen
> Dieselbe Aktie bei 100 €. Ein Put mit Ausübungspreis 100 € kostet **4 €**.
> - Bei Verfall steht die Aktie bei 80 €: Der Put ist 20 € wert, dein Ergebnis **+16 €**.
> - Bei Verfall steht die Aktie bei 100 € oder höher: Der Put verfällt wertlos, Ergebnis **−4 €**.
>
> Manche Anleger kaufen Puts als **Versicherung** gegen einen Rückgang von Aktien, die sie besitzen, und zahlen die Prämie wie eine Versicherungsprämie.

## Hebel

Das Börsenlexikon der Wiener Börse erklärt den **Hebel** von Optionen: Ihre Kurse ändern sich prozentual viel stärker als der Basiswert, also braucht man viel weniger Kapital, um an einer Kursbewegung teilzuhaben. Im Call-Beispiel wurde aus einem Anstieg der Aktie um 20 % ein Gewinn von **300 %**, aber ein unveränderter Kurs bedeutete einen Verlust von **100 %**.

## Die Zeit arbeitet gegen den Käufer

Eine Option hat eine begrenzte Lebensdauer. Ein Teil ihres Preises spiegelt die verbleibende **Zeit** wider, in der sich der Basiswert bewegen kann. Nähert sich der Verfall, schrumpft dieser Zeitwert, also kann eine gekaufte Option an Wert verlieren, auch wenn sich der Aktienkurs nicht bewegt, und verfällt wertlos, wenn sich der Kurs bis zum Verfall nicht weit genug bewegt hat.

## Optionen verkaufen (schreiben)

Der Stillhalter kassiert die Prämie, was sich wie ein stetiges Einkommen anfühlt. Aber:

- Wer einen Call verkauft, ohne die Aktien zu besitzen (ein **ungedeckter Call**), hat theoretisch **unbegrenzte Verluste**, wenn der Kurs in die Höhe schießt.
- Wer Puts verkauft, muss in einem Crash vielleicht Aktien weit über ihrem Marktpreis kaufen.
- Stillhalter müssen eine **Margin** hinterlegen (Lektion 3); das Börsenlexikon der Wiener Börse merkt an, dass bei Optionen für Short-Positionen eine Margin nötig ist.

> [!WARNING] Kleine, regelmäßige Gewinne und seltene, riesige Verluste
> Optionen zu verkaufen bringt oft viele kleine Gewinne, gefolgt von einem gelegentlichen sehr großen Verlust. Strategien, die „immer funktioniert haben“, können ein Konto bei einem einzigen Marktschock auslöschen.

> [!AUSTRIA] Zugang bekommen
> Optionen sind Derivate, die nicht zu den „nicht komplexen“ Instrumenten nach MiFID II Artikel 25 Absatz 4 gehören. Eine Firma, die nur deine Orders ausführt, muss daher grundsätzlich prüfen, ob sie für dich **angemessen** sind, anhand deiner Kenntnisse und Erfahrungen (Kategorie F). Von Banken ausgegebene optionsähnliche Wertpapiere heißen **Optionsscheine** (Lektion 9).

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Eine Option ist ein Recht, keine Pflicht, zum Ausübungspreis zu kaufen (Call) oder zu verkaufen (Put).
> - Käufer zahlen eine Prämie und können sie zu 100 % verlieren; viele Optionen verfallen wertlos.
> - Optionen haben einen starken Hebel: Kleine Bewegungen der Aktie verursachen große Bewegungen der Option.
> - Der Zeitwert schrumpft, je näher der Verfall rückt.
> - Stillhalter bekommen die Prämie, können aber sehr große, sogar unbegrenzte Verluste erleiden.
