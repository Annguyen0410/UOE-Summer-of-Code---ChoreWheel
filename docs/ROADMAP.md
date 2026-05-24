# ChoreWheel — Scalability & Roadmap

**UOE Summer of Code 2026 | Future Development Plan**

---

## 1. Current State (v1.0 — Hackathon MVP)

### What Is Built

| Capability | Status | Notes |
|------------|--------|-------|
| Spin wheel with fair weighting | ✅ Complete | Canvas-rendered, 60fps |
| Chore CRUD & assignment | ✅ Complete | 6 categories, 3 difficulty levels |
| Points, streaks, leaderboard | ✅ Complete | Streak multiplier algorithm |
| Chore trading | ✅ Complete | Request / accept / decline flow |
| Privilege Store | ✅ Complete | Pre-defined + custom vouchers |
| Multi-room management | ✅ Complete | Create, join, switch, delete |
| History log with undo | ✅ Complete | Full audit trail |
| Live notification feed | ✅ Complete | 7 notification types |
| Firebase real-time sync | ✅ Complete | Optional, user-configured |
| PWA (offline + installable) | ✅ Complete | Service worker + manifest |
| Onboarding tutorial | ✅ Complete | 5-step interactive guide |
| Mobile responsive design | ✅ Complete | 48px+ touch targets |
| Weekly reset (Archiver) | ✅ Complete | Batch chore status reset |

### Current Limitations

| Limitation | Impact | Mitigation in Roadmap |
|------------|--------|----------------------|
| No user authentication | Anyone with room code can access | v1.1 — Firebase Auth |
| localStorage 5MB cap | ~100+ rooms before limit | v1.2 — IndexedDB migration |
| No push notifications | Users must open app to see updates | v2.1 — Mobile app |
| Single Firebase project | Users must configure their own | v1.1 — Hosted Firebase backend |
| No admin/analytics dashboard | No aggregate insights | v2.0 — B2B dashboard |
| English only | Limits global adoption | v1.2 — i18n support |

---

## 2. Scalability Analysis

### 2.1 Frontend Scalability

| Dimension | Current Capacity | Bottleneck | Scale Strategy |
|-----------|-----------------|------------|----------------|
| Members per room | 2–8 (optimal) | Wheel segment readability | v2.0: tabbed view for 8+ members |
| Chores per room | ~50 (tested) | Render performance in list | Virtual scrolling in v1.1 |
| Rooms per browser | ~100 (localStorage) | 5MB storage limit | IndexedDB + cloud-primary in v1.2 |
| Concurrent users | Unlimited (client-side) | Firebase write contention | Firestore + transactions in v2.0 |
| Bundle size | ~200KB gzipped | Initial load time | Code splitting in v1.1 |

### 2.2 Backend Scalability (Firebase)

| Metric | Realtime DB Limit | Our Usage | Headroom |
|--------|-------------------|-----------|----------|
| Concurrent connections | 200,000 | 2–8 per room | Massive |
| Writes per second | 1,000 | ~1–5 per room action | Sufficient for MVP |
| Storage | 1 GB (free tier) | ~5KB per room | ~200,000 rooms |

**Migration path:** When Realtime DB limits are approached, migrate to Cloud Firestore for query-based access, subcollections, and security rules.

### 2.3 Deployment Scalability

| Platform | Free Tier | Scale Path |
|----------|-----------|------------|
| Vercel | 100GB bandwidth/mo | Auto-scales CDN |
| Firebase Hosting | 10GB storage, 360MB/day | Google CDN |
| GitHub Pages | 100GB bandwidth/mo | Static, global CDN |

Static deployment means zero server scaling concerns for the frontend.

---

## 3. Development Roadmap

### Phase 1 — v1.1: Foundation (Q3 2026)

**Goal:** Production-ready for public launch

| Feature | Priority | Effort |
|---------|----------|--------|
| Firebase Authentication (email + Google) | P0 | 2 weeks |
| Room invite links (shareable URLs) | P0 | 1 week |
| Hosted Firebase backend (no user config needed) | P0 | 1 week |
| Code splitting & lazy loading | P1 | 3 days |
| Virtual scrolling for chore list | P1 | 2 days |
| Error boundary & crash reporting (Sentry) | P1 | 2 days |
| SEO meta tags & Open Graph | P2 | 1 day |

**Success criteria:** 100 active households within 30 days of launch.

### Phase 2 — v1.2: Intelligence (Q4 2026)

