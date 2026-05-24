# ChoreWheel — Presentation Outline

**UOE Summer of Code 2026**  
**Format:** 12 slides | **Duration:** 5–7 minutes  
**Audience:** Hackathon judges and evaluators

---

## Slide 1 — Title

**ChoreWheel**  
*The Gamified Chore Rotation Sketchbook*

- UOE Summer of Code 2026
- Team: ChoreWheel Team
- Theme: Startup & Productivity Solutions
- GitHub: github.com/Annguyen0410/UOE-Summer-of-Code---ChoreWheel
- Live Demo: [your-deployed-url]

**Speaker notes:**  
Introduce the project name and one-line value proposition. Mention this is a fully functional web prototype built during the hackathon building phase.

---

## Slide 2 — The Problem

**Shared chores are broken.**

- Roommates argue about fairness — one person always does more
- Paper chore charts and group chats are ignored within days
- Generic to-do apps lack household-specific fairness and motivation
- No transparent record → resentment builds silently

**Stat to cite:**  
Studies on cohabitation consistently show chore distribution is a top-3 source of household conflict.

**Speaker notes:**  
Make the problem relatable. Ask the audience: "Who has lived with roommates?" Most hands go up. This is a universal pain point.

---

## Slide 3 — Our Solution

**ChoreWheel turns chores into a fair, fun, collaborative game.**

| Mechanism | Purpose |
|-----------|---------|
| Spin Wheel | Fair random assignment with optional weighting |
| Points & Streaks | Motivate consistent participation |
| Trading | Resolve scheduling conflicts peacefully |
| Privilege Store | Reward completed work with agreed perks |
| Activity Feed | Transparent audit trail for the household |

**Speaker notes:**  
Emphasize that this is not just a to-do list — it is a complete household economy with fairness built into the core mechanic.

---

## Slide 4 — Live Demo Walkthrough

**Show the working prototype (3 minutes)**

1. Open app → sample room "Suite 24 Notepad" loads
2. Select unassigned chore → spin the wheel
3. Complete a chore → points update on leaderboard
4. Propose a trade between members
5. Purchase a reward in the Privilege Store
6. Show activity feed and history log

**Speaker notes:**  
This slide is primarily a live demo. Have the app open in a browser tab. If live demo fails, use screenshots from `docs/screenshots/`.

---

## Slide 5 — Key Features

**Six pillars of ChoreWheel:**

1. **Fair Spin Wheel** — Canvas-rendered wheel with fair-weighting algorithm
2. **Chore Management** — Categories, difficulty, frequency, manual or spin assignment
3. **Gamification** — Points, streaks, leaderboard, confetti celebrations
4. **Peer Trading** — Structured swap proposals with accept/decline
5. **Reward Store** — Custom household vouchers purchased with points
6. **Real-Time Sync** — Optional Firebase sync across devices; works offline without it

**Speaker notes:**  
Walk through each feature briefly. Highlight that offline-first design means zero setup friction — no account required to start.

---

## Slide 6 — Architecture

```
Browser (React + TypeScript)
    │
    ├── RoomContext (state management)
    ├── Components (UI layer)
    ├── Canvas API (spin wheel)
    ├── Web Audio API (sounds)
    │
    ├── localStorage (offline persistence)
    └── Firebase Realtime DB (optional cloud sync)
```

**Design decisions:**
- Offline-first: no server dependency for core features
- Optional cloud: users bring their own Firebase config
- Component-driven: 15+ React components, centralized state
- PWA: installable, service worker caching

**Speaker notes:**  
Explain why offline-first matters for a household app — not everyone wants to create accounts or depend on a server.

---

## Slide 7 — Innovation & Differentiation

**What makes ChoreWheel unique:**

| Innovation | Detail |
|------------|--------|
| Fair-weighting algorithm | Wheel segments sized inversely to completion count |
| Sketchbook UX | Hand-drawn aesthetic — friendly, not corporate |
| Procedural audio | Web Audio API synthesizes sounds — zero asset dependencies |
| Chore trading | Structured conflict resolution, not just reassignment |
| Dual persistence | localStorage + optional Firebase — user chooses their level of sync |

