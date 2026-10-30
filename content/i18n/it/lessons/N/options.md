---
title: "Le opzioni: call, put e il prezzo di un diritto"
summary: "Un'opzione dà il diritto, ma non l'obbligo, di comprare o vendere a un prezzo fisso. Chi la compra può perdere il premio; chi la vende può perdere molto di più. Impara call, put, risultati alla scadenza, leva e la trappola del decadimento temporale."
translatedFrom: 2026-10-11
---

Un **derivato** è uno strumento finanziario il cui valore deriva da un'attività sottostante, come un'azione o un indice (Investor.gov). Le **opzioni** sono tra i derivati più antichi e più negoziati.

## L'idea di base

Investor.gov definisce le opzioni come contratti che danno a chi le compra **il diritto, ma non l'obbligo**, di comprare o vendere un titolo a un prezzo fisso entro un periodo determinato. Il lessico della Wiener Börse aggiunge i termini chiave:

- Chi compra paga un **premio** per questo diritto.
- Il prezzo fisso è il **prezzo di esercizio** (strike).
- Una **call** è il diritto di **comprare**; una **put** è il diritto di **vendere**.
- Le opzioni **americane** possono essere esercitate per tutta la durata, quelle **europee** solo alla fine.
- Il **venditore** (writer, *Stillhalter*) incassa il premio e si assume l'**obbligo**: consegnare il sottostante (call) o comprarlo (put) se chi ha comprato l'opzione la esercita.

Il lessico osserva che una call non esercitata **scade senza valore**.

## I risultati alla scadenza

> [!EXAMPLE] Comprare una call
> Un'azione quota 100 €. Compri una call con strike 100 € per un premio di **5 €** per azione, con scadenza tra tre mesi.
>
> | Prezzo dell'azione alla scadenza | Valore della call | Il tuo risultato |
> |---:|---:|---:|
> | 80 € | 0 € | −5 € (−100%) |
> | 100 € | 0 € | −5 € (−100%) |
> | 105 € | 5 € | 0 € |
> | 120 € | 20 € | +15 € (+300%) |
>
> L'azione deve salire sopra **105 €** (strike + premio) solo per andare in pari. Il massimo che puoi perdere è il premio.

> [!EXAMPLE] Comprare una put
> Stessa azione a 100 €. Una put con strike 100 € costa **4 €**.
> - Alla scadenza l'azione è a 80 €: la put vale 20 €, risultato **+16 €**.
> - Alla scadenza l'azione è a 100 € o più: la put scade senza valore, risultato **−4 €**.
>
> Alcuni investitori comprano put come **assicurazione** contro il calo di azioni che possiedono, pagando il premio come un premio assicurativo.

## La leva

Il lessico della Wiener Börse spiega la **leva** (*Hebel*) delle opzioni: i loro prezzi cambiano di una percentuale molto più grande del sottostante, quindi serve molto meno capitale per partecipare a un movimento di prezzo. Nell'esempio della call, un rialzo del 20% dell'azione si è trasformato in un guadagno del **300%**, ma un prezzo invariato ha significato una perdita del **100%**.

## Il tempo lavora contro chi compra

Un'opzione ha una vita limitata. Parte del suo prezzo riflette il **tempo** che resta perché il sottostante si muova. Avvicinandosi la scadenza, quel valore temporale si riduce, quindi un'opzione comprata può perdere valore anche se il prezzo dell'azione non si muove, e scade senza valore se entro la scadenza il prezzo non si è mosso abbastanza.

## Vendere (scrivere) opzioni

Chi vende opzioni incassa il premio, il che sembra un reddito regolare. Ma:

- Chi vende una call senza possedere le azioni (una **call scoperta**) rischia, in teoria, **perdite illimitate** se il prezzo vola.
- Chi vende put può dover comprare azioni molto sopra il loro prezzo di mercato in un crollo.
- Chi vende opzioni deve versare un **margine** (lezione 3); il lessico della Wiener Börse osserva che per le opzioni il margine è richiesto per le posizioni corte.

> [!WARNING] Piccoli guadagni regolari e rare perdite enormi
> Vendere opzioni produce spesso molte piccole vincite seguite da una perdita occasionale molto grande. Strategie che «hanno sempre funzionato» possono azzerare un conto in un solo shock di mercato.

> [!AUSTRIA] Ottenere l'accesso
> Le opzioni sono derivati, che non rientrano tra gli strumenti «non complessi» elencati nell'articolo 25, paragrafo 4, della MiFID II. Un'impresa che si limita a eseguire i tuoi ordini deve quindi in genere valutare se sono **appropriate** per te, in base alle tue conoscenze ed esperienze (categoria F). I titoli simili a opzioni emessi dalle banche si chiamano **warrant** (*Optionsscheine*, lezione 9).

## Punti chiave

> [!TAKEAWAYS]
> - Un'opzione è un diritto, non un obbligo, di comprare (call) o vendere (put) al prezzo di esercizio.
> - Chi compra paga un premio e può perderlo al 100%; molte opzioni scadono senza valore.
> - Le opzioni hanno una leva forte: piccoli movimenti dell'azione causano grandi movimenti dell'opzione.
> - Il valore temporale si riduce avvicinandosi la scadenza.
> - Chi vende opzioni incassa il premio ma può subire perdite molto grandi, perfino illimitate.
