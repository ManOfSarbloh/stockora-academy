---
title: Qué muestra un gráfico de precios
summary: El precio en un eje, el tiempo en el otro. Tipos de gráfico, marcos temporales, escalas lineal y logarítmica, volumen, precios ajustados y datos con retraso, explicados antes de leer un solo patrón.
translatedFrom: 2026-10-11
---

Un gráfico es simplemente una imagen de cómo ha evolucionado un precio. El eje vertical muestra el **precio** y el eje horizontal, el **tiempo**. Todo lo demás en un gráfico, de las velas a los indicadores, se construye sobre estos dos ejes.

> [!NOTE]
> La Escuela de gráficos te enseña a **leer** gráficos. No da señales de compra ni de venta, y ningún gráfico puede decirte qué hará un precio a continuación. Todos los gráficos de ejemplo de este sitio usan precios **simulados**.

## Tipos de gráfico

![Los mismos 16 días dibujados como gráfico de líneas, gráfico de barras y gráfico de velas](../../../../lessons/J/img/chart-types.svg)

- **Gráfico de líneas:** une los precios de cierre. Limpio y bueno para ver el conjunto, pero oculta lo que pasó dentro de cada periodo.
- **Gráfico de barras (OHLC):** cada periodo es una línea vertical del **máximo** al **mínimo**, con una pequeña marca horizontal a la izquierda para la **apertura** y otra a la derecha para el **cierre**.
- **Gráfico de velas:** muestra los mismos cuatro precios que el de barras, pero el tramo entre la apertura y el cierre se dibuja como un **cuerpo** grueso, coloreado según el precio haya subido o bajado. La lección siguiente explica las velas en detalle.
- **Gráfico de área:** un gráfico de líneas con el área de debajo rellena.
- **Heikin Ashi:** velas suavizadas construidas con **promedios** del periodo actual y del anterior. Hacen que las tendencias parezcan más limpias, pero su apertura y su cierre **no son precios negociados de verdad**.
- **Renko y Kagi:** gráficos que ignoran el tiempo y solo dibujan un nuevo ladrillo o una nueva línea cuando el precio se mueve una cantidad fija. Como principiante, rara vez los necesitarás.

![Los mismos 30 días con velas normales y con velas Heikin Ashi](../../../../lessons/J/img/heikin-ashi.svg)

## Marcos temporales

Cada vela o barra representa un **periodo**: 1 minuto, 5 minutos, 1 hora, 1 día, 1 semana o 1 mes. Un gráfico diario tiene una vela por sesión; uno semanal junta cinco días en una sola vela.

El mismo mercado puede verse completamente distinto en marcos temporales distintos: una fuerte caída en el gráfico de 5 minutos puede ser un pequeño bache en el semanal. Los marcos más largos dan el contexto general; los más cortos muestran el detalle y el ruido.

> [!EXAMPLE]
> Una acción cotiza 390 minutos al día (por ejemplo, de 9:30 a 16:00). En un gráfico de 1 hora, ese día se convierte en seis velas horarias completas más una séptima, más corta, para los últimos 30 minutos. En un gráfico diario es una sola vela.

## Escala lineal o logarítmica

En una escala **lineal**, cada tramo del eje de precios es el mismo número de euros: de 10 a 20 ocupa lo mismo que de 100 a 110. En una escala **logarítmica**, cada tramo es el mismo **porcentaje**: de 10 a 20 (+100 %) ocupa lo mismo que de 100 a 200 (+100 %).

![El mismo historial de precios en escala lineal y en escala logarítmica](../../../../lessons/J/img/linear-vs-log.svg)

Para periodos largos y para precios que han crecido mucho, la escala logarítmica suele ser más honesta: muestra los movimientos porcentuales con su tamaño relativo real.

## Volumen

La mayoría de los gráficos muestran el **volumen** (el número de acciones negociadas en cada periodo) como barras bajo el precio. Un gran movimiento de precio con mucho volumen implicó a muchos participantes; el mismo movimiento con muy poco volumen, a pocos. El volumen vuelve a aparecer en las lecciones sobre tendencias e indicadores.

## Lo que puede hacer engañoso un gráfico

- **Precios ajustados frente a sin ajustar:** tras un split, el precio de la acción baja (por ejemplo, de 100 € a 50 € tras un split de 2 por 1) sin que nadie pierda dinero. Las plataformas de gráficos suelen **ajustar** los precios antiguos para que el gráfico no muestre un falso desplome. Algunas plataformas ofrecen también un ajuste por dividendos. Comprueba la configuración antes de comparar precios antiguos y nuevos.
- **Husos horarios y sesiones:** una vela diaria cubre la sesión de la bolsa en su propio huso horario. Algunas plataformas muestran también velas de **preapertura y fuera de horario** (mira la categoría E).
- **Huecos:** cuando el siguiente periodo abre muy lejos del cierre anterior, por ejemplo tras una noticia durante la noche, el gráfico muestra un espacio vacío: un **hueco** (gap).
- **Datos con retraso:** muchas bolsas cobran por los precios en tiempo real, así que los gráficos gratuitos suelen ir **con retraso**, que depende de la bolsa. Comprueba si tu gráfico está en directo antes de fiarte de la última vela.

> [!MISTAKE] «El gráfico muestra un desplome, así que la empresa perdió la mitad de su valor»
> Comprueba primero si hubo un split. Si el gráfico no está ajustado, un split de 2 por 1 parece una caída del 50 %, aunque los accionistas simplemente tienen el doble de acciones a la mitad de precio.

## Ideas clave

> [!TAKEAWAYS]
> - Un gráfico representa el precio frente al tiempo; los de líneas, barras y velas son los tipos más comunes.
> - Las velas Heikin Ashi son promedios y no muestran precios negociados reales.
> - Cada vela representa un periodo; el marco temporal cambia lo que ves.
> - La escala logarítmica muestra los movimientos porcentuales con su tamaño real, algo útil en periodos largos.
> - Comprueba los precios ajustados, el huso horario, las sesiones y si los datos van con retraso.
