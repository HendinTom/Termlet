import { useEffect, useRef } from 'react';
import { cardEdge, bridgePath } from './cardEdge';
import { UI } from './UI';
import { useComponentStyles } from '../design/componentStyles';
import { glowControls } from './glowControls';

const controls = 'button, .btn, summary, [role="button"], [role="option"]';
const cards = '.listing-card, .promotion-card, .stay-cards > .panel';
const excluded = '[inert], :disabled, [aria-disabled="true"], [contenteditable="true"]';

export function CursorGlow({ specimen = false }) {
  const layer = useRef(null);
  const pointer = useRef(null);
  const bridge = useRef(null);
  const { edits } = useComponentStyles();
  const settings = edits.CursorGlow || {};
  const [pointerSize, duration, glowSize, edgeRange] = glowControls.map(({ key, initial }) => settings[key] ?? initial);

  useEffect(() => {
    if (specimen) return;
    const overlay = layer.current;
    const media = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
    let active = null;
    let cornerRadius = 0;
    let point = null;
    let frame = 0;
    let lastDialog = null;

    function release() {
      delete overlay.dataset.edge;
      if (!active) return;
      delete active.dataset.cursorFill;
      delete active.dataset.cursorEmphasis;
      for (const key of ['x', 'y', 'reach', 'start', 'time', 'halo-x', 'halo-y', 'halo-inset', 'glow']) active.style.removeProperty('--cursor-' + key);
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
      const button = eligible && hit.closest(controls);
      const card = eligible && hit.closest(cards);
      let next = button || card || null;
      let edge = null;
      // A gap has no target of its own. Only a previously touched card may
      // keep its glow there, and an unrelated link or control takes priority.
      if (!next && eligible && active?.isConnected && active.dataset.cursorEmphasis === 'card'
        && !hit.closest('a[href], [role="link"], input, select, textarea')
        && hit.contains(active)) {
        edge = cardEdge(active.getBoundingClientRect(), cornerRadius, point, edgeRange);
        if (edge) next = active;
      }
      if (next !== active) {
        release();
        if (next) {
          const rect = next.getBoundingClientRect();
          const left = x - rect.left, top = y - rect.top;
          const reach = Math.hypot(Math.max(left, rect.width - left), Math.max(top, rect.height - top));
          next.style.setProperty('--cursor-x', left + 'px');
          next.style.setProperty('--cursor-y', top + 'px');
          next.style.setProperty('--cursor-reach', Math.ceil(reach) + 'px');
          const style = getComputedStyle(next);
          cornerRadius = parseFloat(style.borderTopLeftRadius) || 0;
          next.style.setProperty('--cursor-start', style.backgroundColor);
          next.style.setProperty('--cursor-time', duration + 'ms');
          const inset = Math.min(rect.width, rect.height) / 2;
          const clampOffset = value => Math.max(-inset, Math.min(inset, value));
          next.style.setProperty('--cursor-halo-x', clampOffset(left - rect.width / 2) + 'px');
          next.style.setProperty('--cursor-halo-y', clampOffset(top - rect.height / 2) + 'px');
          next.style.setProperty('--cursor-halo-inset', -inset + 'px');
          next.style.setProperty('--cursor-glow', glowSize + 'px');
          next.dataset.cursorEmphasis = button ? 'button' : 'card';
          if (button) next.dataset.cursorFill = '';
          active = next;
        }
      }
      if (active?.dataset.cursorEmphasis === 'card' && glowSize) {
        edge ??= cardEdge(active.getBoundingClientRect(), cornerRadius, point, edgeRange);
        if (edge) {
          bridge.current.setAttribute('transform', `translate(${edge.x} ${edge.y}) rotate(${edge.angle})`);
          bridge.current.setAttribute('d', bridgePath(edge));
          overlay.style.setProperty('--edge-strength', edge.strength);
          overlay.style.setProperty('--edge-blur', Math.min(8, glowSize * 0.6) * edge.strength + 'px');
          overlay.dataset.edge = '';
        } else {
          delete overlay.dataset.edge;
        }
      }
      if (active?.dataset.cursorEmphasis === 'button') {
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
      pointer.current.style.translate = x + 'px ' + y + 'px';
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
  }, [specimen, duration, glowSize, edgeRange]);

  const mark = (
    <UI.CursorGlow aria-hidden="true" ref={pointer} style={{ '--pointer-size': pointerSize + 'px' }}>
      {/* Phosphor Cursor Fill, MIT. License is distributed in public/licenses. */}
      <svg viewBox="20 20 245 245" aria-hidden="true">
        <path transform="rotate(15 38 38)" d="M220.49,207.8,207.8,220.49a12,12,0,0,1-17,0l-56.57-56.57L115,214.08l-.13.33A15.84,15.84,0,0,1,100.26,224l-.78,0a15.82,15.82,0,0,1-14.41-11L32.8,52.92A15.95,15.95,0,0,1,52.92,32.8L213,85.07a16,16,0,0,1,1.41,29.8l-.33.13-50.16,19.27,56.57,56.56A12,12,0,0,1,220.49,207.8Z" />
      </svg>
    </UI.CursorGlow>
  );
  if (specimen) return (
    <div className="cursor-glow-specimen">
      <div><span className="cursor-sample-shape">{mark}</span><small>Open space</small></div>
      <div><span className="cursor-sample-shape"><UI.SecondaryButton data-cursor-sample="" style={{ '--cursor-glow': glowSize + 'px' }}>List my place</UI.SecondaryButton></span><small>Over a button</small></div>
    </div>
  );
  return (
    <div className="cursor-glow-layer" ref={layer} popover="manual" hidden inert aria-hidden="true">
      <svg className="card-edge-bridge" aria-hidden="true"><path ref={bridge} /></svg>
      {mark}
    </div>
  );
}
