---
title: "Profitability: ROE, ROA and return on invested capital"
category: I
order: 5
level: advanced
summary: How much profit does a company earn on the money invested in it? Learn return on equity, return on assets and return on invested capital, how debt can flatter ROE, and how returns link to growth.
readingTime: 8
tags: [ROE, ROA, ROIC, DuPont, profitability, retention ratio]
lastReviewed: 2026-10-11
sources:
  - title: "Data definitions: ROE, ROC/ROIC, invested capital, EVA, fundamental growth (Aswath Damodaran, NYU Stern)"
    url: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/variable.htm
  - title: "Beginners' Guide to Financial Statements (U.S. SEC)"
    url: https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements
  - title: "Berkshire Hathaway shareholder letter 2007 (PDF)"
    url: https://www.berkshirehathaway.com/letters/2007ltr.pdf
---

Margins (lesson 3) tell you how much profit a company makes per euro of **sales**. Return ratios answer a different question: how much profit does it make per euro of **capital** tied up in the business? A company that needs huge factories to earn a modest profit is very different from one that earns the same profit with little capital.

All examples use the made-up Alpenrad AG from the previous lessons: net income €30 m, EBIT €50 m, tax €10 m on profit before tax of €40 m, total assets €500 m, equity €200 m, interest-bearing debt €160 m, cash €40 m.

## Return on equity (ROE)

**ROE = net income ÷ shareholders' equity**

It shows the profit earned on the owners' book capital.

> [!EXAMPLE] Alpenrad's ROE
> 30 ÷ 200 = **15%**.

## Return on assets (ROA)

**ROA = net income ÷ total assets**

It shows how much profit the company earns on everything it owns, however it was financed.

> [!EXAMPLE] Alpenrad's ROA
> 30 ÷ 500 = **6%**.

## Return on invested capital (ROIC)

ROE and ROA mix up two things: how good the business is, and how it is financed. **ROIC** (also called return on capital, ROC) tries to separate them by looking at operating profit after tax compared with the capital provided by **both** shareholders and lenders. One common definition (used, for example, in Aswath Damodaran's data at NYU Stern):

**ROIC = EBIT × (1 − tax rate) ÷ (debt + equity − cash)**

> [!EXAMPLE] Alpenrad's ROIC
> Tax rate = tax ÷ profit before tax = 10 ÷ 40 = 25%.
> After-tax operating profit = 50 × (1 − 0.25) = €37.5 m.
> Invested capital = 160 + 200 − 40 = €320 m.
> ROIC = 37.5 ÷ 320 ≈ **11.7%**.

Why it matters: a business creates value for its owners only if it earns **more on its capital than that capital costs**. If investors and lenders together expect, say, 9% a year, an ROIC of 11.7% means value is being created; an ROIC of 5% means the company would destroy value by growing. Measures such as Economic Value Added (EVA) are built on exactly this comparison: (return on capital − cost of capital) × capital.

Warren Buffett makes a related point in his 2007 letter to Berkshire Hathaway shareholders: a truly great business needs a durable "moat" that **protects excellent returns on invested capital**, because competitors will try to win a share of any high returns. Lesson 9 looks at moats.

## How debt flatters ROE: the DuPont breakdown

ROE can be split into three parts. This is simple algebra, often called the **DuPont analysis**:

**ROE = net margin × asset turnover × financial leverage**
= (net income ÷ revenue) × (revenue ÷ assets) × (assets ÷ equity)

> [!EXAMPLE] Alpenrad's ROE, broken down
> Net margin 30 ÷ 500 = 6%
> Asset turnover 500 ÷ 500 = 1.0
> Leverage 500 ÷ 200 = 2.5
> ROE = 6% × 1.0 × 2.5 = **15%**. ✓

The third factor shows that a company can raise its ROE **simply by borrowing more**: if it replaced equity with debt, equity would shrink and leverage would rise. That makes ROE look better while the company becomes riskier.

> [!MISTAKE] "High ROE = great company"
> A high ROE can come from a strong business, but also from heavy debt, or from a tiny equity figure after years of share buybacks. Always look at ROE together with ROIC and the debt ratios in lesson 6.

## Returns and growth

Profit that is not paid out as dividends stays in the company and can be reinvested. A widely used rule of thumb links growth to returns:

**Sustainable growth in earnings ≈ retention ratio × ROE**

The retention ratio is the share of profit kept in the business (1 − payout ratio).

> [!EXAMPLE] Growth from reinvestment
> Alpenrad paid €12 m of its €30 m profit as dividends, a payout ratio of 40%, so it retained 60%.
> Estimated growth ≈ 0.60 × 15% = **9% a year**, but only if it can keep earning a 15% return on the new money it reinvests.

That condition is the catch: reinvesting at a high return is easy to assume and hard to achieve.

## Practical notes

- **Use averages.** Equity and assets change during the year. Many analysts divide by the average of the opening and closing figures. Be consistent.
- **Look at several years.** One good year proves little. A stable ROIC over a full economic cycle tells you much more.
- **Compare within the industry.** Banks, insurers and utilities have balance sheets that make these ratios look very different from those of industrial or software companies.
- **Watch one-off items.** A large gain from selling a division can inflate net income and ROE for a single year.

## Key takeaways

> [!TAKEAWAYS]
> - ROE = net income ÷ equity; ROA = net income ÷ assets.
> - ROIC compares after-tax operating profit with the capital from shareholders and lenders.
> - A business creates value when its ROIC is above its cost of capital.
> - DuPont: ROE = net margin × asset turnover × leverage, so debt can inflate ROE.
> - Growth from reinvestment ≈ retention ratio × ROE, if the returns can be sustained.
