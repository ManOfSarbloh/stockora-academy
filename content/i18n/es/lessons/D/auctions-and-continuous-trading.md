---
title: Subastas y negociación continua
summary: Las bolsas combinan la negociación continua durante el día con subastas en la apertura, a veces a mediodía y en el cierre. Las subastas reúnen órdenes y encuentran un único precio para todas.
translatedFrom: 2026-10-11
---

Una bolsa puede casar órdenes de dos formas básicas: de forma **continua**, una operación tras otra a medida que llegan las órdenes, o en una **subasta**, donde las órdenes se reúnen durante un tiempo y después se casan todas a la vez a un único precio. La mayoría de las bolsas con acciones líquidas usan las dos.

## Negociación continua

Durante la negociación continua, cada orden que llega se compara de inmediato con el libro de órdenes. Si puede casarse, se ejecuta al momento; si no, espera en el libro. Los precios pueden cambiar con cada operación.

## Subastas

Una subasta tiene dos pasos:

1. **Fase de llamada:** se reúnen órdenes. Los participantes pueden introducir, modificar o borrar órdenes, pero todavía no se negocia nada. Normalmente se muestra un precio *indicativo*, para que todos vean dónde acabaría ahora la subasta. En la Bolsa de Viena, la fase de llamada termina en un momento aleatorio tras una duración mínima, lo que dificulta manipular el resultado.
2. **Fijación del precio:** el sistema calcula el único precio al que se puede negociar el **mayor número de acciones** y ejecuta a ese precio todas las órdenes que casan.

> [!EXAMPLE]
> En una subasta de apertura se han reunido estas órdenes:
>
> | Precio | Acciones que comprarían los compradores a este precio | Acciones que venderían los vendedores a este precio |
> |---|---|---|
> | 20,20 € | 300 | 1.500 |
> | 20,10 € | 700 | 1.000 |
> | 20,00 € | 1.000 | 800 |
> | 19,90 € | 1.600 | 400 |
>
> A **20,00 €**, los compradores quieren 1.000 y los vendedores ofrecen 800, así que se pueden negociar **800 acciones**. A 20,10 € solo se podrían negociar 700 (limitado por los compradores), a 19,90 € solo 400 (limitado por los vendedores). Así que el precio de la subasta es **20,00 €**, y 800 acciones cambian de manos a ese único precio.

> [!ANIMATION] opening-auction
> La misma subasta en barras: a cada precio, cuánto comprarían los compradores y cuánto venderían los vendedores. 20,00 € permite negociar más acciones (800), así que todos negocian a 20,00 €.

## Por qué se usan subastas en la apertura y el cierre

- **Subasta de apertura:** durante la noche se acumulan noticias. Reunir primero las órdenes y encontrar un único precio de apertura justo evita un comienzo caótico.
- **Subasta de cierre:** muchos inversores y fondos quieren negociar al **precio de cierre** oficial, que también se usa para valorar carteras y calcular índices. Una subasta concentra sus órdenes en un precio sólido.
- **Subasta intradía:** algunos mercados añaden una subasta corta a mitad del día para concentrar la liquidez.

> [!AUSTRIA]
> En la Bolsa de Viena, las acciones del índice ATX se negocian así en un día normal: **subasta de apertura 08:55–09:00**, negociación continua **09:00–12:00**, subasta intradía **12:00–12:03**, negociación continua **12:03–17:30**, **subasta de cierre 17:30–17:35**, seguida del «trade at close» hasta las 17:45, en el que las órdenes pueden ejecutarse al precio de cierre. Las acciones menos líquidas pueden negociarse solo en subastas.

> [!VERIFY]
> Los horarios y las fases de negociación cambian de vez en cuando y varían según el segmento. Consulta la página oficial de horarios de la bolsa antes de fiarte de horas exactas. La sección Horarios de este sitio muestra en directo si un mercado está abierto o cerrado.

> [!MISTAKE] «Mi orden de las 08:56 se ejecutará al instante»
> Durante la fase de llamada de una subasta, las órdenes solo se reúnen. Tu orden se ejecuta (si se ejecuta) cuando se fija el precio de la subasta, a ese precio, no en el momento en que la enviaste.

## Ideas clave

> [!TAKEAWAYS]
> - La negociación continua casa las órdenes de inmediato a medida que llegan.
> - Las subastas reúnen órdenes en una fase de llamada y después las negocian todas a un único precio.
> - El precio de la subasta es aquel al que se puede negociar el mayor número de acciones.
> - Las subastas de apertura y cierre crean precios justos y sólidos al principio y al final del día.
