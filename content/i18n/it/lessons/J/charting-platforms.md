---
title: "Come funziona una piattaforma di grafici come TradingView"
summary: "Un giro neutrale in una tipica piattaforma di grafici, con TradingView come esempio noto: simboli, impostazioni, indicatori, strumenti di disegno, avvisi, replay, screener, trading simulato, script, idee della community e rischi."
translatedFrom: 2026-10-11
---

Le piattaforme di grafici sono tutte un po' diverse, ma condividono gli stessi elementi di base. Usiamo **TradingView** come esempio perché è molto conosciuta. Gli stessi concetti valgono per i grafici nell'app del tuo broker o su qualsiasi altra piattaforma.

> [!NOTE] Descrizione neutrale, nessuna raccomandazione
> Stockora Academy non ha alcun legame con TradingView o con altre piattaforme, non usa link di affiliazione e non raccomanda alcuna piattaforma né alcun piano. Funzioni e prezzi cambiano: controlla il [sito ufficiale](https://www.tradingview.com/) per la situazione attuale. L'illustrazione qui sotto è un nostro schizzo, non uno screenshot.

## Che cos'è

TradingView è una piattaforma web di grafici e analisi dei mercati, con app per dispositivi mobili e desktop. Copre azioni, indici, valute, cripto e future, e ha un lato social in cui gli utenti pubblicano le proprie analisi dei grafici («idee»).

## L'interfaccia

![Schizzo di una tipica piattaforma di grafici: barra degli strumenti in alto, strumenti di disegno a sinistra, grafico e volume al centro, pannelli a destra e in basso](../../../../lessons/J/img/platform-layout.svg)

- **Barra superiore:** ricerca dei simboli, selettore del timeframe, tipo di grafico, indicatori, avvisi, replay, layout.
- **Barra sinistra:** strumenti di disegno.
- **Area del grafico:** candele, un riquadro del volume, un mirino che segue il mouse e le scale di prezzo e tempo.
- **Pannello destro:** watchlist, avvisi, notizie e dettagli sul simbolo.
- **Pannello inferiore:** screener, editor di script, tester di strategie (strategy report), trading simulato e collegamenti ai broker.

## Simboli e dati

- **Prefisso della Borsa:** i simboli possono avere un prefisso della Borsa, come `NASDAQ:AAPL`. La stessa società può essere scambiata su più Borse e in valute diverse, quindi verifica quale quotazione stai guardando.
- **Differiti o in tempo reale:** la maggior parte delle Borse azionarie e dei future fa pagare i dati in tempo reale, quindi i dati di molte Borse sono **differiti** a meno che tu non acquisti un pacchetto dati. TradingView afferma che i suoi piani a pagamento non coprono queste commissioni delle Borse. Se paghi già i dati in tempo reale tramite un broker, in alcuni casi puoi usarli sulla piattaforma.
- **Fonte dei dati:** per impostazione predefinita, TradingView mostra i prezzi delle azioni statunitensi forniti da Cboe, che possono differire leggermente da quelli delle Borse principali.

## Impostazioni del grafico da controllare

Colori delle candele, scala lineare o logaritmica, rettifica per frazionamenti e dividendi, **fuso orario** del grafico, sessioni estese e pause tra le sessioni. Un grafico nel fuso orario sbagliato o con prezzi non rettificati può apparire molto diverso.

## Indicatori e script

- Una libreria integrata di indicatori (medie mobili, RSI, MACD, bande di Bollinger e molti altri), ciascuno con impostazioni regolabili come la lunghezza e il prezzo di riferimento.
- **Pine Script** è il linguaggio di programmazione della piattaforma per indicatori e strategie personalizzati, scritto in un editor nel pannello inferiore. Molti **script della community** sono pubblicati dagli utenti. La loro qualità varia, e uno script non è un consiglio.
- Il **tester di strategie (strategy report)** mostra come si sarebbe comportata una strategia programmata sui dati passati, con tutte le trappole del backtesting della lezione 9.

## Strumenti di disegno

Linee di tendenza, linee orizzontali e semirette, canali paralleli, rettangoli per le zone, ritracciamenti di Fibonacci, uno strumento di misura, **strumenti di posizione long/short** che mostrano rischio e rendimento previsti di un'operazione, note di testo e VWAP ancorato.

## Avvisi

Gli avvisi ti mandano una notifica quando si verifica una condizione su un prezzo o un indicatore, per esempio quando un prezzo attraversa un livello. Utili per non dover guardare lo schermo, ma molti avvisi possono anche portare a **operare troppo e alla FOMO**.

## Modalità replay

Il **bar replay** riproduce le candele passate una alla volta a partire da un punto che scegli tu, così puoi esercitarti a leggere i grafici senza sapere che cosa viene dopo.

## Screener, watchlist e layout

Watchlist, layout con più grafici e mirino sincronizzato, modelli salvati e uno **screener** che filtra i mercati in base a criteri come valore di mercato, rapporto P/E o volume. Il risultato di uno screener è un elenco che corrisponde ai tuoi filtri, non una raccomandazione.

## Trading simulato e collegamenti ai broker

- **Trading simulato (paper trading):** un conto simulato con denaro virtuale, disponibile per tutti gli utenti secondo TradingView.
- **Collegamenti ai broker:** alcuni broker possono essere collegati in modo da inserire gli ordini dal grafico. È comodo, ma rende anche il trading molto rapido e facile, comprese le operazioni impulsive. Verifica chi è il tuo broker, dove è vigilato e quanto costa (categoria F).

## Le idee della community

Gli utenti pubblicano le proprie analisi dei grafici come **idee**, che vengono mostrate ai loro follower e a chi segue il simbolo; quelle popolari arrivano in prima pagina. Leggile con attenzione: la popolarità non è precisione, e i feed social vengono usati anche per **hype, vendita di «segnali» e truffe** (vedi la sezione [Anti-truffa](/scams)).

## Piani

C'è un piano gratuito e diversi piani a pagamento con più funzioni. Quale ti serva, se te ne serve uno, lo decidi tu; controlla sul sito ufficiale le differenze attuali. I dati in tempo reale di molte Borse costano in più rispetto al piano.

## Rischi e limiti

- dati differiti scambiati per prezzi in tempo reale;
- il fuso orario sbagliato o prezzi non rettificati;
- indicatori che si **ridisegnano** (repainting) riscrivendo i propri segnali passati;
- backtest sovra-ottimizzati nel tester di strategie;
- troppi avvisi e FOMO da feed social.

> [!MISTAKE] «Quest'idea ha migliaia di like, quindi deve essere giusta»
> Le idee sono opinioni. Le idee popolari non vengono verificate, e i grafici pubblicati sono facili da selezionare a posteriori.

**Prova il percorso guidato:** il [Laboratorio grafici](/charts/lab) ha gli stessi elementi di base (tipi di grafico, timeframe, indicatori, strumenti di disegno, replay) e un giro «leggi questo grafico passo dopo passo» che segue la lista di controllo della lezione 9.

## Punti chiave

> [!TAKEAWAYS]
> - Le piattaforme di grafici hanno le stesse parti: ricerca dei simboli, timeframe, tipi di grafico, indicatori, strumenti di disegno, avvisi, replay, screener e pannelli.
> - Controlla prefisso della Borsa, valuta, fuso orario, impostazioni di rettifica e se i dati sono differiti.
> - Gli script e le idee della community non sono consigli; la qualità varia e l'hype è frequente.
> - Replay e trading simulato servono per esercitarsi; backtest e avvisi hanno i loro rischi.
> - Descriviamo TradingView solo come esempio; funzioni e prezzi cambiano, quindi controlla il sito ufficiale.