**Goal:** Smart features that differentiate from competitors

| Feature | Priority | Effort |
|---------|----------|--------|
| AI-suggested chore schedules (based on history) | P0 | 3 weeks |
| Smart fair-weighting (ML-adjusted segments) | P1 | 2 weeks |
| IndexedDB migration (replace localStorage) | P1 | 1 week |
| Internationalization (i18n) — 5 languages | P1 | 2 weeks |
| Chore templates (student dorm, family, office) | P2 | 1 week |
| Email/push notifications for trades & assignments | P2 | 2 weeks |

**Success criteria:** 40% 30-day retention; 500 active households.

### Phase 3 — v2.0: Platform (H1 2027)

**Goal:** B2B platform for co-living operators

| Feature | Priority | Effort |
|---------|----------|--------|
| Admin dashboard (multi-unit management) | P0 | 4 weeks |
| Analytics: completion rates, fairness metrics | P0 | 3 weeks |
| Firestore migration | P0 | 2 weeks |
| Role-based access (admin, member, viewer) | P1 | 2 weeks |
| Public REST API for third-party integrations | P1 | 3 weeks |
| Chore template marketplace | P2 | 3 weeks |

**Success criteria:** 2 B2B pilot customers; 5,000 active households.

### Phase 4 — v2.1: Mobile (H2 2027)

**Goal:** Native mobile experience with push notifications

| Feature | Priority | Effort |
|---------|----------|--------|
| React Native app (iOS + Android) | P0 | 6 weeks |
| Push notifications (assignments, trades) | P0 | 2 weeks |
| Widget: today's chores at a glance | P1 | 2 weeks |
| Camera verification for chore completion | P2 | 2 weeks |
| Apple Watch / Wear OS quick-complete | P3 | 3 weeks |

**Success criteria:** 10,000 app installs; 4.5+ star rating.

### Phase 5 — v3.0: Ecosystem (2027+)

**Goal:** Platform ecosystem with integrations

| Feature | Description |
|---------|-------------|
| Smart home integration | Auto-detect chore completion via IoT sensors |
| Calendar sync | Import/export chore schedules to Google/Apple Calendar |
| Slack/Discord bot | Household chore notifications in chat |
| Public API v2 | GraphQL API with webhooks |
| White-label solution | Custom branding for property management companies |
| Chore marketplace | Community-created chore packs and reward templates |

---

## 4. Technical Debt & Refactoring Plan

| Item | Priority | Phase |
|------|----------|-------|
| Split RoomContext into domain modules | P1 | v1.1 |
| Add unit tests for points/streak/trade logic | P0 | v1.1 |
| Add E2E tests (Playwright) | P1 | v1.1 |
| Extract wheel physics into testable module | P2 | v1.2 |
| Type-safe Firebase security rules | P1 | v1.1 |
| Accessibility audit (WCAG 2.1 AA) | P1 | v1.1 |

---

## 5. Infrastructure Evolution

```
v1.0 (now)                v1.1                     v2.0
┌─────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│ Static SPA  │     │ Static SPA       │     │ Static SPA           │
│ localStorage│     │ + Firebase Auth  │     │ + Admin Dashboard    │
│ + optional  │ ──► │ + Hosted Firebase│ ──► │ + Firestore          │
│   Firebase  │     │ + Sentry         │     │ + Cloud Functions    │
└─────────────┘     └──────────────────┘     │ + REST API           │
                                              └──────────────────────┘
```

---

## 6. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Low user adoption | Medium | High | Focus on university communities; viral room codes |
| Firebase costs at scale | Low | Medium | Free tier sufficient for 10K+ rooms; monitor usage |
| Competitor copies features | Medium | Low | First-mover in sketchbook UX niche; community building |
| Data loss (localStorage) | Medium | High | v1.1 cloud-primary with local cache fallback |
| Scope creep | High | Medium | Strict phase gates; MVP-first culture |

---

## 7. Key Milestones

| Milestone | Target Date | Metric |
|-----------|-------------|--------|
| Hackathon submission | May 2026 | Working prototype deployed |
| Public beta launch | Aug 2026 | 100 households |
| v1.1 release | Sep 2026 | Auth + hosted backend |
| 1,000 households | Dec 2026 | 30-day retention > 40% |
| B2B pilot | Mar 2027 | 2 co-living partners |
| Mobile app launch | Sep 2027 | 10,000 installs |
| 10,000 households | Dec 2027 | Revenue-positive freemium |
