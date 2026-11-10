import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, type TextInputProps } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { sendCode, verifyCode } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import type { CodePurpose } from '../../api/types';
import AppText from '../../components/AppText';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import LinkButton from '../../components/LinkButton';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { colors, fonts, space, styles as theme } from '../../theme';

const CELLS = 4;
const RESEND_AFTER = 30; // seconds

export default function VerifyCodeScreen({
  navigation,
  route,
}: RootScreenProps<'VerifyCode'>) {
  const { email, purpose } = route.params;
  const type: CodePurpose =
    purpose === 'signup' ? 'email_varification' : 'forgot_password';
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [wait, setWait] = useState(RESEND_AFTER);
  const ref = useBlurOnFulfill({ value: code, cellCount: CELLS });
  const [cellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (wait <= 0) {
      return;
    }
    const timer = setTimeout(() => setWait(seconds => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const check = async (value: string) => {
    if (value.length !== CELLS || checking) {
      return;
    }
    setChecking(true);
    try {
      const result = await verifyCode(email, value, type);
      if (purpose === 'signup') {
        notify.success('Email verified. You can sign in now.');
        navigation.popTo('SignIn', { email });
      } else if (result?.token) {
        navigation.replace('ResetPassword', { email, token: result.token });
      }
    } catch (e) {
      notify.error(errorMessage(e));
      setCode('');
    } finally {
      setChecking(false);
    }
  };

  const resend = async () => {
    try {
      const { message } = await sendCode(email, type);
      notify.success(message || 'We sent a new code.');
      setCode('');
      setWait(RESEND_AFTER);
    } catch (e) {
      notify.error(errorMessage(e));
    }
  };

  return (
    <Screen header={<Header />}>
      <Heading
        eyebrow={
          purpose === 'signup' ? 'Verify your email' : 'Reset your password'
        }
        title="Enter your code"
        description={`We emailed a 4-digit code to ${email}. It works for 5 minutes.`}
        size="display"
      />
      <CodeField
        ref={ref}
        {...cellProps}
        value={code}
        onChangeText={text => {
          setCode(text);
          check(text);
        }}
        cellCount={CELLS}
        rootStyle={styles.cells}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.select<TextInputProps['autoComplete']>({
          android: 'sms-otp',
          default: 'one-time-code',
        })}
        autoFocus
        accessibilityLabel="4-digit code"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            style={[styles.cell, isFocused && theme.formInputFocused]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <AppText style={styles.digit}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </AppText>
          </View>
        )}
      />
      <Button
        title="Verify"
        onPress={() => check(code)}
        loading={checking}
        disabled={code.length !== CELLS}
      />
      {wait > 0 ? (
        <AppText variant="small">
          You can ask for a new code in {wait}{' '}
          {wait === 1 ? 'second' : 'seconds'}.
        </AppText>
      ) : (
        <LinkButton title="Send a new code" onPress={resend} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cells: { justifyContent: 'flex-start', gap: space.sm },
  cell: {
    width: 56,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  digit: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
});
