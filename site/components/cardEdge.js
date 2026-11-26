// Project the pointer onto the rounded card perimeter. Negative distances are
// inside the card. The normal also follows the curve around each corner.
export function cardEdge(rect, cornerRadius, { x, y }, range) {
  if (!range || !rect.width || !rect.height) return null;
  const halfW = rect.width / 2, halfH = rect.height / 2;
  const r = Math.min(cornerRadius, halfW, halfH);
  const dx = x - rect.left - halfW, dy = y - rect.top - halfH;
  const qx = Math.abs(dx) - halfW + r, qy = Math.abs(dy) - halfH + r;
  const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
  const length = Math.hypot(ox, oy);
  const distance = length + Math.min(Math.max(qx, qy), 0) - r;
  const insideBand = Math.min(16, range);
  if (distance >= range || distance <= -insideBand) return null;
  const nx = (Math.sign(dx) || 1) * (length ? ox / length : Number(qx >= qy));
  const ny = (Math.sign(dy) || 1) * (length ? oy / length : Number(qy > qx));
  return {
    x: x - distance * nx, y: y - distance * ny,
    angle: Math.atan2(ny, nx) * 180 / Math.PI,
    distance,
    strength: distance < 0 ? 1 + distance / insideBand : 1 - distance / range
  };
}

// In this local coordinate system the edge is vertical and +x points toward
// the cursor. The bulb narrows as the pointer pulls away from the card.
export function bridgePath({ distance, strength }) {
  const reach = Math.max(distance, 0) + 6 * strength;
  const base = 6 + 12 * strength;
  const neck = 1.5 + 4 * strength;
  return [
    `M -1 ${-base}`,
    `C 1 ${-base * 0.6} ${reach * 0.4} ${-neck} ${reach} ${-neck}`,
    `A ${neck} ${neck} 0 0 1 ${reach} ${neck}`,
    `C ${reach * 0.4} ${neck} 1 ${base * 0.6} -1 ${base} Z`
  ].join(' ');
}
