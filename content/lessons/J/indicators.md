---
title: "Indicators: moving averages, RSI, MACD, Bollinger Bands and more"
category: J
order: 8
level: intermediate
summary: What the most common indicators calculate, how they are usually read, and their built-in limits. Indicators are derived from price; they do not add new information.
readingTime: 11
tags: [indicator, moving average, SMA, EMA, golden cross, RSI, MACD, Bollinger Bands, VWAP, ATR, Fibonacci]
lastReviewed: 2026-10-11
sources:
  - title: "Understanding moving averages (CME Group education)"
    url: https://www.cmegroup.com/education/courses/technical-analysis/understanding-moving-averages
  - title: "Oscillators: MACD, RSI, Stochastics (CME Group education)"
    url: https://www.cmegroup.com/education/courses/technical-analysis/oscillators-macd-rsi-stochastics
  - title: "Fibonacci retracements and extensions (CME Group education)"
    url: https://www.cmegroup.com/education/courses/technical-analysis/fibonacci-retracements-and-extensions
  - title: "Bollinger Bands (John Bollinger, BollingerBands.com)"
    url: https://www.bollingerbands.com/bollinger-bands
  - title: "Market makers in financial markets, including VWAP execution strategies (NYSE paper, September 2021, PDF)"
    url: https://www.nyse.com/publicdocs/nyse/NYSE_Paper_on_Market_Making_Sept_2021.pdf
---

An **indicator** is a calculation based on price (and sometimes volume), drawn on or under the chart. Two families:

- **Overlays** are drawn on top of the price: moving averages, Bollinger Bands, VWAP.
- **Oscillators** are drawn in a separate pane and move within a fixed range or around zero: RSI, MACD.

![Simulated price chart with moving averages and Bollinger Bands, and RSI and MACD panes below](./img/indicators.svg)

> [!NOTE]
> Indicators are calculated **from price**. They can make patterns easier to see, but they add no new information about the future, and most of them **lag**: they react after the price has moved.

## Moving averages (SMA and EMA)

- **Simple moving average (SMA):** the average closing price of the last *n* periods. Example: closes of 45.50, 45.25 and 46.10 give a 3-period SMA of 136.85 ÷ 3 = **45.62**.
- **Exponential moving average (EMA):** gives more weight to recent prices, so it reacts faster. Each new value = price × multiplier + previous EMA × (1 − multiplier), with multiplier = 2 ÷ (n + 1).
- **Common lengths:** 20, 50, 100 and 200 periods. A rising average suggests an uptrend; the price crossing its average is watched by many traders.
- **Golden cross / death cross:** the 50-day average crossing **above** the 200-day average is popularly called a golden cross, crossing **below** a death cross. Both happen well after the turn in price, by design.

## RSI (Relative Strength Index)

- Compares the average size of **up moves** with the average size of **down moves** over a period (commonly 14), on a scale of **0 to 100**.
- Conventional levels: above **70** "overbought", below **30** "oversold".
- **The catch:** in a strong trend, RSI can stay above 70 (or below 30) for a long time while the price keeps going. "Overbought" does not mean "about to fall".
- **Divergence:** the price makes a new high but RSI does not. Traders read it as fading momentum; it can persist for a long time.

## MACD (Moving Average Convergence Divergence)

- **MACD line:** the 12-period EMA minus the 26-period EMA.
- **Signal line:** a 9-period EMA of the MACD line.
- **Histogram:** MACD line minus signal line.
- Traders watch crossings of the MACD and signal lines, and the MACD line crossing zero. Because it is built from moving averages, MACD lags too.

## Bollinger Bands

Developed by John Bollinger: a 20-period moving average with bands **two standard deviations** above and below it (the default settings). The bands widen when prices become more volatile and narrow when they calm down. A narrow "**squeeze**" shows unusually low volatility; traders watch for volatility to pick up again, but the bands do not tell you in which direction.

## VWAP (volume-weighted average price)

The average price of the day, weighted by how much was traded at each price: (sum of price × volume) ÷ (total volume). It **restarts every session** and is mainly used intraday. Many market participants use VWAP execution strategies, which aim to buy or sell a large order close to the day's VWAP.

## ATR (Average True Range)

A measure of **volatility**, not direction: the average size of each period's range, including any gap from the previous close. A stock with an ATR of €2 typically moves about €2 per day. Traders use it, for example, to set stops at a sensible distance.

## Fibonacci retracements

Lines drawn at **38.2%, 50% and 61.8%** of a previous move, where some traders expect a pullback to pause. The ratios come from the Fibonacci number series (50% is added by convention). Fibonacci levels are popular but **subjective**: the result depends on which high and low you choose, and with several levels close together, one of them will usually seem to "work".

## Rules of thumb

- **More indicators is not better.** Many indicators show the same information in different ways; five indicators agreeing are not five independent confirmations.
- **Defaults are conventions,** not laws: 14 for RSI or 20 for Bollinger Bands are habits, not optimal values.
- **Repainting:** some custom indicators change their past values when new data arrives, so they look perfect on history but give different signals in real time.

> [!MISTAKE] "RSI is above 70, so I should sell"
> RSI above 70 only says that recent gains outweighed recent losses. In strong uptrends it can stay there for weeks. An indicator reading is a description, not an instruction.

Turn each indicator on and off, and change its settings, in the [Chart Lab](/charts/lab).

## Key takeaways

> [!TAKEAWAYS]
> - Indicators are calculated from price (and volume); they add no new information and most of them lag.
> - Moving averages smooth the price; EMAs react faster than SMAs.
> - RSI and other oscillators can stay "overbought" or "oversold" for a long time in strong trends.
> - MACD is built from moving averages; Bollinger Bands and ATR measure volatility; VWAP is an intraday benchmark.
> - Fibonacci levels are subjective; using fewer, well-understood indicators beats indicator overload.
