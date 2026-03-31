import { useState } from 'react';
import Dashboard from './components/Dashboard';
import PomodoroTab from './components/PomodoroTab';
import NEETTab from './components/NEETTab';
import RoutineTab from './components/RoutineTab';
import JournalTab from './components/JournalTab';

const TABS = [
  { id: 'dashboard', label: '🏠', full: 'Home' },
  { id: 'pomodoro', label: '⏱', full: 'Focus' },
  { id: 'neet', label: '📚', full: 'NEET' },
  { id: 'routine', label: '📅', full: 'Routine' },
  { id: 'journal', label: '📓', full: 'Journal' },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: '#0c0f1a', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: 'rgba(12,15,26,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.5, color: '#fff' }}>
              <span style={{ color: '#f97316' }}>NEET</span>Hub
            </span>
            <span style={{ fontSize: 10, color: '#555', marginLeft: 8, letterSpacing: .5, textTransform: 'uppercase' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {pomodoroSessions > 0 && (
              <span style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#f97316', fontWeight: 600 }}>
                🔥 {pomodoroSessions} sessions
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 680, margin: '0 auto', width: '100%', padding: '20px 16px 80px', overflowY: 'auto' }}>
        {tab === 'dashboard' && <Dashboard pomodoroSessions={pomodoroSessions} setTab={setTab} />}
        {tab === 'pomodoro' && <PomodoroTab onSessionComplete={setPomodoroSessions} />}
        {tab === 'neet' && <NEETTab />}
        {tab === 'routine' && <RoutineTab />}
        {tab === 'journal' && <JournalTab />}
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(12,15,26,0.97)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        display: 'flex', justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', width: '100%', maxWidth: 680 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '12px 0 10px', border: 'none', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', transition: 'all .2s'
            }}>
              <span style={{ fontSize: 20, filter: tab === t.id ? 'none' : 'grayscale(1) opacity(0.4)' }}>{t.label}</span>
              <span style={{ fontSize: 9, letterSpacing: .3, fontWeight: 600, color: tab === t.id ? '#f97316' : '#555', textTransform: 'uppercase' }}>
                {t.full}
              </span>
              {tab === t.id && (
                <div style={{ width: 16, height: 2, background: '#f97316', borderRadius: 99 }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
