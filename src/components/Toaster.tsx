import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast, {
  type ToastConfig,
  type ToastConfigParams,
} from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './AppText';
import { colors, shadow, space } from '../theme';

const bar = {
  success: colors.primary,
  error: colors.destructive,
  info: colors.info,
} as const;

function Message({
  text1,
  type,
}: ToastConfigParams<unknown> & { type: keyof typeof bar }) {
  return (
    <View accessibilityRole="alert" style={styles.toast}>
      <View style={[styles.bar, { backgroundColor: bar[type] }]} />
      <AppText variant="smallStrong" style={styles.text}>
        {text1}
      </AppText>
    </View>
  );
}

const config: ToastConfig = {
  success: props => <Message {...props} type="success" />,
  error: props => <Message {...props} type="error" />,
  info: props => <Message {...props} type="info" />,
};

/** Renders the app's toasts in the brand style, below the status bar. Mount once, at the root. */
export default function Toaster() {
  const insets = useSafeAreaInsets();
  return <Toast config={config} topOffset={insets.top + space.xs} />;
}

export const notify = {
  success: (message: string) => Toast.show({ type: 'success', text1: message }),
  error: (message: string) =>
    Toast.show({ type: 'error', text1: message, visibilityTime: 5000 }),
  info: (message: string) => Toast.show({ type: 'info', text1: message }),
};

const styles = StyleSheet.create({
  toast: {
    width: '90%',
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.editorial,
  },
  bar: { width: 4 },
  text: { flex: 1, paddingVertical: space.md, paddingHorizontal: space.md },
});
