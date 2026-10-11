---
title: "A chart-reading routine, multi-timeframe analysis and backtesting"
category: J
order: 9
level: intermediate
summary: A step-by-step checklist for reading any chart, top-down from weekly to hourly, plus the traps of backtesting and why practice with play money comes first.
readingTime: 8
tags: [multi-timeframe analysis, checklist, backtesting, overfitting, survivorship bias, paper trading]
lastReviewed: 2026-10-11
sources:
  - title: "Park & Irwin (2007): What do we know about the profitability of technical analysis? (abstract via IDEAS/RePEc)"
    url: https://ideas.repec.org/a/bla/jecsur/v21y2007i4p786-826.html
  - title: "Demo features on TradingView: bar replay, strategy report, paper trading (TradingView Help Center)"
    url: https://www.tradingview.com/support/solutions/43000754966-demo-features-on-tradingview/
  - title: "Chart types: candlestick, line, bar, including time frames (CME Group education)"
    url: https://www.cmegroup.com/education/courses/technical-analysis/chart-types-candlestick-line-bar
---

You now know the building blocks. This lesson puts them into a routine you can use on any chart, and explains why testing ideas on past data is harder than it looks.

## Top-down: from the big picture to the detail

Look at the same market on several timeframes, starting with the longest:

1. **Weekly:** what is the long-term trend? Where are the major highs and lows?
2. **Daily:** is the medium-term structure in line with the weekly picture? Where are the nearest support and resistance zones?
3. **Hourly (or shorter):** only if your plan needs it, for detail around a specific level.

The longer timeframe gives the context; the shorter one shows the detail. A buy signal on the 5-minute chart against a clear weekly downtrend is a very different situation from one in the direction of the weekly trend.

## A beginner's checklist

> [!TIP] Nine steps for reading a chart
> 1. **Confirm what you are looking at:** symbol, exchange, currency, and whether the data is real-time or delayed.
> 2. **Pick the timeframe** that matches your goal (a long-term investor does not need 1-minute candles).
> 3. **Read the trend structure:** higher highs and lows, lower highs and lows, or a range?
> 4. **Mark support and resistance zones.**
> 5. **Look at the latest candles** in that context.
> 6. **Check volume:** is a move supported by unusual activity?
> 7. **Add at most one or two indicators**, and know what they measure.
> 8. **Write down what would prove you wrong:** the price at which your reading no longer holds.
> 9. **Accept that "no trade" is a valid decision.** Most of the time, a chart does not offer a clear picture.

## Backtesting and its traps

**Backtesting** means checking how a set of rules would have performed on past data. It is useful for rejecting bad ideas, but it easily produces results that look better than reality:

- **Overfitting (curve fitting):** tweaking rules until they fit the past perfectly. Such rules usually fail on new data.
- **Data snooping:** testing many rules and keeping only the best one. Park and Irwin (2007) name data snooping and selecting rules after seeing the results as common problems in technical analysis research.
- **Survivorship bias:** testing only on companies that still exist today ignores those that went bankrupt or were delisted, which makes results look better.
- **Ignoring costs:** commissions, spreads, slippage and taxes can turn a small edge into a loss (Category G).
- **Look-ahead bias:** accidentally using information that was not available at the time (for example, a closing price before the close).

## Practice first: replay and paper trading

Many charting platforms offer a **replay mode** that plays past candles one by one, and **paper trading**: a simulated account with virtual money. Both let you practise reading charts and following your rules without risking money. Practice results are flattering, though: there are no real emotions, and simulated fills may be better than real ones.

> [!MISTAKE] "My backtest made 300% a year, so the strategy works"
> Spectacular backtests are almost always a warning sign of overfitting, survivorship bias or missing costs. Test on data the rules have never seen, include realistic costs, and expect real results to be worse.

Practise the routine in the [Chart Lab](/charts/lab): switch timeframes, use replay mode and play the "reveal the next candle" game.

## Key takeaways

> [!TAKEAWAYS]
> - Read charts top-down: weekly for context, daily for structure, shorter timeframes only for detail.
> - Follow a checklist and write down what would prove you wrong; "no trade" is a valid outcome.
> - Backtests suffer from overfitting, data snooping, survivorship bias, look-ahead bias and missing costs.
> - Practise with replay and paper trading before risking real money, and expect real results to be worse.
