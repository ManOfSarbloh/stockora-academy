---
title: Órdenes a mercado y órdenes limitadas
summary: Los dos tipos básicos de orden. Una orden a mercado garantiza la ejecución pero no el precio; una orden limitada garantiza el precio (o uno mejor) pero no la ejecución.
translatedFrom: 2026-10-11
---

Cuando compras o vendes una acción, no dices solo «compra». Eliges un **tipo de orden** que le dice al mercado cómo ejecutarla. Los dos más importantes son la **orden a mercado** y la **orden limitada**.

## Orden a mercado

Una **orden a mercado** dice: «compra (o vende) ahora, al mejor precio disponible en este momento».

- **La ejecución está (casi) garantizada**, siempre que haya vendedores o compradores.
- **El precio no está garantizado.** Una orden a mercado de compra suele ejecutarse en torno al **precio de venta** actual, y una de venta en torno al **precio de compra** actual, pero el precio que obtienes puede ser distinto del último que viste, sobre todo si los precios se mueven rápido o el libro de órdenes es poco profundo.

La diferencia entre el precio que esperabas y el que obtuviste se llama **deslizamiento** (slippage).

> [!EXAMPLE]
> Ves un último precio de **20,00 €** y envías una orden a mercado para comprar **500 acciones**. El libro ofrece 200 acciones a 20,02 € y 300 a 20,10 €.
>
> Compras 200 × 20,02 € + 300 × 20,10 € = 4.004 € + 6.030 € = **10.034 €**, una media de unos **20,07 €** por acción, no 20,00 €. El deslizamiento te ha costado unos 34 €.

> [!ANIMATION] market-order-fill
> Una orden a mercado de 500 acciones toma las 200 acciones ofrecidas a 20,02 € y después las 300 a 20,10 €: 10.034 € en total, unos 20,07 € por acción en lugar de 20,00 €.

## Orden limitada

Una **orden limitada** dice: «compra a este precio **o menos**» (o «vende a este precio **o más**»).

- **El precio está protegido:** una orden limitada de compra a 50 € solo puede ejecutarse a 50 € o menos.
- **La ejecución no está garantizada:** si el mercado nunca llega a tu límite, no pasa nada.

> [!EXAMPLE]
> Una acción cotiza a **52 €**. Das una **orden limitada de compra a 50 €**.
>
> - Si el precio baja a 50 € o menos y hay vendedores, tu orden se ejecuta a 50 € o menos.
> - Si el precio nunca baja tanto, tu orden se queda sin ejecutar, y puedes «perderte» una subida a 60 €.

> [!ANIMATION] limit-order
> La misma orden limitada de compra a 50 €, con dos desenlaces posibles: el precio baja hasta tu límite y la orden se ejecuta, o nunca llega y la orden espera mientras el precio sube a 60 €.

## Ejecuciones parciales

Las órdenes pueden **ejecutarse en parte**: si quieres 1.000 acciones con un límite de 50 € pero solo se ofrecen 300 a ese precio, puede que compres 300 ahora y las 700 restantes más tarde, o nunca. Algunos brókeres cobran una comisión por cada ejecución parcial, así que revisa su lista de precios.

## ¿Cuál usar?

| | Orden a mercado | Orden limitada |
|---|---|---|
| ¿Garantiza la ejecución? | Normalmente sí | No |
| ¿Garantiza el precio? | No | Sí (el límite o uno mejor) |
| Adecuada para | Acciones muy líquidas, órdenes pequeñas, cuando importa la rapidez | Acciones menos líquidas, órdenes grandes, momentos volátiles, fuera del horario normal |

> [!MISTAKE] «Una orden a mercado se ejecuta al precio de mi pantalla»
> El precio de tu pantalla es la última operación. Una orden a mercado se ejecuta al mejor precio disponible cuando llega al mercado, que puede ser bastante distinto, sobre todo en la apertura, en mercados poco profundos o cuando salta una noticia.

## Ideas clave

> [!TAKEAWAYS]
> - Las órdenes a mercado garantizan la ejecución, no el precio; las limitadas garantizan el precio, no la ejecución.
> - El deslizamiento es la diferencia entre el precio que esperabas y el que obtuviste.
> - Las órdenes grandes pueden ejecutarse a varios precios o solo en parte.
> - Las órdenes limitadas te protegen en mercados ilíquidos o que se mueven rápido.
