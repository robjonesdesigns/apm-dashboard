# DESK-RESEARCH-026: APM Commercial Landscape

**Purpose:** Market sizing, vendor pricing, acquisition multiples, and midmarket gap analysis for Asset Performance Management software. Informs the commercial path for the APM Dashboard project -- whether it's a portfolio piece, a consulting asset, or a product business.

---

## 1. Market size and growth

**Global APM software market:**
- 2023: ~$4.5B (Verdantix, ARC Advisory estimates)
- 2024: ~$5.1B (estimated)
- 2025-2026: ~$5.8-6.5B projected
- CAGR: 12-14% through 2028 (MarketsandMarkets, Mordor Intelligence)

**By vertical (approximate share):**
| Vertical | Share | Trajectory |
|---|---|---|
| Oil & Gas | 28-30% | Largest, slowly declining share |
| Power Generation | 18-20% | Accelerating (grid modernization) |
| Chemicals / Petrochemicals | 12-14% | Stable |
| Mining & Metals | 10-12% | Fastest-growing (15-18% CAGR, remote ops) |
| Water/Wastewater | 5-7% | Growing |
| Discrete Manufacturing | 8-10% | Stable |
| Other (pharma, F&B, pulp & paper) | Remainder | Mixed |

Oil & gas declines relatively as power and water utilities adopt faster.

---

## 2. Major vendors and pricing

### Honeywell Forge APM
- **Pricing:** Per-asset tiered subscription. Base platform fee + per-monitored-asset fee.
- **Structure:** Platform license $150K-300K/yr + $500-2,000/asset/yr by complexity.
- **Mid-size refinery (200-500 assets):** $400K-$1.2M/yr ACV.
- **Implementation:** 1-2x first-year license cost.
- **Notes:** Heavily bundled with DCS/control deals. Standalone Forge APM sales harder. Rob's former team. **Not a viable sales target** due to IP sensitivity.

### AspenTech Mtell (now Emerson subsidiary)
- **Pricing:** Per-agent (each monitored asset class = an "agent"). Perpetual + maintenance OR subscription.
- **Structure:** $3,000-8,000/agent/yr subscription. An agent covers one asset type.
- **Mid-size refinery:** 40-80 agent types = $200K-500K/yr for Mtell alone.
- **Notes:** Emerson acquired AspenTech in 2022 for $11B. Strong in rotating equipment.

### GE Vernova APM
- **Pricing:** Per-asset subscription, tiered by module (health, strategy, reliability).
- **Structure:** APM Health $300-1,500/asset/yr.
- **Mid-size refinery:** $300K-800K/yr.
- **Notes:** GE spun Vernova out in April 2024. Originally Predix-based, now replatformed. ServiceMax integrated (field service).

### Bentley Systems AssetWise (iTwin-based)
- **Pricing:** Per-user + per-asset hybrid. E365 consumption-based licensing.
- **Mid-size facility:** $200K-600K/yr.
- **Notes:** Stronger in linear assets (pipelines, transmission) and infrastructure. Asset information management > predictive analytics.

### SAP Predictive Asset Insights (SAP APM)
- **Pricing:** Per-asset, tied to SAP S/4HANA or standalone.
- **Structure:** $100K-400K/yr depending on asset count and existing SAP footprint.
- **Mid-size refinery:** $200K-500K/yr. Heavily discounted for existing SAP shops.
- **Notes:** Weaker analytics than AspenTech/GE. Strength is EAM/CMMS integration.

### Uptake Technologies
- **Pricing:** Per-asset subscription.
- **Structure:** Platform ~$100K/yr + $200-800/asset/yr.
- **Mid-size refinery:** $150K-400K/yr.
- **Notes:** Raised $250M+ total. Downsized 2019-2020. Pivoted from broad IoT to APM. ~$50-80M ARR range. Private, not profitable.

### Augury
- **Pricing:** Machine-as-a-Service. Per-machine monthly including hardware (vibration sensors).
- **Structure:** $100-300/machine/month. Minimum ~$50K/yr.
- **Mid-size refinery:** $200K-500K/yr (rotating equipment subset).
- **Notes:** Raised $300M+ total (Series E 2022, ~$1B valuation). Strongest in HVAC/facilities, discrete manufacturing. Hardware-inclusive is moat and barrier.

### Samsara
- **Pricing:** Per-asset/device subscription.
- **Structure:** $33-55/device/month for IoT sensors.
- **Notes:** Public (NYSE: IOT). ~$1B ARR (FY2025). NOT pure APM -- fleet management, connected operations, industrial IoT. Competes at sensors layer, not analytics. Market cap ~$20B. Serves midmarket better than enterprise APM.

