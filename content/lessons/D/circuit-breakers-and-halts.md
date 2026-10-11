---
title: Circuit breakers, volatility interruptions and trading halts
category: D
order: 7
level: intermediate
summary: When prices move too far too fast, exchanges pause trading to let everyone catch their breath. Here is how Vienna and the US do it.
readingTime: 6
tags: [circuit breaker, volatility interruption, trading halt, limit up limit down]
lastReviewed: 2026-10-11
sources:
  - title: "Volatility interruption (Wiener Börse)"
    url: https://www.wienerborse.at/en/trading/trading-information/volatility-interruption/
  - title: "Stock Market Circuit Breakers (Investor.gov glossary)"
    url: https://www.investor.gov/introduction-investing/investing-basics/glossary/stock-market-circuit-breakers
---

Sometimes prices move violently: after shocking news, a mistaken order, or panic. Exchanges have built-in "brakes" that pause trading when prices move too far, too fast. The idea is not to stop prices from falling, but to give everyone time to absorb information and to collect enough orders for a fair price.

## Volatility interruptions in Vienna

The Vienna Stock Exchange checks every potential price against two **price corridors**:

- a **dynamic corridor** around the last traded price, and
- a **static corridor** around the last auction price.

If the next price would fall **outside** a corridor, it is not executed. Instead, trading switches into a short **auction** (a volatility interruption), for example **2 minutes** in continuous trading, so that orders can be collected and the price determined in an orderly way. The corridors are set individually for each security, depending on factors such as its type, liquidity and volatility, and are reviewed at least monthly.

> [!EXAMPLE]
> A share last traded at **€30.00** and its dynamic corridor is ±2% (€29.40 to €30.60). A large sell order arrives that would trade at **€28.90**.
>
> Instead of trading at €28.90, the system starts a short auction. Buyers who see the drop can enter orders; the auction then finds a price. That price might be €29.20, or lower if there really are no buyers, but it is found in a controlled way rather than by one order sweeping through an empty book.

## Circuit breakers in the United States

The US has two levels of protection:

**1. Market-wide circuit breakers**, based on the S&P 500 index falling during one day:

| Level | Fall of the S&P 500 | What happens |
|---|---|---|
| Level 1 | 7% | 15-minute halt of all trading, if it happens before 3:25 p.m. New York time |
| Level 2 | 13% | Another 15-minute halt, if before 3:25 p.m. |
| Level 3 | 20% | Trading halted for the rest of the day |

**2. Limit up–limit down (LULD)** for individual stocks: each stock has price bands; if a stock moves outside its band and does not come back quickly, trading in that stock pauses for a few minutes.

## Trading halts and suspensions

Apart from these automatic mechanisms, trading in a single share can also be **halted or suspended**, for example when important news is pending and the market needs time to receive it. Your orders may then sit unexecuted until trading resumes.

> [!MISTAKE] "A circuit breaker protects me from losses"
> It only pauses trading. When trading resumes, the price can still be much lower. Circuit breakers aim for orderly markets, not for stopping prices from falling.

## Key takeaways

> [!TAKEAWAYS]
> - Exchanges pause trading when prices move too far, too fast.
> - In Vienna, prices outside a dynamic or static corridor trigger a short auction (volatility interruption).
> - In the US, market-wide circuit breakers trigger at S&P 500 falls of 7%, 13% and 20%; LULD pauses individual stocks.
> - Pauses help prices form in an orderly way; they do not prevent losses.
