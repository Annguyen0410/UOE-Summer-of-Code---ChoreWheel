import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useRoom } from '../context/RoomContext';
import type { Member, Chore } from '../context/RoomContext';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, AlertCircle, Pen, Scale } from 'lucide-react';

interface ChoreWheelProps {
  selectedChore: Chore | null;
  onAssignmentComplete?: () => void;
}

const EMPTY_MEMBERS: Member[] = [];
const WHEEL_SIZE = 310;

function computeSliceWeights(members: Member[], fairWeighting: boolean): number[] {
  if (members.length === 0) return [];
  if (!fairWeighting) return members.map(() => 1 / members.length);

  const maxPoints = Math.max(...members.map(m => m.points), 50);
  const rawScores = members.map(m => (maxPoints - m.points) + 30);
  const scoreSum = rawScores.reduce((sum, s) => sum + s, 0);
  return rawScores.map(score => score / scoreSum);
}

export const ChoreWheel: React.FC<ChoreWheelProps> = ({ selectedChore, onAssignmentComplete }) => {
  const { currentRoom, spinAssignChore } = useRoom();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fairWeighting, setFairWeighting] = useState(true);
  const [winner, setWinner] = useState<Member | null>(null);
  const [lastAssignedPoints, setLastAssignedPoints] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTickSliceRef = useRef(-1);
  const isSpinningRef = useRef(false);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spinChoreRef = useRef<Chore | null>(null);
  const membersRef = useRef<Member[]>(EMPTY_MEMBERS);
  const fairWeightingRef = useRef(fairWeighting);
  const logicalSizeRef = useRef(WHEEL_SIZE);

  const members = currentRoom?.members || EMPTY_MEMBERS;
  membersRef.current = members;
  fairWeightingRef.current = fairWeighting;

  const weights = useMemo(
    () => computeSliceWeights(members, fairWeighting),
    [members, fairWeighting]
  );

  const playTickSound = useCallback(() => {
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
        void ctx.resume();
      }

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
    } catch {
      // Audio is optional — ignore failures.
    }
  }, [soundEnabled]);

  const playCompletionSound = useCallback(() => {
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
        void ctx.resume();
      }

      const now = ctx.currentTime;

      const playScribbleStroke = (startTime: number, duration: number) => {
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(3, startTime);
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

      playScribbleStroke(now, 0.15);
      playScribbleStroke(now + 0.2, 0.12);
      playScribbleStroke(now + 0.38, 0.22);

      const osc = ctx.createOscillator();
      const whistleGain = ctx.createGain();
      const whistleTime = now + 0.65;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, whistleTime);
      osc.frequency.exponentialRampToValueAtTime(880, whistleTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1318.51, whistleTime + 0.35);

      whistleGain.gain.setValueAtTime(0.0, whistleTime);
      whistleGain.gain.linearRampToValueAtTime(0.12, whistleTime + 0.05);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, whistleTime + 0.5);

      osc.connect(whistleGain);
      whistleGain.connect(ctx.destination);
      osc.start(whistleTime);
      osc.stop(whistleTime + 0.55);
    } catch {
      // Audio is optional — ignore failures.
    }
  }, [soundEnabled]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    const currentMembers = membersRef.current;
    const sliceWeights = computeSliceWeights(currentMembers, fairWeightingRef.current);
    if (!canvas || currentMembers.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = logicalSizeRef.current;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 15;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let startAngle = rotationRef.current;

    currentMembers.forEach((member, i) => {
      const sliceAngle = sliceWeights[i] * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = member.color + '25';
      ctx.fill();

      ctx.clip();

      ctx.strokeStyle = member.color + '45';
      ctx.lineWidth = 1.5;

      const step = 6;
      for (let j = -radius; j < radius; j += step) {
        ctx.beginPath();
        ctx.moveTo(centerX + j, centerY - radius);
        ctx.lineTo(centerX + j + radius, centerY + radius);
        ctx.stroke();
      }

      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(startAngle) * radius, centerY + Math.sin(startAngle) * radius);
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);

      const monogramX = radius - 30;
      const monogramY = 0;

      ctx.beginPath();
      ctx.arc(monogramX, monogramY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = member.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = member.color;
      ctx.font = 'bold 12px "Architects Daughter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(member.avatar, monogramX, monogramY + 1);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#2d3748';
      ctx.font = 'normal 13px "Architects Daughter", sans-serif';
      ctx.fillText(member.name, radius - 55, 0);

      if (fairWeightingRef.current && sliceWeights[i] > 1 / currentMembers.length) {
        ctx.font = '9px "Architects Daughter", sans-serif';
        ctx.fillStyle = '#b45309';
        ctx.fillText('*', radius - 105, 0);
      }

      ctx.restore();

      startAngle = endAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(45, 55, 72, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = '#2d3748';
    ctx.fill();

    ctx.fillStyle = '#faf7f0';
    ctx.font = 'bold 9px "Architects Daughter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY + 1);

    ctx.save();
    ctx.translate(centerX, centerY - radius + 10);

    ctx.beginPath();
    ctx.moveTo(-7, -24);
    ctx.lineTo(7, -24);
    ctx.lineTo(7, -8);
    ctx.lineTo(-7, -8);
    ctx.closePath();
    ctx.fillStyle = '#fde68a';
    ctx.fill();
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(7, -8);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fillStyle = '#fed7aa';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-2.5, -0.5);
    ctx.lineTo(2.5, -0.5);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fillStyle = '#2d3748';
    ctx.fill();

    ctx.restore();
  }, []);

  const stopAnimation = useCallback(() => {
    if (spinIntervalRef.current !== null) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
  }, []);

  const finishSpin = useCallback(() => {
    isSpinningRef.current = false;
    setIsSpinning(false);
    velocityRef.current = 0;
    stopAnimation();

    const currentMembers = membersRef.current;
    const sliceWeights = computeSliceWeights(currentMembers, fairWeightingRef.current);
    if (currentMembers.length === 0 || sliceWeights.length === 0) {
      drawWheel();
      return;
    }

    const pegPos = -Math.PI / 2;
    let relativeRotation = (pegPos - rotationRef.current) % (Math.PI * 2);
    if (relativeRotation < 0) relativeRotation += Math.PI * 2;

    let accumulatedAngle = 0;
    let winIndex = 0;

    for (let i = 0; i < sliceWeights.length; i++) {
      accumulatedAngle += sliceWeights[i] * Math.PI * 2;
      if (relativeRotation <= accumulatedAngle) {
        winIndex = i;
        break;
      }
    }

    const selectedWinner = currentMembers[winIndex];
    const chore = spinChoreRef.current;

    setWinner(selectedWinner);
    setLastAssignedPoints(chore?.points ?? 0);

    if (chore && selectedWinner) {
      spinAssignChore(chore.id, selectedWinner.id);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.65 },
        colors: [selectedWinner.color, '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
      });

      playCompletionSound();
    }

    spinChoreRef.current = null;
    onAssignmentComplete?.();
    drawWheel();
  }, [drawWheel, onAssignmentComplete, playCompletionSound, spinAssignChore, stopAnimation]);

  const startSpinAnimation = useCallback(() => {
    stopAnimation();

    const startRotation = rotationRef.current;
    const totalRotation = (3.5 + Math.random() * 2.5) * Math.PI * 2;
    const durationMs = 2800 + Math.random() * 1400;
    const startedAt = performance.now();

    spinIntervalRef.current = setInterval(() => {
      if (!isSpinningRef.current) {
        stopAnimation();
        return;
      }

      const progress = Math.min((performance.now() - startedAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      rotationRef.current = startRotation + totalRotation * eased;

      const sliceWeights = computeSliceWeights(membersRef.current, fairWeightingRef.current);
      const pegAngle = -Math.PI / 2;
      let relativePeg = (pegAngle - rotationRef.current) % (Math.PI * 2);
      if (relativePeg < 0) relativePeg += Math.PI * 2;

      let currentSliceIndex = 0;
      let acc = 0;
      for (let i = 0; i < sliceWeights.length; i++) {
        acc += sliceWeights[i] * Math.PI * 2;
        if (relativePeg <= acc) {
          currentSliceIndex = i;
          break;
        }
      }

      if (currentSliceIndex !== lastTickSliceRef.current) {
        playTickSound();
        lastTickSliceRef.current = currentSliceIndex;
      }

      drawWheel();

      if (progress >= 1) {
        stopAnimation();
        finishSpin();
      }
    }, 16);
  }, [drawWheel, finishSpin, playTickSound, stopAnimation]);

  const handleSpin = useCallback(() => {
    if (isSpinningRef.current || members.length === 0 || !selectedChore) return;

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
      void audioContextRef.current?.resume();
    }

    spinChoreRef.current = selectedChore;
    isSpinningRef.current = true;
    setIsSpinning(true);
    setWinner(null);
    lastTickSliceRef.current = -1;
    velocityRef.current = 0;

    startSpinAnimation();
  }, [members.length, selectedChore, startSpinAnimation]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentWidth = canvas.parentElement?.clientWidth ?? WHEEL_SIZE;
    const size = Math.min(WHEEL_SIZE, Math.max(220, parentWidth - 8));
    logicalSizeRef.current = size;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    if (!isSpinningRef.current) {
      drawWheel();
    }
  }, [drawWheel]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!isSpinningRef.current) {
      drawWheel();
    }
  }, [drawWheel, members, fairWeighting, weights]);

  useEffect(() => {
    return () => stopAnimation();
  }, [stopAnimation]);

  const canSpin = !isSpinning && !!selectedChore && members.length > 0;

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
            title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
            type="button"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>

      <div className="spinner-display-container">
        {selectedChore ? (
          <div className="active-chore-display">
            <span
              className="chore-tag-category"
              style={{
                background:
                  selectedChore.category === 'Kitchen' ? 'var(--hl-green)' :
                  selectedChore.category === 'Bathroom' ? 'var(--hl-blue)' :
                  selectedChore.category === 'Outdoor' ? 'var(--hl-orange)' :
                  selectedChore.category === 'Pets' ? 'var(--hl-pink)' :
                  'var(--hl-yellow)',
                color: 'var(--ink-graphite)'
              }}
            >
              {selectedChore.category}
            </span>
            <h3 className="active-chore-title font-header">{selectedChore.name}</h3>
            <p className="active-chore-points">Reward: <span className="points-accent">{selectedChore.points} pts</span></p>
          </div>
        ) : (
          <div className="active-chore-display empty-chore-display flex items-center justify-center gap-2 text-slate-400">
            <AlertCircle size={14} />
            <span className="text-xs font-header text-center">Tap a chore card below, then spin</span>
          </div>
        )}

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            className={`chore-canvas-wheel ${isSpinning ? 'is-spinning' : ''} ${canSpin ? 'can-spin' : ''}`}
            onClick={canSpin ? handleSpin : undefined}
            role="img"
            aria-label="Chore assignment wheel"
          />
          {canSpin && (
            <p className="wheel-tap-hint text-center text-[10px] text-slate-500 font-header mt-1">
              Click the wheel or button below to spin
            </p>
          )}
        </div>

        <div className="wheel-controls flex flex-col gap-3 mt-2 w-full">
          <button
            onClick={handleSpin}
            disabled={!canSpin}
            type="button"
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

          <div className="fair-weighting-row flex justify-between items-center px-2 py-1.5 bg-slate-50 rounded border border-slate-300">
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

          {members.length > 0 && (
            <div className="wheel-probability-panel mt-2 border border-slate-300 rounded bg-white p-2.5 flex flex-col gap-1 w-full text-left">
              <h4 className="text-[10px] font-bold font-header text-slate-400 uppercase tracking-wide mb-1 flex justify-between items-center">
                <span>Roster & Landing Chances</span>
                <span className="text-indigo-600 lowercase font-normal italic font-sans text-[9px]">(live probabilities)</span>
              </h4>

              <div className="wheel-members-scrollable">
                <table className="wheel-probability-table w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-400 font-sans">
                      <th className="pb-1 font-bold">Roommate</th>
                      <th className="pb-1 font-bold text-center">Points</th>
                      <th className="pb-1 font-bold text-center text-indigo-900">Live Chance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, idx) => {
                      const probPercent = parseFloat((weights[idx] * 100).toFixed(1));

                      return (
                        <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="py-1 font-bold font-header text-slate-800">
                            <div className="wheel-member-cell" style={{ color: m.color }}>
                              <span className="wheel-member-avatar">{m.avatar}</span>
                              <span className="truncate">{m.name}</span>
                            </div>
                          </td>
                          <td className="py-1 text-center font-bold text-slate-500 font-sans">{m.points} pts</td>
                          <td className="py-1 text-center font-bold text-indigo-700 bg-indigo-50 font-sans">{probPercent}%</td>
                        </tr>
                      );
                    })}
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
              <p className="winner-sub">Assigned to complete and earn {lastAssignedPoints} points!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
