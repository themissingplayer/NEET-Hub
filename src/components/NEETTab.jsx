import { useState, useEffect } from 'react';
import { NEET_TOPICS, SUBJECTS, SUBJECT_COLORS } from '../constants';
import { save, load } from '../storage';

export default function NEETTab() {
  const [data, setData] = useState({});
  const [notes, setNotes] = useState({});
  const [activeSubj, setActiveSubj] = useState('Physics');
  const [showNoteFor, setShowNoteFor] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setData(load('neet_data', {}));
    setNotes(load('neet_notes', {}));
  }, []);

  const toggle = (subj, topic, field) => {
    const key = `${subj}::${topic}`;
    const cur = data[key] || {};
    const updated = { ...data, [key]: { ...cur, [field]: !cur[field] } };
    setData(updated);
    save('neet_data', updated);
  };

  const subjectProgress = (subj) => {
    const topics = NEET_TOPICS[subj];
    const done = topics.filter(t => data[`${subj}::${t}`]?.done).length;
    return { pct: Math.round((done / topics.length) * 100), done, total: topics.length };
  };

  const totalProgress = () => {
    let done = 0, total = 0;
    SUBJECTS.forEach(s => { const p = subjectProgress(s); done += p.done; total += p.total; });
    return Math.round((done / total) * 100);
  };

  const topics = NEET_TOPICS[activeSubj].filter(t =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#888' }}>Overall NEET Coverage</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{totalProgress()}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
          <div style={{ width: `${totalProgress()}%`, height: '100%', background: 'linear-gradient(90deg, #60a5fa, #34d399, #f472b6)', borderRadius: 99, transition: 'width .5s' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {SUBJECTS.map(s => {
          const p = subjectProgress(s);
          return (
            <div key={s} onClick={() => setActiveSubj(s)} style={{
              background: activeSubj === s ? `${SUBJECT_COLORS[s]}18` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeSubj === s ? SUBJECT_COLORS[s] : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 14, padding: '14px 12px', cursor: 'pointer', transition: 'all .2s'
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: SUBJECT_COLORS[s] }}>{s}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 4 }}>{p.pct}%</div>
              <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                <div style={{ width: `${p.pct}%`, height: '100%', background: SUBJECT_COLORS[s], borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 10, color: '#888', marginTop: 5 }}>{p.done}/{p.total} topics</div>
            </div>
          );
        })}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search topics..."
        style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: '#ddd', fontSize: 13 }} />

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ color: SUBJECT_COLORS[activeSubj], margin: '0 0 14px', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
          {activeSubj} — {topics.length} Topics
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {topics.map(topic => {
            const key = `${activeSubj}::${topic}`;
            const s = data[key] || {};
            return (
              <div key={topic}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                  background: s.done ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)',
                  borderRadius: 10, border: `1px solid ${s.done ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)'}`
                }}>
                  <input type="checkbox" checked={!!s.done} onChange={() => toggle(activeSubj, topic, 'done')}
                    style={{ accentColor: SUBJECT_COLORS[activeSubj], width: 15, height: 15, cursor: 'pointer', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: s.done ? '#888' : '#ddd', textDecoration: s.done ? 'line-through' : 'none' }}>{topic}</span>
                  <button onClick={() => toggle(activeSubj, topic, 'revised')} style={{
                    background: s.revised ? 'rgba(251,191,36,0.15)' : 'transparent',
                    border: `1px solid ${s.revised ? '#fbbf24' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 6, padding: '3px 7px', color: s.revised ? '#fbbf24' : '#555', fontSize: 10
                  }}>↺ Rev</button>
                  <button onClick={() => toggle(activeSubj, topic, 'weak')} style={{
                    background: s.weak ? 'rgba(239,68,68,0.1)' : 'transparent',
                    border: `1px solid ${s.weak ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 6, padding: '3px 7px', color: s.weak ? '#ef4444' : '#555', fontSize: 10
                  }}>⚠</button>
                  <button onClick={() => setShowNoteFor(showNoteFor === key ? null : key)} style={{
                    background: notes[key] ? 'rgba(167,139,250,0.1)' : 'transparent',
                    border: `1px solid ${notes[key] ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 6, padding: '3px 7px', color: notes[key] ? '#a78bfa' : '#555', fontSize: 10
                  }}>📝</button>
                </div>
                {showNoteFor === key && (
                  <div style={{ padding: '8px 4px 0' }}>
                    <textarea value={notes[key] || ''} onChange={e => {
                      const n = { ...notes, [key]: e.target.value };
                      setNotes(n); save('neet_notes', n);
                    }} rows={2} placeholder="Key formulas, mnemonics, weak points, PYQs..."
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, padding: '8px 10px', color: '#ddd', fontSize: 12, resize: 'vertical' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {Object.entries(data).some(([,v]) => v.weak) && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginBottom: 10 }}>⚠ Weak Topics — Prioritise These</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {Object.entries(data).filter(([,v]) => v.weak).map(([k]) => {
              const [subj, top] = k.split('::');
              return (
                <span key={k} style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '4px 10px', borderRadius: 20, fontSize: 11 }}>
                  {subj}: {top}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
