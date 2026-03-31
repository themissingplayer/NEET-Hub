export const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
};

export const load = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const remove = (key) => {
  try { localStorage.removeItem(key); } catch {}
};

export const listKeys = (prefix) => {
  try {
    return Object.keys(localStorage).filter(k => k.startsWith(prefix));
  } catch { return []; }
};

export const today = () => new Date().toISOString().split('T')[0];
export const fmt = (n) => String(n).padStart(2, '0');
