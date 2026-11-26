# Termlet frontend

A Phase 1 student sublet marketplace for Waterloo Region and the GTA. All listings are fictional. Documents and payments are simulated in the browser.

## Run locally

Use Node 22.12 or newer. Run `npm ci` and `npm run dev` from the repository root. For a production preview, run `npm run build` followed by `npm run preview`. Vite builds the React frontend in `site/` to `dist/`.

On **Find a sublet**, the rent histogram shows the distribution and median asking rent within the slider’s scale for the current campus, place type, household and dates. Drag a handle to change the minimum or maximum, or drag the selected range to move both. Arrow keys move a focused handle in $50 steps. Shift and an arrow move the range.

## Review a design change

Open **Design system** in the marketplace footer. **Changes** opens the manually curated iteration and component tree. Each record includes isolated captures at the adopted defaults, a decision note and a link to the component in context. On phones, use Before and After to switch captures. **Design map** links component families to the catalog. **Components** lets you edit a base or a variant, including its fill, text, border, accent hue, font and size. Try editing Button, then inspect Primary Button and Secondary Button. Choosing the inherited setting on a variant restores that property from its parent. **Adjustments** controls the shared palette, typography and panel dimensions. These experiments persist in your browser. The Components tab also remembers your selected component, search and position for the current browser tab. Direct component links open the named component.

The moon/sun button beside the Termlet logo switches between light and dark mode. Dark mode exchanges the two neutral roles and preserves both accent values. The browser remembers the choice.

Under **Components → Adaptive cursor**, adjust the rounded triangular pointer’s size, button and card ripple timing, glow radius and card edge range. A card lights up on contact. Near its edge, a circular halo around the pointer connects to the card for up to 32 px and releases when the pointer reaches another card or leaves that range. Plain links and text use their ordinary styles. Touch and reduced-motion users keep native pointer behavior.

Iteration 009 uses an original stemless triangle. Iteration 008’s arrow, visible in the design history, uses Phosphor’s Cursor Fill. [Original artwork](https://github.com/phosphor-icons/core/blob/main/assets/fill/cursor-fill.svg) · [MIT license](site/public/licenses/phosphor-icons.txt)

The palette includes ink, paper, a primary accent and a secondary accent for small highlights. Define new primitives and their parents in `site/components/catalog.js`. The marketplace and catalog use the same React components. Component edits cascade by family and property.

For each visual change, add a record in `site/design/history.js` under its iteration and UI area. Capture the same component, content, state and viewport at both revisions. Use desktop and mobile crops, store them in `site/public/history/<iteration>/`, and reuse older captures when the fixture matches. Keep all previous records and images. Added components have only an After; removed components have only a Before. A code-only migration does not create a visual change entry.

## Iterations

Follow [the project rules](agents.md/project.md). Start the next numbered branch from the previous iteration. Test desktop and mobile, commit and push. GitHub Actions builds numbered Vite branches using their lockfiles, copies earlier static previews, and publishes the highest-numbered iteration at the site root.

[Latest demo](https://hendintom.github.io/Termlet/) · [Original baseline](https://hendintom.github.io/Termlet/iterations/001-original/)
