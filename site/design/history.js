// Each image is a component crop captured at this iteration's adopted defaults.
// Paths belong to the record and stay fixed when the component changes again.
const capture = (name, version) => ({
  iteration: version,
  desktop: 'history/' + version + '/' + name + '-desktop.png',
  mobile: 'history/' + version + '/' + name + '-mobile.png'
});

export const iterations = [{
  id: '006', name: 'Adaptive cursor', previousPreview: 'https://hendintom.github.io/Termlet/iterations/005-cursor-glow/', changes: [
    { id: 'cursor-fill', area: 'Interactions', name: 'Adaptive cursor', status: 'Updated',
      note: 'The secondary-accent dot expands from the entry point to fill text and controls. The fill uses the dark neutral in light mode and the light neutral in dark mode.',
      before: capture('cursor-glow','005'), after: capture('cursor-fill','006'), context: '#design/components/CursorGlow' }
  ]
}, {
  id: '005', name: 'Cursor and selection', previousPreview: 'https://hendintom.github.io/Termlet/iterations/004-home-listings/', changes: [
    { id: 'cursor-glow', area: 'Interactions', name: 'Cursor glow', status: 'Added',
      note: 'A soft secondary-accent gradient follows a hovering pointer. Adjust its diameter, blur and intensity in Components. The centered sample also previews the effect on touchscreens.',
      after: capture('cursor-glow','005'), context: '#design/components/CursorGlow' },
    { id: 'accent-selection', area: 'Interactions', name: 'Accent text selection', status: 'Updated',
      note: 'Select the emphasized words in the home headline to see the secondary highlight alongside the regular primary highlight.',
      before: capture('accent-selection','004'), after: capture('accent-selection','005'), context: '#home' }
  ]
}, {
  id: '004', name: 'Home page listings', previousPreview: 'https://hendintom.github.io/Termlet/iterations/003-hex-colors/', changes: [
    { id: 'rent-explainer', area: 'Home page', name: 'How the rent works', status: 'Removed',
      note: 'The home page now leads directly from the introduction to featured student sublets.',
      before: capture('rent-explainer','003'), context: '#home' }
  ]
}, {
  id: '003', name: 'Hex color inputs', previousPreview: 'https://hendintom.github.io/Termlet/iterations/002-design-system/', changes: [
    { id: 'color-control', area: 'Design dashboard', name: 'Color picker', status: 'Updated',
      note: 'Paste a hex code beside the swatch to try an exact color in the live preview.',
      before: capture('color-control','002'), after: capture('color-control','003'), context: '#design/adjust' }
  ]
}, {
  id: '002', name: 'Design system', previousPreview: 'https://hendintom.github.io/Termlet/iterations/001-original/', changes: [
    { id: 'footer-links', area: 'Marketplace', name: 'Footer links', status: 'Updated',
      note: 'The footer now links to the design system beside the student guide, keeping the primary navigation focused on housing.',
      before: capture('footer-links','001'), after: capture('footer-links','002'), context: '#home' },
    { id: 'change-index', area: 'Design dashboard', name: 'Change index', status: 'Added',
      note: 'Group the components touched by each iteration by UI area so a reviewer can go straight to a visual change.',
      after: capture('change-index','002'), context: '#design' },
    { id: 'adjustments', area: 'Design dashboard', name: 'Adjustment controls', status: 'Added',
      note: 'Try colors, panel padding and radius against the live interface before adopting new defaults.',
      after: capture('adjustments','002'), context: '#design/adjust' },
    { id: 'map', area: 'Design dashboard', name: 'Component map', status: 'Added',
      note: 'Follow shared design values through a real listing card to the marketplace screens that use it.',
      after: capture('map','002'), context: '#design/map' }
  ]
}];
