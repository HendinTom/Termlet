import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { UI } from './UI';

export const PickerContext = createContext(null);

export function MarketSelect({ children, onChange, ...props }) {
  const open = useContext(PickerContext),
    select = useRef(null),
    trigger = useRef(null);
  const enhanced = !!open && typeof HTMLDialogElement !== 'undefined';
  const [label, setLabel] = useState('Choose an option');
  const [value, setValue] = useState('');
  function sync() {
    setValue(select.current.selectedOptions[0]?.textContent || 'Choose…');
  }
  useLayoutEffect(() => {
    if (!enhanced) return;
    const el = select.current;
    const text = [...(el.labels?.[0]?.childNodes || [])]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent)
      .join('')
      .trim();
    setLabel(el.getAttribute('aria-label') || text || 'Choose an option');
    sync();
  }, [enhanced, children]);
  function choose() {
    open(select.current, trigger.current, label);
  }
  return (
    <>
      <UI.Select
        {...props}
        ref={select}
        hidden={enhanced}
        onChange={(event) => {
          sync();
          select.current.removeAttribute('aria-invalid');
          trigger.current?.removeAttribute('aria-invalid');
          onChange?.(event);
        }}
      >
        {children}
      </UI.Select>
      {enhanced && (
        <UI.PickerTrigger
          ref={trigger}
          type="button"
          disabled={props.disabled}
          aria-label={label + ': ' + value}
          aria-haspopup="dialog"
          aria-expanded="false"
          onClick={choose}
          onKeyDown={(e) => {
            if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
              e.preventDefault();
              choose();
            }
          }}
        >
          <TriggerValue value={value} />
        </UI.PickerTrigger>
      )}
    </>
  );
}

export function TriggerValue({ value }) {
  return (
    <>
      <span>{value}</span>
      <svg aria-hidden="true" viewBox="0 0 16 16">
        <path d="m5 6 3-3 3 3M5 10l3 3 3-3" />
      </svg>
    </>
  );
}

export function PickerContents({ id, label, searchable }) {
  return (
    <>
      <UI.PickerHeader>
        <UI.Heading id={id + '-title'}>{label}</UI.Heading>
        <UI.PickerClose type="button" aria-label="Close selection">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="m6 6 8 8M14 6l-8 8" />
          </svg>
        </UI.PickerClose>
      </UI.PickerHeader>
      {searchable && (
        <UI.PickerSearchWrap>
          <UI.PickerSearch
            type="search"
            placeholder="Search options"
            aria-label={'Search ' + label.toLowerCase()}
            autoComplete="off"
          />
        </UI.PickerSearchWrap>
      )}
      <UI.PickerOptions role="listbox" aria-label={label} tabIndex="0" />
    </>
  );
}

export function PickerChoices({ options, query, id }) {
  const groups = new Map();
  options.forEach((option, index) => {
    const group = option.parentElement.tagName === 'OPTGROUP' ? option.parentElement.label : '';
    if (query && !(option.textContent + ' ' + group).toLocaleLowerCase().includes(query)) return;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(
      <UI.PickerOption
        key={index}
        id={id + '-option-' + index}
        role="option"
        data-index={index}
        aria-selected={option.selected}
        aria-disabled={option.disabled || option.parentElement.disabled || undefined}
      >
        <span>{option.textContent}</span>
        <svg className="picker-check" aria-hidden="true" viewBox="0 0 20 20">
          <path d="m5 10 3.5 3.5L15 7" />
        </svg>
      </UI.PickerOption>
    );
  });
  return groups.size ? (
    [...groups].map(([label, items]) => (
      <div key={label} role="group" aria-label={label || undefined}>
        {label && (
          <UI.PickerGroup as="p" aria-hidden="true">
            {label}
          </UI.PickerGroup>
        )}
        {items}
      </div>
    ))
  ) : (
    <UI.PickerEmpty as="p" role="status">
      No matching options
    </UI.PickerEmpty>
  );
}
