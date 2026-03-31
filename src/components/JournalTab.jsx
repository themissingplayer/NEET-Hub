import { useState, useEffect } from 'react';
import { MOODS, ENERGY } from '../constants';
import { save, load, listKeys, today } from '../storage';

const PROMPTS = [
  { key: 'gratitude', label: '🙏 3 Things I\'m Grateful For', placeholder: '1. \n2. \n3. ', rows: 3 },
  { key: 'learning', label: '📚 What Did I Learn Today (NEET)?', placeholder: 'Key concepts, formulas, breakthroughs...', rows: 2 },
  { key: 'improve', label: '🔧 What Can I Do Better Tomorrow?', placeholder: 'Study strategy, habits, schedule adjustments...', rows: 2 },
  { key: 'wins', label: '🏆 Today\'s Wins (Small or Big)', placeholder: 'Finished a chapter, solved a tough problem...', rows: 2 },
  { key: 'free', label: '💭 Brain Dump — Free Thoughts', placeholder: 'Anything on your mind — stress, dreams, questions, ideas...', rows: 3 },
];

export default function JournalTab() {
  const defaultEntry = { mood: 3, energy: 3, stress: 2, gratitude: '', learning: '', improve: '', wins: '', free: '' };
  const [entry, setEntry] = useState(defaultEntry);
  const [past, setPast] = useState([]);
  const [viewDate, setViewDate] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const e = load(`journal_${today()}`, defaultEntry);
    setEntry(e);
    const keys = listKeys('journal_');
    const entries = keys.map(k => ({ date: k.replace('journal_', ''), ...load(k, {}) }))
      .filter(e => e.date !== today())
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14);
    setPast(entries);
  }, []);

  useEffect(() => {
    const allText = Object.values(entry).filter(v => typeof v === 'string').join(' ');
    setWordCount(allText.trim().split(/\s+/).filter(Boolean).length);
  }, [entry]);

  const update = (key, val) => {
    const upd = { ...entry, [key]: val };
    setEntry(upd);
    save(`journal_${today()}`, upd);
  };

  const dateLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 18, border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <h3 style={{ color: '#f7bc64', margin: 0, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Today's Entry</h3>
            <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>{dateLabel}</div>
          </div>
          <span style={{ fontSize: 11, color: '#555', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: 6 }}>{wordCount} words</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            ['mood', 'Mood 😊', MOODS],
            ['energy', 'Energy ⚡', ENERGY],
            ['stress', 'Stress 🌡', ['😌','🙂','😐','😟','😰','🤯']],
          ].map(([key, label, icons]) => (
            <div key={key}>
              <div style={{ fontSize: 10, color: '#888', marginBottom: 6, letterSpacing: .5, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {icons.map((icon, i) => (
                  <button key={i} onClick={() => update(key, i)} style={{
                    width: 30, height: 30, borderRadius: 7, border: `2px solid ${entry[key] === i ? '#f7bc64' : 'rgba(255,255,255,0.07)'}`,
                    background: entry[key] === i ? 'rgba(247,188,100,0.15)' : 'rgba(255,255,255,0.02)',
                    fontSize: 15, cursor: 'pointer', transition: 'all .15s'
                  }}>{icon}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PROMPTS.map(({ key, label, placeholder, rows }) => (
            <div key={key}>
              <label style={{ fontSize: 11, color: '#888', letterSpacing: .5, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
              <textarea value={entry[key] || ''} onChange={e => update(key, e.target.value)}
                rows={rows} placeholder={placeholder} style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '10px 14px', color: '#ddd', fontSize: 13, resize: 'vertical',
                  lineHeight: 1.6, transition: 'border-color .2s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(247,188,100,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          ))}
        </div>
      </div>

      {past.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ color: '#888', margin: '0 0 12px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Recent Mood Trend</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
            {[...past.slice(0, 6).reverse(), { date: 'today', mood: entry.mood }].map((e, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', background: `rgba(247,188,100,${0.1 + (e.mood / 5) * 0.6})`,
                  borderRadius: '4px 4px 0 0', height: `${((e.mood ?? 3) / 5) * 50 + 10}px`,
                  border: e.date === 'today' ? '1px solid rgba(247,188,100,0.4)' : 'none', transition: 'height .4s'
                }} />
                <span style={{ fontSize: 8, color: '#555' }}>{e.date === 'today' ? 'Today' : e.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ color: '#888', margin: '0 0 12px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Past Entries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {past.map(p => (
              <div key={p.date} onClick={() => setViewDate(viewDate === p.date ? null : p.date)} style={{
                padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 13, color: '#ccc' }}>{new Date(p.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    {p.wins && <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>🏆 {p.wins.slice(0, 30)}...</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <span style={{ fontSize: 16 }}>{MOODS[p.mood ?? 3]}</span>
                    <span style={{ fontSize: 16 }}>{ENERGY[p.energy ?? 3]}</span>
                  </div>
                </div>
                {viewDate === p.date && (
                  <div style={{ marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {PROMPTS.filter(pr => p[pr.key]).map(pr => (
                      <div key={pr.key}>
                        <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', marginBottom: 2 }}>{pr.label}</div>
                        <div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{p[pr.key]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
