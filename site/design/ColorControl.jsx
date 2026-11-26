import { UI } from '../components/UI';
import { useId, useState } from 'react';

function hexColor(text) {
  const digits = text.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{6}$/.test(digits)) return '#' + digits;
  if (/^[0-9a-f]{3}$/.test(digits)) return '#' + [...digits].map((d) => d + d).join('');
  return null;
}

export function ColorControl({ name, value, onChange }) {
  const id = useId();
  const [draft, setDraft] = useState(null);
  const [invalid, setInvalid] = useState(false);

  function commit(text) {
    const color = hexColor(text);
    setInvalid(!color);
    setDraft(color ? null : text);
    if (color) onChange(color);
  }

  return (
    <UI.ColorControl>
      <UI.Label htmlFor={id}>{name}</UI.Label>
      <UI.ColorInputs>
        <UI.ColorField
          type="color"
          aria-label={name + ' color picker'}
          value={value}
          onChange={(e) => commit(e.target.value)}
        />
        <UI.TextField
          id={id}
          type="text"
          aria-label={name + ' hex code'}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          value={draft ?? value}
          aria-invalid={invalid}
          aria-describedby={invalid ? id + '-error' : undefined}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const text = e.target.value;
            setDraft(text);
            setInvalid(false);
            if (/^#?[0-9a-f]{6}$/i.test(text.trim())) onChange(hexColor(text));
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text');
            if (hexColor(text)) {
              e.preventDefault();
              commit(text);
            }
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
        />
      </UI.ColorInputs>
      {invalid && (
        <UI.Text as="small" id={id + '-error'} role="status">
          Enter 3 or 6 hex digits, such as #194c37.
        </UI.Text>
      )}
    </UI.ColorControl>
  );
}
