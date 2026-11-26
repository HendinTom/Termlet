import { useEffect, useRef } from 'react';
import { rippleLink } from './cursorText';
import { UI } from './UI';
import { useComponentStyles } from '../design/componentStyles';
import { glowControls } from './glowControls';

const controls = 'button, .btn, summary, [role="button"], [role="option"]';
const cards = '.listing-card, .promotion-card, .stay-cards > .panel';
const links = 'a[href], [role="link"]';
const excluded = '[inert], :disabled, [aria-disabled="true"], [contenteditable="true"]';

export function CursorGlow({ specimen = false }) {
  const layer = useRef(null);
  const pointer = useRef(null);
  const { edits } = useComponentStyles();
  const settings = edits.CursorGlow || {};
  const [pointerSize, duration, rippleDuration, glowSize] = glowControls.map(({ key, initial }) => settings[key] ?? initial);

  useEffect(() => {
    if (specimen) return;
    const overlay = layer.current;
    const media = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
    const supportsLinkRipple = Boolean(window.CSS?.highlights && window.Highlight);
    let active = null;
    let activeLink = null;
    let clearLink = null;
    let point = null;
    let frame = 0;
    let lastDialog = null;

    function release() {
      clearLink?.();
      clearLink = null;
      activeLink = null;
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
      const link = eligible && hit.closest(links);
      const card = eligible && hit.closest(cards);
      // A card image represents the listing itself. An explicit text link inside
      // the card uses the same lighter treatment as any other text link.
      const textLink = !button && link && link.textContent.trim() ? link : null;
      const next = button || (!textLink && card) || null;
      const nextLink = supportsLinkRipple ? textLink : null;
      if (next !== active || nextLink !== activeLink) {
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
          const inset = Math.min(rect.width, rect.height) / 2;
          const clampOffset = value => Math.max(-inset, Math.min(inset, value));
          next.style.setProperty('--cursor-halo-x', clampOffset(left - rect.width / 2) + 'px');
          next.style.setProperty('--cursor-halo-y', clampOffset(top - rect.height / 2) + 'px');
          next.style.setProperty('--cursor-halo-inset', -inset + 'px');
          next.style.setProperty('--cursor-glow', glowSize + 'px');
          next.dataset.cursorEmphasis = button ? 'button' : 'card';
          if (button) next.dataset.cursorFill = '';
          active = next;
        } else if (nextLink) {
          activeLink = nextLink;
          clearLink = rippleLink(nextLink, point, rippleDuration);
        }
      }
      if (active?.dataset.cursorEmphasis === 'button' || activeLink) {
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
  }, [specimen, duration, rippleDuration, glowSize]);

  const mark = (
    <UI.CursorGlow aria-hidden="true" ref={pointer} style={{ '--pointer-size': pointerSize + 'px' }}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.9 2.5C2.5 1.7 1.7 2.6 2 4l3.9 16.1c.4 1.6 1.7 1.8 2.6.5l4-5.1c.4-.5.9-.8 1.6-.9l6.4-1.2c1.6-.3 1.8-1.6.4-2.4Z" />
      </svg>
    </UI.CursorGlow>
  );
  if (specimen) return (
    <div className="cursor-glow-specimen">
      <div><span className="cursor-sample-shape">{mark}</span><small>Open space</small></div>
      <div><span className="cursor-sample-shape"><UI.Link href="#browse" className="cursor-link-sample">Find a sublet</UI.Link></span><small>Over a link</small></div>
      <div><span className="cursor-sample-shape"><UI.SecondaryButton data-cursor-sample="" style={{ '--cursor-glow': glowSize + 'px' }}>List my place</UI.SecondaryButton></span><small>Over a button</small></div>
    </div>
  );
  return <div className="cursor-glow-layer" ref={layer} popover="manual" hidden inert aria-hidden="true">{mark}</div>;
}
