---
title: "Il book di negoziazione e come vengono abbinati gli ordini"
summary: "Ogni Borsa tiene un book di negoziazione con gli ordini di acquisto e di vendita, ordinati per prezzo e per tempo. Capirlo spiega prezzo denaro, prezzo lettera, spread e come avvengono gli scambi."
translatedFrom: 2026-10-11
---

Al centro di ogni Borsa elettronica c'è il **book di negoziazione**: l'elenco di tutti gli ordini di acquisto e di vendita in attesa di esecuzione. La Borsa di Vienna lo definisce il cuore della Borsa informatizzata.

## Denaro e lettera

- Il **prezzo denaro** (bid; in tedesco: Geld) è un ordine di **acquisto**: «pago al massimo questo prezzo».
- Il **prezzo lettera** (ask o offer; in tedesco: Brief) è un ordine di **vendita**: «vendo ad almeno questo prezzo».

Il prezzo denaro più alto è il **miglior prezzo denaro**; il prezzo lettera più basso è il **miglior prezzo lettera**. La differenza tra i due è lo **spread**.

![Book di negoziazione: venditori a 10,04 € (300 azioni), 10,03 € (500), 10,02 € (200); compratori a 10,00 € (400), 9,99 € (600), 9,98 € (1.000). Lo spread tra il miglior denaro di 10,00 € e la miglior lettera di 10,02 € è di 0,02 €](../../../../lessons/D/order-book.svg)

## La priorità prezzo-tempo

Gli ordini nel book sono ordinati secondo due regole:

1. **Prima il prezzo:** viene prima il prezzo migliore. Per i compratori è il prezzo denaro più alto; per i venditori il prezzo lettera più basso.
2. **Poi il tempo:** tra gli ordini allo stesso prezzo, viene prima quello arrivato per primo.

È la **priorità prezzo-tempo**. Premia chi offre il prezzo migliore e, a parità di prezzo, chi è arrivato per primo.

## Come avviene uno scambio

Finché il miglior prezzo denaro resta sotto il miglior prezzo lettera, non succede nulla: compratori e venditori non sono d'accordo. Uno scambio avviene quando un nuovo ordine **attraversa** lo spread.

> [!EXAMPLE]
> Il book è come nell'immagine qui sopra: miglior denaro 10,00 €, miglior lettera 10,02 €.
>
> Invii un **ordine di acquisto di 300 azioni fino a 10,03 €**. Il motore di abbinamento:
>
> 1. Prende prima l'offerta più economica: **200 azioni a 10,02 €**.
> 2. Poi la successiva: **100 azioni a 10,03 €** (delle 500 disponibili a quel prezzo).
>
> Hai comprato 300 azioni per 200 × 10,02 € + 100 × 10,03 € = 2.004 € + 1.003 € = **3.007 €**, in media circa 10,023 € per azione. Il book mostra ora 400 azioni ancora offerte a 10,03 €, e l'ultimo prezzo scambiato è 10,03 €.

Nota che un ordine grande «attraversa» diversi livelli di prezzo: per questo i grandi ordini possono muovere il prezzo.

## Che cosa ti dice lo spread

- Uno **spread stretto** (per esempio 10,00 € / 10,01 €) di solito significa molti compratori e venditori attivi: l'azione è **liquida**.
- Uno **spread ampio** (per esempio 4,80 € / 5,20 €) significa pochi partecipanti: negoziare costa di più, perché comprare alla lettera e rivendere subito al denaro farebbe perdere lo spread.

> [!EXAMPLE]
> Denaro 4,80 €, lettera 5,20 €. Se compri 100 azioni a 5,20 € e le rivendi subito a 4,80 €, perdi 100 × 0,40 € = **40 €**, prima di qualsiasi commissione. È il costo dello spread.

> [!MISTAKE] «Il prezzo mostrato è il prezzo che otterrò»
> L'«ultimo prezzo» è quello dell'ultimo scambio. Quando compri adesso, di solito paghi il **prezzo lettera** attuale; quando vendi, ricevi il **prezzo denaro** attuale. E un ordine grande può essere eseguito solo in parte al prezzo migliore.

## Punti chiave

> [!TAKEAWAYS]
> - Il book di negoziazione raccoglie tutti gli ordini di acquisto (denaro) e di vendita (lettera) in attesa.
> - Gli ordini sono ordinati secondo la priorità prezzo-tempo: prima il prezzo migliore, poi il più vecchio.
> - Uno scambio avviene quando un ordine attraversa lo spread; i grandi ordini possono prendere diversi livelli di prezzo.
> - Lo spread è un costo della negoziazione; spread stretti indicano di solito un'azione liquida.
