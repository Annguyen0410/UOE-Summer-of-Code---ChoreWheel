# ChoreWheel — Business & Impact Analysis

**UOE Summer of Code 2026 | Impact Assessment**

---

## 1. Executive Summary

ChoreWheel addresses a universal problem — unfair chore distribution in shared living spaces — with a gamified, technology-driven solution. By combining fair assignment algorithms, transparent tracking, peer-to-peer trading, and a reward economy, the app transforms a common source of household conflict into a collaborative, engaging experience.

The product targets a large and underserved market (shared households worldwide) with a freemium business model and a clear path to B2B revenue through co-living operators.

---

## 2. Problem Validation

### 2.1 The Chore Conflict Problem

Household chore distribution is a documented source of interpersonal conflict:

- **Scope:** Affects millions of shared households globally — students, young professionals, families
- **Frequency:** Chore-related disputes occur weekly in most shared living arrangements
- **Consequences:** Resentment, passive-aggressive behavior, damaged relationships, and in extreme cases, broken leases
- **Current solutions fail because:** They lack fairness enforcement, motivation systems, and real-time transparency

### 2.2 Why Existing Solutions Fall Short

| Solution | Limitation |
|----------|------------|
| Paper chore charts | Ignored within days; no accountability |
| Shared spreadsheets | No gamification; manual updates; no mobile UX |
| Group chat agreements | Verbal promises forgotten; no enforcement |
| OurHome / Cozi | Dated UI; no spin wheel or trading; US-centric |
| Habitica | Overwhelming RPG complexity; not household-focused |
| Splitwise (bill splitting) | Financial only; does not address physical chores |

**Gap in the market:** No tool combines fair random assignment, gamification, peer trading, and a reward economy in a household-specific, mobile-friendly package.

---

## 3. Target Market

### 3.1 Primary Segments

| Segment | Size (Global Est.) | Pain Level | Willingness to Pay |
|---------|-------------------|------------|-------------------|
| University roommates | 20M+ students in shared housing | Very High | Low (free tier) |
| Young professional co-living | 5M+ in co-living spaces | High | Medium |
| Families with children | 100M+ households with kids 8–18 | Medium | Medium |
| Co-living operators | 10,000+ companies globally | High | High (B2B) |

### 3.2 Market Trends Supporting ChoreWheel

1. **Co-living growth:** Global co-living market projected to exceed $10B by 2028 (CAGR ~8%)
2. **Gamification adoption:** Duolingo (500M+ users), Habitica (4M+ users) prove gamification drives engagement
3. **Remote/hybrid work:** More time at home = more household chore awareness and conflict
4. **Gen Z expectations:** Digital-native generation expects app-based solutions for everyday problems
5. **Mental health awareness:** Reducing household stress aligns with wellness trends

---

## 4. Value Proposition

### 4.1 For Roommates

> "Stop arguing about chores. Spin the wheel, earn points, trade when life gets busy."

- Fair assignment eliminates "it's not my turn" arguments
- Points and rewards motivate participation
- Trading provides flexibility without resentment
- Activity feed creates accountability without confrontation

### 4.2 For Families

> "Turn chores into a game your kids actually want to play."

- Gamification teaches responsibility and accountability
- Streak system encourages consistency
- Custom reward store lets parents define meaningful incentives
- History log shows who contributed what (no more "I always do everything")

### 4.3 For Co-Living Operators (Future B2B)

> "Standardize chore management across all your units with one dashboard."

- Admin dashboard for multi-unit oversight
- Fairness metrics reduce tenant complaints
- Template chore packs for different unit types
- Analytics on completion rates and engagement

---

## 5. Social Impact

### 5.1 Direct Impact

| Impact Area | Mechanism | Beneficiaries |
|-------------|-----------|---------------|
| **Fairness** | Fair-weighted spin wheel | All household members, especially those previously overburdened |
| **Transparency** | History log + activity feed | Prevents gaslighting about chore contributions |
| **Conflict reduction** | Structured trading system | Replaces arguments with negotiated swaps |
| **Youth development** | Points, streaks, rewards | Children and teenagers learn responsibility |
| **Gender equity** | Objective assignment | Reduces gendered chore imbalance documented in research |
| **Mental health** | Reduced household stress | All members benefit from fewer chore-related tensions |

### 5.2 Indirect Impact

- **Reduced tenant turnover** in co-living spaces (lower chore conflict = longer stays)
- **Improved academic performance** for students in harmonious households
- **Environmental awareness** through Outdoor and recycling chore categories
- **Digital literacy** for older family members using the app

### 5.3 UN Sustainable Development Goals Alignment

| SDG | Alignment |
|-----|-----------|
| SDG 3: Good Health and Well-being | Reduces household stress and interpersonal conflict |
| SDG 5: Gender Equality | Objective assignment reduces gendered chore imbalance |
| SDG 10: Reduced Inequalities | Fair-weighting ensures equitable distribution |
| SDG 11: Sustainable Cities | Supports harmonious co-living in urban communities |
| SDG 12: Responsible Consumption | Outdoor/recycling chore categories promote sustainability |

---

## 6. Competitive Analysis

### 6.1 Feature Comparison Matrix

