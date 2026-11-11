// Signing in, signing up and resetting a password: the public /auth/client routes.
import { http } from './client';
import type { CodePurpose, SignInResult } from './types';

// The API keeps the phone's time zone on the session.
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/** `pushToken` is the phone's FCM token: the API sends this session's push notifications to it. */
export const signIn = async (
  email: string,
  password: string,
  pushToken: string | null,
) =>
  (
    await http.post<SignInResult>('/auth/client/login', {
      email,
      password,
      timezone,
      fcm_token: pushToken ?? undefined,
    })
  ).data;

/** Creates the account and emails a 4-digit code to verify the address. */
export const register = (body: {
  name: string;
  email: string;
  mobile: string | null;
  password: string;
  confirm_password: string;
}) => http.post('/auth/client/register', body);

/** Emails a new 4-digit code, valid for 5 minutes. */
export const sendCode = (email: string, type: CodePurpose) =>
  http.post('/auth/client/otp', { email, type });

/** Checks a code. For a password reset it returns the token that allows the reset. */
export const verifyCode = async (
  email: string,
  otp: string,
  type: CodePurpose,
) =>
  (
    await http.post<{ token: string } | null>('/auth/client/verify-otp', {
      email,
      otp,
      type,
    })
  ).data;

export const resetPassword = (body: {
  email: string;
  token: string;
  password: string;
  confirm_password: string;
}) => http.post('/auth/client/forgot-password', body);
