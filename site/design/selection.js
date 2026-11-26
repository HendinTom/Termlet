// An accent foreground carries its selection colors to unstyled descendants.
const primaryText = new Set(['--accent', '--accent-readable', '--accent-text', '--accent-strong', '--tint']);

export function selectionColors(color) {
  const token = /^var\((--[\w-]+)\)$/.exec(color)?.[1];
  if (primaryText.has(token)) return ['var(--secondary)', 'var(--on-secondary)'];
  const reset = ['inherit', 'currentcolor', 'unset'].includes(color.toLowerCase()) ? 'inherit' : 'initial';
  return [reset, reset];
}
