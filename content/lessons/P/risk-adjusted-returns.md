---
title: "Risk-adjusted returns: the Sharpe ratio"
category: P
order: 5
level: advanced
summary: A higher return is only impressive if it did not require far more risk. The Sharpe ratio, described by economist William F. Sharpe, measures excess return per unit of risk. How to calculate and use it, and its limits.
readingTime: 6
tags: [Sharpe ratio, risk-adjusted return, excess return, standard deviation, comparing funds]
lastReviewed: 2026-10-12
sources:
  - title: "The Sharpe Ratio (William F. Sharpe, The Journal of Portfolio Management, Fall 1994, reprinted at Stanford University)"
    url: https://web.stanford.edu/~wfsharpe/art/sr/sr.htm
  - title: "Historical Returns on Stocks, Bonds and Bills, 1928–2025 (Aswath Damodaran, NYU Stern)"
    url: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html
---

Fund A returned 12% a year, fund B 9%. Is A better? Not necessarily. If A achieved its return by taking far more risk, B may have been the better deal. **Risk-adjusted** measures put return in relation to risk.

## The Sharpe ratio

Stanford economist William F. Sharpe described the ratio in a 1994 article. In its usual form:

**Sharpe ratio = (return of the investment − return of a benchmark) ÷ standard deviation of that difference**

The benchmark is usually a **risk-free** investment such as short-term government bills. The difference is the **excess return**: what you earned for taking risk. Sharpe explains that the ratio shows the **differential return per unit of risk** associated with it.

> [!EXAMPLE] Comparing two funds
> Risk-free rate: 3%.
> - **Fund A:** return 12%, volatility 20%. Sharpe = (12 − 3) ÷ 20 = **0.45**.
> - **Fund B:** return 9%, volatility 10%. Sharpe = (9 − 3) ÷ 10 = **0.60**.
>
> B earned more return per unit of risk. With moderate borrowing, or by mixing B with a riskier fund, an investor could in principle reach A's risk level with a higher expected return. For most private investors, the practical lesson is simpler: A's extra return came at a high price in risk.

(For simplicity, this example uses each fund's own volatility, as is common in practice.)

## Long-run examples

From Damodaran's yearly US data, 1928–2025, using 3-month Treasury bills as the risk-free benchmark (own calculation, annual data):

| Portfolio | Average excess return | Volatility of excess return | Sharpe ratio |
|---|---:|---:|---:|
| S&P 500 | 8.4% | 19.7% | 0.43 |
| 60% shares / 40% bonds | 5.6% | 12.3% | 0.46 |
| 10-year Treasury bonds | 1.4% | 7.6% | 0.18 |

The 60/40 mix earned less than shares alone, but slightly **more per unit of risk**, because of the diversification benefit (lesson 4).

## Limits

- **Volatility is not all risk.** The ratio treats up and down swings alike and ignores rare catastrophic losses (lesson 2).
- **Past ratios do not predict future ones.** A high Sharpe ratio over a short period can be luck.
- **Strategies with hidden tail risk**, such as selling options (Category N), can show smooth returns and a high Sharpe ratio until one large loss.
- **Compare like with like:** same period, same currency, same benchmark, same data frequency.

> [!TIP] Where to find it
> Fund factsheets and data providers often show volatility and sometimes the Sharpe ratio. Check over which period and against which risk-free rate it was calculated.

## Key takeaways

> [!TAKEAWAYS]
> - Risk-adjusted measures relate return to the risk taken.
> - Sharpe ratio = excess return over a risk-free benchmark ÷ its standard deviation (William Sharpe).
> - A fund with lower return can have a better Sharpe ratio if it took much less risk.
> - US data 1928–2025: shares about 0.43, a 60/40 mix about 0.46.
> - The ratio ignores rare extreme losses and depends heavily on the period chosen.
