# H2 2025 Sales Data Analysis — Project Documentation

## Overview

This document describes the complete data analysis workflow for a job interview take-home assignment. The goal was to evaluate data quality, identify trends, and create dashboards for a fictitious company's H2 2025 sales data.

**Context:** This analysis is for a Business Intelligence Analyst position at a New Mexico-based credit union.

---

## Source Data

### Original File
- **Filename:** `Data_Set_Alex_Ota.txt`
- **Format:** Tab-delimited text file
- **Records:** ~72,749 raw records

### Cleaned File
- **Filename:** `cleaned_data.csv`
- **Format:** CSV
- **Records:** 72,747 (after cleaning)
- **Date Range:** June 30, 2025 – December 31, 2025

---

## Data Cleaning Performed (Pre-Analysis)

The following transformations were applied to create `cleaned_data.csv`:

### Column Renames
| Original Column | Cleaned Column |
|-----------------|----------------|
| ORT01 | city |
| Customer_ID | customer_id |
| Quantity Owned | quantity |
| Total Value | total_value |
| DateofRecord | date |
| Product | product |
| Price | price |

### Data Fixes Applied

1. **Product Typo Correction**
   - "Bluburrees" → "Blueberries" (2,198 records affected)

2. **Shifted Rows Removed**
   - 2 rows had product names appearing in the city column (unrecoverable, deleted)

3. **City Name Normalization**
   - Albuquerque variants standardized: Abq, Alb, Albq, Alburquerque, Albuqueruqe, etc. → "Albuquerque"
   - "Las Cruses" → "Las Cruces"
   - All city names converted to Title Case

4. **Zip Code Normalization**
   - Zip codes with dashes truncated to first 5 characters
   - Example: "87114-5922" → "87114"

5. **Date Fixes**
   - Invalid date "9/31/2025" → "9/30/2025" (10,480 records)
   - Excel serial number "46022" → "12/31/2025" (10,269 records)

6. **Data Type Conversions**
   - quantity: converted to integer
   - price: converted to float
   - total_value: converted to float

7. **Added Column**
   - `year_month`: Format YYYY-MM (e.g., "2025-07")

### Final Schema (10 columns)
```
customer_id, city, state, zip, product, quantity, price, total_value, date, year_month
```

---

## Data Quality Issues Identified

### Critical: August/September Duplicate Data
- **Finding:** August and September have identical revenue: $151,475.41 (to the penny)
- **Root Cause:** All 10,480 records in each month are exact duplicates — same customer_id, product, quantity, and total_value
- **Impact:** 29% of H2 data is duplicated; inflates reported revenue by $151K
- **Recommendation:** Verify with source system which month contains correct data; exclude one month from reporting

### Excluded from Analysis: Zero-Quantity Records
- **Count:** 7,574 records (10.4% of total)
- **Characteristics:** 
  - quantity = 0
  - total_value = 0
  - Evenly distributed across all 10 products
- **Decision:** Excluded from dashboards and analysis (no revenue contribution, inflates transaction counts)
- **Open Question:** What do these represent? Cancellations, returns, placeholders?

### Noted: Missing Location Data
- **Count:** 4,744 records (6.5%)
- **Fields Affected:** city, state, and/or zip are null
- **Impact:** Cannot attribute these records to geographic regions
- **Decision:** Included in revenue totals, excluded from geographic analysis

### Noted: June Data Anomaly
- **Finding:** All 10,478 June records are dated June 30, 2025
- **Implication:** Either missing 29 days of data, or this is a single-day snapshot
- **Decision:** Since H2 starts in July, June is outside core analysis scope; noted but not corrected

### Noted: International/Military Records
- **APO/DPO (AE):** 14 records with state = "AE" (Army/Diplomatic Post Office addresses for overseas military/diplomatic personnel)
- **Ontario (ON):** 14 records from Canada
- **Decision:** Included in analysis; AE records may represent a trackable member segment

---

## Analysis Scope

### Included in Analysis
- **Time Period:** July 2025 – December 2025 (H2)
- **Records:** 65,173 sales transactions (quantity > 0)
- **Revenue:** $1,487,274.75 (includes Aug/Sep duplicate)
- **Corrected Revenue:** ~$1,335,799 (if one duplicate month removed)

### Excluded from Analysis
- **Zero-quantity records:** 7,574 (no revenue impact)
- **June data:** Outside H2 scope

---

## Key Metrics Summary

### Overall Performance
| Metric | Value |
|--------|-------|
| H2 Revenue | $1,487,275 |
| H2 Revenue (dup removed) | ~$1,335,799 |
| Total Transactions | 65,173 |
| Unique Customers | 10,452 |
| Products | 10 |

### Revenue by Product
| Product | Revenue | Share |
|---------|---------|-------|
| Pears | $445,450 | 30% |
| Blueberries | $237,186 | 16% |
| Apples | $190,904 | 13% |
| Ugli Fruit | $187,534 | 13% |
| Kiwi | $150,933 | 10% |
| Bananas | $88,802 | 6% |
| Carrots | $73,858 | 5% |
| Apricot | $60,454 | 4% |
| Grapes | $47,146 | 3% |
| Plums | $5,008 | <1% |

### Revenue by State (Top 5)
| State | Revenue | Share |
|-------|---------|-------|
| New Mexico | $904,665 | 61% |
| Colorado | $113,431 | 8% |
| Texas | $96,396 | 6% |
| California | $89,137 | 6% |
| Arizona | $48,639 | 3% |

