/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { firebaseService, isFirebaseEnabled, getSavedFirebaseConfig, saveFirebaseConfig, initFirebase } from '../services/firebase';
import type { FirebaseConfig } from '../services/firebase';

export interface Member {
  id: string;
  name: string;
  avatar: string; // Hand-drawn monogram initials (e.g. "A" or "JS" - NO EMOJIS)
  color: string; // Ink profile color
  points: number;
  completedCount: number;
  streakCount: number; // For hand-drawn Tidy Streaks multipliers
}

export interface Chore {
  id: string;
  name: string;
  description: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Kitchen' | 'Bathroom' | 'Common' | 'Outdoor' | 'Pets' | 'Other';
  frequency: 'Daily' | 'Weekly' | 'Bi-weekly';
  assignedTo: string | null;
  status: 'Pending' | 'Completed';
  lastCompleted?: number;
}

export interface TradeOffer {
  id: string;
  fromMemberId: string;
  fromChoreId: string;
  toMemberId: string;
  toChoreId: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  timestamp: number;
}

export interface Voucher {
  id: string;
  memberId: string;
  name: string;
  cost: number;
  status: 'Active' | 'Redeemed';
  timestamp: number;
  redeemedTimestamp?: number;
  isCustom?: boolean; // custom-pinned reward coupons
}

export interface RoomNotification {
  id: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'warn' | 'trade' | 'spin' | 'store' | 'undo';
}

export interface HistoryLog {
  id: string;
  choreId: string;
  choreName: string;
  memberId: string;
  memberName: string;
  points: number;
  timestamp: number;
  streakBonus: number;
}

export interface CustomVoucherTemplate {
  name: string;
  cost: number;
  description: string;
}

export interface RoomState {
  roomCode: string;
  roomName: string;
  members: Member[];
  chores: Chore[];
  trades: TradeOffer[];
  vouchers: Voucher[];
  notifications: RoomNotification[];
  historyLogs?: HistoryLog[]; // Hand-drawn notepad completed chores ledger
  customVouchers?: CustomVoucherTemplate[]; // Custom reward coupons created by users
}

interface RoomContextType {
  currentRoom: RoomState | null;
  activeMemberId: string | null;
  roomsList: { code: string; name: string }[];
  isFirebaseActive: boolean;
  savedConfig: FirebaseConfig | null;
  
  createRoom: (name: string) => void;
  joinRoom: (code: string) => boolean;
  switchRoom: (code: string) => void;
  deleteRoom: (code: string) => void;
  setActiveMember: (memberId: string) => void;
  
  addMember: (name: string, color: string) => void;
  deleteMember: (memberId: string) => void;
  addChore: (name: string, description: string, points: number, difficulty: 'Easy' | 'Medium' | 'Hard', category: Chore['category'], frequency: Chore['frequency']) => void;
  deleteChore: (choreId: string) => void;
  
  assignChore: (choreId: string, memberId: string | null) => void;
  spinAssignChore: (choreId: string, memberId: string) => void;
  completeChore: (choreId: string) => void;
  undoChoreCompletion: (logId: string) => void; // Eraser action QoL
  resetWeek: () => void; // Archiver reset week action
  
  requestTrade: (fromChoreId: string, toMemberId: string, toChoreId: string) => void;
  respondToTrade: (tradeId: string, accept: boolean) => void;
  
  purchaseVoucher: (name: string, cost: number) => void;
  redeemVoucher: (voucherId: string) => void;
  addCustomVoucher: (name: string, cost: number, description: string) => void; // Create reward coupons
  
  updateFirebaseSettings: (config: FirebaseConfig | null) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Generate unique room code
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Tab ID to prevent echo sync
const TAB_ID = Math.random().toString(36).substring(2, 9);

// Helper to compute initials from a name (NO EMOJIS)
const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.trim().substring(0, 2).toUpperCase();
};

