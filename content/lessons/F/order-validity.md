---
title: "How long an order lasts: day, GTC, IOC and FOK"
category: F
order: 7
level: intermediate
summary: Besides price conditions, orders have time conditions. They decide whether an unfilled order is cancelled at the end of the day, stays open, or must be filled immediately.
readingTime: 4
tags: [day order, good-till-cancelled, immediate-or-cancel, fill-or-kill]
lastReviewed: 2026-10-11
sources:
  - title: "Understanding Order Types (Investor.gov)"
    url: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14
---

Every order has a **validity**: how long it stays active if it is not executed straight away. Getting this wrong is a common reason why orders "disappear" or, worse, execute weeks later when you no longer expect them to.

## The common validities

| Validity | What it means |
|---|---|
| **Day order** | Valid only for the trading day on which it is entered. If not executed, it is generally cancelled at the end of regular trading hours. |
| **Good-till-cancelled (GTC)** | Stays open until it is executed or you cancel it. Brokers usually set a maximum time limit; ask yours. |
| **Good-till-date** | Stays open until a date you choose. |
| **Immediate-or-cancel (IOC)** | Must execute immediately; any part that cannot be filled at once is cancelled. |
| **Fill-or-kill (FOK)** | Must execute immediately **in full**; otherwise the whole order is cancelled (no partial fills). |

> [!EXAMPLE]
> You place a GTC buy limit order at **€45** for a share trading at €50, and then forget about it. Three months later, after bad news, the price drops to €45 and your order executes. You now own shares you no longer wanted to buy at that moment.

> [!EXAMPLE]
> You want exactly 1,000 shares and nothing less. With **fill-or-kill**, either all 1,000 are bought immediately or none are. With **immediate-or-cancel**, you might get 400 now and the rest is cancelled.

## Tips

- Check your **open orders** regularly, especially GTC orders.
- Know whether your broker's default validity is "day" or "until cancelled".
- Ask your broker what happens to your open orders around events such as a stock split.

> [!MISTAKE] "My order wasn't filled today, so it's gone"
> Not necessarily. If it was good-till-cancelled, it is still waiting in the market and can execute at any time.

## Key takeaways

> [!TAKEAWAYS]
> - Day orders expire at the end of the trading day; GTC orders stay open until filled or cancelled.
> - IOC fills what it can immediately and cancels the rest; FOK fills completely at once or not at all.
> - Review open orders regularly to avoid surprise executions.
