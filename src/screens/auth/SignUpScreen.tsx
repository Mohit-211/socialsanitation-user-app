import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { register, sendCode } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import AppText from '../../components/AppText';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import LinkButton from '../../components/LinkButton';
import Notice from '../../components/Notice';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';
import { EMAIL, isValidPassword, PASSWORD_HINT } from '../../utils/validation';

type Form = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm: string;
};

export default function SignUpScreen({
  navigation,
}: RootScreenProps<'SignUp'>) {
  const [emailTaken, setEmailTaken] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    setFocus,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirm: '',
    },
  });

  const submit = handleSubmit(
    async ({ name, email, mobile, password, confirm }) => {
      setEmailTaken(false);
      try {
        const { message } = await register({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim() || null,
          password,
          confirm_password: confirm,
        });
        notify.success(
          message || 'Account created. Check your email for the code.',
        );
        navigation.navigate('VerifyCode', {
          email: email.trim(),
          purpose: 'signup',
        });
      } catch (e) {
        const message = errorMessage(e);
        setEmailTaken(message === 'Email already taken');
        notify.error(message);
      }
    },
  );

  const verifyInstead = async () => {
    const email = getValues('email').trim();
    try {
      await sendCode(email, 'email_varification');
      navigation.navigate('VerifyCode', { email, purpose: 'signup' });
    } catch (e) {
      notify.error(errorMessage(e));
    }
  };

  return (
    <Screen header={<Header />}>
      <Heading
        eyebrow="New client"
        title="Create your account"
        description="We'll email you a code to confirm your address."
        size="display"
      />
      <View style={styles.fields}>
        <FormTextField
          control={control}
          name="name"
          label="Full name"
          rules={{
            validate: value => value.trim() !== '' || 'Enter your name',
          }}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('email')}
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
          returnKeyType="next"
          onSubmitEditing={() => setFocus('mobile')}
        />
        <FormTextField
          control={control}
          name="mobile"
          label="Phone (optional)"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('password')}
        />
        <FormTextField
          control={control}
          name="password"
          label="Password"
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
          label="Confirm password"
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
      {emailTaken ? (
        <View style={styles.fields}>
          <Notice tone="info" title="This email already has an account">
            Sign in instead. If you never entered the code we emailed, we can
            send a new one.
          </Notice>
          <View style={styles.row}>
            <LinkButton
              title="Sign in"
              onPress={() =>
                navigation.popTo('SignIn', { email: getValues('email').trim() })
              }
            />
            <LinkButton title="Send a new code" onPress={verifyInstead} />
          </View>
        </View>
      ) : null}
      <Button title="Create account" onPress={submit} loading={isSubmitting} />
      <View style={styles.row}>
        <AppText variant="caption">
          By creating an account you agree to our
        </AppText>
        <LinkButton
          title="Terms"
          onPress={() => navigation.navigate('Content', { kind: 'terms' })}
        />
        <AppText variant="caption">and</AppText>
        <LinkButton
          title="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: space.md },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: space.xs,
  },
});
