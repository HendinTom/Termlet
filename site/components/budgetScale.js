export const budgetKnee = 4500;
export const budgetCeiling = 10000;

// The affordable end gets three quarters of the rail. The quadratic segment
// continues with the same slope, then opens up room for higher rents.
const kneePosition = 0.75;
const tailWidth = 1 - kneePosition;
const entry = budgetKnee * tailWidth / kneePosition;
const curve = budgetCeiling - budgetKnee - entry;

export function budgetValueAt(position) {
  const bounded = Math.max(0, Math.min(1, position));
  if (bounded <= kneePosition) return budgetKnee * bounded / kneePosition;
  const tail = (bounded - kneePosition) / tailWidth;
  return budgetKnee + entry * tail + curve * tail * tail;
}

export function budgetPositionFor(value) {
  const bounded = Math.max(0, Math.min(budgetCeiling, value));
  if (bounded <= budgetKnee) return kneePosition * bounded / budgetKnee;
  const tail = (Math.sqrt(entry * entry + 4 * curve * (bounded - budgetKnee)) - entry) / (2 * curve);
  return kneePosition + tailWidth * tail;
}
