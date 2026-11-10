import React from 'react';
import { useForm } from 'react-hook-form';
import { errorMessage } from '../../api/errors';
import { requestCancellation } from '../../api/visits';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';

export default function CancelVisitScreen({
  navigation,
  route,
}: RootScreenProps<'CancelVisit'>) {
  const { id } = route.params;
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { reason: '' } });

  const submit = handleSubmit(async ({ reason }) => {
    try {
      const { message } = await requestCancellation(id, reason.trim() || null);
      notify.success(message || 'Cancellation requested.');
      navigation.goBack();
    } catch (e) {
      notify.error(errorMessage(e));
    }
  });

  return (
    <Screen
      header={<Header title="Cancel visit" />}
      footer={
        <Button
          title="Request cancellation"
          variant="destructive"
          onPress={submit}
          loading={isSubmitting}
        />
      }
    >
      <Heading
        eyebrow="Request cancellation"
        title="Ask the office to cancel"
        description="The visit stays booked until the office replies. They may offer to move it to another day instead."
      />
      <FormTextField
        control={control}
        name="reason"
        label="Reason (optional)"
        placeholder="For example: the building is closed that week"
        multiline
        maxLength={1000}
      />
    </Screen>
  );
}