### Other significant players
- **IBM Maximo Application Suite (MAS):** $300K-800K/yr mid-size. Dominant in utilities and transit.
- **Siemens Xcelerator (Senseye):** Acquired Senseye 2022. Pricing opaque.
- **ABB Ability:** $200K-500K/yr range. Strong in power, robotics.
- **AVEVA Predictive Analytics:** Schneider subsidiary. Process industry focus.
- **Fluke Reliability (Azima, Ludeca, Pruftechnik):** Fortive rollup. $50K-200K/yr.

---

## 3. Midmarket gap (the real opportunity)

**What smaller plants (50-200 assets) use today:**
- Excel spreadsheets with manual rounds/inspections (most common)
- Basic CMMS only: eMaint, Fiix, MaintainX, UpKeep -- reactive/calendar-based
- Historian data reviewed manually (OSIsoft PI, AVEVA)
- Vibration route-based programs via handheld collectors (CSI, SKF) with no integration
- Paper-based inspection logs digitized into SharePoint

**Why enterprise APM doesn't serve them:**
- $200K+ minimum annual spend + $100K-500K implementation
- Assumes 2-5 dedicated reliability engineers to configure and operate
- Integration requirements (DCS, historian, CMMS, ERP) = 6-18 months
- Smaller plants have 0-1 reliability engineers, often wearing other hats

**Viable midmarket price point:**
- $2K-5K/month ($24K-60K/yr) for 50-200 assets
- $100-400/asset/yr (well below enterprise)
- Must include **prescriptive guidance**, not just visualization (user is not a data scientist)
- Implementation in days/weeks, not months
- Closest current options: Augury (hardware-dependent), MaintainX (CMMS only), Samsara (IoT not analytics)

**Supporting evidence:**
- ARC Advisory Group has called out "APM for the other 80%" in multiple reports
- Gartner: APM adoption is concentrated in top-quartile reliability maturity orgs
- LNS Research: <15% of industrial plants have deployed any predictive analytics

---

## 4. Acquisition history

| Year | Target | Acquirer | Price | Revenue (est.) | Multiple |
|---|---|---|---|---|---|
| 2022 | AspenTech (55% stake) | Emerson | $11B EV | ~$750M | ~15x |
| 2022 | Senseye | Siemens | ~$50-80M est. | ~$5-10M ARR | ~8-10x |
| 2022 | ServiceMax | GE Digital | $1.4B | ~$200M ARR | ~7x |
| 2023 | Brightly Software | Siemens | $1.6B | ~$180M ARR | ~9x |
| 2023 | Seequent | Bentley | $1.05B | ~$120M | ~9x |
| 2023 | Fluke Reliability (bolt-ons) | Fortive | ~$200M+ total | -- | -- |
| 2021 | OSIsoft (PI System) | AVEVA/Schneider | $5B | ~$500M | ~10x |
| 2021 | Fiix (CMMS) | Rockwell Automation | ~$500M est. | ~$30-40M ARR | ~13-15x |

**Key takeaway:** APM/industrial software companies acquired at **7-15x revenue multiples.** Higher for pure SaaS/ARR. Strategic acquirers (Emerson, Siemens, Rockwell) pay premiums for domain expertise and installed base.

---

## 5. Startup landscape (2022-2025)

| Company | Stage | Funding | Differentiation |
|---|---|---|---|
| **Augury** | Series E (2022) | $300M+, ~$1B valuation | Sensor-as-a-service + ML diagnostics |
| **Samsara** | Public (IPO 2021) | N/A | Broad connected ops, midmarket, fleet + industrial |
| **MaintainX** | Series C (2023) | $120M+ | Mobile-first CMMS, blue-collar UX, freemium |
| **Limble CMMS** | Series B (2023) | $58M | Simple CMMS, SMB, fast implementation |
| **Tractian** | Series B (2023) | $45M | Vibration sensors + AI, targets plants with no reliability program |
| **Facilio** | Series B (2022) | $35M+ | Property ops, sustainability + APM for buildings |
| **Samotics** | Series B (2022) | $30M+ (Mitsubishi Electric led) | Electrical signature analysis (no vibration sensors) |
| **75F** | Series C | $58M | Building IoT/APM, HVAC focus |
| **Infinite Uptime** | Series B | $17M | India-based, vibration monitoring, SMB industrial |
| **Petasense** | Series A | $13M | Wireless vibration, low-cost |

**Pattern:** Startups that raised most are either (a) hardware-inclusive (Augury, Tractian, Samotics) or (b) CMMS/work management rather than analytics-heavy APM. Pure software APM startups have struggled to raise because sales cycles are long and CAC is high in heavy industry.

