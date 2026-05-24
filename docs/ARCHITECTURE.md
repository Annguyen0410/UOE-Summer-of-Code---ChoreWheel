# ChoreWheel — System Architecture

**UOE Summer of Code 2026 | Technical Architecture Document**

---

## 1. Architecture Overview

ChoreWheel follows a **client-side, offline-first architecture** with optional cloud synchronization. All core business logic runs in the browser; no proprietary backend server is required.

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     Presentation Layer                      │  │
│  │  App.tsx → Components (ChoreWheel, ChoreList, Store, etc.)  │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                              │ useRoom() hook                     │
│  ┌──────────────────────────▼─────────────────────────────────┐  │
│  │                   Application Layer                          │  │
│  │              RoomContext (State Manager)                       │  │
│  │   • Room CRUD    • Member CRUD    • Chore lifecycle          │  │
│  │   • Spin assign  • Trade workflow • Voucher economy          │  │
│  │   • Points/streaks • History log  • Notifications            │  │
│  └──────────┬───────────────────────────────┬─────────────────┘  │
│             │                               │                     │
│  ┌──────────▼──────────┐         ┌──────────▼─────────────────┐  │
│  │   Persistence Layer  │         │    Browser APIs            │  │
│  │                      │         │                            │  │
│  │  localStorage        │         │  Canvas API (wheel)        │  │
│  │  (primary, offline)  │         │  Web Audio API (sounds)    │  │
│  │                      │         │  Service Worker (PWA)      │  │
│  │  Firebase RTDB       │         │  Web Manifest              │  │
│  │  (optional, cloud)   │         │                            │  │
│  └──────────────────────┘         └────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (optional)
              ┌───────────────────────────────┐
              │   Firebase Realtime Database   │
              │                                │
              │   /rooms/{roomCode}/           │
              │     ├── members[]              │
              │     ├── chores[]               │
              │     ├── trades[]               │
              │     ├── vouchers[]             │
              │     ├── notifications[]        │
              │     └── historyLogs[]          │
              └───────────────────────────────┘
```

---

## 2. Component Hierarchy

```
main.tsx
└── App.tsx
    └── RoomProvider
        ├── Header Bar
        │   ├── Room name + code (copy)
        │   ├── Active member selector
        │   └── Settings / Manual / Dev buttons
        │
        ├── QuickStartGuide (first visit)
        ├── OnboardingModal (first visit)
        │
        ├── Main Grid Layout
        │   ├── Left Column
        │   │   ├── ChoreWheel (canvas spin)
        │   │   └── ChoreList (CRUD + actions)
        │   │
        │   ├── Center Column
        │   │   ├── Leaderboard
        │   │   └── HistoryLogPanel
        │   │
        │   └── Right Column
        │       ├── PrivilegeStore
        │       ├── NotificationFeed
        │       └── GuidebookBox
        │
        ├── TradeModal (overlay)
        ├── RoomSwitcher (overlay)
        ├── DevSettingsModal (overlay)
        └── UserManualModal (overlay)
```

---

## 3. State Management — RoomContext

All application state flows through a single React Context (`RoomContext`). This centralizes domain logic and ensures consistent updates across all components.

### State Shape

```typescript
interface RoomState {
  roomCode: string;
  roomName: string;
  members: Member[];
  chores: Chore[];
  trades: TradeOffer[];
  vouchers: Voucher[];
  notifications: RoomNotification[];
  historyLogs?: HistoryLog[];
  customVouchers?: CustomVoucherTemplate[];
}
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single context vs. Redux/Zustand | App scope is bounded; Context avoids dependency overhead |
| Immutable state updates | React re-render optimization; predictable state transitions |
| Tab ID for echo prevention | Prevents Firebase sync loops when the writing tab receives its own update |
| localStorage as source of truth | Works without network; Firebase is a sync layer, not primary store |

---

## 4. Data Flow Diagrams

### 4.1 Chore Spin Assignment

```
User selects chore → clicks Spin
         │
         ▼
ChoreWheel.startSpin()
         │
         ├── Calculate fair-weighted segments
         │     (inverse proportional to completedCount)
         │
         ├── Animate canvas rotation (requestAnimationFrame)
         ├── Play tick sounds (Web Audio API)
         │
         ▼
Animation completes → winner determined
         │
         ├── spinAssignChore(choreId, memberId)
         │     ├── Update chore.assignedTo
         │     ├── Push notification (type: 'spin')
         │     ├── Persist to localStorage
         │     └── Sync to Firebase (if enabled)
         │
         └── Confetti celebration (canvas-confetti)
```

