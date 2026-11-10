import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { sendProfileRequest } from '../../api/account';
import { errorMessage } from '../../api/errors';
import type { ProfileRequestKind } from '../../api/types';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Notice from '../../components/Notice';
import Screen from '../../components/Screen';
import SelectField from '../../components/SelectField';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';

const KINDS: { value: ProfileRequestKind; label: string }[] = [
  { value: 'change_name', label: 'Change my name' },
  { value: 'change_email', label: 'Change my email' },
  { value: 'change_phone', label: 'Change my phone number' },
  { value: 'delete_account', label: 'Delete my account' },
  { value: 'other', label: 'Something else' },
];

const PROMPTS: Record<ProfileRequestKind, string> = {
  change_name: 'Your name as it should read',
  change_email: 'The new email address',
  change_phone: 'The new phone number',
  delete_account: 'Anything the office should know (optional)',
  other: 'What should the office change?',
};

type Form = { kind: ProfileRequestKind | null; details: string };

export default function AccountRequestFormScreen({
  navigation,
  route,
}: RootScreenProps<'AccountRequestForm'>) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: { kind: route.params?.kind ?? null, details: '' },
  });
  const kind = watch('kind');
  const deleting = kind === 'delete_account';

  const submit = handleSubmit(async form => {
    if (!form.kind) {
      return;
    }
    try {
      const { message } = await sendProfileRequest(
        form.kind,
        form.details.trim() || null,
      );
      notify.success(message || 'Request sent.');
      navigation.goBack();
    } catch (e) {
      notify.error(errorMessage(e));
    }
  });

  return (
    <Screen
      header={
        <Header title={deleting ? 'Delete account' : 'Request a change'} />
      }
      footer={
        <Button
          title={deleting ? 'Ask to delete my account' : 'Send request'}
          variant={deleting ? 'destructive' : 'primary'}
          onPress={submit}
          loading={isSubmitting}
        />
      }
    >
      <Heading
        eyebrow="Account changes"
        title={deleting ? 'Delete your account' : 'What should we change?'}
        description="The office makes account changes for you and lets you know when it's done."
      />
      {deleting ? (
        <Notice tone="danger" title="This can't be undone">
          The office will delete your account and everything in it. You'll be
          signed out on all your devices.
        </Notice>
      ) : null}
      <View style={styles.fields}>
        <Controller
          control={control}
          name="kind"
          rules={{ required: 'Choose what to change' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <SelectField
              label="Request"
              options={KINDS}
              value={value}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />
        <FormTextField
          control={control}
          name="details"
          label="Details"
          placeholder={kind ? PROMPTS[kind] : 'Choose a request first'}
          rules={{
            validate: value =>
              deleting ||
              value.trim() !== '' ||
              'Tell the office what to change',
          }}
          multiline
          maxLength={2000}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.md },
});
