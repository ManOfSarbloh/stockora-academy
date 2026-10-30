---
title: "Che cosa mostra un grafico dei prezzi"
summary: "Il prezzo su un asse, il tempo sull'altro. Tipi di grafico, timeframe, scale lineare e logaritmica, volume, prezzi rettificati e dati differiti, spiegati prima di leggere una sola figura."
translatedFrom: 2026-10-11
---

Un grafico è semplicemente un'immagine di come si è evoluto un prezzo. L'asse verticale mostra il **prezzo**, quello orizzontale il **tempo**. Tutto il resto in un grafico, dalle candele agli indicatori, è costruito su questi due assi.

> [!NOTE]
> La Scuola dei grafici ti insegna a **leggere** i grafici. Non dà segnali di acquisto o vendita, e nessun grafico può dirti che cosa farà un prezzo in seguito. Tutti i grafici d'esempio di questo sito usano prezzi **simulati**.

## Tipi di grafico

![Gli stessi 16 giorni disegnati come grafico a linea, grafico a barre e grafico a candele](../../../../lessons/J/img/chart-types.svg)

- **Grafico a linea:** collega i prezzi di chiusura. Pulito e adatto al quadro generale, ma nasconde che cosa è successo durante ogni periodo.
- **Grafico a barre (OHLC):** ogni periodo è una linea verticale dal **massimo** al **minimo**, con un breve trattino orizzontale a sinistra per l'**apertura** e a destra per la **chiusura**.
- **Grafico a candele:** mostra gli stessi quattro prezzi di un grafico a barre, ma l'intervallo tra apertura e chiusura è disegnato come un **corpo** spesso, colorato a seconda che il prezzo sia salito o sceso. La prossima lezione spiega le candele in dettaglio.
- **Grafico ad area:** un grafico a linea con l'area sottostante colorata.
- **Heikin Ashi:** candele smussate costruite con **medie** del periodo attuale e di quello precedente. Rendono le tendenze più pulite, ma la loro apertura e chiusura **non sono prezzi effettivamente scambiati**.
- **Renko e Kagi:** grafici che ignorano il tempo e disegnano un nuovo mattone o una nuova linea solo quando il prezzo si muove di un importo prefissato. Da principiante ti serviranno di rado.

![Gli stessi 30 giorni come candele normali e come candele Heikin Ashi](../../../../lessons/J/img/heikin-ashi.svg)

## I timeframe

Ogni candela o barra rappresenta un **periodo**: 1 minuto, 5 minuti, 1 ora, 1 giorno, 1 settimana o 1 mese. Un grafico giornaliero ha una candela per ogni giorno di Borsa; un grafico settimanale riunisce cinque giorni in una candela.

Lo stesso mercato può apparire completamente diverso su timeframe diversi: un crollo brusco sul grafico a 5 minuti può essere una piccola discesa sul grafico settimanale. I timeframe più lunghi danno il contesto più ampio; quelli più brevi mostrano dettagli e rumore.

> [!EXAMPLE]
> Un'azione viene scambiata per 390 minuti al giorno (per esempio dalle 9:30 alle 16:00). Su un grafico a 1 ora, quella giornata diventa sei candele orarie complete più una settima, più corta, per gli ultimi 30 minuti. Su un grafico giornaliero è una sola candela.

## Scala lineare o logaritmica

Su una scala **lineare**, ogni passo sull'asse dei prezzi corrisponde allo stesso numero di euro: da 10 a 20 occupa lo stesso spazio che da 100 a 110. Su una scala **logaritmica**, ogni passo corrisponde alla stessa **percentuale**: da 10 a 20 (+100%) occupa lo stesso spazio che da 100 a 200 (+100%).

![La stessa storia di prezzi su scala lineare e su scala logaritmica](../../../../lessons/J/img/linear-vs-log.svg)

Per periodi lunghi e per prezzi cresciuti molto, la scala logaritmica è di solito più onesta: mostra i movimenti percentuali nella loro vera dimensione relativa.

## Il volume

La maggior parte dei grafici mostra il **volume** (il numero di azioni scambiate in ogni periodo) come barre sotto il prezzo. Un grande movimento di prezzo con volumi alti ha coinvolto molti partecipanti; lo stesso movimento con volumi molto bassi ne ha coinvolti pochi. Il volume torna nelle lezioni sulle tendenze e sugli indicatori.

## Che cosa può rendere fuorviante un grafico

- **Prezzi rettificati e non rettificati:** dopo un frazionamento azionario, il prezzo dell'azione scende (per esempio da 100 € a 50 € dopo un frazionamento 2 per 1) senza che nessuno perda denaro. Le piattaforme di grafici di solito **rettificano** i prezzi precedenti così che il grafico non mostri un falso crollo. Alcune piattaforme offrono anche una rettifica per i dividendi. Controlla l'impostazione prima di confrontare prezzi vecchi e nuovi.
- **Fusi orari e sessioni:** una candela giornaliera copre la giornata di Borsa nel fuso orario della Borsa stessa. Alcune piattaforme mostrano anche candele **pre-market e after-hours** (vedi la categoria E).
- **Gap:** quando il periodo successivo apre lontano dalla chiusura precedente, per esempio dopo una notizia notturna, il grafico mostra uno spazio vuoto: un **gap**.
- **Dati differiti:** molte Borse fanno pagare i prezzi in tempo reale, quindi i grafici gratuiti sono spesso **differiti**, di un tempo che dipende dalla Borsa. Verifica se il tuo grafico è in tempo reale prima di fare affidamento sull'ultima candela.

> [!MISTAKE] «Il grafico mostra un crollo, quindi la società ha perso metà del suo valore»
> Controlla prima se c'è stato un frazionamento azionario. Se il grafico non è rettificato, un frazionamento 2 per 1 sembra un calo del 50%, anche se gli azionisti possiedono semplicemente il doppio delle azioni a metà prezzo.

## Punti chiave

> [!TAKEAWAYS]
> - Un grafico rappresenta il prezzo rispetto al tempo; i grafici a linea, a barre e a candele sono i tipi più comuni.
> - Le candele Heikin Ashi sono medie e non mostrano prezzi realmente scambiati.
> - Ogni candela rappresenta un periodo; il timeframe cambia ciò che vedi.
> - Una scala logaritmica mostra i movimenti percentuali nella loro vera dimensione, utile per periodi lunghi.
> - Controlla prezzi rettificati, fuso orario, sessioni e se i dati sono differiti.
