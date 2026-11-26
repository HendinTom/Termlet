import { UI } from './UI';
import { budgetCeiling, budgetKnee, budgetPositionFor, budgetValueAt } from './budgetScale';

const dollars = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 });
const binCount = 48;

function RentHistogram({ prices }) {
  const sorted = [...prices].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  const bins = Array(binCount).fill(0);
  for (const price of prices) {
    const index = Math.min(binCount - 1, Math.floor(budgetPositionFor(price) * binCount));
    bins[index]++;
  }
  const peak = Math.max(1, ...bins);
  const ranges = bins.flatMap((count, index) => {
    if (!count) return [];
    const start = dollars.format(budgetValueAt(index / binCount));
    const end = dollars.format(budgetValueAt((index + 1) / binCount));
    return [start + ' to ' + end + ': ' + count];
  });
  const bars = bins.map((count, index) => (
    <UI.BudgetBin key={index} style={{ height: (count / peak) * 100 + '%' }} />
  ));
  return (
    <UI.BudgetHistogram as="figure">
      <figcaption>
        <span>{prices.length} {prices.length === 1 ? 'listing' : 'listings'}</span>
        {prices.length > 0 && <span>Median <strong>{dollars.format(median)}</strong></span>}
      </figcaption>
      <div className="rent-plot" role="img"
        aria-label={ranges.length ? 'Listing counts by monthly rent. ' + ranges.join('. ') : 'No rents to plot'}
        style={{ '--rent-bins': binCount }}>
        <div className="rent-bars">{bars}</div>
        <div className="rent-bars in-range">{bars}</div>
      </div>
    </UI.BudgetHistogram>
  );
}

export function RentRange({ prices, children, style, describedBy }) {
  return (
    <UI.BudgetTrack style={style} aria-describedby={describedBy}>
      <RentHistogram prices={prices} />
      <UI.BudgetGlass>
        <UI.BudgetRail aria-hidden="true"><UI.BudgetSelection /></UI.BudgetRail>
        {children}
        <UI.BudgetLower aria-hidden="true" />
        <UI.BudgetUpper aria-hidden="true" />
        <UI.BudgetBubble as="output" aria-hidden="true" />
      </UI.BudgetGlass>
      <UI.BudgetAxis aria-hidden="true">
        {[0, budgetKnee, budgetCeiling].map(price => <span key={price}>{dollars.format(price)}</span>)}
      </UI.BudgetAxis>
    </UI.BudgetTrack>
  );
}
