import React from 'react';
import { useRoom } from '../context/RoomContext';
import { X, RefreshCw, Clipboard, ArrowLeftRight, Ticket, CheckSquare, Scale, Sparkles } from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const { currentRoom } = useRoom();

  if (!isOpen) return null;

  const members = currentRoom?.members || [];

  // Replicate fair weighting probability calculation
  const getFairWeightingProbabilities = () => {
    if (members.length === 0) return [];
    
    // 1. Equal probability
    const equalProb = 1 / members.length;
    
    // 2. Fair weighting probability
    const maxPoints = Math.max(...members.map(m => m.points), 50);
    const rawScores = members.map(m => (maxPoints - m.points) + 30);
    const scoreSum = rawScores.reduce((sum, s) => sum + s, 0);
    
    return members.map((m, idx) => {
      const fairProb = rawScores[idx] / scoreSum;
      return {
        id: m.id,
        name: m.name,
        color: m.color,
        avatar: m.avatar,
        points: m.points,
        equalProb: parseFloat((equalProb * 100).toFixed(1)),
        fairProb: parseFloat((fairProb * 100).toFixed(1))
      };
    });
  };

  const memberProbabilities = getFairWeightingProbabilities();

  return (
    <div className="modal-overlay flex items-center justify-center z-50">
      <div className="modal-content glass-card w-full max-w-lg p-6 relative animate-zoomIn max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button onClick={onClose} className="btn-close-sketch" title="Close">
          <X size={12} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <RefreshCw size={22} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-header text-indigo-950">ChoreWheel User Manual</h2>
            <p className="text-xs text-slate-500 font-header">Tactile sketchbook user guides & roommate rules</p>
          </div>
        </div>

        {/* Scrollable Manual Content */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 text-slate-700 text-xs leading-relaxed max-h-[60vh] notifications-container">
          
          {/* Section 1: Name-Spinning & Fair Weighting */}
          <div className="p-3.5 bg-slate-50 border border-slate-350 rounded-lg flex flex-col gap-2 relative">
            <div className="sticky-tape-header" style={{ width: '40px', height: '12px', left: '42%' }}></div>
            <h3 className="text-xs font-bold font-header text-indigo-950 flex items-center gap-1.5 mt-1">
              <RefreshCw size={13} className="text-indigo-600" />
              Name-Spinning & Physics Crayon Wheel
            </h3>
            <p>
              Select a pending task card in the checklist, then click <strong>"SPIN PENCIL FOR ROOMMATE!"</strong> to spin the physics-simulated colored crayon wheel. A sharp graphite yellow pencil tip will point to the roommate landing slice!
            </p>
            <div className="p-2 bg-amber-50/70 border border-amber-300 rounded font-header mt-1 text-[11px]">
              <span className="font-bold flex items-center gap-1 text-amber-900">
                <Scale size={12} /> Fair Weighting Algorithm:
              </span>
              To guarantee household fairness, active rules increase slice widths for flatmates with fewer points. The more chores you do and points you earn, the smaller your slice becomes, giving others a higher chance to land the next task!
            </div>
            
            {/* Roommate probabilities sub-section with custom scrollbar */}
            <div className="mt-2 border border-slate-300 rounded bg-white p-2">
              <h4 className="text-[10px] font-bold font-header text-slate-400 uppercase tracking-wide mb-1.5">
                Roommate Landing Probabilities
              </h4>
              
              {memberProbabilities.length === 0 ? (
                <div className="py-3 text-center text-slate-400 italic text-[10px]">
                  No roommates added yet. Landing probabilities will display once flatmates join!
                </div>
              ) : (
                <div className="manual-spinning-scrollable">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-400">
                        <th className="pb-1 font-bold">Roommate</th>
                        <th className="pb-1 font-bold text-center">Tidy Points</th>
                        <th className="pb-1 font-bold text-center">Equal Prob.</th>
                        <th className="pb-1 font-bold text-center text-indigo-900">Fair Weight %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberProbabilities.map(mp => (
                        <tr key={mp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="py-1.5 font-bold flex items-center gap-1.5" style={{ color: mp.color }}>
                            <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[8px] font-bold">{mp.avatar}</span>
                            <span>{mp.name}</span>
                          </td>
                          <td className="py-1.5 text-center font-bold text-slate-600">{mp.points} pts</td>
                          <td className="py-1.5 text-center text-slate-400">{mp.equalProb}%</td>
                          <td className="py-1.5 text-center font-bold text-indigo-700 bg-indigo-50/40">{mp.fairProb}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Chore checklist */}
          <div className="p-3.5 bg-slate-50 border border-slate-350 rounded-lg flex flex-col gap-2 relative">
            <div className="sticky-tape-header" style={{ width: '40px', height: '12px', left: '42%' }}></div>
            <h3 className="text-xs font-bold font-header text-indigo-950 flex items-center gap-1.5 mt-1">
              <Clipboard size={13} className="text-indigo-600" />
              Notepad Chores Checklist
            </h3>
            <p>
              Use the index-card chores catalog to track household tasks. Tap **"Add Task"** to open a new hand-written task card. You can assign tasks manually using the roommate picker dropdown, spin for them, complete them with a checklist scribble, or erase them.
            </p>
          </div>

          {/* Section 3: Task Swap Center */}
          <div className="p-3.5 bg-slate-50 border border-slate-350 rounded-lg flex flex-col gap-2 relative">
            <div className="sticky-tape-header" style={{ width: '40px', height: '12px', left: '42%' }}></div>
            <h3 className="text-xs font-bold font-header text-indigo-950 flex items-center gap-1.5 mt-1">
              <ArrowLeftRight size={13} className="text-indigo-600" />
              Task Swap & Propose Trades
            </h3>
            <p>
              Stuck with master bathroom scrubbing? Pin a swap proposal in the Swap Center! Select your pending task, choose a roommate, select one of their pending tasks, and propose a trade. Swaps execute instantly once accepted by your roommate!
            </p>
          </div>

          {/* Section 4: Coupon Store */}
          <div className="p-3.5 bg-slate-50 border border-slate-350 rounded-lg flex flex-col gap-2 relative">
            <div className="sticky-tape-header" style={{ width: '40px', height: '12px', left: '42%' }}></div>
            <h3 className="text-xs font-bold font-header text-indigo-950 flex items-center gap-1.5 mt-1">
              <Ticket size={13} className="text-indigo-600" />
              Tear-out Coupon Store
            </h3>
            <p>
              Tidy points earned from completed chores can be spent in the perforated Ticket Coupon Store! Spend points to **"Tear"** a privilege voucher (e.g. Dishwashing Shield, DJ Music Choice). Ripped active coupons will appear in your booklet, ready to be redeemed with a synthetic rip effect!
            </p>
          </div>

          {/* Section 5: Log history ledger & Undo */}
          <div className="p-3.5 bg-slate-50 border border-slate-350 rounded-lg flex flex-col gap-2 relative">
            <div className="sticky-tape-header" style={{ width: '40px', height: '12px', left: '42%' }}></div>
            <h3 className="text-xs font-bold font-header text-indigo-950 flex items-center gap-1.5 mt-1">
              <CheckSquare size={13} className="text-indigo-600" />
              Handwritten Ledger & Pink rubber Eraser
            </h3>
            <p>
              Every chore completed is recorded in the handwritten audit ledger. Roommates earn active completion tidy streaks, highlighting their name in glowing yellow marker. Made a mistake? Click the **Pink Rubber Eraser** next to any log entry to undo the completion and recalculate points instantly!
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-300 text-center text-[10px] text-slate-500 flex justify-center items-center gap-1 bg-white shrink-0">
          <Sparkles size={11} className="text-amber-500 animate-pulse" />
          <span>Gamified Cozy Flatmates Rotation System v2.0</span>
        </div>
      </div>
    </div>
  );
};
