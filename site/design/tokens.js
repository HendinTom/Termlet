import { useSyncExternalStore } from 'react';
export const tokens = [
  { key: '--ink', name: 'Text', initial: '#222222' },
  { key: '--paper', name: 'Page background', initial: '#ffffff' },
  { key: '--accent', name: 'Accent', initial: '#194c37' },
  { key: '--secondary', name: 'Secondary accent', initial: '#c4ee70' },
  { key: '--surface-radius', name: 'Panel radius', initial: 16, max: 36 },
  { key: '--surface-padding', name: 'Panel padding', initial: 24, min: 8, max: 40 }
];
const storageKey = 'termlet:003:design-tokens';
const valid = (t, v) =>
  t.max ? Number.isInteger(v) && v >= (t.min || 0) && v <= t.max : /^#[a-f0-9]{6}$/i.test(v);

let current;
const listeners = new Set();
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function useTokens() {
  return useSyncExternalStore(subscribe, () => current);
}

export function restoreTokens() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(storageKey));
  } catch {}
  // Older saves included the former paper default alongside every adjustment.
  if (saved && !Object.hasOwn(saved, '--ink') && saved['--paper'] === '#f7f6f0') delete saved['--paper'];
  if (saved && typeof saved === 'object') saved['--accent'] ??= saved['--green'];
  const values = {};
  for (const t of tokens) values[t.key] = valid(t, saved?.[t.key]) ? saved[t.key] : t.initial;
  applyTokens(values);
  return values;
}

export function applyTokens(values) {
  current = values;
  document.querySelector('meta[name="theme-color"]').content = values['--paper'];
  for (const t of tokens)
    document.documentElement.style.setProperty(t.key, t.max ? values[t.key] + 'px' : values[t.key]);
  for (const notify of listeners) notify();
}

export function saveTokens(values) {
  applyTokens(values);
  try {
    localStorage.setItem(storageKey, JSON.stringify(values));
  } catch {}
}

window.addEventListener('storage', (event) => {
  if (event.key === storageKey || event.key === null) restoreTokens();
});
