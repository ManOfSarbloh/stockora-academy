---
title: Time zones and daylight saving time
category: E
order: 5
level: intermediate
summary: Exchanges run on local time, and Europe and the US change their clocks on different dates. For a few weeks each year, the US market opens an hour earlier in Vienna.
readingTime: 6
tags: [time zones, daylight saving time, DST, New York, Vienna]
lastReviewed: 2026-10-11
sources:
  - title: "Directive 2000/84/EC on summer-time arrangements (EUR-Lex)"
    url: "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32000L0084"
  - title: "Daylight Saving Time Rules (NIST, U.S. National Institute of Standards and Technology)"
    url: https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst
  - title: "Holidays & Trading Hours (New York Stock Exchange)"
    url: https://www.nyse.com/trade/hours-calendars
---

Every exchange sets its hours in **local time**. To know when a foreign market is open for you, you have to convert, and twice a year that conversion changes because of **daylight saving time (DST)**, called summer time in Europe.

## Vienna and New York: the normal gap

New York is normally **6 hours behind** Vienna. The NYSE core session from **9:30 to 16:00** New York time is therefore usually **15:30 to 22:00** in Vienna.

## The clocks change on different dates

- **European Union:** summer time starts at 01:00 UTC on the **last Sunday in March** and ends at 01:00 UTC on the **last Sunday in October** (Directive 2000/84/EC). All EU countries switch at the same moment.
- **United States:** daylight saving time starts at 2 a.m. local time on the **second Sunday in March** and ends on the **first Sunday in November** (rules in force since 2007).

Because the US switches earlier in spring and later in autumn, there are a few weeks each year when the gap between Vienna and New York is only **5 hours**.

> [!EXAMPLE]
> **2026:**
>
> | Period | NYSE opens in Vienna at | NYSE closes in Vienna at |
> |---|---|---|
> | Until 7 March | 15:30 | 22:00 |
> | **8 March – 28 March** | **14:30** | **21:00** |
> | 29 March – 24 October | 15:30 | 22:00 |
> | **25 October – 31 October** | **14:30** | **21:00** |
> | From 1 November | 15:30 | 22:00 |
>
> In 2027 the special weeks are 14–27 March and 31 October–6 November.

These dates were calculated from the official time zone database (the IANA tz database used by computers worldwide), not typed in by hand.

## Countries without DST

Many countries, including Japan, China and India, do not use daylight saving time at all. Their offset to Vienna therefore changes by one hour when *Europe* switches its clocks.

> [!WARNING]
> Time zone mistakes are a classic source of errors: a missed opening, an order placed when the market was already closed, or a wrongly timed news reaction. Always check the conversion for the actual date, especially in March, October and November.

> [!MISTAKE] "New York is always six hours behind Vienna"
> Usually, but not for a few weeks in March and October/November, when the gap is five hours because the US and EU change their clocks on different Sundays.

## Key takeaways

> [!TAKEAWAYS]
> - Exchanges run on local time; you must convert to your own time zone.
> - The EU switches clocks on the last Sundays of March and October; the US on the second Sunday of March and the first Sunday of November.
> - For a few weeks a year, the NYSE opens at 14:30 instead of 15:30 Vienna time.
> - Many Asian countries have no DST, so their offset to Europe changes when Europe switches.
