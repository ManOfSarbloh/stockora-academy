---
title: "Ordini al mercato e ordini con limite di prezzo"
summary: "I due tipi di ordine di base. Un ordine al mercato garantisce l'esecuzione ma non il prezzo; un ordine con limite di prezzo garantisce il prezzo (o uno migliore) ma non l'esecuzione."
translatedFrom: 2026-10-11
---

Quando compri o vendi un'azione, non dici semplicemente «compra». Scegli un **tipo di ordine** che dice al mercato come eseguire il tuo ordine. I due più importanti sono l'**ordine al mercato** e l'**ordine con limite di prezzo**.

## L'ordine al mercato

Un **ordine al mercato** dice: «compra (o vendi) adesso, al miglior prezzo disponibile in questo momento».

- **L'esecuzione è (quasi) garantita**, purché ci siano venditori o compratori.
- **Il prezzo non è garantito.** Un ordine di acquisto al mercato viene eseguito di solito intorno al **prezzo lettera** attuale, un ordine di vendita intorno al **prezzo denaro** attuale, ma il prezzo che ottieni può differire dall'ultimo prezzo che hai visto, soprattutto se i prezzi si muovono in fretta o il book è sottile.

La differenza tra il prezzo che ti aspettavi e quello che hai ottenuto si chiama **slippage**.

> [!EXAMPLE]
> Vedi un ultimo prezzo di **20,00 €** e invii un ordine al mercato per comprare **500 azioni**. Il book offre 200 azioni a 20,02 € e 300 a 20,10 €.
>
> Compri 200 × 20,02 € + 300 × 20,10 € = 4.004 € + 6.030 € = **10.034 €**, in media circa **20,07 €** per azione, non 20,00 €. Lo slippage ti è costato circa 34 €.

> [!ANIMATION] market-order-fill
> Un ordine al mercato per 500 azioni prende le 200 azioni offerte a 20,02 €, poi le 300 a 20,10 €: 10.034 € in totale, circa 20,07 € per azione invece di 20,00 €.

## L'ordine con limite di prezzo

Un **ordine con limite di prezzo** dice: «compra a questo prezzo **o a meno**» (oppure «vendi a questo prezzo **o a più**»).

- **Il prezzo è protetto:** un ordine di acquisto con limite a 50 € può essere eseguito solo a 50 € o meno.
- **L'esecuzione non è garantita:** se il mercato non raggiunge mai il tuo limite, non succede nulla.

> [!EXAMPLE]
> Un'azione è scambiata a **52 €**. Inserisci un **ordine di acquisto con limite a 50 €**.
>
> - Se il prezzo scende a 50 € o meno e ci sono venditori, il tuo ordine viene eseguito a 50 € o meno.
> - Se il prezzo non scende mai fin lì, il tuo ordine resta inevaso, e potresti «perdere» un rialzo fino a 60 €.

> [!ANIMATION] limit-order
> Lo stesso ordine di acquisto con limite a 50 €, due esiti possibili: il prezzo scende fino al tuo limite e l'ordine viene eseguito, oppure non ci arriva mai e l'ordine resta in attesa mentre il prezzo sale a 60 €.

## Le esecuzioni parziali

Gli ordini possono essere **eseguiti in parte**: se vuoi 1.000 azioni con limite a 50 € ma a quel prezzo ne vengono offerte solo 300, potresti comprarne 300 subito e le restanti 700 più tardi, o mai. Alcuni broker applicano una commissione per ogni esecuzione parziale: controlla il tuo listino.

## Quale usare?

| | Ordine al mercato | Ordine con limite di prezzo |
|---|---|---|
| Garantisce l'esecuzione? | Di solito sì | No |
| Garantisce il prezzo? | No | Sì (il limite o meglio) |
| Adatto per | Azioni molto liquide, ordini piccoli, quando conta la rapidità | Azioni meno liquide, ordini più grandi, momenti volatili, fuori dall'orario normale |

> [!MISTAKE] «Un ordine al mercato viene eseguito al prezzo sul mio schermo»
> Il prezzo sullo schermo è l'ultimo scambio. Un ordine al mercato viene eseguito al miglior prezzo disponibile quando raggiunge il mercato, che può essere sensibilmente diverso, soprattutto all'apertura, nei mercati poco liquidi o quando escono notizie.

## Punti chiave

> [!TAKEAWAYS]
> - Gli ordini al mercato garantiscono l'esecuzione, non il prezzo; gli ordini con limite garantiscono il prezzo, non l'esecuzione.
> - Lo slippage è la differenza tra il prezzo che ti aspettavi e quello che hai ottenuto.
> - Gli ordini grandi possono essere eseguiti a più prezzi o solo in parte.
> - Gli ordini con limite ti proteggono nei mercati poco liquidi o in rapido movimento.
