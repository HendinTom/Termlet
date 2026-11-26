// A caret lookup can snap to the end of a line even when the pointer is in its
// empty margin. Check the adjacent character rectangles before choosing a word.
export function wordAtPoint(hit, x, y) {
  const caret = document.caretPositionFromPoint?.(x, y);
  const fallback = !caret && document.caretRangeFromPoint?.(x, y);
  const node = caret?.offsetNode ?? fallback?.startContainer;
  const offset = caret?.offset ?? fallback?.startOffset;
  if (node?.nodeType !== Node.TEXT_NODE || !hit.contains(node)) return null;

  const range = document.createRange();
  const value = node.data;
  for (const index of [offset, offset - 1]) {
    if (index < 0 || index >= value.length || /\s/u.test(value[index])) continue;
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const rect = range.getBoundingClientRect();
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) continue;
    let start = index, end = index + 1;
    while (start > 0 && !/\s/u.test(value[start - 1])) start--;
    while (end < value.length && !/\s/u.test(value[end])) end++;
    return { node, start, end };
  }
  return null;
}

export const textGroups = 'a[href], [role="link"], h1, h2, h3, h4, h5, h6, [role="heading"], .kicker:not(p), [data-cursor-group]';
const graphemes = Intl.Segmenter && new Intl.Segmenter(undefined, { granularity: 'grapheme' });

export function sameText(a, b) {
  return a?.node === b?.node && a?.start === b?.start && a?.end === b?.end;
}

// Measure once at pointer entry. Visual distance keeps the wave continuous over
// line wraps, inline markup, and right-to-left text without splitting the DOM.
function lettersByDistance(target, x, y) {
  const letters = [];
  function measure(node, start, end) {
    for (const { segment, index } of graphemes.segment(node.data.slice(start, end))) {
      if (!segment.trim()) continue;
      const range = document.createRange();
      range.setStart(node, start + index);
      range.setEnd(node, start + index + segment.length);
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
      letters.push({ range, distance });
    }
  }
  if (target.node.nodeType === Node.TEXT_NODE) {
    measure(target.node, target.start, target.end);
  } else {
    const walker = document.createTreeWalker(target.node, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) measure(walker.currentNode, 0, walker.currentNode.length);
  }
  return letters.sort((a, b) => a.distance - b.distance);
}

export function rippleText(target, { x, y }, duration) {
  const full = document.createRange();
  if (target.node.nodeType === Node.TEXT_NODE) {
    full.setStart(target.node, target.start);
    full.setEnd(target.node, target.end);
  } else {
    full.selectNodeContents(target.node);
  }

  const highlight = new Highlight();
  CSS.highlights.set('cursor-text', highlight);
  const letters = duration && graphemes ? lettersByDistance(target, x, y) : [];
  let frame = 0, next = 0;
  const started = performance.now();

  function reveal(now) {
    const elapsed = Math.max(0, now - started);
    if (elapsed >= duration || letters.length < 2) {
      highlight.clear();
      highlight.add(full);
      return;
    }
    const first = letters[0].distance, last = letters[letters.length - 1].distance;
    const radius = first + (last - first) * elapsed / duration;
    while (next < letters.length && letters[next].distance <= radius) {
      highlight.add(letters[next++].range);
    }
    frame = requestAnimationFrame(reveal);
  }
  reveal(started);
  return () => {
    cancelAnimationFrame(frame);
    CSS.highlights.delete('cursor-text');
  };
}
