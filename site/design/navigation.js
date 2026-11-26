import { iterations } from './history';
import { useSyncExternalStore } from 'react';
import { components } from '../components/catalog';

const key = `termlet:${iterations[0].id}:design-navigation`;
let saved = {};
try { saved = JSON.parse(sessionStorage.getItem(key)) || {}; } catch {}
const listeners = new Set();

export function rememberNavigation(update) {
  const oldRoute = saved.route;
  saved = { ...saved, ...update };
  try { sessionStorage.setItem(key, JSON.stringify(saved)); } catch {}
  if (saved.route !== oldRoute) for (const notify of listeners) notify();
}

function subscribe(notify) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export function useDesignLink() {
  return useSyncExternalStore(subscribe, () => '#' + (saved.route || 'design'));
}

export function editorLocation(requested) {
  const id = [requested, saved.id, 'Button'].find(id => Object.hasOwn(components, id));
  const same = id === saved.id;
  return {
    id,
    query: same && typeof saved.query === 'string' ? saved.query : '',
    scroll: same && Number.isFinite(saved.scroll) ? saved.scroll : 0,
    pageScroll: same && Number.isFinite(saved.pageScroll) ? saved.pageScroll : 0,
    expanded: same && Array.isArray(saved.expanded) ? saved.expanded : []
  };
}
