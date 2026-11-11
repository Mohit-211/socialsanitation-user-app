import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
  text2,
  type,
  onPress,
}: ToastConfigParams<unknown> & { type: keyof typeof bar }) {
  return (
    <Pressable
      accessibilityRole="alert"
      onPress={() => onPress?.()}
      style={styles.toast}
    >
      <View style={[styles.bar, { backgroundColor: bar[type] }]} />
      <View style={styles.text}>
        <AppText variant="smallStrong">{text1}</AppText>
        {text2 ? <AppText variant="small">{text2}</AppText> : null}
      </View>
    </Pressable>
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
  /** A push that came while the app was open. A tap hides it and calls `onPress`. */
  push: (title: string, body: string | undefined, onPress: () => void) =>
    Toast.show({
      type: 'info',
      text1: title,
      text2: body,
      visibilityTime: 6000,
      onPress: () => {
        Toast.hide();
        onPress();
      },
    }),
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
  text: {
    flex: 1,
    gap: space.xxs,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
  },
});
