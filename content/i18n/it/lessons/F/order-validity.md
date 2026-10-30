---
title: "Quanto dura un ordine: giornaliero, GTC, IOC e FOK"
summary: "Oltre alle condizioni di prezzo, gli ordini hanno condizioni di durata. Decidono se un ordine inevaso viene cancellato a fine giornata, resta aperto o deve essere eseguito immediatamente."
translatedFrom: 2026-10-11
---

Ogni ordine ha una **validità**: quanto tempo resta attivo se non viene eseguito subito. Sbagliarla è un motivo frequente per cui gli ordini «spariscono» o, peggio, vengono eseguiti settimane dopo quando non te lo aspetti più.

## Le validità più comuni

| Validità | Che cosa significa |
|---|---|
| **Ordine giornaliero** | Valido solo per il giorno di Borsa in cui viene inserito. Se non eseguito, viene in genere cancellato alla fine dell'orario normale di negoziazione. |
| **Valido fino a revoca (GTC)** | Resta aperto finché non viene eseguito o non lo cancelli. I broker fissano di solito una durata massima; chiedi al tuo. |
| **Valido fino a una data** | Resta aperto fino a una data che scegli tu. |
| **Immediate-or-cancel (IOC)** | Deve essere eseguito immediatamente; la parte che non può essere eseguita subito viene cancellata. |
| **Fill-or-kill (FOK)** | Deve essere eseguito immediatamente **per intero**; altrimenti l'intero ordine viene cancellato (nessuna esecuzione parziale). |

> [!EXAMPLE]
> Inserisci un ordine di acquisto GTC con limite a **45 €** per un'azione scambiata a 50 €, e poi te ne dimentichi. Tre mesi dopo, in seguito a una brutta notizia, il prezzo scende a 45 € e il tuo ordine viene eseguito. Ora possiedi azioni che in quel momento non volevi più comprare.

> [!EXAMPLE]
> Vuoi esattamente 1.000 azioni e non una di meno. Con il **fill-or-kill**, o vengono comprate subito tutte le 1.000 o nessuna. Con l'**immediate-or-cancel**, potresti ottenerne 400 subito e il resto viene cancellato.

## Consigli

- Controlla regolarmente i tuoi **ordini aperti**, soprattutto quelli GTC.
- Sappi se la validità predefinita del tuo broker è «giornaliera» o «fino a revoca».
- Chiedi al tuo broker che cosa succede ai tuoi ordini aperti in occasione di eventi come un frazionamento azionario.

> [!MISTAKE] «Il mio ordine non è stato eseguito oggi, quindi non c'è più»
> Non necessariamente. Se era valido fino a revoca, è ancora in attesa sul mercato e può essere eseguito in qualsiasi momento.

## Punti chiave

> [!TAKEAWAYS]
> - Gli ordini giornalieri scadono a fine giornata di Borsa; gli ordini GTC restano aperti finché non vengono eseguiti o cancellati.
> - L'IOC esegue subito ciò che può e cancella il resto; il FOK viene eseguito per intero subito oppure per niente.
> - Controlla regolarmente gli ordini aperti per evitare esecuzioni a sorpresa.
