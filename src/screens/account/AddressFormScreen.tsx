import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import {
  addAddress,
  deleteAddress,
  getAddress,
  getCountries,
  getStates,
  makePrimary,
  updateAddress,
} from '../../api/addresses';
import { errorMessage } from '../../api/errors';
import type { Address, AddressInput, Place } from '../../api/types';
import AppText from '../../components/AppText';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Loadable from '../../components/Loadable';
import Screen from '../../components/Screen';
import SelectField from '../../components/SelectField';
import { notify } from '../../components/Toaster';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { colors, space } from '../../theme';
import { postalCodeError } from '../../utils/validation';
import CityField from './CityField';

type Form = {
  label: string;
  street: string;
  line2: string;
  countryId: number | null;
  stateId: number | null;
  city: Place | null;
  postalCode: string;
  accessNotes: string;
  isPrimary: boolean;
};

const toPlace = (place: Place) => ({ value: place.id, label: place.name });

export default function AddressFormScreen(
  props: RootScreenProps<'AddressForm'>,
) {
  const id = props.route.params?.id;
  const existing = useRequest(
    useCallback(async () => (id ? getAddress(id) : null), [id]),
  );
  const title = id ? 'Edit address' : 'New address';
  if (existing.data === undefined) {
    return (
      <Screen header={<Header title={title} />}>
        <Loadable {...existing}>{() => null}</Loadable>
      </Screen>
    );
  }
  return <AddressEditor {...props} title={title} address={existing.data} />;
}

function AddressEditor({
  navigation,
  title,
  address,
}: RootScreenProps<'AddressForm'> & {
  title: string;
  address: Address | null;
}) {
  const countries = useRequest(getCountries);
  const [busy, setBusy] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: {
      label: address?.label ?? '',
      street: address?.address ?? '',
      line2: address?.address_line_2 ?? '',
      countryId: address?.country?.id ?? null,
      stateId: address?.state?.id ?? null,
      city: address?.city ?? null,
      postalCode: address?.postal_code ?? '',
      accessNotes: address?.access_notes ?? '',
      isPrimary: false,
    },
  });
  const countryId = watch('countryId');
  const stateId = watch('stateId');
  const states = useRequest(
    useCallback(
      async () => (countryId ? getStates(countryId) : []),
      [countryId],
    ),
  );
  const countryCode = countries.data?.find(
    country => country.id === countryId,
  )?.code;

  // A new address starts in the United States.
  const unitedStates = countries.data?.find(
    country => country.code === 'US',
  )?.id;
  useEffect(() => {
    if (unitedStates && getValues('countryId') === null) {
      setValue('countryId', unitedStates);
    }
  }, [unitedStates, getValues, setValue]);

  const submit = handleSubmit(async form => {
    if (!form.countryId || !form.stateId || !form.city) {
      return;
    }
    const body: AddressInput = {
      label: form.label.trim() || null,
      address: form.street.trim(),
      address_line_2: form.line2.trim() || null,
      country_id: form.countryId,
      state_id: form.stateId,
      city_id: form.city.id,
      postal_code: form.postalCode.trim(),
      access_notes: form.accessNotes.trim() || null,
      ...(form.isPrimary ? { is_primary: true } : {}),
    };
    try {
      const { message } = address
        ? await updateAddress(address.id, body)
        : await addAddress(body);
      notify.success(message || 'Address saved.');
      navigation.goBack();
    } catch (e) {
      notify.error(errorMessage(e));
    }
  });

  const act = async (
    action: () => Promise<{ message: string }>,
    done: string,
  ) => {
    setBusy(true);
    try {
      const { message } = await action();
      notify.success(message || done);
      navigation.goBack();
    } catch (e) {
      notify.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = (target: Address) =>
    Alert.alert('Delete this address?', target.one_line, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => act(() => deleteAddress(target.id), 'Address deleted.'),
      },
    ]);

  return (
    <Screen
      header={<Header title={title} />}
      footer={
        <Button
          title="Save address"
          onPress={submit}
          loading={isSubmitting}
          disabled={busy}
        />
      }
    >
      <View style={styles.fields}>
        <FormTextField
          control={control}
          name="label"
          label="Name (optional)"
          placeholder="Main office"
          maxLength={60}
        />
        <FormTextField
          control={control}
          name="street"
          label="Street address"
          rules={{
            validate: value =>
              value.trim() !== '' || 'Enter the street address',
          }}
          autoComplete="address-line1"
          textContentType="streetAddressLine1"
          maxLength={255}
        />
        <FormTextField
          control={control}
          name="line2"
          label="Suite, unit or floor (optional)"
          autoComplete="address-line2"
          textContentType="streetAddressLine2"
          maxLength={150}
        />
        <Controller
          control={control}
          name="countryId"
          rules={{ required: 'Choose the country' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <SelectField
              label="Country"
              options={(countries.data ?? []).map(toPlace)}
              value={value}
              onChange={next => {
                onChange(next);
                setValue('stateId', null);
                setValue('city', null);
              }}
              error={
                error?.message ??
                (countries.error ? errorMessage(countries.error) : undefined)
              }
            />
          )}
        />
        <Controller
          control={control}
          name="stateId"
          rules={{
            required:
              countryCode === 'CA' ? 'Choose the province' : 'Choose the state',
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <SelectField
              label={countryCode === 'CA' ? 'Province or territory' : 'State'}
              placeholder={countryId ? 'Choose' : 'Choose the country first'}
              options={(states.data ?? []).map(toPlace)}
              value={value}
              onChange={next => {
                onChange(next);
                setValue('city', null);
              }}
              disabled={!countryId}
              error={
                error?.message ??
                (states.error ? errorMessage(states.error) : undefined)
              }
            />
          )}
        />
        <Controller
          control={control}
          name="city"
          rules={{ required: 'Choose the city' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <CityField
              stateId={stateId}
              value={value}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />
        <FormTextField
          control={control}
          name="postalCode"
          label={countryCode === 'CA' ? 'Postal code' : 'ZIP code'}
          rules={{
            validate: value =>
              value.trim() === ''
                ? 'Enter the code'
                : (postalCodeError(countryCode, value) ?? true),
          }}
          autoCapitalize="characters"
          autoComplete="postal-code"
          textContentType="postalCode"
          keyboardType={countryCode === 'CA' ? 'default' : 'number-pad'}
          maxLength={10}
        />
        <FormTextField
          control={control}
          name="accessNotes"
          label="Access notes (optional)"
          placeholder="Gate codes, parking, which door to use"
          multiline
          maxLength={1000}
        />
        {!address ? (
          <Controller
            control={control}
            name="isPrimary"
            render={({ field: { value, onChange } }) => (
              <View style={styles.switchRow}>
                <AppText variant="bodyStrong" style={styles.fill}>
                  Make this my main address
                </AppText>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  accessibilityLabel="Make this my main address"
                  trackColor={{ true: colors.primary, false: colors.border }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.border}
                />
              </View>
            )}
          />
        ) : null}
      </View>

      {address ? (
        <View style={styles.fields}>
          {address.is_primary ? (
            <AppText variant="small">This is your main address.</AppText>
          ) : (
            <Button
              title="Make this my main address"
              variant="outline"
              disabled={busy}
              onPress={() =>
                act(
                  () => makePrimary(address.id),
                  'This is now your main address.',
                )
              }
            />
          )}
          <Button
            title="Delete address"
            variant="destructive"
            disabled={busy}
            onPress={() => confirmDelete(address)}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.md },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 44,
  },
  fill: { flex: 1 },
});
