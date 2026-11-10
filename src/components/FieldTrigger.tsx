import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import AppText from './AppText';
import { colors, space, styles as theme } from '../theme';

type Props = {
  label: string;
  /** The chosen value as text; the placeholder shows while it is empty. */
  value?: string;
  placeholder: string;
  icon: LucideIcon;
  onPress: () => void;
  error?: string;
  disabled?: boolean;
};

/** A form field that opens a picker instead of the keyboard, styled like TextField. */
export default function FieldTrigger({
  label,
  value,
  placeholder,
  icon: Icon,
  onPress,
  error,
  disabled = false,
}: Props) {
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          theme.formInput,
          styles.trigger,
          pressed && theme.formInputFocused,
          error ? theme.formInputInvalid : null,
          disabled && styles.disabled,
        ]}
      >
        <AppText
          variant="body"
          color={value ? colors.foreground : colors.mutedForeground}
          numberOfLines={1}
          style={styles.value}
        >
          {value || placeholder}
        </AppText>
        <Icon size={20} color={colors.mutedForeground} />
      </Pressable>
      {error ? (
        <AppText variant="caption" color={colors.destructive}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.xs },
  trigger: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  value: { flex: 1, fontSize: 15, lineHeight: 20 },
  disabled: { backgroundColor: colors.muted },
});
