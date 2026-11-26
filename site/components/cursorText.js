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

// Custom Highlights paint the original glyphs, preserving their layout,
// background, inline formatting and native selection without wrapping the text.
export function fillWord({ node, start, end }) {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  CSS.highlights.set('cursor-word', new Highlight(range));
  return () => CSS.highlights.delete('cursor-word');
}
