---
title: Circuit breakers, interrupciones por volatilidad y suspensiones de cotización
summary: Cuando los precios se mueven demasiado y demasiado rápido, las bolsas detienen la negociación para que todos tomen aliento. Así lo hacen Viena y EE. UU.
translatedFrom: 2026-10-11
---

A veces los precios se mueven con violencia: tras una noticia impactante, una orden equivocada o el pánico. Las bolsas tienen «frenos» incorporados que detienen la negociación cuando los precios se mueven demasiado y demasiado rápido. La idea no es impedir que los precios caigan, sino dar tiempo a todos para asimilar la información y reunir suficientes órdenes para un precio justo.

## Interrupciones por volatilidad en Viena

La Bolsa de Viena compara cada precio posible con dos **corredores de precios**:

- un **corredor dinámico** alrededor del último precio negociado, y
- un **corredor estático** alrededor del último precio de subasta.

Si el siguiente precio quedara **fuera** de un corredor, no se ejecuta. En su lugar, la negociación pasa a una **subasta** corta (una interrupción por volatilidad), por ejemplo de **2 minutos** en la negociación continua, para que se puedan reunir órdenes y fijar el precio de forma ordenada. Los corredores se fijan para cada valor según factores como su tipo, su liquidez y su volatilidad, y se revisan al menos una vez al mes.

> [!EXAMPLE]
> Una acción se negoció por última vez a **30,00 €** y su corredor dinámico es de ±2 % (de 29,40 € a 30,60 €). Llega una gran orden de venta que se ejecutaría a **28,90 €**.
>
> En lugar de negociar a 28,90 €, el sistema inicia una subasta corta. Los compradores que ven la caída pueden introducir órdenes; después la subasta encuentra un precio. Puede ser 29,20 €, o menos si de verdad no hay compradores, pero se encuentra de forma controlada y no porque una sola orden barra un libro vacío.

## Circuit breakers en Estados Unidos

EE. UU. tiene dos niveles de protección:

**1. Circuit breakers de todo el mercado**, basados en la caída del índice S&P 500 durante un día:

| Nivel | Caída del S&P 500 | Qué ocurre |
|---|---|---|
| Nivel 1 | 7 % | Pausa de 15 minutos de toda la negociación, si ocurre antes de las 15:25, hora de Nueva York |
| Nivel 2 | 13 % | Otra pausa de 15 minutos, si es antes de las 15:25 |
| Nivel 3 | 20 % | La negociación se detiene el resto del día |

**2. Limit up–limit down (LULD)** para acciones individuales: cada acción tiene bandas de precios; si una acción sale de su banda y no vuelve rápido, su negociación se detiene unos minutos.

## Suspensiones de cotización

Aparte de estos mecanismos automáticos, la negociación de una acción concreta también puede **detenerse o suspenderse**, por ejemplo cuando hay una noticia importante pendiente y el mercado necesita tiempo para recibirla. Tus órdenes pueden quedar entonces sin ejecutar hasta que se reanude la negociación.

> [!MISTAKE] «Un circuit breaker me protege de las pérdidas»
> Solo detiene la negociación. Cuando se reanuda, el precio puede seguir siendo mucho más bajo. Los circuit breakers buscan mercados ordenados, no impedir que los precios caigan.

## Ideas clave

> [!TAKEAWAYS]
> - Las bolsas detienen la negociación cuando los precios se mueven demasiado y demasiado rápido.
> - En Viena, los precios fuera de un corredor dinámico o estático activan una subasta corta (interrupción por volatilidad).
> - En EE. UU., los circuit breakers de todo el mercado saltan con caídas del S&P 500 del 7 %, el 13 % y el 20 %; el LULD detiene acciones individuales.
> - Las pausas ayudan a que los precios se formen de forma ordenada; no evitan las pérdidas.