// Default notebook room for instant beautiful out-of-the-box paper demo
const DEFAULT_ROOM: RoomState = {
  roomCode: 'HOMEY9',
  roomName: 'Suite 24 Notepad',
  members: [
    { id: 'm1', name: 'Alice', avatar: 'A', color: '#1E3A8A', points: 140, completedCount: 4, streakCount: 2 },
    { id: 'm2', name: 'Bob', avatar: 'B', color: '#0F766E', points: 80, completedCount: 2, streakCount: 0 },
    { id: 'm3', name: 'Charlie', avatar: 'C', color: '#B45309', points: 195, completedCount: 5, streakCount: 3 }
  ],
  chores: [
    { id: 'c1', name: 'Wipe Kitchen Counters', description: 'Clean cooking crumbs and wipe coffee marks.', points: 20, difficulty: 'Easy', category: 'Kitchen', frequency: 'Daily', assignedTo: 'm2', status: 'Pending' },
    { id: 'c2', name: 'Scrub Shower Tiles', description: 'Clean soap scum off master bathroom tiles.', points: 80, difficulty: 'Hard', category: 'Bathroom', frequency: 'Weekly', assignedTo: 'm1', status: 'Pending' },
    { id: 'c3', name: 'Empty Shared Trash', description: 'Collect paper shreds, bins, and recycling.', points: 15, difficulty: 'Easy', category: 'Common', frequency: 'Daily', assignedTo: 'm3', status: 'Pending' },
    { id: 'c4', name: 'Weed Front Garden Path', description: 'Pull grass weeds along the gravel walk.', points: 100, difficulty: 'Hard', category: 'Outdoor', frequency: 'Bi-weekly', assignedTo: null, status: 'Pending' },
    { id: 'c5', name: 'Refill Fluffy Water Bowl', description: 'Scrub bowl rim and pour fresh tap water.', points: 10, difficulty: 'Easy', category: 'Pets', frequency: 'Daily', assignedTo: 'm1', status: 'Pending' }
  ],
  trades: [],
  vouchers: [
    { id: 'v1', memberId: 'm3', name: 'Choose Car Ride Music', cost: 50, status: 'Active', timestamp: Date.now() - 1000 * 60 * 60 * 3 }
  ],
  historyLogs: [
    { id: 'h1', choreId: 'c_setup1', choreName: 'Organize Study Table', memberId: 'm3', memberName: 'Charlie', points: 40, timestamp: Date.now() - 1000 * 60 * 60 * 5, streakBonus: 8 },
    { id: 'h2', choreId: 'c_setup2', choreName: 'Clean Coffee Maker', memberId: 'm1', memberName: 'Alice', points: 30, timestamp: Date.now() - 1000 * 60 * 60 * 24, streakBonus: 0 }
  ],
  customVouchers: [
    { name: 'Snooze Chore Exemption', cost: 120, description: 'Pass any daily chore directly back to the spinner pool.' }
  ],
  notifications: [
    { id: 'n1', message: 'Notepad created: Suite 24 Ledger', timestamp: Date.now() - 1000 * 60 * 60 * 28, type: 'info' },
    { id: 'n2', message: 'Charlie completed "Organize Study Table" and earned 48 pts (Streak Bonus!)', timestamp: Date.now() - 1000 * 60 * 60 * 5, type: 'success' },
    { id: 'n3', message: 'Charlie purchased "Choose Car Ride Music" coupon!', timestamp: Date.now() - 1000 * 60 * 60 * 3, type: 'store' }
  ]
};

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Record<string, RoomState>>(() => {
    const saved = localStorage.getItem('chorewheel_rooms_notebook');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.error('Failed to parse saved rooms, using default');
      }
    }
    return { [DEFAULT_ROOM.roomCode]: DEFAULT_ROOM };
  });

  const [currentRoomCode, setCurrentRoomCode] = useState<string>(() => {
    return localStorage.getItem('chorewheel_current_room_notebook') || DEFAULT_ROOM.roomCode;
  });

  const [activeMemberId, setActiveMemberId] = useState<string | null>(() => {
    const active = localStorage.getItem(`chorewheel_active_nb_${currentRoomCode}`);
    if (active) return active;
    const room = rooms[currentRoomCode] || DEFAULT_ROOM;
    return room.members[0]?.id || null;
  });

  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(isFirebaseEnabled());
  const [savedConfig, setSavedConfig] = useState<FirebaseConfig | null>(getSavedFirebaseConfig());

  const currentRoom = rooms[currentRoomCode] || null;

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('chorewheel_sync_notebook');
    
    const handleBroadcast = (event: MessageEvent) => {
      const { type, payload, source } = event.data;
      if (source === TAB_ID) return;

      if (type === 'SYNC_ROOMS') {
        setRooms(payload.rooms);
        if (payload.currentRoomCode && rooms[payload.currentRoomCode]) {
          setCurrentRoomCode(payload.currentRoomCode);
        }
      }
    };

    broadcastChannelRef.current.addEventListener('message', handleBroadcast);
    return () => {
      broadcastChannelRef.current?.removeEventListener('message', handleBroadcast);
      broadcastChannelRef.current?.close();
    };
  }, [rooms]);

  useEffect(() => {
    if (!isFirebaseActive || !currentRoomCode) return;

    const unsubscribe = firebaseService.listenRoomState(currentRoomCode, (remoteState) => {
      if (remoteState) {
        setRooms(prev => {
          const updated = { ...prev, [currentRoomCode]: remoteState as unknown as RoomState };
          localStorage.setItem('chorewheel_rooms_notebook', JSON.stringify(updated));
          return updated;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isFirebaseActive, currentRoomCode]);

  const syncState = (updatedRooms: Record<string, RoomState>, targetRoomCode = currentRoomCode) => {
    setRooms(updatedRooms);
    localStorage.setItem('chorewheel_rooms_notebook', JSON.stringify(updatedRooms));
    localStorage.setItem('chorewheel_current_room_notebook', targetRoomCode);

    broadcastChannelRef.current?.postMessage({
      type: 'SYNC_ROOMS',
      payload: { rooms: updatedRooms, currentRoomCode: targetRoomCode },
      source: TAB_ID
    });

    if (isFirebaseActive && updatedRooms[targetRoomCode]) {
      firebaseService.writeRoomState(targetRoomCode, updatedRooms[targetRoomCode] as unknown as Record<string, unknown>);
    }
  };

  const roomsList = Object.keys(rooms).map(code => ({
    code,
    name: rooms[code].roomName
  }));

  const createRoom = (name: string) => {
    const code = generateCode();
    const newRoom: RoomState = {
      roomCode: code,
      roomName: name,
      members: [],
      chores: [],
      trades: [],
      vouchers: [],
      historyLogs: [],
      customVouchers: [],
      notifications: [
        { id: Math.random().toString(), message: `Notebook "${name}" started!`, timestamp: Date.now(), type: 'info' }
      ]
    };

    const updatedRooms = { ...rooms, [code]: newRoom };
    setCurrentRoomCode(code);
    setActiveMemberId(null);
    syncState(updatedRooms, code);
  };

  const joinRoom = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (rooms[cleanCode]) {
      setCurrentRoomCode(cleanCode);
      const members = rooms[cleanCode].members;
      setActiveMemberId(members[0]?.id || null);
      localStorage.setItem('chorewheel_current_room_notebook', cleanCode);
      return true;
    }

    if (isFirebaseActive) {
      const placeholderRoom: RoomState = {
        roomCode: cleanCode,
        roomName: `Opening Notepad (${cleanCode})...`,
        members: [],
        chores: [],
        trades: [],
        vouchers: [],
        historyLogs: [],
        customVouchers: [],
        notifications: [{ id: 'join', message: 'Opening notepad from ledger storage...', timestamp: Date.now(), type: 'info' }]
      };
      
      const updatedRooms = { ...rooms, [cleanCode]: placeholderRoom };
      setCurrentRoomCode(cleanCode);
      setActiveMemberId(null);
      syncState(updatedRooms, cleanCode);
      return true;
    }

    return false;
  };

  const switchRoom = (code: string) => {
    if (rooms[code]) {
      setCurrentRoomCode(code);
      const active = localStorage.getItem(`chorewheel_active_nb_${code}`);
      setActiveMemberId(active || rooms[code].members[0]?.id || null);
      localStorage.setItem('chorewheel_current_room_notebook', code);
    }
  };

  const deleteRoom = (code: string) => {
    if (code === DEFAULT_ROOM.roomCode) return;
    
    const updated = { ...rooms };
    delete updated[code];
    
    let nextCode = DEFAULT_ROOM.roomCode;
    const remainingCodes = Object.keys(updated);
    if (remainingCodes.length > 0) {
      nextCode = remainingCodes[0];
    }
    
    setCurrentRoomCode(nextCode);
    const active = localStorage.getItem(`chorewheel_active_nb_${nextCode}`);
    setActiveMemberId(active || updated[nextCode].members[0]?.id || null);
    syncState(updated, nextCode);
  };

  const setActiveMember = (memberId: string) => {
    setActiveMemberId(memberId);
    localStorage.setItem(`chorewheel_active_nb_${currentRoomCode}`, memberId);
  };

  const addMember = (name: string, color: string) => {
    if (!currentRoom) return;

    const newMember: Member = {
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      name,
      avatar: getInitials(name), // computed hand-drawn monogram (1-2 uppercase letters)
      color,
      points: 50,
      completedCount: 0,
      streakCount: 0
    };

    const updatedRoom = {
      ...currentRoom,
      members: [...currentRoom.members, newMember],
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Roommate ${name} added with profile ${newMember.avatar}!`,
          timestamp: Date.now(),
          type: 'info' as const
        },
        ...currentRoom.notifications
      ]
    };

    const updatedRooms = { ...rooms, [currentRoomCode]: updatedRoom };
    if (!activeMemberId) {
      setActiveMemberId(newMember.id);
      localStorage.setItem(`chorewheel_active_nb_${currentRoomCode}`, newMember.id);
    }
    syncState(updatedRooms);
  };

  const deleteMember = (memberId: string) => {
    if (!currentRoom) return;
    
    const memberToDelete = currentRoom.members.find(m => m.id === memberId);
    if (!memberToDelete) return;
    
    // Cannot delete if only one member left
    if (currentRoom.members.length <= 1) {
      console.warn('Cannot delete the last roommate!');
      return;
    }

    const updatedRoom = {
      ...currentRoom,
      members: currentRoom.members.filter(m => m.id !== memberId),
      // Unassign chores that were assigned to this member
      chores: currentRoom.chores.map(c => 
        c.assignedTo === memberId ? { ...c, assignedTo: null } : c
      ),
      // Remove trades involving this member
      trades: currentRoom.trades.filter(
        t => t.fromMemberId !== memberId && t.toMemberId !== memberId
      ),
      // Remove vouchers owned by this member
      vouchers: currentRoom.vouchers.filter(v => v.memberId !== memberId),
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Roommate ${memberToDelete.name} removed from household.`,
          timestamp: Date.now(),
          type: 'warn' as const
        },
        ...currentRoom.notifications
      ]
    };

    // If deleted member was active, switch to another member
    let nextActiveMemberId = activeMemberId;
    if (activeMemberId === memberId) {
      nextActiveMemberId = updatedRoom.members[0]?.id || null;
      if (nextActiveMemberId) {
        setActiveMemberId(nextActiveMemberId);
        localStorage.setItem(`chorewheel_active_nb_${currentRoomCode}`, nextActiveMemberId);
      }
    }

    const updatedRooms = { ...rooms, [currentRoomCode]: updatedRoom };
    syncState(updatedRooms);
  };

  const addChore = (
    name: string,
    description: string,
    points: number,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    category: Chore['category'],
    frequency: Chore['frequency']
  ) => {
    if (!currentRoom) return;

    const newChore: Chore = {
      id: 'c_' + Math.random().toString(36).substring(2, 9),
      name,
      description,
      points,
      difficulty,
      category,
      frequency,
      assignedTo: null,
      status: 'Pending'
    };

    const updatedRoom = {
      ...currentRoom,
      chores: [...currentRoom.chores, newChore],
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Pinned task: "${name}" (${points} pts)`,
          timestamp: Date.now(),
          type: 'info' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const deleteChore = (choreId: string) => {
    if (!currentRoom) return;

    const chore = currentRoom.chores.find(c => c.id === choreId);
    const updatedRoom = {
      ...currentRoom,
      chores: currentRoom.chores.filter(c => c.id !== choreId),
      trades: currentRoom.trades.filter(t => t.fromChoreId !== choreId && t.toChoreId !== choreId),
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Erased chore: "${chore?.name || 'Unknown'}"`,
          timestamp: Date.now(),
          type: 'warn' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const assignChore = (choreId: string, memberId: string | null) => {
    if (!currentRoom) return;

    const chore = currentRoom.chores.find(c => c.id === choreId);
    if (!chore) return;

    const member = currentRoom.members.find(m => m.id === memberId);
    const message = memberId 
      ? `"${chore.name}" penciled to ${member?.name}`
      : `"${chore.name}" unassigned`;

    const updatedRoom = {
      ...currentRoom,
      chores: currentRoom.chores.map(c => 
        c.id === choreId 
          ? { ...c, assignedTo: memberId, status: 'Pending' as const } 
          : c
      ),
      trades: currentRoom.trades.filter(t => t.fromChoreId !== choreId && t.toChoreId !== choreId),
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message,
          timestamp: Date.now(),
          type: 'info' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const spinAssignChore = (choreId: string, memberId: string) => {
    if (!currentRoom) return;

    const chore = currentRoom.chores.find(c => c.id === choreId);
    const member = currentRoom.members.find(m => m.id === memberId);
    if (!chore || !member) return;

    const updatedRoom = {
      ...currentRoom,
      chores: currentRoom.chores.map(c => 
        c.id === choreId 
          ? { ...c, assignedTo: memberId, status: 'Pending' as const } 
          : c
      ),
      trades: currentRoom.trades.filter(t => t.fromChoreId !== choreId && t.toChoreId !== choreId),
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Pencil Spinner landed on ${member.name}! Assigned: "${chore.name}"`,
          timestamp: Date.now(),
          type: 'spin' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const completeChore = (choreId: string) => {
    if (!currentRoom) return;

    const chore = currentRoom.chores.find(c => c.id === choreId);
    if (!chore || !chore.assignedTo) return;

    const member = currentRoom.members.find(m => m.id === chore.assignedTo);
    if (!member) return;

    // Tidy Streak logic:
    // If roommate has streakCount >= 2, they get 20% multiplier points bonus!
    const activeStreak = member.streakCount >= 2;
    const streakBonus = activeStreak ? Math.round(chore.points * 0.2) : 0;
    const earnedPoints = chore.points + streakBonus;

    const nextStreak = member.streakCount + 1;

    // Record history log
    const newLog: HistoryLog = {
      id: 'h_' + Math.random().toString(36).substring(2, 9),
      choreId,
      choreName: chore.name,
      memberId: member.id,
      memberName: member.name,
      points: chore.points,
      timestamp: Date.now(),
      streakBonus
    };

    const updatedRoom = {
      ...currentRoom,
      members: currentRoom.members.map(m => 
        m.id === chore.assignedTo 
          ? { 
              ...m, 
              points: m.points + earnedPoints, 
              completedCount: m.completedCount + 1,
              streakCount: nextStreak
            }
          : m
      ),
      chores: currentRoom.chores.map(c => 
        c.id === choreId 
          ? { ...c, assignedTo: null, status: 'Pending' as const, lastCompleted: Date.now() } 
          : c
      ),
      historyLogs: [newLog, ...(currentRoom.historyLogs || [])],
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Scribbled out completed: "${chore.name}" by ${member.name}! Earned ${earnedPoints} pts! ${activeStreak ? '(Streak bonus active!)' : ''}`,
          timestamp: Date.now(),
          type: 'success' as const
        },
        ...currentRoom.notifications
      ]
    };

    // Broken streaks: If Alice completes a chore, other roommates' streaks are preserved.
    // In our simplified gamification, completing chores builds your streak.
    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const undoChoreCompletion = (logId: string) => {
    if (!currentRoom || !(currentRoom.historyLogs)) return;

    const log = currentRoom.historyLogs.find(h => h.id === logId);
    if (!log) return;

    const member = currentRoom.members.find(m => m.id === log.memberId);
    if (!member) return;

    const totalDeducted = log.points + log.streakBonus;
    
    // Return chore back to checklist, assigned to the member
    const updatedRoom = {
      ...currentRoom,
      members: currentRoom.members.map(m => 
        m.id === log.memberId 
          ? { 
              ...m, 
              points: Math.max(0, m.points - totalDeducted), 
              completedCount: Math.max(0, m.completedCount - 1),
              streakCount: Math.max(0, m.streakCount - 1)
            }
          : m
      ),
      chores: currentRoom.chores.map(c => 
        c.id === log.choreId 
          ? { ...c, assignedTo: log.memberId, status: 'Pending' as const, lastCompleted: undefined } 
          : c
      ),
      historyLogs: currentRoom.historyLogs.filter(h => h.id !== logId),
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Eraser Rubbed: Undid completion for "${log.choreName}". Deducted ${totalDeducted} pts from ${member.name}.`,
          timestamp: Date.now(),
          type: 'undo' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const resetWeek = () => {
    if (!currentRoom) return;

    // Archive counts, preserves lifetime points, resets active streaks and week counts
    const updatedRoom = {
      ...currentRoom,
      members: currentRoom.members.map(m => ({
        ...m,
        completedCount: 0,
        streakCount: 0
      })),
      historyLogs: [], // clear weekly ledger list
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Weekly reset triggered: cleared week logs & standings. Points preserved!`,
          timestamp: Date.now(),
          type: 'undo' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const requestTrade = (fromChoreId: string, toMemberId: string, toChoreId: string) => {
    if (!currentRoom || !activeMemberId) return;

    const fromChore = currentRoom.chores.find(c => c.id === fromChoreId);
    const toChore = currentRoom.chores.find(c => c.id === toChoreId);
    const toMember = currentRoom.members.find(m => m.id === toMemberId);
    const activeMember = currentRoom.members.find(m => m.id === activeMemberId);

    if (!fromChore || !toChore || !toMember || !activeMember) return;

    const newTrade: TradeOffer = {
      id: 't_' + Math.random().toString(36).substring(2, 9),
      fromMemberId: activeMemberId,
      fromChoreId,
      toMemberId,
      toChoreId,
      status: 'Pending',
      timestamp: Date.now()
    };

    const updatedRoom = {
      ...currentRoom,
      trades: [...currentRoom.trades, newTrade],
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Swap Offer penciled: ${activeMember.name} proposed trading "${fromChore.name}" for ${toMember.name}'s "${toChore.name}"`,
          timestamp: Date.now(),
          type: 'trade' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const respondToTrade = (tradeId: string, accept: boolean) => {
    if (!currentRoom) return;

    const trade = currentRoom.trades.find(t => t.id === tradeId);
    if (!trade || trade.status !== 'Pending') return;

    const fromChore = currentRoom.chores.find(c => c.id === trade.fromChoreId);
    const toChore = currentRoom.chores.find(c => c.id === trade.toChoreId);
    const fromMember = currentRoom.members.find(m => m.id === trade.fromMemberId);
    const toMember = currentRoom.members.find(m => m.id === trade.toMemberId);

    if (!fromChore || !toChore || !fromMember || !toMember) return;

    const updatedChores = accept
      ? currentRoom.chores.map(c => {
          if (c.id === trade.fromChoreId) {
            return { ...c, assignedTo: trade.toMemberId };
          }
          if (c.id === trade.toChoreId) {
            return { ...c, assignedTo: trade.fromMemberId };
          }
          return c;
        })
      : currentRoom.chores;

    const notificationMsg = accept
      ? `Swap Completed! ${fromMember.name} and ${toMember.name} swapped "${fromChore.name}" and "${toChore.name}"!`
      : `Swap Declined: ${toMember.name} declined to swap "${toChore.name}" for "${fromChore.name}"`;
      
    const notificationType: RoomNotification['type'] = accept ? 'success' : 'warn';

    const updatedRoom = {
      ...currentRoom,
      chores: updatedChores,
      trades: currentRoom.trades.map(t => 
        t.id === tradeId 
          ? { ...t, status: (accept ? 'Accepted' : 'Declined') as 'Accepted' | 'Declined' | 'Pending' } 
          : t
      ),
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: notificationMsg,
          timestamp: Date.now(),
          type: notificationType
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const purchaseVoucher = (name: string, cost: number) => {
    if (!currentRoom || !activeMemberId) return;

    const member = currentRoom.members.find(m => m.id === activeMemberId);
    if (!member || member.points < cost) return;

    const newVoucher: Voucher = {
      id: 'v_' + Math.random().toString(36).substring(2, 9),
      memberId: activeMemberId,
      name,
      cost,
      status: 'Active',
      timestamp: Date.now()
    };

    const updatedRoom = {
      ...currentRoom,
      members: currentRoom.members.map(m => 
        m.id === activeMemberId 
          ? { ...m, points: m.points - cost } 
          : m
      ),
      vouchers: [...currentRoom.vouchers, newVoucher],
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Coupon Torn: ${member.name} purchased a "${name}" coupon for ${cost} pts!`,
          timestamp: Date.now(),
          type: 'store' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const redeemVoucher = (voucherId: string) => {
    if (!currentRoom) return;

    const voucher = currentRoom.vouchers.find(v => v.id === voucherId);
    if (!voucher || voucher.status !== 'Active') return;

    const member = currentRoom.members.find(m => m.id === voucher.memberId);
    if (!member) return;

    const updatedRoom = {
      ...currentRoom,
      vouchers: currentRoom.vouchers.map(v => 
        v.id === voucherId 
          ? { ...v, status: 'Redeemed' as const, redeemedTimestamp: Date.now() } 
          : v
      ),
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Coupon Redeemed: ${member.name} utilized their "${voucher.name}" coupon!`,
          timestamp: Date.now(),
          type: 'store' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const addCustomVoucher = (name: string, cost: number, description: string) => {
    if (!currentRoom) return;

    const newTemplate: CustomVoucherTemplate = {
      name,
      cost,
      description
    };

    const updatedRoom = {
      ...currentRoom,
      customVouchers: [...(currentRoom.customVouchers || []), newTemplate],
      notifications: [
        {
          id: 'n_' + Math.random().toString(),
          message: `Custom reward coupon pinned: "${name}" (${cost} pts)`,
          timestamp: Date.now(),
          type: 'info' as const
        },
        ...currentRoom.notifications
      ]
    };

    syncState({ ...rooms, [currentRoomCode]: updatedRoom });
  };

  const updateFirebaseSettings = (config: FirebaseConfig | null) => {
    saveFirebaseConfig(config);
    setSavedConfig(config);
    
    if (config) {
      const db = initFirebase();
      if (db) {
        setIsFirebaseActive(true);
        if (currentRoom) {
          firebaseService.writeRoomState(currentRoomCode, currentRoom as unknown as Record<string, unknown>);
        }
      } else {
        setIsFirebaseActive(false);
      }
    } else {
      setIsFirebaseActive(false);
    }
  };

  return (
    <RoomContext.Provider value={{
      currentRoom,
      activeMemberId,
      roomsList,
      isFirebaseActive,
      savedConfig,
      createRoom,
      joinRoom,
      switchRoom,
      deleteRoom,
      setActiveMember,
      addMember,
      deleteMember,
      addChore,
      deleteChore,
      assignChore,
      spinAssignChore,
      completeChore,
      undoChoreCompletion,
      resetWeek,
      requestTrade,
      respondToTrade,
      purchaseVoucher,
      redeemVoucher,
      addCustomVoucher,
      updateFirebaseSettings
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
