import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import { notify } from '../../components/Toaster';
import type { RootScreenProps } from '../../navigation/types';
import { styles as theme } from '../../theme';

// DocuSign sends the signer here when they finish, whatever the outcome.
const DONE_PATH = '/api/v2/web/signing-done';

const OUTCOMES: Record<
  string,
  { type: 'success' | 'info' | 'error'; text: string }
> = {
  signing_complete: { type: 'success', text: 'Thanks, your signature is in.' },
  decline: {
    type: 'info',
    text: 'You declined to sign. The office will be in touch.',
  },
  cancel: { type: 'info', text: 'You can come back and sign it later.' },
  session_timeout: {
    type: 'error',
    text: 'The signing page timed out. Tap "Review and sign" to start again.',
  },
  ttl_expired: {
    type: 'error',
    text: 'The signing link expired. Tap "Review and sign" to get a new one.',
  },
};

const eventOf = (url: string) => {
  const match = /[?&]event=([^&#]*)/.exec(url);
  return match ? decodeURIComponent(match[1]) : null;
};

/** DocuSign's signing page, inside the app. It closes itself when DocuSign is done. */
export default function SignDocumentScreen({
  navigation,
  route,
}: RootScreenProps<'SignDocument'>) {
  const { kind, id, url } = route.params;
  const insets = useSafeAreaInsets();
  const finished = useRef(false);

  // Returns false to stop the web view loading the API's own "done" page.
  const watch = (next: string) => {
    if (!next.includes(DONE_PATH)) {
      return true;
    }
    if (!finished.current) {
      finished.current = true;
      const event = eventOf(next);
      const outcome = event ? OUTCOMES[event] : undefined;
      if (outcome) {
        notify[outcome.type](outcome.text);
      }
      navigation.popTo('DocumentDetail', {
        kind,
        id,
        justSigned: event === 'signing_complete',
      });
    }
    return false;
  };

  return (
    <View style={[theme.screen, { paddingBottom: insets.bottom }]}>
      <Header title="Sign document" />
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => <LoadingScreen />}
        onShouldStartLoadWithRequest={request => watch(request.url)}
        onNavigationStateChange={state => watch(state.url)}
        style={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  web: { flex: 1 },
});
