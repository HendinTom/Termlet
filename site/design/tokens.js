export const tokens = [
  { key: '--green', name: 'Brand green', initial: '#194c37' },
  { key: '--paper', name: 'Page background', initial: '#f7f6f0' },
  { key: '--surface-radius', name: 'Panel radius', initial: 16, max: 36 },
  { key: '--surface-padding', name: 'Panel padding', initial: 24, min: 8, max: 40 }
];
const storageKey = 'termlet:002:design-tokens';
const valid = (t,v) => t.max ? Number.isInteger(v) && v >= (t.min || 0) && v <= t.max : /^#[a-f0-9]{6}$/i.test(v);

export function restoreTokens() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  const values = {};
  for (const t of tokens) values[t.key] = valid(t, saved?.[t.key]) ? saved[t.key] : t.initial;
  applyTokens(values);
  return values;
}

export function applyTokens(values) {
  for (const t of tokens) document.documentElement.style.setProperty(t.key, t.max ? values[t.key] + 'px' : values[t.key]);
}

export function saveTokens(values) {
  applyTokens(values);
  try { localStorage.setItem(storageKey, JSON.stringify(values)); } catch {}
}
