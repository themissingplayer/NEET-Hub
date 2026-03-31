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
      <div style={{ display: 'flex', gap: 8
