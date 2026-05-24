import React, { useState } from 'react';
import { useRoom } from '../context/RoomContext';
import { ArrowLeftRight, Check, X, ShieldAlert, Sparkles, Bell } from 'lucide-react';

export const TradeModal: React.FC = () => {
  const { currentRoom, activeMemberId, requestTrade, respondToTrade } = useRoom();
  const [selectedMyChoreId, setSelectedMyChoreId] = useState('');
  const [selectedRoommateId, setSelectedRoommateId] = useState('');
  const [selectedTheirChoreId, setSelectedTheirChoreId] = useState('');

  const members = currentRoom?.members || [];
  const chores = currentRoom?.chores || [];
  const trades = currentRoom?.trades || [];

  // Chores assigned to current active user
  const myAssignedChores = chores.filter(c => c.assignedTo === activeMemberId && c.status === 'Pending');

  // Selected roommate
  const selectedRoommate = members.find(m => m.id === selectedRoommateId);

  // Chores assigned to selected roommate
  const theirAssignedChores = chores.filter(
    c => c.assignedTo === selectedRoommateId && c.status === 'Pending'
  );

  // Pending trades requiring current user's approval
  const incomingTrades = trades.filter(
    t => t.toMemberId === activeMemberId && t.status === 'Pending'
  );

  // Pending trades sent by current user
  const outgoingTrades = trades.filter(
    t => t.fromMemberId === activeMemberId && t.status === 'Pending'
  );

  const handleProposeTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMyChoreId || !selectedRoommateId || !selectedTheirChoreId) return;

    requestTrade(selectedMyChoreId, selectedRoommateId, selectedTheirChoreId);

    // Reset selectors
    setSelectedMyChoreId('');
    setSelectedRoommateId('');
    setSelectedTheirChoreId('');
  };

  const getMemberName = (id: string) => {
    const m = members.find(mem => mem.id === id);
    return m ? `${m.avatar} ${m.name}` : 'Unknown';
  };

  const getChoreName = (id: string) => {
    const c = chores.find(ch => ch.id === id);
    return c ? c.name : 'Unknown';
  };

  return (
    <div className="trade-center-card card glass-card" style={{ transform: 'rotate(0.5deg)' }}>
      {/* Scotch Tape Graphic overlay */}
      <div className="sticky-tape-header" style={{ transform: 'rotate(1deg)', background: 'rgba(253, 253, 226, 0.45)' }}></div>

      <div className="card-header">
        <h2 className="text-xl font-bold font-header flex items-center gap-2 text-indigo-900">
          <ArrowLeftRight size={18} className="text-indigo-600" />
          Task Swap Center
        </h2>
        <p className="text-xs text-slate-500 font-header">Swap assigned chores with roommate ledger entries</p>
      </div>

      <div className="trade-center-content flex flex-col gap-4">
        {/* Active Session Warning */}
        {!activeMemberId && (
          <div className="p-2.5 bg-red-50 border-2 border-red-300 text-red-800 rounded-lg text-xs flex items-center gap-2 font-header font-bold">
            <ShieldAlert size={14} className="shrink-0 text-red-600" />
            Pencil a roommate in the switcher to initiate swaps.
          </div>
        )}

        {/* Incoming Swap Requests */}
        {activeMemberId && incomingTrades.length > 0 && (
          <div className="incoming-trades-section">
            <h3 className="text-xs font-bold font-header text-amber-700 mb-2 uppercase tracking-wide flex items-center gap-1.5">
              <Bell size={12} className="text-amber-600" />
              Incoming Swap Proposals ({incomingTrades.length})
            </h3>
            
            <div className="incoming-trades-scrollable max-h-[160px] overflow-y-scroll pr-1">
              <div className="flex flex-col gap-2">
                {incomingTrades.map(trade => (
                  <div key={trade.id} className="trade-offer-item glass-card p-3 flex flex-col justify-between gap-3 bg-amber-50 border border-amber-300">
                    <div className="trade-details text-xs font-header text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900">{getMemberName(trade.fromMemberId)}</span>
                      <span> requests to trade their </span>
                      <span className="font-bold text-indigo-800 bg-indigo-50 px-1 rounded">"{getChoreName(trade.fromChoreId)}"</span>
                      <span> for your </span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">"{getChoreName(trade.toChoreId)}"</span>
                    </div>
                    
                    <div className="trade-actions flex gap-2 w-full">
                      <button
                        onClick={() => respondToTrade(trade.id, true)}
                        className="flex-1 btn-sketch btn-green py-1.5 text-[11px] font-bold font-header cursor-pointer"
                      >
                        <Check size={11} /> Accept Swap
                      </button>
                      <button
                        onClick={() => respondToTrade(trade.id, false)}
                        className="btn-sketch btn-red py-1.5 px-3 text-[11px] font-bold font-header cursor-pointer"
                      >
                        <X size={11} /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trade Proposal Form */}
        {activeMemberId && (
          <form onSubmit={handleProposeTrade} className="propose-trade-form glass-card bg-slate-50 p-3" style={{ borderStyle: 'dashed' }}>
            <h3 className="text-xs font-bold font-header text-indigo-900 mb-3 flex items-center gap-1">
              <Sparkles size={11} className="text-indigo-600" /> Propose Swap Proposal
            </h3>

            {/* My Chore */}
            <div className="form-group mb-2.5">
              <label className="form-label text-[10px]">Pencil My Chore</label>
              {myAssignedChores.length === 0 ? (
                <div className="p-2 text-center text-slate-400 text-[10px] bg-white rounded border border-dashed border-slate-300 font-header italic">
                  No chores currently assigned to your ledger entry.
                </div>
              ) : (
                <select
                  required
                  value={selectedMyChoreId}
                  onChange={e => setSelectedMyChoreId(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="">-- Choose My Chore --</option>
                  {myAssignedChores.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.points} pts)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Roommate to trade with */}
            <div className="form-group mb-2.5">
              <label className="form-label text-[10px]">Pencil Roommate</label>
              <select
                required
                value={selectedRoommateId}
                onChange={e => {
                  setSelectedRoommateId(e.target.value);
                  setSelectedTheirChoreId('');
                }}
                disabled={myAssignedChores.length === 0}
                className="form-input text-xs"
              >
                <option value="">-- Choose Roommate --</option>
                {members
                  .filter(m => m.id !== activeMemberId)
                  .map(m => (
                    <option key={m.id} value={m.id} style={{ color: m.color }}>
                      ({m.avatar}) - {m.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Roommate's Chore */}
            <div className="form-group mb-3.5">
              <label className="form-label text-[10px]">Pencil Roommate's Chore</label>
              {!selectedRoommateId ? (
                <div className="p-2 text-center text-slate-400 text-[10px] bg-white rounded border border-dashed border-slate-300 font-header italic">
                  Select a roommate first.
                </div>
              ) : theirAssignedChores.length === 0 ? (
                <div className="p-2 text-center text-slate-400 text-[10px] bg-white rounded border border-dashed border-slate-300 font-header italic">
                  {selectedRoommate?.name} has no active assigned chores.
                </div>
              ) : (
                <select
                  required
                  value={selectedTheirChoreId}
                  onChange={e => setSelectedTheirChoreId(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="">-- Choose Their Chore --</option>
                  {theirAssignedChores.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.points} pts)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedMyChoreId || !selectedRoommateId || !selectedTheirChoreId}
              className={`w-full btn-sketch text-xs font-bold font-header cursor-pointer ${
                !selectedMyChoreId || !selectedRoommateId || !selectedTheirChoreId
                  ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-50 shadow-none'
                  : 'btn-blue'
              }`}
            >
              <ArrowLeftRight size={12} /> PROPOSE LEDGER SWAP
            </button>
          </form>
        )}

        {/* Outgoing Trades / Status */}
        {activeMemberId && outgoingTrades.length > 0 && (
          <div className="outgoing-trades-list">
            <h4 className="text-[10px] font-bold font-header text-slate-400 mb-1.5 uppercase tracking-wider">
              PENDING PROPOSALS ({outgoingTrades.length})
            </h4>
            <div className="outgoing-trades-scrollable max-h-[120px] overflow-y-scroll pr-1">
              <div className="flex flex-col gap-1.5">
                {outgoingTrades.map(trade => (
                  <div key={trade.id} className="p-2 bg-slate-50 border border-slate-300 rounded text-[10px] font-header flex justify-between items-center text-slate-700">
                    <div className="truncate">
                      Swapping <span className="font-bold">"{getChoreName(trade.fromChoreId)}"</span> for <span className="font-bold">{getMemberName(trade.toMemberId)}</span>'s <span className="font-bold">"{getChoreName(trade.toChoreId)}"</span>
                    </div>
                    <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-300 shrink-0 ml-2">
                      Proposed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
