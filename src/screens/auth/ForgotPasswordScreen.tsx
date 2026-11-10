import React from 'react';
import { useForm } from 'react-hook-form';
import { sendCode } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { EMAIL } from '../../utils/validation';

export default function ForgotPasswordScreen({
  navigation,
  route,
}: RootScreenProps<'ForgotPassword'>) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { email: route.params?.email ?? '' } });

  const submit = handleSubmit(async ({ email }) => {
    try {
      await sendCode(email.trim(), 'forgot_password');
      navigation.navigate('VerifyCode', {
        email: email.trim(),
        purpose: 'reset',
      });
    } catch (e) {
      notify.error(errorMessage(e));
    }
  });

  return (
    <Screen header={<Header />}>
      <Heading
        eyebrow="Reset your password"
        title="Forgot your password?"
        description="Enter your account's email and we'll send you a 4-digit code."
        size="display"
      />
      <FormTextField
        control={control}
        name="email"
        label="Email"
        rules={{
          required: 'Enter your email',
          pattern: { value: EMAIL, message: 'Enter a valid email' },
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={() => submit()}
      />
      <Button title="Send code" onPress={submit} loading={isSubmitting} />
    </Screen>
  );
}
