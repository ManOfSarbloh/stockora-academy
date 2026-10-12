---
title: "Drawdowns, recovery and volatility drag"
category: P
order: 3
level: intermediate
summary: "The deepest fall from a peak and the time to recover often matter more to investors than average returns. And swings themselves cost money: +50% followed by −50% leaves you 25% down."
readingTime: 6
tags: [drawdown, maximum drawdown, recovery time, volatility drag, compound return, arithmetic average]
lastReviewed: 2026-10-12
sources:
  - title: "Historical Returns on Stocks, Bonds and Bills, 1928–2025 (Aswath Damodaran, NYU Stern)"
    url: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html
  - title: "Stock Market Crash of 1929 (Federal Reserve History)"
    url: https://www.federalreservehistory.org/essays/stock-market-crash-of-1929
  - title: "History of the market (Nikkei Indexes)"
    url: https://indexes.nikkei.co.jp/70th/historyofthemarket-article.html
---

Volatility (lesson 2) measures swings in both directions. Many investors care more about one question: **how much could I lose from the top, and how long would it take to get back?**

## Maximum drawdown

The **drawdown** is the fall from a previous peak to a later low (Category K). The **maximum drawdown** is the largest such fall over a period.

> [!EXAMPLE] Drawdowns in history
> - Dow Jones, September 1929 to July 1932: **−89%** (Federal Reserve History).
> - S&P 500 with dividends, measured on year-end values only: about **−65%** in the early 1930s (Damodaran's data, own calculation). Falls within years were deeper.
> - Nikkei 225, end of 1989 to October 1998: from 38,915 to 12,879 yen, about **−67%** (Nikkei Indexes).

## Recovery needs bigger gains

| Drawdown | Gain needed to recover |
|---:|---:|
| −20% | +25% |
| −35% | +54% |
| −50% | +100% |
| −65% | +186% |
| −89% | +809% |

Formula: gain needed = 1 ÷ (1 − loss) − 1. At 7% a year, recovering from −50% takes over 10 years; at 10% a year, about 7 years.

## Volatility drag: why swings cost money

The **average** of yearly returns is not the same as what your money actually earns.

> [!EXAMPLE] +50%, then −50%
> €1,000 rises 50% to €1,500, then falls 50% to **€750**.
> The arithmetic average return is (50% − 50%) ÷ 2 = **0%**. Your actual result: **−25%**.

The return your money actually earns over time is the **compound (geometric) return**. The more volatile the returns, the bigger the gap below the arithmetic average. This gap is often called **volatility drag**.

> [!EXAMPLE] The gap in real data
> S&P 500, 1928–2025 (Damodaran, own calculation):
> - Arithmetic average of yearly returns: about **11.9%**.
> - Compound annual return: about **10.0%**.
>
> The 1.9-point difference is the cost of the swings.

A useful approximation: **compound return ≈ average return − ½ × volatility²**. With 11.9% and 19.4% volatility: 11.9% − ½ × 19.4%² ≈ 11.9% − 1.9% = 10.0%.

## Why this matters for you

1. **Avoiding deep losses helps compounding.** Reducing the depth of falls can matter as much as chasing higher returns.
2. **Leverage makes drag much worse** (Category N). Higher volatility increases the gap; leveraged ETFs suffer from this daily (Category H).
3. **Your time horizon must cover the recovery.** If you need the money in three years, a drawdown that takes seven years to recover is a real loss (Category M).

> [!MISTAKE] Judging a fund by its average return
> A fund advertising a high "average return" can have earned much less in practice if its returns swung widely. Look at the compound return, and at the maximum drawdown.

## Key takeaways

> [!TAKEAWAYS]
> - Maximum drawdown is the largest fall from a peak; recovering needs a larger percentage gain.
> - −50% needs +100% to recover; −89% (Dow 1929–1932) needed more than +800%.
> - The compound return is lower than the average return when returns swing: volatility drag.
> - S&P 500, 1928–2025: average 11.9% but compound 10.0% a year.
> - Limiting deep losses and avoiding leverage protect long-run compounding.