### 4.2 Real-Time Sync (Firebase)

```
Device A: completeChore()
         │
         ├── Update local state
         ├── Write to localStorage
         └── firebaseService.writeRoomState()
                    │
                    ▼
         Firebase Realtime Database
                    │
                    ▼
         firebaseService.listenRoomState() on Device B
                    │
                    ├── Compare lastUpdated timestamp
                    ├── Skip if same TAB_ID (echo prevention)
                    └── Merge remote state into local RoomContext
```

### 4.3 Trade Workflow

```
Member A: requestTrade(myChore, Member B, theirChore)
         │
         ├── Create TradeOffer (status: 'Pending')
         ├── Notify both members
         └── Sync
                    │
                    ▼
Member B: respondToTrade(tradeId, accept: true)
         │
         ├── Swap chore.assignedTo between both chores
         ├── Update trade status → 'Accepted'
         ├── Notify room
         └── Sync
```

---

## 5. Spin Wheel — Technical Design

The ChoreWheel component is the most technically complex part of the application.

| Aspect | Implementation |
|--------|---------------|
| Rendering | HTML Canvas 2D context, custom draw loop |
| Animation | `requestAnimationFrame` with velocity decay physics |
| Fair weighting | Segment arc size = `baseAngle / (1 + completedCount * weightFactor)` |
| Sound | Web Audio API — synthesized triangle wave + bandpass filter |
| Celebration | canvas-confetti library triggered on assignment |
| Performance | 60fps animation; canvas cleared and redrawn each frame |

---

## 6. Persistence Strategy

### localStorage Keys

| Key | Content |
|-----|---------|
| `chorewheel_rooms` | Array of all room states |
| `chorewheel_active_room` | Currently selected room code |
| `chorewheel_active_member` | Currently selected member ID |
| `chorewheel_firebase_config` | Firebase credentials (optional) |
| `chorewheel_onboarding_seen` | Onboarding completion flag |
| `chorewheel_quickstart_dismissed` | Quick start banner flag |

### Sync Strategy

1. **Write:** Every state mutation writes to localStorage immediately, then async-pushes to Firebase if configured.
2. **Read:** On room switch, load from localStorage. If Firebase is active, subscribe to `onValue` for live updates.
3. **Conflict resolution:** Last-write-wins based on `lastUpdated` timestamp.
4. **Echo prevention:** Each browser tab has a unique `TAB_ID`; incoming Firebase updates from the same tab are ignored.

---

## 7. PWA Architecture

```
index.html
├── manifest.json          → App name, icons, theme, shortcuts
├── sw.js                  → Cache-first strategy for static assets
└── registerServiceWorker.ts → Registration on app load
```

| Feature | Behavior |
|---------|----------|
| Install prompt | Browser offers "Add to Home Screen" |
| Offline | Cached shell loads; app functions via localStorage |
| Shortcuts | Direct links to Spinner and Leaderboard tabs |

---

## 8. Security Considerations

| Area | Current | Future |
|------|---------|--------|
| Authentication | None (local-only rooms) | Firebase Auth in v1.1 |
| Firebase config | Stored in localStorage (client-side) | Environment variables for hosted deployments |
| Data validation | TypeScript interfaces + runtime checks | Server-side rules in Firebase Security Rules |
| Room access | Anyone with room code can join | Invite-only links with expiring tokens |

---

## 9. Performance Profile

| Metric | Value |
|--------|-------|
| Initial bundle (est.) | ~200KB gzipped |
| First Contentful Paint | < 1.5s on 4G |
| Wheel animation | 60fps on modern mobile |
| State update latency | < 16ms (local); < 500ms (Firebase sync) |
| localStorage capacity | ~5MB (supports hundreds of rooms) |

---

## 10. Deployment Architecture

```
Developer Machine
    │
    ├── npm run build → dist/ (static files)
    │
    ▼
Hosting Platform (Vercel / Netlify / Firebase Hosting / GitHub Pages)
    │
    ├── CDN edge caching
    ├── HTTPS by default
    └── SPA fallback routing (all paths → index.html)
    │
    ▼
User Browser
    ├── Loads static React app
    ├── Runs entirely client-side
    └── Optionally connects to Firebase RTDB
```

No server-side runtime is required for deployment.
