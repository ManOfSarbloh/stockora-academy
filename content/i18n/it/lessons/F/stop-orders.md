---
title: "Ordini stop, stop-limit e trailing stop"
summary: "Gli ordini stop attendono dietro le quinte e si attivano solo quando viene raggiunto un prezzo. Sono spesso usati per limitare le perdite, ma non sono una garanzia."
translatedFrom: 2026-10-11
---

Un **ordine stop** è un ordine che dorme finché il prezzo non raggiunge un livello scelto da te, il **prezzo di attivazione** (stop). A quel punto si sveglia e diventa un ordine normale. Gli ordini stop sono spesso usati per limitare le perdite, ed è per questo che vengono chiamati anche **ordini stop-loss**.

## Ordine stop (stop-loss)

- Uno **stop di vendita** si piazza **sotto** il prezzo attuale. Se il prezzo scende al prezzo di attivazione, diventa un **ordine al mercato** di vendita.
- Uno **stop di acquisto** si piazza **sopra** il prezzo attuale, per esempio per limitare le perdite su una posizione corta.

> [!EXAMPLE]
> Possiedi azioni a **40 €** e inserisci uno **stop di vendita a 36 €**.
>
> - Se il prezzo scende a 36 €, lo stop scatta e parte un ordine al mercato di vendita. Potresti vendere a 35,95 €, o più in basso se i prezzi stanno scendendo rapidamente.
> - Se il prezzo non arriva mai a 36 €, non succede nulla.

**Importante:** il prezzo di attivazione è un innesco, non un prezzo di vendita garantito. Se il mercato apre molto al di sotto del tuo stop (un **gap**), il tuo ordine al mercato viene eseguito al prezzo molto più basso.

> [!EXAMPLE]
> Il tuo stop di vendita è a 36 €. Durante la notte la società annuncia una brutta notizia. La mattina dopo l'azione apre a **30 €**. Il tuo stop scatta e vendi intorno a 30 €, non a 36 €.

## Ordine stop-limit

Un **ordine stop-limit** ha due prezzi: un prezzo di attivazione e un prezzo limite. Quando scatta, diventa un **ordine con limite di prezzo**. Questo ti protegge dal vendere molto sotto il tuo limite, ma significa che l'ordine **potrebbe non essere eseguito affatto** se il prezzo scende oltre il limite.

> [!EXAMPLE]
> Stop-limit di vendita: stop **36 €**, limite **35 €**. Se il prezzo scende a 36 €, viene inserito un ordine di vendita con limite a 35 €. Se il prezzo salta a 30 €, il tuo ordine non viene eseguito e continui a detenere le azioni mentre continuano a scendere.

## Ordine trailing stop

Un **trailing stop** fissa il prezzo di attivazione a un importo o a una percentuale fissa **sotto il prezzo massimo** raggiunto da quando hai inserito l'ordine. Quando il prezzo sale, lo stop sale; quando il prezzo scende, resta dov'è.

> [!EXAMPLE]
> Compri a **20 €** e imposti un trailing stop di **1 €**. L'azione sale a **24 €**, quindi lo stop sale a **23 €**. Poi il prezzo ridiscende: a 23 € lo stop scatta e parte un ordine di vendita.

## Cose da verificare

Secondo la SEC, non tutti i broker offrono tutti questi tipi di ordine, e i broker possono differire su che cosa fa scattare uno stop (l'ultimo scambio o le quotazioni correnti). Anche oscillazioni di prezzo di breve durata possono far scattare uno stop e vendere le tue azioni appena prima che il prezzo si riprenda.

> [!MISTAKE] «Uno stop-loss garantisce che non posso perdere più del 10%»
> Uno stop-loss limita le perdite solo se il mercato attraversa il tuo prezzo di attivazione in modo ordinato. Gap, mercati frenetici e azioni poco liquide possono portare a vendite molto sotto il tuo stop, e un ordine stop-limit potrebbe non essere eseguito affatto.

## Punti chiave

> [!TAKEAWAYS]
> - Un ordine stop diventa un ordine al mercato quando viene raggiunto il prezzo di attivazione; uno stop-limit diventa un ordine con limite di prezzo.
> - Il prezzo di attivazione è un innesco, non un prezzo di esecuzione garantito; i gap possono portare a prezzi molto peggiori.
> - Gli ordini stop-limit proteggono il prezzo ma potrebbero non essere eseguiti affatto.
> - I trailing stop salgono con il prezzo ma non scendono mai.
