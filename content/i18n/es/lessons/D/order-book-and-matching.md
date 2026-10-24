---
title: El libro de órdenes y cómo se casan las órdenes
summary: Toda bolsa lleva un libro de órdenes de compra y venta, ordenadas por precio y por tiempo. Entenderlo explica el precio de compra, el de venta, el diferencial y cómo se producen las operaciones.
translatedFrom: 2026-10-11
---

En el corazón de toda bolsa electrónica está el **libro de órdenes**: una lista de todas las órdenes de compra y venta que esperan ejecutarse. La Bolsa de Viena lo llama el corazón de la bolsa informática.

## Precio de compra y precio de venta

- Una orden de **compra** (en inglés «bid»; en alemán, Geld) dice: «Pagaré como máximo este precio».
- Una orden de **venta** (en inglés «ask» u «offer»; en alemán, Brief) dice: «Venderé como mínimo a este precio».

La orden de compra más alta es el **mejor precio de compra**; la orden de venta más baja es el **mejor precio de venta**. La diferencia entre los dos es el **diferencial** (spread u horquilla).

![Libro de órdenes: vendedores a 10,04 € (300 acciones), 10,03 € (500) y 10,02 € (200); compradores a 10,00 € (400), 9,99 € (600) y 9,98 € (1.000). El diferencial entre el mejor precio de compra, 10,00 €, y el mejor de venta, 10,02 €, es de 0,02 €](../../../../lessons/D/order-book.svg)

## Prioridad de precio y tiempo

Las órdenes del libro se ordenan con dos reglas:

1. **Primero el precio:** el mejor precio va primero. Para los compradores es la oferta más alta; para los vendedores, el precio más bajo.
2. **Después el tiempo:** entre órdenes con el mismo precio, va primero la que llegó antes.

Esto se llama **prioridad de precio y tiempo**. Premia a quien ofrece el mejor precio y, a igual precio, a quien llegó primero.

## Cómo se produce una operación

Mientras el mejor precio de compra esté por debajo del mejor de venta, no pasa nada: compradores y vendedores no se ponen de acuerdo. Hay operación cuando una orden nueva **cruza** el diferencial.

> [!EXAMPLE]
> El libro es como en la imagen de arriba: mejor precio de compra 10,00 €, mejor precio de venta 10,02 €.
>
> Envías una **orden de compra de 300 acciones hasta 10,03 €**. El motor de casamiento:
>
> 1. Toma primero la oferta más barata: **200 acciones a 10,02 €**.
> 2. Después la siguiente: **100 acciones a 10,03 €** (de las 500 disponibles a ese precio).
>
> Has comprado 300 acciones por 200 × 10,02 € + 100 × 10,03 € = 2.004 € + 1.003 € = **3.007 €**, una media de unos 10,023 € por acción. El libro muestra ahora 400 acciones todavía ofrecidas a 10,03 €, y el último precio negociado es 10,03 €.

Fíjate en que una orden grande «recorre» varios niveles de precio, por eso las órdenes grandes pueden mover el precio.

## Lo que te dice el diferencial

- Un **diferencial estrecho** (p. ej. 10,00 € / 10,01 €) suele significar muchos compradores y vendedores activos: la acción es **líquida**.
- Un **diferencial amplio** (p. ej. 4,80 € / 5,20 €) significa pocos participantes: negociar es más caro, porque comprar al precio de venta y vender de inmediato al de compra haría perder el diferencial.

> [!EXAMPLE]
> Compra 4,80 €, venta 5,20 €. Si compras 100 acciones a 5,20 € y las vendes de inmediato a 4,80 €, pierdes 100 × 0,40 € = **40 €**, antes de comisiones. Ese es el coste del diferencial.

> [!MISTAKE] «El precio que se muestra es el precio que obtendré»
> El «último precio» es el de la última operación. Cuando compras ahora, normalmente pagas el **precio de venta** actual; cuando vendes, obtienes el **precio de compra** actual. Y una orden grande puede ejecutarse solo en parte al mejor precio.

## Ideas clave

> [!TAKEAWAYS]
> - El libro de órdenes reúne todas las órdenes de compra y de venta que esperan.
> - Las órdenes se ordenan por prioridad de precio y tiempo: primero el mejor precio, después la más antigua.
> - Hay operación cuando una orden cruza el diferencial; las órdenes grandes pueden tomar varios niveles de precio.
> - El diferencial es un coste de negociar; los diferenciales estrechos suelen indicar una acción líquida.
