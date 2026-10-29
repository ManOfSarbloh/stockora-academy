---
title: "Circuit breaker, interruzioni per volatilità e sospensioni"
summary: "Quando i prezzi si muovono troppo e troppo in fretta, le Borse sospendono la negoziazione per far riprendere fiato a tutti. Ecco come fanno Vienna e gli Stati Uniti."
translatedFrom: 2026-10-11
---

A volte i prezzi si muovono in modo violento: dopo una notizia scioccante, un ordine sbagliato o il panico. Le Borse hanno dei «freni» incorporati che sospendono la negoziazione quando i prezzi si muovono troppo, troppo in fretta. L'idea non è impedire ai prezzi di scendere, ma dare a tutti il tempo di assimilare le informazioni e di raccogliere abbastanza ordini per un prezzo equo.

## Le interruzioni per volatilità a Vienna

La Borsa di Vienna confronta ogni prezzo potenziale con due **corridoi di prezzo**:

- un **corridoio dinamico** intorno all'ultimo prezzo scambiato, e
- un **corridoio statico** intorno all'ultimo prezzo d'asta.

Se il prossimo prezzo cadesse **fuori** da un corridoio, non viene eseguito. La negoziazione passa invece a una breve **asta** (un'interruzione per volatilità), per esempio di **2 minuti** durante la negoziazione continua, così che gli ordini possano essere raccolti e il prezzo determinato in modo ordinato. I corridoi sono fissati per ogni singolo titolo, in base a fattori come tipo, liquidità e volatilità, e vengono rivisti almeno una volta al mese.

> [!EXAMPLE]
> Un'azione è stata scambiata l'ultima volta a **30,00 €** e il suo corridoio dinamico è ±2% (da 29,40 € a 30,60 €). Arriva un grosso ordine di vendita che verrebbe eseguito a **28,90 €**.
>
> Invece di scambiare a 28,90 €, il sistema avvia una breve asta. I compratori che vedono il calo possono inserire ordini; l'asta trova poi un prezzo. Potrebbe essere 29,20 €, o più basso se davvero non ci sono compratori, ma viene trovato in modo controllato anziché con un solo ordine che spazza un book vuoto.

## I circuit breaker negli Stati Uniti

Gli Stati Uniti hanno due livelli di protezione:

**1. Circuit breaker sull'intero mercato**, basati sul calo dell'indice S&P 500 in una giornata:

| Livello | Calo dell'S&P 500 | Che cosa succede |
|---|---|---|
| Livello 1 | 7% | Sospensione di 15 minuti di tutta la negoziazione, se avviene prima delle 15:25, ora di New York |
| Livello 2 | 13% | Un'altra sospensione di 15 minuti, se prima delle 15:25 |
| Livello 3 | 20% | Negoziazione sospesa per il resto della giornata |

**2. Limit up–limit down (LULD)** per le singole azioni: ogni azione ha delle bande di prezzo; se un'azione esce dalla sua banda e non vi rientra in fretta, la negoziazione di quell'azione si ferma per alcuni minuti.

## Sospensioni delle negoziazioni

Oltre a questi meccanismi automatici, la negoziazione di una singola azione può anche essere **interrotta o sospesa**, per esempio quando è attesa una notizia importante e il mercato ha bisogno di tempo per riceverla. I tuoi ordini possono restare allora inevasi finché la negoziazione non riprende.

> [!MISTAKE] «Un circuit breaker mi protegge dalle perdite»
> Si limita a sospendere la negoziazione. Quando riprende, il prezzo può essere comunque molto più basso. I circuit breaker mirano a mercati ordinati, non a impedire ai prezzi di scendere.

## Punti chiave

> [!TAKEAWAYS]
> - Le Borse sospendono la negoziazione quando i prezzi si muovono troppo, troppo in fretta.
> - A Vienna, i prezzi fuori da un corridoio dinamico o statico fanno scattare una breve asta (interruzione per volatilità).
> - Negli Stati Uniti, i circuit breaker sull'intero mercato scattano con cali dell'S&P 500 del 7%, 13% e 20%; il LULD ferma le singole azioni.
> - Le pause aiutano i prezzi a formarsi in modo ordinato; non impediscono le perdite.