| Feature | ChoreWheel | OurHome | Habitica | Tody | Spreadsheet |
|---------|-----------|---------|----------|------|-------------|
| Spin wheel assignment | ✅ | ❌ | ❌ | ❌ | ❌ |
| Fair weighting | ✅ | ❌ | ❌ | ❌ | ❌ |
| Points & streaks | ✅ | ✅ | ✅ | ❌ | ❌ |
| Chore trading | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reward store | ✅ | ✅ | ✅ | ❌ | ❌ |
| Real-time sync | ✅ | ✅ | ✅ | ❌ | ❌ |
| Offline mode | ✅ | ❌ | ❌ | ✅ | ✅ |
| Modern UI | ✅ | ❌ | ❌ | ✅ | ❌ |
| No account required | ✅ | ❌ | ❌ | ✅ | ✅ |
| PWA installable | ✅ | ❌ | ❌ | ❌ | ❌ |

### 6.2 Competitive Advantages

1. **Unique spin wheel mechanic** — No competitor offers fair-weighted random assignment
2. **Zero-friction onboarding** — No account required; instant demo room
3. **Distinctive design** — Sketchbook aesthetic stands out from generic productivity apps
4. **Offline-first** — Works without internet; cloud sync is optional
5. **Chore trading** — Unique conflict resolution mechanism

---

## 7. Business Model

### 7.1 Revenue Streams

| Stream | Model | Target | Timeline |
|--------|-------|--------|----------|
| **Freemium** | Free for ≤6 members; Premium $2.99/mo for larger households | Consumers | v1.1 |
| **B2B SaaS** | $5–15/unit/month for co-living operators | Businesses | v2.0 |
| **Template marketplace** | 30% commission on community chore packs | Creators | v3.0 |
| **White-label** | Custom branding license for property managers | Enterprise | v3.0 |

### 7.2 Cost Structure

| Cost | Monthly Est. (MVP) | Monthly Est. (Scale) |
|------|-------------------|---------------------|
| Firebase (hosting + DB) | $0 (free tier) | $50–200 |
| Vercel/Netlify hosting | $0 (free tier) | $20 |
| Domain | $1 | $1 |
| Sentry (error tracking) | $0 (free tier) | $26 |
| **Total** | **~$1/mo** | **~$250/mo** |

### 7.3 Unit Economics (Projected)

| Metric | Value |
|--------|-------|
| Customer Acquisition Cost (organic) | ~$0 (viral room codes) |
| Premium conversion rate | 5–8% |
| Average Revenue Per Paying User | $2.99/mo |
| Lifetime Value (12-month retention) | ~$25 |
| Break-even point | ~100 premium households |

---

## 8. Go-to-Market Strategy

### 8.1 Phase 1: Community-Led Growth (v1.0–v1.1)

| Channel | Tactic |
|---------|--------|
| **University communities** | Partner with student housing offices; distribute room codes |
| **Reddit / social media** | r/roommates, r/college, TikTok demo videos |
| **Product Hunt launch** | Day-one visibility spike |
| **Hackathon visibility** | UOE Summer of Code showcase |

### 8.2 Phase 2: Content & SEO (v1.2)

| Channel | Tactic |
|---------|--------|
| **Blog content** | "How to split chores fairly", "Roommate chore chart templates" |
| **SEO** | Target long-tail keywords around chore splitting |
| **YouTube** | Demo videos, roommate tips content |

### 8.3 Phase 3: B2B Sales (v2.0)

| Channel | Tactic |
|---------|--------|
| **Direct outreach** | Co-living companies (Common, Bungalow, etc.) |
| **Property management conferences** | Demo booth + pilot program |
| **Case studies** | Document fairness improvements in pilot units |

---

## 9. Success Metrics & KPIs

### 9.1 Product Metrics

| Metric | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|---------------|----------------|-----------------|
| Active households | 100 | 1,000 | 10,000 |
| Chores completed | 5,000 | 50,000 | 500,000 |
| Avg. session duration | 3 min | 5 min | 5 min |
| 30-day retention | 25% | 40% | 45% |
| Trade acceptance rate | 50% | 60% | 65% |
| NPS score | 30 | 45 | 50 |

### 9.2 Business Metrics

| Metric | 6-Month Target | 12-Month Target |
|--------|---------------|-----------------|
| Premium subscribers | 50 | 500 |
| Monthly recurring revenue | $150 | $1,500 |
| B2B pilot customers | 0 | 2 |
| App store rating | — | 4.5+ stars |

---

## 10. Risk Analysis

| Risk | Severity | Mitigation |
|------|----------|------------|
| Low adoption | High | Focus on viral room codes; university partnerships |
| Feature copying by competitors | Medium | Speed to market; community building; unique UX |
| Firebase vendor lock-in | Low | Abstract sync layer; Firestore migration path planned |
| Privacy concerns (household data) | Medium | Local-first architecture; optional cloud; GDPR-ready roadmap |
| Monetization resistance (free culture) | Medium | Generous free tier; premium is optional enhancement |
| Solo developer burnout | Medium | Open-source community contributions; phased roadmap |

---

## 11. Conclusion

ChoreWheel solves a genuine, universal problem with an innovative approach that no existing competitor fully addresses. The combination of fair assignment, gamification, trading, and rewards — delivered through a distinctive, zero-friction web app — positions the product for strong adoption in the student and co-living markets, with a clear path to B2B revenue.

The hackathon MVP demonstrates technical execution capability. The roadmap shows strategic thinking beyond the competition. The impact analysis confirms meaningful social value aligned with UN SDGs.

**ChoreWheel is not just a hackathon project — it is a viable product with real market potential.**

---

**ChoreWheel Team — UOE Summer of Code 2026**