**vs. competitors:** OurHome (dated UI), Habitica (too complex), spreadsheets (no gamification)

**Speaker notes:**  
Focus on the fair-weighting algorithm as the core technical innovation. It is simple but effective.

---

## Slide 8 — Target Users & Use Cases

| Segment | Scenario |
|---------|----------|
| **University students** | 4 roommates in a dorm — spin wheel assigns weekly bathroom cleaning |
| **Young professionals** | Co-living apartment — trade chores when travel conflicts arise |
| **Families** | Parents gamify chores for teenagers — points redeemable for screen time |
| **Co-living operators** | Standardized chore system across multiple units (future B2B) |

**Speaker notes:**  
Pick one scenario and tell a short story. "Alice and Bob are roommates. Bob always skips trash duty. With ChoreWheel's fair weighting, Bob's wheel segment is larger until he catches up."

---

## Slide 9 — Impact

**Social impact:**
- Reduces household conflict and passive-aggressive tension
- Creates transparency through activity logs and leaderboards
- Teaches accountability through gamification (especially for youth)
- Structured trading prevents chore-related arguments

**Measurable outcomes we target:**
- 40%+ 30-day retention
- 60%+ trade acceptance rate
- 50,000+ chores completed in first 6 months

**Speaker notes:**  
Connect technical features to human outcomes. The goal is not just a working app — it is healthier shared living.

---

## Slide 10 — Roadmap

| Version | Timeline | Key Features |
|---------|----------|--------------|
| **v1.0** (now) | May 2026 | Core app — wheel, points, trades, store, sync |
| **v1.1** | Q3 2026 | User accounts, invite links, notifications |
| **v1.2** | Q4 2026 | AI chore scheduling, smart suggestions |
| **v2.0** | 2027 | Admin dashboard for co-living operators |
| **v2.1** | 2027 | React Native mobile app with push notifications |

**Speaker notes:**  
Show judges you have thought beyond the hackathon. The current prototype is the foundation, not the ceiling.

---

## Slide 11 — Tech Stack & Team

**Technologies:**
- React 19 + TypeScript + Vite 8
- Firebase Realtime Database
- Canvas API + Web Audio API
- PWA (Service Worker + Manifest)
- Lucide React + canvas-confetti

**Team:**

| Member | Role |
|--------|------|
| [Name] | Project Lead / Full-Stack Developer |
| [Name] | [Role] |

**Speaker notes:**  
Briefly mention the stack choices and why (React for component model, Firebase for easy real-time sync, Vite for fast iteration during hackathon).

---

## Slide 12 — Thank You

**ChoreWheel**  
*Spin fairly. Trade smart. Earn rewards.*

- **Live Demo:** [your-deployed-url]
- **GitHub:** github.com/Annguyen0410/UOE-Summer-of-Code---ChoreWheel
- **Documentation:** See SUBMISSION.md in the repository

**Questions?**

**Speaker notes:**  
End with the demo URL on screen. Invite judges to try the app on their phones (PWA installable). Thank the UOE Summer of Code organizers.

---

## Appendix — Q&A Preparation

| Likely Question | Suggested Answer |
|-----------------|------------------|
| "How is this different from Habitica?" | Habitica is a full RPG with quests and classes — overwhelming for casual household use. ChoreWheel is focused exclusively on shared chore rotation with a simpler onboarding. |
| "What if someone cheats?" | The history log provides transparency. Household social pressure + visible leaderboard deter cheating. Future versions can add verification photos. |
| "Does it scale?" | Current design handles 2–8 members per room efficiently. Firebase sync supports concurrent access. Roadmap includes Firestore migration for larger scale. |
| "Why no user accounts?" | Intentional for hackathon MVP — zero friction to start. Accounts are planned for v1.1 with Firebase Auth. |
| "How do you make money?" | Freemium for large households + B2B for co-living operators. Free for the core experience. |
