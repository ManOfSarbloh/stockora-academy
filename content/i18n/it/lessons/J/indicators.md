---
title: "Gli indicatori: medie mobili, RSI, MACD, bande di Bollinger e altri"
summary: "Che cosa calcolano gli indicatori più comuni, come vengono letti di solito e quali limiti hanno per costruzione. Gli indicatori derivano dal prezzo; non aggiungono informazioni nuove."
translatedFrom: 2026-10-11
---

Un **indicatore** è un calcolo basato sul prezzo (e a volte sul volume), disegnato sopra o sotto il grafico. Due famiglie:

- Gli **indicatori sovrapposti** sono disegnati sopra il prezzo: medie mobili, bande di Bollinger, VWAP.
- Gli **oscillatori** sono disegnati in un riquadro separato e si muovono entro un intervallo fisso o intorno allo zero: RSI, MACD.

![Grafico di prezzo simulato con medie mobili e bande di Bollinger, e riquadri RSI e MACD sotto](../../../../lessons/J/img/indicators.svg)

> [!NOTE]
> Gli indicatori sono calcolati **a partire dal prezzo**. Possono rendere più visibili gli schemi, ma non aggiungono informazioni nuove sul futuro, e la maggior parte di essi è **in ritardo**: reagisce dopo che il prezzo si è mosso.

## Medie mobili (SMA ed EMA)

- **Media mobile semplice (SMA):** la media dei prezzi di chiusura degli ultimi *n* periodi. Esempio: chiusure di 45,50, 45,25 e 46,10 danno una SMA a 3 periodi di 136,85 ÷ 3 = **45,62**.
- **Media mobile esponenziale (EMA):** dà più peso ai prezzi recenti, quindi reagisce più in fretta. Ogni nuovo valore = prezzo × moltiplicatore + EMA precedente × (1 − moltiplicatore), con moltiplicatore = 2 ÷ (n + 1).
- **Lunghezze comuni:** 20, 50, 100 e 200 periodi. Una media in salita suggerisce un trend rialzista; il prezzo che attraversa la propria media viene osservato da molti trader.
- **Golden cross / death cross:** la media a 50 giorni che attraversa **verso l'alto** quella a 200 giorni viene chiamata comunemente golden cross (incrocio d'oro), verso il basso death cross (incrocio della morte). Entrambi avvengono per costruzione ben dopo la svolta del prezzo.

## RSI (Relative Strength Index)

- Confronta l'ampiezza media dei **movimenti al rialzo** con quella dei **movimenti al ribasso** in un periodo (di solito 14), su una scala **da 0 a 100**.
- Livelli convenzionali: sopra **70** «ipercomprato», sotto **30** «ipervenduto».
- **Il tranello:** in un trend forte, l'RSI può restare sopra 70 (o sotto 30) a lungo mentre il prezzo continua a muoversi. «Ipercomprato» non significa «sta per scendere».
- **Divergenza:** il prezzo segna un nuovo massimo ma l'RSI no. I trader la leggono come uno slancio che si affievolisce; può durare a lungo.

## MACD (Moving Average Convergence Divergence)

- **Linea MACD:** l'EMA a 12 periodi meno l'EMA a 26 periodi.
- **Linea del segnale:** un'EMA a 9 periodi della linea MACD.
- **Istogramma:** linea MACD meno linea del segnale.
- I trader osservano gli incroci tra la linea MACD e quella del segnale, e l'attraversamento dello zero da parte della linea MACD. Essendo costruito con medie mobili, anche il MACD è in ritardo.

## Bande di Bollinger

Sviluppate da John Bollinger: una media mobile a 20 periodi con bande a **due deviazioni standard** sopra e sotto (le impostazioni predefinite). Le bande si allargano quando i prezzi diventano più volatili e si restringono quando si calmano. Uno «**squeeze**» stretto indica una volatilità insolitamente bassa; i trader aspettano che la volatilità riprenda, ma le bande non dicono in quale direzione.

## VWAP (prezzo medio ponderato per i volumi)

Il prezzo medio della giornata, ponderato per quanto è stato scambiato a ogni prezzo: (somma di prezzo × volume) ÷ (volume totale). **Riparte a ogni sessione** ed è usato soprattutto intraday. Molti operatori di mercato usano strategie di esecuzione VWAP, che mirano a comprare o vendere un ordine grande vicino al VWAP della giornata.

## ATR (Average True Range)

Una misura della **volatilità**, non della direzione: l'ampiezza media dell'escursione di ogni periodo, compreso un eventuale gap rispetto alla chiusura precedente. Un'azione con un ATR di 2 € si muove di solito di circa 2 € al giorno. I trader lo usano, per esempio, per piazzare gli stop a una distanza ragionevole.

## Ritracciamenti di Fibonacci

Linee tracciate al **38,2%, 50% e 61,8%** di un movimento precedente, dove alcuni trader si aspettano che una correzione si fermi. I rapporti derivano dalla successione di Fibonacci (il 50% è aggiunto per convenzione). I livelli di Fibonacci sono popolari ma **soggettivi**: il risultato dipende da quale massimo e quale minimo scegli, e con diversi livelli vicini, uno di loro sembrerà di solito «funzionare».

## Regole pratiche

- **Più indicatori non è meglio.** Molti indicatori mostrano la stessa informazione in modi diversi; cinque indicatori d'accordo non sono cinque conferme indipendenti.
- **Le impostazioni predefinite sono convenzioni,** non leggi: 14 per l'RSI o 20 per le bande di Bollinger sono abitudini, non valori ottimali.
- **Repainting:** alcuni indicatori personalizzati cambiano i propri valori passati quando arrivano dati nuovi, così sembrano perfetti sullo storico ma danno segnali diversi in tempo reale.

> [!MISTAKE] «L'RSI è sopra 70, quindi dovrei vendere»
> Un RSI sopra 70 dice solo che i guadagni recenti hanno superato le perdite recenti. Nei trend rialzisti forti può restarci per settimane. La lettura di un indicatore è una descrizione, non un'istruzione.

Attiva e disattiva ogni indicatore, e cambiane le impostazioni, nel [Laboratorio grafici](/charts/lab).

## Punti chiave

> [!TAKEAWAYS]
> - Gli indicatori sono calcolati dal prezzo (e dal volume); non aggiungono informazioni nuove e la maggior parte è in ritardo.
> - Le medie mobili smussano il prezzo; le EMA reagiscono più in fretta delle SMA.
> - L'RSI e gli altri oscillatori possono restare «ipercomprati» o «ipervenduti» a lungo nei trend forti.
> - Il MACD è costruito con medie mobili; bande di Bollinger e ATR misurano la volatilità; il VWAP è un riferimento intraday.
> - I livelli di Fibonacci sono soggettivi; usare pochi indicatori ben compresi è meglio del sovraccarico di indicatori.
