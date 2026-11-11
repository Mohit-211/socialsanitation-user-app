// Push notifications, through Firebase Cloud Messaging. The API pushes each new inbox notification
// to the phones of the client's live sessions. A phone joins by sending its FCM token with the
// sign-in, and leaves when that session ends.
import { useEffect, useEffectEvent } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  hasPermission,
  onMessage,
  onNotificationOpenedApp,
  requestPermission,
} from '@react-native-firebase/messaging';
import { notify } from '../components/Toaster';

// Signing in waits this long for the token at most, then goes ahead without pushes.
const TOKEN_WAIT_MS = 5000;

const fetchToken = async () => getToken(getMessaging());

/**
 * The phone's FCM token for the sign-in, or null when Firebase can't give one in time: no Google
 * Play services, no network, or no Apple push registration yet.
 */
export const pushToken = (): Promise<string | null> =>
  Promise.race([
    fetchToken(),
    new Promise<null>(resolve =>
      setTimeout(() => resolve(null), TOKEN_WAIT_MS),
    ),
  ]).catch(() => null);

/** Whether the phone shows this app's notifications. */
export const pushAllowed = async (): Promise<boolean> => {
  const status = await hasPermission(getMessaging());
  return (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  );
};

// iOS, and Android from version 13, show an app's notifications only after the user allows them.
// iOS asks once and Android at most twice; after that the request returns without a prompt.
const askPermission = async () => {
  if (Platform.OS === 'ios') {
    await requestPermission(getMessaging());
  } else if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
};

/**
 * Pushes in the signed-in app: asks for permission, shows a push that arrives while the app is
 * open as a toast, and opens the inbox when the user taps a push.
 */
export function usePushNotifications(openInbox: () => void) {
  const open = useEffectEvent(openInbox);

  useEffect(() => {
    const messaging = getMessaging();
    askPermission().catch(() => undefined);
    // A tap on a push started the app.
    getInitialNotification(messaging)
      .then(message => {
        if (message) {
          open();
        }
      })
      .catch(() => undefined);
    const stopTaps = onNotificationOpenedApp(messaging, () => open());
    const stopMessages = onMessage(messaging, ({ notification }) => {
      const title = notification?.title || notification?.body;
      if (title) {
        notify.push(
          title,
          notification?.title ? notification.body : undefined,
          () => open(),
        );
      }
    });
    return () => {
      stopTaps();
      stopMessages();
    };
  }, []);
}
