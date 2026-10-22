---
title: Market and limit orders
category: F
order: 5
level: beginner
summary: The two basic order types. A market order guarantees execution but not the price; a limit order guarantees the price (or better) but not execution.
readingTime: 6
tags: [market order, limit order, slippage, partial fill, bid, ask]
lastReviewed: 2026-10-11
sources:
  - title: "Types of Orders (Investor.gov)"
    url: https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders
  - title: "Understanding Order Types (Investor.gov)"
    url: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14
---

When you buy or sell a share, you do not just say "buy". You choose an **order type** that tells the market how to execute your order. The two most important ones are the **market order** and the **limit order**.

## Market order

A **market order** says: "buy (or sell) now, at the best price currently available."

- **Execution is (almost) guaranteed**, as long as there are sellers or buyers.
- **The price is not guaranteed.** A buy market order usually executes around the current **ask**, a sell market order around the current **bid**, but the price you get can differ from the last price you saw, especially if prices move quickly or the order book is thin.

The difference between the price you expected and the price you got is called **slippage**.

> [!EXAMPLE]
> You see a last price of **€20.00** and send a market order to buy **500 shares**. The order book offers 200 shares at €20.02 and 300 at €20.10.
>
> You buy 200 × €20.02 + 300 × €20.10 = €4,004 + €6,030 = **€10,034**, an average of about **€20.07** per share, not €20.00. The slippage cost you about €34.

> [!ANIMATION] market-order-fill
> A market order for 500 shares takes the 200 shares offered at €20.02, then the 300 at €20.10: €10,034 in total, about €20.07 a share instead of €20.00.

## Limit order

A **limit order** says: "buy at this price **or lower**" (or "sell at this price **or higher**").

- **The price is protected:** a buy limit at €50 can only execute at €50 or below.
- **Execution is not guaranteed:** if the market never reaches your limit, nothing happens.

> [!EXAMPLE]
> A share trades at **€52**. You place a **buy limit order at €50**.
>
> - If the price falls to €50 or below and there are sellers, your order executes at €50 or less.
> - If the price never falls that far, your order stays unexecuted, and you might "miss" a rise to €60.

> [!ANIMATION] limit-order
> The same buy limit at €50, two ways it can go: the price comes down to your limit and the order fills, or it never gets there and the order waits while the price rises to €60.

## Partial fills

Orders can be **partially filled**: if you want 1,000 shares at a limit of €50 but only 300 are offered at that price, you might buy 300 now and the remaining 700 later, or never. Some brokers charge a fee for each partial execution, so check your price list.

## Which one to use?

| | Market order | Limit order |
|---|---|---|
| Guarantees execution? | Usually yes | No |
| Guarantees price? | No | Yes (limit or better) |
| Good for | Very liquid shares, small orders, when speed matters | Less liquid shares, larger orders, volatile moments, outside regular hours |

> [!MISTAKE] "A market order executes at the price on my screen"
> The price on your screen is the last trade. A market order executes at the best price available when it reaches the market, which can be noticeably different, especially at the open, in thin markets or when news breaks.

## Key takeaways

> [!TAKEAWAYS]
> - Market orders guarantee execution, not price; limit orders guarantee price, not execution.
> - Slippage is the gap between the price you expected and the price you got.
> - Large orders can be filled at several prices or only partially.
> - Limit orders protect you in illiquid or fast-moving markets.
