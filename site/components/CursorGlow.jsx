import { useEffect, useRef } from 'react';
import { wordAtPoint, fillWord } from './cursorText';
import { UI } from './UI';
import { descendants } from './catalog';
import { useComponentStyles } from '../design/componentStyles';
import { glowControls } from './glowControls';

const controls = 'button, .btn, .top nav a:last-child, summary, [role="button"], [role="option"]';
const fillable = ['[data-cursor-fillable]', '[data-ui="Metric"]', '.portal-metrics > div', '.data-row',
  ...['Badge', 'Notice'].flatMap(family => descendants(family).map(part => '[data-ui="' + part.id + '"]'))
].join(',');
const excluded = 'img, picture, [role="img"], .card-image-link, .hero-image-link, .gallery-thumbs, input, textarea, select, [contenteditable="true"], [inert], :disabled, [aria-disabled="true"]';

export function CursorGlow({ specimen = false }) {
  const layer = useRef(null);
  const dot = useRef(null);
  const { edits } = useComponentStyles();
  const settings = edits.CursorGlow || {};
  const [diameter, duration] = glowControls.map(({ key, initial }) => settings[key] ?? initial);

  useEffect(() => {
    if (specimen) return;
    const overlay = layer.current;
    const media = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
    let active = null;
    let word = null;
    let clearWord = null;
    let point = null;
    let frame = 0;
    let lastDialog = null;

    function release() {
      clearWord?.();
      clearWord = null;
      word = null;
      if (!active) return;
      delete active.dataset.cursorFill;
      for (const key of ['x', 'y', 'reach', 'start', 'time']) active.style.removeProperty('--cursor-' + key);
      active = null;
    }
    function hide() {
      cancelAnimationFrame(frame);
      frame = 0;
      point = null;
      release();
      delete document.documentElement.dataset.customPointer;
      overlay.hidePopover?.();
      overlay.hidden = true;
      lastDialog = null;
    }
    function paint() {
      frame = 0;
      if (!point) return;
      const { x, y } = point;
      const hit = document.elementFromPoint(x, y);
      if (!hit) return hide();
      if (!document.documentElement.hasAttribute('data-custom-pointer')) document.documentElement.dataset.customPointer = '';
      const eligible = !hit.closest(excluded);
      const next = eligible ? hit.closest(controls) || hit.closest(fillable) : null;
      const nextWord = eligible && !next ? wordAtPoint(hit, x, y) : null;
      if (next !== active || nextWord?.node !== word?.node || nextWord?.start !== word?.start || nextWord?.end !== word?.end) {
        release();
        if (next) {
          const rect = next.getBoundingClientRect();
          const left = x - rect.left, top = y - rect.top;
          const reach = Math.hypot(Math.max(left, rect.width - left), Math.max(top, rect.height - top));
          next.style.setProperty('--cursor-x', left + 'px');
          next.style.setProperty('--cursor-y', top + 'px');
          next.style.setProperty('--cursor-reach', Math.ceil(reach) + 'px');
          next.style.setProperty('--cursor-start', getComputedStyle(next).backgroundColor);
          next.style.setProperty('--cursor-time', duration + 'ms');
          next.dataset.cursorFill = '';
          active = next;
        } else if (nextWord) {
          word = nextWord;
          clearWord = fillWord(word, duration);
        }
      }
      if (active || word) {
        if (!overlay.hidden) {
          overlay.hidePopover?.();
          overlay.hidden = true;
        }
        return;
      }
      const dialog = hit.closest('dialog[open]');
      if (overlay.hidden || dialog !== lastDialog) {
        overlay.hidePopover?.();
        overlay.hidden = false;
        overlay.showPopover?.();
        lastDialog = dialog;
      }
      dot.current.style.translate = x + 'px ' + y + 'px';
    }
    function schedule() {
      if (point && !frame) frame = requestAnimationFrame(paint);
    }
    function move(event) {
      if (!media.matches || event.pointerType === 'touch') return hide();
      point = { x: event.clientX, y: event.clientY };
      schedule();
    }
    function leave(event) {
      if (!event.relatedTarget) hide();
    }
    function touch(event) {
      if (event.pointerType === 'touch') hide();
    }
    const controller = new AbortController();
    const options = { passive: true, capture: true, signal: controller.signal };
    for (const event of ['pointermove', 'pointerover']) window.addEventListener(event, move, options);
    for (const event of ['scroll', 'resize', 'hashchange']) window.addEventListener(event, schedule, options);
    for (const event of ['keydown', 'pointercancel', 'pagehide']) window.addEventListener(event, hide, options);
    window.addEventListener('blur', hide, { signal: controller.signal });
    window.addEventListener('pointerdown', touch, options);
    window.addEventListener('pointerout', leave, options);
    document.addEventListener('visibilitychange', hide, options);
    media.addEventListener('change', hide, options);
    return () => { controller.abort(); hide(); };
  }, [specimen, duration]);

  const mark = <UI.CursorGlow aria-hidden="true" ref={dot} style={{ '--dot-diameter': diameter + 'px' }} />;
  if (specimen) return (
    <div className="cursor-glow-specimen">
      <div><span className="cursor-sample-shape">{mark}</span><small>Open space</small></div>
      <div><span className="cursor-sample-shape"><strong>Sublet</strong></span><small>Over text</small></div>
      <div><span className="cursor-sample-shape"><UI.SecondaryButton data-cursor-sample="">Find a sublet</UI.SecondaryButton></span><small>Over a button</small></div>
    </div>
  );
  return <div className="cursor-glow-layer" ref={layer} popover="manual" hidden inert aria-hidden="true">{mark}</div>;
}
