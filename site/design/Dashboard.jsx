import { baseTypography, saveStyles, useComponentStyles } from './componentStyles';
import { ComponentEditor, TypographyControls } from './ComponentEditor';
import { families, componentName } from '../components/catalog';
import { UI } from '../components/UI';
import { useLayoutEffect, useRef, useState } from 'react';
import { ListingCard, PriceRow } from '../components/Marketplace';
import { ColorControl } from './ColorControl';
import { iterations } from './history';
import { tokens, useTokens, saveTokens } from './tokens';

function ChangeIndex({ iteration, selected }) {
  const areas = [...new Set(iteration.changes.map((c) => c.area))];
  return (
    <UI.ChangeIndex as="aside" aria-label="Change index">
      <UI.Label>
        Iteration
        <UI.Select value={iteration.id} onChange={(e) => (location.hash = 'design/changes/' + e.target.value)}>
          {iterations.map((i) => (
            <option key={i.id} value={i.id}>
              {i.id} · {i.name}
            </option>
          ))}
        </UI.Select>
      </UI.Label>
      {areas.map((area) => (
        <details open key={area}>
          <summary>{area}</summary>
          <ul>
            {iteration.changes
              .filter((c) => c.area === area)
              .map((c) => (
                <li key={c.id}>
                  <UI.Link
                    aria-current={selected.id === c.id ? 'page' : undefined}
                    href={'#design/changes/' + iteration.id + '/' + c.id}
                  >
                    {c.name}
                    <UI.Text as="small">{c.status}</UI.Text>
                  </UI.Link>
                </li>
              ))}
          </ul>
        </details>
      ))}
    </UI.ChangeIndex>
  );
}

function Comparison({ iteration, change }) {
  const [side, setSide] = useState(change.after ? 'After' : 'Before');
  return (
    <UI.Comparison>
      <UI.Kicker as="span">
        {change.area} / {change.status}
      </UI.Kicker>
      <UI.Heading>{change.name}</UI.Heading>
      <UI.Text>{change.note}</UI.Text>
      <UI.MobileSides>
        {['Before', 'After'].map((label) => (
          <UI.Button key={label} aria-pressed={side === label} onClick={() => setSide(label)}>
            {label}
          </UI.Button>
        ))}
      </UI.MobileSides>
      <UI.CompareGrid>
        {['Before', 'After'].map((label) => {
          const snap = change[label.toLowerCase()];
          return (
            <figure key={label} className={side === label ? 'visible' : ''}>
              <figcaption>
                {label}
                <UI.Text as="small">{snap ? 'Iteration ' + snap.iteration : 'Component absent'}</UI.Text>
              </figcaption>
              <UI.Capture>
                {snap ? (
                  <picture>
                    <source media="(max-width: 700px)" srcSet={snap.mobile} />
                    <UI.Image src={snap.desktop} alt={change.name + ' in iteration ' + snap.iteration} />
                  </picture>
                ) : (
                  <span>
                    {label === 'Before' ? 'Introduced in ' : 'Removed in '}
                    {iteration.id}
                  </span>
                )}
              </UI.Capture>
            </figure>
          );
        })}
      </UI.CompareGrid>
      <UI.ComparisonLinks>
        <UI.ViewLink href={change.context}>View in context ↗</UI.ViewLink>
        <UI.Back href={iteration.previousPreview}>Open previous iteration ↗</UI.Back>
      </UI.ComparisonLinks>
    </UI.Comparison>
  );
}

function Adjustments({ sample }) {
  const values = useTokens();
  const styles=useComponentStyles();
  const [resetCount, setResetCount] = useState(0);
  function update(next) {
    saveTokens(next);
  }
  return (
    <UI.LabLayout>
      <UI.AdjustmentControls>
        <UI.Heading>Adjustments</UI.Heading>
        <UI.Text>Saved in this browser for iteration {iterations[0].id}.</UI.Text>
        {tokens.map((t) =>
          !t.max ? (
            <ColorControl
              key={t.key + resetCount}
              name={t.name}
              value={values[t.key]}
              onChange={(color) => update({ ...values, [t.key]: color })}
            />
          ) : (
            <UI.Label key={t.key}>
              {t.name}
              <output>
                {values[t.key]}
                {t.max ? 'px' : ''}
              </output>
              <UI.RangeField
                aria-label={t.name}
                type="range"
                min={t.min || 0}
                max={t.max}
                value={values[t.key]}
                onChange={(e) => update({ ...values, [t.key]: Number(e.target.value) })}
              />
            </UI.Label>
          )
        )}
        <TypographyControls />
        <UI.PlainButton
          onClick={() => {
            update(Object.fromEntries(tokens.map((t) => [t.key, t.initial])));
            saveStyles({...styles,typography:baseTypography});
            setResetCount((n) => n + 1);
          }}
        >
          Reset to defaults
        </UI.PlainButton>
      </UI.AdjustmentControls>
      <UI.LabPanel>
        <UI.Heading>Live preview</UI.Heading>
        <UI.LiveGrid>
          <ListingCard item={sample} />
          <UI.Panel as="div">
            <UI.MetricLabel>Monthly sublet rent</UI.MetricLabel>
            <UI.Heading>
              {sample.price} <UI.Text as="small">/ month</UI.Text>
            </UI.Heading>
            <UI.PrimaryButton as="a" href="#room/sample">
              Open listing
            </UI.PrimaryButton>
          </UI.Panel>
        </UI.LiveGrid>
      </UI.LabPanel>
    </UI.LabLayout>
  );
}

