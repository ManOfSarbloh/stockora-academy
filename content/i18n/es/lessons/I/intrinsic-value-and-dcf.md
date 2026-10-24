---
title: "Valor intrínseco y descuento de flujos de caja (DCF)"
summary: Un negocio vale el efectivo que puede producir en el futuro, descontado hasta hoy. Recorre paso a paso un DCF sencillo, comprueba lo sensible que es a las hipótesis y aprende la idea del margen de seguridad.
translatedFrom: 2026-10-11
---

Los ratios (lección 7) comparan una empresa con otras empresas. La **valoración intrínseca** se hace una pregunta más de fondo: *¿cuánto vale este negocio por sí mismo, según el efectivo que producirá?*

El *Owner's Manual* de Berkshire Hathaway da una definición sencilla: el valor intrínseco es **el valor descontado del efectivo que puede sacarse de un negocio durante el resto de su vida**. Y añade enseguida que el cálculo no es sencillo y que el valor intrínseco es una **estimación y no una cifra precisa**, que debe cambiar cuando cambian los tipos de interés o las previsiones de flujos de caja.

La misma idea aparece en la contabilidad: cuando las NIIF (NIC 36) someten los activos a pruebas de deterioro, una de las medidas que usan es el «valor en uso», los flujos de caja futuros esperados **descontados a valor actual**.

## Paso 1: el dinero de hoy vale más que el de mañana

100 € hoy pueden invertirse y crecer. Por eso 100 € recibidos dentro de un año valen **menos** que 100 € hoy. Cuánto menos depende de la rentabilidad que exiges, llamada **tasa de descuento**.

**Valor actual = efectivo futuro ÷ (1 + tasa de descuento)^años**

> [!EXAMPLE] Descontar un pago
> 100 € dentro de un año, tasa de descuento del 8 %: 100 ÷ 1,08 = **92,59 €** hoy.
> 100 € dentro de dos años: 100 ÷ 1,08² = **85,73 €** hoy.

Es el interés compuesto (categoría G) al revés.

## Paso 2: un DCF sencillo, paso a paso

Un modelo de **descuento de flujos de caja (DCF)** prevé el efectivo que generará una empresa y luego descuenta cada año hasta hoy. Aquí tienes un ejemplo simplificado por acción para una empresa inventada. Cada dato es una **hipótesis**:

- Flujo de caja libre por acción el próximo año: **1,20 €**
- Crecimiento durante los próximos cinco años: **5 %** anual
- Crecimiento a partir de entonces, para siempre: **2 %** anual
- Tasa de descuento (la rentabilidad que exige un inversor): **9 %**

**Años 1 a 5:**

| Año | Flujo de caja (€) | Factor de descuento | Valor actual (€) |
|---:|---:|---:|---:|
| 1 | 1,20 | ÷ 1,09 | 1,10 |
| 2 | 1,26 | ÷ 1,09² | 1,06 |
| 3 | 1,32 | ÷ 1,09³ | 1,02 |
| 4 | 1,39 | ÷ 1,09⁴ | 0,98 |
| 5 | 1,46 | ÷ 1,09⁵ | 0,95 |
| | | **Suma** | **≈ 5,12** |

(Las filas están redondeadas, así que no suman exactamente.)

**Después del año 5: el valor terminal.** Nadie puede prever cada año para siempre, así que el modelo supone un crecimiento constante a partir del año 5 y usa la fórmula de la perpetuidad creciente:

**Valor terminal = flujo de caja del año 6 ÷ (tasa de descuento − crecimiento a largo plazo)**

> [!EXAMPLE] Valor terminal
> Flujo de caja del año 6 = 1,46 × 1,02 ≈ 1,49 €.
> Valor terminal al final del año 5 = 1,49 ÷ (0,09 − 0,02) ≈ **21,25 €**.
> Descontado hasta hoy: 21,25 ÷ 1,09⁵ ≈ **13,81 €**.

**Total:** 5,12 + 13,81 ≈ **18,93 € por acción**.

Fíjate en que alrededor del **73 %** del valor procede del valor terminal: flujos de caja a más de cinco años vista, basados en las hipótesis más toscas.

