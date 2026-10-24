---
title: "Órdenes stop, stop limitadas y stop dinámicas"
summary: Las órdenes stop esperan en segundo plano y solo se activan cuando se alcanza un precio. Se usan a menudo para limitar pérdidas, pero no son una garantía.
translatedFrom: 2026-10-11
---

Una **orden stop** es una orden que duerme hasta que el precio alcanza un nivel que eliges, el **precio de activación** (stop). Entonces se despierta y se convierte en una orden normal. Las órdenes stop se usan a menudo para limitar pérdidas, por eso también se llaman **órdenes stop-loss**.

## Orden stop (stop-loss)

- Un **stop de venta** se coloca **por debajo** del precio actual. Si el precio cae hasta el precio de activación, se convierte en una **orden a mercado** de venta.
- Un **stop de compra** se coloca **por encima** del precio actual, por ejemplo para limitar las pérdidas de una posición corta.

> [!EXAMPLE]
> Tienes acciones a **40 €** y colocas un **stop de venta a 36 €**.
>
> - Si el precio cae a 36 €, tu stop se activa y se envía una orden a mercado de venta. Podrías vender a 35,95 €, o menos si los precios caen rápido.
> - Si el precio nunca llega a 36 €, no pasa nada.

**Importante:** el precio de activación es un disparador, no un precio garantizado al que vayas a vender. Si el mercado abre muy por debajo de tu stop (un **hueco**), tu orden a mercado se ejecuta al precio mucho más bajo.

> [!EXAMPLE]
> Tu stop de venta está en 36 €. Durante la noche, la empresa anuncia una mala noticia. A la mañana siguiente la acción abre a **30 €**. Tu stop se activa y vendes a unos 30 €, no a 36 €.

## Orden stop limitada

Una **orden stop limitada** tiene dos precios: un precio de activación que la pone en marcha y un precio límite. Cuando se activa, se convierte en una **orden limitada**. Eso te protege de vender muy por debajo de tu límite, pero significa que la orden **puede no ejecutarse** si el precio cae por debajo del límite.

> [!EXAMPLE]
> Stop limitada de venta: activación **36 €**, límite **35 €**. Si el precio cae a 36 €, se coloca una orden limitada de venta a 35 €. Si el precio salta a 30 €, tu orden no se ejecuta y sigues teniendo las acciones mientras siguen cayendo.

## Orden stop dinámica

Un **stop dinámico** (trailing stop) fija el precio de activación como una cantidad o un porcentaje fijos **por debajo del precio máximo** alcanzado desde que diste la orden. Cuando el precio sube, el stop sube; cuando el precio baja, se queda donde está.

> [!EXAMPLE]
> Compras a **20 €** y fijas un stop dinámico de **1 €**. La acción sube a **24 €**, así que el stop sube a **23 €**. Después el precio retrocede: a 23 € el stop se activa y se envía una orden de venta.

## Qué comprobar

Según la SEC, no todos los brókeres ofrecen todos estos tipos de orden, y pueden diferir en qué activa un stop (la última operación o las cotizaciones actuales). Las oscilaciones de precio a corto plazo también pueden activar un stop y vender tus acciones justo antes de que el precio se recupere.

> [!MISTAKE] «Un stop-loss garantiza que no puedo perder más de un 10 %»
> Un stop-loss solo limita las pérdidas si el mercado atraviesa tu precio de activación de forma ordenada. Los huecos, los mercados rápidos y las acciones ilíquidas pueden llevar a ventas muy por debajo de tu stop, y una orden stop limitada puede no ejecutarse.

## Ideas clave

> [!TAKEAWAYS]
> - Una orden stop se convierte en una orden a mercado al alcanzarse el precio de activación; una stop limitada se convierte en una orden limitada.
> - El precio de activación es un disparador, no un precio de ejecución garantizado; los huecos pueden llevar a precios mucho peores.
> - Las órdenes stop limitadas protegen el precio, pero pueden no ejecutarse.
> - Los stops dinámicos suben con el precio, pero nunca bajan.
