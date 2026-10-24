---
title: "Ticker, ISIN y WKN: cómo se identifica una acción"
summary: Cada acción tiene códigos que la identifican. Saber qué significa cada uno te ayuda a no comprar lo que no querías.
translatedFrom: 2026-10-11
---

Los nombres de las empresas no son lo bastante precisos para negociar: muchas empresas tienen nombres parecidos, una misma empresa puede tener varios tipos de acciones y la misma acción puede negociarse en distintos lugares. Por eso los valores se identifican con códigos. Te encontrarás con tres.

## El ticker

Un **ticker** (o símbolo bursátil) es un código corto, normalmente de unas pocas letras, que una bolsa usa para una acción cotizada. Es lo que ves en las pantallas de precios y en los gráficos.

Los tickers son prácticos, pero **no son únicos en el mundo**: cada bolsa asigna los suyos, así que la misma empresa puede tener tickers distintos en distintas bolsas, y las mismas letras pueden ser empresas distintas en bolsas distintas. Por eso las plataformas de gráficos suelen mostrar la bolsa delante del ticker, con un formato como `BOLSA:TICKER` (más sobre esto en la Escuela de gráficos).

## El ISIN: el identificador internacional

El **ISIN** (International Securities Identification Number) identifica un valor concreto en todo el mundo. Según la agencia austriaca de codificación OeKB, todos los valores que se negocian en bolsa necesitan un ISIN. Siempre tiene **12 caracteres**, formados por tres partes:

| Parte | Longitud | Significado |
|---|---|---|
| Código de país | 2 letras | El país de la agencia nacional que asignó el ISIN, p. ej. `AT` para Austria, `DE` para Alemania, `US` para Estados Unidos |
| Número básico | 9 caracteres | Letras y cifras elegidas por esa agencia |
| Dígito de control | 1 cifra | Calculado a partir de los otros 11 caracteres, para poder detectar errores de tecleo |

Así que el ISIN de una acción austriaca tiene la forma `AT` + nueve caracteres + un dígito de control. El formato ISIN es una norma internacional (ISO 6166), y cada país tiene una agencia nacional de codificación que los asigna.

> [!AUSTRIA]
> En Austria, los ISIN los asigna el **Oesterreichische Kontrollbank (OeKB)**. Por eso los valores austriacos suelen tener ISIN que empiezan por `AT`.

## El WKN: el código alemán

El **WKN** (Wertpapierkennnummer, «número de identificación de valores») es un código alemán de seis caracteres. Es más antiguo que el ISIN, que lo ha sustituido en gran parte, pero todavía lo verás muy a menudo en bancos y brókeres de los países de habla alemana, también en Austria. En los valores registrados en Alemania, el WKN forma parte del ISIN.

## Por qué te importa

Una misma empresa puede tener varios valores distintos: acciones ordinarias y preferentes, acciones que cotizan en distintos países, bonos y productos emitidos por bancos que solo *siguen* la acción de la empresa. Sus nombres pueden parecer casi idénticos, pero cada uno tiene su propio ISIN.

> [!EXAMPLE]
> Quieres comprar acciones de una empresa y buscas su nombre en la app de tu bróker. Aparecen cinco resultados: dos clases de acciones, un bono y dos productos bancarios que apuestan por el precio de la acción.
>
> Si compruebas el **ISIN** con el que aparece en la página de relación con inversores de la propia empresa, sabrás exactamente cuál es la acción ordinaria que buscabas.

> [!MISTAKE] «Busco por el nombre y elijo el primer resultado»
> Así es como la gente acaba comprando por error otra clase de acciones, un producto en otra divisa o un producto bancario apalancado. Confirma siempre el ISIN (y la bolsa y la divisa) antes de dar una orden.

## Ideas clave

> [!TAKEAWAYS]
> - Un ticker es un código corto de una bolsa; no es único entre bolsas.
> - El ISIN es el identificador internacional único: 12 caracteres (país, número básico, dígito de control).
> - En Austria, el OeKB asigna los ISIN.
> - El WKN es un código alemán de seis caracteres que se sigue usando mucho en los países de habla alemana.
> - Comprueba el ISIN antes de comprar, para obtener exactamente el valor que querías.
