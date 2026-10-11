---
title: Auctions and continuous trading
category: D
order: 3
level: intermediate
summary: Exchanges combine continuous trading during the day with auctions at the open, sometimes midday, and at the close. Auctions collect orders and find one price for all of them.
readingTime: 6
tags: [auction, opening auction, closing auction, continuous trading, trading hours]
lastReviewed: 2026-10-11
sources:
  - title: "Market models (Wiener Börse)"
    url: https://www.wienerborse.at/en/trading/trading-information/market-models/
  - title: "Trading hours (Wiener Börse)"
    url: https://www.wienerborse.at/en/trading/trading-information/trading-hours/
---

There are two basic ways an exchange can match orders: **continuously**, one trade after another as orders arrive, or in an **auction**, where orders are collected for a while and then matched all at once at a single price. Most exchanges with liquid shares use both.

## Continuous trading

During continuous trading, every incoming order is immediately checked against the order book. If it can be matched, it trades at once; otherwise it waits in the book. Prices can change with every trade.

## Auctions

An auction has two steps:

1. **Call phase:** orders are collected. Participants can enter, change or delete orders, but nothing trades yet. Usually an *indicative* price is shown, so everyone can see where the auction would currently end up. At the Vienna Stock Exchange, the call phase ends at a random moment after a minimum duration, which makes it harder to manipulate the result.
2. **Price determination:** the system calculates the single price at which the **largest number of shares** can be traded, and executes all matching orders at that price.

> [!EXAMPLE]
> In an opening auction, these orders have been collected:
>
> | Price | Shares buyers would buy at this price | Shares sellers would sell at this price |
> |---|---|---|
> | €20.20 | 300 | 1,500 |
> | €20.10 | 700 | 1,000 |
> | €20.00 | 1,000 | 800 |
> | €19.90 | 1,600 | 400 |
>
> At **€20.00**, buyers want 1,000 and sellers offer 800, so **800 shares** can trade. At €20.10 only 700 could trade (limited by buyers), at €19.90 only 400 (limited by sellers). So the auction price is **€20.00**, and 800 shares change hands at that single price.

## Why auctions are used at the open and close

- **Opening auction:** overnight, news has piled up. Collecting orders first and finding one fair opening price avoids a chaotic start.
- **Closing auction:** many investors and funds want to trade at the official **closing price**, which is also used to value portfolios and calculate indexes. An auction concentrates their orders into one robust price.
- **Intraday auction:** some markets add a short auction in the middle of the day to bundle liquidity.

> [!AUSTRIA]
> On the Vienna Stock Exchange, shares in the ATX index trade like this on a normal day: **opening auction 08:55–09:00**, continuous trading **09:00–12:00**, intraday auction **12:00–12:03**, continuous trading **12:03–17:30**, **closing auction 17:30–17:35**, followed by "trade at close" until 17:45, where orders can be executed at the closing price. Less liquid shares may trade only in auctions.

> [!VERIFY]
> Trading hours and phases change from time to time and differ by segment. Check the exchange's official trading-hours page before relying on exact times. The Trading Times section of this site will show live open/closed status.

> [!MISTAKE] "My order at 08:56 will be filled immediately"
> During an auction's call phase, orders are only collected. Your order is executed (if at all) when the auction price is determined, at the auction price, not at the moment you sent it.

## Key takeaways

> [!TAKEAWAYS]
> - Continuous trading matches orders immediately as they arrive.
> - Auctions collect orders in a call phase and then trade them all at one price.
> - The auction price is the one at which the most shares can be traded.
> - Opening and closing auctions create fair, robust prices at the start and end of the day.
