# ChoreWheel — API & Data Reference

**UOE Summer of Code 2026 | API Documentation**

---

## 1. Overview

ChoreWheel does not expose a traditional REST API. Instead, it uses:

1. **RoomContext actions** — programmatic interface for all domain operations
2. **localStorage** — browser-native key-value persistence
3. **Firebase Realtime Database** — optional cloud sync endpoint

This document defines the data schemas, context actions, and Firebase operations.

---

## 2. Data Models

### 2.1 Member

```typescript
interface Member {
  id: string;           // Unique identifier (e.g., "m1")
  name: string;         // Display name (e.g., "Alice")
  avatar: string;       // Monogram initials (e.g., "A") — no emojis
  color: string;        // Hex ink color (e.g., "#1E3A8A")
  points: number;       // Accumulated reward points
  completedCount: number; // Total chores completed (all time)
  streakCount: number;  // Current consecutive completion streak
}
```

### 2.2 Chore

```typescript
interface Chore {
  id: string;
  name: string;
  description: string;
  points: number;       // Base point value
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Kitchen' | 'Bathroom' | 'Common' | 'Outdoor' | 'Pets' | 'Other';
  frequency: 'Daily' | 'Weekly' | 'Bi-weekly';
  assignedTo: string | null;  // Member ID or null if unassigned
  status: 'Pending' | 'Completed';
  lastCompleted?: number;     // Unix timestamp
}
```

### 2.3 TradeOffer

```typescript
interface TradeOffer {
  id: string;
  fromMemberId: string;
  fromChoreId: string;
  toMemberId: string;
  toChoreId: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  timestamp: number;
}
```

### 2.4 Voucher

```typescript
interface Voucher {
  id: string;
  memberId: string;
  name: string;
  cost: number;
  status: 'Active' | 'Redeemed';
  timestamp: number;
  redeemedTimestamp?: number;
  isCustom?: boolean;
}
```

### 2.5 RoomNotification

```typescript
interface RoomNotification {
  id: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'warn' | 'trade' | 'spin' | 'store' | 'undo';
}
```

### 2.6 HistoryLog

```typescript
interface HistoryLog {
  id: string;
  choreId: string;
  choreName: string;
  memberId: string;
  memberName: string;
  points: number;
  timestamp: number;
  streakBonus: number;
}
```

### 2.7 RoomState (Root Object)

```typescript
interface RoomState {
  roomCode: string;       // 6-char alphanumeric (e.g., "HOMEY9")
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

---

## 3. RoomContext Actions

All actions are available via the `useRoom()` hook.

### 3.1 Room Management

| Action | Signature | Description | Returns |
|--------|-----------|-------------|---------|
| `createRoom` | `(name: string) => void` | Create a new room with auto-generated code | — |
| `joinRoom` | `(code: string) => boolean` | Join existing room by code | `true` if found |
| `switchRoom` | `(code: string) => void` | Switch active room | — |
| `deleteRoom` | `(code: string) => void` | Remove room from local storage | — |

### 3.2 Member Management

| Action | Signature | Description |
|--------|-----------|-------------|
| `addMember` | `(name: string, color: string) => void` | Add household member with auto-generated initials avatar |
| `deleteMember` | `(memberId: string) => void` | Remove member (unassigns their chores) |
| `setActiveMember` | `(memberId: string) => void` | Set the current user's active identity |

### 3.3 Chore Lifecycle

| Action | Signature | Description |
|--------|-----------|-------------|
| `addChore` | `(name, description, points, difficulty, category, frequency) => void` | Create a new chore |
| `deleteChore` | `(choreId: string) => void` | Remove a chore |
| `assignChore` | `(choreId: string, memberId: string \| null) => void` | Manually assign or unassign |
| `spinAssignChore` | `(choreId: string, memberId: string) => void` | Assign via wheel spin result |
| `completeChore` | `(choreId: string) => void` | Mark complete, award points, log history |
| `undoChoreCompletion` | `(logId: string) => void` | Reverse a completion (Eraser) |
| `resetWeek` | `() => void` | Reset all chores to Pending for new cycle |

### 3.4 Trading

| Action | Signature | Description |
|--------|-----------|-------------|
| `requestTrade` | `(fromChoreId, toMemberId, toChoreId) => void` | Propose a chore swap |
| `respondToTrade` | `(tradeId: string, accept: boolean) => void` | Accept or decline a trade |

### 3.5 Voucher Economy

| Action | Signature | Description |
|--------|-----------|-------------|
| `purchaseVoucher` | `(name: string, cost: number) => void` | Buy a reward with points |
| `redeemVoucher` | `(voucherId: string) => void` | Mark voucher as used |
| `addCustomVoucher` | `(name, cost, description) => void` | Create a custom reward template |

### 3.6 Firebase Configuration

| Action | Signature | Description |
|--------|-----------|-------------|
| `updateFirebaseSettings` | `(config: FirebaseConfig \| null) => void` | Save or clear Firebase credentials |

---

## 4. Firebase Realtime Database

### 4.1 Configuration

```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
```

Stored in localStorage under key `chorewheel_firebase_config`.

### 4.2 Database Paths

| Path | Type | Description |
|------|------|-------------|
| `/rooms/{roomCode}` | Object | Full RoomState + `lastUpdated` timestamp |
| `/rooms/{roomCode}/lastUpdated` | Number | Unix ms timestamp for conflict resolution |

### 4.3 Service Functions

#### `initFirebase(): Database | null`

Initializes Firebase from saved config. Returns `null` if no config or invalid credentials.

#### `isFirebaseEnabled(): boolean`

Returns `true` if Firebase is initialized and connected.

#### `firebaseService.writeRoomState(roomCode, state): Promise<boolean>`

Writes the entire room state to Firebase. Adds `lastUpdated: Date.now()`.

**Example:**
```typescript
await firebaseService.writeRoomState('HOMEY9', {
  roomCode: 'HOMEY9',
  roomName: 'Suite 24 Notepad',
  members: [...],
  chores: [...],
  // ... full RoomState
});
```

#### `firebaseService.listenRoomState(roomCode, callback): () => void`

Subscribes to real-time updates. Returns an unsubscribe function.

**Example:**
```typescript
const unsubscribe = firebaseService.listenRoomState('HOMEY9', (remoteState) => {
  // Merge remoteState into local RoomContext
});

