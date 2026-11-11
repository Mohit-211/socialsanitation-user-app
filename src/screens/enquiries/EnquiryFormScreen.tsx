import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { getAddresses } from '../../api/addresses';
import { sendEnquiry } from '../../api/enquiries';
import { errorMessage } from '../../api/errors';
import { getServices } from '../../api/site';
import Button from '../../components/Button';
import ChoiceChips from '../../components/ChoiceChips';
import DateField from '../../components/DateField';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import LinkButton from '../../components/LinkButton';
import Loadable from '../../components/Loadable';
import Screen from '../../components/Screen';
import SelectField from '../../components/SelectField';
import { notify } from '../../components/Toaster';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';
import { startOfToday, toApiDate } from '../../utils/date';

type Form = {
  serviceIds: number[];
  neededOn: Date | null;
  addressId: number | null;
  notes: string;
};

const loadChoices = async () => {
  const [services, addresses] = await Promise.all([
    getServices(),
    getAddresses(),
  ]);
  return { services, addresses };
};

export default function EnquiryFormScreen({
  navigation,
  route,
}: RootScreenProps<'EnquiryForm'>) {
  const choices = useRequest(loadChoices);
  const serviceId = route.params?.serviceId;
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: {
      serviceIds: serviceId ? [serviceId] : [],
      neededOn: null,
      addressId: null,
      notes: '',
    },
  });

  // Starts on the main address once the addresses arrive, unless one is chosen already.
  const primaryId = choices.data?.addresses.find(
    address => address.is_primary,
  )?.id;
  useEffect(() => {
    if (primaryId && getValues('addressId') === null) {
      setValue('addressId', primaryId);
    }
  }, [primaryId, getValues, setValue]);

  const submit = handleSubmit(
    async ({ serviceIds, neededOn, addressId, notes }) => {
      if (!neededOn) {
        return;
      }
      try {
        await sendEnquiry({
          service_ids: serviceIds,
          needed_on: toApiDate(neededOn),
          address_id: addressId,
          notes: notes.trim() || null,
        });
        // Not the API's own message, which spells it "Enquiry".
        notify.success('Inquiry sent.');
        navigation.replace('Enquiries');
      } catch (e) {
        notify.error(errorMessage(e));
      }
    },
  );

  return (
    <Screen
      header={<Header title="Request a service" />}
      footer={
        <Button
          title="Send request"
          onPress={submit}
          loading={isSubmitting}
          disabled={!choices.data}
        />
      }
    >
      <Heading
        eyebrow="Request a service"
        title="Tell us what you need"
        description="The office will get back to you with a quote and a date. Nothing is booked until they confirm."
      />
      <Loadable {...choices}>
        {({ services, addresses }) => (
          <View style={styles.fields}>
            <Controller
              control={control}
              name="serviceIds"
              rules={{
                validate: value =>
                  value.length > 0 || 'Pick at least one service',
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <ChoiceChips
                  label="Services"
                  options={services.map(service => ({
                    value: service.id,
                    label: service.name,
                  }))}
                  selected={value}
                  onToggle={id =>
                    onChange(
                      value.includes(id)
                        ? value.filter(v => v !== id)
                        : [...value, id],
                    )
                  }
                  error={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="neededOn"
              rules={{ required: 'Pick a date' }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <DateField
                  label="When do you need it?"
                  value={value}
                  onChange={onChange}
                  minimumDate={startOfToday()}
                  error={error?.message}
                />
              )}
            />
            <View>
              <Controller
                control={control}
                name="addressId"
                render={({ field: { value, onChange } }) => (
                  <SelectField
                    label="Address (optional)"
                    placeholder={
                      addresses.length > 0
                        ? 'Choose an address'
                        : 'No addresses yet'
                    }
                    options={addresses.map(address => ({
                      value: address.id,
                      label: address.label
                        ? `${address.label}: ${address.one_line}`
                        : address.one_line,
                    }))}
                    value={value}
                    onChange={onChange}
                    disabled={addresses.length === 0}
                  />
                )}
              />
              <LinkButton
                title="Add an address"
                onPress={() => navigation.navigate('AddressForm')}
              />
            </View>
            <FormTextField
              control={control}
              name="notes"
              label="Notes (optional)"
              placeholder="The size of the space, how often, anything we should know"
              multiline
              maxLength={2000}
            />
          </View>
        )}
      </Loadable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.lg },
});
