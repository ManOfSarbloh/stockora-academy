---
title: "Stop, stop-limit and trailing stop orders"
category: F
order: 6
level: intermediate
summary: Stop orders wait in the background and only become active when a price is reached. They are often used to limit losses, but they are not a guarantee.
readingTime: 6
tags: [stop order, stop-loss, stop-limit, trailing stop, gap]
lastReviewed: 2026-10-11
sources:
  - title: "Stop, Stop-Limit, and Trailing Stop Orders: Investor Bulletin (Investor.gov)"
    url: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15
  - title: "Types of Orders (Investor.gov)"
    url: https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders
---

A **stop order** is an order that sleeps until the price reaches a level you choose, the **stop price**. Then it wakes up and becomes an ordinary order. Stop orders are often used to limit losses, which is why they are also called **stop-loss orders**.

## Stop order (stop-loss)

- A **sell stop** is placed **below** the current price. If the price falls to the stop price, it becomes a **market order** to sell.
- A **buy stop** is placed **above** the current price, for example to limit losses on a short position.

> [!EXAMPLE]
> You own shares at **€40** and place a **sell stop at €36**.
>
> - If the price falls to €36, your stop triggers and a market order to sell is sent. You might sell at €35.95, or lower if prices are falling fast.
> - If the price never reaches €36, nothing happens.

**Important:** the stop price is a trigger, not a guaranteed selling price. If the market opens far below your stop (a **gap**), your market order executes at the much lower price.

> [!EXAMPLE]
> Your sell stop is at €36. Overnight, the company announces bad news. The next morning the share opens at **€30**. Your stop triggers, and you sell at around €30, not €36.

## Stop-limit order

A **stop-limit order** has two prices: a stop price that activates it, and a limit price. When triggered, it becomes a **limit order**. That protects you from selling far below your limit, but it means the order **may not execute at all** if the price drops past the limit.

> [!EXAMPLE]
> Sell stop-limit: stop **€36**, limit **€35**. If the price falls to €36, a sell limit order at €35 is placed. If the price gaps to €30, your order does not execute, and you still hold the shares as they keep falling.

## Trailing stop order

A **trailing stop** sets the stop price as a fixed amount or percentage **below the highest price** reached since you placed the order. When the price rises, the stop moves up; when the price falls, it stays where it is.

> [!EXAMPLE]
> You buy at **€20** and set a trailing stop of **€1**. The share rises to **€24**, so the stop moves up to **€23**. Then the price falls back: at €23 the stop triggers and a sell order is sent.

## Things to check

According to the SEC, not every broker offers all of these order types, and brokers may differ in what triggers a stop (the last trade or the current quotes). Short-term price swings can also trigger a stop and sell your shares just before the price recovers.

> [!MISTAKE] "A stop-loss guarantees I can't lose more than 10%"
> A stop-loss limits losses only if the market trades through your stop price in an orderly way. Gaps, fast markets and illiquid shares can lead to sales far below your stop, and a stop-limit order may not execute at all.

## Key takeaways

> [!TAKEAWAYS]
> - A stop order becomes a market order when the stop price is reached; a stop-limit becomes a limit order.
> - The stop price is a trigger, not a guaranteed execution price; gaps can lead to much worse prices.
> - Stop-limit orders protect the price but may not execute at all.
> - Trailing stops move up with the price but never down.
