---
title: "Options: calls, puts and the price of a right"
category: N
order: 5
level: advanced
summary: An option gives the right, but not the obligation, to buy or sell at a fixed price. Buyers can lose the premium; sellers can lose far more. Learn calls, puts, payoffs at expiry, leverage and the time-decay trap.
readingTime: 8
tags: [options, call, put, premium, strike price, option writer, leverage, expiry]
lastReviewed: 2026-10-11
sources:
  - title: "Options (Investor.gov glossary, U.S. SEC)"
    url: https://www.investor.gov/introduction-investing/investing-basics/glossary/options
  - title: "Option (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-o/option/
  - title: "Call (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-c/call/
  - title: "Put (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-p/put/
  - title: "Stillhalter (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-s/stillhalter/
  - title: "Hebel (Wiener Börse Börsenlexikon, in German)"
    url: https://www.wienerborse.at/wissen/boersenlexikon/buchstabe-h/hebel/
  - title: "Derivatives (Investor.gov glossary, U.S. SEC)"
    url: https://www.investor.gov/introduction-investing/investing-basics/glossary/derivatives
  - title: "MiFID II Article 25: Assessment of suitability and appropriateness (ESMA Interactive Single Rulebook)"
    url: https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-25-assessment-suitability-and
---

A **derivative** is a financial instrument whose value is derived from an underlying asset, such as a share or an index (Investor.gov). **Options** are among the oldest and most widely traded derivatives.

## The basic idea

Investor.gov defines options as contracts giving the buyer **the right, but not the obligation**, to buy or sell a security at a fixed price within a specific period. The Wiener Börse lexicon adds the key terms:

- The buyer pays a **premium** for this right.
- The fixed price is the **strike price** (exercise price).
- A **call** is the right to **buy**; a **put** is the right to **sell**.
- **American-style** options can be exercised during the whole term, **European-style** only at the end.
- The **seller** (writer, *Stillhalter*) receives the premium and takes on the **obligation**: to deliver the underlying (call) or to buy it (put) if the buyer exercises.

The lexicon notes that a call that is not exercised **expires worthless**.

## Payoffs at expiry

> [!EXAMPLE] Buying a call
> A share trades at €100. You buy a call with strike €100 for a premium of **€5** per share, expiring in three months.
>
> | Share price at expiry | Value of the call | Your result |
> |---:|---:|---:|
> | €80 | €0 | −€5 (−100%) |
> | €100 | €0 | −€5 (−100%) |
> | €105 | €5 | €0 |
> | €120 | €20 | +€15 (+300%) |
>
> The share needs to rise above **€105** (strike + premium) just to break even. The most you can lose is the premium.

> [!EXAMPLE] Buying a put
> Same share at €100. A put with strike €100 costs **€4**.
> - At expiry the share is at €80: the put is worth €20, your result **+€16**.
> - At expiry the share is at €100 or higher: the put expires worthless, result **−€4**.
>
> Some investors buy puts as **insurance** against a fall in shares they own, paying the premium like an insurance fee.

## Leverage

The Wiener Börse lexicon explains the **leverage** (*Hebel*) of options: their prices change by a much larger percentage than the underlying, so far less capital is needed to take part in a price move. In the call example, a 20% rise in the share turned into a **300%** gain, but an unchanged price meant a **100%** loss.

## Time works against the buyer

An option has a limited life. Part of its price reflects the **time** left for the underlying to move. As expiry approaches, that time value shrinks, so a bought option can lose value even if the share price does not move, and expires worthless if the price has not moved far enough by expiry.

## Selling (writing) options

The writer collects the premium, which feels like steady income. But:

- A writer of a call without owning the shares (an **uncovered call**) faces, in theory, **unlimited losses** if the price soars.
- A writer of puts may have to buy shares far above their market price in a crash.
- Writers must deposit **margin** (lesson 3); the Wiener Börse lexicon notes that for options, margin is required for short positions.

> [!WARNING] Small, regular gains and rare, huge losses
> Selling options often produces many small wins followed by an occasional very large loss. Strategies that "always worked" can wipe out an account in one market shock.

> [!AUSTRIA] Getting access
> Options are derivatives, which are not among the "non-complex" instruments listed in MiFID II Article 25(4). A firm that only executes your orders must therefore generally assess whether they are **appropriate** for you, based on your knowledge and experience (Category F). Option-like securities issued by banks are called **warrants** (*Optionsscheine*, lesson 9).

## Key takeaways

> [!TAKEAWAYS]
> - An option is a right, not an obligation, to buy (call) or sell (put) at the strike price.
> - Buyers pay a premium and can lose 100% of it; many options expire worthless.
> - Options have strong leverage: small moves in the share cause large moves in the option.
> - Time value shrinks as expiry approaches.
> - Option writers receive the premium but can face very large, even unlimited, losses.
