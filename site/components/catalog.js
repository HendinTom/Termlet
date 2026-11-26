// Each family is a shared style contract. Selectors also cover markup produced
// by the marketplace's form and payment controllers.
const definitions = [];
function define(id, tag, selector, parent = null, classes = '') {
  definitions.push({ id, tag, selector, parent, classes });
}
function variants(parent, tag, entries) {
  for (const [id, selector, classes] of entries) define(id, tag, selector, parent, classes ?? '');
}
function classes(parent, tag, names) {
  for (const name of names.split(' ')) {
    const id = name.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join('');
    define(id, tag, '.' + name, parent, name);
  }
}

define('Button','button','button, .btn');
define('ThemeToggle','button','.theme-toggle','Button','theme-toggle');
define('ActionButton','button','.btn','Button','btn');
define('PrimaryButton','button','.btn:not(.alt)','ActionButton');
define('SecondaryButton','button','.btn.alt','ActionButton','alt');
classes('Button','button','plain-button picker-trigger picker-close gallery-arrow');
define('PhotoChoice','button','.photo-choice','PlainButton','photo-choice');
variants('GalleryArrow','button',[['PreviousPhoto','.gallery-arrow.previous','previous'],['NextPhoto','.gallery-arrow.next','next']]);
variants('Button','button',[
  ['ThumbnailButton','.gallery-thumbs button'],['RemovePhoto','.upload-thumb button'],

  ['MapButton','.map-tools button'],['ComparisonButton','.mobile-sides button']
]);
variants('PlainButton','button',[['PaymentButton','button[data-pay]'],['DocumentButton','button[data-sample-doc],button[data-remove-doc]']]);
define('Link','a','a:not(.btn)');
classes('Link','a','view-link back inline brand skip card-image-link hero-image-link');
define('LocalSource','a','.local-source','Inline','local-source');
variants('Link','a',[['NavigationLink','.top nav a'],['DesignTab','.lab-tabs a'],['ChangeLink','.change-index li a'],['FooterLink','.footer-links a']]);

define('Field','input','input,select,textarea');
variants('Field','input',[
  ['TextField','input:not([type]),input[type=text]'],['NumberField','input[type=number]'],['FileField','input[type=file]'],
  ['ColorField','input[type=color]'],['RangeField','input[type=range]'],['Checkbox','input[type=checkbox]'],
  ['Radio','input[type=radio]'],['PickerSearch','.picker-search','picker-search']
]);
define('Select','select','select,select + .picker-trigger','Field');
define('Label','label','label,legend');
classes('Label','label','check-line promotion-card self-description');
define('FieldGroup','fieldset','fieldset');
classes('FieldGroup','fieldset','budget-field household-fields month-field promotion-options');
define('Form','form','form');
classes('Form','form','market-filters');
define('FilterPicker','dialog','.picker-window','Surface','picker-window');
classes('Surface','section','panel card empty lab-panel map-node');
define('Surface','section',null);
define('ListingCard','article','.listing-card','Card','listing-card');
classes('Panel','section','side detail-room payments-panel guide-copy');
classes('Surface','section','document-panel');
define('RequestPanel','aside','.request-panel','Side','request-panel');
classes('LabPanel','section','adjustment-controls change-index comparison map-panel');
define('Badge','span',null);
classes('Badge','span','pill luxury-tag sponsor-badge student-status payment-status');
define('PaidStatus','span','.payment-status.paid','PaymentStatus','paid');
define('Amenity','li','.amenities li','Badge');

define('Heading','h2','h1,h2,h3,h4');
classes('Heading','h1','page-title');
classes('Heading','h3','card-title portal-title');
define('HeroTitle','h1','.hero h1','Heading');
define('Text','p','p,small');
classes('Text','p','lede intro help footnote meta kicker metric-label error card-place card-campus card-household card-facts promotion-detail promotion-cost market-note review-summary budget-summary budget-hint');
define('FilterError','p','.filter-error','Error','filter-error');
define('Notice','div',null);
classes('Notice','div','demo-note status-note storage-status sponsor-disclosure');
define('Row','div',null);
classes('Row','div','card-bottom data-row document-item step stage token-line');
define('TotalRow','div','.data-row.total','DataRow','total');
define('Metric','div','.portal-metrics > div','Row');

define('Media','figure',null);
classes('Media','div','photo-gallery gallery-stage gallery-main gallery-thumbs gallery-caption room-pic sheet-view hero-sponsored hero-caption photo-caption photo-preview upload-thumb sidebar-photo');
define('Image','img','img','Media');
define('RoomTile','div','.room-tile','RoomPic','room-tile');
define('CursorGlow','span','.cursor-glow',null,'cursor-glow');
define('Icon','span',null);
classes('Icon','span','mark brand-dot arrow picker-check');
define('MarkBar','i','.mark i','Icon');
define('BudgetControl','div',null);
classes('BudgetControl','div','budget-track budget-rail budget-selection budget-handle budget-bubble budget-axis budget-endpoints');
classes('BudgetHandle','span','budget-lower budget-upper');
define('PickerPart','div',null);
classes('PickerPart','div','picker-header picker-search-wrap picker-options picker-group picker-option picker-empty');
define('Table','table','table');
variants('Table','tr',[['TableRow','tr']]);
define('HeaderCell','th','th','Table');
define('TableCell','td','td','Table');

define('Section','section',null);
classes('Section','section','hero featured guide-callout page-head section-head result-summary portal-metrics monthly offer preview-math household-details payment-table');
define('Layout','div',null);
classes('Layout','div','shell actions fields input-pair grid-cards stay-cards document-inputs document-list promotion-grid custom-months resource-links amenities copy footer-links color-control color-inputs lab-layout lab-heading live-grid compare-grid comparison-links mobile-sides capture map-viewport map-board map-size map-tools');
define('Columns','div','.layout','Layout','layout');
define('SidebarLayout','div','.layout.details','Columns','details');
define('Navigation','nav','nav');
classes('Navigation','nav','nav lab-tabs');
define('PageHeader','header','.top','Section','top');
define('PageFooter','footer','.footer','Section','footer');
define('AppScreen','main','main');
variants('AppScreen','section',[['DesignDashboard','.design','design'],['SearchResults','#search-results'],['MarketplaceContent','main:not(:has(.design))']]);

classes('Layout','div','catalog-layout catalog-detail component-fields component-path variant-links family-map sample-card');
classes('LabPanel','section','catalog-nav');
classes('Surface','div','component-specimen');
classes('FieldGroup','fieldset','type-controls');
define('ComponentTree','ul','.catalog-list','Navigation','catalog-list');
define('CatalogButton','button','.catalog-list button','Button');
for (const [id, route] of Object.entries({
  HomeScreen:'home', SearchScreen:'browse', RoomScreen:'room', ListingForm:'list', OwnerDashboard:'dashboard',
  RenterDashboard:'stay', Applications:'stays', StudentGuide:'guide', Verification:'verify'
})) define(id,'main','main[data-screen="'+route+'"]','MarketplaceContent');

export const components = Object.fromEntries(definitions.map(item=>[item.id,item]));
export const families = definitions.filter(item=>!item.parent);
export const childrenOf = id => definitions.filter(item=>item.parent===id);
export function descendants(id) {
  return [components[id], ...childrenOf(id).flatMap(child=>descendants(child.id))];
}
export const componentName = id => id === 'CursorGlow' ? 'Adaptive cursor' : id.replace(/([a-z])([A-Z])/g,'$1 $2');
