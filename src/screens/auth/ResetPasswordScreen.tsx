import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { resetPassword } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';
import { isValidPassword, PASSWORD_HINT } from '../../utils/validation';

export default function ResetPasswordScreen({
  navigation,
  route,
}: RootScreenProps<'ResetPassword'>) {
  const { email, token } = route.params;
  const {
    control,
    handleSubmit,
    getValues,
    setFocus,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { password: '', confirm: '' } });

  const submit = handleSubmit(async ({ password, confirm }) => {
    try {
      await resetPassword({
        email,
        token,
        password,
        confirm_password: confirm,
      });
      notify.success('Password changed. Sign in with your new password.');
      navigation.popTo('SignIn', { email });
    } catch (e) {
      notify.error(errorMessage(e));
    }
  });

  return (
    <Screen header={<Header />}>
      <Heading
        eyebrow="Reset your password"
        title="Choose a new password"
        description={`For ${email}. You'll be signed out on your other devices.`}
        size="display"
      />
      <View style={styles.fields}>
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
      <Button title="Save password" onPress={submit} loading={isSubmitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.md },
});
