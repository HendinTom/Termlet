import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { components } from '../components/catalog';
import { SpecimenContext } from '../components/UI';

let cached;
export function loadSpecimens(getExamples) {
  if (cached) return cached;
  // Resolve contextual variants (e.g. a button in a payment row) against the
  // real screen structure, then keep the React elements for isolated previews.
  const host = document.createElement('div');
  const root = createRoot(host);
  const elements = new WeakMap();
  try {
    flushSync(() =>
      root.render(<SpecimenContext.Provider value={elements}>{getExamples()}</SpecimenContext.Provider>)
    );
    const result = new Map();
    for (const recipe of Object.values(components)) {
      const selector = recipe.selector || '[data-ui="' + recipe.id + '"]';
      const nodes = [...host.querySelectorAll(selector)];
      const node = nodes.find(
        (el) => elements.has(el) && !el.hidden && (el.textContent.trim() || el.matches('input,img,select'))
      );
      if (node) result.set(recipe.id, elements.get(node));
    }
    cached = result;
    return result;
  } finally {
    root.unmount();
  }
}
