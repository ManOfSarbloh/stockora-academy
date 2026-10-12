---
title: "Volatility: measuring how much prices swing"
category: P
order: 2
level: intermediate
summary: Volatility, usually measured as the standard deviation of returns, shows how widely returns spread around their average. Learn how to read it, what nearly a century of US data shows, and how the KID's risk scale uses it.
readingTime: 7
tags: [volatility, standard deviation, risk indicator, KID, SRI, PRIIPs]
lastReviewed: 2026-10-12
sources:
  - title: "Historical Returns on Stocks, Bonds and Bills, 1928–2025 (Aswath Damodaran, NYU Stern)"
    url: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html
  - title: "Commission Delegated Regulation (EU) 2017/653 on key information documents for PRIIPs, Annex II (EUR-Lex)"
    url: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32017R0653
  - title: "Zertifikate Lupe (FMA, Reden wir über Geld, in German)"
    url: https://redenwiruebergeld.fma.gv.at/zertifikate-lupe/
  - title: "What is Risk? (Investor.gov, U.S. SEC)"
    url: https://www.investor.gov/introduction-investing/investing-basics/what-risk
---

**Volatility** describes how strongly and how often the price of an investment moves up and down. It is the most widely used number for risk, although not the only one.

## Standard deviation

Volatility is usually measured as the **standard deviation** of returns: a measure of how far individual returns typically lie from their average. A higher standard deviation means a wider spread of outcomes.

> [!EXAMPLE] Two investments with the same average
> Both average 5% a year over four years.
> - A: 4%, 6%, 5%, 5%. Returns barely move: **low** volatility.
> - B: 30%, −20%, 25%, −15%. Returns swing wildly: **high** volatility.
>
> Same average, very different experience. And B's money actually grew less (see lesson 3).

## What the long-run data shows

Using Damodaran's yearly US data for **1928 to 2025** (98 years, own calculation):

| Investment | Average yearly return | Standard deviation |
|---|---:|---:|
| S&P 500 (with dividends) | 11.9% | 19.4% |
| US small companies | 17.8% | 38.0% |
| 10-year US Treasury bonds | 4.8% | 7.9% |
| 3-month US Treasury bills | 3.4% | 3.0% |
| Gold | 7.4% | 21.5% |

*Arithmetic averages of yearly returns, in US dollars, before inflation, costs and taxes.*

Higher average returns came with higher volatility: small companies had both the highest average and twice the volatility of the S&P 500.

## Reading a standard deviation

A rough rule: in about two-thirds of years, returns land within **one standard deviation** of the average. For the S&P 500 that is roughly 11.9% ± 19.4%, i.e. between about −7.5% and +31.3%. In the data, **65 of the 98 years** fell in that range, and **94 of 98** within two standard deviations.

> [!WARNING] Real markets have fatter tails
> The rule of thumb understates extreme events. Years like 1931 (−43.8%) and crashes like 19 October 1987 (−22.6% in one day, Category K) happen more often than a simple bell curve suggests.

## Volatility in the KID: the risk indicator 1–7

The **Key Information Document** for retail investment products shows a summary risk indicator from **1 (lower risk) to 7 (higher risk)**. The FMA explains that it combines the product's **market risk** and the **credit risk of the issuer**.

The market risk part is based on a volatility measure set by EU rules (Delegated Regulation (EU) 2017/653, Annex II), the "VaR-equivalent volatility" (VEV):

| Market risk class | VaR-equivalent volatility |
|---:|---|
| 1 | below 0.5% |
| 2 | 0.5% – 5.0% |
| 3 | 5.0% – 12% |
| 4 | 12% – 20% |
| 5 | 20% – 30% |
| 6 | 30% – 80% |
| 7 | above 80% |

As a rough guide, a broad share fund with volatility in the high teens would land in the middle of the scale, while highly leveraged products land at the top.

## Limits of volatility as a risk measure

- It treats **upward and downward** swings the same, although investors mainly fear losses.
- It is **backward-looking**: calm years can be followed by a crash.
- It says nothing about **permanent loss**, such as a company going bankrupt.
- Investor.gov points out that market fluctuations can be **unnerving**: your ability to stay calm matters as much as the number (Category O).

## Key takeaways

> [!TAKEAWAYS]
> - Volatility measures how widely returns swing; it is usually the standard deviation of returns.
> - S&P 500, 1928–2025: average yearly return about 11.9%, standard deviation about 19.4%.
> - About two-thirds of years fall within one standard deviation, but extreme events are more frequent than a bell curve implies.
> - The KID's risk indicator (1–7) uses volatility-based market risk classes plus issuer credit risk.
> - Volatility does not capture permanent losses or your emotional reaction.