## Paso 3: ¿qué sensibilidad tiene el resultado?

Cambia solo la tasa de descuento y el crecimiento a largo plazo, y mira qué pasa:

| Tasa de descuento ↓ / crecimiento a largo plazo → | 1 % | 2 % | 3 % |
|---|---:|---:|---:|
| **8 %** | 19,58 € | 22,13 € | 25,71 € |
| **9 %** | 17,08 € | 18,93 € | 21,39 € |
| **10 %** | 15,14 € | 16,53 € | 18,31 € |

Cambios pequeños, de un punto porcentual, mueven el «valor» de unos 15 € a casi 26 €. Un DCF no es una medición. Es una forma estructurada de hacer visibles tus hipótesis.

> [!WARNING] Si entra basura, sale basura
> Se puede hacer que un DCF dé casi cualquier cifra. Desconfía sobre todo de los modelos que suponen un crecimiento alto durante muchos años, un crecimiento a largo plazo superior al crecimiento de la economía a largo plazo o una tasa de descuento que parece baja para el riesgo.

## DCF inverso: ¿qué supone el mercado?

En lugar de estimar un valor, puedes preguntarte qué hipótesis implica el **precio actual**. Con el modelo más sencillo, una única perpetuidad creciente:

**Precio = flujo de caja del próximo año ÷ (tasa de descuento − crecimiento)**, así que **crecimiento = tasa de descuento − flujo de caja ÷ precio**

> [!EXAMPLE] Lo que implica un precio de 24 €
> Flujo de caja del próximo año de 1,20 €, rentabilidad exigida del 9 %, precio de 24 €:
> Crecimiento implícito = 9 % − 1,20 ÷ 24 = 9 % − 5 % = **4 % anual, para siempre**.
>
> La pregunta pasa a ser: ¿es realista para este negocio un crecimiento del 4 % para siempre? Es más fácil de debatir que un «valor justo» abstracto.

## El margen de seguridad

Como el valor intrínseco es solo una estimación, los inversores prudentes incorporan un colchón. En su carta de 1992, Warren Buffett escribió que Berkshire exige un **margen de seguridad** en el precio de compra: si el valor calculado de una acción es solo un poco superior a su precio, no les interesa. Llama a este principio, que Benjamin Graham subrayó con fuerza, la piedra angular del éxito inversor.

> [!EXAMPLE] Un margen de seguridad en cifras
> Valor estimado de 18,93 €. Quien exija un margen de seguridad del 25 % solo consideraría precios iguales o inferiores a 18,93 × 0,75 ≈ **14,20 €**.

Es una forma de pensar en los errores de estimación, no una recomendación de comprar nada a ningún precio.

## De dónde sale la tasa de descuento

Los profesionales suelen derivarla de los tipos de interés más una prima por el riesgo de las acciones (la **prima de riesgo de la renta variable**) y por el riesgo específico de la empresa. Aswath Damodaran, de NYU Stern, publica estimaciones de esos datos que actualiza con regularidad, incluidas las primas de riesgo implícitas de la renta variable. Para aprender, lo importante es más sencillo: **cuanto mayor es el riesgo, mayor es la tasa de descuento y menor el valor hoy.** La subida de los tipos de interés también eleva las tasas de descuento, y es uno de los motivos por los que los precios de las acciones, sobre todo los de empresas cuyos flujos de caja quedan muy lejos en el futuro, suelen caer cuando suben los tipos.

## Ideas clave

> [!TAKEAWAYS]
> - Valor intrínseco = el valor descontado del efectivo que un negocio puede producir durante su vida; siempre es una estimación.
> - Valor actual = efectivo futuro ÷ (1 + tasa de descuento)^años.
> - Un DCF sencillo: prevé unos pocos años, añade un valor terminal y descuéntalo todo hasta hoy.
> - El valor terminal suele dominar, y pequeños cambios en las hipótesis mueven mucho el resultado.
> - Un DCF inverso muestra qué crecimiento implica el precio actual; un margen de seguridad deja sitio a los errores.
