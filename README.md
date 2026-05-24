# ChoreWheel

ChoreWheel is a household chore management app built with React, TypeScript, and Vite. It helps families, roommates, and shared households assign chores fairly using a spinning wheel, track progress over time, and reward members through a leaderboard and privilege store.

## Key Features

- **Interactive Chore Wheel**: spin to randomly assign chores with weighted fairness based on completed tasks.
- **Household Room Management**: create, join, switch, and delete rooms for different households.
- **Member Profiles**: add household members with personalized colors and activity points.
- **Live Activity Feed**: view real-time notifications for task assignments, completions, trades, and rewards.
- **Trade & Reward System**: swap chores with housemates and use points to buy privileges.
- **History & Leaderboard**: review past chores and compare household members by points.
- **Onboarding & Guidebook**: built-in guidance for first-time users and task management.

## Tech Stack

- React 19
- TypeScript
- Vite
- Firebase (for optional sync)
- lucide-react icons
- canvas-confetti animations

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the app at the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

- `src/App.tsx` — main application shell and layout
- `src/components/ChoreWheel.tsx` — interactive spinning wheel assignment
- `src/components/ChoreList.tsx` — chore list and task controls
- `src/context/RoomContext.tsx` — shared room and member state
- `src/services/firebase.ts` — optional Firebase integration

## Notes

This repository is part of the UOE Summer of Code ChoreWheel project. The current implementation includes offline room/team management and a rich interactive UI.

## License

This project does not include a license file. Add one if you want to share the app publicly.
