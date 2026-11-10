import React from 'react';
import {
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, styles as theme } from '../theme';

type Props = {
  children: React.ReactNode;
  /** A Header. Without one, the screen pads for the status bar itself. */
  header?: React.ReactNode;
  /** Wraps the content in a scroll view with the side gutter. Off for screens built on a list. */
  scroll?: boolean;
  /** Pinned under the content, above the keyboard, such as a form's main button. */
  footer?: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Tab screens sit above the tab bar, which already pads for the home indicator. */
  inTabs?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/** The frame every screen sits in: background, safe areas, scrolling, and keyboard avoidance. */
export default function Screen({
  children,
  header,
  scroll = true,
  footer,
  refreshing = false,
  onRefresh,
  inTabs = false,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottom = inTabs ? 0 : insets.bottom;
  return (
    <View style={theme.screen}>
      {header ?? <View style={{ height: insets.top }} />}
      {/* Android draws edge to edge, so the window no longer resizes for the keyboard on either platform. */}
      <KeyboardAvoidingView behavior="padding" style={styles.fill}>
        {scroll ? (
          <ScrollView
            style={styles.fill}
            contentContainerStyle={[
              styles.content,
              !footer && { paddingBottom: space.xl + bottom },
              contentStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.foreground}
                  colors={[colors.foreground]}
                />
              ) : undefined
            }
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fill, contentStyle]}>{children}</View>
        )}
        {footer ? (
          <View style={[styles.footer, { paddingBottom: space.md + bottom }]}>
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
    gap: space.lg,
  },
  footer: {
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
