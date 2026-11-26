// Each image is a component crop captured at this iteration's adopted defaults.
// Paths belong to the record and stay fixed when the component changes again.
const capture = (name, version) => ({
  iteration: version,
  desktop: 'history/' + version + '/' + name + '-desktop.png',
  mobile: 'history/' + version + '/' + name + '-mobile.png'
});

export const iterations = [{
  id: '010', name: 'Layered rent filter', previousPreview: 'https://hendintom.github.io/Termlet/iterations/009-soft-pointer/', changes: [
    { id: 'rent-range', area: 'Marketplace', name: 'Monthly rent filter', status: 'Updated',
      note: 'Two handles sit on a translucent rail in front of the rent distribution. Both captures show a monthly budget of $850 to $2,200.',
      before: capture('rent-range', '009'), after: capture('rent-range', '010'), context: '#browse' },
    { id: 'rent-histogram', area: 'Marketplace', name: 'Rent histogram', status: 'Added',
      note: 'Bars show the monthly asking rents for listings matching the other search filters. The selected budget highlights the corresponding portion of the chart.',
      after: capture('rent-histogram', '010'), context: '#design/components/BudgetHistogram' }
  ]
}, {
  id: '009', name: 'Soft pointer and hero hover', previousPreview: 'https://hendintom.github.io/Termlet/iterations/008-card-glow/', changes: [
    { id: 'pointer', area: 'Interactions', name: 'Adaptive cursor', status: 'Updated',
      note: 'A compact triangle with three rounded corners marks the pointer position.',
      before: capture('pointer','008'), after: capture('pointer','009'), context: '#design/components/CursorGlow' },
    { id: 'card-edge', area: 'Marketplace', name: 'Card edge glow', status: 'Updated',
      note: 'A circular halo surrounds the pointer as it pulls away from a card. The connection starts on contact and now reaches up to 32 px.',
      before: capture('card-edge','008'), after: capture('card-edge','009'), context: '#browse' },
    { id: 'hero-image', area: 'Home page', name: 'Spotlight photo', status: 'Updated',
      note: 'Hovering the photo underlines the room title. Keyboard focus appears around the caption link in both themes. Both captures use a hovering mouse.',
      before: capture('hero-image','008'), after: capture('hero-image','009'), context: '#home' }
  ]
}, {
  id: '008', name: 'Card edge glow', previousPreview: 'https://hendintom.github.io/Termlet/iterations/007-pointer-emphasis/', changes: [
    { id: 'pointer', area: 'Interactions', name: 'Adaptive cursor', status: 'Updated',
      note: 'The pointer has an arrowhead and stem. Only buttons and other fillable surfaces use the ripple.',
      before: capture('pointer','007'), after: capture('pointer','008'), context: '#design/components/CursorGlow' },
    { id: 'card-edge', area: 'Marketplace', name: 'Card edge glow', status: 'Updated',
      note: 'After contact, the card glow follows the pointer a short distance into the gap. Both captures show a mouse just outside the first card.',
      before: capture('card-edge','007'), after: capture('card-edge','008'), context: '#browse' },
    { id: 'price-row', area: 'Marketplace', name: 'Listing price row', status: 'Updated',
      note: 'The footer shows the monthly price. The photo and listing title open the room.',
      before: capture('price-row','007'), after: capture('price-row','008'), context: '#browse' }
  ]
}, {
  id: '007', name: 'Pointer emphasis', previousPreview: 'https://hendintom.github.io/Termlet/iterations/006-cursor-fill/', changes: [
    { id: 'pointer', area: 'Interactions', name: 'Adaptive cursor', status: 'Updated',
      note: 'A rounded triangular pointer follows the mouse. Text links keep their secondary-accent ripple. Headings and body copy use ordinary text selection.',
      before: capture('cursor-fill','006'), after: capture('pointer','007'), context: '#design/components/CursorGlow' },
    { id: 'button-hover', area: 'Interactions', name: 'Button hover', status: 'Updated',
      note: 'Hovering a button expands a soft glow from its entry edge and slightly enlarges the button. Both widths show the mouse interaction.',
      before: capture('button-hover','006'), after: capture('button-hover','007'), context: '#home' },
    { id: 'card-hover', area: 'Marketplace', name: 'Listing card hover', status: 'Updated',
      note: 'Listing cards lift into a small secondary-accent glow. Their text links use the lighter link treatment. Both widths show the mouse interaction.',
      before: capture('card-hover','006'), after: capture('card-hover','007'), context: '#browse' }
  ]
}, {
  id: '006', name: 'Adaptive cursor', previousPreview: 'https://hendintom.github.io/Termlet/iterations/005-cursor-glow/', changes: [
    { id: 'cursor-fill', area: 'Interactions', name: 'Adaptive cursor', status: 'Updated',
      note: 'The larger dot ripples through a whole heading or link and through individual words in paragraphs. Each letter holds the secondary accent until the pointer leaves. Buttons fill dark in light mode and light in dark mode.',
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
