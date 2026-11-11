import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import logo from '../../assets/images/logo.png';
import { sendCode, signIn } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import AppText from '../../components/AppText';
import Button from '../../components/Button';
import FormTextField from '../../components/FormTextField';
import Heading from '../../components/Heading';
import LinkButton from '../../components/LinkButton';
import Notice from '../../components/Notice';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { pushToken } from '../../push/push';
import { useSession } from '../../session/SessionProvider';
import { space } from '../../theme';
import { EMAIL } from '../../utils/validation';

type Form = { email: string; password: string };

// The API says this both for an unknown email and for a sign-up whose email isn't verified yet.
const NOT_FOUND = "Email Doesn't Exist.";

export default function SignInScreen({
  navigation,
  route,
}: RootScreenProps<'SignIn'>) {
  const { startSession } = useSession();
  // The email that just failed as unknown: it may be a sign-up that was never verified.
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [sendingCode, setSendingCode] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: { email: route.params?.email ?? '', password: '' },
  });

  const email = useWatch({ control, name: 'email' });

  // Coming back from another flow starts fresh.
  useEffect(
    () => navigation.addListener('focus', () => setUnverifiedEmail(null)),
    [navigation],
  );

  // Sign-up and password reset come back here with the email to fill in.
  const returnedEmail = route.params?.email;
  useEffect(() => {
    if (returnedEmail) {
      setValue('email', returnedEmail);
      setValue('password', '');
    }
  }, [returnedEmail, setValue]);

  const submit = handleSubmit(async form => {
    setUnverifiedEmail(null);
    try {
      const result = await signIn(
        form.email.trim(),
        form.password,
        await pushToken(),
      );
      await startSession({ token: result.token, expiresAt: result.expires_at });
    } catch (e) {
      const message = errorMessage(e);
      if (message === NOT_FOUND) {
        setUnverifiedEmail(form.email.trim());
        notify.error("We couldn't find a verified account with that email.");
      } else {
        notify.error(message);
      }
    }
  });

  const sendVerificationCode = async (address: string) => {
    setSendingCode(true);
    try {
      await sendCode(address, 'email_varification');
      navigation.navigate('VerifyCode', { email: address, purpose: 'signup' });
    } catch (e) {
      notify.error(errorMessage(e));
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <Screen>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Social Sanitation"
      />
      <Heading
        eyebrow="Welcome back"
        title="Sign in"
        description="See your bookings, sign documents and pay invoices."
        size="display"
      />
      <View style={styles.fields}>
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
          onSubmitEditing={() => setFocus('password')}
        />
        <FormTextField
          control={control}
          name="password"
          label="Password"
          secret
          rules={{ required: 'Enter your password' }}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={() => submit()}
        />
        <LinkButton
          title="Forgot password?"
          onPress={() =>
            navigation.navigate('ForgotPassword', {
              email: getValues('email').trim(),
            })
          }
        />
      </View>
      {unverifiedEmail !== null && unverifiedEmail === email.trim() ? (
        <View style={styles.fields}>
          <Notice tone="info" title="Signed up but not verified yet?">
            Your account works once you enter the 4-digit code we emailed you.
            We can send a new one.
          </Notice>
          <Button
            title="Send me a new code"
            variant="outline"
            onPress={() => sendVerificationCode(unverifiedEmail)}
            loading={sendingCode}
          />
        </View>
      ) : null}
      <Button title="Sign in" onPress={submit} loading={isSubmitting} />
      <View style={styles.row}>
        <AppText variant="small">New to Social Sanitation?</AppText>
        <LinkButton
          title="Create an account"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 113, height: 129 },
  fields: { gap: space.md },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: space.xs,
  },
});
