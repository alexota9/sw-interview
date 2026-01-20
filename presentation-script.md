# H2 2025 Sales Analysis — 3-Minute Presentation Script

---

## Opening Hook (15 seconds)

> "Let me start with the headline: H2 2025 revenue is $1.49 million across 65,000 sales transactions, driven by Pears at 30% of sales and anchored firmly in our New Mexico market. There's one significant data quality issue I'll address — August and September show identical revenue to the penny — but let me first walk you through the key findings."

---

## Key Findings — Analysis First (75 seconds)

### Finding 1: Product Performance
> "Pears dominate our product mix at 30% of revenue — nearly $445,000. This is driven by price: at $14.40 per unit, pears are our premium product. The top four products — Pears, Blueberries, Apples, and Ugli Fruit — account for 72% of total sales."

### Finding 2: Geographic Concentration
> "New Mexico represents 61% of our revenue, which aligns with our market focus. Albuquerque alone is 23% of total sales, followed by Farmington and Rio Rancho. We also have secondary presence in Colorado, Texas, and California, though combined they're still smaller than Albuquerque.

> As a side note, I noticed 14 records coded as 'AE' — these represent APO and DPO addresses, military and diplomatic post offices. That could be an interesting segment to track if we have members serving overseas."

### Finding 3: Seasonal Pattern
> "There's a significant seasonal pattern: July is our peak month, October drops 74% from that peak, then we recover strongly through November and December. Every product follows this same curve, which suggests external factors — seasonality or market conditions — rather than product-specific issues. The October dip is worth investigating with the sales team."

---

## Data Quality Summary (45 seconds)

> "A quick note on how I cleaned the data: I excluded 7,574 zero-quantity records from the analysis. These contribute no revenue and would inflate transaction counts without adding insight. They're evenly distributed across products, which suggests they might be cancellations or placeholder records.

> The most critical issue: August and September have the exact same revenue — $151,475.41. When I compared the underlying records, all 10,480 transactions are identical. Same customers, same products, same quantities. One month is a complete copy of the other.

> If we exclude one duplicate month, H2 revenue drops from $1.49M to about $1.34M. We need to verify with the source system which month is correct.

> About 6.5% of records are also missing location data — they're included in revenue totals but can't be attributed to specific geographies.

> One additional note: the data file includes June, but only June 30th — a single day. Since our scope is H2 starting in July, I've focused the analysis there."

---

## Closing / Questions for the Business (30 seconds)

> "So to summarize: $1.49 million in H2 revenue — or $1.34M if we correct for the duplicate — led by Pears, anchored in New Mexico, with a seasonal pattern that dips in fall.

> Before we can fully trust trend analysis, I'd want to ask:
> 1. Which month is correct — August or September?
> 2. What happened in October that caused the 74% dip from July?
> 3. What do zero-quantity transactions represent — cancellations, returns, or something else?

> Those answers would let us move from 'what the data shows' to 'what it means for the business.'"

---

## Key Stats Reference Card

| Metric | Value |
|--------|-------|
| H2 Revenue | $1.49M |
| H2 Revenue (if dup removed) | ~$1.34M |
| Total Records Loaded | 72,747 |
| Sales Records (qty > 0) | 65,173 |
| Zero-Qty Excluded | 7,574 |
| Aug/Sep Duplicate | 10,480 records ($151K) |

| Top Products | Revenue | Share |
|--------------|---------|-------|
| Pears | $445K | 30% |
| Blueberries | $237K | 16% |
| Apples | $191K | 13% |
| Ugli Fruit | $188K | 13% |

| Geography | Revenue | Share |
|-----------|---------|-------|
| New Mexico | $905K | 61% |
| Colorado | $113K | 8% |
| Texas | $96K | 6% |
| California | $89K | 6% |

| Top NM Cities | Revenue | Share |
|---------------|---------|-------|
| Albuquerque | $346K | 23% |
| Farmington | $70K | 5% |
| Rio Rancho | $69K | 5% |

| Data Quality | Count | Notes |
|--------------|-------|-------|
| Zero Quantity | 7,574 | Excluded from analysis |
| Missing Location | 4,744 | Included in revenue, not geo |
| APO/DPO (AE) | 14 | Military/diplomatic addresses |

---

## Anticipated Questions & Answers

**Q: How did you identify the August-September duplicate?**
> I noticed revenue was identical to the penny — statistically impossible for real sales data. When I compared the underlying records row by row, every customer-product-quantity combination matched exactly between the two months.

**Q: Why did you exclude zero-quantity records?**
> They contribute $0 revenue and inflate transaction counts without adding insight. Since they're evenly distributed across all products, excluding them gives a cleaner view of actual sales activity. But I'd still want to understand what they represent — cancellations, returns, or placeholder records.

**Q: Why not just delete September?**
> Without access to the source system, I can't confirm which month is the original. It could be August that's the copy. The business needs to verify before we remove data.

**Q: Why is New Mexico so dominant?**
> Given this is for a New Mexico-based organization, the concentration makes sense — it reflects our core market. The secondary states (CO, TX, CA, AZ) likely represent members who've relocated or have ties to NM.

**Q: What are the APO/DPO records?**
> APO (Army Post Office) and DPO (Diplomatic Post Office) are special address codes for military and diplomatic personnel overseas. The 14 records coded as "AE" represent this segment — potentially members serving abroad.

**Q: What would you do differently with more time?**
> I'd build an automated data quality monitoring dashboard that flags anomalies like this in real-time. I'd also dig into the October dip — is it seasonal, or did something specific happen that month?

**Q: What's your confidence level in the $1.49M figure?**
> High confidence for the figure shown, with the caveat that it includes one duplicate month. If we exclude either August or September, actual H2 revenue is closer to $1.34M. The underlying transaction data is clean — the issue is at the month level.

---

## Presentation Flow (Visual Guide)

1. **Title** → $1.49M headline with context
2. **Executive Summary** → 4 key metrics
3. **Products** → Pears domination chart (top 4 highlighted in teal)
4. **Geography** → NM concentration + cities (teal highlights)
5. **Monthly Trends** → Seasonal pattern with October callout
6. **Seasonality** → All products follow same curve
7. **Data Quality** → Issues including zero-qty exclusion
8. **Anomaly Deep Dive** → Aug/Sep duplicate explanation
9. **Next Steps** → Questions for the business
10. **Summary** → Closing statement

---

## 30-Second Version (If Asked to Summarize)

> "Three takeaways: First, H2 revenue is $1.49 million — or $1.34M if we remove the duplicate month. Second, Pears drive 30% of revenue and New Mexico represents 61% of our market — which aligns with our focus. Third, there's a significant October dip worth investigating. The main action item is resolving which month — August or September — contains the correct data."
