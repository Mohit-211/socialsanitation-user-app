import { Linking } from 'react-native';
import { notify } from '../components/Toaster';

// The company website. About us, the privacy policy and the terms live there, not in the app.
export const WEBSITE_URL = 'https://socialsanitation.com';
export const PRIVACY_URL = `${WEBSITE_URL}/privacy`;
export const TERMS_URL = `${WEBSITE_URL}/terms`;

/** Opens a link in the browser, or in the app that handles it; a toast says so when none can. */
export const openLink = (url: string) =>
  Linking.openURL(url).catch(() => notify.error("Couldn't open the link."));
