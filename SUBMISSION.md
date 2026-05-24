# UOE Summer of Code 2026 — Project Submission

**Event:** UOE Summer of Code 2026 — *Innovate. Build. Collaborate.*  
**Submission Date:** May 24, 2026  
**Hackathon Theme:** Startup & Productivity Solutions / Open Innovation

---

## Table of Contents

| # | Section | Status |
|---|---------|--------|
| 1 | [Project Name](#1-project-name) | Required |
| 2 | [Team Information](#2-team-information) | Required |
| 3 | [Detailed Project Description](#3-detailed-project-description) | Required |
| 4 | [GitHub Repository](#4-github-repository) | Required |
| 5 | [Demo Link or Working Prototype](#5-demo-link-or-working-prototype) | Required |
| 6 | [Presentation Slides or Documentation](#6-presentation-slides-or-documentation) | Required |
| 7 | [Technologies Used](#7-technologies-used) | Required |
| 8 | [Project Walkthrough Video](#8-project-walkthrough-video-recommended) | Recommended |
| 9 | [Screenshots / UI Previews](#9-screenshots--ui-previews-recommended) | Recommended |
| 10 | [Architecture Diagrams](#10-architecture-diagrams-recommended) | Recommended |
| 11 | [API Documentation](#11-api-documentation-recommended) | Recommended |
| 12 | [Scalability & Roadmap](#12-scalability--roadmap-recommended) | Recommended |
| 13 | [Business / Impact Analysis](#13-business--impact-analysis-recommended) | Recommended |

---

## 1. Project Name

### **ChoreWheel — The Gamified Chore Rotation Sketchbook**

**Tagline:** *Spin fairly. Trade smart. Earn rewards. Keep the household in harmony.*

**One-line summary:**  
ChoreWheel is a real-time, gamified web application that helps roommates and households assign, track, and trade chores through a fair spin wheel, a points economy, and a reward store — turning shared responsibility into a collaborative, engaging experience.

---

## 2. Team Information

| Field | Details |
|-------|---------|
| **Team Name** | ChoreWheel Team |
| **Project Lead** | [Your Full Name] |
| **GitHub Username** | [@Annguyen0410](https://github.com/Annguyen0410) |
| **Email** | [your.email@example.com] |
| **Country / Region** | [Your Country] |
| **Team Size** | [1–4 members] |

### Team Members

| Name | Role | Responsibilities | Contact |
|------|------|------------------|---------|
| [Member 1 Full Name] | Project Lead / Full-Stack Developer | Architecture, React frontend, Firebase integration, UI/UX design | [email] |
| [Member 2 Full Name] | [Role — e.g., Frontend Developer] | [Responsibilities] | [email] |
| [Member 3 Full Name] | [Role — e.g., Documentation / QA] | [Responsibilities] | [email] |

> **Note to submitter:** Replace all bracketed placeholders above with your actual team details before final submission.

### Collaboration & Execution

- Development followed an agile, feature-driven workflow: core chore logic first, then gamification, then real-time sync and polish.
- Version control via Git/GitHub with structured commits and a public repository for transparency.
- All team members contributed to design decisions, testing, and documentation preparation for this submission.

---

## 3. Detailed Project Description

### 3.1 Problem Statement

Shared households — student dorms, co-living spaces, family homes, and roommate apartments — face a persistent, relatable problem: **chore allocation is unfair, unclear, and emotionally charged**.

Common pain points include:

- One person consistently doing more work while others free-ride
- Arguments over “whose turn” it is to clean, cook, or take out trash
- No transparent record of who completed what
- Chore charts on paper or group chats that are ignored within days
- Lack of motivation to complete repetitive household tasks

Existing solutions (shared spreadsheets, generic to-do apps, static chore charts) lack **fairness mechanisms**, **real-time collaboration**, and **motivation systems** tailored to shared living.

### 3.2 Our Solution

**ChoreWheel** transforms household chore management into a fair, transparent, and gamified experience. Instead of passive lists, the app uses an interactive **spin wheel** to assign chores randomly with optional **fair-weighting** (members who have completed fewer chores receive proportionally larger wheel segments). Members earn **points** for completed tasks, build **streaks** for consistent effort, **trade** chores with each other, and redeem points in a **Privilege Store** for custom household rewards.

The app works **offline-first** via browser localStorage and optionally syncs across devices in real time through **Firebase Realtime Database** when configured.

### 3.3 Target Users

| User Group | Use Case |
|------------|----------|
| **University roommates** | Fair chore rotation in dorms and shared flats |
| **Young professionals** | Co-living and apartment sharing |
| **Families** | Teaching children responsibility through gamification |
| **Property managers / co-living operators** | Standardized chore systems across units |

### 3.4 Core Features

#### Fair Chore Assignment — Spin Wheel
- Canvas-rendered spin wheel with physics-based animation
- Assigns a selected chore to a randomly chosen household member
- **Fair Weighting Mode:** adjusts segment sizes inversely to each member's completed chore count, reducing free-rider advantage
- Web Audio API synthesized tick and completion sounds; confetti celebration on assignment
- Sound toggle for quiet environments

#### Chore Management
- Create, categorize, and delete chores (Kitchen, Bathroom, Common, Outdoor, Pets, Other)
- Difficulty levels (Easy / Medium / Hard) with configurable point values
- Frequency tags (Daily / Weekly / Bi-weekly)
- Manual assignment or spin-based assignment
- Weekly reset (Archiver) to roll over recurring chores

#### Points, Streaks & Leaderboard
- Points awarded on chore completion, scaled by difficulty
- **Tidy Streak** multiplier: consecutive completions boost rewards
- Live leaderboard ranking members by points and completion count
- History log (notepad-style ledger) of all completed chores with undo (Eraser) support

#### Chore Trading
- Members can propose trades: swap one of their assigned chores for another member's chore
- Accept / decline workflow with real-time notification updates
- Reduces resentment by enabling voluntary rebalancing

#### Privilege Store (Reward Economy)
- Pre-defined and custom reward vouchers (e.g., "Skip one chore", "Pick movie night")
- Members spend earned points to purchase vouchers
- Household admins can create custom reward coupons
- Redemption tracking with timestamps

#### Multi-Room Collaboration
- Create household "rooms" with unique shareable room codes
- Join existing rooms via code; switch between multiple rooms
- Real-time activity feed showing spins, trades, completions, and store purchases

#### Onboarding & Accessibility
- 5-step interactive onboarding tutorial for first-time users
- Quick Start Guide banner with core action tips
- Built-in User Manual modal
- Responsive layout for mobile, tablet, and desktop (48px+ touch targets)
- PWA support: installable on home screen, offline-capable service worker

#### Optional Cloud Sync
- Firebase Realtime Database integration (user-configurable via Dev Settings)
- Cross-device, cross-tab synchronization when Firebase credentials are provided
- Graceful fallback to local-only mode when cloud is not configured

### 3.5 Innovation & Differentiation

| Aspect | Typical Chore Apps | ChoreWheel |
|--------|-------------------|------------|
| Assignment method | Static lists / manual only | Interactive spin wheel with fair weighting |
| Fairness | Assumed, not enforced | Algorithmic fair-weighting based on completion history |
| Motivation | Checkbox completion | Points, streaks, leaderboard, reward store |
| Conflict resolution | None | Peer-to-peer chore trading |
| Aesthetic | Generic corporate UI | Distinctive sketchbook / notepad design language |
| Collaboration | Single-user or basic sharing | Multi-room codes + optional real-time Firebase sync |
| Offline support | Often requires account/login | Works fully offline; cloud is optional |

### 3.6 How It Works (User Flow)

1. **Create or join a room** — Generate a household room or enter a friend's room code.
2. **Add members** — Register each roommate with a name and color profile.
3. **Add chores** — Define tasks with points, difficulty, category, and frequency.
4. **Assign chores** — Spin the wheel for fair random assignment, or assign manually.
5. **Complete & earn** — Mark chores done, earn points, build streaks, climb the leaderboard.
6. **Trade if needed** — Propose swaps when life gets busy.
7. **Redeem rewards** — Spend points in the Privilege Store for agreed household perks.
8. **Reset weekly** — Use the Archiver to start a fresh chore cycle.

### 3.7 Technical Highlights

- **React 19 + TypeScript** for type-safe, component-driven UI
- **Vite 8** for fast development and optimized production builds
- **Centralized RoomContext** state management with 900+ lines of domain logic
- **Canvas API** for custom wheel rendering and animation loop
- **Web Audio API** for procedural sound synthesis (no external audio assets)
- **Firebase Realtime Database** for optional multi-device sync
- **Progressive Web App** with manifest and service worker registration

---

## 4. GitHub Repository

| Field | Value |
|-------|-------|
| **Repository URL** | https://github.com/Annguyen0410/UOE-Summer-of-Code---ChoreWheel |
| **Visibility** | Public |
| **Primary Branch** | `main` |
| **License** | [Specify license — e.g., MIT] |

### Repository Structure

```
UOE-Summer-of-Code---ChoreWheel/
├── public/                  # Static assets, PWA manifest, service worker
├── src/
│   ├── components/          # UI components (ChoreWheel, Leaderboard, etc.)
│   ├── context/             # RoomContext — core application state
│   ├── services/            # Firebase integration layer
│   ├── App.tsx              # Main application shell
│   └── main.tsx             # Entry point
├── SUBMISSION.md            # This file — full competition submission
├── README.md                # Repository overview and setup guide
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### How to Run Locally

```bash
git clone https://github.com/Annguyen0410/UOE-Summer-of-Code---ChoreWheel.git
cd UOE-Summer-of-Code---ChoreWheel
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build    # Output in dist/
npm run preview  # Preview production build locally
```

---

## 5. Demo Link or Working Prototype

| Field | Value |
|-------|-------|
| **Live Demo URL** | [https://your-deployed-url.example.com] |
| **Default Demo Room Code** | `HOMEY9` (pre-loaded sample data) |
| **Status** | Fully functional prototype |

> **Note to submitter:** Deploy the `dist/` folder to Vercel, Netlify, Firebase Hosting, or GitHub Pages and paste the live URL above before submitting.

### Prototype Capabilities (Fully Working)

The deployed prototype supports the complete end-to-end workflow without requiring user registration:

- [x] Create / join / switch / delete rooms
- [x] Add / remove household members
- [x] Create / delete / assign / complete chores
- [x] Spin wheel with fair weighting and sound effects
- [x] Points, streaks, and leaderboard
- [x] Chore trading (request, accept, decline)
- [x] Privilege Store (purchase, redeem, custom vouchers)
- [x] History log with undo
- [x] Live notification feed
- [x] Weekly reset
- [x] Onboarding tutorial and user manual
- [x] Optional Firebase real-time sync (configure in Dev Settings)
- [x] PWA installable on mobile and desktop

### Quick Demo Script (for judges)

1. Open the live demo URL.
2. The app loads the sample room **"Suite 24 Notepad"** (code: `HOMEY9`) with 3 members and 5 chores.
3. Select an unassigned chore (e.g., "Weed Front Garden Path").
4. Click **Spin** on the Chore Wheel — watch fair-weighted assignment with animation and confetti.
5. Mark a chore as **Complete** — observe points update on the leaderboard.
6. Open **Trade** — propose swapping chores between members.
7. Visit the **Privilege Store** — purchase a reward voucher with earned points.
8. Check the **Live Room Activity** feed and **History Log** for audit trail.

---

## 6. Presentation Slides or Documentation

Full project documentation is provided in this repository:

| Document | Purpose |
|----------|---------|
| **SUBMISSION.md** (this file) | Complete competition submission — all required and recommended sections |
| **README.md** | Repository overview, setup instructions, and quick links |
| **docs/PRESENTATION.md** | Slide-by-slide presentation outline for judges (12 slides) |

### Presentation Outline Summary

| Slide | Title | Content |
|-------|-------|---------|
| 1 | Title | ChoreWheel — Gamified Chore Rotation |
| 2 | Problem | Unfair chore distribution in shared households |
| 3 | Solution | Spin wheel + points + trades + rewards |
| 4 | Demo | Live walkthrough screenshots |
| 5 | Key Features | Wheel, leaderboard, store, trading, sync |
| 6 | Architecture | React + Firebase + PWA stack |
| 7 | Innovation | Fair weighting, sketchbook UX, offline-first |
| 8 | Target Users | Roommates, families, co-living |
| 9 | Impact | Fairness, transparency, reduced conflict |
| 10 | Roadmap | Mobile app, AI suggestions, analytics |
| 11 | Tech Stack | React, TypeScript, Vite, Firebase |
| 12 | Thank You | Team, GitHub link, live demo |

See [docs/PRESENTATION.md](docs/PRESENTATION.md) for the full slide content.

---

## 7. Technologies Used

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | Component-based UI framework |
| **TypeScript** | 6.0 | Static typing and developer safety |
| **Vite** | 8.0 | Build tool and dev server |
| **Lucide React** | 1.16 | Icon library |
| **Canvas Confetti** | 1.9 | Celebration effects on chore assignment |

### Backend / Data

| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase Realtime Database** | 12.13 | Optional real-time multi-device sync |
| **localStorage** | Browser API | Offline-first persistent storage |

### Browser APIs

| API | Purpose |
|-----|---------|
| **Canvas API** | Spin wheel rendering and animation |
| **Web Audio API** | Procedural tick and completion sounds |
| **Service Worker** | PWA offline caching |
| **Web Manifest** | Installable app metadata |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code quality and linting |
| **TypeScript ESLint** | Type-aware lint rules |
| **Git / GitHub** | Version control and collaboration |

### Design

| Element | Choice |
|---------|--------|
| **Typography** | Architects Daughter, Caveat, Inter (Google Fonts) |
| **Visual Style** | Sketchbook / hand-drawn notepad aesthetic |
| **Layout** | Responsive CSS Grid — 3-column desktop, stacked mobile |
| **Color System** | Ink-profile colors per member; warm paper background |

---

## 8. Project Walkthrough Video (Recommended)

| Field | Value |
|-------|-------|
| **Video URL** | [https://youtube.com/watch?v=YOUR_VIDEO_ID] |
| **Duration** | 3–5 minutes (recommended) |
| **Language** | English |

> **Note to submitter:** Record and upload a walkthrough, then paste the URL above.

### Suggested Video Script

| Time | Scene | Narration |
|------|-------|-----------|
| 0:00–0:30 | Intro | "Shared chores cause conflict. ChoreWheel solves this with fair, gamified rotation." |
| 0:30–1:00 | Problem | Show messy group chat / ignored chore chart vs. ChoreWheel dashboard |
| 1:00–2:00 | Spin Wheel | Select chore → spin → fair assignment → confetti |
| 2:00–2:30 | Points & Leaderboard | Complete chore → points update → streak bonus |
| 2:30–3:00 | Trading & Store | Propose trade → purchase voucher |
| 3:00–3:30 | Multi-room & Sync | Create room, share code, show Firebase sync |
| 3:30–4:00 | Closing | Recap impact, show GitHub and live demo links |

---

## 9. Screenshots / UI Previews (Recommended)

> **Note to submitter:** Capture screenshots from the running app and save them to `docs/screenshots/`. Update the paths below.

### Recommended Screenshots

| # | Screen | Description | File |
|---|--------|-------------|------|
| 1 | Dashboard Overview | Full household view with wheel, chore list, and sidebar | `docs/screenshots/01-dashboard.png` |
| 2 | Spin Wheel | Wheel mid-spin with member segments | `docs/screenshots/02-spin-wheel.png` |
| 3 | Leaderboard | Points ranking with streak indicators | `docs/screenshots/03-leaderboard.png` |
| 4 | Privilege Store | Reward vouchers and purchase flow | `docs/screenshots/04-privilege-store.png` |
| 5 | Trade Modal | Chore swap proposal interface | `docs/screenshots/05-trade-modal.png` |
| 6 | Mobile View | Responsive layout on phone screen | `docs/screenshots/06-mobile.png` |
| 7 | Onboarding | First-time user tutorial modal | `docs/screenshots/07-onboarding.png` |
| 8 | Activity Feed | Live room notifications | `docs/screenshots/08-activity-feed.png` |

### UI Design Principles

- **Sketchbook aesthetic:** Hand-drawn fonts and notepad-style cards create a friendly, non-corporate feel appropriate for home use
- **Clear hierarchy:** Section headers, color-coded categories, and consistent spacing guide the eye
- **Mobile-first responsiveness:** All interactive elements meet 48px minimum touch target guidelines

---

## 10. Architecture Diagrams (Recommended)

### 10.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  React UI   │  │ RoomContext  │  │  Browser APIs       │  │
│  │  Components │◄─┤ State Manager│──►│  Canvas, Web Audio  │  │
│  └─────────────┘  └──────┬───────┘  └─────────────────────┘  │
│                          │                                    │
│              ┌───────────┼───────────┐                       │
│              ▼           ▼           ▼                       │
│        localStorage   Firebase    Service Worker              │
│        (offline)     (optional)   (PWA cache)                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ (when configured)
              ┌───────────────────────┐
              │ Firebase Realtime DB  │
              │   rooms/{roomCode}    │
              └───────────────────────┘
```

### 10.2 Component Architecture

```
App.tsx
├── RoomProvider (RoomContext)
│   ├── ChoreWheel          — Canvas spin wheel + fair weighting
│   ├── ChoreList           — CRUD + assignment + completion
│   ├── TradeModal          — Peer chore swap proposals
│   ├── PrivilegeStore      — Points → voucher economy
│   ├── Leaderboard         — Rankings + streak display
│   ├── HistoryLogPanel     — Completion ledger + undo
│   ├── NotificationFeed    — Real-time activity stream
│   ├── OnboardingModal     — First-time 5-step tutorial
│   ├── QuickStartGuide     — Dismissible tips banner
│   ├── UserManualModal     — In-app documentation
│   ├── DevSettingsModal    — Firebase configuration
│   └── RoomSwitcher        — Create / join / switch rooms
└── firebase.ts             — Sync read/write/listen layer
```

### 10.3 Data Flow — Chore Completion

```
User clicks "Complete"
        │
        ▼
RoomContext.completeChore()
        │
        ├── Update chore status → "Completed"
        ├── Award points (+ streak bonus)
        ├── Increment member completedCount & streakCount
        ├── Append HistoryLog entry
        ├── Push RoomNotification
        │
        ├── Save to localStorage
        └── Sync to Firebase (if enabled)
                │
                ▼
        Other devices receive update via onValue listener
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for extended diagrams.

---

## 11. API Documentation (Recommended)

ChoreWheel uses two data persistence layers. See [docs/API.md](docs/API.md) for full reference.

### 11.1 Firebase Realtime Database Schema

**Path:** `rooms/{roomCode}`

```json
{
  "roomCode": "HOMEY9",
  "roomName": "Suite 24 Notepad",
  "members": [
    {
      "id": "m1",
      "name": "Alice",
      "avatar": "A",
      "color": "#1E3A8A",
      "points": 140,
      "completedCount": 4,
      "streakCount": 2
    }
  ],
  "chores": [
    {
      "id": "c1",
      "name": "Wipe Kitchen Counters",
      "description": "Clean cooking crumbs and wipe coffee marks.",
      "points": 20,
      "difficulty": "Easy",
      "category": "Kitchen",
      "frequency": "Daily",
      "assignedTo": "m2",
      "status": "Pending"
    }
  ],
  "trades": [],
  "vouchers": [],
  "notifications": [],
  "historyLogs": [],
  "customVouchers": [],
  "lastUpdated": 1716566400000
}
```

### 11.2 Firebase Service API

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `initFirebase()` | — | `Database \| null` | Initialize Firebase from saved config |
| `isFirebaseEnabled()` | — | `boolean` | Check if cloud sync is active |
| `getSavedFirebaseConfig()` | — | `FirebaseConfig \| null` | Read config from localStorage |
| `saveFirebaseConfig(config)` | `FirebaseConfig \| null` | `void` | Persist or clear Firebase config |
| `firebaseService.writeRoomState(roomCode, state)` | `string, object` | `Promise<boolean>` | Push room state to cloud |
| `firebaseService.listenRoomState(roomCode, callback)` | `string, function` | `() => void` | Subscribe to real-time updates; returns unsubscribe |

### 11.3 RoomContext Public API (Core Actions)

| Action | Description |
|--------|-------------|
| `createRoom(name)` | Create a new household room with unique code |
| `joinRoom(code)` | Join an existing room by code |
| `addMember(name, color)` | Register a household member |
| `addChore(...)` | Create a chore with metadata |
| `spinAssignChore(choreId, memberId)` | Wheel-assigned chore binding |
| `completeChore(choreId)` | Mark done, award points, log history |
| `undoChoreCompletion(logId)` | Reverse a completion (Eraser) |
| `requestTrade(...)` / `respondToTrade(...)` | Chore swap workflow |
| `purchaseVoucher(name, cost)` | Spend points on a reward |
| `resetWeek()` | Archive and reset recurring chores |

---

## 12. Scalability & Roadmap (Recommended)

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full roadmap.

### 12.1 Current Scalability

| Dimension | Current State | Notes |
|-----------|--------------|-------|
| **Users per room** | Optimized for 2–8 members | Wheel segments scale linearly |
| **Rooms per browser** | Unlimited (localStorage) | Each room stored independently |
| **Real-time sync** | Firebase Realtime DB | Handles concurrent writes with last-write-wins |
| **Offline** | Full functionality | No server dependency for core features |
| **Performance** | Canvas animation at 60fps | Lightweight bundle (~200KB gzipped est.) |

### 12.2 Future Roadmap

| Phase | Timeline | Features |
|-------|----------|----------|
| **v1.1 — Polish** | Q3 2026 | User accounts, room invitations via link, email notifications |
| **v1.2 — Intelligence** | Q4 2026 | AI-suggested chore schedules based on history; smart fair-weighting |
| **v2.0 — Platform** | 2027 | Landlord/co-living admin dashboard; multi-unit management |
| **v2.1 — Mobile** | 2027 | React Native companion app with push notifications |
| **v3.0 — Ecosystem** | 2027+ | Public API, chore template marketplace, integration with smart home devices |

### 12.3 Scaling Strategy

- **Frontend:** Code-splitting and lazy-loaded routes as feature set grows
- **Backend:** Migrate from Realtime Database to Firestore for query flexibility at scale
- **Auth:** Firebase Authentication for secure multi-user identity
- **Hosting:** CDN-backed static deployment (Vercel / Firebase Hosting) for global latency

---

## 13. Business / Impact Analysis (Recommended)

See [docs/IMPACT.md](docs/IMPACT.md) for the full analysis.

### 13.1 Social Impact

| Impact Area | Description |
|-------------|-------------|
| **Fairness** | Fair-weighted spin wheel reduces free-rider problem and perceived injustice |
| **Transparency** | History log and activity feed create an auditable record of contributions |
| **Conflict reduction** | Trading system provides a structured alternative to arguments |
| **Youth development** | Gamification teaches responsibility and accountability to children and young adults |
| **Mental health** | Reduces household stress and passive-aggressive tension around chores |

### 13.2 Market Opportunity

- **Co-living market:** Global co-living market projected to exceed $10B by 2028
- **Student housing:** Millions of university students in shared accommodation worldwide
- **Gig-economy generation:** Young adults accustomed to gamified apps (Duolingo, Habitica) expect similar engagement from productivity tools

### 13.3 Competitive Landscape

| Competitor | Weakness | ChoreWheel Advantage |
|------------|----------|---------------------|
| OurHome | Basic, dated UI | Modern sketchbook UX + spin wheel |
| Tody | Single-user focused | Multi-member rooms with trading |
| Habitica | RPG complexity overwhelms casual users | Focused chore domain, simpler onboarding |
| Shared spreadsheets | No gamification or fairness | Full game economy built in |

### 13.4 Sustainability Model (Future)

| Model | Description |
|-------|-------------|
| **Freemium** | Free for households up to 6 members; premium for larger groups |
| **B2B** | Co-living operators pay per unit for admin dashboards and analytics |
| **Templates** | Marketplace for chore templates (student dorm, family, office kitchen) |

### 13.5 Success Metrics

| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| Active households | 1,000+ |
| Chores completed via app | 50,000+ |
| Average session duration | 5+ minutes |
| User retention (30-day) | 40%+ |
| Trade completion rate | 60%+ of proposed trades accepted |

---

## Submission Checklist

| Requirement | Status |
|-------------|--------|
| Project Name | ✅ Complete |
| Team Information | ⚠️ Fill in placeholders |
| Detailed Project Description | ✅ Complete |
| GitHub Repository | ✅ Complete |
| Demo Link | ⚠️ Deploy and add URL |
| Presentation / Documentation | ✅ Complete |
| Technologies Used | ✅ Complete |
| Walkthrough Video | ⚠️ Record and add URL |
| Screenshots | ⚠️ Capture and add to docs/screenshots/ |
| Architecture Diagrams | ✅ Complete |
| API Documentation | ✅ Complete |
| Scalability & Roadmap | ✅ Complete |
| Business / Impact Analysis | ✅ Complete |

---

**ChoreWheel Team — UOE Summer of Code 2026**  
*Innovate. Build. Collaborate.*
