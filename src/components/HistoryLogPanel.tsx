import React, { useRef, useState } from 'react';
import { useRoom } from '../context/RoomContext';
import { Eraser, Clock, CheckSquare } from 'lucide-react';

export const HistoryLogPanel: React.FC = () => {
  const { currentRoom, undoChoreCompletion, resetWeek } = useRoom();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const logs = currentRoom?.historyLogs || [];

  // Synthesize friction noise of a rubber eraser
  const playEraserSound = () => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      }

      const ctx = audioContextRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Two quick back-and-forth eraser sweeps
      const playSweep = (delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Sawtooth wave provides a nice raspy friction buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now + delay);
        osc.frequency.exponentialRampToValueAtTime(55, now + delay + 0.12);

        // Bandpass sweeps create the rubbing "scuff" frequency profile
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(220, now + delay);
        filter.frequency.exponentialRampToValueAtTime(90, now + delay + 0.12);
        filter.Q.setValueAtTime(5, now + delay);

        // Smooth fade-in, fast decay
        gain.gain.setValueAtTime(0.0, now + delay);
        gain.gain.linearRampToValueAtTime(0.18, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.15);
      };

      // Rub left, rub right
      playSweep(0);
      playSweep(0.12);
    } catch (e) {
      console.log('Eraser Audio failed:', e);
    }
  };

  const handleUndo = (logId: string) => {
    playEraserSound();
    undoChoreCompletion(logId);
  };

  const handleResetWeek = () => {
    if (confirm('Are you sure you want to archive completed task counts for this week? Total points will be preserved.')) {
      playEraserSound();
      resetWeek();
    }
  };

  return (
    <div className="history-ledger-card card glass-card">
      <div className="card-header flex justify-between items-center pb-2">
        <div>
          <h2 className="text-xl font-bold font-header flex items-center gap-2">
            <CheckSquare size={18} className="text-indigo-400" />
            Handwritten Ledger
          </h2>
          <p className="text-xs text-slate-400">Weekly task history & log audits</p>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={soundEnabled ? 'Disable eraser chime' : 'Enable eraser chime'}
          >
            <Eraser size={13} className={soundEnabled ? 'text-rose-400' : 'text-slate-300'} />
          </button>
          
          {/* Archive Reset Week button */}
          {logs.length > 0 && (
            <button
              onClick={handleResetWeek}
              className="text-[9px] font-bold font-header border border-slate-700 bg-white px-2 py-0.5 rounded shadow shadow-slate-900/10 hover:bg-slate-50 transition-colors"
              title="Reset weekly task completed counts"
            >
              Reset Week
            </button>
          )}
        </div>
      </div>

      <div className="ledger-content flex flex-col gap-2 max-h-[220px] overflow-y-scroll pr-1 lined-paper p-3">
        {logs.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs italic">
            Ledger page is clean. No completions logged yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {logs.map((log) => (
              <div key={log.id} className="ledger-log-pill group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-[11px] font-bold font-header text-indigo-900 truncate">
                      {log.memberName}
                    </p>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0 flex items-center gap-0.5">
                      <Clock size={8} />
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-600 mt-0.5 font-medium">
                    Finished: <span className="scribble-done-text">{log.choreName}</span>
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[8px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-1 py-0.2 rounded font-semibold">
                      +{log.points} pts
                    </span>
                    {log.streakBonus > 0 && (
                      <span className="text-[8px] font-mono bg-amber-50 text-amber-700 border border-amber-100 px-1 py-0.2 rounded font-semibold">
                        +{log.streakBonus} streak bonus
                      </span>
                    )}
                  </div>
                </div>

                {/* Rubber Eraser button to Undo task completion */}
                <button
                  onClick={() => handleUndo(log.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 bg-rose-50 text-rose-500 rounded border border-rose-100 hover:bg-rose-200 hover:text-rose-700 transition-all shrink-0 ml-1.5 self-center"
                  title="Erase log (Undo completion)"
                >
                  <Eraser size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
