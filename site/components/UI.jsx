import { createElement, createContext, useContext, cloneElement } from 'react';
import { components } from './catalog';

// Variants compose the same primitive as their parent; semantics (e.g. an
// anchor used as a button) and native event/ARIA props pass through intact.
export const SpecimenContext = createContext(null);
export const UI = {};
function primitive(id) {
  if (UI[id]) return UI[id];
  const recipe = components[id];
  const Parent = recipe.parent && primitive(recipe.parent);
  function Component({ as = recipe.tag, className = '', children, ...props }) {
    const capture = useContext(SpecimenContext);
    const names = [recipe.classes, className].filter(Boolean).join(' ');
    const attributes = { 'data-ui': id, ...props, className: names || undefined };
    if (Parent)
      return (
        <Parent as={as} {...attributes}>
          {children}
        </Parent>
      );
    const element = createElement(as, attributes, children);
    if (!capture) return element;
    return cloneElement(element, {
      ref: (node) => {
        if (node) capture.set(node, element);
      }
    });
  }
  Component.displayName = id;
  UI[id] = Component;
  return Component;
}
Object.keys(components).forEach(primitive);
