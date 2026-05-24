import React from 'react';
import { Info, Sparkles, CheckSquare, RefreshCw, Scale } from 'lucide-react';

interface GuidebookBoxProps {
  onOpenManual: () => void;
}

export const GuidebookBox: React.FC<GuidebookBoxProps> = ({ onOpenManual }) => {
  return (
    <div className="guidebook-box-card card glass-card lined-paper" style={{ transform: 'rotate(0.5deg)' }}>
      {/* Tape Strip graphic */}
      <div className="sticky-tape-header" style={{ background: 'rgba(253, 253, 226, 0.75)' }}></div>

      <div className="card-header">
        <h2 className="text-xl font-bold font-header flex items-center gap-1.5 text-indigo-900">
          <Info size={18} className="text-indigo-600" />
          Household Guidebook
        </h2>
        <p className="text-xs text-slate-500 font-header">Quick start guidelines & rules</p>
      </div>

      <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-700">
        <div className="bg-amber-50/70 border border-amber-300 rounded p-2 text-[11px] font-header">
          <span className="font-bold flex items-center gap-1 text-amber-900">
            <Scale size={12} /> Fair Rotation Rule:
          </span>
          More chores done = fewer points needed = smaller slice on the wheel! This gives other flatmates a higher chance to land the next task.
        </div>

        <ul className="flex flex-col gap-2 font-header text-slate-800">
          <li className="flex items-start gap-1.5">
            <CheckSquare size={13} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>Select a pending task card from the Notepad Checklist.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <RefreshCw size={13} className="text-indigo-600 shrink-0 mt-0.5 animate-spin-slow" />
            <span>Spin the physics-based Crayon Wheel to choose a flatmate fairly.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <Sparkles size={13} className="text-amber-500 shrink-0 mt-0.5" />
            <span>Earn tidy points, streak markers, and buy coupons from the Store!</span>
          </li>
        </ul>

        <button
          onClick={onOpenManual}
          className="w-full btn-sketch btn-blue py-2 text-xs font-bold font-header rounded-lg flex items-center justify-center gap-2 mt-2 transition-all hover:scale-103 active:scale-97 cursor-pointer"
          title="Open Complete Room Guidebook"
        >
          <span>📖 Open Complete Room Guidebook</span>
        </button>
      </div>
    </div>
  );
};
