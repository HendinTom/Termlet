# Termlet frontend rules

Termlet is a mobile-friendly student sublet marketplace for Waterloo Region and the GTA. Phase 1 uses rapid frontend prototypes to learn how students find and list housing for one or two terms. Treat planning boards as context. The user's iteration request defines the work.

## Scope

- Keep the prototype small. Use fictional data and local images. Simulate verification, document handling, payments, commissions, and vacancy support.
- Backend planning notes are in scope when needed. Backend code and real transactions are outside Phase 1. Virtual tours are deferred.
- Preserve existing desktop and mobile designs and flows except where the user requests a change. Iteration 001 includes 31 listings, galleries, filters, verification, listing submission and approval, renter requests, and both dashboards.

## Design system direction

- Plan iteration 002 around React components, Vite, shared CSS values, and static hosting.
- Maintain a map of adopted design decisions and a record of changes from the previous branch. Label experiments separately from adopted defaults.
- Provide opt-in controls for experimenting with colors and other visual settings. Keep experiments local until a change is adopted in source.

Use the editable ink, paper and accent tokens for app UI colors. Derive tints, shades, borders and translucent states in CSS.

## Iteration workflow

Design-system-only updates stay on the current iteration branch and do not add visual change records.

1. Read the README, check the branch and working tree, then branch from the latest iteration using the next numbered name. Preserve existing work and earlier iteration branches.
2. Implement the requested change. Test affected flows on desktop and mobile and compare with the preceding iteration.
3. Commit and push the completed iteration to [the repository](https://github.com/HendinTom/Termlet). Preserve GitHub Pages publishing for each numbered branch and the latest iteration at the site root.
4. Wait for deployment, verify the public preview, then share the branch name and iteration URL.

Use the [original demo](https://termlet-demo.netlify.app/) and [iteration 001 preview](https://hendintom.github.io/Termlet/iterations/001-original/) as the visual and functional baseline.

## Visual history

Make Changes the design dashboard's default view. Manually record each changed component under its iteration and UI area. Show isolated, fixed before and after captures at matching widths, data, and interaction states. Identify additions and removals explicitly. Use a mobile before/after switch and side-by-side desktop views. Keep local experiments outside the adoption history.
