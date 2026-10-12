---
title: "Correlation: why a mix can be less risky than its parts"
category: P
order: 4
level: advanced
summary: Correlation measures whether investments move together. Combining assets that do not move in lockstep lowers portfolio volatility. The maths, real data and the warning that correlations change.
readingTime: 7
tags: [correlation, portfolio risk, diversification, stocks and bonds, covariance]
lastReviewed: 2026-10-12
sources:
  - title: "Historical Returns on Stocks, Bonds and Bills, 1928–2025 (Aswath Damodaran, NYU Stern)"
    url: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html
  - title: "Beginners' Guide to Asset Allocation, Diversification, and Rebalancing (Investor.gov, U.S. SEC)"
    url: https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset
  - title: "Psychologische Fallen bei Anlageentscheidungen und wie Sie diese vermeiden können (FMA, in German)"
    url: https://www.fma.gv.at/geldanlage/psychologische-fallen-bei-anlageentscheidungen-und-wie-sie-diese-vermeiden-koennen/
---

The SEC's beginners' guide explains why diversification works: the returns of the major asset categories have historically **not moved up and down at the same time**. **Correlation** turns that idea into a number.

## What correlation means

Correlation measures how closely two investments move together, on a scale from **−1 to +1**:

| Correlation | Meaning |
|---:|---|
| +1 | They always move in the same direction, in proportion. No diversification benefit. |
| 0 | No consistent relationship. |
| −1 | They always move in opposite directions. |

The lower the correlation, the more combining them reduces risk.

## Why a mix is less volatile

If two investments are not perfectly correlated, the volatility of the mix is **lower than the weighted average** of their volatilities.

> [!EXAMPLE] Shares and bonds, 1928–2025
> From Damodaran's yearly US data (own calculation):
> - S&P 500 volatility: **19.4%**. 10-year Treasury bond volatility: **7.9%**.
> - Weighted average for a 60/40 mix: 0.6 × 19.4% + 0.4 × 7.9% = **14.8%**.
> - Actual volatility of a 60/40 mix rebalanced every year: **12.1%**.
>
> The correlation between yearly share and bond returns over the whole period was close to **zero (0.02)**, so the mix was much smoother than its parts.

The formula for two assets, for those who like maths:

**σ²(portfolio) = w₁²σ₁² + w₂²σ₂² + 2·w₁·w₂·ρ·σ₁·σ₂**

where w are the weights, σ the volatilities and ρ the correlation. With ρ below 1, the last term shrinks, and so does the portfolio's risk.

## Correlations change

Correlation is not a fixed law of nature. In the same data:

- 1928–1999: share–bond correlation about **+0.15**.
- 2000–2025: about **−0.36**: bonds often rose when shares fell, as in 2008 (+20.1% versus −36.6%).
- Yet in **2022**, both fell about 18% (Category K).

The FMA makes a related point about home bias: investments in the same home market tend to be more correlated with each other than internationally diversified investments (Category O).

> [!WARNING] In a panic, correlations can jump
> In severe crises, many risky assets tend to fall together. A portfolio of shares from many sectors still falls in a market-wide crash. Only assets that behave genuinely differently, such as high-quality government bonds or cash, have tended to cushion such falls, and not always.

## Practical use

- When adding an investment, ask: does it behave **differently** from what I already own? Another large-cap share fund probably does not.
- **Cash and high-quality bonds** are the classic diversifiers for share portfolios.
- Correlations estimated from short periods are unreliable; prefer long histories and expect surprises.

## Key takeaways

> [!TAKEAWAYS]
> - Correlation (−1 to +1) measures how closely investments move together.
> - With correlation below +1, a mix is less volatile than the weighted average of its parts.
> - US data 1928–2025: shares 19.4%, bonds 7.9%, 60/40 mix only 12.1% volatility.
> - Correlations change over time: negative since 2000 on average, but shares and bonds fell together in 2022.
> - In crises, risky assets often fall together.
