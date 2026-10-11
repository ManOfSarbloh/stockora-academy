---
title: "Ticker, ISIN and WKN: how a share is identified"
category: A
order: 8
level: beginner
summary: Every share has codes that identify it. Knowing which code means what helps you avoid buying the wrong thing.
readingTime: 5
tags: [ticker, ISIN, WKN, identifiers]
lastReviewed: 2026-10-11
sources:
  - title: "ISIN allocation (OeKB, Oesterreichische Kontrollbank)"
    url: https://www.oekb.at/en/capital-market-services/isin-allocation.html
  - title: "ISIN FAQ (Banca d'Italia)"
    url: https://www.bancaditalia.it/statistiche/servizi/isin-anagrafe-titoli/faq/index.html
  - title: "WKN (Deutsche Börse glossary)"
    url: https://www.deutsche-boerse.com/dbg-en/about-us/contact/glossary/glossary-article/WKN-246456
---

Company names are not precise enough for trading: many companies have similar names, one company can have several kinds of shares, and the same share can trade in different places. So securities are identified by codes. You will meet three of them.

## The ticker symbol

A **ticker** (or ticker symbol) is a short code, usually a few letters, that a stock exchange uses for a listed share. It is what you see on price screens and charts.

Tickers are handy but **not unique worldwide**: each exchange assigns its own, so the same company can have different tickers on different exchanges, and the same letters can mean different companies on different exchanges. Charting platforms therefore often show the exchange in front of the ticker, in a format like `EXCHANGE:TICKER` (more on that in the Chart School).

## The ISIN: the international ID

The **ISIN** (International Securities Identification Number) identifies one specific security worldwide. According to the Austrian numbering agency OeKB, all securities traded on stock exchanges need an ISIN. It always has **12 characters**, built from three parts:

| Part | Length | Meaning |
|---|---|---|
| Country code | 2 letters | The country of the national agency that assigned the ISIN, e.g. `AT` for Austria, `DE` for Germany, `US` for the United States |
| Basic number | 9 characters | Letters and digits chosen by that agency |
| Check digit | 1 digit | Calculated from the other 11 characters, so that typing mistakes can be detected |

So an Austrian share's ISIN looks like `AT` + nine characters + one check digit. The ISIN format is an international standard (ISO 6166), and every country has a national numbering agency that assigns them.

> [!AUSTRIA]
> In Austria, ISINs are assigned by the **Oesterreichische Kontrollbank (OeKB)**. Austrian securities therefore usually have ISINs starting with `AT`.

## The WKN: the German code

The **WKN** (Wertpapierkennnummer, "securities identification number") is a six-character code from Germany. It is older than the ISIN, which has largely replaced it, but you will still see it very often at banks and brokers in German-speaking countries, including Austria. For securities registered in Germany, the WKN is part of the ISIN.

## Why this matters to you

The same company can have several different securities: ordinary and preferred shares, shares listed in different countries, bonds, and products issued by banks that merely *track* the company's share. Their names can look almost identical, but each has its own ISIN.

> [!EXAMPLE]
> You want to buy shares of a company and search your broker's app for its name. Five results appear: two share classes, a bond, and two bank products that bet on the share price.
>
> If you check the **ISIN** against the one in the company's own investor-relations page, you know exactly which one is the ordinary share you were looking for.

> [!MISTAKE] "I'll just search by name and pick the first result"
> That is how people end up buying a different share class, a product in another currency, or a leveraged bank product by accident. Always confirm the ISIN (and the exchange and currency) before placing an order.

## Key takeaways

> [!TAKEAWAYS]
> - A ticker is a short exchange code; it is not unique across exchanges.
> - The ISIN is the unique international ID: 12 characters (country, basic number, check digit).
> - In Austria, the OeKB assigns ISINs.
> - The WKN is a six-character German code that is still widely used in German-speaking countries.
> - Check the ISIN before you buy, so you get exactly the security you meant.
