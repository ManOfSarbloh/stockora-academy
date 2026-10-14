---
title: "Screeners and data: useful, but check the numbers"
category: W
order: 5
level: intermediate
summary: Stock screeners filter thousands of shares by criteria such as P/E ratio or dividend yield in seconds. But the data behind them can be delayed, unadjusted, in the wrong currency or simply wrong. How screeners work and a checklist for data you rely on.
readingTime: 6
tags: [stock screener, data quality, filters, adjusted data, currency, survivorship bias]
lastReviewed: 2026-10-14
sources:
  - title: "Kursblatt richtig lesen (Wiener Börse, in German)"
    url: https://www.wienerborse.at/wissen/in-wertpapiere-investieren/informiert-bleiben/kursblatt-richtig-lesen/
  - title: "Beginners' Guide to Financial Statements (U.S. SEC)"
    url: https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements
  - title: "ISIN allocation (OeKB)"
    url: https://www.oekb.at/en/capital-market-services/isin-allocation.html
---

## What a screener does

A **screener** filters a list of securities by criteria you choose, for example:

- market capitalisation above €1 billion;
- P/E ratio below 15 (Category I);
- dividend yield above 3% (Category G);
- listed in Europe, in a certain sector (Category C).

In seconds, thousands of shares become a short list. That's the strength of a screener: it saves time. Its weakness is that it **only knows the numbers it is given**, and it can't tell you why a share passes the filter.

> [!EXAMPLE] Why a "cheap" share is cheap (fictional)
> A screen for P/E below 8 and dividend yield above 7% returns a company. Reading its reports shows that last year's profit included a one-off gain from selling a division, and the dividend was paid from that. Next year, both figures are likely to fall. The screen found a number, not a bargain (Category I, red flags).

## Where data goes wrong

| Problem | What happens | How to check |
|---|---|---|
| **Delay** | Prices are minutes or a day old | Look for a time stamp or "delayed" note (lesson 1) |
| **Unadjusted history** | A split looks like a crash; returns are wrong | Check for split or dividend adjustments (Categories J and V) |
| **Currency** | Figures in dollars mixed with euros | Check the currency of each figure |
| **Wrong security** | Data for a different share class or listing | Match the **ISIN** (Category A) |
| **Stale fundamentals** | Ratios based on old reports | Check the date of the last report used |
| **Different definitions** | "P/E" with reported vs adjusted earnings | Read how the provider defines each figure (Category I) |

## Survivorship bias

Many databases list only companies that **exist today**. If you test a strategy on them, the companies that failed or were taken over disappear from the history, which makes results look better than they really were (Category J).

## A checklist for numbers you rely on

1. **Source:** where does the figure come from originally (lesson 2)?
2. **Date:** as of when?
3. **Definition:** how is it calculated?
4. **Currency and units:** euros or dollars, millions or billions?
5. **Cross-check:** does the company's own report show the same figure?

> [!TIP] The annual report is the reference
> The SEC's beginners' guide explains how to read financial statements directly. When a screener figure looks surprising, open the company's report and check.

## Key takeaways

> [!TAKEAWAYS]
> - Screeners filter many shares quickly but only know the numbers they're fed.
> - A share passing a filter is a starting point for research, not a conclusion.
> - Check for delay, adjustments, currency, the right ISIN, data date and definitions.
> - Databases of today's companies can suffer from survivorship bias.
> - Cross-check important figures with the company's own reports.
