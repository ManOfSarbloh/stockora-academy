---
title: "Anatomy of a candlestick: open, high, low, close"
category: J
order: 2
level: beginner
summary: Every candle tells you four prices and a little story about who was in control during the period. How to read the body, the wicks and the colour, and why context matters.
readingTime: 7
tags: [candlestick, OHLC, body, wick, shadow]
lastReviewed: 2026-10-11
sources:
  - title: "Chart types: candlestick, line, bar (CME Group education)"
    url: https://www.cmegroup.com/education/courses/technical-analysis/chart-types-candlestick-line-bar
  - title: "Experience reverses the red effect among Chinese stockbrokers (Zhang & Han, PLoS ONE 2014, via PubMed Central)"
    url: https://pmc.ncbi.nlm.nih.gov/articles/PMC3933460/
  - title: "Dojima Rice Exchange: the world's first institutional futures exchange (Japan Exchange Group)"
    url: https://www.jpx.co.jp/english/corporate/about-jpx/history/02-01.html
  - title: "Japanese candlestick charting techniques, Steve Nison, New York Institute of Finance, 1991 (library catalogue record)"
    url: https://findit.library.nd.edu/Record/000867079
---

A candlestick packs four prices of one period into a single shape: the **open**, the **high**, the **low** and the **close** (together: **OHLC**).

![Anatomy of a candle: open 100, high 106, low 98, close 104, and a falling candle for comparison](./img/candle-anatomy.svg)

## The parts of a candle

- **Body:** the thick part between the open and the close.
- **Wicks** (also called **shadows**): the thin lines above and below the body. The top of the upper wick is the **high**, the bottom of the lower wick is the **low**.
- **Colour:** if the close is above the open, the price rose during the period (often drawn green or white). If the close is below the open, it fell (often red or black).

> [!EXAMPLE]
> A day's prices: open **100**, high **106**, low **98**, close **104**.
>
> - The body runs from 100 to 104; it is a rising (green) candle because the close is above the open.
> - The upper wick runs from 104 to the high of 106; the lower wick from 100 down to the low of 98.
> - Total range: 106 − 98 = **8**. The body is 4, half of the range.

> [!WARNING] Colours are a setting, not a law
> Platforms let you choose the colours, and conventions differ: in the Chinese stock market, red stands for a **rising** price and green for a falling one, the opposite of most Western platforms. Always check the platform's setting, or look at whether the close is above or below the open.

## What one candle tells you

Technical analysts read a candle as a short story about buyers and sellers during that period:

- **Long body:** the price moved a lot from open to close: one side was clearly in control.
- **Small body:** open and close were close together: neither side won, a sign of **indecision**.
- **Long upper wick:** the price went up during the period, but was pushed back down before the close: higher prices were **rejected**.
- **Long lower wick:** the price fell during the period, but buyers pushed it back up: lower prices were rejected.
- **No wicks:** the period opened at one extreme and closed at the other: strong one-sided pressure.

## Context matters more than the shape

The same candle can mean different things depending on where it appears:

- After a long rise or a long fall?
- Near a level where the price turned before (support or resistance, lesson 6)?
- Is it big or small **compared with the recent candles**?
- Was **volume** higher or lower than usual?
- Which **timeframe**? A pattern on a 1-minute chart carries far less weight than the same pattern on a weekly chart.

> [!MISTAKE] "A green candle means the price went up today"
> It means the close was above that period's **open**. If the price opened with a big gap down and then recovered a little, the candle is green although the price is lower than yesterday's close.

## A little history

Candlestick charts are commonly traced back to Japanese rice trading in the 18th century. Japan's exchange operator describes the Dojima Rice Exchange in Osaka, authorised in 1730, as the world's first institutional futures exchange. Popular accounts often link the method to the rice merchant Munehisa Homma, but how much of today's technique goes back to him is uncertain. Candlesticks became widely known in the West through Steve Nison's 1991 book *Japanese Candlestick Charting Techniques*.

Try it: in the [Chart Lab](/charts/lab), click any candle to see its open, high, low and close.

## Key takeaways

> [!TAKEAWAYS]
> - A candle shows four prices: open, high, low and close.
> - The body spans open to close; the wicks reach the high and the low.
> - Rising and falling candles are coloured differently, but colours are a setting and differ by country.
> - Long bodies suggest conviction, small bodies indecision, long wicks rejection.
> - Always read a candle in its context: trend, levels, size, volume and timeframe.
