# ChoreWheel — The Gamified Chore Rotation Sketchbook

**UOE Summer of Code 2026 Submission**

> Spin fairly. Trade smart. Earn rewards. Keep the household in harmony.

ChoreWheel is a real-time, gamified web application for roommates and households. It replaces arguments over chores with a fair spin wheel, a points economy, peer-to-peer trading, and a reward store — all wrapped in a distinctive sketchbook aesthetic.

---

## Live Demo

**[Demo URL — deploy and update this link](https://your-deployed-url.example.com)**

Default sample room code: `HOMEY9`

---

## Features

- **Spin Wheel** — Fair-weighted random chore assignment with animation and sound
- **Points & Streaks** — Earn rewards for completing chores; streak multipliers for consistency
- **Leaderboard** — Transparent household contribution rankings
- **Chore Trading** — Swap assignments when schedules conflict
- **Privilege Store** — Redeem points for custom household rewards
- **Multi-Room** — Create/join rooms with shareable codes
- **Real-Time Sync** — Optional Firebase Realtime Database integration
- **PWA** — Installable, works offline via localStorage
- **Onboarding** — 5-step tutorial for first-time users

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | Custom CSS (sketchbook design system) |
| Icons | Lucide React |
| Sync | Firebase Realtime Database (optional) |
| Storage | localStorage (offline-first) |
| PWA | Service Worker + Web Manifest |
| Effects | Canvas API, Web Audio API, canvas-confetti |

---

## Quick Start

```bash
git clone https://github.com/Annguyen0410/UOE-Summer-of-Code---ChoreWheel.git
cd UOE-Summer-of-Code---ChoreWheel
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
npm run preview
```

---

## Firebase Setup (Optional)

1. Create a Firebase project with Realtime Database enabled.
2. Open the app ? **Dev Settings** (gear icon).
3. Paste your Firebase config JSON.
4. All room data syncs across devices in real time.

Without Firebase, the app works fully offline using browser localStorage.

---

## Project Structure

```
src/
??? components/
?   ??? ChoreWheel.tsx       # Canvas spin wheel
?   ??? ChoreList.tsx        # Chore CRUD & completion
?   ??? TradeModal.tsx       # Peer chore swapping
?   ??? PrivilegeStore.tsx   # Reward economy
?   ??? Leaderboard.tsx      # Rankings
?   ??? HistoryLogPanel.tsx  # Completion ledger
?   ??? ...
??? context/
?   ??? RoomContext.tsx      # Core state management
??? services/
?   ??? firebase.ts          # Cloud sync layer
??? App.tsx                  # Application shell
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [SUBMISSION.md](SUBMISSION.md) | Full UOE Summer of Code 2026 submission |
| [docs/PRESENTATION.md](docs/PRESENTATION.md) | Presentation slide outline |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture diagrams |
| [docs/API.md](docs/API.md) | Data schema and API reference |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Scalability and future roadmap |
| [docs/IMPACT.md](docs/IMPACT.md) | Business and social impact analysis |

---

## Hackathon Theme

**Startup & Productivity Solutions** — ChoreWheel improves household workflows, collaboration, and operations through gamification and fair assignment mechanics.

---

## Team

| Name | Role |
|------|------|
| [Your Name] | Project Lead / Developer |

GitHub: [@Annguyen0410](https://github.com/Annguyen0410)

---

## License

[Specify license]

---

**UOE Summer of Code 2026** — *Innovate. Build. Collaborate.*
