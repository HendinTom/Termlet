import { selectionColors } from './selection';
import { glowControls } from '../components/glowControls';
import { iterations } from './history';
import { useSyncExternalStore } from 'react';
import { components, descendants, families } from '../components/catalog';
import toneStyles from './tones.css?inline';

export const fonts = {
  system: 'system-ui, sans-serif',
  humanist: '"Avenir Next", Avenir, Arial, sans-serif',
  editorial: '"Iowan Old Style", "Palatino Linotype", Georgia, serif',
  georgia: 'Georgia, serif',
  mono: 'ui-monospace, monospace'
};
export const fontNames = {
  system: 'System sans',
  humanist: 'Avenir / sans',
  editorial: 'Editorial serif',
  georgia: 'Georgia',
  mono: 'Monospace'
};
export const baseTypography = { body: 'humanist', heading: 'editorial', size: 16 };
const key = `termlet:${iterations[0].id}:component-styles`;
const own = (object, id) => Object.hasOwn(object, id);
const inRange = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;

export const colors = {
  ink: 'var(--ink)',
  paper: 'var(--paper)',
  accent: 'var(--accent)',
  secondary: 'var(--secondary)',
  tint: 'var(--tint)',
  shade: 'var(--accent-strong)',
  secondaryTint: 'var(--secondary-tint)',
  secondaryShade: 'var(--secondary-shade)'
};
const properties = {
  fill: 'background-color',
  text: 'color',
  border: 'border-color',
  font: 'font-family',
  size: 'font-size'
};
// Broader edits precede narrower ones, including controls that combine
// families (a marketplace select has a button as its visible trigger).
function depth(item) {
  return item.parent ? 1 + depth(components[item.parent]) : 0;
}
const order = families.flatMap((family) => descendants(family.id)).sort((a,b)=>depth(a)-depth(b));
const selectors = new Map(
  order.map(({ id }) => [
    id,
    descendants(id)
      .flatMap((c) => ['[data-ui="' + c.id + '"]', ...(c.selector ? [c.selector] : [])])
      .join(',')
  ])
);
// Recompute derived colors at each scoped accent, using the same CSS as :root.
const tones = toneStyles.slice(toneStyles.indexOf('{') + 1, toneStyles.lastIndexOf('}'));

function declarations(edit) {
  const rules = [];
  if (inRange(edit.hue, -180, 180)) {
    for (const [token, base] of [
      ['accent', 'primary'],
      ['secondary', 'secondary']
    ]) {
      rules.push('--' + token + ':oklch(from var(--palette-' + base + ') l c calc(h + ' + edit.hue + '))');
    }
    rules.push(tones);
  }
  for (const [name, prop] of Object.entries(properties)) {
    const value = edit[name];
    if (name === 'font' && own(fonts, value)) rules.push(prop + ':' + fonts[value]);
    if (name === 'size' && inRange(value, 10, 64)) rules.push(prop + ':' + value / 16 + 'rem');
    if (!['fill', 'text', 'border'].includes(name)) continue;
    if (name === 'text' && (value === 'none' || own(colors, value))) {
      const [background, foreground] = selectionColors(colors[value] || 'inherit');
      rules.push('--selection-bg:' + background, '--selection-fg:' + foreground);
    }
    if (own(colors, value)) rules.push(prop + ':' + colors[value]);
    if (value === 'none') rules.push(prop + ':' + (name === 'text' ? 'inherit' : 'transparent'));
    if (name === 'border' && own(colors, value)) rules.push('border-style:solid', 'border-width:1px');
  }
  return rules.join(';');
}

export function applyStyles(state) {
  const { typography, edits } = state;
  const root = document.documentElement.style;
  root.setProperty('--sans', fonts[typography.body]);
  root.setProperty('--display', fonts[typography.heading]);
  if (typography.heading === baseTypography.heading) root.removeProperty('--brand-font');
  else root.setProperty('--brand-font', fonts[typography.heading]);
  root.fontSize = typography.size + 'px';
  let sheet = document.getElementById('component-edits');
  if (!sheet) {
    sheet = document.createElement('style');
    sheet.id = 'component-edits';
    document.head.append(sheet);
  }
  const rules = [];
  for (const { id } of order) {
    if (!edits[id]) continue;
    const css = declarations(edits[id]);
    if (css) rules.push(':where(' + selectors.get(id) + '){' + css + '}');
  }
  sheet.textContent = '@layer component-edits {' + rules.join('\n') + '}';
}

let current;
const listeners = new Set();
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function useComponentStyles() {
  return useSyncExternalStore(subscribe, () => current);
}
function publish(state) {
  applyStyles(state);
  current = state;
  for (const notify of listeners) notify();
}

export function restoreStyles() {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(key));
  } catch {}
  const t = stored?.typography;
  const state = {
    typography: {
      body: own(fonts, t?.body) ? t.body : baseTypography.body,
      heading: own(fonts, t?.heading) ? t.heading : baseTypography.heading,
      size: inRange(t?.size, 12, 24) ? t.size : 16
    },
    edits: {}
  };
  for (const [id, edit] of Object.entries(stored?.edits || {})) {
    if (!own(components, id) || !edit || typeof edit !== 'object') continue;
    if (id === 'CursorGlow') {
      const valid = glowControls.filter(({ key, min, max }) => inRange(edit[key], min, max));
      if (valid.length) state.edits[id] = Object.fromEntries(valid.map(({ key }) => [key, edit[key]]));
    } else if (declarations(edit)) state.edits[id] = edit;
  }
  publish(state);
  return state;
}

export function saveStyles(state) {
  publish(state);
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {}
}

window.addEventListener('storage', (event) => {
  if (event.key === key || event.key === null) restoreStyles();
});
