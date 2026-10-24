---
title: "Cuánto dura una orden: diaria, GTC, IOC y FOK"
summary: Además de condiciones de precio, las órdenes tienen condiciones de tiempo. Deciden si una orden no ejecutada se cancela al final del día, sigue abierta o debe ejecutarse al instante.
translatedFrom: 2026-10-11
---

Toda orden tiene una **validez**: cuánto tiempo sigue activa si no se ejecuta de inmediato. Equivocarse con esto es un motivo habitual por el que las órdenes «desaparecen» o, peor, se ejecutan semanas después, cuando ya no te lo esperas.

## Plazos de validez habituales

| Validez | Qué significa |
|---|---|
| **Orden diaria** | Válida solo durante la sesión en que se introduce. Si no se ejecuta, en general se cancela al final del horario normal de negociación. |
| **Válida hasta su cancelación (GTC, good-till-cancelled)** | Sigue abierta hasta que se ejecuta o la cancelas. Los brókeres suelen fijar un plazo máximo; pregunta al tuyo. |
| **Válida hasta una fecha** | Sigue abierta hasta la fecha que elijas. |
| **Ejecutar o anular (IOC, immediate-or-cancel)** | Debe ejecutarse al instante; la parte que no puede ejecutarse en ese momento se cancela. |
| **Todo o nada (FOK, fill-or-kill)** | Debe ejecutarse al instante **por completo**; si no, se cancela toda la orden (sin ejecuciones parciales). |

> [!EXAMPLE]
> Das una orden limitada de compra GTC a **45 €** sobre una acción que cotiza a 50 €, y te olvidas de ella. Tres meses después, tras una mala noticia, el precio cae a 45 € y tu orden se ejecuta. Ahora tienes acciones que en ese momento ya no querías comprar.

> [!EXAMPLE]
> Quieres exactamente 1.000 acciones, ni una menos. Con **todo o nada (FOK)**, o se compran las 1.000 al instante o ninguna. Con **ejecutar o anular (IOC)**, puede que obtengas 400 ahora y el resto se cancele.

## Consejos

- Revisa con regularidad tus **órdenes abiertas**, sobre todo las GTC.
- Infórmate de si la validez por defecto de tu bróker es «diaria» o «hasta su cancelación».
- Pregunta a tu bróker qué pasa con tus órdenes abiertas ante acontecimientos como un split.

> [!MISTAKE] «Mi orden no se ejecutó hoy, así que ya no existe»
> No necesariamente. Si era válida hasta su cancelación, sigue esperando en el mercado y puede ejecutarse en cualquier momento.

## Ideas clave

> [!TAKEAWAYS]
> - Las órdenes diarias caducan al final de la sesión; las GTC siguen abiertas hasta que se ejecutan o se cancelan.
> - IOC ejecuta lo que puede al instante y cancela el resto; FOK se ejecuta entera al momento o no se ejecuta.
> - Revisa tus órdenes abiertas con regularidad para evitar ejecuciones sorpresa.
