import { useState } from 'react';
import { UI } from '../components/UI';
import { components, componentName, descendants, families, childrenOf } from '../components/catalog';
import { baseTypography, colors, fonts, fontNames, useComponentStyles, saveStyles } from './componentStyles';
import { ListingCard } from '../components/Marketplace';
import { ComponentPreview } from './ComponentPreview';

function FontOptions() {
  return Object.keys(fonts).map((key) => (
    <option key={key} value={key}>
      {fontNames[key]}
    </option>
  ));
}

export function TypographyControls() {
  const state = useComponentStyles();
  const settings = state.typography;
  function update(next) {
    saveStyles({ ...state, typography: next });
  }
  return (
    <fieldset className="type-controls">
      <legend>Typography</legend>
      {[
        ['body', 'Body font'],
        ['heading', 'Heading font']
      ].map(([key, label]) => (
        <UI.Label key={key}>
          {label}
          <UI.Select value={settings[key]} onChange={(e) => update({ ...settings, [key]: e.target.value })}>
            <FontOptions />
          </UI.Select>
        </UI.Label>
      ))}
      <UI.Label>
        Base font size <output>{settings.size}px</output>
        <UI.RangeField
          aria-label="Base font size"
          type="range"
          min="12"
          max="24"
          value={settings.size}
          onChange={(e) => update({ ...settings, size: Number(e.target.value) })}
        />
      </UI.Label>
      <UI.PlainButton onClick={() => update(baseTypography)}>Reset typography</UI.PlainButton>
    </fieldset>
  );
}

function ancestry(id) {
  const path = [];
  for (let item = components[id]; item; item = components[item.parent]) path.unshift(item.id);
  return path;
}

function ComponentList({ selected, choose, query, edits }) {
  const term = query.trim().toLowerCase();
  const path = ancestry(selected);
  function row(item) {
    const children = childrenOf(item.id);
    const matches = componentName(item.id).toLowerCase().includes(term);
    if (term && !matches && !descendants(item.id).some((c) => componentName(c.id).toLowerCase().includes(term)))
      return null;
    const link = (
      <button
        type="button"
        aria-current={selected === item.id ? 'true' : undefined}
        onClick={() => choose(item.id)}
      >
        {componentName(item.id)}
        {edits[item.id] && <small>Edited</small>}
      </button>
    );
    if (!children.length) return <li key={item.id}>{link}</li>;
    return (
      <li key={item.id}>
        <details open={term || path.includes(item.id) ? true : undefined}>
          <summary>{componentName(item.id)}</summary>
          <ul>
            <li>{link}</li>
            {children.map(row)}
          </ul>
        </details>
      </li>
    );
  }
  return <ul className="catalog-list">{families.map(row)}</ul>;
}

export function ComponentEditor({ initialId, sample, getExamples }) {
  const [id, setId] = useState(() => (Object.hasOwn(components, initialId) ? initialId : 'Button'));
  const [query, setQuery] = useState('');
  const settings = useComponentStyles();
  const edit = settings.edits[id] || {};
  const path = ancestry(id);
  function inherited(prop) {
    const parent = path
      .slice(0, -1)
      .reverse()
      .find((key) => settings.edits[key]?.[prop] !== undefined);
    return parent ? 'Inherit · ' + componentName(parent) : 'Design default';
  }
  function change(prop, value) {
    const next = { ...edit };
    if (value === '') delete next[prop];
    else next[prop] = value;
    save(next);
  }
  function save(next) {
    const edits = { ...settings.edits };
    if (Object.keys(next).length) edits[id] = next;
    else delete edits[id];
    const state = { ...settings, edits };
    saveStyles(state);
  }
  function choose(key) {
    setId(key);
    history.replaceState(null, '', '#design/components/' + key);
  }
  const explicitHue = edit.hue !== undefined;
  const hueSource = path
    .slice()
    .reverse()
    .find((key) => settings.edits[key]?.hue !== undefined);
  const hue = hueSource ? settings.edits[hueSource].hue : 0;
  return (
    <div className="catalog-layout">
      <UI.LabPanel as="aside" className="catalog-nav">
        <UI.Label>
          Find a component
          <UI.TextField
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Button, card, gallery…"
          />
        </UI.Label>
        <ComponentList selected={id} choose={choose} query={query} edits={settings.edits} />
      </UI.LabPanel>
      <div className="catalog-detail">
        <UI.LabPanel>
          <div className="component-path">
            {path.slice(0, -1).map((key) => (
              <UI.PlainButton key={key} onClick={() => choose(key)}>
                {componentName(key)} ›
              </UI.PlainButton>
            ))}
          </div>
          <UI.Heading>{componentName(id)}</UI.Heading>
          <ComponentPreview id={id} sample={sample} getExamples={getExamples} />
          <div className="component-fields">
            {[
              ['fill', 'Fill'],
              ['text', 'Text color'],
              ['border', 'Border color']
            ].map(([key, label]) => (
              <UI.Label key={key}>
                {label}
                <UI.Select value={edit[key] ?? ''} onChange={(e) => change(key, e.target.value)}>
                  <option value="">{inherited(key)}</option>
                  <option value="none">{key === 'text' ? 'Use surrounding text' : 'No color'}</option>
                  {Object.keys(colors).map((role) => (
                    <option key={role} value={role}>
                      {
                        {
                          ink: 'Ink',
                          paper: 'Paper',
                          accent: 'Primary accent',
                          secondary: 'Secondary accent',
                          tint: 'Accent tint',
                          shade: 'Accent shade',
                          secondaryTint: 'Secondary tint',
                          secondaryShade: 'Secondary shade'
                        }[role]
                      }
                    </option>
                  ))}
                </UI.Select>
              </UI.Label>
            ))}
            <UI.Label>
              Component font
              <UI.Select value={edit.font ?? ''} onChange={(e) => change('font', e.target.value)}>
                <option value="">{inherited('font')}</option>
                <FontOptions />
              </UI.Select>
            </UI.Label>
            <UI.Label>
              Component text size
              <UI.Select
                value={edit.size ?? ''}
                onChange={(e) => change('size', e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">{inherited('size')}</option>
                {[12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64].map((n) => (
                  <option key={n} value={n}>
                    {n}px at base 16
                  </option>
                ))}
              </UI.Select>
            </UI.Label>
            <div>
              <UI.Label>
                Accent hue <output>{hue}°</output>
                <UI.RangeField
                  aria-label="Accent hue"
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={hue}
                  onChange={(e) => change('hue', Number(e.target.value))}
                />
              </UI.Label>
              {explicitHue && <UI.PlainButton onClick={() => change('hue', '')}>Inherit hue</UI.PlainButton>}
            </div>
          </div>
          <UI.PlainButton disabled={!Object.keys(edit).length} onClick={() => save({})}>
            Reset this component
          </UI.PlainButton>
        </UI.LabPanel>
        {childrenOf(id).length > 0 && (
          <UI.LabPanel>
            <UI.Heading>Variants</UI.Heading>
            <div className="variant-links">
              {childrenOf(id).map((c) => (
                <UI.PlainButton key={c.id} onClick={() => choose(c.id)}>
                  {componentName(c.id)}
                </UI.PlainButton>
              ))}
            </div>
          </UI.LabPanel>
        )}
        <UI.LabPanel>
          <UI.Heading>Marketplace preview</UI.Heading>
          <div className="sample-card">
            <ListingCard item={sample} />
          </div>
          <UI.ViewLink href="#browse">View search results ↗</UI.ViewLink>
        </UI.LabPanel>
      </div>
    </div>
  );
}
