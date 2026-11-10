import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import { PRIVACY_POLICY_URL } from '../../config/env';
import { styles as theme } from '../../theme';

/** The privacy policy page from the website. */
export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[theme.screen, { paddingBottom: insets.bottom }]}>
      <Header title="Privacy policy" />
      <WebView
        source={{ uri: PRIVACY_POLICY_URL }}
        startInLoadingState
        renderLoading={() => <LoadingScreen />}
        style={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  web: { flex: 1 },
});
