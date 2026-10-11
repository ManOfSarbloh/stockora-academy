---
title: What a price chart shows
category: J
order: 1
level: beginner
summary: Price on one axis, time on the other. Chart types, timeframes, linear and log scales, volume, adjusted prices and delayed data, explained before you read a single pattern.
readingTime: 8
tags: [chart, line chart, bar chart, candlestick, Heikin Ashi, timeframe, log scale, volume]
lastReviewed: 2026-10-11
sources:
  - title: "Chart types: candlestick, line, bar (CME Group education)"
    url: https://www.cmegroup.com/education/courses/technical-analysis/chart-types-candlestick-line-bar
  - title: "Chart: Definition (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-c/chart/
  - title: "Stock split (Investor.gov glossary)"
    url: https://www.investor.gov/introduction-investing/investing-basics/glossary/stock-split
  - title: "How to purchase additional market data: why some data is delayed (TradingView Help Center)"
    url: https://www.tradingview.com/support/solutions/43000471705-how-to-purchase-additional-market-data/
---

A chart is simply a picture of how a price has developed. The vertical axis shows the **price**, the horizontal axis shows **time**. Everything else on a chart, from candles to indicators, is built on these two axes.

> [!NOTE]
> The Chart School teaches you to **read** charts. It does not give buy or sell signals, and no chart can tell you what a price will do next. All example charts on this site use **simulated** prices.

## Chart types

![The same 16 days drawn as a line chart, a bar chart and a candlestick chart](./img/chart-types.svg)

- **Line chart:** connects the closing prices. Clean and good for the big picture, but it hides what happened during each period.
- **Bar chart (OHLC):** each period is a vertical line from the **high** to the **low**, with a short horizontal mark on the left for the **open** and on the right for the **close**.
- **Candlestick chart:** shows the same four prices as a bar chart, but the range between open and close is drawn as a thick **body**, coloured by whether the price rose or fell. The next lesson explains candles in detail.
- **Area chart:** a line chart with the area below it filled in.
- **Heikin Ashi:** smoothed candles built from **averages** of the current and previous period. They make trends look cleaner, but their open and close are **not prices that actually traded**.
- **Renko and Kagi:** charts that ignore time and only draw a new brick or line when the price moves by a set amount. You will rarely need them as a beginner.

![The same 30 days as normal candles and as Heikin Ashi candles](./img/heikin-ashi.svg)

## Timeframes

Each candle or bar stands for one **period**: 1 minute, 5 minutes, 1 hour, 1 day, 1 week or 1 month. A daily chart has one candle per trading day; a weekly chart combines five days into one candle.

The same market can look completely different on different timeframes: a sharp drop on the 5-minute chart may be a tiny dip on the weekly chart. Longer timeframes give the broader context; shorter ones show detail and noise.

> [!EXAMPLE]
> A share trades for 390 minutes a day (for example 9:30–16:00). On a 1-hour chart, that day becomes six full hourly candles plus a seventh, shorter candle for the last 30 minutes. On a daily chart it is one candle.

## Linear or logarithmic scale

On a **linear** scale, every step on the price axis is the same number of euros: 10 → 20 takes the same space as 100 → 110. On a **logarithmic** scale, every step is the same **percentage**: 10 → 20 (+100%) takes the same space as 100 → 200 (+100%).

![The same price history on a linear and on a logarithmic scale](./img/linear-vs-log.svg)

For long periods and for prices that have grown a lot, the log scale is usually more honest: it shows percentage moves at their true relative size.

## Volume

Most charts show **volume** (the number of shares traded in each period) as bars below the price. A big price move on high volume involved many participants; the same move on very low volume involved few. Volume is covered again in the lessons on trends and indicators.

## Things that can make a chart misleading

- **Adjusted vs unadjusted prices:** after a stock split, the share price drops (for example from €100 to €50 after a 2-for-1 split) without anyone losing money. Charting platforms usually **adjust** older prices so the chart does not show a fake crash. Some platforms also offer an adjustment for dividends. Check the setting before comparing old and new prices.
- **Time zones and sessions:** a daily candle covers the exchange's trading day in its own time zone. Some platforms also show **pre-market and after-hours** candles (see Category E).
- **Gaps:** when the next period opens far away from the previous close, for example after news overnight, the chart shows an empty space: a **gap**.
- **Delayed data:** many exchanges charge for real-time prices, so free charts are often **delayed**, by an amount that depends on the exchange. Check whether your chart is live before relying on the latest candle.

> [!MISTAKE] "The chart shows a crash, so the company lost half its value"
> Check for a stock split first. If the chart is unadjusted, a 2-for-1 split looks like a 50% drop, although shareholders simply own twice as many shares at half the price.

## Key takeaways

> [!TAKEAWAYS]
> - A chart plots price against time; line, bar and candlestick charts are the most common types.
> - Heikin Ashi candles are averages and do not show real traded prices.
> - Each candle stands for one period; the timeframe changes what you see.
> - A log scale shows percentage moves at their true size, useful for long periods.
> - Check adjusted prices, time zone, sessions and whether the data is delayed.
