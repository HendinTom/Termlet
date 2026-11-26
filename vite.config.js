import { defineConfig } from 'vite';
import { selectionColors } from './site/design/selection.js';

// Keep selection and foreground roles together as components and variants are added.
const selectionPlugin = {
  postcssPlugin: 'termlet-selection',
  Once(root) {
    root.walkDecls('color', declaration => {
      const selector = declaration.parent.selector;
      // Pointer feedback changes contrast temporarily. Keep the original text selection role.
      if (!selector || selector.includes('::') || selector.includes('[data-cursor-fill]')) return;
      const [background, foreground] = selectionColors(declaration.value);
      declaration.cloneAfter({ prop: '--selection-fg', value: foreground });
      declaration.cloneAfter({ prop: '--selection-bg', value: background });
    });
  }
};

export default defineConfig({
  root: 'site',
  css: { postcss: { plugins: [selectionPlugin] } },
  base: './',
  build: { outDir: '../dist', emptyOutDir: true },
  esbuild: { jsx: 'automatic' }
});