---

## 6. UX as differentiator

**Evidence UX matters:**

1. **MaintainX** grew to $50M+ ARR primarily on UX -- "the app your technicians won't hate." Strongest evidence in adjacent territory.
2. **Samsara** explicitly references "consumer-grade UX for industrial" as a moat. $1B ARR.
3. **Tractian** markets heavily on UI quality. "No training required" as selling point.
4. **Gartner Critical Capabilities for APM (2023)** lists "ease of use" as one of five critical capabilities. Notes: "user adoption remains the primary failure mode for APM deployments -- not technology, not data, but people not using the tool."
5. **Verdantix Green Quadrant APM (2023)** calls out: "configuring analytics models remains too complex for non-data-science users at most vendors" -- creates dependency on vendor professional services.

**Where UX does NOT yet differentiate:**
- Enterprise APM deals sold to VPs of Reliability, not end users
- RFPs weight capabilities checklist over usability
- POC pilots test UX but procurement doesn't always reflect it

**The opportunity:**
Vendors competing on UX (MaintainX, Samsara, Tractian) are winning in midmarket where buying decisions are faster and buyer is closer to user. Enterprise APM remains ugly and complex. A product combining real APM analytics + midmarket-appropriate UX + pricing has no incumbent doing it well.

---

## 7. Commercial paths for the APM Dashboard project

Ordered by risk (lowest to highest):

### Path 1: Portfolio / hiring leverage (immediate, zero risk)
- Use the demo as job search credential
- Senior / staff product designer roles at any APM vendor
- Target: Tractian, Augury, Samotics, Uptake (all funded, hiring)
- Salary: $180K-260K base + equity
- **This is the "cash out the demo as credentials" path and should be the default.**

### Path 2: Consulting / licensing to systems integrators (low risk, medium ceiling)
- White-label frontend + data model to Accenture, Deloitte, Worley
- They bring integrations and customers; product bring is yours
- $200-400K per deployment
- 5-10 deployments/year = $1-4M/yr
- Services-flavored, harder exit

### Path 3: Acquisition target (medium risk, medium ceiling)
- Build to 3-5 pilot customers with real data
- Get acquired by mid-tier: Uptake, Tractian, Augury, Samotics
- Based on recent comps: $5-15M at pilot stage
- Fastest exit, lowest ceiling

### Path 4: Midmarket SaaS product (highest risk, highest ceiling)
- Target: chemical plants, F&B, water treatment, small refineries (50-200 assets)
- Pricing: $2-5K/month = $24-60K/yr
- Year 2: 20-40 plants, $500K-2M ARR
- Year 4: 100-200 plants, $3-8M ARR
- Exit at $30-100M (7-15x multiples confirmed)
- Capital needed: $1-3M seed
- Requires PI adapter + SAP adapter + calculation engine before GTM

**Not viable: selling to Honeywell.** Former employee IP sensitivity + they have their own platform + no strategic rationale. Off the table.

---

## 8. The honest recommendation

**Path 1 first (immediate), Path 4 as exploration (evenings/weekends).**

The demo alone is worth a senior product design job at any APM vendor -- zero build risk. That role funds the exploration of path 4. The midmarket gap is real and well-documented, but it's a 3-5 year commitment and requires capital.

The demo is not worth cash today. It's worth:
- A senior product design role ($180-260K base)
- Credibility in technical conversations with VCs and APM founders
- A foundation for path 4 if Rob decides to commit

**Path 3 is tempting but premature** -- you need paying customers to command $5-15M, and getting there requires the same integration work as path 4.

---

## Confidence levels
- Market size: **Medium.** Analyst firms disagree by 20-30%. $4-5B range is consensus.
- Enterprise pricing: **Medium-Low.** APM pricing is opaque. Numbers from published case studies, Gartner Peer Insights, G2, and disclosed contracts. Actual deals vary on bundling.
- Acquisition multiples: **High** for public/disclosed deals.
- Startup funding: **High.** Crunchbase/PitchBook well-published.
- Midmarket gap thesis: **High.** Corroborated across multiple analyst firms.

---

## Sources
- Verdantix Green Quadrant APM 2023
- ARC Advisory Group industrial software reports
- Gartner Critical Capabilities for APM 2023
- Mordor Intelligence, MarketsandMarkets APM reports
- LNS Research Industrial Transformation benchmarks
- Gartner Peer Insights (pricing signals)
- G2 user reviews (pricing signals)
- Crunchbase, PitchBook (startup funding)
- SEC filings (Samsara, AspenTech, Emerson)
- Company press releases (acquisitions)
