import React from 'react';
import { useRoom } from '../context/RoomContext';
import { Trophy, Percent, Sparkles, CheckCircle2, Award, Zap } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { currentRoom } = useRoom();

  const members = currentRoom?.members || [];
  const chores = currentRoom?.chores || [];

  // Sort roommates by points descending
  const sortedMembers = [...members].sort((a, b) => b.points - a.points);

  // Stats calculation
  const totalChores = chores.length;
  const totalCompletedCount = members.reduce((sum, m) => sum + m.completedCount, 0);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return {
          title: 'Chore Emperor',
          bgColor: 'rgba(180, 83, 9, 0.08)',
          borderColor: 'rgba(180, 83, 9, 0.25)',
          textColor: '#B45309'
        };
      case 1:
        return {
          title: 'Tidy Apprentice',
          bgColor: 'rgba(71, 85, 105, 0.08)',
          borderColor: 'rgba(71, 85, 105, 0.25)',
          textColor: '#475569'
        };
      case 2:
        return {
          title: 'Dust Bunny',
          bgColor: 'rgba(120, 113, 108, 0.08)',
          borderColor: 'rgba(120, 113, 108, 0.25)',
          textColor: '#78716C'
        };
      default:
        return {
          title: 'Chore Recruit',
          bgColor: 'rgba(30, 58, 138, 0.05)',
          borderColor: 'rgba(30, 58, 138, 0.15)',
          textColor: '#1E3A8A'
        };
    }
  };

  const getStickyColorClass = (color: string, index: number) => {
    const col = color.toLowerCase();
    if (col.includes('pink') || col === '#ec4899') return 'sticky-pink';
    if (col.includes('blue') || col === '#3b82f6' || col === '#1e3a8a') return 'sticky-blue';
    if (col.includes('orange') || col.includes('amber') || col === '#f59e0b' || col === '#b45309') return 'sticky-orange';
    if (col.includes('green') || col.includes('emerald') || col.includes('teal') || col === '#10b981' || col === '#0f766e') return 'sticky-green';
    
    // Fallback cycle based on rank
    const colorClasses = ['', 'sticky-pink', 'sticky-blue', 'sticky-green', 'sticky-orange'];
    return colorClasses[index % colorClasses.length];
  };

  return (
    <div className="leaderboard-card card glass-card">
      <div className="card-header">
        <h2 className="text-xl font-bold font-header flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" />
          House Leaderboard
        </h2>
        <p className="text-xs text-slate-400">Weekly chore contributions standing</p>
      </div>

      <div className="leaderboard-content flex flex-col gap-4">
        {/* Weekly Progress Ring/Bar */}
        <div className="weekly-stats-box glass-card p-3 flex justify-between items-center bg-slate-50/50">
          <div>
            <h4 className="text-[11px] font-bold font-header text-slate-500 uppercase tracking-wide">
              Weekly Household Status
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Tasks completed since reset</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-header font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {totalCompletedCount} Done
              </span>
              <span className="text-[10px] text-slate-500">
                ({totalChores} pending in rotation)
              </span>
            </div>
          </div>

          <div className="circular-progress flex flex-col items-center gap-1 shrink-0 ml-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Circular track */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-slate-200"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-indigo-600"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * Math.min(totalCompletedCount * 8, 100)) / 100}
                />
              </svg>
              <div className="absolute text-[10px] font-bold text-indigo-900 font-header flex items-center">
                {Math.min(totalCompletedCount * 8, 100)}<Percent size={8} />
              </div>
            </div>
            <span className="text-[9px] font-header font-bold text-indigo-800">Efficiency</span>
          </div>
        </div>

        {/* Roommate Standings corkboard of Post-its */}
        {sortedMembers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs italic border border-dashed border-slate-300 rounded-lg">
            No roommates added yet. Add one in the top header.
          </div>
        ) : (
          <div className="standings-scrollable-container max-h-[300px] overflow-y-scroll pr-1">
            <div className="standings-list flex flex-col gap-5 pt-2">
              {sortedMembers.map((member, index) => {
                const badge = getRankBadge(index);
                const stickyColorClass = getStickyColorClass(member.color, index);
                // Slight rotational tilts for notebook sticker feels
                const rotation = ((index * 3) % 7 - 3) * 0.75;
                const hasActiveStreak = member.streakCount >= 2;

                return (
                  <div key={member.id} className="relative pt-3.5">
                    {/* Tape strip centered above sticky note */}
                    <div className="sticky-tape-header"></div>
                    
                    <div
                      className={`sticky-note ${stickyColorClass} p-3 flex items-center justify-between transition-all hover:scale-[1.01]`}
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {/* Monogram position tag */}
                        <div className="font-header font-extrabold text-sm text-slate-800 w-5 text-center shrink-0">
                          #{index + 1}
                        </div>

                        {/* Initials profile monogram stamp */}
                        <div 
                          className="standings-monogram shrink-0 select-none bg-white font-header font-extrabold"
                          style={{ color: member.color, borderColor: member.color }}
                        >
                          {member.avatar}
                        </div>

                        <div className="min-w-0">
                          <h4 className="standings-name font-header text-sm font-bold text-slate-800 truncate flex items-center gap-1">
                            {/* Highlighter marker yellow overlay behind name if they have active streak multiplier */}
                            <span 
                              style={{ 
                                background: hasActiveStreak ? 'var(--hl-yellow)' : 'transparent',
                                padding: hasActiveStreak ? '0px 4px' : '0px',
                                borderRadius: '3px'
                              }}
                            >
                              {member.name}
                            </span>
                            
                            {hasActiveStreak && (
                              <span 
                                className="text-[8px] font-mono bg-amber-100 text-amber-800 border border-amber-200 px-1 py-0.2 rounded font-semibold inline-flex items-center gap-0.5"
                                title="Streak multiplier activated!"
                              >
                                <Zap size={7} />
                                x1.2
                              </span>
                            )}
                          </h4>
                          
                          {/* Rank title badge */}
                          <span
                            className="text-[9px] font-bold font-header px-1.5 py-0.2 rounded border inline-flex items-center gap-0.5 mt-0.5 bg-white/70"
                            style={{
                              borderColor: badge.borderColor,
                              color: badge.textColor
                            }}
                          >
                            <Award size={9} />
                            {badge.title}
                          </span>
                        </div>
                      </div>

                      <div className="standings-stats flex items-center gap-3.5 text-right shrink-0">
                        <div className="completed-stats">
                          <div className="text-[10px] text-slate-600 font-bold flex items-center justify-end gap-0.5">
                            <CheckCircle2 size={10} className="text-slate-500" />
                            <span>{member.completedCount}</span>
                          </div>
                          <span className="text-[8px] text-slate-400 uppercase font-bold">Tasks</span>
                        </div>

                        <div className="points-stats">
                          <div className="text-xs font-bold font-header text-indigo-900 flex items-center justify-end gap-0.5">
                            <Sparkles size={10} className="text-indigo-600" />
                            <span>{member.points}</span>
                          </div>
                          <span className="text-[8px] text-slate-400 uppercase font-bold">Total Pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
