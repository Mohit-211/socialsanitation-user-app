import React, { useMemo, useState } from 'react';
import FieldTrigger from './FieldTrigger';
import PickerSheet, { type Option } from './PickerSheet';
import { ChevronDown } from './icons';

type Props<T extends string | number> = {
  label: string;
  placeholder?: string;
  options: readonly Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
  disabled?: boolean;
};

/** Picks one option from a list that opens in a sheet. Lists longer than 8 get a search box. */
export default function SelectField<T extends string | number>({
  label,
  placeholder = 'Select',
  options,
  value,
  onChange,
  error,
  disabled = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? options.filter(option => option.label.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <FieldTrigger
        label={label}
        value={options.find(option => option.value === value)?.label}
        placeholder={placeholder}
        icon={ChevronDown}
        onPress={() => setOpen(true)}
        error={error}
        disabled={disabled}
      />
      <PickerSheet
        title={label}
        visible={open}
        onClose={close}
        options={shown}
        selected={value}
        onPick={option => {
          onChange(option.value);
          close();
        }}
        search={
          options.length > 8 ? { value: query, onChange: setQuery } : undefined
        }
        emptyText={
          query ? `Nothing matches “${query}”.` : 'Nothing to choose from yet.'
        }
      />
    </>
  );
}