function DesignMap({ sample }) {
  const values = useTokens();
  const viewport = useRef(null),
    board = useRef(null),
    drag = useRef(null);
  const [zoom, setZoom] = useState(1),
    [size, setSize] = useState({ width: 0, height: 0 });
  function fit() {
    if (board.current && viewport.current) {
      const width = (viewport.current.clientWidth - 32) / board.current.offsetWidth;
      const height = (viewport.current.clientHeight - 32) / board.current.offsetHeight;
      setZoom(Math.min(1, width, height));
    }
    viewport.current?.scrollTo(0, 0);
  }
  useLayoutEffect(() => {
    const measure = () => setSize({ width: board.current.offsetWidth, height: board.current.offsetHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(board.current);
    measure();
    fit();
    return () => observer.disconnect();
  }, []);
  return (
    <UI.MapPanel>
      <UI.LabHeading>
        <UI.Heading>Component map</UI.Heading>
        <UI.MapTools>
          <UI.Button aria-label="Zoom out" onClick={() => setZoom(Math.max(0.5, zoom - 0.15))}>
            −
          </UI.Button>
          <output>{Math.round(zoom * 100)}%</output>
          <UI.Button aria-label="Zoom in" onClick={() => setZoom(Math.min(2, zoom + 0.15))}>
            +
          </UI.Button>
          <UI.Button onClick={fit}>Fit</UI.Button>
        </UI.MapTools>
      </UI.LabHeading>
      <UI.MapViewport
        ref={viewport}
        tabIndex="0"
        aria-label="Component map canvas"
        onPointerDown={(e) => {
          if (e.button !== 0 || e.target.closest('a,button') || matchMedia('(max-width:700px)').matches) return;
          drag.current = [e.clientX, e.clientY, e.currentTarget.scrollLeft, e.currentTarget.scrollTop];
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) {
            const [x, y, left, top] = drag.current;
            e.currentTarget.scrollTo(left + x - e.clientX, top + y - e.clientY);
          }
        }}
        onLostPointerCapture={() => (drag.current = null)}
      >
        <UI.MapSize style={{ width: size.width * zoom, height: size.height * zoom }}>
          <UI.MapBoard ref={board} style={{ transform: 'scale(' + zoom + ')' }}>
            <section>
              <UI.Heading as="h3">Foundations</UI.Heading>
              <UI.MapNode as="div">
                <UI.Heading as="h4">Color &amp; surface</UI.Heading>
                {tokens.map((t) => (
                  <UI.TokenLine key={t.key}>
                    {t.max ? (
                      <i className="dimension">↔</i>
                    ) : (
                      <i style={{ background: 'var(' + t.key + ')' }} />
                    )}
                    {t.name}
                    <UI.Text as="small">
                      {values[t.key]}
                      {t.max ? 'px' : ''}
                    </UI.Text>
                  </UI.TokenLine>
                ))}
                <UI.ViewLink href="#design/adjust">Try adjustments →</UI.ViewLink>
              </UI.MapNode>
            </section>
            <section>
              <UI.Heading as="h3">Components</UI.Heading>
              <UI.MapNode as="div" className="family-map">
                {families.map((f) => (
                  <UI.Link key={f.id} href={'#design/components/' + f.id}>
                    {componentName(f.id)}
                  </UI.Link>
                ))}
              </UI.MapNode>
              <ListingCard item={sample} />
              <UI.MapNode as="div">
                <UI.Heading as="h4">Listing card / Price row</UI.Heading>
                <PriceRow price={sample.price} title={sample.room.title} href="#room/sample" />
              </UI.MapNode>
            </section>
            <section>
              <UI.Heading as="h3">Screens</UI.Heading>
              <UI.MapNode as="div">
                <UI.Heading as="h4">Listing discovery</UI.Heading>
                <UI.Link href="#home">Homepage highlights ↗</UI.Link>
                <UI.Link href="#browse">Search results ↗</UI.Link>
              </UI.MapNode>
              <UI.MapNode as="div">
                <UI.Heading as="h4">Listing destination</UI.Heading>
                <UI.Link href="#room/sample">Room detail ↗</UI.Link>
              </UI.MapNode>
            </section>
          </UI.MapBoard>
        </UI.MapSize>
      </UI.MapViewport>
    </UI.MapPanel>
  );
}

export function DesignDashboard({ route, sample, getExamples }) {
  const [, tab = 'changes', id, component] = route.split('/');
  const iteration = iterations.find((i) => i.id === id) || iterations[0];
  const selected = iteration.changes.find((c) => c.id === component) || iteration.changes[0];
  return (
    <UI.DesignDashboard as="div">
      <UI.PageHead as="header">
        <UI.Back href="#home">← Marketplace</UI.Back>
        <UI.PageTitle>Design system</UI.PageTitle>
      </UI.PageHead>
      <UI.LabTabs aria-label="Design system views">
        {[
          ['changes', 'Changes'],
          ['map', 'Design map'],
          ['components', 'Components'],
          ['adjust', 'Adjustments']
        ].map(([key, name]) => (
          <UI.Link key={key} href={'#design/' + key} aria-current={tab === key ? 'page' : undefined}>
            {name}
          </UI.Link>
        ))}
      </UI.LabTabs>
      {tab === 'components' ? (
        <ComponentEditor getExamples={getExamples} initialId={id} sample={sample} />
      ) : tab === 'map' ? (
        <DesignMap sample={sample} />
      ) : tab === 'adjust' ? (
        <Adjustments sample={sample} />
      ) : (
        <UI.LabLayout>
          <ChangeIndex iteration={iteration} selected={selected} />
          <Comparison iteration={iteration} change={selected} />
        </UI.LabLayout>
      )}
    </UI.DesignDashboard>
  );
}
