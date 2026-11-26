import { useEffect, useState } from 'react';
import { loadSpecimens } from './specimens';
import { CursorGlow } from '../components/CursorGlow';
import { ThemeToggle } from '../components/ThemeToggle';
import { UI } from '../components/UI';
import { components, componentName } from '../components/catalog';
import { ListingCard, PriceRow } from '../components/Marketplace';
import { Gallery } from '../components/Gallery';
import { PaymentTable } from '../components/PaymentTable';
import './specimen.css';

const inputTypes = {
  ColorField: 'color',
  RangeField: 'range',
  FileField: 'file',
  Radio: 'radio',
  Checkbox: 'checkbox',
  NumberField: 'number',
  PickerSearch: 'search'
};
const photos = [
  { src: 'room.jpg', label: 'Bedroom', alt: 'Sample bedroom' },
  { src: 'gallery/sample-1.webp', label: 'Kitchen', alt: 'Sample kitchen' }
];
const bills = [
  { key: '2027-01', amount: 850, paid: 850, confirmed: true },
  { key: '2027-02', amount: 850, paid: 0, confirmed: true }
];

function ButtonSet() {
  return (
    <div className="actions">
      <UI.PrimaryButton>Request dates</UI.PrimaryButton>
      <UI.SecondaryButton>View listing</UI.SecondaryButton>
      <UI.PlainButton>Clear filters</UI.PlainButton>
    </div>
  );
}
function BudgetExample() {
  return (
    <div className="market-filters specimen-budget">
      <UI.BudgetField>
        <legend>Monthly rent (CAD)</legend>
        <UI.BudgetTrack style={{ '--low': 0.2, '--high': 0.8, '--active-position': 0.8 }}>
          <UI.BudgetRail>
            <UI.BudgetSelection />
          </UI.BudgetRail>
          <UI.BudgetLower />
          <UI.BudgetUpper />
          <UI.BudgetBubble style={{ opacity: 1 }}>$1,200</UI.BudgetBubble>
          <UI.BudgetAxis>
            <span>$0</span>
            <span>$4,500</span>
            <span>$10,000</span>
          </UI.BudgetAxis>
        </UI.BudgetTrack>
        <UI.BudgetEndpoints>
          <span>Minimum</span>
          <span>Maximum</span>
        </UI.BudgetEndpoints>
      </UI.BudgetField>
    </div>
  );
}
function Specimen({ id, sample, examples }) {
  const item = components[id],
    Part = UI[id];
  let family = item;
  while (family.parent) family = components[family.parent];
  if (id === 'CursorGlow') return <CursorGlow specimen />;
  if (id === 'ThemeToggle') return <ThemeToggle/>;
  if (id === 'CardBottom')
    return <PriceRow price={sample.price} />;
  if (
    [
      'Card',
      'ListingCard',
      'Featured',
      'GridCards',
      'Copy',
      'CardImageLink',
      'RoomTile',
      'RoomPic',
      'SheetView'
    ].includes(id)
  )
    return <ListingCard item={sample} />;
  if (
    id === 'PhotoGallery' ||
    id.startsWith('Gallery') ||
    ['ThumbnailButton', 'NextPhoto', 'PreviousPhoto'].includes(id)
  )
    return <Gallery photos={photos} />;
  if (family.id === 'Table' || ['PaymentTable', 'PaymentButton', 'PaidStatus', 'PaymentStatus'].includes(id))
    return <PaymentTable bills={bills} scope="preview" dueDate={(d) => d} money={(n) => '$' + n} />;
  if (family.id === 'BudgetControl' || id === 'BudgetField') return <BudgetExample />;
  if (id === 'Button' || id === 'ActionButton') return <ButtonSet />;
  const actual = examples?.get(id);
  if (id === 'HeroSponsored' && actual) return <div className="hero specimen-hero">{actual}</div>;
  if (id === 'Skip') return <UI.Skip href="#main">Skip to content</UI.Skip>;
  if (id === 'Arrow') return <UI.Arrow aria-hidden="true">↗</UI.Arrow>;
  if (id === 'MarkBar')
    return (
      <UI.Mark>
        {[0, 1, 2].map((n) => (
          <UI.MarkBar key={n} />
        ))}
      </UI.Mark>
    );
  if (id === 'PickerCheck')
    return (
      <UI.PickerOption aria-selected="true" role="option">
        <span>University of Waterloo</span>
        <UI.PickerCheck
          as="svg"
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="m5 10 3.5 3.5L15 7" />
        </UI.PickerCheck>
      </UI.PickerOption>
    );
  if (id === 'MobileSides' || id === 'ComparisonButton')
    return (
      <UI.MobileSides>
        <UI.ComparisonButton aria-pressed="false">Before</UI.ComparisonButton>
        <UI.ComparisonButton aria-pressed="true">After</UI.ComparisonButton>
      </UI.MobileSides>
    );
  if (id === 'MapTools' || id === 'MapButton')
    return (
      <UI.MapTools>
        <UI.MapButton aria-label="Zoom out">−</UI.MapButton>
        <output>100%</output>
        <UI.MapButton aria-label="Zoom in">+</UI.MapButton>
        <UI.MapButton>Fit</UI.MapButton>
      </UI.MapTools>
    );
  if (id === 'MapBoard')
    return (
      <UI.MapBoard>
        {['Foundations', 'Components', 'Screens'].map((name) => (
          <section key={name}>
            <UI.Heading as="h3">{name}</UI.Heading>
          </section>
        ))}
      </UI.MapBoard>
    );
  if (actual && id !== 'PickerClose') return actual;
  if (family.id === 'Button')
    return (
      <Part type="button">
        {{
          PrimaryButton: 'Request dates',
          SecondaryButton: 'View listing',
          PlainButton: 'Clear filters',
          PickerTrigger: 'All campuses ▾',
          PickerClose: '×'
        }[id] || componentName(id)}
      </Part>
    );
  if (family.id === 'Field') {
    if (id === 'Select')
      return (
        <Part defaultValue="Waterloo">
          <option>Waterloo</option>
          <option>Toronto</option>
        </Part>
      );
    const type = inputTypes[id] || 'text';
    return (
      <Part
        type={type}
        aria-label={componentName(id)}
        defaultValue={
          {
            text: 'Waterloo',
            search: 'Waterloo',
            number: 850,
            color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
          }[type]
        }
      />
    );
  }
  if (family.id === 'Link') return <Part href="#browse">Find a sublet ↗</Part>;
  if (family.id === 'Media')
    return (
      <Part as="div">
        <img className="specimen-photo" src={sample.image} alt={sample.room.title} />
      </Part>
    );
  if (family.id === 'Badge')
    return (
      <Part as="span">
        {{
          SponsorBadge: 'Sponsored · Featured',
          Pill: 'Approved',
          LuxuryTag: 'Luxury',
          StudentStatus: 'Student verified',
          Amenity: 'Furnished'
        }[id] || 'Active'}
      </Part>
    );
  if (family.id === 'Text' || family.id === 'Heading')
    return (
      <Part>
        {{
          Error: 'Choose a campus to continue.',
          FilterError: 'Choose a valid date range.',
          Kicker: 'Student sublets'
        }[id] || sample.room.title}
      </Part>
    );
  if (family.id === 'Icon')
    return (
      <Part as="span">
        {id === 'Mark' ? (
          <>
            <i />
            <i />
            <i />
          </>
        ) : id === 'BrandDot' ? (
          '.'
        ) : (
          '↗'
        )}
      </Part>
    );
  if (family.id === 'Form' || family.id === 'Label' || family.id === 'FieldGroup')
    return (
      <Part>
        <span>Campus</span>
        <UI.Select aria-label="Campus">
          <option>Waterloo</option>
        </UI.Select>
      </Part>
    );
  if (family.id === 'Row')
    return (
      <Part>
        <span>Monthly rent</span> <strong>{sample.price}</strong>
      </Part>
    );
  if (family.id === 'PickerPart') return <Part>University of Waterloo</Part>;
  if (family.id === 'Notice') return <Part>Fictional listing · Demo</Part>;
  if (family.id === 'Navigation')
    return (
      <Part>
        <UI.ViewLink href="#browse">Find a sublet</UI.ViewLink>
      </Part>
    );
  return (
    <Part as="section" className="component-example">
      <UI.Kicker>Waterloo Region</UI.Kicker>
      <UI.Heading>{sample.room.title}</UI.Heading>
      <UI.Text>{sample.price} / month</UI.Text>
    </Part>
  );
}

export function ComponentPreview({ id, sample, getExamples }) {
  const [examples, setExamples] = useState(null);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setExamples(loadSpecimens(getExamples));
    });
    return () => {
      active = false;
    };
  }, [getExamples]);
  return (
    <div className="component-specimen" inert>
      <Specimen id={id} sample={sample} examples={examples} />
    </div>
  );
}
