---
title: "Una rutina para leer gráficos, el análisis en varios marcos temporales y el backtesting"
summary: Una lista paso a paso para leer cualquier gráfico, de arriba abajo, del semanal al horario, más las trampas del backtesting y por qué lo primero es practicar con dinero ficticio.
translatedFrom: 2026-10-11
---

Ya conoces las piezas. Esta lección las une en una rutina que puedes usar con cualquier gráfico, y explica por qué probar ideas con datos pasados es más difícil de lo que parece.

## De arriba abajo: del conjunto al detalle

Mira el mismo mercado en varios marcos temporales, empezando por el más largo:

1. **Semanal:** ¿cuál es la tendencia a largo plazo? ¿Dónde están los grandes máximos y mínimos?
2. **Diario:** ¿encaja la estructura a medio plazo con la imagen semanal? ¿Dónde están las zonas de soporte y resistencia más cercanas?
3. **Horario (o más corto):** solo si tu plan lo necesita, para ver el detalle en torno a un nivel concreto.

El marco temporal más largo da el contexto; el más corto muestra el detalle. Una señal de compra en el gráfico de 5 minutos en contra de una clara tendencia bajista semanal es una situación muy distinta de una a favor de la tendencia semanal.

## Una lista para principiantes

> [!TIP] Nueve pasos para leer un gráfico
> 1. **Confirma qué estás mirando:** símbolo, bolsa, divisa y si los datos son en tiempo real o con retraso.
> 2. **Elige el marco temporal** que encaje con tu objetivo (un inversor a largo plazo no necesita velas de 1 minuto).
> 3. **Lee la estructura de la tendencia:** ¿máximos y mínimos crecientes, decrecientes, o un rango?
> 4. **Marca las zonas de soporte y resistencia.**
> 5. **Mira las últimas velas** en ese contexto.
> 6. **Comprueba el volumen:** ¿respalda una actividad inusual el movimiento?
> 7. **Añade como mucho uno o dos indicadores**, y sabe qué miden.
> 8. **Apunta qué demostraría que te equivocas:** el precio al que tu lectura deja de valer.
> 9. **Acepta que «no operar» es una decisión válida.** La mayor parte del tiempo, un gráfico no ofrece una imagen clara.

## El backtesting y sus trampas

Hacer **backtesting** significa comprobar cómo se habría comportado un conjunto de reglas con datos pasados. Sirve para descartar malas ideas, pero produce con facilidad resultados que parecen mejores que la realidad:

- **Sobreajuste (curve fitting):** retocar las reglas hasta que encajan perfectamente con el pasado. Esas reglas suelen fallar con datos nuevos.
- **Data snooping:** probar muchas reglas y quedarse solo con la mejor. Park e Irwin (2007) citan el data snooping y la elección de reglas tras ver los resultados como problemas habituales de la investigación sobre análisis técnico.
- **Sesgo de supervivencia:** probar solo con empresas que siguen existiendo hoy ignora las que quebraron o dejaron de cotizar, lo que hace que los resultados parezcan mejores.
- **Ignorar los costes:** las comisiones, los diferenciales, el deslizamiento y los impuestos pueden convertir una ventaja pequeña en una pérdida (categoría G).
- **Sesgo de anticipación (look-ahead):** usar sin querer información que no estaba disponible en ese momento (por ejemplo, un precio de cierre antes del cierre).

## Primero, practicar: replay y operativa simulada

Muchas plataformas de gráficos ofrecen un **modo replay** que reproduce velas pasadas una a una, y **operativa simulada**: una cuenta simulada con dinero virtual. Las dos te permiten practicar la lectura de gráficos y seguir tus reglas sin arriesgar dinero. Eso sí, los resultados de la práctica son halagadores: no hay emociones reales, y las ejecuciones simuladas pueden ser mejores que las reales.

> [!MISTAKE] «Mi backtest ganó un 300 % al año, así que la estrategia funciona»
> Los backtests espectaculares son casi siempre una señal de alarma de sobreajuste, sesgo de supervivencia o costes olvidados. Prueba con datos que las reglas nunca han visto, incluye costes realistas y cuenta con que los resultados reales serán peores.

Practica la rutina en el [Laboratorio de gráficos](/charts/lab): cambia de marco temporal, usa el modo replay y juega a «descubre la siguiente vela».

## Ideas clave

> [!TAKEAWAYS]
> - Lee los gráficos de arriba abajo: el semanal para el contexto, el diario para la estructura y los marcos más cortos solo para el detalle.
> - Sigue una lista y apunta qué demostraría que te equivocas; «no operar» es un resultado válido.
> - Los backtests sufren de sobreajuste, data snooping, sesgo de supervivencia, sesgo de anticipación y costes olvidados.
> - Practica con replay y operativa simulada antes de arriesgar dinero real, y cuenta con que los resultados reales serán peores.
