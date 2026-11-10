import React, { useEffect, useState } from 'react';
import { findCities } from '../../api/addresses';
import { errorMessage } from '../../api/errors';
import type { Place } from '../../api/types';
import FieldTrigger from '../../components/FieldTrigger';
import PickerSheet from '../../components/PickerSheet';
import { notify } from '../../components/Toaster';
import { ChevronDown } from '../../components/icons';

type Props = {
  stateId: number | null;
  value: Place | null;
  onChange: (city: Place) => void;
  error?: string;
};

/** Picks a city of the chosen state. States have thousands, so it searches the API as the user types. */
export default function CityField({ stateId, value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !stateId) {
      return;
    }
    let current = true;
    setLoading(true);
    // Waits for a pause in typing before searching.
    const timer = setTimeout(
      () =>
        findCities(stateId, query)
          .then(found => current && setCities(found))
          .catch(e => current && notify.error(errorMessage(e)))
          .finally(() => current && setLoading(false)),
      query ? 300 : 0,
    );
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [open, stateId, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <FieldTrigger
        label="City"
        value={value?.name}
        placeholder={stateId ? 'Choose a city' : 'Choose the state first'}
        icon={ChevronDown}
        onPress={() => setOpen(true)}
        error={error}
        disabled={!stateId}
      />
      <PickerSheet
        title="City"
        visible={open}
        onClose={close}
        options={cities.map(city => ({ value: city.id, label: city.name }))}
        selected={value?.id ?? null}
        onPick={option => {
          onChange({ id: option.value, name: option.label });
          close();
        }}
        search={{ value: query, onChange: setQuery }}
        loading={loading}
        emptyText={
          query ? `No city matches “${query}”.` : 'Type to find the city.'
        }
      />
    </>
  );
}