// Later:
unsubscribe();
```

### 4.4 Recommended Firebase Security Rules

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['roomCode', 'roomName', 'members', 'chores'])"
      }
    }
  }
}
```

> For production, restrict write access with Firebase Authentication.

---

## 5. localStorage API

### 5.1 Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `chorewheel_rooms` | `RoomState[]` | All rooms (JSON array) |
| `chorewheel_active_room` | `string` | Active room code |
| `chorewheel_active_member` | `string` | Active member ID |
| `chorewheel_firebase_config` | `FirebaseConfig` | Firebase credentials |
| `chorewheel_onboarding_seen` | `"true"` | Onboarding flag |
| `chorewheel_quickstart_dismissed` | `"true"` | Quick start flag |

### 5.2 Read Pattern

```typescript
const rooms = JSON.parse(localStorage.getItem('chorewheel_rooms') || '[]');
const activeCode = localStorage.getItem('chorewheel_active_room');
const currentRoom = rooms.find(r => r.roomCode === activeCode);
```

### 5.3 Write Pattern

Every state mutation in RoomContext follows:

```typescript
// 1. Update React state
setRooms(prev => prev.map(r => r.roomCode === code ? updatedRoom : r));

// 2. Persist to localStorage
localStorage.setItem('chorewheel_rooms', JSON.stringify(updatedRooms));

// 3. Sync to Firebase (async, non-blocking)
if (isFirebaseActive) {
  firebaseService.writeRoomState(code, updatedRoom);
}
```

---

## 6. Points Calculation

### Base Points

Defined per chore at creation time based on difficulty:

| Difficulty | Typical Points |
|------------|---------------|
| Easy | 10–25 |
| Medium | 30–60 |
| Hard | 70–120 |

### Streak Bonus

```
streakBonus = basePoints × (streakCount × 0.1)
totalAwarded = basePoints + streakBonus
```

Example: 50-point chore with streakCount = 3 → bonus = 15 → total = 65 points.

---

## 7. Fair Weighting Algorithm

Used by the spin wheel when `fairWeighting` is enabled:

```
for each member:
  weight = 1 / (1 + member.completedCount × FAIR_FACTOR)

segmentAngle = (weight / sumOfAllWeights) × 360°
```

Members with fewer completed chores receive proportionally larger wheel segments, increasing their probability of being selected.

---

## 8. Error Handling

| Scenario | Behavior |
|----------|----------|
| Firebase write fails | State remains in localStorage; error logged to console |
| Firebase listener error | Logged to console; app continues in local-only mode |
| Invalid room code on join | Returns `false`; no state change |
| Insufficient points for voucher | Action blocked; no state change |
| Undo on non-existent log | No-op |

---

## 9. Event Types (Notifications)

| Type | Trigger | Example Message |
|------|---------|-----------------|
| `info` | General actions | "Alice joined the room" |
| `success` | Chore completed | "Alice completed Wipe Kitchen Counters (+20 pts)" |
| `warn` | Errors / warnings | "Not enough points for this voucher" |
| `trade` | Trade activity | "Bob proposed a trade with Alice" |
| `spin` | Wheel assignment | "Wheel assigned Weed Garden to Charlie" |
| `store` | Store activity | "Alice purchased Skip One Chore voucher" |
| `undo` | Completion reversed | "Eraser: Undid Wipe Kitchen Counters completion" |
