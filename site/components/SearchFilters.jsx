import { MarketSelect } from './Picker';
import { UI } from './UI';
import { termletRegions } from '../catalog';
import { PageHead } from './StudentCheck';

function SelectField({ label, name, value, children, className }) {
  return (
    <UI.Label className={className}>
      {label}
      <MarketSelect name={name} defaultValue={value}>
        {children}
      </MarketSelect>
    </UI.Label>
  );
}

export function SearchFilters({ current, terms, months, households, budget }) {
  const regions = Object.entries(termletRegions);
  const options = (pairs) =>
    pairs.map(([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    ));
  return (
    <>
      <PageHead
        title="Find a sublet"
        description="Find a place for your full term in Waterloo Region or the Greater Toronto Area."
      />
      <UI.MarketFilters className="filters" id="filter-form" noValidate>
        <SelectField name="school" label="Campus or region" value={current.school}>
          <option value="">All campuses and regions</option>
          <optgroup label="By region">{options(regions.map(([key, r]) => ['region:' + key, r.name]))}</optgroup>
          {regions.map(([key, r]) => (
            <optgroup key={key} label={r.name + ' campuses'}>
              {options(r.campuses.map((c) => [c, c]))}
            </optgroup>
          ))}
        </SelectField>
        <SelectField name="placeType" label="Place type" value={current.type}>
          {options([
            ['', 'Any type'],
            ['entire', 'Entire place'],
            ['private', 'Private room']
          ])}
        </SelectField>
        <SelectField name="term" label="Sublet term" value={current.term}>
          {options([['', 'Any term'], ...terms, ['custom', 'Choose months…']])}
        </SelectField>
        <SelectField name="household" label="Household" className="household-filter" value={current.household}>
          {options([['', 'No preference'], ...households])}
        </SelectField>
        {budget}
        <UI.CustomMonths id="custom-months" hidden={current.term !== 'custom'}>
          {['from', 'until'].map((name, i) => (
            <SelectField key={name} name={name} label={i ? 'Last month' : 'First month'} value={current[name]}>
              {options([['', 'Any month'], ...months])}
            </SelectField>
          ))}
          <UI.Help>Choose the first or last month of the listed term, or both.</UI.Help>
        </UI.CustomMonths>
        <UI.FilterError id="filter-error" role="alert" />
      </UI.MarketFilters>
      <section id="search-results" aria-label="Search results" />
    </>
  );
}