### Revenue by City (Top 5, NM)
| City | Revenue | Share |
|------|---------|-------|
| Albuquerque | $346,463 | 23% |
| Farmington | $70,447 | 5% |
| Rio Rancho | $68,950 | 5% |
| Los Lunas | $45,182 | 3% |
| Las Cruces | $35,250 | 2% |

### Revenue by Month
| Month | Revenue | Notes |
|-------|---------|-------|
| July | $327,760 | Peak month |
| August | $151,475 | DUPLICATE |
| September | $151,475 | DUPLICATE |
| October | $85,672 | -74% from July (investigate) |
| November | $236,410 | Recovery |
| December | $309,830 | Strong finish |

---

## Key Findings

### 1. Product Concentration
- Pears drive 30% of revenue despite moderate volume (highest unit price at $14.40)
- Top 4 products account for 72% of total revenue
- Plums are negligible (<1%)

### 2. Geographic Concentration
- New Mexico represents 61% of revenue (intentional — this is a NM-based organization)
- Albuquerque alone is 23% of total sales
- Secondary markets: CO, TX, CA, AZ

### 3. Seasonal Pattern
- July peak → October trough (74% decline) → Holiday recovery
- All products follow the same seasonal curve
- Suggests external factors (market conditions, seasonality) rather than product-specific issues
- October dip warrants investigation

### 4. Data Integrity Issue
- Aug/Sep duplication makes trend analysis unreliable until resolved
- Must verify with source system before reporting

---

## Deliverables Created

### 1. Presentation Dashboard (`sales-presentation-dashboard.jsx`)
- **Type:** React component with Recharts
- **Purpose:** Scrolling narrative dashboard for interview presentation
- **Design Principles:** Storytelling with Data (SWD) approach
- **Color Palette:**
  - Purple (#5e2d91): Primary brand, dark sections
  - Gold (#F9AB21): Accent highlights
  - Teal (#80ceca): Primary chart highlights
  - Gray scale: Non-emphasized elements
- **Sections:**
  1. Title slide with headline metrics
  2. Executive summary (4 key takeaways)
  3. Product performance (horizontal bar chart)
  4. Geographic distribution (state + city charts)
  5. Monthly trends (bar chart with anomaly callouts)
  6. Product seasonality (multi-line chart)
  7. Data quality notes
  8. Aug/Sep anomaly deep dive
  9. Questions for the business
  10. Summary slide

### 2. Interactive Dashboard (`interactive-sales-dashboard.jsx`)
- **Type:** React component with Recharts + PapaParse
- **Purpose:** Drill-down exploration tool
- **Features:**
  - CSV file upload (drag-drop or file picker)
  - Dynamic filtering: Month, State, City (cascading), Product
  - Auto-excludes zero-quantity records
  - Auto-detects Aug/Sep anomaly and displays warning
  - KPI cards: Revenue, Units, Customers, Avg Transaction, Record Count
  - Charts: Monthly trend (line), Product revenue (bar), State revenue (bar), City revenue (bar)
  - Data quality summary panel
- **No hardcoded data:** All metrics calculated from loaded CSV

### 3. Presentation Script (`presentation-script.md`)
- **Purpose:** 3-minute talking points for interview
- **Structure:**
  - Opening hook (15 sec)
  - Key findings — analysis first (75 sec)
  - Data quality summary (45 sec)
  - Closing with questions (30 sec)
- **Includes:**
  - Reference stats card
  - Anticipated Q&A
  - 30-second summary version

---

## Technical Implementation

### Technologies Used
- **React:** Component framework
- **Recharts:** Data visualization library
- **PapaParse:** CSV parsing
- **Tailwind CSS concepts:** Utility-based styling (inline)

### Color Scheme
```javascript
const colors = {
  brand: {
    purple: '#5e2d91',  // Primary brand color
    gold: '#F9AB21',    // Accent/secondary highlight
    teal: '#80ceca',    // Primary chart highlight
  },
  // Grays for unhighlighted elements
  // Red (#ef4444) for anomalies/warnings
}
```

### Chart Highlighting Pattern
- **Position 1 (top performer):** Teal (#80ceca)
- **Positions 2-4:** Gold (#F9AB21)
- **Positions 5+:** Gray

### Data Filtering Logic
```javascript
// Zero-quantity exclusion
const data = rawData.filter(d => d.quantity > 0);

// Anomaly detection
const augRevenue = data.filter(d => d.year_month === '2025-08')
  .reduce((sum, d) => sum + d.total_value, 0);
const sepRevenue = data.filter(d => d.year_month === '2025-09')
  .reduce((sum, d) => sum + d.total_value, 0);
const anomalyDetected = Math.abs(augRevenue - sepRevenue) < 1;
```

---

## Open Questions for Business

1. **August vs September:** Which month contains the correct data?
2. **Zero-quantity transactions:** What do they represent — cancellations, returns, placeholders?
3. **October dip:** What caused the 74% revenue decline from July?
4. **APO/DPO segment:** Are military members a segment worth tracking separately?
5. **June data:** Is the single-day snapshot intentional, or is data missing?

---

## Files Reference

| File | Description |
|------|-------------|
| `cleaned_data.csv` | Input data (72,747 records) |
| `sales-presentation-dashboard.jsx` | Narrative presentation dashboard |
| `interactive-sales-dashboard.jsx` | Interactive drill-down dashboard |
| `presentation-script.md` | 3-minute talking points |
| `project-documentation.md` | This file |

---

## Version History

- **v1:** Initial dashboards with analysis-last flow, olive accent color
- **v2:** Reordered to analysis-first, added brand colors (purple/gold)
- **v3:** Replaced olive with teal (#80ceca), excluded zero-quantity records from analysis, updated all metrics accordingly
