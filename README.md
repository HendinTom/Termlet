# Termlet frontend

A Phase 1 student sublet marketplace for Waterloo Region and the GTA. All listings are fictional. Documents and payments are simulated in the browser.

## Run locally

Use Node 22.12 or newer. Run `npm ci` and `npm run dev` from the repository root. For a production preview, run `npm run build` followed by `npm run preview`. Vite builds the React frontend in `site/` to `dist/`.

## Review a design change

Open **Design system** in the marketplace footer. **Changes** opens the manually curated iteration and component tree. Each record includes isolated captures at the adopted defaults, a decision note and a link to the component in context. On phones, use Before and After to switch captures. **Design map** shows shared values, components and their marketplace screens. **Adjustments** applies experimental colors, panel padding and radius to this iteration in your browser. Reset to defaults clears the experiment.

For each visual change, add a record in `site/design/history.js` under its iteration and UI area. Capture the same component, content, state and viewport at both revisions. Use desktop and mobile crops, store them in `site/public/history/<iteration>/`, and reuse older captures when the fixture matches. Keep all previous records and images. Added components have only an After; removed components have only a Before. A code-only migration does not create a visual change entry.

## Iterations

Follow [the project rules](agents.md/project.md). Start the next numbered branch from the previous iteration. Test desktop and mobile, commit and push. GitHub Actions builds numbered Vite branches using their lockfiles, copies earlier static previews, and publishes the highest-numbered iteration at the site root.

[Latest demo](https://hendintom.github.io/Termlet/) · [Original baseline](https://hendintom.github.io/Termlet/iterations/001-original/)
