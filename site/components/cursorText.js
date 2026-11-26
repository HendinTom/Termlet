const graphemes = Intl.Segmenter && new Intl.Segmenter(undefined, { granularity: 'grapheme' });

// Measure once at pointer entry. Visual distance keeps the wave continuous over
// line wraps, inline markup, and right-to-left text without splitting the DOM.
function lettersByDistance(link, x, y) {
  const letters = [];
  function measure(node) {
    for (const { segment, index } of graphemes.segment(node.data)) {
      if (!segment.trim()) continue;
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + segment.length);
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
      letters.push({ range, distance });
    }
  }
  const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) measure(walker.currentNode);
  return letters.sort((a, b) => a.distance - b.distance);
}

export function rippleLink(link, { x, y }, duration) {
  const full = document.createRange();
  full.selectNodeContents(link);

  const highlight = new Highlight();
  CSS.highlights.set('cursor-text', highlight);
  const letters = duration && graphemes ? lettersByDistance(link, x, y) : [];
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
