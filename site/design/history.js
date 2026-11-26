// Each image is a component crop captured at this iteration's adopted defaults.
// Paths belong to the record and stay fixed when the component changes again.
const capture = (name, version) => ({
  iteration: version,
  desktop: 'history/' + version + '/' + name + '-desktop.png',
  mobile: 'history/' + version + '/' + name + '-mobile.png'
});

export const iterations = [{
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
