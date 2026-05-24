import React, { useState } from 'react';
import { useRoom } from '../context/RoomContext';
import type { Chore } from '../context/RoomContext';
import { Trash2, UserPlus, Filter, Calendar, Award, CheckSquare, Clipboard, Pen, X } from 'lucide-react';

interface ChoreListProps {
  onSelectChore: (chore: Chore) => void;
  selectedChoreId: string | null;
}

export const ChoreList: React.FC<ChoreListProps> = ({ onSelectChore, selectedChoreId }) => {
  const { currentRoom, addChore, deleteChore, assignChore, completeChore } = useRoom();
  const [filter, setFilter] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);

  // New Chore form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(30);
  const [difficulty, setDifficulty] = useState<Chore['difficulty']>('Medium');
  const [category, setCategory] = useState<Chore['category']>('Kitchen');
  const [frequency, setFrequency] = useState<Chore['frequency']>('Weekly');

  const chores = currentRoom?.chores || [];
  const members = currentRoom?.members || [];

  const categories: Chore['category'][] = ['Kitchen', 'Bathroom', 'Common', 'Outdoor', 'Pets', 'Other'];

  const filteredChores = chores.filter(chore => {
    if (filter === 'All') return true;
    return chore.category === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addChore(name.trim(), description.trim(), points, difficulty, category, frequency);
    
    setName('');
    setDescription('');
    setPoints(30);
    setDifficulty('Medium');
    setCategory('Kitchen');
    setFrequency('Weekly');
    setIsAdding(false);
  };

  const getDifficultyBg = (diff: Chore['difficulty']) => {
    switch (diff) {
      case 'Easy': return 'var(--hl-green)';
      case 'Medium': return 'var(--hl-yellow)';
      case 'Hard': return 'var(--hl-pink)';
      default: return 'transparent';
    }
  };

  const getDifficultyColor = (diff: Chore['difficulty']) => {
    switch (diff) {
      case 'Easy': return '#047857';
      case 'Medium': return '#b45309';
      case 'Hard': return '#b91c1c';
      default: return '#374151';
    }
  };

  return (
    <div className="chores-manager-card card glass-card lined-paper">
      {/* Tape Strip graphic */}
      <div className="sticky-tape-header"></div>

      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header flex items-center gap-1.5 text-indigo-900">
            <Clipboard size={18} />
            Household Chores
          </h2>
          <p className="text-xs text-slate-500 font-header">Notepad checklist rotation ledger</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-sketch btn-blue py-1 px-2.5 text-xs rounded"
        >
          {isAdding ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {/* Add Chore inline notepad form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="add-chore-drawer glass-card mb-3 p-3 relative animate-fadeIn" style={{ background: '#fff' }}>
          <button 
            type="button" 
            onClick={() => setIsAdding(false)} 
            className="btn-close-sketch" 
            title="Close"
            style={{ top: '0.5rem', right: '0.5rem' }}
          >
            <X size={10} />
          </button>

          <h3 className="text-xs font-bold font-header text-indigo-900 mb-2 flex items-center gap-1">
            <Pen size={11} /> New Task Card
          </h3>
          
          <div className="form-group mb-2">
            <label className="form-label text-[10px]">Chore Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Wipe Master Bathroom Mirror"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div className="form-group mb-2">
            <label className="form-label text-[10px]">Steps Details</label>
            <textarea
              placeholder="e.g. Use microfiber cloth and streak-free spray..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-input text-xs h-12 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="form-group">
              <label className="form-label text-[10px]">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Chore['category'])}
                className="form-input text-[11px]"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label text-[10px]">Frequency</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as Chore['frequency'])}
                className="form-input text-[11px]"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="form-group">
              <label className="form-label text-[10px]">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Chore['difficulty'])}
                className="form-input text-[11px]"
              >
                <option value="Easy">Easy (Highlighter Green)</option>
                <option value="Medium">Medium (Highlighter Yellow)</option>
                <option value="Hard">Hard (Highlighter Pink)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label text-[10px]">Reward Points</label>
              <input
                type="number"
                min={5}
                max={500}
                required
                value={points}
                onChange={e => setPoints(parseInt(e.target.value) || 0)}
                className="form-input text-[11px] text-center"
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-sketch btn-green py-1.5 text-xs font-bold font-header">
            PIN TO LEDGER
          </button>
        </form>
      )}

      {/* Filter Tabs - sketchbook pills */}
      <div className="chore-filters-row flex items-center gap-1.5 pb-2 border-b border-slate-350 mb-3 overflow-x-auto">
        <Filter size={11} className="text-slate-500 shrink-0 ml-1" />
        <button
          onClick={() => setFilter('All')}
          className={`filter-tab-pill ${filter === 'All' ? 'active' : ''}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-tab-pill ${filter === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Chores Cards Grid */}
      <div className="chores-scrollable-container max-h-[340px] overflow-y-scroll pr-1">
        {filteredChores.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs font-header border border-dashed border-slate-400 rounded bg-white">
            No chore cards pinned. Add one above!
          </div>
        ) : (
          <div className="chores-grid flex flex-col gap-2.5">
            {filteredChores.map(chore => {
              const assignee = members.find(m => m.id === chore.assignedTo);
              const isSelected = selectedChoreId === chore.id;
              
              return (
                <div 
                  key={chore.id} 
                  className={`chore-card flex justify-between items-center transition-all cursor-pointer ${
                    isSelected ? 'selected-chore-outline' : ''
                  } border-cat-${chore.category.toLowerCase()}`}
                  style={{ borderLeftWidth: '3.5px' }}
                  onClick={() => onSelectChore(chore)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectChore(chore);
                    }
                  }}
                >
                  <div className="chore-card-left flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="chore-card-category" style={{
                        background: 
                          chore.category === 'Kitchen' ? 'var(--hl-green)' :
                          chore.category === 'Bathroom' ? 'var(--hl-blue)' :
                          chore.category === 'Outdoor' ? 'var(--hl-orange)' :
                          chore.category === 'Pets' ? 'var(--hl-pink)' :
                          'var(--hl-yellow)',
                        borderColor: 'transparent',
                        color: 'var(--ink-graphite)'
                      }}>
                        {chore.category}
                      </span>
                      <span className="chore-card-difficulty text-[10px] px-1.5 py-0.5 rounded font-header" style={{ 
                        background: getDifficultyBg(chore.difficulty),
                        color: getDifficultyColor(chore.difficulty)
                      }}>
                        {chore.difficulty}
                      </span>
                      <span className="chore-card-frequency text-[10px] text-slate-500 font-header flex items-center gap-0.5">
                        <Calendar size={9} />
                        {chore.frequency}
                      </span>
                    </div>

                    <h4 className="chore-card-name font-header text-[13px] text-slate-800">{chore.name}</h4>
                    {chore.description && (
                      <p className="chore-card-desc text-[10px] text-slate-500 mt-0.5 line-clamp-1">{chore.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="chore-card-points font-header text-xs text-indigo-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 flex items-center gap-0.5">
                        <Award size={10} />
                        {chore.points} pts
                      </span>

                      {assignee ? (
                        <div className="chore-card-assignee" style={{ color: assignee.color, borderColor: assignee.color + '45' }}>
                          {/* concentric monogram initial profile */}
                          <span className="text-[10px] font-bold font-header w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0">
                            {assignee.avatar}
                          </span>
                          <span className="text-[10px] font-header font-bold">{assignee.name}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-header font-bold italic">
                          Unassigned
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="chore-card-right flex items-center gap-1.5 ml-2 shrink-0">
                    {/* Load into pencil spinner */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectChore(chore);
                      }}
                      title="Load into pencil spinner"
                      className={`p-1.5 rounded bg-white border border-slate-400 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center ${
                        isSelected ? 'bg-slate-150 border-slate-600' : ''
                      }`}
                    >
                      <Pen size={11} />
                    </button>

                    {/* Quick penciler dropdown */}
                    <div className="assignee-dropdown-container" onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button"
                        className="p-1.5 rounded bg-white border border-slate-400 hover:bg-slate-50 text-slate-700 transition-colors flex items-center"
                        title="Pencil roommate"
                      >
                        <UserPlus size={12} />
                      </button>
                      <div className="assignee-dropdown-menu assignee-scroll-dropdown">
                        <div className="assignee-dropdown-header">Assign to:</div>
                        <button
                          onClick={() => assignChore(chore.id, null)}
                          className="assignee-dropdown-item erase-item"
                        >
                          Erase Assignee
                        </button>
                        {members.map(m => (
                          <button
                            key={m.id}
                            onClick={() => assignChore(chore.id, m.id)}
                            className="assignee-dropdown-item"
                            style={{ color: m.color }}
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[8px] font-bold shrink-0">{m.avatar}</span>
                            <span>{m.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick complete scribble checkbox */}
                    {chore.assignedTo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          completeChore(chore.id);
                        }}
                        title="Complete Task"
                        className="p-1.5 rounded bg-white border border-slate-400 hover:bg-slate-50 text-emerald-700 transition-all active:scale-90"
                      >
                        <CheckSquare size={12} />
                      </button>
                    )}

                    {/* Quick delete pen */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChore(chore.id);
                      }}
                      title="Erase Chore"
                      className="p-1.5 rounded bg-white border border-slate-400 hover:bg-slate-50 text-rose-700 transition-all chore-delete-btn"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
