---
title: "Una routine per leggere i grafici, l'analisi multi-timeframe e il backtesting"
summary: "Una lista di controllo passo dopo passo per leggere qualsiasi grafico, dall'alto verso il basso, dal settimanale all'orario, più le trappole del backtesting e perché viene prima la pratica con denaro finto."
translatedFrom: 2026-10-11
---

Ora conosci gli elementi di base. Questa lezione li mette insieme in una routine che puoi usare su qualsiasi grafico, e spiega perché verificare le idee su dati passati è più difficile di quanto sembri.

## Dall'alto verso il basso: dal quadro generale al dettaglio

Guarda lo stesso mercato su più timeframe, partendo da quello più lungo:

1. **Settimanale:** qual è la tendenza di lungo periodo? Dove sono i principali massimi e minimi?
2. **Giornaliero:** la struttura di medio periodo è coerente con il quadro settimanale? Dove sono le zone di supporto e resistenza più vicine?
3. **Orario (o più breve):** solo se il tuo piano lo richiede, per i dettagli intorno a un livello specifico.

Il timeframe più lungo dà il contesto; quello più breve mostra il dettaglio. Un segnale di acquisto sul grafico a 5 minuti contro una chiara tendenza ribassista settimanale è una situazione molto diversa da uno nella direzione della tendenza settimanale.

## Una lista di controllo per principianti

> [!TIP] Nove passi per leggere un grafico
> 1. **Verifica che cosa stai guardando:** simbolo, Borsa, valuta, e se i dati sono in tempo reale o differiti.
> 2. **Scegli il timeframe** adatto al tuo obiettivo (chi investe a lungo termine non ha bisogno di candele a 1 minuto).
> 3. **Leggi la struttura della tendenza:** massimi e minimi crescenti, massimi e minimi decrescenti, o una fase laterale?
> 4. **Segna le zone di supporto e resistenza.**
> 5. **Guarda le ultime candele** in quel contesto.
> 6. **Controlla il volume:** un movimento è sostenuto da un'attività insolita?
> 7. **Aggiungi al massimo uno o due indicatori**, e sappi che cosa misurano.
> 8. **Scrivi che cosa dimostrerebbe che hai torto:** il prezzo al quale la tua lettura non regge più.
> 9. **Accetta che «nessuna operazione» sia una decisione valida.** La maggior parte delle volte un grafico non offre un quadro chiaro.

## Il backtesting e le sue trappole

Il **backtesting** consiste nel verificare come si sarebbe comportato un insieme di regole sui dati passati. È utile per scartare le cattive idee, ma produce facilmente risultati che sembrano migliori della realtà:

- **Sovra-adattamento (curve fitting):** ritoccare le regole finché non si adattano perfettamente al passato. Regole del genere di solito falliscono sui dati nuovi.
- **Data snooping:** verificare molte regole e tenere solo la migliore. Park e Irwin (2007) indicano il data snooping e la scelta delle regole dopo aver visto i risultati come problemi comuni della ricerca sull'analisi tecnica.
- **Distorsione da sopravvivenza:** verificare solo le società che esistono ancora oggi ignora quelle fallite o tolte dal listino, il che fa sembrare migliori i risultati.
- **Ignorare i costi:** commissioni, spread, slippage e imposte possono trasformare un piccolo vantaggio in una perdita (categoria G).
- **Distorsione da informazioni future (look-ahead bias):** usare per sbaglio informazioni che all'epoca non erano disponibili (per esempio un prezzo di chiusura prima della chiusura).

## Prima la pratica: replay e trading simulato

Molte piattaforme di grafici offrono una **modalità replay** che riproduce le candele passate una alla volta, e il **trading simulato** (paper trading): un conto simulato con denaro virtuale. Entrambi ti permettono di esercitarti a leggere i grafici e a seguire le tue regole senza rischiare denaro. I risultati della pratica però sono lusinghieri: non ci sono emozioni vere, e le esecuzioni simulate possono essere migliori di quelle reali.

> [!MISTAKE] «Il mio backtest ha reso il 300% all'anno, quindi la strategia funziona»
> Backtest spettacolari sono quasi sempre un segnale d'allarme di sovra-adattamento, distorsione da sopravvivenza o costi mancanti. Verifica su dati che le regole non hanno mai visto, includi costi realistici e aspettati risultati reali peggiori.

Esercitati con la routine nel [Laboratorio grafici](/charts/lab): cambia timeframe, usa la modalità replay e gioca a «scopri la prossima candela».

## Punti chiave

> [!TAKEAWAYS]
> - Leggi i grafici dall'alto verso il basso: settimanale per il contesto, giornaliero per la struttura, timeframe più brevi solo per i dettagli.
> - Segui una lista di controllo e scrivi che cosa dimostrerebbe che hai torto; «nessuna operazione» è un risultato valido.
> - I backtest soffrono di sovra-adattamento, data snooping, distorsione da sopravvivenza, distorsione da informazioni future e costi mancanti.
> - Esercitati con il replay e il trading simulato prima di rischiare denaro vero, e aspettati risultati reali peggiori.
