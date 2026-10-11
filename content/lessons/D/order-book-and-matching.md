---
title: The order book and how orders are matched
category: D
order: 2
level: beginner
summary: Every exchange keeps an order book of buy and sell orders, sorted by price and time. Understanding it explains bid, ask, spread and how trades happen.
readingTime: 7
tags: [order book, bid, ask, spread, price-time priority, matching engine]
lastReviewed: 2026-10-11
sources:
  - title: "Das Orderbuch: Herzstück der Computerbörse (Wiener Börse, in German)"
    url: https://www.wienerborse.at/wissen/einstiegsinformationen/handelsprinzip/orderbuch/
  - title: "Preis-Zeit-Priorität: Definition (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-p/preis-zeit-prioritaet/
  - title: "Market models (Wiener Börse)"
    url: https://www.wienerborse.at/en/trading/trading-information/market-models/
---

At the heart of every electronic exchange is the **order book**: a list of all the buy and sell orders that are waiting to be executed. The Vienna Stock Exchange calls it the heart of the computer exchange.

## Bids and asks

- A **bid** (German: Geld) is an order to **buy**: "I will pay up to this price."
- An **ask** or **offer** (German: Brief) is an order to **sell**: "I will sell for at least this price."

The highest bid is the **best bid**; the lowest ask is the **best ask**. The difference between them is the **spread**.

![Order book: sellers at €10.04 (300 shares), €10.03 (500), €10.02 (200); buyers at €10.00 (400), €9.99 (600), €9.98 (1,000). Spread between best bid €10.00 and best ask €10.02 is €0.02](./order-book.svg)

## Price-time priority

Orders in the book are sorted by two rules:

1. **Price first:** the best price comes first. For buyers that is the highest bid; for sellers the lowest ask.
2. **Then time:** among orders with the same price, the one that arrived first comes first.

This is called **price-time priority**. It rewards those who offer the best price and, at equal prices, those who were there first.

## How a trade happens

As long as the best bid is below the best ask, nothing happens: buyers and sellers do not agree. A trade happens when a new order **crosses** the spread.

> [!EXAMPLE]
> The book looks like the picture above: best bid €10.00, best ask €10.02.
>
> You send a **buy order for 300 shares at up to €10.03**. The matching engine:
>
> 1. Takes the cheapest offer first: **200 shares at €10.02**.
> 2. Then the next: **100 shares at €10.03** (out of the 500 available there).
>
> You bought 300 shares for 200 × €10.02 + 100 × €10.03 = €2,004 + €1,003 = **€3,007**, an average of about €10.023 per share. The book now shows 400 shares still offered at €10.03, and the last traded price is €10.03.

Note that a large order "walks through" several price levels, which is why big orders can move the price.

## What the spread tells you

- A **narrow spread** (e.g. €10.00 / €10.01) usually means many active buyers and sellers: the share is **liquid**.
- A **wide spread** (e.g. €4.80 / €5.20) means few participants: trading is more expensive, because buying at the ask and selling at the bid immediately would lose the spread.

> [!EXAMPLE]
> Bid €4.80, ask €5.20. If you buy 100 shares at €5.20 and immediately sell them at €4.80, you lose 100 × €0.40 = **€40**, before any fees. That is the cost of the spread.

> [!MISTAKE] "The price shown is the price I'll get"
> The "last price" is what the last trade happened at. When you buy now, you usually pay the current **ask**; when you sell, you get the current **bid**. And a large order may only partly fill at the best price.

## Key takeaways

> [!TAKEAWAYS]
> - The order book collects all waiting buy orders (bids) and sell orders (asks).
> - Orders are sorted by price-time priority: best price first, then earliest.
> - A trade happens when an order crosses the spread; large orders can take several price levels.
> - The spread is a cost of trading; narrow spreads usually mean a liquid share.
