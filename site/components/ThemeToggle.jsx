import { UI } from './UI';
import { setDarkMode, useDarkMode } from '../design/tokens';

export function ThemeToggle() {
  const dark = useDarkMode();
  return <UI.ThemeToggle type="button" aria-label="Dark mode" aria-pressed={dark}
    title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDarkMode(!dark)}>
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dark ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> :
        <path d="M20.2 14A8.5 8.5 0 0 1 10 3.8 8.5 8.5 0 1 0 20.2 14Z"/>}
    </svg>
  </UI.ThemeToggle>;
}
