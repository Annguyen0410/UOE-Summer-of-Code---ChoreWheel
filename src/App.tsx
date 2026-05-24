import React, { useState, useEffect } from 'react';
import { RoomProvider, useRoom } from './context/RoomContext';
import type { Chore } from './context/RoomContext';
import { ChoreWheel } from './components/ChoreWheel';
import { ChoreList } from './components/ChoreList';
import { TradeModal } from './components/TradeModal';
import { PrivilegeStore } from './components/PrivilegeStore';
import { Leaderboard } from './components/Leaderboard';
import { HistoryLogPanel } from './components/HistoryLogPanel';
import { DevSettingsModal } from './components/DevSettingsModal';
import { UserManualModal } from './components/UserManualModal';
import { GuidebookBox } from './components/GuidebookBox';
import { OnboardingModal } from './components/OnboardingModal';
import { QuickStartGuide } from './components/QuickStartGuide';
import { 
  Home, 
  UserPlus, 
  Settings, 
  Bell, 
  ChevronRight, 
  Copy, 
  Download, 
  Info,
  X,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Shuffle,
  ShoppingBag,
  Eraser,
  Award,
  Clipboard,
  Trash2
} from 'lucide-react';
import './App.css';

// Sub-component for Live Notification Feed
const NotificationFeed: React.FC = () => {
  const { currentRoom } = useRoom();
  const notifications = currentRoom?.notifications || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Sparkles size={12} className="text-emerald-600 animate-pulse" />;
      case 'warn': return <AlertTriangle size={12} className="text-rose-600" />;
      case 'spin': return <RefreshCw size={12} className="text-blue-600" />;
      case 'trade': return <Shuffle size={12} className="text-orange-600" />;
      case 'store': return <ShoppingBag size={12} className="text-amber-600" />;
      case 'undo': return <Eraser size={12} className="text-slate-600" />;
      default: return <Bell size={12} className="text-indigo-600" />;
    }
  };

  return (
    <div className="notification-feed-card card glass-card">
      <div className="card-header">
        <h2 className="text-xl font-bold font-header flex items-center gap-2">
          <Bell size={18} className="text-indigo-400" />
          Live Room Activity
        </h2>
        <p className="text-xs text-slate-400">Real-time household activity feed</p>
      </div>

      <div className="notifications-container max-h-[220px] overflow-y-scroll pr-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs italic">
            No recent activity. Assign or complete chores to see logs!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map(n => (
              <div key={n.id} className={`notification-pill type-${n.type} animate-fadeIn`}>
                <span className="shrink-0 flex items-center justify-center p-1 bg-white border border-slate-200 rounded-full select-none">{getIcon(n.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium leading-relaxed text-slate-700">{n.message}</p>
                  <span className="text-[8px] text-slate-400 font-semibold block mt-0.5">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component Room Switcher Overlay
interface RoomSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}
const RoomSwitcher: React.FC<RoomSwitcherProps> = ({ isOpen, onClose }) => {
  const { roomsList, currentRoom, switchRoom, createRoom, joinRoom, deleteRoom } = useRoom();
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [activeTab, setActiveTab] = useState<'switch' | 'create' | 'join'>('switch');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    createRoom(newRoomName.trim());
    setNewRoomName('');
    onClose();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinRoomCode.trim()) return;
    const success = joinRoom(joinRoomCode.trim());
    if (success) {
      setJoinRoomCode('');
      onClose();
    } else {
      alert('Room code not found locally. If Cloud Sync is enabled, try checking credentials.');
    }
  };

  return (
    <div className="modal-overlay flex items-center justify-center z-50">
      <div className="modal-content room-modal-card glass-card relative animate-zoomIn">
        <button onClick={onClose} className="btn-close-sketch" title="Close">
          <X size={12} />
        </button>

        <h2 className="text-lg font-bold font-header mb-4 flex items-center gap-2">
          <Home size={18} className="text-indigo-400" />
          Households
        </h2>

        {/* Tab triggers */}
        <div className="room-tabs flex mb-4 text-xs font-semibold font-header">
          <button 
            onClick={() => setActiveTab('switch')}
            className={`room-tab ${activeTab === 'switch' ? 'active' : ''}`}
          >
            My Rooms
          </button>
          <button 
            onClick={() => setActiveTab('join')}
            className={`room-tab ${activeTab === 'join' ? 'active' : ''}`}
          >
            Join Room
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`room-tab ${activeTab === 'create' ? 'active' : ''}`}
          >
            Create Room
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'switch' && (
          <div className="room-switcher-scrollable flex flex-col gap-2">
            {roomsList.map(r => (
              <div 
                key={r.code} 
                className={`room-item-row ${
                  currentRoom?.roomCode === r.code ? 'active-room' : ''
                }`}
                onClick={() => {
                  switchRoom(r.code);
                  onClose();
                }}
              >
                <div className="room-item-info">
                  <h4 className="room-item-name">{r.name}</h4>
                  <p className="room-item-code">CODE: {r.code}</p>
                </div>
                
                <div className="room-item-actions">
                  <ChevronRight size={14} className="chevron-icon" />
                  {r.code !== 'HOMEY9' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this household? All room history will be cleared.')) {
                          deleteRoom(r.code);
                        }
                      }}
                      className="room-delete-btn"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'join' && (
          <form onSubmit={handleJoin} className="flex flex-col gap-3">
            <div className="form-group">
              <label className="form-label text-[10px]">Enter Shareable Room Code</label>
              <input
                type="text"
                required
                placeholder="e.g. ABCD12"
                value={joinRoomCode}
                onChange={e => setJoinRoomCode(e.target.value.toUpperCase())}
                className="form-input text-xs uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-header text-xs rounded-lg transition-all"
            >
              JOIN HOUSEHOLD
            </button>
          </form>
        )}

        {activeTab === 'create' && (
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <div className="form-group">
              <label className="form-label text-[10px]">Household Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Cozy Corner Flat"
                value={newRoomName}
                onChange={e => setNewRoomName(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-header text-xs rounded-lg transition-all"
            >
              CREATE HOUSEHOLD
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Sub-component Create Member Modal
interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ isOpen, onClose }) => {
  const { addMember } = useRoom();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1E3A8A');

  if (!isOpen) return null;

  const colors = [
    '#1E3A8A', // Deep Blue Pen Ink
    '#0F766E', // Teal Pen Ink
    '#B45309', // Amber Ink
    '#047857', // Emerald Ink
    '#B91C1C', // Margin Red Correction Ink
    '#701A75', // Purple Ink
    '#475569', // Slate Pencil graphite
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMember(name.trim(), selectedColor);
    setName('');
    onClose();
  };

  return (
    <div className="modal-overlay flex items-center justify-center z-50">
      <div className="modal-content member-creation-modal glass-card p-5 relative animate-zoomIn">
        <button onClick={onClose} className="btn-close-sketch" title="Close">
          <X size={12} />
        </button>

        <h2 className="text-lg font-bold font-header mb-4 flex items-center gap-1.5 text-indigo-950">
          <UserPlus size={18} className="text-indigo-600" />
          Add Roommate
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label text-[10px]">Roommate Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div className="form-group">
            <label className="form-label text-[10px]">Select Ink Profile Color</label>
            <div className="color-select-grid flex gap-2 flex-wrap">
              {colors.map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  className={`color-select-dot w-6 h-6 rounded-full border-2 transition-all ${selectedColor === col ? 'border-slate-800 scale-110 shadow' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-950 text-white font-bold font-header text-xs rounded-lg transition-all btn-sketch"
          >
            ADD ROOMMATE
          </button>
        </form>
      </div>
    </div>
  );
};

// Main App Dashboard Frame
const Dashboard: React.FC = () => {
  const { currentRoom, activeMemberId, setActiveMember, deleteMember } = useRoom();

  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDevSettingsOpen, setIsDevSettingsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showQuickStartGuide, setShowQuickStartGuide] = useState(false);

  // PWA Install properties
  const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    // Show onboarding on first visit
    const hasSeenOnboarding = localStorage.getItem('chorewheel_onboarding_seen');
    if (!hasSeenOnboarding && !currentRoom?.members?.length) {
      setIsOnboardingOpen(true);
      localStorage.setItem('chorewheel_onboarding_seen', 'true');
    }

    // Show quick start guide on first visit too
    const hasSeenQuickStart = localStorage.getItem('chorewheel_quickstart_seen');
    if (!hasSeenQuickStart) {
      setShowQuickStartGuide(true);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
      console.log('ChoreWheel PWA was installed successfully!');
    });
  }, [currentRoom?.members]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt as { prompt: () => void; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const handleSelectChore = (chore: Chore) => {
    setSelectedChore(chore);
  };

  const handleCopyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.roomCode);
    alert(`Room Code copied: ${currentRoom.roomCode}. Share this code with roommates to sync!`);
  };

  const members = currentRoom?.members || [];
  const chores = currentRoom?.chores || [];
  
  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
  const pendingChoresCount = chores.filter(c => c.status === 'Pending').length;
  
  const houseMvp = members.length > 0 
    ? [...members].sort((a, b) => b.points - a.points)[0]
    : null;

  return (
    <div className="app-page">
      {/* App Header Bar */}
      <header className="app-header">
        <div className="app-shell app-header-inner">
        <div className="app-header-start">
          <div className="brand-section">
            <h1 className="flex items-center gap-2 font-header font-extrabold tracking-tight">
              <RefreshCw size={22} className="text-indigo-600 animate-spin-slow" />
              ChoreWheel
            </h1>
          </div>
          
          {/* Room Selector Trigger */}
          {currentRoom && (
            <button 
              onClick={() => setIsRoomModalOpen(true)}
              className="room-selector-trigger"
            >
              <Home size={12} className="text-indigo-500" />
              <span>{currentRoom.roomName}</span>
              <ChevronRight size={12} className="rotate-90 text-slate-500" />
            </button>
          )}

          {/* Copyable code */}
          {currentRoom && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">Code:</span>
              <span 
                onClick={handleCopyCode} 
                className="room-code-tag flex items-center gap-1"
                title="Click to copy room code"
              >
                {currentRoom.roomCode}
                <Copy size={10} />
              </span>
            </div>
          )}
        </div>

        <div className="app-header-end">
          {/* Active Session Simulator Switcher */}
          {members.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-header text-slate-500 uppercase tracking-wide">
                Current User:
              </span>
              <select
                value={activeMemberId || ''}
                onChange={e => setActiveMember(e.target.value)}
                className="session-member-select"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id} style={{ color: m.color }}>
                    ({m.avatar}) {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add member button */}
          <button
            onClick={() => setIsMemberModalOpen(true)}
            className="p-2 rounded-full border border-slate-700 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Add Roommate"
          >
            <UserPlus size={16} />
          </button>

          {/* Delete active member button */}
          {activeMemberId && members.length > 1 && (
            <button
              onClick={() => {
                const activeMember = members.find(m => m.id === activeMemberId);
                if (!activeMember) return;
                if (confirm(`Remove ${activeMember.name} from the household? Their assigned chores will be unassigned.`)) {
                  deleteMember(activeMemberId);
                }
              }}
              className="p-2 rounded-full border border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
              title={`Remove ${members.find(m => m.id === activeMemberId)?.name ?? 'Roommate'}`}
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* User Manual button */}
          <button
            onClick={() => setIsManualOpen(true)}
            className="p-2 rounded-full border border-slate-700 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="User Manual & Guides"
          >
            <Info size={16} />
          </button>

          {/* Dev credentials button */}
          <button
            onClick={() => setIsDevSettingsOpen(true)}
            className="p-2 rounded-full border border-slate-700 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Developer Settings (Firebase Sync)"
          >
            <Settings size={16} />
          </button>
        </div>
        </div>
      </header>

      {/* PWA Install Banner */}
      {showInstallBtn && (
        <div className="pwa-install-banner">
          <div className="app-shell pwa-install-banner-inner">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <Download size={14} className="animate-bounce text-indigo-700" />
              <span>Install ChoreWheel to your desktop or home screen for offline access!</span>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold font-header text-[10px] px-3 py-1 rounded transition-colors cursor-pointer"
            >
              INSTALL APP
            </button>
          </div>
        </div>
      )}

      {/* Quick Start Guide */}
      <QuickStartGuide 
        isVisible={showQuickStartGuide}
        onDismiss={() => {
          setShowQuickStartGuide(false);
          localStorage.setItem('chorewheel_quickstart_seen', 'true');
        }}
      />

      {/* Spiral Bindings Coil divider loop down page */}
      <div className="spiral-coil-divider"></div>

      <div className="app-main">
        <div className="app-content-stage">
          {/* Taped Stats Scrap Banner Row */}
          {currentRoom && (
            <div className="stats-banner-row">
              <div className="stats-scrap-note" style={{ transform: 'rotate(-1.5deg)' }}>
                <span className="text-[10px] font-bold font-header text-slate-400 uppercase tracking-wider">House Tidy Score</span>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles size={11} className="text-amber-500" />
                  <span className="text-sm font-header font-bold text-slate-800">{totalPoints} pts</span>
                </div>
              </div>

              {houseMvp && (
                <div className="stats-scrap-note" style={{ transform: 'rotate(1deg)' }}>
                  <span className="text-[10px] font-bold font-header text-slate-400 uppercase tracking-wider">House MVP</span>
                  <div className="flex items-center gap-1 mt-1" style={{ color: houseMvp.color }}>
                    <Award size={11} />
                    <span className="text-sm font-header font-bold truncate max-w-[100px]">({houseMvp.avatar}) {houseMvp.name}</span>
                  </div>
                </div>
              )}

              <div className="stats-scrap-note" style={{ transform: 'rotate(-0.5deg)' }}>
                <span className="text-[10px] font-bold font-header text-slate-400 uppercase tracking-wider">Chore Backlog</span>
                <div className="flex items-center gap-1 mt-1">
                  <Clipboard size={11} className="text-indigo-500 animate-pulse" />
                  <span className="text-sm font-header font-bold text-slate-800">{pendingChoresCount} Tasks</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Columns */}
          <div className="dashboard-stage">
          <main className="dashboard-grid">
            <div className="dashboard-column dashboard-column--primary">
              <ChoreWheel 
                selectedChore={selectedChore} 
                onAssignmentComplete={() => setSelectedChore(null)}
              />
              <ChoreList 
                onSelectChore={handleSelectChore}
                selectedChoreId={selectedChore ? selectedChore.id : null}
              />
            </div>

            <div className="dashboard-column dashboard-column--center">
              <Leaderboard />
              <TradeModal />
              <GuidebookBox onOpenManual={() => setIsManualOpen(true)} />
            </div>

            <div className="dashboard-column dashboard-column--side">
              <PrivilegeStore />
              <HistoryLogPanel />
              <NotificationFeed />
            </div>
          </main>
          </div>
        </div>
      </div>

      {/* Info notice footer */}
      <footer className="app-footer">
        <div className="app-shell app-footer-inner">
          <button 
            onClick={() => setIsManualOpen(true)}
            className="btn-sketch btn-blue py-1.5 px-4 text-xs rounded-lg flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Open Room Guidebook & User Manual"
          >
            <Info size={13} />
            <span>📖 Open Room Guidebook & User Manual</span>
          </button>
          <p className="app-footer-note">
            UOE Summer of Code 2026 Innovation MVP. Try opening this app in two side-by-side tabs to experience real-time local sync!
          </p>
        </div>
      </footer>

      {/* Modals and Overlays */}
      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
      />

      <RoomSwitcher 
        isOpen={isRoomModalOpen} 
        onClose={() => setIsRoomModalOpen(false)} 
      />
      
      <CreateMemberModal 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)} 
      />

      <DevSettingsModal 
        isOpen={isDevSettingsOpen} 
        onClose={() => setIsDevSettingsOpen(false)} 
      />

      <UserManualModal 
        isOpen={isManualOpen} 
        onClose={() => setIsManualOpen(false)} 
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RoomProvider>
      <Dashboard />
    </RoomProvider>
  );
};
export default App;
