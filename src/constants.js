export const SUBJECTS = ['Physics', 'Chemistry', 'Biology'];

export const SUBJECT_COLORS = {
  Physics: '#60a5fa',
  Chemistry: '#34d399',
  Biology: '#f472b6',
};

export const MOODS = ['😴', '😟', '😐', '🙂', '😊', '🤩'];
export const ENERGY = ['💀', '😩', '😪', '🙂', '💪', '🔥'];

export const HABITS = [
  'Morning Walk 🌅',
  'Drink 3L Water 💧',
  'Meditation 🧘',
  'Sleep by 11PM 🌙',
  'No Phone after 10PM 📵',
  'Revision before bed 📖',
  'Exercise 20 min 🏃',
  'Healthy Breakfast 🥗',
];

export const NEET_TOPICS = {
  Physics: [
    'Kinematics', 'Laws of Motion', 'Work, Energy & Power',
    'Rotational Motion', 'Gravitation', 'Thermodynamics',
    'Electrostatics', 'Current Electricity', 'Magnetism',
    'Electromagnetic Induction', 'Optics', 'Modern Physics',
    'Waves & Sound', 'Fluid Mechanics',
  ],
  Chemistry: [
    'Atomic Structure', 'Chemical Bonding', 'Organic Chemistry Basics',
    'Hydrocarbons', 'Alcohols & Ethers', 'Carbonyl Compounds',
    'Biomolecules', 'Polymers', 'Coordination Compounds',
    'Electrochemistry', 'Chemical Equilibrium', 'Ionic Equilibrium',
    'Thermodynamics (Chem)', 'Periodic Table & Properties',
  ],
  Biology: [
    'Cell Structure & Function', 'Cell Division', 'Biomolecules',
    'Photosynthesis', 'Respiration in Plants', 'Plant Growth & Development',
    'Digestion & Absorption', 'Breathing & Gas Exchange', 'Body Fluids & Circulation',
    'Excretory Products', 'Locomotion & Movement', 'Neural Control',
    'Genetics & Mendelism', 'Molecular Basis of Inheritance',
    'Reproduction in Plants', 'Human Reproduction', 'Evolution', 'Ecology',
  ],
};

export const SCIENCE_TIPS = [
  '🧠 Spaced Repetition: Review yesterday\'s topics for 10 min before new study — proven to boost retention by 80%.',
  '💤 Sleep consolidates memory. 7-8 hrs of sleep = stronger recall on exam day. Never pull all-nighters before NEET.',
  '🏃 Exercise boosts BDNF (Brain-Derived Neurotrophic Factor). A 20-min walk before studying improves focus by 30%.',
  '📵 Phone-free first hour after waking: cortisol spikes from notifications kill deep focus before it starts.',
  '🌊 Interleaving beats blocked study: Physics → Bio → Chemistry retention is 40% higher than 3 hrs of one subject.',
  '💧 Dehydration by just 2% impairs short-term memory and concentration — keep water on your desk always.',
  '🎯 Active recall beats passive reading 3:1. Use practice questions and flashcards, not just re-reading notes.',
  '⏰ Your peak cognitive window is 90 mins after waking — schedule your hardest subject (usually Physics) then.',
  '🎵 Instrumental music (60-70 BPM) during study can improve focus. Lyrics impair verbal memory tasks.',
  '📝 The Feynman Technique: explain a concept in simple words as if teaching a child — gaps reveal what you don\'t know.',
  '🔄 The testing effect: taking a practice test within 24h of learning locks memory 2x better than reviewing notes.',
  '😤 Stress in small doses (eustress) is performance-enhancing. Deep breathing (4-7-8 technique) shifts you from panic to peak.',
];

export const TIME_SLOTS = [
  '5:00 AM','5:30 AM','6:00 AM','6:30 AM',
  '7:00 AM','7:30 AM','8:00 AM','8:30 AM',
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
  '1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM','8:30 PM',
  '9:00 PM','9:30 PM','10:00 PM','10:30 PM',
];

export const POMODORO_MODES = [
  { label: 'Focus', sec: 25 * 60, color: '#f97316', desc: 'Deep work — eliminate all distractions' },
  { label: 'Short Break', sec: 5 * 60, color: '#34d399', desc: 'Rest & breathe — walk around the room' },
  { label: 'Long Break', sec: 15 * 60, color: '#60a5fa', desc: 'Recharge — hydrate, stretch, go outside' },
  { label: 'Flow', sec: 50 * 60, color: '#a78bfa', desc: 'Extended deep work (Ultradian Rhythm ~90 min)' },
];
