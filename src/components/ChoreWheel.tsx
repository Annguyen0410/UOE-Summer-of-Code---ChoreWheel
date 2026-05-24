import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRoom } from '../context/RoomContext';
import type { Member, Chore } from '../context/RoomContext';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, AlertCircle, Pen, Scale } from 'lucide-react';

interface ChoreWheelProps {
  selectedChore: Chore | null;
  onAssignmentComplete?: () => void;
}

const EMPTY_MEMBERS: Member[] = [];

export const ChoreWheel: React.FC<ChoreWheelProps> = ({ selectedChore, onAssignmentComplete }) => {
  const { currentRoom, spinAssignChore } = useRoom();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fairWeighting, setFairWeighting] = useState(true);
  const [winner, setWinner] = useState<Member | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTickAngleRef = useRef(0);

  const members = currentRoom?.members || EMPTY_MEMBERS;

  // Web Audio Synthesized Pencil Knock (wooden tick click)
  const playTickSound = () => {
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

      // Synthesize a wood block/pencil-knock tick click sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const bandpass = ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02);
      
      bandpass.type = 'bandpass';
      bandpass.Q.setValueAtTime(12, ctx.currentTime);
      bandpass.frequency.setValueAtTime(1000, ctx.currentTime);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.025);
      
      osc.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      console.log('Tick Audio failed:', e);
    }
  };

  // Web Audio Synthesized Pencil/Pen Scribbling Write sequence + Whistle chime!
  const playCompletionSound = () => {
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

      // 1. Synthesize Pencil/Pen Scribbling (friction noise)
      // We simulate writing three short stroke swooshes
      const playScribbleStroke = (startTime: number, duration: number) => {
        // Noise source
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1; // White noise
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter to model pencil tip friction
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(3, startTime);
        // Modulate frequency to simulate cursive loops!
        filter.frequency.setValueAtTime(600, startTime);
        filter.frequency.linearRampToValueAtTime(1200, startTime + duration * 0.4);
        filter.frequency.linearRampToValueAtTime(500, startTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + duration * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(startTime);
        noise.stop(startTime + duration);
      };

      // Play three rapid scribbling loop strokes
      playScribbleStroke(now, 0.15);
      playScribbleStroke(now + 0.2, 0.12);
      playScribbleStroke(now + 0.38, 0.22);

      // 2. Bright ascending Whistle chime at the end!
      const osc = ctx.createOscillator();
      const whistleGain = ctx.createGain();
      const whistleTime = now + 0.65;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, whistleTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, whistleTime + 0.15); // A5
      osc.frequency.exponentialRampToValueAtTime(1318.51, whistleTime + 0.35); // E6

      whistleGain.gain.setValueAtTime(0.0, whistleTime);
      whistleGain.gain.linearRampToValueAtTime(0.12, whistleTime + 0.05);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, whistleTime + 0.5);

      osc.connect(whistleGain);
      whistleGain.connect(ctx.destination);
      osc.start(whistleTime);
      osc.stop(whistleTime + 0.55);

    } catch (e) {
      console.log('Fanfare Audio failed:', e);
    }
  };

  const getSliceWeights = (): number[] => {
    if (members.length === 0) return [];
    if (!fairWeighting) return members.map(() => 1 / members.length);

    const maxPoints = Math.max(...members.map(m => m.points), 50);
    const rawScores = members.map(m => (maxPoints - m.points) + 30);
    const scoreSum = rawScores.reduce((sum, s) => sum + s, 0);
    
    return rawScores.map(score => score / scoreSum);
  };

  const weights = getSliceWeights();

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || members.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 15;

    ctx.clearRect(0, 0, width, height);

    let startAngle = rotationRef.current;

    // Draw slices (Notebook Crayon / Colored Pencil sketch style)
    members.forEach((member, i) => {
      const sliceAngle = weights[i] * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      
      // Draw Slice background path
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Colored Pencil Sketch Wedge Texture (crayon style)
      // We achieve a warm sketched pencil look by combining a base filled color with white crayon speckles
      ctx.fillStyle = member.color + '25'; // light background tint
      ctx.fill();

      // Sketched cross-hatch strokes using clipping path!
      ctx.clip();

      ctx.strokeStyle = member.color + '45';
      ctx.lineWidth = 1.5;
      
      // Pencil Hatch lines matching slice rotation
      const step = 6;
      for (let j = -radius; j < radius; j += step) {
        ctx.beginPath();
        ctx.moveTo(centerX + j, centerY - radius);
        ctx.lineTo(centerX + j + radius, centerY + radius);
        ctx.stroke();
      }

      ctx.restore();

      // Slice dark sketch line separator borders
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(startAngle) * radius, centerY + Math.sin(startAngle) * radius);
      ctx.strokeStyle = '#2d3748'; // dark pencil ink outline
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render name initials inside circle monograms
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // 1. Draw monogram initials circle
      const monogramX = radius - 30;
      const monogramY = 0;
      
      ctx.beginPath();
      ctx.arc(monogramX, monogramY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = member.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Draw name monogram initials letter (emoji-free)
      ctx.fillStyle = member.color;
      ctx.font = 'bold 12px "Architects Daughter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(member.avatar, monogramX, monogramY + 1);

      // 3. Draw full member name on slice
      ctx.textAlign = 'right';
      ctx.fillStyle = '#2d3748';
      ctx.font = 'normal 13px "Architects Daughter", sans-serif';
      ctx.fillText(member.name, radius - 55, 0);

      // 4. Draw streak marker if active
      if (fairWeighting && weights[i] > 1 / members.length) {
        ctx.font = '9px "Architects Daughter", sans-serif';
        ctx.fillStyle = '#b45309';
        ctx.fillText('*', radius - 105, 0);
      }

      ctx.restore();

      startAngle = endAngle;
    });

    // Outer wheel border (Sketchy ink loops)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Secondary offset pencil rim loops to enhance sketchy texture
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(45, 55, 72, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Central hub (round ink blot center)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = '#2d3748';
    ctx.fill();
    
    ctx.fillStyle = '#faf7f0';
    ctx.font = 'bold 9px "Architects Daughter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY + 1);

    // Draw peg/ticker indicator at the top (styled as a sharp yellow graphite pencil tip!)
    ctx.save();
    ctx.translate(centerX, centerY - radius + 10);
    
    // Pencil body (yellow block)
    ctx.beginPath();
    ctx.moveTo(-7, -24);
    ctx.lineTo(7, -24);
    ctx.lineTo(7, -8);
    ctx.lineTo(-7, -8);
    ctx.closePath();
    ctx.fillStyle = '#fde68a'; // yellow pencil body
    ctx.fill();
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pencil shaved wood triangle tip
    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(7, -8);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fillStyle = '#fed7aa'; // light wood color
    ctx.fill();
    ctx.stroke();

    // Pencil graphite lead tip point
    ctx.beginPath();
    ctx.moveTo(-2.5, -0.5);
    ctx.lineTo(2.5, -0.5);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fillStyle = '#2d3748'; // dark graphite
    ctx.fill();

    ctx.restore();
  }, [members, weights, fairWeighting]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const animateWheel = () => {
    if (velocityRef.current < 0.001) {
      setIsSpinning(false);
      velocityRef.current = 0;
      
      // Determine landing indices
      const pegPos = -Math.PI / 2;
      let relativeRotation = (pegPos - rotationRef.current) % (Math.PI * 2);
      if (relativeRotation < 0) relativeRotation += Math.PI * 2;

      let accumulatedAngle = 0;
      let winIndex = 0;
      
      for (let i = 0; i < weights.length; i++) {
        accumulatedAngle += weights[i] * Math.PI * 2;
        if (relativeRotation <= accumulatedAngle) {
          winIndex = i;
          break;
        }
      }

      const selectedWinner = members[winIndex];
      setWinner(selectedWinner);

      if (selectedChore && selectedWinner) {
        spinAssignChore(selectedChore.id, selectedWinner.id);
        
        // Crayon Confetti explosion!
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.65 },
          colors: [selectedWinner.color, '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        });
        
        // Play premium synthesized pen scribble write fanfare sound
        playCompletionSound();
      }

      if (onAssignmentComplete) {
        onAssignmentComplete();
      }
      return;
    }

    velocityRef.current *= 0.983;
    rotationRef.current += velocityRef.current;

    // click ticker ticks
    const startAngle = rotationRef.current;
    const pegAngle = -Math.PI / 2;
    let relativePeg = (pegAngle - startAngle) % (Math.PI * 2);
    if (relativePeg < 0) relativePeg += Math.PI * 2;

    let currentSliceIndex = 0;
    let acc = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i] * Math.PI * 2;
      if (relativePeg <= acc) {
        currentSliceIndex = i;
        break;
      }
    }

    if (currentSliceIndex !== lastTickAngleRef.current) {
      playTickSound();
      lastTickAngleRef.current = currentSliceIndex;
    }

    drawWheel();
    requestAnimationFrame(animateWheel);
  };

  const handleSpin = () => {
    if (isSpinning || members.length === 0 || !selectedChore) return;

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    
    setIsSpinning(true);
    setWinner(null);
    velocityRef.current = 0.28 + Math.random() * 0.22;
    requestAnimationFrame(animateWheel);
  };

  return (
    <div className="chore-wheel-card card glass-card">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header flex items-center gap-2 text-indigo-900">
            <Pen size={18} className="text-indigo-600" />
            Chore Spinner
          </h2>
          <p className="text-xs text-slate-500">Hand-drawn physics randomized wheel</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-400 transition-colors"
            title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>

      <div className="spinner-display-container">
        {selectedChore ? (
          <div className="active-chore-display">
            <span className="chore-tag-category border-cat-kitchen" style={{
              background: 
                selectedChore.category === 'Kitchen' ? 'var(--hl-green)' :
                selectedChore.category === 'Bathroom' ? 'var(--hl-blue)' :
                selectedChore.category === 'Outdoor' ? 'var(--hl-orange)' :
                selectedChore.category === 'Pets' ? 'var(--hl-pink)' :
                'var(--hl-yellow)',
              color: 'var(--ink-graphite)'
            }}>
              {selectedChore.category}
            </span>
            <h3 className="active-chore-title font-header">{selectedChore.name}</h3>
            <p className="active-chore-points">Reward: <span className="points-accent">{selectedChore.points} pts</span></p>
          </div>
        ) : (
          <div className="active-chore-display empty-chore-display flex items-center justify-center gap-2 text-slate-400">
            <AlertCircle size={14} />
            <span className="text-xs font-header">Select a task card below to spin</span>
          </div>
        )}

        <div className="canvas-wrapper flex justify-center">
          <canvas 
            ref={canvasRef} 
            width={310} 
            height={310} 
            className={`chore-canvas-wheel ${isSpinning ? 'spinning' : ''}`}
          />
        </div>

        <div className="flex flex-col gap-3 mt-2 w-full">
          <button
            onClick={handleSpin}
            disabled={isSpinning || !selectedChore || members.length === 0}
            className={`btn-sketch text-center w-full py-2.5 rounded-lg font-bold font-header transition-all flex justify-center items-center gap-2 tracking-wide ${
              !selectedChore
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                : isSpinning
                ? 'bg-slate-200 text-slate-600 cursor-wait animate-pulse'
                : 'btn-blue'
            }`}
          >
            {isSpinning 
              ? 'SPINNING LEDGER...' 
              : members.length === 0 
              ? 'ADD ROOMMATES TO SPIN!' 
              : selectedChore 
              ? 'SPIN PENCIL FOR ROOMMATE!' 
              : 'SELECT CHORE FROM NOTEPAD'}
          </button>

          <div className="flex justify-between items-center px-2 py-1.5 bg-slate-50 rounded border border-slate-300">
            <span className="text-xs text-slate-600 flex items-center gap-1.5 font-header font-bold">
              <Scale size={13} className="text-slate-500" /> Fair Weighting rules
            </span>
            <label className="switch-toggle">
              <input 
                type="checkbox" 
                checked={fairWeighting} 
                onChange={(e) => setFairWeighting(e.target.checked)} 
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Roommate probabilities sub-section with custom scrollbar directly in the wheel section */}
          {members.length > 0 && (
            <div className="mt-2 border border-slate-300 rounded bg-white p-2.5 flex flex-col gap-1 w-full text-left">
              <h4 className="text-[10px] font-bold font-header text-slate-400 uppercase tracking-wide mb-1 flex justify-between items-center">
                <span>Roster & Landing Chances</span>
                <span className="text-indigo-600 lowercase font-normal italic font-sans text-[9px]">(live probabilities)</span>
              </h4>
              
              <div className="wheel-members-scrollable">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-400 font-sans">
                      <th className="pb-1 font-bold">Roommate</th>
                      <th className="pb-1 font-bold text-center">Points</th>
                      <th className="pb-1 font-bold text-center text-indigo-900">Live Chance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const maxPoints = Math.max(...members.map(m => m.points), 50);
                      const rawScores = members.map(m => (fairWeighting ? (maxPoints - m.points) + 30 : 1));
                      const scoreSum = rawScores.reduce((sum, s) => sum + s, 0);
                      
                      return members.map((m, idx) => {
                        const prob = rawScores[idx] / scoreSum;
                        const probPercent = parseFloat((prob * 100).toFixed(1));
                        
                        return (
                          <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                            <td className="py-1 font-bold flex items-center gap-1 font-header" style={{ color: m.color }}>
                              <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[8px] font-bold shrink-0">{m.avatar}</span>
                              <span className="truncate max-w-[80px]">{m.name}</span>
                            </td>
                            <td className="py-1 text-center font-bold text-slate-500 font-sans">{m.points} pts</td>
                            <td className="py-1 text-center font-bold text-indigo-700 bg-indigo-50/40 font-sans">{probPercent}%</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {winner && (
          <div className="winner-announcement-card" style={{ borderLeft: `5px solid ${winner.color}`, background: winner.color + '12' }}>
            <span className="winner-avatar-monogram" style={{ color: winner.color, borderColor: winner.color }}>
              {winner.avatar}
            </span>
            <div className="winner-info">
              <p className="winner-label font-header">ASSIGNED LEDGER ENTRY!</p>
              <h4 className="winner-name font-header" style={{ color: winner.color }}>{winner.name}</h4>
              <p className="winner-sub">Assigned to complete and earn {selectedChore?.points} points!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
