import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { changePassword } from '../../api/account';
import { errorMessage } from '../../api/errors';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { space } from '../../theme';
import { isValidPassword, PASSWORD_HINT } from '../../utils/validation';

export default function ChangePasswordScreen({
  navigation,
}: RootScreenProps<'ChangePassword'>) {
  const { startSession } = useSession();
  const {
    control,
    handleSubmit,
    getValues,
    setFocus,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { current: '', password: '', confirm: '' } });

  const submit = handleSubmit(async ({ current, password, confirm }) => {
    try {
      const { data, message } = await changePassword({
        old_password: current,
        new_password: password,
        confirm_password: confirm,
      });
      // Every session ended, this one too; the API sent the token that replaces it.
      await startSession({ token: data.token, expiresAt: data.expires_at });
      notify.success(message || 'Password changed.');
      navigation.goBack();
    } catch (e) {
      notify.error(errorMessage(e));
    }
  });

  return (
    <Screen
      header={<Header title="Change password" />}
      footer={
        <Button title="Save password" onPress={submit} loading={isSubmitting} />
      }
    >
      <Heading
        eyebrow="Security"
        title="Change your password"
        description="You'll stay signed in here and be signed out on your other devices."
      />
      <View style={styles.fields}>
        <FormTextField
          control={control}
          name="current"
          label="Current password"
          secret
          rules={{ required: 'Enter your current password' }}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('password')}
        />
        <FormTextField
          control={control}
          name="password"
          label="New password"
          secret
          hint={PASSWORD_HINT}
          rules={{ validate: value => isValidPassword(value) || PASSWORD_HINT }}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('confirm')}
        />
        <FormTextField
          control={control}
          name="confirm"
          label="Confirm new password"
          secret
          rules={{
            validate: value =>
              value === getValues('password') || "The passwords don't match",
          }}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={() => submit()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.md },
});
