import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import AppText from './AppText';
import { colors, layout, space } from '../theme';

type Variant = 'primary' | 'outline' | 'ghost' | 'destructive';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

const look: Record<
  Variant,
  { background: string; border: string; text: string; pressed: string }
> = {
  // The site's call to action: square, green, bold dark text
  primary: {
    background: colors.primary,
    border: colors.primary,
    text: colors.primaryForeground,
    pressed: colors.primaryPressed,
  },
  outline: {
    background: colors.background,
    border: colors.border,
    text: colors.foreground,
    pressed: colors.muted,
  },
  ghost: {
    background: 'transparent',
    border: 'transparent',
    text: colors.foreground,
    pressed: colors.muted,
  },
  destructive: {
    background: colors.dangerWash,
    border: colors.dangerWash,
    text: colors.dangerText,
    pressed: colors.dangerWashPressed,
  },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon: Icon,
  loading = false,
  disabled = false,
  compact = false,
  style,
}: Props) {
  const v = look[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => onPress()}
      style={({ pressed }) => [
        styles.base,
        compact ? styles.compact : styles.full,
        {
          backgroundColor: pressed ? v.pressed : v.background,
          borderColor: v.border,
        },
        inactive && styles.inactive,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.row}>
          {Icon ? <Icon size={18} color={v.text} strokeWidth={2.25} /> : null}
          <AppText variant="button" color={v.text}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  full: { minHeight: layout.buttonHeight, paddingHorizontal: 28 },
  compact: { minHeight: layout.touch, paddingHorizontal: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  inactive: { opacity: 0.5 },
});
