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
    return { node, start, end, index };
  }
  return null;
}

// Custom Highlights paint the original glyphs, preserving their layout,
// background, inline formatting and native selection without wrapping the text.
export function fillWord({ node, start, end, index }, duration) {
  if (!CSS.highlights || typeof Highlight === 'undefined') {
    const element = node.parentElement;
    element.dataset.cursorText = '';
    return () => delete element.dataset.cursorText;
  }
  const ink = new Highlight();
  const edge = new Highlight();
  CSS.highlights.set('cursor-ink', ink);
  CSS.highlights.set('cursor-edge', edge);
  let frame = 0;
  const started = performance.now();
  const distance = Math.max(index - start, end - index - 1);

  function add(highlight, left, right) {
    if (left >= right) return;
    const range = document.createRange();
    range.setStart(node, left);
    range.setEnd(node, right);
    highlight.add(range);
  }
  function paint(now) {
    ink.clear();
    edge.clear();
    if (!node.isConnected || node.length < end) return;
    if (now - started >= duration) {
      add(ink, start, end);
      return;
    }
    const radius = Math.floor((now - started) / duration * (distance + 1));
    const left = Math.max(start, index - radius), right = Math.min(end, index + radius + 1);
    add(ink, left, right);
    if (index - radius >= start) add(edge, left, left + 1);
    if (radius && index + radius < end) add(edge, right - 1, right);
    frame = requestAnimationFrame(paint);
  }
  paint(started);
  return () => {
    cancelAnimationFrame(frame);
    CSS.highlights.delete('cursor-ink');
    CSS.highlights.delete('cursor-edge');
  };
}
