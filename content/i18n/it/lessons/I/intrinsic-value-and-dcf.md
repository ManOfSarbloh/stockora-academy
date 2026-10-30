---
title: "Valore intrinseco e flussi di cassa attualizzati (DCF)"
summary: "Un'azienda vale la liquidità che può produrre in futuro, attualizzata a oggi. Svolgi passo dopo passo un semplice DCF, vedi quanto è sensibile alle ipotesi e impara il concetto di margine di sicurezza."
translatedFrom: 2026-10-11
---

I rapporti (lezione 7) confrontano una società con altre società. La **valutazione intrinseca** pone una domanda più fondamentale: *quanto vale quest'azienda in sé, in base alla liquidità che produrrà?*

L'*Owner's Manual* di Berkshire Hathaway dà una definizione semplice: il valore intrinseco è **il valore attualizzato della liquidità che si può estrarre da un'azienda nel corso della sua vita residua**. Aggiunge subito che il calcolo non è semplice e che il valore intrinseco è una **stima piuttosto che un dato preciso**, che deve cambiare quando cambiano i tassi d'interesse o le previsioni sui flussi di cassa.

La stessa idea compare in contabilità: quando gli IFRS (IAS 36) sottopongono le attività a verifica per riduzione di valore, una delle misure usate è il «valore d'uso», cioè i flussi di cassa futuri attesi **attualizzati al valore attuale**.

## Passo 1: il denaro oggi vale più del denaro domani

100 € oggi possono essere investiti e crescere. Quindi 100 € ricevuti tra un anno valgono **meno** di 100 € oggi. Quanto meno dipende dal rendimento che richiedi, chiamato **tasso di attualizzazione**.

**Valore attuale = liquidità futura ÷ (1 + tasso di attualizzazione)^anni**

> [!EXAMPLE] Attualizzare un singolo pagamento
> 100 € tra un anno, tasso di attualizzazione 8%: 100 ÷ 1,08 = **92,59 €** oggi.
> 100 € tra due anni: 100 ÷ 1,08² = **85,73 €** oggi.

È l'interesse composto (categoria G) al contrario.

## Passo 2: un semplice DCF, passo dopo passo

Un modello di **flussi di cassa attualizzati (DCF)** prevede la liquidità che una società genererà e poi attualizza ogni anno a oggi. Ecco un esempio semplificato per azione di una società inventata. Ogni dato di partenza è un'**ipotesi**:

- Free cash flow per azione il prossimo anno: **1,20 €**
- Crescita nei prossimi cinque anni: **5%** all'anno
- Crescita successiva, per sempre: **2%** all'anno
- Tasso di attualizzazione (il rendimento richiesto da un investitore): **9%**

**Anni 1–5:**

| Anno | Flusso di cassa (€) | Fattore di sconto | Valore attuale (€) |
|---:|---:|---:|---:|
| 1 | 1,20 | ÷ 1,09 | 1,10 |
| 2 | 1,26 | ÷ 1,09² | 1,06 |
| 3 | 1,32 | ÷ 1,09³ | 1,02 |
| 4 | 1,39 | ÷ 1,09⁴ | 0,98 |
| 5 | 1,46 | ÷ 1,09⁵ | 0,95 |
| | | **Somma** | **≈ 5,12** |

(Le righe sono arrotondate, quindi la somma non torna esattamente.)

**Dopo l'anno 5: il valore terminale.** Nessuno può prevedere ogni anno all'infinito, quindi il modello ipotizza una crescita costante dopo l'anno 5 e usa la formula della rendita perpetua crescente:

**Valore terminale = flusso di cassa dell'anno 6 ÷ (tasso di attualizzazione − crescita di lungo periodo)**

> [!EXAMPLE] Valore terminale
> Flusso di cassa dell'anno 6 = 1,46 × 1,02 ≈ 1,49 €.
> Valore terminale alla fine dell'anno 5 = 1,49 ÷ (0,09 − 0,02) ≈ **21,25 €**.
> Attualizzato a oggi: 21,25 ÷ 1,09⁵ ≈ **13,81 €**.

**Totale:** 5,12 + 13,81 ≈ **18,93 € per azione**.

Nota che circa il **73%** del valore deriva dal valore terminale: flussi di cassa lontani più di cinque anni, basati sulle ipotesi più approssimative.

