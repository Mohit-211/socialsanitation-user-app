import Config from 'react-native-config';

type EnvKey = 'API_BASE_URL' | 'PRIVACY_POLICY_URL';

/**
 * Values read from .env at build time by react-native-config. After changing .env,
 * rebuild the app; reloading Metro is not enough.
 */
const required = (name: EnvKey): string => {
  const value = Config[name];
  if (!value) {
    throw new Error(
      `${name} is missing. Add it to .env (see .env.example) and rebuild the app.`,
    );
  }
  return value;
};

// The API's version 2 root, without a trailing slash, e.g. https://api.socialsanitation.com/api/v2
export const API_BASE_URL = required('API_BASE_URL').replace(/\/+$/, '');

// The page the Privacy Policy screen opens.
export const PRIVACY_POLICY_URL = required('PRIVACY_POLICY_URL');
