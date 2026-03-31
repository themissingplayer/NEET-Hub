import { useState, useEffect } from 'react';
import { SUBJECTS, SUBJECT_COLORS, NEET_TOPICS, SCIENCE_TIPS } from '../constants';
import { load, today } from '../storage';

const NEET_DATE = new Date('2025-05-04');

export default function Dashboard({ pomodoroSessions, setTab }) {
  const [neetData, setNeetData] = useState({});
  const [habits, setHabits] = useState({});
  const [entry, setEntry] = useState({});
  const [tipIdx] = useState(() => Math.floor(Math.random() * SCIENCE_TIPS.length));

  useEffect(() => {
    setNeetData(load('neet_data', {}));
    setHabits(load(`habits_${today()}`, {}));
    setEntry(load(`journal_${today()}`, {}));
  }, []);

  const daysLeft = Math.ceil((NEET_DATE - new Date()) / (1000 * 60 * 60 * 24));
  const habitScore = Object.values(habits).filter(Boolean).length;

  const subjectProgress = (subj) => {
    const topics = NEET_TOPICS[subj];
    const done = topics.filter(t => neetData[`${subj}::${t}`]?.done).length;
    return Math.round((done / topics.length) * 100);
  };

  const totalTopics = SUBJECTS.reduce((sum, s) => sum + NEET_TOPICS[s].length, 0);
  const doneTopic = SUBJECTS.reduce((sum, s) =>
    sum + NEET_TOPICS[s].filter(t => neetData[`${s}::${t}`]?.done).length, 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning ☀️';
    if (h < 17) return 'Good Afternoon 🌤';
    if (h < 20) return 'Good Evening 🌆';
    return 'Good Night 🌙';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{greeting()}</div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.18) 0%, rgba(239,68,68,0.1) 100%)',
        border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16, padding: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 11, color: '#f97316', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>NEET 2025 Countdown</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: "'Space Mono', monospace" }}>
            {daysLeft > 0 ? daysLeft : '🎯'}
          </div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>{daysLeft > 0 ? 'days remaining' : 'NEET Day!'}</div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: '#888' }}>Today's Pomodoros</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f97316', lineHeight: 1.1 }}>{pomodoroSessions}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#888' }}>Habits Done</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#34d399', lineHeight: 1.1 }}>{habitScore}/8</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Overall Syllabus Covered</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{doneTopic}/{totalTopics} topics</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
          <div style={{ width: `${Math.round((doneTopic/totalTopics)*100)}%`, height: '100%', background: 'linear-gradient(90deg,#60a5fa,#34d399,#f472b6)', borderRadius: 99, transition: 'width .5s' }} />
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ color: '#f7bc64', margin: '0 0 14px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Subject Coverage</h3>
        {SUBJECTS.map(s => {
          const pct = subjectProgress(s);
          return (
            <div key={s} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#ccc', marginBottom: 5 }}>
                <span>{s}</span>
                <span style={{ color: SUBJECT_COLORS[s], fontWeight: 600 }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: SUBJECT_COLORS[s], borderRadius: 99, transition: 'width .5s' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 11, color: '#60a5fa', letterSpacing: .5, textTransform: 'uppercase', marginBottom: 6 }}>🔬 Science-Backed Tip</div>
        <div style={{ fontSize: 13, color: '#ddd', lineHeight: 1.7 }}>{SCIENCE_TIPS[tipIdx]}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['⏱ Start Focus', '#f97316', 'pomodoro'],
          ['📚 Track Topics', '#34d399', 'neet'],
          ['📓 Write Journal', '#a78bfa', 'journal'],
          ['✅ Daily Habits', '#f7bc64', 'routine'],
        ].map(([label, color, tabId]) => (
          <button key={tabId} onClick={() => setTab(tabId)} style={{
            padding: '14px 12px', borderRadius: 12, background: `${color}12`,
            border: `1px solid ${color}30`, color, fontSize: 13, fontWeight: 600,
            textAlign: 'center', transition: 'all .2s', cursor: 'pointer'
          }}>{label}</button>
        ))}
      </div>
    </div>
  );
}
