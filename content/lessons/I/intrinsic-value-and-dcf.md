---
title: "Intrinsic value and discounted cash flow (DCF)"
category: I
order: 8
level: advanced
summary: A business is worth the cash it can produce in the future, discounted back to today. Work through a simple DCF step by step, see how sensitive it is to assumptions, and learn the margin-of-safety idea.
readingTime: 10
tags: [intrinsic value, DCF, discount rate, present value, terminal value, margin of safety, reverse DCF]
lastReviewed: 2026-10-11
sources:
  - title: "An Owner's Manual (Berkshire Hathaway, PDF)"
    url: https://www.berkshirehathaway.com/ownman.pdf
  - title: "Berkshire Hathaway shareholder letter 1992"
    url: https://www.berkshirehathaway.com/letters/1992.html
  - title: "Data definitions: free cash flow to equity, fundamental growth (Aswath Damodaran, NYU Stern)"
    url: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/variable.htm
  - title: "Current data: discount rates, cash flows, growth and multiples (Aswath Damodaran, NYU Stern)"
    url: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html
  - title: "IAS 36 Impairment of Assets: value in use (IFRS Foundation)"
    url: https://www.ifrs.org/issued-standards/list-of-standards/ias-36-impairment-of-assets/
---

Ratios (lesson 7) compare a company with other companies. **Intrinsic valuation** asks a more fundamental question: *what is this business worth on its own, based on the cash it will produce?*

Berkshire Hathaway's *Owner's Manual* gives a simple definition: intrinsic value is **the discounted value of the cash that can be taken out of a business during its remaining life**. It adds right away that the calculation is not simple, and that intrinsic value is an **estimate rather than a precise figure**, one that must change when interest rates or cash-flow forecasts change.

The same idea appears in accounting: when IFRS (IAS 36) tests assets for impairment, one measure it uses is "value in use", the expected future cash flows **discounted to present value**.

## Step 1: money today is worth more than money later

€100 today can be invested and grow. So €100 received in one year is worth **less** than €100 today. How much less depends on the return you require, called the **discount rate**.

**Present value = future cash ÷ (1 + discount rate)^years**

> [!EXAMPLE] Discounting one payment
> €100 in one year, discount rate 8%: 100 ÷ 1.08 = **€92.59** today.
> €100 in two years: 100 ÷ 1.08² = **€85.73** today.

This is compound interest (Category G) in reverse.

## Step 2: a simple DCF, step by step

A **discounted cash flow (DCF)** model forecasts the cash a company will generate, then discounts each year back to today. Here is a simplified per-share example for a made-up company. Every input is an **assumption**:

- Free cash flow per share next year: **€1.20**
- Growth for the next five years: **5%** a year
- Growth after that, forever: **2%** a year
- Discount rate (the return an investor requires): **9%**

**Years 1–5:**

| Year | Cash flow (€) | Discount factor | Present value (€) |
|---:|---:|---:|---:|
| 1 | 1.20 | ÷ 1.09 | 1.10 |
| 2 | 1.26 | ÷ 1.09² | 1.06 |
| 3 | 1.32 | ÷ 1.09³ | 1.02 |
| 4 | 1.39 | ÷ 1.09⁴ | 0.98 |
| 5 | 1.46 | ÷ 1.09⁵ | 0.95 |
| | | **Sum** | **≈ 5.12** |

(The rows are rounded, so they do not add up exactly.)

**After year 5: the terminal value.** Nobody can forecast every year forever, so the model assumes steady growth after year 5 and uses the growing-perpetuity formula:

**Terminal value = cash flow in year 6 ÷ (discount rate − long-term growth)**

> [!EXAMPLE] Terminal value
> Cash flow in year 6 = 1.46 × 1.02 ≈ €1.49.
> Terminal value at the end of year 5 = 1.49 ÷ (0.09 − 0.02) ≈ **€21.25**.
> Discounted to today: 21.25 ÷ 1.09⁵ ≈ **€13.81**.

**Total:** 5.12 + 13.81 ≈ **€18.93 per share**.

Notice that about **73%** of the value comes from the terminal value: cash flows more than five years away, based on the roughest assumptions.

## Step 3: how sensitive is the answer?

Change only the discount rate and the long-term growth rate, and see what happens:

| Discount rate ↓ / long-term growth → | 1% | 2% | 3% |
|---|---:|---:|---:|
| **8%** | €19.58 | €22.13 | €25.71 |
| **9%** | €17.08 | €18.93 | €21.39 |
| **10%** | €15.14 | €16.53 | €18.31 |

Small changes of one percentage point move the "value" from about €15 to almost €26. A DCF is not a measurement. It is a structured way to make your assumptions visible.

> [!WARNING] Garbage in, garbage out
> A DCF can be made to produce almost any number. Be most sceptical of models that assume high growth for many years, a long-term growth rate above the long-run growth of the economy, or a discount rate that seems low for the risk.

## Reverse DCF: what is the market assuming?

Instead of estimating a value, you can ask what assumptions the **current price** implies. With the simplest model, a single growing perpetuity:

**Price = next year's cash flow ÷ (discount rate − growth)**, so **growth = discount rate − cash flow ÷ price**

> [!EXAMPLE] What a €24 price implies
> Next year's cash flow €1.20, required return 9%, price €24:
> Implied growth = 9% − 1.20 ÷ 24 = 9% − 5% = **4% a year, forever**.
>
> The question then becomes: is 4% growth forever realistic for this business? That is easier to debate than an abstract "fair value".

## The margin of safety

Because intrinsic value is only an estimate, careful investors build in a buffer. In his 1992 letter, Warren Buffett wrote that Berkshire insists on a **margin of safety** in the purchase price: if the calculated value of a stock is only slightly higher than its price, they are not interested. He calls this principle, which Benjamin Graham strongly emphasised, the cornerstone of investment success.

> [!EXAMPLE] A margin of safety in numbers
> Estimated value €18.93. Someone demanding a 25% margin of safety would only consider prices at or below 18.93 × 0.75 ≈ **€14.20**.

This is a way of thinking about estimation errors, not a recommendation to buy anything at any price.

## Where the discount rate comes from

Professionals usually derive it from interest rates plus a premium for the risk of shares (the **equity risk premium**) and the specific risk of the company. Aswath Damodaran at NYU Stern publishes regularly updated estimates of such inputs, including implied equity risk premiums. For learning, the key point is simpler: **the higher the risk, the higher the discount rate, and the lower the value today.** Rising interest rates also push discount rates up, which is one reason why share prices, especially of companies whose cash flows lie far in the future, often fall when rates rise.

## Key takeaways

> [!TAKEAWAYS]
> - Intrinsic value = the discounted value of the cash a business can produce over its life; it is always an estimate.
> - Present value = future cash ÷ (1 + discount rate)^years.
> - A simple DCF: forecast a few years, add a terminal value, discount everything to today.
> - The terminal value often dominates, and small changes in assumptions move the result a lot.
> - A reverse DCF shows what growth the current price implies; a margin of safety allows for errors.
