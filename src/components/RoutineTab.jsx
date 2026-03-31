import { useState, useEffect } from 'react';
import { HABITS, TIME_SLOTS } from '../constants';
import { save, load, today } from '../storage';

export default function RoutineTab() {
  const [schedule, setSchedule] = useState({});
  const [habits, setHabits] = useState({});
  const [editSlot, setEditSlot] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setSchedule(load('routine_schedule', {}));
    setHabits(load(`habits_${today()}`, {}));
  }, []);

  const saveSlot = () => {
    const upd = { ...schedule, [editSlot]: editText };
    setSchedule(upd);
    save('routine_schedule', upd);
    setEditSlot(null); setEditText('');
  };

  const toggleHabit = (h) => {
    const upd = { ...habits, [h]: !habits[h] };
    setHabits(upd);
    save(`habits_${today()}`, upd);
  };

  const habitScore = Object.values(habits).filter(Boolean).length;
  const habitPct = Math.round((habitScore / HABITS.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 18, border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3 style={{ color: '#f7bc64', margin: 0, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Daily Habits</h3>
          <span style={{ fontSize: 13, color: '#34d399', fontWeight: 700 }}>{habitScore}/{HABITS.length}</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 14 }}>
          <div style={{ width: `${habitPct}%`, height: '100%', background: '#34d399', borderRadius: 99, transition: 'width .4s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {HABITS.map(h => (
            <div key={h} onClick={() => toggleHabit(h)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
              background: habits[h] ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${habits[h] ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 10, cursor: 'pointer', transition: 'all .15s', userSelect: 'none'
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, border: `2px solid ${habits[h] ? '#34d399' : 'rgba(255,255,255,0.2)'}`,
                background: habits[h] ? '#34d399' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s'
              }}>{habits[h] && <span style={{ fontSize: 10, color: '#0f1117', fontWeight: 800 }}>✓</span>}</div>
              <span style={{ fontSize: 11, color: habits[h] ? '#d1fae5' : '#888', lineHeight: 1.3 }}>{h}</span>
            </div>
          ))}
        </div>
        {habitScore === HABITS.length && (
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 14, color: '#34d399', fontWeight: 600 }}>
            🎉 Perfect day! All habits completed!
          </div>
        )}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 18, border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ color: '#f7bc64', margin: 0, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Daily Schedule</h3>
          <button onClick={() => { if (window.confirm('Clear all schedule slots?')) { setSchedule({}); save('routine_schedule', {}); } }} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 10px', color: '#666', fontSize: 11
          }}>Clear All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
          {TIME_SLOTS.map(slot => {
            const isNow = (() => {
              const h = new Date().getHours(), m = new Date().getMinutes();
              const [time, period] = slot.split(' ');
              const [sh, sm] = time.split(':').map(Number);
              let hour = sh; if (period === 'PM' && sh !== 12) hour += 12; if (period === 'AM' && sh === 12) hour = 0;
              return h === hour && m < 30;
            })();
            return (
              <div key={slot} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: isNow ? '#f97316' : '#555', minWidth: 58, fontFamily: "'Space Mono', monospace", fontWeight: isNow ? 700 : 400 }}>
                  {isNow ? '▶ ' : ''}{slot}
                </span>
                {editSlot === slot ? (
                  <>
                    <input autoFocus value={editText} onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveSlot(); if (e.key === 'Escape') setEditSlot(null); }}
                      style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(247,188,100,0.3)', borderRadius: 6, padding: '5px 8px', color: '#fff', fontSize: 12 }} />
                    <button onClick={saveSlot} style={{ background: '#f7bc64', border: 'none', borderRadius: 5, padding: '4px 8px', color: '#0f1117', fontSize: 11, fontWeight: 700 }}>✓</button>
                    <button onClick={() => setEditSlot(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '4px 8px', color: '#888', fontSize: 11 }}>✕</button>
                  </>
                ) : (
                  <div onClick={() => { setEditSlot(slot); setEditText(schedule[slot] || ''); }} style={{
                    flex: 1, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                    background: schedule[slot] ? (isNow ? 'rgba(249,115,22,0.12)' : 'rgba(96,165,250,0.07)') : 'rgba(255,255,255,0.01)',
                    border: `1px solid ${schedule[slot] ? (isNow ? 'rgba(249,115,22,0.3)' : 'rgba(96,165,250,0.15)') : 'rgba(255,255,255,0.04)'}`,
                    color: schedule[slot] ? '#ddd' : '#444', transition: 'all .15s'
                  }}>
                    {schedule[slot] || 'Tap to add task...'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
