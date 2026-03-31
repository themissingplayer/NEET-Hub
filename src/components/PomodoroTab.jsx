import { useState, useEffect, useRef } from 'react';
import { POMODORO_MODES } from '../constants';
import { fmt, save, load, today } from '../storage';

export default function PomodoroTab({ onSessionComplete }) {
  const [modeIdx, setModeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(POMODORO_MODES[0].sec);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [customMin, setCustomMin] = useState('');
  const [subject, setSubject] = useState('Physics');
  const intervalRef = useRef(null);
  const mode = POMODORO_MODES[modeIdx];

  useEffect(() => {
    const s = load(`pomodoro_sessions_${today()}`, 0);
    setSessions(s);
  }, []);

  useEffect(() => {
    setTimeLeft(mode.sec);
    setRunning(false);
  }, [modeIdx]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain); gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
              osc.start(); osc.stop(ctx.currentTime + 1);
            } catch {}
            if (modeIdx === 0 || modeIdx === 3) {
              setSessions((s) => {
                const ns = s + 1;
                setCycleCount((c) => c + 1);
                save(`pomodoro_sessions_${today()}`, ns);
                onSessionComplete(ns);
                return ns;
              });
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running, modeIdx]);

  const pct = ((mode.sec - timeLeft) / mode.sec) * 100;
  const r = 90, circ = 2 * Math.PI * r;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ background: 'rgba(247,188,100,0.08)', border: '1px solid rgba(247,188,100,0.2)', borderRadius: 12, padding: '10px 18px', fontSize: 13, color: '#f7bc64', maxWidth: 520, textAlign: 'center' }}>
        🔬 <strong>Science:</strong> Pomodoro aligns with your brain's ultradian rhythm (~90-min focus cycles). 4 focus sessions = 1 complete cycle.
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {POMODORO_MODES.map((m, i) => (
          <button key={i} onClick={() => setModeIdx(i)} style={{
            padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13,
            background: modeIdx === i ? m.color : 'rgba(255,255,255,0.05)',
            color: modeIdx === i ? '#0f1117' : '#aaa', fontWeight: modeIdx === i ? 700 : 400, transition: 'all .2s'
          }}>{m.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Physics','Chemistry','Biology'].map(s => (
          <button key={s} onClick={() => setSubject(s)} style={{
            padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 12,
            background: subject === s ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: subject === s ? '#fff' : '#666', cursor: 'pointer', transition: 'all .2s'
          }}>{s}</button>
        ))}
      </div>
      <div style={{ position: 'relative', width: 220, height: 220 }}>
        <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle cx="110" cy="110" r={r} fill="none" stroke={mode.color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset .5s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 46, fontFamily: "'Space Mono', monospace", color: '#fff', letterSpacing: -2, fontWeight: 700 }}>
            {fmt(Math.floor(timeLeft / 60))}:{fmt(timeLeft % 60)}
          </span>
          <span style={{ fontSize: 11, color: mode.color, marginTop: 4 }}>{mode.label} · {subject}</span>
        </div>
      </div>
      <p style={{ color: '#888', fontSize: 13, margin: 0, textAlign: 'center' }}>{mode.desc}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setRunning(!running)} style={{
          padding: '12px 36px', borderRadius: 30, border: 'none',
          background: running ? '#ef4444' : mode.color, color: running ? '#fff' : '#0f1117',
          fontSize: 15, fontWeight: 700, letterSpacing: .5
        }}>{running ? '⏸ Pause' : '▶ Start'}</button>
        <button onClick={() => { setRunning(false); setTimeLeft(mode.sec); }} style={{
          padding: '12px 20px', borderRadius: 30, border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent', color: '#aaa'
        }}>↺ Reset</button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={customMin} onChange={e => setCustomMin(e.target.value)} placeholder="Custom min"
          type="number" min="1" max="120"
          style={{ width: 110, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 13 }} />
        <button onClick={() => { if (+customMin > 0) { setTimeLeft(+customMin * 60); setRunning(false); } }} style={{
          padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: '#ccc', fontSize: 13
        }}>Set</button>
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          ['Sessions Today', sessions],
          ['Pomodoro Cycle', `${cycleCount} / 4`],
          ['Focus Time', `${sessions * 25} min`],
        ].map(([l, v]) => (
          <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 20px', minWidth: 100 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: mode.color }}>{v}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 12, padding: '12px 16px', fontSize: 12, color: '#c4b5fd', maxWidth: 480, textAlign: 'center' }}>
        <strong>Cycle guide:</strong> Do 4 × Focus sessions → 1 Long Break → repeat. After 3 cycles (12 sessions), take a full rest hour.
      </div>
    </div>
  );
}
