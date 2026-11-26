import { useEffect, useRef } from 'react';
import { UI } from './UI';
import { useComponentStyles } from '../design/componentStyles';
import { glowControls } from './glowControls';

export function CursorGlow({ specimen = false }) {
  const layer = useRef(null);
  const dot = useRef(null);
  const { edits } = useComponentStyles();
  const settings = edits.CursorGlow || {};
  useEffect(() => {
    if (specimen) return;
    const overlay = layer.current;
    const media = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
    let lastDialog;
    function hide() {
      overlay.hidePopover?.();
      overlay.hidden = true;
      lastDialog = null;
    }
    function move(event) {
      if (!media.matches || event.pointerType === 'touch') {
        if (!overlay.hidden) hide();
        return;
      }
      const dialog = event.target.closest?.('dialog[open]');
      if (overlay.hidden || dialog !== lastDialog) {
        // Reopen above the active picker when its native dialog enters the top layer.
        overlay.hidePopover?.();
        overlay.hidden = false;
        overlay.showPopover?.();
        lastDialog = dialog;
      }
      dot.current.style.translate = event.clientX + 'px ' + event.clientY + 'px';
    }
    function leave(event) {
      if (!event.relatedTarget) hide();
    }
    function touch(event) {
      if (event.pointerType === 'touch') hide();
    }
    const controller = new AbortController();
    const options = { passive: true, capture: true, signal: controller.signal };
    window.addEventListener('pointermove', move, options);
    window.addEventListener('pointerdown', touch, options);
    window.addEventListener('pointerout', leave, options);
    window.addEventListener('pointercancel', hide, options);
    window.addEventListener('keydown', hide, options);
    window.addEventListener('blur', hide, options);
    document.addEventListener('visibilitychange', hide, options);
    media.addEventListener('change', hide, options);
    return () => controller.abort();
  }, [specimen]);

  const style = Object.fromEntries(glowControls.map(({ key, initial, unit }) =>
    ['--' + key, (settings[key] ?? initial) + unit]
  ));
  const glow = <UI.CursorGlow aria-hidden="true" ref={dot} style={style} />;
  if (specimen) return <div className="cursor-glow-specimen">{glow}</div>;
  return <div className="cursor-glow-layer" ref={layer} popover="manual" hidden inert aria-hidden="true">{glow}</div>;
}
