---
title: "Cómo funciona una plataforma de gráficos como TradingView"
summary: "Un recorrido neutral por una plataforma de gráficos típica, con TradingView como ejemplo conocido: símbolos, configuración, indicadores, herramientas de dibujo, alertas, replay, screeners, operativa simulada, scripts, ideas de la comunidad y los riesgos."
translatedFrom: 2026-10-11
---

Todas las plataformas de gráficos son un poco distintas, pero comparten las mismas piezas. Usamos **TradingView** como ejemplo porque es muy conocida. Los mismos conceptos se aplican a los gráficos de la app de tu bróker o de cualquier otra plataforma.

> [!NOTE] Descripción neutral, sin recomendación
> Stockora Academy no tiene ninguna relación con TradingView ni con ninguna otra plataforma, no usa enlaces de afiliado y no recomienda ninguna plataforma ni ningún plan. Las funciones y los precios cambian: consulta la [web oficial](https://www.tradingview.com/) para ver la situación actual. La ilustración de abajo es un boceto propio, no una captura de pantalla.

## Qué es

TradingView es una plataforma web de gráficos y análisis de mercados, con apps para móvil y escritorio. Cubre acciones, índices, divisas, criptomonedas y futuros, y tiene una parte social donde los usuarios publican sus análisis de gráficos («ideas»).

## La interfaz

![Boceto de una plataforma de gráficos típica: barra de herramientas arriba, herramientas de dibujo a la izquierda, gráfico y volumen en el centro, paneles a la derecha y abajo](../../../../lessons/J/img/platform-layout.svg)

- **Barra superior:** búsqueda de símbolos, selector de marco temporal, tipo de gráfico, indicadores, alertas, replay, diseños.
- **Barra izquierda:** herramientas de dibujo.
- **Zona del gráfico:** velas, un panel de volumen, una cruceta que sigue al ratón y las escalas de precio y de tiempo.
- **Panel derecho:** listas de seguimiento, alertas, noticias y detalles del símbolo.
- **Panel inferior:** screener, editor de scripts, probador de estrategias (informe de la estrategia), operativa simulada y conexiones con brókeres.

## Símbolos y datos

- **Prefijo de la bolsa:** los símbolos pueden llevar un prefijo de bolsa, como `NASDAQ:AAPL`. La misma empresa puede cotizar en varias bolsas y en distintas divisas, así que comprueba qué cotización estás mirando.
- **Con retraso o en tiempo real:** la mayoría de las bolsas de acciones y de futuros cobran por los datos en tiempo real, así que los datos de muchas bolsas van **con retraso** salvo que compres un paquete de datos. TradingView dice que sus planes de pago no cubren esas tarifas de las bolsas. Si ya pagas datos en tiempo real a través de un bróker, en algunos casos pueden usarse en la plataforma.
- **Fuente de los datos:** por defecto, TradingView muestra los precios de las acciones de EE. UU. de Cboe, que pueden diferir ligeramente de los de las bolsas principales.

## Configuración del gráfico que conviene revisar

Los colores de las velas, la escala lineal o logarítmica, el ajuste por splits y dividendos, el **huso horario** del gráfico, las sesiones fuera de horario y las pausas de sesión. Un gráfico con el huso horario equivocado o con precios sin ajustar puede verse muy distinto.

## Indicadores y scripts

- Una biblioteca de indicadores incorporados (medias móviles, RSI, MACD, bandas de Bollinger y muchos más), cada uno con parámetros ajustables como la longitud y el precio de origen.
- **Pine Script** es el lenguaje de programación propio de la plataforma para indicadores y estrategias personalizados, que se escriben en un editor del panel inferior. Los usuarios publican muchos **scripts de la comunidad**. Su calidad varía, y un script no es un consejo.
- El **probador de estrategias (informe de la estrategia)** muestra cómo se habría comportado una estrategia programada con datos pasados, con todas las trampas del backtesting de la lección 9.

## Herramientas de dibujo

Líneas de tendencia, líneas y rayos horizontales, canales paralelos, rectángulos para zonas, retrocesos de Fibonacci, una herramienta de medición, **herramientas de posición larga/corta** que muestran el riesgo y el beneficio previstos de una operación, notas de texto y VWAP anclado.

## Alertas

Las alertas te envían un aviso cuando se cumple una condición de precio o de un indicador, por ejemplo cuando el precio cruza un nivel. Son útiles para no tener que mirar la pantalla, pero muchas alertas también pueden llevar a **operar en exceso y al FOMO**.

## Modo replay

El **replay de barras** reproduce velas pasadas una a una desde el punto de partida que elijas, para que practiques la lectura de gráficos sin saber qué viene después.

## Screener, listas de seguimiento y diseños

Listas de seguimiento, diseños con varios gráficos y una cruceta sincronizada, plantillas guardadas y un **screener** que filtra los mercados por criterios como el valor de mercado, el PER o el volumen. El resultado de un screener es una lista que cumple tus filtros, no una recomendación.

## Operativa simulada y conexiones con brókeres

- **Operativa simulada (paper trading):** una cuenta simulada con dinero virtual, disponible para todos los usuarios según TradingView.
- **Conexiones con brókeres:** algunos brókeres pueden conectarse para dar órdenes desde el gráfico. Es cómodo, pero también hace que operar sea muy rápido y fácil, incluidas las operaciones impulsivas. Comprueba quién es tu bróker, dónde está regulado y cuánto cuesta (categoría F).

## Ideas de la comunidad

Los usuarios publican sus análisis de gráficos como **ideas**, que se muestran a sus seguidores y a quienes siguen el símbolo; las más populares suben a la portada. Léelas con cuidado: la popularidad no es acierto, y los feeds sociales también se usan para **hype, venta de «señales» y estafas** (mira [Antifraude](/scams)).

## Planes

Hay un plan gratuito y varios planes de pago con más funciones. Cuál te conviene, si alguno, es decisión tuya; consulta en la web oficial las diferencias actuales. Los datos en tiempo real de muchas bolsas cuestan aparte, además del plan.

## Riesgos y límites

- datos con retraso que se confunden con precios en directo;
- el huso horario equivocado o precios sin ajustar;
- indicadores que se **repintan** y reescriben sus señales pasadas;
- backtests sobreajustados en el probador de estrategias;
- demasiadas alertas y el FOMO de los feeds sociales.

> [!MISTAKE] «Esta idea tiene miles de me gusta, así que tiene que tener razón»
> Las ideas son opiniones. Nadie comprueba si las ideas populares aciertan, y es fácil elegir a posteriori los gráficos que se publican.

**Prueba el recorrido guiado:** el [Laboratorio de gráficos](/charts/lab) tiene las mismas piezas (tipos de gráfico, marcos temporales, indicadores, herramientas de dibujo, replay) y un recorrido de «lee este gráfico paso a paso» que sigue la lista de la lección 9.

## Ideas clave

> [!TAKEAWAYS]
> - Las plataformas de gráficos comparten las mismas partes: búsqueda de símbolos, marcos temporales, tipos de gráfico, indicadores, herramientas de dibujo, alertas, replay, screener y paneles.
> - Comprueba el prefijo de la bolsa, la divisa, el huso horario, el ajuste de precios y si los datos van con retraso.
> - Los scripts y las ideas de la comunidad no son consejos; la calidad varía y el hype es frecuente.
> - El replay y la operativa simulada sirven para practicar; los backtests y las alertas tienen sus propios riesgos.
> - Describimos TradingView solo como ejemplo; las funciones y los precios cambian, así que consulta la web oficial.