## Passo 3: quanto è sensibile il risultato?

Cambia solo il tasso di attualizzazione e il tasso di crescita di lungo periodo, e guarda che cosa succede:

| Tasso di attualizzazione ↓ / crescita di lungo periodo → | 1% | 2% | 3% |
|---|---:|---:|---:|
| **8%** | 19,58 € | 22,13 € | 25,71 € |
| **9%** | 17,08 € | 18,93 € | 21,39 € |
| **10%** | 15,14 € | 16,53 € | 18,31 € |

Piccole variazioni di un punto percentuale spostano il «valore» da circa 15 € a quasi 26 €. Un DCF non è una misurazione. È un modo strutturato per rendere visibili le tue ipotesi.

> [!WARNING] Se entra spazzatura, esce spazzatura
> Si può far produrre a un DCF quasi qualsiasi numero. Sii particolarmente scettico verso i modelli che ipotizzano una crescita elevata per molti anni, un tasso di crescita di lungo periodo superiore alla crescita di lungo periodo dell'economia o un tasso di attualizzazione che sembra basso rispetto al rischio.

## DCF inverso: che cosa sta ipotizzando il mercato?

Invece di stimare un valore, puoi chiederti quali ipotesi implica il **prezzo attuale**. Con il modello più semplice, una sola rendita perpetua crescente:

**Prezzo = flusso di cassa del prossimo anno ÷ (tasso di attualizzazione − crescita)**, quindi **crescita = tasso di attualizzazione − flusso di cassa ÷ prezzo**

> [!EXAMPLE] Che cosa implica un prezzo di 24 €
> Flusso di cassa del prossimo anno 1,20 €, rendimento richiesto 9%, prezzo 24 €:
> Crescita implicita = 9% − 1,20 ÷ 24 = 9% − 5% = **4% all'anno, per sempre**.
>
> La domanda diventa allora: una crescita del 4% per sempre è realistica per quest'azienda? È più facile discuterne che di un astratto «valore equo».

## Il margine di sicurezza

Poiché il valore intrinseco è solo una stima, gli investitori prudenti si tengono un cuscinetto. Nella lettera del 1992, Warren Buffett scrisse che Berkshire pretende un **margine di sicurezza** nel prezzo di acquisto: se il valore calcolato di un'azione è solo di poco superiore al suo prezzo, non sono interessati. Definisce questo principio, su cui Benjamin Graham insisteva molto, la pietra angolare del successo negli investimenti.

> [!EXAMPLE] Un margine di sicurezza in numeri
> Valore stimato 18,93 €. Chi pretende un margine di sicurezza del 25% considererebbe solo prezzi pari o inferiori a 18,93 × 0,75 ≈ **14,20 €**.

È un modo di ragionare sugli errori di stima, non un consiglio di comprare qualcosa a qualunque prezzo.

## Da dove viene il tasso di attualizzazione

I professionisti di solito lo ricavano dai tassi d'interesse più un premio per il rischio delle azioni (il **premio per il rischio azionario**) e per il rischio specifico della società. Aswath Damodaran della NYU Stern pubblica stime aggiornate regolarmente di questi dati, compresi i premi impliciti per il rischio azionario. Per imparare, il punto chiave è più semplice: **più alto è il rischio, più alto è il tasso di attualizzazione e più basso il valore oggi.** Anche l'aumento dei tassi d'interesse spinge in alto i tassi di attualizzazione, ed è uno dei motivi per cui i prezzi delle azioni, soprattutto di società i cui flussi di cassa si trovano lontano nel futuro, spesso scendono quando i tassi salgono.

## Punti chiave

> [!TAKEAWAYS]
> - Valore intrinseco = il valore attualizzato della liquidità che un'azienda può produrre nel corso della sua vita; è sempre una stima.
> - Valore attuale = liquidità futura ÷ (1 + tasso di attualizzazione)^anni.
> - Un DCF semplice: prevedi alcuni anni, aggiungi un valore terminale, attualizza tutto a oggi.
> - Il valore terminale spesso domina, e piccole variazioni delle ipotesi spostano molto il risultato.
> - Un DCF inverso mostra quale crescita implica il prezzo attuale; un margine di sicurezza tiene conto degli errori.
