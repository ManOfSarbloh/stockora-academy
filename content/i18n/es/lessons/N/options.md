---
title: "Opciones: calls, puts y el precio de un derecho"
summary: Una opción da el derecho, pero no la obligación, de comprar o vender a un precio fijo. Los compradores pueden perder la prima; los vendedores, mucho más. Aprende las calls, las puts, los resultados al vencimiento, el apalancamiento y la trampa del paso del tiempo.
translatedFrom: 2026-10-11
---

Un **derivado** es un instrumento financiero cuyo valor se deriva de un activo subyacente, como una acción o un índice (Investor.gov). Las **opciones** están entre los derivados más antiguos y más negociados.

## La idea básica

Investor.gov define las opciones como contratos que dan al comprador **el derecho, pero no la obligación**, de comprar o vender un valor a un precio fijo dentro de un periodo concreto. El léxico de la Wiener Börse añade los términos clave:

- El comprador paga una **prima** por ese derecho.
- El precio fijo es el **precio de ejercicio** (strike).
- Una **call** es el derecho a **comprar**; una **put**, el derecho a **vender**.
- Las opciones de **estilo americano** pueden ejercerse durante todo su plazo; las de **estilo europeo**, solo al final.
- El **vendedor** (emisor, en alemán *Stillhalter*) recibe la prima y asume la **obligación**: entregar el subyacente (call) o comprarlo (put) si el comprador ejerce.

El léxico señala que una call que no se ejerce **vence sin valor**.

## Resultados al vencimiento

> [!EXAMPLE] Comprar una call
> Una acción cotiza a 100 €. Compras una call con precio de ejercicio de 100 € por una prima de **5 €** por acción, con vencimiento a tres meses.
>
> | Precio de la acción al vencimiento | Valor de la call | Tu resultado |
> |---:|---:|---:|
> | 80 € | 0 € | −5 € (−100 %) |
> | 100 € | 0 € | −5 € (−100 %) |
> | 105 € | 5 € | 0 € |
> | 120 € | 20 € | +15 € (+300 %) |
>
> La acción tiene que subir por encima de **105 €** (precio de ejercicio + prima) solo para quedar en tablas. Lo máximo que puedes perder es la prima.

> [!EXAMPLE] Comprar una put
> La misma acción a 100 €. Una put con precio de ejercicio de 100 € cuesta **4 €**.
> - Al vencimiento la acción está en 80 €: la put vale 20 €, tu resultado es **+16 €**.
> - Al vencimiento la acción está en 100 € o más: la put vence sin valor, resultado **−4 €**.
>
> Algunos inversores compran puts como **seguro** contra la caída de acciones que tienen, pagando la prima como si fuera la cuota de un seguro.

## Apalancamiento

El léxico de la Wiener Börse explica el **apalancamiento** (*Hebel*) de las opciones: su precio cambia en un porcentaje mucho mayor que el del subyacente, así que hace falta mucho menos capital para participar de un movimiento del precio. En el ejemplo de la call, una subida del 20 % de la acción se convirtió en una ganancia del **300 %**, pero un precio sin cambios supuso una pérdida del **100 %**.

## El tiempo juega en contra del comprador

Una opción tiene una vida limitada. Parte de su precio refleja el **tiempo** que le queda al subyacente para moverse. A medida que se acerca el vencimiento, ese valor temporal se reduce, así que una opción comprada puede perder valor aunque el precio de la acción no se mueva, y vence sin valor si el precio no se ha movido lo suficiente al vencimiento.

## Vender (emitir) opciones

El emisor cobra la prima, lo que parece un ingreso constante. Pero:

- Quien vende una call sin tener las acciones (una **call descubierta**) se enfrenta, en teoría, a **pérdidas ilimitadas** si el precio se dispara.
- Quien vende puts puede tener que comprar acciones muy por encima de su precio de mercado en un crac.
- Los emisores tienen que depositar **margen** (lección 3); el léxico de la Wiener Börse señala que en las opciones se exige margen por las posiciones vendidas.

> [!WARNING] Ganancias pequeñas y frecuentes, pérdidas raras y enormes
> Vender opciones suele dar muchas ganancias pequeñas seguidas de alguna pérdida muy grande. Las estrategias que «siempre funcionaron» pueden vaciar una cuenta en un solo golpe del mercado.

> [!AUSTRIA] Cómo acceder
> Las opciones son derivados, que no están entre los instrumentos «no complejos» que enumera el artículo 25, apartado 4, de MiFID II. Por eso una empresa que solo ejecuta tus órdenes debe, en general, evaluar si son **adecuadas** para ti según tus conocimientos y tu experiencia (categoría F). Los valores parecidos a opciones que emiten los bancos se llaman **warrants** (*Optionsscheine*, lección 9).

## Ideas clave

> [!TAKEAWAYS]
> - Una opción es un derecho, no una obligación, de comprar (call) o vender (put) al precio de ejercicio.
> - Los compradores pagan una prima y pueden perderla al 100 %; muchas opciones vencen sin valor.
> - Las opciones tienen un fuerte apalancamiento: pequeños movimientos de la acción provocan grandes movimientos de la opción.
> - El valor temporal se reduce a medida que se acerca el vencimiento.
> - Los emisores de opciones cobran la prima, pero pueden sufrir pérdidas muy grandes, incluso ilimitadas.
