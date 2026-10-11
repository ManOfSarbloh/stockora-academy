---
title: What an index is and how it is built
category: H
order: 1
level: beginner
summary: An index summarises the prices of a group of shares in one number. How it weights its members decides what it really measures.
readingTime: 6
tags: [index, market-cap weighted, price weighted, equal weighted, free float]
lastReviewed: 2026-10-11
sources:
  - title: "ATX: Definition (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-a/atx/
  - title: "Dow Jones Industrial Average (S&P Dow Jones Indices)"
    url: https://www.spglobal.com/spdji/en/indices/equity/dow-jones-industrial-average/
  - title: "Nikkei 225: Index Information (Nikkei Inc.)"
    url: https://indexes.nikkei.co.jp/en/nkave/index/profile?idx=nk225
  - title: "Smart Beta: What You Need to Know (FINRA)"
    url: https://www.finra.org/investors/insights/smart-beta-what-you-need-know
---

A **stock index** is a number that tracks the prices of a selected group of shares. It answers questions like "how did Austria's biggest companies do today?" in one figure. Indexes are also the basis of index funds and ETFs (later in this topic).

## The recipe of an index

Every index has rules that answer three questions:

1. **Which shares are in it?** For example, the largest and most traded shares of one country.
2. **How much does each one count (weighting)?**
3. **When is it reviewed?** Members are added and removed at regular dates (Category E).

## Weighting methods

**Market-capitalisation weighted:** bigger companies count more. Each share's weight is its market value (price × number of shares) divided by the total of all members. Most major indexes work this way.

> [!AUSTRIA]
> The ATX is the Vienna Stock Exchange's leading index of the roughly 20 most liquid shares, weighted by market value. It is calculated in real time.

**Free-float adjusted:** most market-cap indexes only count the shares that are actually available for trading (the **free float**), not blocks held by founders, governments or strategic owners.

**Price weighted:** shares count according to their **price per share**, regardless of company size. A share costing €200 counts ten times as much as one costing €20. The **Dow Jones Industrial Average** (30 US blue chips) and Japan's **Nikkei 225** are price weighted.

**Equal weighted:** every member counts the same, regardless of size. Small members therefore matter as much as giants.

> [!EXAMPLE]
> An index has two companies:
>
> | | Share price | Shares | Market value |
> |---|---|---|---|
> | Big AG | €20 | 9,000,000 | €180m |
> | Small AG | €200 | 100,000 | €20m |
>
> - **Market-cap weighted:** Big AG is 90%, Small AG 10%.
> - **Price weighted:** Small AG counts 10 times as much as Big AG (€200 vs €20), so it is about 91% of the index, even though it is the much smaller company.
> - **Equal weighted:** 50% / 50%.
>
> If Small AG rises 10% and Big AG stays flat, the market-cap index rises 1%, the price-weighted index about 9%, and the equal-weighted index 5%.

## Other "smart" weightings

Some indexes are weighted by other rules, such as dividends, revenues or volatility. FINRA calls these **smart beta** approaches and warns that their returns can differ a lot from market-cap weighted indexes and that some are more concentrated (see the lesson on factor ETFs).

> [!MISTAKE] "The index tells me how the whole market did"
> An index only shows how *its* members did, according to *its* weighting. A price-weighted index of 30 shares and a market-cap index of 500 shares can tell very different stories on the same day.

## Key takeaways

> [!TAKEAWAYS]
> - An index tracks a selected group of shares according to fixed rules.
> - Most major indexes are weighted by free-float market capitalisation: bigger companies count more.
> - The Dow Jones and Nikkei 225 are price weighted: expensive shares count more.
> - Equal-weighted and other "smart beta" indexes use different rules and behave differently.
