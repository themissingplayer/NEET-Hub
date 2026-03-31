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
              }}>{​​​​​​​​​​​​​​​​
